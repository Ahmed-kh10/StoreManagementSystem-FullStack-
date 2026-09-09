import { apiClient } from '@/lib/api/apiClient';
import type { PaymentIntentDto } from '../types/payment.types';

export const paymentsApi = {
  createPaymentIntent: async (orderId: number): Promise<PaymentIntentDto> => {
    const { data } = await apiClient.post<PaymentIntentDto>(
      `/Payments/${orderId}`,
    );
    return data;
  },
};
