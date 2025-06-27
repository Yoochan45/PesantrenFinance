import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, UserPlus, CloudUpload } from "lucide-react";
import AddTransactionModal from "@/components/transactions/add-transaction-modal";

export default function QuickActions() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const actions = [
    {
      name: "Add Transaction",
      icon: Plus,
      gradient: "from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500",
      onClick: () => setShowAddTransaction(true),
    },
    {
      name: "Generate Report",
      icon: FileText,
      gradient: "from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500",
      onClick: () => console.log("Generate report"),
    },
    {
      name: "Manage Users",
      icon: UserPlus,
      gradient: "from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500",
      onClick: () => console.log("Manage users"),
    },
    {
      name: "Backup Data",
      icon: CloudUpload,
      gradient: "from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500",
      onClick: () => console.log("Backup data"),
    },
  ];

  return (
    <>
      <Card className="glass-card border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.name}
                  className={`p-4 h-auto flex-col space-y-2 bg-gradient-to-r ${action.gradient} transition-all duration-300 hover-glow group`}
                  onClick={action.onClick}
                >
                  <Icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-white">{action.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AddTransactionModal 
        open={showAddTransaction} 
        onOpenChange={setShowAddTransaction} 
      />
    </>
  );
}
