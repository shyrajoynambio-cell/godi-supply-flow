import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Settings, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStore } from "@/contexts/StoreContext";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay";

export function MainLayout() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStoreSettings, setShowStoreSettings] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempStoreName, setTempStoreName] = useState('');
  const [tempStoreAddress, setTempStoreAddress] = useState('');
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useLanguage();
  const { storeName, storeAddress, setStoreName, setStoreAddress } = useStore();

  const handleEditStore = () => {
    setTempStoreName(storeName);
    setTempStoreAddress(storeAddress);
    setShowStoreSettings(true);
  };

  const handleSaveStore = () => {
    setStoreName(tempStoreName);
    setStoreAddress(tempStoreAddress);
    setShowStoreSettings(false);
  };

  const navigation = [
    { name: "Overview", href: "/" },
    { name: "Inventory", href: "/inventory" },
    { name: "Stats", href: "/reports" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Store Logo and Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">📦</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg">{storeName}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditStore}
                  className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 p-1"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/80">📍 {storeAddress}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = currentPath === item.href || 
                              (item.href === "/" && currentPath === "/dashboard");
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium transition-all",
                    isActive
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Settings Dropdown */}
        {showSettings && (
          <div className="absolute right-6 top-20 bg-white rounded-lg shadow-xl border border-border p-4 z-50 min-w-[200px]">
            <p className="text-sm font-medium mb-2">Settings</p>
            <p className="text-xs text-muted-foreground">Settings panel coming soon!</p>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="relative">
        <Outlet />
        
        {/* Neko Cat Mascot - Tutorial Trigger */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowTutorial(true)}
            className="w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            title="Click for tutorial"
          >
            <div className="text-3xl group-hover:scale-110 transition-transform">🐱</div>
          </button>
        </div>
      </main>

      {/* Store Settings Modal */}
      {showStoreSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full bg-white shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 text-center">Store Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Store Name</label>
                  <Input
                    value={tempStoreName}
                    onChange={(e) => setTempStoreName(e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Store Address</label>
                  <Input
                    value={tempStoreAddress}
                    onChange={(e) => setTempStoreAddress(e.target.value)}
                    placeholder="Enter store address"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowStoreSettings(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleSaveStore}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}