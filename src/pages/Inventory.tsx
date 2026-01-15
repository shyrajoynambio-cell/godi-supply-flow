import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";
import { ProductCard } from "@/components/inventory/ProductCard";
import { AddProductForm } from "@/components/inventory/AddProductForm";
import { Loader2 } from "lucide-react";

export default function Inventory() {
  const { t } = useLanguage();
  const { products, loading, addProduct, updateStock, deleteProduct } = useProducts();
  const { createSale } = useSales();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProduct = async (product: {
    name: string;
    category: "Notebooks" | "Writing" | "Art Supplies" | "Paper" | "Accessories";
    price: number;
    max_stock: number;
    min_stock: number;
    available_stock: number;
    image?: string;
    supplier?: string;
  }) => {
    // Map old interface to new Supabase structure
    return await addProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      stock_quantity: product.available_stock,
      image: product.image,
    });
  };

  const handleSell = async (productId: string, quantity: number, price: number) => {
    return await createSale(productId, quantity, price);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-accent-light min-h-screen">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onUpdateStock={updateStock}
            onDelete={deleteProduct}
            onSell={handleSell}
          />
        ))}

        {/* Add Product Card */}
        <Card 
          className="bg-card shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all group min-h-[280px]"
          onClick={() => setShowAddForm(true)}
        >
          <CardContent className="p-6 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-primary group-hover:scale-110 transition-transform">➕</div>
              <p className="mt-2 text-muted-foreground font-medium">Add New Product</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddForm && (
        <AddProductForm onClose={() => setShowAddForm(false)} onAdd={handleAddProduct} />
      )}
    </div>
  );
}
