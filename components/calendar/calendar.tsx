"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarMonth } from "./calendar-month";
import { ExpenseDialog } from "../expense-dialog";
import { useBudgetStore } from "@/lib/store";
import { format, addMonths, subMonths } from "date-fns";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  const { getDailyExpenses } = useBudgetStore();

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsExpenseDialogOpen(true);
  };

  const dailyExpenses = selectedDate ? getDailyExpenses(selectedDate) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <CalendarMonth
        currentDate={currentDate}
        onSelectDate={handleDateSelect}
      />

      {selectedDate && (
        <ExpenseDialog
          date={selectedDate}
          open={isExpenseDialogOpen}
          onOpenChange={setIsExpenseDialogOpen}
          existingExpenses={dailyExpenses}
        />
      )}
    </div>
  );
}
