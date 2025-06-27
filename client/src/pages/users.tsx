import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users as UsersIcon, Shield, User as UserIcon, Crown } from "lucide-react";
import type { User } from "@shared/schema";

export default function Users() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: isAuthenticated && (user as User)?.role === "admin",
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await apiRequest("PUT", `/api/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("PUT", `/api/users/${userId}/status`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if ((user as User)?.role !== "admin") {
    return (
      <div className="min-h-screen flex bg-slate-900 text-white">
        <Sidebar />
        <div className="flex-1 lg:pl-64 flex items-center justify-center">
          <Card className="glass-card border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Access Denied</h3>
                <p className="text-slate-400">You don't have permission to access user management.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="h-4 w-4" />;
      case "bendahara": return <Shield className="h-4 w-4" />;
      default: return <UserIcon className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "default";
      case "bendahara": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      <Sidebar />
      
      <div className="flex-1 lg:pl-64">
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-poppins">
                  User Management
                </h1>
                <p className="text-sm text-slate-400">Manage user roles and permissions</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="glass-card border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <UsersIcon className="mr-2 h-5 w-5" />
                System Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {users?.map((userItem) => (
                    <div key={userItem.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={userItem.profileImageUrl || undefined} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600">
                            {userItem.firstName?.[0] || userItem.email?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-white">
                              {userItem.firstName && userItem.lastName 
                                ? `${userItem.firstName} ${userItem.lastName}`
                                : userItem.email
                              }
                            </p>
                            <Badge 
                              variant={getRoleBadgeVariant(userItem.role || "pengurus")}
                              className="flex items-center space-x-1"
                            >
                              {getRoleIcon(userItem.role || "pengurus")}
                              <span className="capitalize">{userItem.role || "pengurus"}</span>
                            </Badge>
                            {!userItem.isActive && (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400">{userItem.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Select
                          value={userItem.role || "pengurus"}
                          onValueChange={(role) => 
                            updateRoleMutation.mutate({ userId: userItem.id, role })
                          }
                          disabled={updateRoleMutation.isPending}
                        >
                          <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="bendahara">Bendahara</SelectItem>
                            <SelectItem value="pengurus">Pengurus</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant={userItem.isActive ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleStatusMutation.mutate(userItem.id)}
                          disabled={toggleStatusMutation.isPending || userItem.id === (user as User)?.id}
                        >
                          {userItem.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
