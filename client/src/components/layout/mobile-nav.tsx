import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { 
  Home, 
  ArrowLeftRight, 
  BarChart3, 
  Users, 
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Users", href: "/users", icon: Users, adminOnly: true },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function MobileNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 glass-card border-t border-slate-700 z-50">
      <div className="grid grid-cols-4 py-2">
        {navigation
          .filter(item => !item.adminOnly || user?.role === "admin")
          .slice(0, 4)
          .map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 transition-colors",
                    isActive
                      ? "text-cyan-400"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.name}</span>
                </a>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
