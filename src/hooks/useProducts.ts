import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  category: "Notebooks" | "Writing" | "Art Supplies" | "Paper" | "Accessories";
  price: number;
  available_stock: number;
  max_stock: number;
  min_stock: number;
  image: string | null;
  supplier: string | null;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'godi_products';

const getInitialProducts = (): Product[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  // Default sample products
  return [
    {
      id: crypto.randomUUID(),
      name: "SPIRAL NOTEBOOK",
      category: "Notebooks",
      price: 80.00,
      available_stock: 6,
      max_stock: 25,
      min_stock: 5,
      image: "📓",
      supplier: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "PANDA BALLPEN - BLACK",
      category: "Writing",
      price: 10.00,
      available_stock: 10,
      max_stock: 45,
      min_stock: 8,
      image: "🖊️",
      supplier: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "COLORED PENCILS",
      category: "Art Supplies",
      price: 120.00,
      available_stock: 35,
      max_stock: 30,
      min_stock: 10,
      image: "🖍️",
      supplier: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(getInitialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const fetchProducts = useCallback(async () => {
    // Products are already loaded from localStorage
    setLoading(false);
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProduct: Product = {
        ...product,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Product added successfully!');
      return newProduct;
    } catch (err: any) {
      toast.error(err.message || 'Failed to add product');
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setProducts(prev => 
        prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p)
      );
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update product');
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully!');
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
      return false;
    }
  };

  const updateStock = async (id: string, change: number) => {
    const product = products.find(p => p.id === id);
    if (!product) {
      toast.error('Product not found');
      return null;
    }

    const newStock = Math.max(0, product.available_stock + change);

    setProducts(prev => 
      prev.map(p => p.id === id ? { 
        ...p, 
        available_stock: newStock,
        updated_at: new Date().toISOString(),
      } : p)
    );
    
    return { ...product, available_stock: newStock };
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
