import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const salesData = [
  { month: "Jan", sales: 12400, items: 1240 },
  { month: "Feb", sales: 15600, items: 1560 },
  { month: "Mar", sales: 11800, items: 1180 },
  { month: "Apr", sales: 18200, items: 1820 },
  { month: "May", sales: 21500, items: 2150 },
  { month: "Jun", sales: 19800, items: 1980 }
];

const topCategories = [
  { category: "Writing Supplies", percentage: 35, revenue: "$8,450", color: "primary" },
  { category: "Notebooks", percentage: 28, revenue: "$6,720", color: "secondary" }, 
  { category: "Art Supplies", percentage: 22, revenue: "$5,280", color: "accent" },
  { category: "Paper Products", percentage: 15, revenue: "$3,600", color: "warning" }
];

const supplierPerformance = [
  { supplier: "SchoolMax", orders: 45, onTime: 98, rating: 4.8 },
  { supplier: "EduSupplies", orders: 32, onTime: 95, rating: 4.6 },
  { supplier: "PaperWorld", orders: 28, onTime: 89, rating: 4.2 },
  { supplier: "ArtCraft", orders: 19, onTime: 92, rating: 4.4 }
];

export default function Reports() {
  const [timePeriod, setTimePeriod] = useState("6months");

  const handleExport = () => {
    toast.success("Exporting report data...");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Insights into your business performance</p>
        </div>
        <div className="flex gap-3">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">$89,250</p>
                <p className="text-sm text-success">+12.5% from last period</p>
              </div>
              <div className="p-3 bg-primary-light rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                <p className="text-2xl font-bold">8,930</p>
                <p className="text-sm text-success">+8.3% from last period</p>
              </div>
              <div className="p-3 bg-secondary-light rounded-lg">
                <ShoppingCart className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                <p className="text-2xl font-bold">$9.99</p>
                <p className="text-sm text-success">+3.8% from last period</p>
              </div>
              <div className="p-3 bg-accent-light rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Turnover</p>
                <p className="text-2xl font-bold">2.4x</p>
                <p className="text-sm text-warning">-2.1% from last period</p>
              </div>
              <div className="p-3 bg-warning-light rounded-lg">
                <Package className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Trend */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.map((data) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-sm font-medium">{data.month}</span>
                    <div className="flex-1 bg-muted rounded-full h-2 w-32">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(data.sales / 25000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${data.sales.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{data.items} items</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-muted-foreground">{category.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={`bg-${category.color} h-2 rounded-full transition-all`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{category.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Performance */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Supplier Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Supplier</th>
                  <th className="text-left p-3 font-medium">Orders</th>
                  <th className="text-left p-3 font-medium">On-Time Delivery</th>
                  <th className="text-left p-3 font-medium">Rating</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supplierPerformance.map((supplier) => (
                  <tr key={supplier.supplier} className="border-b hover:bg-muted/30">
                    <td className="p-3">
                      <div className="font-medium">{supplier.supplier}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold">{supplier.orders}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2 w-20">
                          <div 
                            className="bg-success h-2 rounded-full"
                            style={{ width: `${supplier.onTime}%` }}
                          />
                        </div>
                        <span className="text-sm">{supplier.onTime}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {"⭐".repeat(Math.floor(supplier.rating))}
                        <span className="text-sm ml-1">{supplier.rating}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}