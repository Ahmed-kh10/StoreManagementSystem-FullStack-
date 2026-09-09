import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categoriesApi';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}
