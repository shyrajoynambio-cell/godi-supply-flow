import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Dashboard Stats API] GET request from user ${user.id}`);

    // Get total products count
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get low stock products
    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .lte('available_stock', supabase.raw('min_stock'))
      .order('available_stock', { ascending: true })
      .limit(10);

    // Get overstock products
    const { data: overstockProducts } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .gte('available_stock', supabase.raw('max_stock'))
      .order('available_stock', { ascending: false })
      .limit(10);

    // Get total stock count
    const { data: allProducts } = await supabase
      .from('products')
      .select('available_stock')
      .eq('user_id', user.id);

    const totalStock = allProducts?.reduce((sum, p) => sum + (p.available_stock || 0), 0) || 0;

    // Get sales data for the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const { data: monthSales } = await supabase
      .from('sales')
      .select('total')
      .eq('user_id', user.id)
      .gte('transaction_date', firstDayOfMonth.toISOString());

    const monthlyRevenue = monthSales?.reduce((sum, s) => sum + parseFloat(s.total), 0) || 0;

    // Get sales trend for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: recentSales } = await supabase
      .from('sales')
      .select('total, quantity, transaction_date')
      .eq('user_id', user.id)
      .gte('transaction_date', sixMonthsAgo.toISOString())
      .order('transaction_date', { ascending: true });

    // Group sales by month
    const salesByMonth = new Map<string, { sales: number; items: number }>();
    recentSales?.forEach((sale) => {
      const date = new Date(sale.transaction_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = salesByMonth.get(monthKey) || { sales: 0, items: 0 };
      salesByMonth.set(monthKey, {
        sales: existing.sales + parseFloat(sale.total),
        items: existing.items + sale.quantity,
      });
    });

    const salesTrend = Array.from(salesByMonth.entries()).map(([month, data]) => ({
      month,
      sales: data.sales,
      items: data.items,
    }));

    // Get top selling products
    const { data: topProducts } = await supabase
      .from('sales')
      .select('product_id, products(name, category), quantity')
      .eq('user_id', user.id)
      .order('quantity', { ascending: false })
      .limit(5);

    const stats = {
      totalProducts: totalProducts || 0,
      totalStock,
      lowStockProducts: lowStockProducts || [],
      overstockProducts: overstockProducts || [],
      monthlyRevenue,
      salesTrend,
      topProducts: topProducts || [],
    };

    console.log(`[Dashboard Stats API] Successfully compiled stats`);
    return new Response(
      JSON.stringify({ data: stats }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Dashboard Stats API] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
