export interface Expense {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
}

export interface MonthlyBudget {
  amount: number;
  month: number;
  year: number;
}

export type ExpenseCategory =
  | "food"
  | "transportation"
  | "entertainment"
  | "shopping"
  | "utilities"
  | "housing"
  | "health"
  | "education"
  | "travel"
  | "other";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "food",
  "transportation",
  "entertainment",
  "shopping",
  "utilities",
  "housing",
  "health",
  "education",
  "travel",
  "other",
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: "bg-red-200 text-red-800",
  transportation: "bg-blue-200 text-blue-800",
  entertainment: "bg-purple-200 text-purple-800",
  shopping: "bg-pink-200 text-pink-800",
  utilities: "bg-yellow-200 text-yellow-800",
  housing: "bg-green-200 text-green-800",
  health: "bg-teal-200 text-teal-800",
  education: "bg-indigo-200 text-indigo-800",
  travel: "bg-orange-200 text-orange-800",
  other: "bg-gray-200 text-gray-800",
};
