-- Add total_sold column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS total_sold integer NOT NULL DEFAULT 0;

-- Create sales table
CREATE TABLE IF NOT EXISTS public.sales (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_sold integer NOT NULL CHECK (quantity_sold > 0),
  sale_price numeric NOT NULL CHECK (sale_price >= 0),
  sold_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add foreign key for sold_by to users table
ALTER TABLE public.sales 
ADD CONSTRAINT sales_sold_by_fkey 
FOREIGN KEY (sold_by) REFERENCES public.users(user_id) ON DELETE SET NULL;

-- Enable RLS on sales table
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- RLS policies for sales table
CREATE POLICY "Authenticated users can view all sales"
ON public.sales FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create sales"
ON public.sales FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sold_by);

CREATE POLICY "Admins can update sales"
ON public.sales FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete sales"
ON public.sales FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Function to create a sale and update product stock/total_sold atomically
CREATE OR REPLACE FUNCTION public.create_sale(
  p_product_id uuid,
  p_quantity_sold integer,
  p_sale_price numeric,
  p_sold_by uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_stock integer;
  v_sale_id uuid;
BEGIN
  -- Lock the product row for update
  SELECT stock_quantity INTO v_current_stock
  FROM products
  WHERE id = p_product_id
  FOR UPDATE;
  
  IF v_current_stock IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;
  
  IF v_current_stock < p_quantity_sold THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_current_stock, p_quantity_sold;
  END IF;
  
  -- Update product stock and total_sold
  UPDATE products
  SET stock_quantity = stock_quantity - p_quantity_sold,
      total_sold = total_sold + p_quantity_sold,
      updated_at = now()
  WHERE id = p_product_id;
  
  -- Create sale record
  INSERT INTO sales (product_id, quantity_sold, sale_price, sold_by)
  VALUES (p_product_id, p_quantity_sold, p_sale_price, p_sold_by)
  RETURNING id INTO v_sale_id;
  
  RETURN v_sale_id;
END;
$$;

-- Create index for sales queries
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON public.sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_sold_by ON public.sales(sold_by);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales(created_at DESC);