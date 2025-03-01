"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Expense, MonthlyBudget } from "./types";

interface BudgetState {
  expenses: Expense[];
  budgets: MonthlyBudget[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setBudget: (budget: MonthlyBudget) => void;
  getMonthlyBudget: (month: number, year: number) => MonthlyBudget | undefined;
  getMonthlyExpenses: (month: number, year: number) => Expense[];
  getDailyExpenses: (date: Date) => Expense[];
  getTotalExpenses: (month: number, year: number) => number;
}

export const useBudgetStore = create<BudgetState>()((set, get) => ({
  expenses: [],
  budgets: [],

  addExpense: (expense) =>
    set((state) => ({
      expenses: [...state.expenses, expense],
    })),

  updateExpense: (id, updatedExpense) =>
    set((state) => ({
      expenses: state.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense,
      ),
    })),

  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id),
    })),

  setBudget: (budget) =>
    set((state) => {
      const existingBudgetIndex = state.budgets.findIndex(
        (b) => b.month === budget.month && b.year === budget.year,
      );

      if (existingBudgetIndex >= 0) {
        const updatedBudgets = [...state.budgets];
        updatedBudgets[existingBudgetIndex] = budget;
        return { budgets: updatedBudgets };
      } else {
        return { budgets: [...state.budgets, budget] };
      }
    }),

  getMonthlyBudget: (month, year) => {
    return get().budgets.find(
      (budget) => budget.month === month && budget.year === year,
    );
  },

  getMonthlyExpenses: (month, year) => {
    return get().expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === month && expenseDate.getFullYear() === year
      );
    });
  },

  getDailyExpenses: (date) => {
    const targetDate = new Date(date);
    return get().expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getDate() === targetDate.getDate() &&
        expenseDate.getMonth() === targetDate.getMonth() &&
        expenseDate.getFullYear() === targetDate.getFullYear()
      );
    });
  },

  getTotalExpenses: (month, year) => {
    const monthlyExpenses = get().getMonthlyExpenses(month, year);
    return monthlyExpenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );
  },
}));
