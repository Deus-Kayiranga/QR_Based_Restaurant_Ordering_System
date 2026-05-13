import { useQuery } from '@tanstack/react-query';
import { billsApi } from '../api/bills';
import { paymentsApi } from '../api/payments';

export const usePendingBills = () => {
  return useQuery({
    queryKey: ['pendingBills'],
    queryFn: () => billsApi.getPendingBills(),
    refetchInterval: 15000,
  });
};

export const useTodaySummary = () => {
  return useQuery({
    queryKey: ['todaySummary'],
    queryFn: () => paymentsApi.getTodaySummary(),
    refetchInterval: 30000,
  });
};

export const usePaymentHistory = (date?: string) => {
  return useQuery({
    queryKey: ['paymentHistory', date],
    queryFn: () => paymentsApi.getPaymentHistory({ date }),
  });
};
