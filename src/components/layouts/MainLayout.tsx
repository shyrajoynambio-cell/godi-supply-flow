import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay";

export function MainLayout() {
  const [showTutorial, setShowTutorial] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useLanguage();

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
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-lg">📦</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">name of store</h1>
              <p className="text-sm text-primary-foreground/80">📍 address of store</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = currentPath === item.href || 
                              (item.href === "/" && currentPath === "/dashboard");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium transition-all",
                    isActive
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                  )}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
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

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}