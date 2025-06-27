import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import FinancialCards from "@/components/dashboard/financial-cards";
import Charts from "@/components/dashboard/charts";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import Announcements from "@/components/dashboard/announcements";
import QuickActions from "@/components/dashboard/quick-actions";
import FloatingActionButton from "@/components/ui/floating-action-button";
import { Moon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { theme, setTheme } = useTheme();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      <Sidebar />
      
      <div className="flex-1 lg:pl-64">
        {/* Top Header */}
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex-1 lg:flex-none">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-poppins">
                  Financial Dashboard
                </h1>
                <p className="text-sm text-slate-400">Real-time pesantren financial overview</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Moon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FinancialCards />
          <Charts />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <RecentTransactions />
            </div>
            <Announcements />
          </div>
          
          <QuickActions />
        </main>
      </div>

      <MobileNav />
      <FloatingActionButton />
    </div>
  );
}
