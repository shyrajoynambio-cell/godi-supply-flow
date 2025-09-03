import { useState } from "react";
import { Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Settings,
  Menu,
  X,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPath = window.location.pathname;
  const { t, toggleLanguage, language } = useLanguage();

  const navigation = [
    { name: t('dashboard'), href: "/", icon: LayoutDashboard },
    { name: t('inventory'), href: "/inventory", icon: Package },
    { name: t('pos'), href: "/pos", icon: ShoppingCart },
    { name: t('users'), href: "/users", icon: Users },
    { name: t('reports'), href: "/reports", icon: BarChart3 },
    { name: t('settings'), href: "/settings", icon: Settings },
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-card shadow-soft">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              G.O.D.I
            </h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-8 px-4 flex-1">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl px-4 py-3 mb-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>
          
          {/* Language Toggle */}
          <div className="px-4 pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="w-full"
            >
              <Languages className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Filipino' : 'English'}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card shadow-card border-r">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              G.O.D.I
            </h1>
          </div>
          <nav className="mt-8 flex-1 px-4">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl px-4 py-3 mb-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>
          
          {/* Language Toggle */}
          <div className="px-4 pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="w-full"
            >
              <Languages className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Filipino' : 'English'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 bg-card/80 backdrop-blur-sm shadow-sm border-b lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 px-4 flex items-center">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              G.O.D.I
            </h1>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}