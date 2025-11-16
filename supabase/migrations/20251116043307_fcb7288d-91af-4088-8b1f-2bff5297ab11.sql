-- Create enum for product categories
CREATE TYPE product_category AS ENUM (
  'Notebooks',
  'Writing', 
  'Art Supplies',
  'Paper',
  'Accessories'
);

-- Create enum for stock status
CREATE TYPE stock_status AS ENUM (
  'in_stock',
  'low_stock',
  'overstock',
  'out_of_stock'
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category product_category NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  available_stock INTEGER NOT NULL DEFAULT 0 CHECK (available_stock >= 0),
  max_stock INTEGER NOT NULL CHECK (max_stock > 0),
  min_stock INTEGER NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  image TEXT DEFAULT '📦',
  supplier TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  payment_method TEXT,
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create transactions table for grouped sales
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(10, 2) NOT NULL CHECK (tax >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  payment_method TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products table
CREATE POLICY "Users can view their own products"
  ON public.products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for sales table
CREATE POLICY "Users can view their own sales"
  ON public.sales FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sales"
  ON public.sales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transactions table
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_sales_user_id ON public.sales(user_id);
CREATE INDEX idx_sales_product_id ON public.sales(product_id);
CREATE INDEX idx_sales_transaction_date ON public.sales(transaction_date);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- Create trigger for updating updated_at on products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get stock status
CREATE OR REPLACE FUNCTION get_stock_status(
  available INTEGER,
  min_stock INTEGER,
  max_stock INTEGER
)
RETURNS stock_status
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF available <= 0 THEN
    RETURN 'out_of_stock'::stock_status;
  ELSIF available > max_stock THEN
    RETURN 'overstock'::stock_status;
  ELSIF available <= min_stock THEN
    RETURN 'low_stock'::stock_status;
  ELSE
    RETURN 'in_stock'::stock_status;
  END IF;
END;
$$;