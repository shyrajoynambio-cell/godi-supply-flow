import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Sale {
  id: string;
  product_id: string;
  quantity_sold: number;
  sale_price: number;
  sold_by: string;
  created_at: string;
  product?: {
    name: string;
    image: string | null;
  };
}

export interface SalesStats {
  totalItemsSold: number;
  totalRevenue: number;
  salesCount: number;
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<SalesStats>({
    totalItemsSold: 0,
    totalRevenue: 0,
    salesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('sales')
        .select(`
          *,
          product:products(name, image)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setSales(data || []);
      
      // Calculate stats
      const salesData = data || [];
      const totalItemsSold = salesData.reduce((sum, sale) => sum + sale.quantity_sold, 0);
      const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.quantity_sold * sale.sale_price), 0);
      
      setStats({
        totalItemsSold,
        totalRevenue,
        salesCount: salesData.length,
      });
    } catch (err: any) {
      console.error('Error fetching sales:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    fetchSales();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales'
        },
        () => {
          // Refetch to get product details
          fetchSales();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSales]);

  const createSale = async (
    productId: string,
    quantitySold: number,
    salePrice: number
  ) => {
    if (!user) {
      toast.error('You must be logged in to create sales');
      return null;
    }

    try {
      // Use the database function to create sale atomically
      const { data, error: saleError } = await supabase
        .rpc('create_sale', {
          p_product_id: productId,
          p_quantity_sold: quantitySold,
          p_sale_price: salePrice,
          p_sold_by: user.id,
        });

      if (saleError) throw saleError;
      
      toast.success('Sale recorded successfully!');
      return data;
    } catch (err: any) {
      console.error('Error creating sale:', err);
      toast.error(err.message || 'Failed to record sale');
      return null;
    }
  };

  return {
    sales,
    stats,
    loading,
    error,
    fetchSales,
    createSale,
  };
}
