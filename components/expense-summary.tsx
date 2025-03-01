"use client";

import { useMemo } from 'react';
import { useBudgetStore } from '@/lib/store';
import { ExpenseCategory, EXPENSE_CATEGORIES, CATEGORY_COLORS } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseSummaryProps {
  currentDate: Date;
}

export function ExpenseSummary({ currentDate }: ExpenseSummaryProps) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  
  const { getMonthlyExpenses } = useBudgetStore();
  const monthlyExpenses = getMonthlyExpenses(month, year);
  
  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    // Initialize all categories with zero
    EXPENSE_CATEGORIES.forEach(cat => {
      categoryTotals[cat] = 0;
    });
    
    // Sum up expenses by category
    monthlyExpenses.forEach(expense => {
      categoryTotals[expense.category] += expense.amount;
    });
    
    // Convert to array format for chart
    return Object.entries(categoryTotals)
      .filter(([_, value]) => value > 0) // Only include categories with expenses
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: getCategoryColor(name as ExpenseCategory)
      }));
  }, [monthlyExpenses]);
  
  // Extract color from Tailwind classes
  function getCategoryColor(category: ExpenseCategory): string {
    const colorClass = CATEGORY_COLORS[category];
    if (colorClass.includes('red')) return '#f87171';
    if (colorClass.includes('blue')) return '#60a5fa';
    if (colorClass.includes('green')) return '#4ade80';
    if (colorClass.includes('yellow')) return '#fbbf24';
    if (colorClass.includes('purple')) return '#c084fc';
    if (colorClass.includes('pink')) return '#f472b6';
    if (colorClass.includes('indigo')) return '#818cf8';
    if (colorClass.includes('teal')) return '#2dd4bf';
    if (colorClass.includes('orange')) return '#fb923c';
    return '#9ca3af'; // gray default
  }
  
  if (monthlyExpenses.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No expenses recorded for this month
          </div>
        )}
      </CardContent>
    </Card>
  );
}