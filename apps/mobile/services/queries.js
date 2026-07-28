import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, getSummary, createTransaction, getInsight } from './api';

export const useTransactions = () =>
  useQuery({ 
    queryKey: ['transactions'], 
    queryFn: getTransactions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useSummary = () =>
  useQuery({ 
    queryKey: ['summary'], 
    queryFn: getSummary,
    staleTime: 1000 * 60 * 5,
  });

export const useInsight = () =>
  useQuery({
    queryKey: ['insight'],
    queryFn: getInsight,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const useCreateTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
    },
  });
};
