import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";
import { Store, Bell, Save } from "lucide-react";

export default function Settings() {
  const { storeName, storeAddress, setStoreName, setStoreAddress } = useStore();
  
  const [saving, setSaving] = useState(false);
  const [tempStoreName, setTempStoreName] = useState(storeName);
  const [tempStoreAddress, setTempStoreAddress] = useState(storeAddress);
  const [notificationSound, setNotificationSound] = useState(() => {
    const saved = localStorage.getItem('notification_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [maxProducts, setMaxProducts] = useState(() => {
    const saved = localStorage.getItem('max_products');
    return saved !== null ? parseInt(saved) : 1000;
  });

  useEffect(() => {
    setTempStoreName(storeName);
    setTempStoreAddress(storeAddress);
  }, [storeName, storeAddress]);

  const handleSaveSettings = () => {
    setSaving(true);
    
    // Update store context
    setStoreName(tempStoreName);
    setStoreAddress(tempStoreAddress);
    
    // Save preferences to localStorage
    localStorage.setItem('notification_sound', JSON.stringify(notificationSound));
    localStorage.setItem('max_products', maxProducts.toString());
    
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully!");
    }, 300);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-accent-light min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        {/* Store Settings */}
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Store Settings
            </CardTitle>
            <CardDescription>Configure your store information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={tempStoreName}
                onChange={(e) => setTempStoreName(e.target.value)}
                placeholder="Enter store name"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Store Address</Label>
              <Input
                id="storeAddress"
                value={tempStoreAddress}
                onChange={(e) => setTempStoreAddress(e.target.value)}
                placeholder="Enter store address"
                className="h-11"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Preferences */}
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Preferences
            </CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notification Sounds</Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds for alerts and notifications
                </p>
              </div>
              <Switch
                checked={notificationSound}
                onCheckedChange={setNotificationSound}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="maxProducts">Maximum Products Limit</Label>
              <Input
                id="maxProducts"
                type="number"
                value={maxProducts}
                onChange={(e) => setMaxProducts(parseInt(e.target.value) || 1000)}
                min={1}
                max={10000}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of products you can add to your inventory
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Actions */}
        <Button 
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full h-11"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
