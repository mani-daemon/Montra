export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface TransactionCreate {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
}

export interface TransactionSummary {
  balance: number;
  total_income: number;
  total_expense: number;
}
