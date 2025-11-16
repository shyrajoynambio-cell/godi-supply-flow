import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schemas
const productSchema = {
  name: (v: string) => typeof v === 'string' && v.trim().length > 0 && v.length <= 200,
  category: (v: string) => ['Notebooks', 'Writing', 'Art Supplies', 'Paper', 'Accessories'].includes(v),
  price: (v: number) => typeof v === 'number' && v >= 0 && v <= 999999.99,
  available_stock: (v: number) => typeof v === 'number' && Number.isInteger(v) && v >= 0,
  max_stock: (v: number) => typeof v === 'number' && Number.isInteger(v) && v > 0,
  min_stock: (v: number) => typeof v === 'number' && Number.isInteger(v) && v >= 0,
  image: (v: string) => typeof v === 'string' && v.length <= 500,
  supplier: (v: string | undefined) => v === undefined || (typeof v === 'string' && v.length <= 200),
};

function validateProduct(data: any, isUpdate = false): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields = isUpdate ? [] : ['name', 'category', 'price', 'max_stock'];

  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Field '${field}' is required`);
    }
  }

  for (const [field, validator] of Object.entries(productSchema)) {
    if (field in data && !validator(data[field])) {
      errors.push(`Invalid value for field '${field}'`);
    }
  }

  // Additional validation
  if ('min_stock' in data && 'max_stock' in data && data.min_stock > data.max_stock) {
    errors.push('min_stock cannot be greater than max_stock');
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

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const productId = pathParts[pathParts.length - 1];

    console.log(`[Products API] ${req.method} request from user ${user.id}`);

    // GET all products
    if (req.method === 'GET' && pathParts.length === 1) {
      const category = url.searchParams.get('category');
      const searchTerm = url.searchParams.get('search');

      let query = supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[Products API] Error fetching products:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[Products API] Successfully fetched ${data.length} products`);
      return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET single product
    if (req.method === 'GET' && pathParts.length === 2) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('[Products API] Error fetching product:', error);
        return new Response(
          JSON.stringify({ error: 'Product not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST - Create product
    if (req.method === 'POST') {
      const body = await req.json();
      const validation = validateProduct(body);

      if (!validation.valid) {
        console.error('[Products API] Validation errors:', validation.errors);
        return new Response(
          JSON.stringify({ error: 'Validation failed', details: validation.errors }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const productData = {
        ...body,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) {
        console.error('[Products API] Error creating product:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[Products API] Successfully created product ${data.id}`);
      return new Response(
        JSON.stringify({ data }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PUT/PATCH - Update product
    if ((req.method === 'PUT' || req.method === 'PATCH') && pathParts.length === 2) {
      const body = await req.json();
      const validation = validateProduct(body, true);

      if (!validation.valid) {
        console.error('[Products API] Validation errors:', validation.errors);
        return new Response(
          JSON.stringify({ error: 'Validation failed', details: validation.errors }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('products')
        .update(body)
        .eq('id', productId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('[Products API] Error updating product:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[Products API] Successfully updated product ${productId}`);
      return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE product
    if (req.method === 'DELETE' && pathParts.length === 2) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', user.id);

      if (error) {
        console.error('[Products API] Error deleting product:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[Products API] Successfully deleted product ${productId}`);
      return new Response(
        JSON.stringify({ message: 'Product deleted successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Products API] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
