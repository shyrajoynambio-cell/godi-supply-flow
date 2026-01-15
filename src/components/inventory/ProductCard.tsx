import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, Package, ShoppingCart } from "lucide-react";
import type { Product } from "@/hooks/useProducts";
import { EditStockModal } from "./EditStockModal";
import { SellProductModal } from "./SellProductModal";

interface ProductCardProps {
  product: Product;
  onUpdateStock: (id: string, newQuantity: number) => Promise<any>;
  onDelete: (id: string) => Promise<boolean>;
  onSell: (productId: string, quantity: number, price: number) => Promise<any>;
}

const LOW_STOCK_THRESHOLD = 10;

export function ProductCard({ product, onUpdateStock, onDelete, onSell }: ProductCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showEditStock, setShowEditStock] = useState(false);
  const [showSell, setShowSell] = useState(false);

  const getStockStatus = () => {
    if (product.stock_quantity <= 0) {
      return { status: 'out_of_stock', color: 'destructive', label: '❌ OUT OF STOCK' };
    } else if (product.stock_quantity <= LOW_STOCK_THRESHOLD) {
      return { status: 'low_stock', color: 'destructive', label: '⚠️ LOW STOCK' };
    }
    return { status: 'in_stock', color: 'success', label: null };
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setDeleting(true);
      await onDelete(product.id);
      setDeleting(false);
    }
  };

  const handleUpdateStock = async (newQuantity: number) => {
    return await onUpdateStock(product.id, newQuantity);
  };

  const handleSell = async (quantity: number, price: number) => {
    return await onSell(product.id, quantity, price);
  };

  const stockStatus = getStockStatus();

  const formatPrice = (price: number) => {
    return `₱ ${price.toFixed(2)}`;
  };

  return (
    <>
      <Card className="bg-card shadow-lg border-0 relative overflow-hidden hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          {/* Stock Status Badge */}
          {stockStatus.label && (
            <div className="absolute top-2 right-2">
              <Badge 
                variant={stockStatus.color as any}
                className="text-xs font-bold"
              >
                {stockStatus.label}
              </Badge>
            </div>
          )}
          
          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="absolute top-2 left-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
          
          {/* Product Image & Name */}
          <div className="text-center mb-4 mt-6">
            <div className="text-4xl mb-2">{product.image || "📦"}</div>
            <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
            <Badge variant="outline" className="mt-1 text-xs">
              {product.category}
            </Badge>
          </div>
          
          {/* Product Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">PRICE:</span>
              <span className="font-semibold">{formatPrice(product.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IN STOCK:</span>
              <span className={`font-bold ${
                stockStatus.status === 'low_stock' || stockStatus.status === 'out_of_stock' 
                  ? 'text-destructive' 
                  : 'text-success'
              }`}>
                {product.stock_quantity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TOTAL SOLD:</span>
              <span className="font-semibold text-primary">{product.total_sold || 0}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditStock(true)}
              className="flex-1 h-9"
            >
              <Package className="h-4 w-4 mr-1" />
              Edit Stock
            </Button>
            <Button
              size="sm"
              onClick={() => setShowSell(true)}
              disabled={product.stock_quantity <= 0}
              className="flex-1 h-9"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Sell
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showEditStock && (
        <EditStockModal
          product={product}
          onClose={() => setShowEditStock(false)}
          onSave={handleUpdateStock}
        />
      )}

      {showSell && (
        <SellProductModal
          product={product}
          onClose={() => setShowSell(false)}
          onSell={handleSell}
        />
      )}
    </>
  );
}
