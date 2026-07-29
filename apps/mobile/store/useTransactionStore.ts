import { create } from 'zustand';
import { Transaction, TransactionSummary } from '../types/transaction';
import { getTransactions, getSummary, createTransaction } from '../services/api';

interface TransactionState {
  transactions: Transaction[];
  summary: TransactionSummary;
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  summary: { balance_minor: 0, total_income_minor: 0, total_expense_minor: 0 },
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await getTransactions();
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch transactions', isLoading: false });
    }
  },

  fetchSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const summary = await getSummary();
      set({ summary, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch summary', isLoading: false });
    }
  },

  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const newTransaction = await createTransaction(transaction);
      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
        isLoading: false,
      }));
      // Refresh summary
      await get().fetchSummary();
    } catch (error) {
      set({ error: 'Failed to add transaction', isLoading: false });
    }
  },
}));
