"use client";

import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";
import { useBudgetStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface CalendarMonthProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarMonth({
  currentDate,
  onSelectDate,
}: CalendarMonthProps) {
  const { getDailyExpenses } = useBudgetStore();

  // Generate all days in the current month
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentDate]);

  // Calculate which day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
  const startDay = startOfMonth(currentDate).getDay();

  // Create an array of day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-xl overflow-hidden border bg-card shadow-sm">
      {/* Day names header */}
      <div className="grid grid-cols-7 bg-muted/50">
        {dayNames.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 auto-rows-fr border-l border-t">
        {/* Empty cells for days before the start of the month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="border-b border-r bg-muuted/80 last:border-r-0 min-h-[80px]"
          />
        ))}

        {/* Actual days of the month */}
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const dailyExpenses = getDailyExpenses(day);
          const hasExpenses = dailyExpenses.length > 0;
          const totalAmount = dailyExpenses.reduce(
            (sum, expense) => sum + expense.amount,
            0,
          );

          return (
            <button
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                "min-h-[80px] p-2 border-b border-r  relative flex flex-col items-start transition-colors",
                "hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                {
                  "bg-muted/30": !isCurrentMonth,
                  "bg-primary/5": isCurrentDay && !hasExpenses,
                },
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  {
                    "bg-primary text-primary-foreground font-medium":
                      isCurrentDay,
                    "text-muted-foreground": !isCurrentDay && !isCurrentMonth,
                  },
                )}
              >
                {format(day, "d")}
              </span>

              {hasExpenses && (
                <div className="mt-auto w-full">
                  <div
                    className={cn(
                      "text-xs font-medium px-1.5 py-0.5 rounded-md mt-1 w-full text-right",
                      totalAmount > 100
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : totalAmount > 50
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                    )}
                  >
                    ${totalAmount.toFixed(2)}
                  </div>

                  {dailyExpenses.length > 1 && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {dailyExpenses.length} items
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
