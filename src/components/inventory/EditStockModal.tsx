import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, Package } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/hooks/useProducts";

interface EditStockModalProps {
  product: Product;
  onClose: () => void;
  onSave: (newQuantity: number) => Promise<any>;
}

export function EditStockModal({ product, onClose, onSave }: EditStockModalProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(product.stock_quantity.toString());

  const handleSubmit = async () => {
    const newQuantity = parseInt(quantity);
    
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast.error("Please enter a valid quantity (0 or greater)");
      return;
    }

    setLoading(true);
    const result = await onSave(newQuantity);
    setLoading(false);
    
    if (result) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-sm w-full bg-card shadow-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Edit Stock</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Product Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg mb-4">
            <div className="text-3xl">{product.image || "📦"}</div>
            <div>
              <p className="font-bold">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                Current stock: {product.stock_quantity}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">New Stock Quantity</Label>
              <Input 
                id="quantity"
                placeholder="Enter total stock quantity" 
                className="h-12 text-lg text-center font-bold" 
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                Enter the total stock quantity (not the change)
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1 h-11"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-11"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Update Stock
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
