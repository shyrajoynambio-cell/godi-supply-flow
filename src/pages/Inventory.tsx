import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const mockInventory = [
  {
    id: 1,
    name: "SPIRAL NOTEBOOK",
    totalStock: 20,
    price: "₱ 80.00",
    availableStock: 6,
    currentSales: "₱ 1,120.00",
    image: "📓"
  },
  {
    id: 2,
    name: "PANDA BALLPEN - BLACK",
    totalStock: 50,
    price: "₱ 10.00",
    availableStock: 10,
    currentSales: "₱ 400.00",
    image: "🖊️"
  }
];

export default function Inventory() {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-accent-light min-h-screen">
      {/* Inventory Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Existing Products */}
        {mockInventory.map((item) => (
          <Card key={item.id} className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{item.image}</div>
                <h3 className="font-bold text-lg">{item.name}</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>TOTAL STOCK:</span>
                  <span className="font-semibold">{item.totalStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>PRICE:</span>
                  <span className="font-semibold">{item.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>AVAILABLE STOCK:</span>
                  <span className="font-semibold">{item.availableStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>CURRENT SALES:</span>
                  <span className="font-semibold">{item.currentSales}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Product Card */}
        <Card 
          className="bg-white shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all group"
          onClick={() => setShowAddForm(true)}
        >
          <CardContent className="p-6 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-primary group-hover:scale-110 transition-transform">
                ➕
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full bg-white shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 text-center">Add New Product</h2>
              
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-16 border-dashed border-2 border-primary/30 text-primary hover:bg-primary/5"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  INPUT IMAGE (OPTIONAL)
                </Button>
                
                <Input placeholder="NAME OF PRODUCT" className="h-12" />
                <Input placeholder="PRICE OF PRODUCT" className="h-12" />
                <Input placeholder="MAXIMUM STOCK" className="h-12" />
                <Input placeholder="MINIMUM STOCK" className="h-12" />
              </div>

              {/* Steps Guide */}
              <div className="mt-6 p-4 bg-accent-light rounded-lg">
                <h3 className="font-bold mb-2">STEPS:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Click on input image to add image of product.</li>
                  <li>• Rename the product to its brand and type of product.</li>
                  <li>• Add the amount you paid for the product to be sold for.</li>
                  <li>• Add the maximum stock that can fit in your physical inventory.</li>
                  <li>• Add minimum stock that can notify you to stock up your inventory.</li>
                </ul>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => setShowAddForm(false)}
                >
                  Add Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
