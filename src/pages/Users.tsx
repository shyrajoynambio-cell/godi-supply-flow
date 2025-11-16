import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users as UsersIcon, UserPlus, Shield, User, Crown } from "lucide-react";
import { toast } from "sonner";

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2 hours ago",
    permissions: ["All Access"]
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com", 
    role: "Staff",
    status: "Active",
    lastLogin: "1 day ago",
    permissions: ["Inventory", "Reports"]
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    role: "Cashier", 
    status: "Active",
    lastLogin: "3 hours ago",
    permissions: ["POS", "Sales"]
  },
  {
    id: 4,
    name: "John Martinez", 
    email: "john@example.com",
    role: "Staff",
    status: "Inactive",
    lastLogin: "1 week ago",
    permissions: ["Inventory"]
  }
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Admin": return Crown;
    case "Staff": return Shield;
    case "Cashier": return User;
    default: return User;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin": return "destructive";
    case "Staff": return "default";
    case "Cashier": return "secondary";
    default: return "default";
  }
};

export default function Users() {
  const handleAddUser = () => {
    toast.info("Add user feature coming soon!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage staff accounts and permissions</p>
        </div>
        <Button onClick={handleAddUser} className="md:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Role Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive-light rounded-lg">
                <Crown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-light rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Staff Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary-light rounded-lg">
                <User className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Cashiers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-primary" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => {
              const RoleIcon = getRoleIcon(user.role);
              return (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary-light text-primary font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <RoleIcon className="h-4 w-4" />
                        <Badge variant={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                      <Badge 
                        variant={user.status === 'Active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={user.status === 'Active' ? 'text-destructive hover:text-destructive' : 'text-success hover:text-success'}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Guide */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-destructive-light/50">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-destructive" />
                <h3 className="font-semibold text-destructive">Administrator</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Full system access including user management, settings, and all modules
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-primary-light/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-primary">Staff</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Inventory management, reports viewing, and customer service functions
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary-light/50">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-secondary" />
                <h3 className="font-semibold text-secondary">Cashier</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Point of sale access, transaction processing, and basic inventory viewing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}