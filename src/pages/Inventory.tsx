import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Package, Edit, Trash2, Filter, Upload, Image } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const mockInventory = [
  { 
    id: 1, 
    name: "Premium Spiral Notebooks", 
    category: "Notebooks", 
    stock: 145, 
    price: 159.99, 
    supplier: "SchoolMax",
    status: "In Stock",
    lastUpdated: "2024-01-15",
    image: "/placeholder.svg"
  },
  { 
    id: 2, 
    name: "Blue Ballpoint Pens (Pack of 10)", 
    category: "Writing", 
    stock: 23, 
    price: 79.99, 
    supplier: "PenCorp",
    status: "Low Stock",
    lastUpdated: "2024-01-14",
    image: null
  },
  { 
    id: 3, 
    name: "Colored Pencil Set (24 colors)", 
    category: "Art Supplies", 
    stock: 67, 
    price: 259.99, 
    supplier: "ArtWorld",
    status: "In Stock",
    lastUpdated: "2024-01-13",
    image: "/placeholder.svg"
  },
  { 
    id: 4, 
    name: "Graphite Pencils (Pack of 12)", 
    category: "Writing", 
    stock: 5, 
    price: 99.99, 
    supplier: "WriteTech",
    status: "Critical",
    lastUpdated: "2024-01-12",
    image: null
  },
  { 
    id: 5, 
    name: "A4 White Paper (500 sheets)", 
    category: "Paper", 
    stock: 89, 
    price: 179.99, 
    supplier: "PaperPlus",
    status: "In Stock",
    lastUpdated: "2024-01-11",
    image: "/placeholder.svg"
  }
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const { t } = useLanguage();

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStock = stockFilter === "all" || 
      (stockFilter === "low" && item.stock <= 25) ||
      (stockFilter === "critical" && item.stock <= 10) ||
      (stockFilter === "in-stock" && item.stock > 25);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "default";
      case "Low Stock": return "secondary";
      case "Critical": return "destructive";
      default: return "default";
    }
  };

  const handleImageUpload = (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to your storage service
      console.log(`Upload image for product ${productId}:`, file);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('inventoryManagement')}</h1>
          <p className="text-muted-foreground">{t('manageInventory')}</p>
        </div>
        <Button className="md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          {t('addProduct')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            {t('filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchProducts')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                <SelectItem value="Notebooks">{t('notebooks')}</SelectItem>
                <SelectItem value="Writing">{t('writing')}</SelectItem>
                <SelectItem value="Art Supplies">{t('artSupplies')}</SelectItem>
                <SelectItem value="Paper">{t('paper')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('stockLevel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStockLevels')}</SelectItem>
                <SelectItem value="in-stock">{t('inStock')}</SelectItem>
                <SelectItem value="low">{t('lowStock')}</SelectItem>
                <SelectItem value="critical">{t('critical')}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setStockFilter("all");
            }}>
              {t('clearFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="shadow-card border-0 hover:shadow-soft transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                </div>
                <Badge variant={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              
              {/* Product Image */}
              <div className="mt-4">
                {item.image ? (
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg bg-muted"
                    />
                    <div className="absolute top-2 right-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(item.id, e)}
                        />
                        <Button variant="secondary" size="sm">
                          <Upload className="h-3 w-3" />
                        </Button>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25">
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(item.id, e)}
                      />
                      <Image className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{t('uploadImage')}</span>
                    </label>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('stockLevel')}</span>
                  <span className="font-semibold">{item.stock} {t('units')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('price')}</span>
                  <span className="font-semibold">₱{item.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('supplier')}</span>
                  <span className="text-sm">{item.supplier}</span>
                </div>
                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-1 h-3 w-3" />
                    {t('edit')}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Package className="mr-1 h-3 w-3" />
                    {t('restock')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <Card className="shadow-card border-0">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('noProductsFound')}</h3>
            <p className="text-muted-foreground text-center">
              {t('tryAdjusting')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}