"use client";

import { useState } from 'react';
import { useBudgetStore } from '@/lib/store';
import { MonthlyBudget } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { PoundSterling, PiggyBank, TrendingUp } from 'lucide-react';

interface BudgetHeaderProps {
  currentDate: Date;
}

export function BudgetHeader({ currentDate }: BudgetHeaderProps) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  
  const { getMonthlyBudget, setBudget, getTotalExpenses } = useBudgetStore();
  const [open, setOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(() => {
    const existingBudget = getMonthlyBudget(month, year);
    return existingBudget ? existingBudget.amount.toString() : '';
  });
  
  const currentBudget = getMonthlyBudget(month, year);
  const totalExpenses = getTotalExpenses(month, year);
  const remaining = currentBudget ? currentBudget.amount - totalExpenses : 0;
  const isOverBudget = remaining < 0;
  
  const handleSaveBudget = () => {
    const newBudget: MonthlyBudget = {
      amount: parseFloat(budgetAmount) || 0,
      month,
      year
    };
    
    setBudget(newBudget);
    setOpen(false);
  };
  
  return (
    <div className="bg-card rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h1>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                {currentBudget ? 'Update Budget' : 'Set Budget'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Monthly Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget for {format(currentDate, 'MMMM yyyy')}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <PoundSterling size={16} />
                    </span>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      step="0.01"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      className="pl-9"
                      placeholder="Enter your monthly budget"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveBudget} className="w-full">
                  Save Budget
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {currentBudget ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary rounded-lg p-3 flex flex-col">
              <span className="text-xs text-muted-foreground mb-1 flex items-center">
                <PiggyBank size={14} className="mr-1" /> Budget
              </span>
              <span className="text-lg font-semibold">${currentBudget.amount.toFixed(2)}</span>
            </div>
            
            <div className="bg-secondary rounded-lg p-3 flex flex-col">
              <span className="text-xs text-muted-foreground mb-1 flex items-center">
                <PoundSterling size={14} className="mr-1" /> Spent
              </span>
              <span className="text-lg font-semibold">${totalExpenses.toFixed(2)}</span>
            </div>
            
            <div className={`rounded-lg p-3 flex flex-col ${isOverBudget ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
              <span className="text-xs text-muted-foreground mb-1 flex items-center">
                <TrendingUp size={14} className="mr-1" /> Remaining
              </span>
              <span className={`text-lg font-semibold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                ${Math.abs(remaining).toFixed(2)} {isOverBudget ? 'over' : ''}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-muted-foreground">Set a budget for this month to track your expenses</p>
          </div>
        )}
      </div>
    </div>
  );
}