import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  totalSold: number;
  totalRevenue: number;
  lowStockCount: number;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock_quantity: number;
    image: string | null;
  }>;
  topSellingProducts: Array<{
    id: string;
    name: string;
    total_sold: number;
    image: string | null;
  }>;
}

const LOW_STOCK_THRESHOLD = 10;

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalStock: 0,
    totalSold: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    lowStockProducts: [],
    topSellingProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, stock_quantity, total_sold, image, price');

      if (productsError) throw productsError;

      // Fetch all sales for revenue calculation
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('quantity_sold, sale_price');

      if (salesError) throw salesError;

      const productsList = products || [];
      const salesList = sales || [];

      // Calculate statistics
      const totalProducts = productsList.length;
      const totalStock = productsList.reduce((sum, p) => sum + p.stock_quantity, 0);
      const totalSold = productsList.reduce((sum, p) => sum + (p.total_sold || 0), 0);
      const totalRevenue = salesList.reduce((sum, s) => sum + (s.quantity_sold * s.sale_price), 0);

      // Low stock products
      const lowStockProducts = productsList
        .filter(p => p.stock_quantity <= LOW_STOCK_THRESHOLD && p.stock_quantity > 0)
        .sort((a, b) => a.stock_quantity - b.stock_quantity)
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          stock_quantity: p.stock_quantity,
          image: p.image,
        }));

      // Top selling products
      const topSellingProducts = [...productsList]
        .filter(p => (p.total_sold || 0) > 0)
        .sort((a, b) => (b.total_sold || 0) - (a.total_sold || 0))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          total_sold: p.total_sold || 0,
          image: p.image,
        }));

      setStats({
        totalProducts,
        totalStock,
        totalSold,
        totalRevenue,
        lowStockCount: productsList.filter(p => p.stock_quantity <= LOW_STOCK_THRESHOLD).length,
        lowStockProducts,
        topSellingProducts,
      });
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    fetchStats();

    // Subscribe to products changes
    const productsChannel = supabase
      .channel('dashboard-products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => fetchStats()
      )
      .subscribe();

    // Subscribe to sales changes
    const salesChannel = supabase
      .channel('dashboard-sales')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sales' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(salesChannel);
    };
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
