import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  ArrowLeftRight, 
  BarChart3, 
  Users, 
  Settings,
  Crown,
  Shield,
  User as UserIcon,
  Church
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "User Management", href: "/users", icon: Users, adminOnly: true },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="h-3 w-3" />;
      case "bendahara": return <Shield className="h-3 w-3" />;
      default: return <UserIcon className="h-3 w-3" />;
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
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 glass-card border-r border-slate-700">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Church className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-poppins">
                PesanTech
              </h1>
              <p className="text-xs text-slate-400">Finance Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-5 flex-1 px-2 space-y-2">
          {navigation.map((item) => {
            if (item.adminOnly && user?.role !== "admin") {
              return null;
            }

            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "group flex items-center px-2 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover-glow"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-slate-700">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImageUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600">
                {user?.firstName?.[0] || user?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email
                }
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Badge 
                  variant={getRoleBadgeVariant(user?.role || "pengurus")}
                  className="text-xs flex items-center space-x-1"
                >
                  {getRoleIcon(user?.role || "pengurus")}
                  <span className="capitalize">{user?.role || "pengurus"}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
