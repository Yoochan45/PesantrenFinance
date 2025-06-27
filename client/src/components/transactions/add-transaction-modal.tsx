import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import type { Category } from "@shared/schema";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Amount must be a positive number"
  ),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  source: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTransactionModal({ open, onOpenChange }: AddTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income");
  const { toast } = useToast();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: open,
  });

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "income",
      amount: "",
      categoryId: "",
      description: "",
      source: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      await apiRequest("POST", "/api/transactions", {
        ...data,
        amount: Number(data.amount),
        categoryId: Number(data.categoryId),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Transaction created successfully",
      });
      form.reset();
      onOpenChange(false);
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
        description: "Failed to create transaction",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    createTransactionMutation.mutate({
      ...data,
      type: transactionType,
    });
  };

  const handleTypeChange = (type: "income" | "expense") => {
    setTransactionType(type);
    form.setValue("type", type);
    form.setValue("categoryId", ""); // Reset category when type changes
  };

  const filteredCategories = categories?.filter(category => category.type === transactionType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-card border-slate-700/50 gradient-border">
        <div className="p-1 rounded-2xl">
          <div className="bg-slate-900 rounded-xl p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-white">Add Transaction</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Transaction Type Toggle */}
                <div className="flex bg-slate-800 rounded-xl p-1">
                  <Button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      transactionType === "income"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "bg-transparent text-slate-400 hover:text-white"
                    }`}
                    onClick={() => handleTypeChange("income")}
                  >
                    Income
                  </Button>
                  <Button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      transactionType === "expense"
                        ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                        : "bg-transparent text-slate-400 hover:text-white"
                    }`}
                    onClick={() => handleTypeChange("expense")}
                  >
                    Expense
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Amount (Rp)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white focus:border-cyan-400 focus:ring-cyan-400">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {filteredCategories?.map((category) => (
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter transaction details..."
                          rows={3}
                          className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Source (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Donor name, Bank, etc."
                          className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-slate-800 border-slate-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white hover-glow"
                    disabled={createTransactionMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {createTransactionMutation.isPending ? "Saving..." : "Save Transaction"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
