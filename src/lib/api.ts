import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = 'https://fuhazpfvpayiqmhsjvqw.supabase.co/functions/v1';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };
}

// Products API
export const productsApi = {
  async getAll(category?: string, search?: string) {
    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    
    const { data, error } = await supabase.functions.invoke('products', {
      method: 'GET',
      headers,
    });
    
    if (error) throw error;
    return data;
  },

  async getOne(id: string) {
    const headers = await getAuthHeaders();
    const { data, error } = await supabase.functions.invoke(`products/${id}`, {
      method: 'GET',
      headers,
    });
    
    if (error) throw error;
    return data;
  },

  async create(product: any) {
    const headers = await getAuthHeaders();
    const { data, error } = await supabase.functions.invoke('products', {
      method: 'POST',
      headers,
      body: product,
    });
    
    if (error) throw error;
    return data;
  },

  async update(id: string, product: any) {
    const headers = await getAuthHeaders();
    const { data, error } = await supabase.functions.invoke(`products/${id}`, {
      method: 'PUT',
      headers,
      body: product,
    });
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const headers = await getAuthHeaders();
    const { data, error } = await supabase.functions.invoke(`products/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    if (error) throw error;
    return data;
  },
};

// Sales API
export const salesApi = {
  async getAll(startDate?: string, endDate?: string) {
    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const { data, error } = await supabase.functions.invoke('sales', {
      method: 'GET',
      headers,
    });
    
    if (error) throw error;
    return data;
  },

  async create(sale: { items: any[]; payment_method?: string }) {
    const headers = await getAuthHeaders();
    const { data, error } = await supabase.functions.invoke('sales', {
      method: 'POST',
      headers,
      body: sale,
    });
    
    if (error) throw error;
    return data;
  },
};

// Dashboard Stats API
export const dashboardApi = {
  async getStats() {
    const headers = await getAuthHeaders();
    const { data, error } = await supabase.functions.invoke('dashboard-stats', {
      method: 'GET',
      headers,
    });
    
    if (error) throw error;
    return data;
  },
};
