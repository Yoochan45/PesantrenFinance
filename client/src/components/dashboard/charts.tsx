import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Charts() {
  const { data: transactions } = useQuery({
    queryKey: ["/api/transactions"],
  });

  // Mock data for charts - in real app, this would be processed from transactions
  const financialData = [
    { month: "Jan", income: 40000000, expenses: 28000000 },
    { month: "Feb", income: 42000000, expenses: 30000000 },
    { month: "Mar", income: 38000000, expenses: 32000000 },
    { month: "Apr", income: 45000000, expenses: 29000000 },
    { month: "May", income: 47000000, expenses: 31000000 },
    { month: "Jun", income: 43000000, expenses: 33000000 },
    { month: "Jul", income: 48000000, expenses: 30000000 },
    { month: "Aug", income: 46000000, expenses: 32000000 },
    { month: "Sep", income: 44000000, expenses: 31000000 },
    { month: "Oct", income: 49000000, expenses: 30000000 },
    { month: "Nov", income: 47000000, expenses: 31000000 },
    { month: "Dec", income: 45250000, expenses: 32180000 },
  ];

  const categoryData = [
    { name: "Food & Kitchen", value: 12000000, color: "#6366f1" },
    { name: "Utilities", value: 8000000, color: "#8b5cf6" },
    { name: "Maintenance", value: 6000000, color: "#10b981" },
    { name: "Educational", value: 4000000, color: "#06b6d4" },
    { name: "Others", value: 2180000, color: "#f59e0b" },
  ];

  const formatCurrency = (value: number) => {
    return `Rp ${(value / 1000000).toFixed(0)}M`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Financial Overview Chart */}
      <Card className="glass-card border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Income vs Expenses</CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                Monthly
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                Yearly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={financialData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8"
                fontSize={12}
              />
              <YAxis 
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#e2e8f0"
                }}
                formatter={(value: number) => [formatCurrency(value), ""]}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#incomeGradient)"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#expenseGradient)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown Chart */}
      <Card className="glass-card border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Expense Categories</CardTitle>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#e2e8f0"
                }}
                formatter={(value: number) => [formatCurrency(value), ""]}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ color: "#e2e8f0", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
