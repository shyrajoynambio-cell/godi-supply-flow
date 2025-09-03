import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Volume2, Package, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SettingsDialogProps {
  onStartTutorial: () => void;
}

export function SettingsDialog({ onStartTutorial }: SettingsDialogProps) {
  const { profile, updateProfile, signOut } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const [maxProducts, setMaxProducts] = useState(profile?.max_products || 1000);
  const [notificationSound, setNotificationSound] = useState(profile?.notification_sound || false);

  const handleSaveSettings = async () => {
    await updateProfile({
      max_products: maxProducts,
      notification_sound: notificationSound
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your G.O.D.I experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <h3 className="font-semibold">Profile</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div>
                <Label className="text-sm text-muted-foreground">Name</Label>
                <p className="font-medium">{profile?.display_name || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Role</Label>
                <p className="font-medium capitalize">{profile?.role || 'staff'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Inventory Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <h3 className="font-semibold">Inventory Limits</h3>
            </div>
            <div className="pl-6">
              <Label htmlFor="max-products">Maximum Products</Label>
              <Input
                id="max-products"
                type="number"
                min="1"
                max="10000"
                value={maxProducts}
                onChange={(e) => setMaxProducts(parseInt(e.target.value) || 1000)}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Set the maximum number of products allowed in your inventory
              </p>
            </div>
          </div>

          <Separator />

          {/* Notification Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="flex items-center justify-between pl-6">
              <div>
                <Label htmlFor="notification-sound">Alert Sound</Label>
                <p className="text-sm text-muted-foreground">
                  Play sound for low stock alerts
                </p>
              </div>
              <Switch
                id="notification-sound"
                checked={notificationSound}
                onCheckedChange={setNotificationSound}
              />
            </div>
          </div>

          <Separator />

          {/* Language Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Language</h3>
            </div>
            <div className="flex items-center justify-between pl-6">
              <div>
                <Label>Display Language</Label>
                <p className="text-sm text-muted-foreground">
                  Current: {language === 'en' ? 'English' : 'Filipino'}
                </p>
              </div>
              <Button variant="outline" onClick={toggleLanguage}>
                Switch to {language === 'en' ? 'Filipino' : 'English'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Help Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <h3 className="font-semibold">Help & Tutorial</h3>
            </div>
            <div className="pl-6">
              <Button variant="outline" onClick={onStartTutorial} className="w-full">
                Restart Tutorial
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Need help? Restart the guided tutorial to learn how to use G.O.D.I
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSaveSettings} className="flex-1">
              Save Settings
            </Button>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}