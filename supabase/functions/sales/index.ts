import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation for sale/transaction
const saleItemSchema = {
  product_id: (v: string) => typeof v === 'string' && v.trim().length > 0,
  quantity: (v: number) => typeof v === 'number' && Number.isInteger(v) && v > 0 && v <= 10000,
  unit_price: (v: number) => typeof v === 'number' && v >= 0 && v <= 999999.99,
};

function validateSaleItem(item: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [field, validator] of Object.entries(saleItemSchema)) {
    if (!(field in item)) {
      errors.push(`Field '${field}' is required in sale item`);
    } else if (!validator(item[field])) {
      errors.push(`Invalid value for field '${field}' in sale item`);
    }
  }

  return { valid: errors.length === 0, errors };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    console.log(`[Sales API] ${req.method} request from user ${user.id}`);

    // GET sales/transactions
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const startDate = url.searchParams.get('start_date');
      const endDate = url.searchParams.get('end_date');

      let query = supabase
        .from('sales')
        .select('*, products(name, category)')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });

      if (startDate) {
        query = query.gte('transaction_date', startDate);
      }
      if (endDate) {
        query = query.lte('transaction_date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[Sales API] Error fetching sales:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[Sales API] Successfully fetched ${data.length} sales`);
      return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST - Create sale transaction
    if (req.method === 'POST') {
      const body = await req.json();
      
      // Validate request body
      if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid request: items array is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate each item
      const validationErrors: string[] = [];
      for (let i = 0; i < body.items.length; i++) {
        const validation = validateSaleItem(body.items[i]);
        if (!validation.valid) {
          validationErrors.push(`Item ${i + 1}: ${validation.errors.join(', ')}`);
        }
      }

      if (validationErrors.length > 0) {
        console.error('[Sales API] Validation errors:', validationErrors);
        return new Response(
          JSON.stringify({ error: 'Validation failed', details: validationErrors }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const TAX_RATE = 0.08; // 8% tax
      let subtotal = 0;

      // Calculate totals and prepare sales records
      const salesRecords = body.items.map((item: any) => {
        const itemSubtotal = item.quantity * item.unit_price;
        const itemTax = itemSubtotal * TAX_RATE;
        const itemTotal = itemSubtotal + itemTax;
        subtotal += itemSubtotal;

        return {
          user_id: user.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: itemSubtotal,
          tax: itemTax,
          total: itemTotal,
          payment_method: body.payment_method || 'cash',
        };
      });

      const tax = subtotal * TAX_RATE;
      const total = subtotal + tax;

      // Create transaction record
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          subtotal,
          tax,
          total,
          payment_method: body.payment_method || 'cash',
          status: 'completed',
        })
        .select()
        .single();

      if (transactionError) {
        console.error('[Sales API] Error creating transaction:', transactionError);
        return new Response(
          JSON.stringify({ error: transactionError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Insert sales records
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .insert(salesRecords)
        .select();

      if (salesError) {
        console.error('[Sales API] Error creating sales:', salesError);
        // Try to cleanup transaction if sales insert failed
        await supabase.from('transactions').delete().eq('id', transactionData.id);
        return new Response(
          JSON.stringify({ error: salesError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update product stock levels
      for (const item of body.items) {
        const { error: updateError } = await supabase.rpc('update_product_stock', {
          product_id: item.product_id,
          quantity_sold: item.quantity,
        });

        if (updateError) {
          console.warn(`[Sales API] Warning: Could not update stock for product ${item.product_id}:`, updateError);
        }
      }

      console.log(`[Sales API] Successfully created transaction ${transactionData.id} with ${salesData.length} items`);
      return new Response(
        JSON.stringify({ 
          data: { 
            transaction: transactionData, 
            sales: salesData 
          } 
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Sales API] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
