import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '../api/paymentsApi';

export function usePaymentIntent(orderId: number) {
  return useQuery({
    queryKey: ['payment-intent', orderId],
    queryFn: () => paymentsApi.createPaymentIntent(orderId),
    enabled: Number.isFinite(orderId) && orderId > 0,
    retry: false,
  });
}
