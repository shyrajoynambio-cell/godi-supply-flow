-- Create function to update product stock when a sale is made
CREATE OR REPLACE FUNCTION public.update_product_stock(product_id uuid, quantity_sold integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET available_stock = available_stock - quantity_sold,
      updated_at = now()
  WHERE id = product_id;
END;
$$;