import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  Filter, 
  Download, 
  ArrowDown, 
  ArrowUp, 
  Edit, 
  Trash2,
  Calendar,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import AddTransactionModal from "./add-transaction-modal";
import type { Transaction, Category } from "@shared/schema";

export default function TransactionList() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  // Build query parameters
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (activeTab !== "all") {
      params.append("type", activeTab);
    }
    if (selectedCategory) {
      params.append("category", selectedCategory);
    }
    if (startDate) {
      params.append("startDate", startDate);
    }
    if (endDate) {
      params.append("endDate", endDate);
    }
    return params.toString();
  };

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", buildQueryParams()],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
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
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    },
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
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  const getCategoryColor = (categoryId: number) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.color || "#6366f1";
  };

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = !searchQuery || 
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.source?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleExport = (format: "csv" | "pdf") => {
    // Implementation would depend on backend API
    toast({
      title: "Export Started",
      description: `Exporting transactions as ${format.toUpperCase()}...`,
    });
  };

  const clearFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <Card className="glass-card border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <ArrowLeftRight className="mr-2 h-5 w-5" />
              Transaction Management
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => handleExport("csv")}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => handleExport("pdf")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500"
                onClick={() => setShowAddModal(true)}
              >
                Add Transaction
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color || "#6366f1" }}
                        ></div>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="Start date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />

              <Input
                type="date"
                placeholder="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>

            {(searchQuery || selectedCategory || startDate || endDate || activeTab !== "all") && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  {filteredTransactions?.length || 0} transactions found
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-slate-400 hover:text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600">
                All
              </TabsTrigger>
              <TabsTrigger value="income" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500">
                Income
              </TabsTrigger>
              <TabsTrigger value="expense" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500">
                Expenses
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              ) : filteredTransactions?.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowLeftRight className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No transactions found</h3>
                  <p className="text-slate-400 mb-4">
                    {activeTab === "all" 
                      ? "No transactions match your current filters."
                      : `No ${activeTab} transactions found.`
                    }
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500"
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Your First Transaction
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-700 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-800/50">
                      <TableRow className="border-slate-700 hover:bg-slate-700/50">
                        <TableHead className="text-slate-300 font-semibold">Type</TableHead>
                        <TableHead className="text-slate-300 font-semibold">Description</TableHead>
                        <TableHead className="text-slate-300 font-semibold">Category</TableHead>
                        <TableHead className="text-slate-300 font-semibold">Amount</TableHead>
                        <TableHead className="text-slate-300 font-semibold">Date</TableHead>
                        <TableHead className="text-slate-300 font-semibold">Source</TableHead>
                        <TableHead className="text-slate-300 font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions?.map((transaction) => (
                        <TableRow 
                          key={transaction.id} 
                          className="border-slate-700 hover:bg-slate-800/50 transition-all hover-glow"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                transaction.type === "income"
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : "bg-gradient-to-r from-red-500 to-orange-500"
                              }`}>
                                {transaction.type === "income" ? (
                                  <ArrowDown className="w-4 h-4 text-white" />
                                ) : (
                                  <ArrowUp className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <Badge
                                variant={transaction.type === "income" ? "default" : "destructive"}
                                className="capitalize"
                              >
                                {transaction.type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-white">
                                {transaction.description || "No description"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: getCategoryColor(transaction.categoryId || 0) }}
                              ></div>
                              <span className="text-slate-300">{getCategoryName(transaction.categoryId || 0)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`font-semibold ${
                              transaction.type === "income" ? "text-green-400" : "text-red-400"
                            }`}>
                              {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-slate-300">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(transaction.date.toString())}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-slate-300">
                              {transaction.source || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white hover:bg-slate-700"
                                onClick={() => {
                                  setEditingTransaction(transaction);
                                  setShowAddModal(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="glass-card border-slate-700/50">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">Delete Transaction</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-300">
                                      Are you sure you want to delete this transaction? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => deleteTransactionMutation.mutate(transaction.id)}
                                      disabled={deleteTransactionMutation.isPending}
                                    >
                                      {deleteTransactionMutation.isPending ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddTransactionModal 
        open={showAddModal} 
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) {
            setEditingTransaction(null);
          }
        }}
        editingTransaction={editingTransaction}
      />
    </>
  );
}
