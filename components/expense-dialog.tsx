"use client";

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Expense, EXPENSE_CATEGORIES, CATEGORY_COLORS, ExpenseCategory } from '@/lib/types';
import { useBudgetStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface ExpenseDialogProps {
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingExpenses: Expense[];
}

export function ExpenseDialog({ date, open, onOpenChange, existingExpenses }: ExpenseDialogProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  
  const { addExpense, deleteExpense } = useBudgetStore();
  
  const handleAddExpense = () => {
    if (!description || !amount) {
      toast({
        title: "Missing information",
        description: "Please provide both a description and amount",
        variant: "destructive"
      });
      return;
    }
    
    const newExpense: Expense = {
      id: uuidv4(),
      date: new Date(date),
      description,
      amount: parseFloat(amount),
      category
    };
    
    addExpense(newExpense);
    
    // Reset form
    setDescription('');
    setAmount('');
    setCategory('other');
    
    toast({
      title: "Expense added",
      description: `$${parseFloat(amount).toFixed(2)} for ${description}`,
    });
  };
  
  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    toast({
      title: "Expense deleted",
      variant: "destructive"
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Expenses for {format(date, 'MMMM d, yyyy')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you spend on?"
              />
            </div>
            
            <div className="col-span-6">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <DollarSign size={16} />
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="col-span-6">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleAddExpense} 
            className="w-full"
            variant="default"
          >
            <Plus size={16} className="mr-2" /> Add Expense
          </Button>
          
          {existingExpenses.length > 0 && (
            <>
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Existing Expenses</h3>
                
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {existingExpenses.map((expense) => (
                    <div 
                      key={expense.id} 
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{expense.description}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={CATEGORY_COLORS[expense.category as ExpenseCategory]}>
                            {expense.category}
                          </Badge>
                          <span className="text-sm font-medium">${expense.amount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteExpense(expense.id)}
                        aria-label="Delete expense"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}