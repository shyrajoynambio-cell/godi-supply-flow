import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Package, AlertTriangle, DollarSign, Users } from "lucide-react";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { useEffect } from "react";

const stats = [
  {
    title: "Total Products",
    value: "1,247", 
    change: "+12%",
    trend: "up" as const,
    icon: Package,
    color: "primary" as const
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "-5%", 
    trend: "down" as const,
    icon: AlertTriangle,
    color: "warning" as const
  },
  {
    title: "Daily Revenue",
    value: "₱2,847",
    change: "+18%",
    trend: "up" as const,
    icon: DollarSign,
    color: "success" as const
  },
  {
    title: "Active Users",
    value: "156",
    change: "+7%",
    trend: "up" as const,
    icon: Users,
    color: "secondary" as const
  }
];

export function DashboardStats() {
  const { playNotificationSound } = useNotificationSound();
  
  useEffect(() => {
    // Check for critical stock items and play sound
    const criticalItems = stats.find(stat => stat.title === "Low Stock Items")?.value;
    if (criticalItems && parseInt(criticalItems.toString()) > 0) {
      playNotificationSound();
    }
  }, [playNotificationSound]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-${stat.color}-light`}>
              <stat.icon className={`h-4 w-4 text-${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stat.trend === "up" ? (
                <TrendingUp className="mr-1 h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
              )}
              <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                {stat.change}
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}