import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      summary: { balance_minor: 0, total_income_minor: 0, total_expense_minor: 0 },
      isLoading: false,
      error: null,

      fetchTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getTransactions(1, 100); // Fetch first 100 as a fallback
          set({ transactions: response.items, isLoading: false });
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
          // Optmistic UI Update
          const tempId = Math.random();
          const optimisticTransaction: Transaction = {
            id: tempId,
            ...transaction,
            created_at: new Date().toISOString(),
          };
          set((state) => ({
            transactions: [optimisticTransaction, ...state.transactions],
          }));

          const newTransaction = await createTransaction(transaction);
          set((state) => ({
            transactions: state.transactions.map((t) => t.id === tempId ? newTransaction : t),
            isLoading: false,
          }));
          // Refresh summary
          await get().fetchSummary();
        } catch (error) {
          set({ error: 'Failed to add transaction', isLoading: false });
        }
      },
    }),
    {
      name: 'transaction-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ transactions: state.transactions, summary: state.summary }),
    }
  )
);
