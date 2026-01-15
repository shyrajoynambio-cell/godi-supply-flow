import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function Dashboard() {
  const { t } = useLanguage();
  const { stats, loading } = useDashboardStats();

  const formatCurrency = (amount: number) => {
    return `₱ ${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-card shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Stock</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalStock.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-full">
                <Package className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Items Sold</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalSold.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-secondary/30 rounded-full">
                <TrendingUp className="h-6 w-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Row - Stock Alert and Top Sellers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Stock Alert */}
        <Card className="bg-card shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h2 className="font-bold text-lg">LOW STOCK ALERT</h2>
              <Badge variant="destructive" className="ml-auto">
                {stats.lowStockCount}
              </Badge>
            </div>
            {stats.lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {stats.lowStockProducts.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="text-2xl">{item.image || "📦"}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-destructive to-warning"
                            style={{ width: `${Math.min((item.stock_quantity / 20) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="destructive" 
                      className="bg-destructive text-destructive-foreground font-bold"
                    >
                      {item.stock_quantity}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>All products are well stocked!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Sellers */}
        <Card className="bg-card shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-success" />
              <h2 className="font-bold text-lg">TOP SELLING PRODUCTS</h2>
            </div>
            {stats.topSellingProducts.length > 0 ? (
              <div className="space-y-3">
                {stats.topSellingProducts.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="text-2xl">{item.image || "📦"}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="font-bold"
                    >
                      {item.total_sold} sold
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No sales recorded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="bg-card shadow-lg border-0">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Welcome to G.O.D.I.</h2>
          <p className="text-muted-foreground mb-4">
            GODI system is a website that helps you in tracking your inventories. 
            This website also allows you to view your monthly sales and revenue.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-primary/5 rounded-lg text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Manage Products</p>
              <p className="text-xs text-muted-foreground">Add, edit, and track inventory</p>
            </div>
            <div className="p-4 bg-success/5 rounded-lg text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="font-medium">Record Sales</p>
              <p className="text-xs text-muted-foreground">Track all your transactions</p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-secondary-foreground" />
              <p className="font-medium">View Reports</p>
              <p className="text-xs text-muted-foreground">Analyze your business performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
