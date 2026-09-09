import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { basketApi } from '../api/basketApi';
import type { BasketDto } from '../types/basket.types';
import { useAuth } from '@/app/providers/AuthProvider';

export const BASKET_QUERY_KEY = ['basket'];

export function useBasket() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: BASKET_QUERY_KEY,
    queryFn: basketApi.getBasket,
    enabled: isAuthenticated,
  });
}

export function useSaveBasket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (basket: BasketDto) => basketApi.saveBasket(basket),
    onSuccess: (data) => {
      queryClient.setQueryData(BASKET_QUERY_KEY, data);
    },
  });
}

export function useDeleteBasket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => basketApi.deleteBasket(),
    onSuccess: () => {
      queryClient.setQueryData(BASKET_QUERY_KEY, null);
    },
  });
}
