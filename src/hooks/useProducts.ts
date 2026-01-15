import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  stock_quantity: number;
  total_sold: number;
  image: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    fetchProducts();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [payload.new as Product, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev => 
              prev.map(p => p.id === payload.new.id ? payload.new as Product : p)
            );
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  const addProduct = async (product: {
    name: string;
    category: string;
    price: number;
    stock_quantity: number;
    description?: string;
    image?: string;
  }) => {
    if (!user) {
      toast.error('You must be logged in to add products');
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert({
          name: product.name.toUpperCase(),
          category: product.category,
          price: product.price,
          stock_quantity: product.stock_quantity,
          description: product.description || null,
          image: product.image || '📦',
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      toast.success('Product added successfully!');
      return data;
    } catch (err: any) {
      console.error('Error adding product:', err);
      toast.error(err.message || 'Failed to add product');
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;
      
      toast.success('Product updated successfully!');
      return true;
    } catch (err: any) {
      console.error('Error updating product:', err);
      toast.error(err.message || 'Failed to update product');
      return null;
    }
  };

  const updateStock = async (id: string, newQuantity: number) => {
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          stock_quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;
      
      toast.success('Stock updated successfully!');
      return true;
    } catch (err: any) {
      console.error('Error updating stock:', err);
      toast.error(err.message || 'Failed to update stock');
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      toast.success('Product deleted successfully!');
      return true;
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast.error(err.message || 'Failed to delete product');
      return false;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    updateStock,
    deleteProduct,
  };
}
