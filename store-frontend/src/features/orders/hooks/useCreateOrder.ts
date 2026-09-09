import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';
import { BASKET_QUERY_KEY } from '@/features/basket/hooks/useBasket';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // لو الباك إند بيفضي السلة بعد الأوردر، ده هيحدّثها فورًا
      queryClient.invalidateQueries({ queryKey: BASKET_QUERY_KEY });
    },
  });
}
