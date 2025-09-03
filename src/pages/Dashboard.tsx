import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/school-supplies-hero.jpg";

const recentActivity = [
  { id: 1, action: "New stock added", item: "Premium Notebooks", time: "2 minutes ago", type: "stock" },
  { id: 2, action: "Sale completed", item: "Art Supply Bundle", time: "5 minutes ago", type: "sale" },
  { id: 3, action: "Low stock alert", item: "Blue Pens", time: "1 hour ago", type: "alert" },
  { id: 4, action: "User login", item: "Staff Member - Sarah", time: "2 hours ago", type: "user" }
];

const topProducts = [
  { name: "Spiral Notebooks", sales: 156, revenue: "₱1,248", trend: "+12%" },
  { name: "Ballpoint Pens", sales: 89, revenue: "₱267", trend: "+8%" },
  { name: "Colored Pencils", sales: 67, revenue: "₱402", trend: "+15%" },
  { name: "Erasers", sales: 45, revenue: "₱90", trend: "+3%" }
];

export default function Dashboard() {
  const { t } = useLanguage();
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
          <p className="text-white/90 mb-6">
            {t('welcomeDesc')}
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Plus className="mr-2 h-4 w-4" />
              {t('addProduct')}
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t('quickSale')}
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
          <img 
            src={heroImage} 
            alt="School supplies" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Stats */}
      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('recentActivity')}
            </CardTitle>
            <CardDescription>Latest updates from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={activity.type === 'alert' ? 'destructive' : 'secondary'}
                      className="mb-1"
                    >
                      {activity.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-secondary" />
              {t('topProducts')}
            </CardTitle>
            <CardDescription>Best performing items this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{product.revenue}</p>
                    <p className="text-xs text-success">{product.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}