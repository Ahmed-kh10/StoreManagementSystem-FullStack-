import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';
import type { ProductSpecParams } from '../types/product.types';

export function useProducts(params: ProductSpecParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
    placeholderData: keepPreviousData,
  });
}
