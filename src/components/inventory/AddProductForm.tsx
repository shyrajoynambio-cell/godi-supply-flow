import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Constants } from "@/integrations/supabase/types";

interface AddProductFormProps {
  onClose: () => void;
  onAdd: (product: {
    name: string;
    category: "Notebooks" | "Writing" | "Art Supplies" | "Paper" | "Accessories";
    price: number;
    max_stock: number;
    min_stock: number;
    available_stock: number;
    image?: string;
    supplier?: string;
  }) => Promise<any>;
}

const CATEGORIES = Constants.public.Enums.product_category;

const EMOJI_OPTIONS = ["📦", "📓", "🖊️", "✏️", "📏", "🖍️", "📎", "✂️", "📐", "🗂️", "📋", "🎨"];

export function AddProductForm({ onClose, onAdd }: AddProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "" as "Notebooks" | "Writing" | "Art Supplies" | "Paper" | "Accessories" | "",
    price: "",
    maxStock: "",
    minStock: "",
    image: "📦",
    supplier: "",
  });

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      toast.error("Please enter product name");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.price.trim() || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!formData.maxStock.trim() || isNaN(Number(formData.maxStock)) || Number(formData.maxStock) <= 0) {
      toast.error("Please enter valid maximum stock");
      return;
    }
    if (!formData.minStock.trim() || isNaN(Number(formData.minStock)) || Number(formData.minStock) < 0) {
      toast.error("Please enter valid minimum stock");
      return;
    }

    setLoading(true);
    
    const result = await onAdd({
      name: formData.name.toUpperCase(),
      category: formData.category as "Notebooks" | "Writing" | "Art Supplies" | "Paper" | "Accessories",
      price: parseFloat(formData.price),
      max_stock: parseInt(formData.maxStock),
      min_stock: parseInt(formData.minStock),
      available_stock: parseInt(formData.maxStock), // Start with max stock
      image: formData.image,
      supplier: formData.supplier || undefined,
    });
    
    setLoading(false);
    
    if (result) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-card shadow-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Add New Product</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Image Selector */}
            <div className="space-y-2">
              <Label>Product Icon</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <Button
                    key={emoji}
                    type="button"
                    variant={formData.image === emoji ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                    className="h-10 w-10 text-lg p-0"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input 
                id="name"
                placeholder="e.g., SPIRAL NOTEBOOK" 
                className="h-11" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
                disabled={loading}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (₱) *</Label>
              <Input 
                id="price"
                placeholder="e.g., 80.00" 
                className="h-11" 
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                disabled={loading}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxStock">Maximum Stock *</Label>
                <Input 
                  id="maxStock"
                  placeholder="e.g., 100" 
                  className="h-11" 
                  type="number"
                  min="1"
                  value={formData.maxStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxStock: e.target.value }))}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock *</Label>
                <Input 
                  id="minStock"
                  placeholder="e.g., 10" 
                  className="h-11" 
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier (Optional)</Label>
              <Input 
                id="supplier"
                placeholder="e.g., ABC Supplies" 
                className="h-11" 
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                disabled={loading}
              />
            </div>
          </div>

          {/* Steps Guide */}
          <div className="mt-6 p-4 bg-accent-light rounded-lg">
            <h3 className="font-bold mb-2 text-sm">TIPS:</h3>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Choose an icon to represent your product.</li>
              <li>• Product name will be automatically converted to uppercase.</li>
              <li>• Set maximum stock based on your storage capacity.</li>
              <li>• Minimum stock triggers low-stock alerts.</li>
            </ul>
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
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
