export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  title: string;
  amount_minor: number;
  type: TransactionType;
  category: string;
  currency?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface TransactionCreate {
  title: string;
  amount_minor: number;
  type: TransactionType;
  category: string;
  description?: string;
}

export interface TransactionSummary {
  balance_minor: number;
  total_income_minor: number;
  total_expense_minor: number;
}
