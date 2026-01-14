import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Product = Tables<'products'>;
export type ProductInsert = TablesInsert<'products'>;
export type ProductUpdate = TablesUpdate<'products'>;

export function useProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch on any change
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchProducts]);

  const addProduct = async (product: Omit<ProductInsert, 'user_id'>) => {
    if (!user) {
      toast.error('You must be logged in to add products');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Product added successfully!');
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to add product');
      return null;
    }
  };

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    if (!user) {
      toast.error('You must be logged in to update products');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update product');
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete products');
      return false;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Product deleted successfully!');
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
      return false;
    }
  };

  const updateStock = async (id: string, change: number) => {
    if (!user) {
      toast.error('You must be logged in to update stock');
      return null;
    }

    const product = products.find(p => p.id === id);
    if (!product) {
      toast.error('Product not found');
      return null;
    }

    const newStock = Math.max(0, product.available_stock + change);

    try {
      const { data, error } = await supabase
        .from('products')
        .update({ 
          available_stock: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      // Optimistically update local state
      setProducts(prev => 
        prev.map(p => p.id === id ? { ...p, available_stock: newStock } : p)
      );
      
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update stock');
      return null;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
  };
}
