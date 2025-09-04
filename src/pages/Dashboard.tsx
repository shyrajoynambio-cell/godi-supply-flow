import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const stockAlerts = [
  { id: 1, name: "SPIRAL NOTEBOOK", stock: 6, image: "📓" },
  { id: 2, name: "PANDA BALLPEN - BLACK", stock: 10, image: "🖊️" },
  { id: 3, name: "CORRECTION TAPE", stock: 8, image: "📏" },
];

const salesData = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 15000 },
  { month: "Mar", sales: 11000 },
  { month: "Apr", sales: 8000 },
  { month: "May", sales: 18000 },
  { month: "Jun", sales: 25000 },
  { month: "Jul", sales: 16000 },
  { month: "Aug", sales: 14000 },
];

export default function Dashboard() {
  const { t } = useLanguage();
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-accent-light min-h-screen">
      {/* Top Row - Stock Alert and Total Stocks */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Stock Alert */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h2 className="font-bold text-lg">STOCKS ALERT</h2>
            </div>
            <div className="space-y-3">
              {stockAlerts.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <div className="text-2xl">{item.image}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-success to-warning"
                          style={{ width: `${(item.stock / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="destructive" 
                    className="bg-destructive text-destructive-foreground font-bold"
                  >
                    {item.stock}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Total Stocks */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4">TOTAL STOCKS</h2>
            <div className="text-4xl font-bold text-primary mb-2">1,632 STOCKS</div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row - Top Sales and Welcome */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Sales */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="bg-secondary text-secondary-foreground rounded-lg p-3 mb-4">
              <h3 className="font-bold text-center">TOP SALES</h3>
            </div>
            <div className="bg-muted/20 p-4 rounded-lg">
              <h4 className="font-bold text-center mb-2">SHORT BOND PAPER</h4>
              <div className="text-center">
                <div className="bg-secondary text-secondary-foreground rounded-lg p-2 mb-2">
                  <span className="text-sm font-medium">SALES FOR THE MONTH OF AUGUST</span>
                </div>
                <div className="text-3xl font-bold text-primary">₱ 16,000.00</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Message */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Welcome to G.O.D.I.</h2>
            <p className="text-muted-foreground mb-4">
              GODI system is a website that helps you in tracking your inventories. 
              This website also allows you to view your monthly sales and revenue.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Items Chart */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Items with Most, Medium, Least Sold</h3>
            <div className="h-48 flex items-end justify-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-32 bg-primary rounded-t"></div>
                <span className="text-xs mt-2">Ballpen</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-24 bg-success rounded-t"></div>
                <span className="text-xs mt-2">Pad Paper</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-16 bg-warning rounded-t"></div>
                <span className="text-xs mt-2">Calculator</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Yearly Sales */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Yearly Sales</h3>
            <div className="h-48 flex items-end justify-center gap-2">
              {salesData.map((month, index) => (
                <div key={month.month} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-primary rounded-t"
                    style={{ 
                      height: `${(month.sales / 25000) * 120 + 20}px`,
                      backgroundColor: index % 3 === 0 ? 'hsl(var(--primary))' : 
                                     index % 3 === 1 ? 'hsl(var(--success))' : 'hsl(var(--warning))'
                    }}
                  ></div>
                  <span className="text-xs mt-2 rotate-45 origin-left">{month.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}