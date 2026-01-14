import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, Loader2 } from "lucide-react";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
  onUpdateStock: (id: string, change: number) => Promise<any>;
  onDelete: (id: string) => Promise<boolean>;
}

export function ProductCard({ product, onUpdateStock, onDelete }: ProductCardProps) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getStockStatus = () => {
    if (product.available_stock <= 0) {
      return { status: 'out_of_stock', color: 'destructive', label: '❌ OUT OF STOCK' };
    } else if (product.available_stock > product.max_stock) {
      return { status: 'overstock', color: 'warning', label: '⚠️ OVERSTOCK' };
    } else if (product.available_stock <= product.min_stock) {
      return { status: 'low_stock', color: 'destructive', label: '⚠️ LOW STOCK' };
    }
    return { status: 'in_stock', color: 'success', label: null };
  };

  const handleIncrement = async () => {
    setUpdating(true);
    await onUpdateStock(product.id, 1);
    setUpdating(false);
  };

  const handleDecrement = async () => {
    if (product.available_stock <= 0) return;
    setUpdating(true);
    await onUpdateStock(product.id, -1);
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setDeleting(true);
      await onDelete(product.id);
      setDeleting(false);
    }
  };

  const stockStatus = getStockStatus();

  const formatPrice = (price: number) => {
    return `₱ ${price.toFixed(2)}`;
  };

  return (
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
            <span className="text-muted-foreground">MAX STOCK:</span>
            <span className="font-semibold">{product.max_stock}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">PRICE:</span>
            <span className="font-semibold">{formatPrice(product.price)}</span>
          </div>
          
          {/* Stock Control */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-muted-foreground">AVAILABLE:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecrement}
                disabled={updating || product.available_stock <= 0}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive disabled:opacity-50"
              >
                {updating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
              </Button>
              
              <span className={`w-12 text-center font-bold ${
                stockStatus.status === 'overstock' ? 'text-warning' : 
                stockStatus.status === 'low_stock' || stockStatus.status === 'out_of_stock' ? 'text-destructive' : 
                'text-success'
              }`}>
                {product.available_stock}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleIncrement}
                disabled={updating}
                className="h-8 w-8 p-0 hover:bg-success/10 hover:text-success hover:border-success disabled:opacity-50"
              >
                {updating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Stock Alert Details */}
          {stockStatus.status !== 'in_stock' && (
            <div className="mt-3 p-2 bg-muted/20 rounded text-xs">
              {stockStatus.status === 'overstock' ? (
                <p className="text-warning">
                  ⚠️ Stock exceeds maximum limit of {product.max_stock}
                </p>
              ) : stockStatus.status === 'out_of_stock' ? (
                <p className="text-destructive">
                  ❌ Product is out of stock
                </p>
              ) : (
                <p className="text-destructive">
                  ⚠️ Stock below minimum requirement of {product.min_stock}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
