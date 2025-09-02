import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Minus, ShoppingCart, Trash2, Receipt, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const quickAddProducts = [
  { id: 1, name: "Blue Pen", price: 19.99, category: "Writing" },
  { id: 2, name: "Notebook", price: 59.99, category: "Notebooks" },
  { id: 3, name: "Eraser", price: 9.99, category: "Accessories" },
  { id: 4, name: "Pencil", price: 15.99, category: "Writing" },
  { id: 5, name: "Ruler", price: 39.99, category: "Accessories" },
  { id: 6, name: "Colored Pencils", price: 119.99, category: "Art Supplies" }
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  const addToCart = (product: typeof quickAddProducts[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price
              }
            : item
        );
      } else {
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          total: product.price
        }];
      }
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.price
          };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const processSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before processing sale.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sale completed successfully!",
      description: `Total: ₱${total.toFixed(2)} - Receipt printed`,
    });
    
    clearCart();
  };

  const filteredProducts = quickAddProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">{t('pointOfSale')}</h1>
            <p className="text-muted-foreground">{t('quickCheckout')}</p>
          </div>

          {/* Search */}
          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('searchProducts')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Add Products */}
          <Card className="shadow-card border-0">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {t('quickAddProducts')}
            </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:shadow-soft transition-shadow border border-border/50"
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                        <Badge variant="outline" className="mb-2 text-xs">
                          {product.category}
                        </Badge>
                        <p className="text-lg font-bold text-primary">₱{product.price}</p>
                        <Button size="sm" className="mt-2 w-full">
                          <Plus className="mr-1 h-3 w-3" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shopping Cart */}
        <div className="space-y-6">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-secondary" />
                  {t('cart')} ({cart.length})
                </span>
                {cart.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Add products to get started</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">₱{item.price} {t('each')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right ml-3">
                          <p className="font-semibold text-sm">₱{item.total.toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('subtotal')}:</span>
                      <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('tax')}:</span>
                      <span>₱{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>{t('total')}:</span>
                      <span>₱{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button 
                      className="w-full" 
                      onClick={processSale}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t('processPayment')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast({
                        title: "Receipt printed",
                        description: "Customer receipt has been printed"
                      })}
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      {t('printReceipt')}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}