import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Transaction } from "@shared/schema";

export default function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", { limit: "5" }],
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 animate-pulse">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-700 rounded-xl mr-4"></div>
                  <div>
                    <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-24"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-slate-700 rounded w-20 mb-1"></div>
                  <div className="h-5 bg-slate-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Recent Transactions</CardTitle>
          <Link href="/transactions">
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No transactions found</p>
            </div>
          ) : (
            transactions?.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 hover-glow"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                    transaction.type === "income"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-red-500 to-orange-500"
                  }`}>
                    {transaction.type === "income" ? (
                      <ArrowDown className="w-5 h-5 text-white" />
                    ) : (
                      <ArrowUp className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {transaction.description || "No description"}
                    </p>
                    <p className="text-sm text-slate-400">
                      {formatDate(transaction.date.toString())}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === "income" ? "text-green-400" : "text-red-400"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </p>
                  <Badge
                    variant={transaction.type === "income" ? "default" : "destructive"}
                    className="mt-1"
                  >
                    {transaction.type === "income" ? "Income" : "Expense"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
