import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, User, Store, Bell, Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  display_name: string | null;
  email: string | null;
  notification_sound: boolean | null;
  max_products: number | null;
}

export default function Settings() {
  const { user, signOut } = useAuth();
  const { storeName, storeAddress, setStoreName, setStoreAddress } = useStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    display_name: "",
    email: "",
    notification_sound: true,
    max_products: 1000,
  });
  
  const [tempStoreName, setTempStoreName] = useState(storeName);
  const [tempStoreAddress, setTempStoreAddress] = useState(storeAddress);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, email, notification_sound, max_products')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProfile({
            display_name: data.display_name,
            email: data.email || user.email || "",
            notification_sound: data.notification_sound ?? true,
            max_products: data.max_products ?? 1000,
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [user]);

  useEffect(() => {
    setTempStoreName(storeName);
    setTempStoreAddress(storeAddress);
  }, [storeName, storeAddress]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          notification_sound: profile.notification_sound,
          max_products: profile.max_products,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update store context
      setStoreName(tempStoreName);
      setStoreAddress(tempStoreAddress);
      
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    toast.success("Signed out successfully");
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        {/* Profile Settings */}
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Settings
            </CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={profile.display_name || ""}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                placeholder="Your name"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email || ""}
                disabled
                className="h-11 bg-muted/30"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </CardContent>
        </Card>
        
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
                checked={profile.notification_sound ?? true}
                onCheckedChange={(checked) => 
                  setProfile({ ...profile, notification_sound: checked })
                }
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="maxProducts">Maximum Products Limit</Label>
              <Input
                id="maxProducts"
                type="number"
                value={profile.max_products || 1000}
                onChange={(e) => setProfile({ ...profile, max_products: parseInt(e.target.value) || 1000 })}
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
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex-1 h-11"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleSignOut}
            className="flex-1 h-11 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
