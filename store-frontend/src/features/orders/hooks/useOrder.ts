import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
