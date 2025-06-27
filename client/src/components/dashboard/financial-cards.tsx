import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowDown, ArrowUp, FolderOpen, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  activeProjects: number;
}

export default function FinancialCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card border-slate-700/50 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-slate-700 rounded-xl mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-6 bg-slate-700 rounded mb-1"></div>
                  <div className="h-3 bg-slate-700 rounded w-24"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Balance",
      value: formatCurrency(stats?.totalBalance || 0),
      icon: Wallet,
      gradient: "from-green-500 to-emerald-500",
      trend: "+12.5% from last month",
      trendIcon: TrendingUp,
      trendColor: "text-green-400",
    },
    {
      title: "Income This Month",
      value: formatCurrency(stats?.monthlyIncome || 0),
      icon: ArrowDown,
      gradient: "from-blue-500 to-cyan-500",
      trend: "+8.2% vs last month",
      trendIcon: TrendingUp,
      trendColor: "text-green-400",
    },
    {
      title: "Expenses This Month",
      value: formatCurrency(stats?.monthlyExpenses || 0),
      icon: ArrowUp,
      gradient: "from-red-500 to-orange-500",
      trend: "+5.1% vs last month",
      trendIcon: TrendingUp,
      trendColor: "text-red-400",
    },
    {
      title: "Active Projects",
      value: stats?.activeProjects?.toString() || "0",
      icon: FolderOpen,
      gradient: "from-purple-500 to-pink-500",
      trend: "3 completed this month",
      trendIcon: TrendingUp,
      trendColor: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        
        return (
          <Card 
            key={card.title}
            className="glass-card border-slate-700/50 hover-glow animate-float"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <p className="text-sm text-slate-400 truncate">{card.title}</p>
                  <p className="text-2xl font-bold text-white truncate">{card.value}</p>
                  <p className={`text-xs ${card.trendColor} flex items-center mt-1`}>
                    <TrendIcon className="w-3 h-3 mr-1" />
                    {card.trend}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
