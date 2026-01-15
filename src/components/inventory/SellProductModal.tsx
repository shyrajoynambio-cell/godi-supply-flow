import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/hooks/useProducts";

interface SellProductModalProps {
  product: Product;
  onClose: () => void;
  onSell: (quantity: number, price: number) => Promise<any>;
}

export function SellProductModal({ product, onClose, onSell }: SellProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState(product.price.toString());

  const quantityNum = parseInt(quantity) || 0;
  const priceNum = parseFloat(price) || 0;
  const totalAmount = quantityNum * priceNum;

  const handleSubmit = async () => {
    if (quantityNum <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (quantityNum > product.stock_quantity) {
      toast.error(`Not enough stock. Available: ${product.stock_quantity}`);
      return;
    }

    if (priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);
    const result = await onSell(quantityNum, priceNum);
    setLoading(false);
    
    if (result) {
      onClose();
    }
  };

  const formatPrice = (amount: number) => {
    return `₱ ${amount.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-sm w-full bg-card shadow-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Record Sale</h2>
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
            <div className="flex-1">
              <p className="font-bold">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                Available: {product.stock_quantity} • Price: {formatPrice(product.price)}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity to Sell</Label>
              <Input 
                id="quantity"
                placeholder="Enter quantity" 
                className="h-12 text-lg text-center font-bold" 
                type="number"
                min="1"
                max={product.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Sale Price per Unit (₱)</Label>
              <Input 
                id="price"
                placeholder="Enter price" 
                className="h-12 text-lg text-center font-bold" 
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Total */}
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(totalAmount)}
                </span>
              </div>
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
              disabled={loading || quantityNum > product.stock_quantity}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Record Sale
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
