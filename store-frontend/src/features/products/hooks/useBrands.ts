import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '../api/brandsApi';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: brandsApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}
