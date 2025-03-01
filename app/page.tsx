"use client";

import { useState } from 'react';
import { Calendar } from '@/components/calendar/calendar';
import { BudgetHeader } from '@/components/budget-header';
import { ExpenseSummary } from '@/components/expense-summary';

export default function Home() {
  const [currentDate] = useState(new Date());
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-6 max-w-5xl">
        <BudgetHeader currentDate={currentDate} />
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-grow lg:w-2/3">
            <Calendar />
          </div>
          
          <div className="lg:col-span-1">
            <ExpenseSummary currentDate={currentDate} />
          </div>
        </div>
      </div>
    </div>
  );
}