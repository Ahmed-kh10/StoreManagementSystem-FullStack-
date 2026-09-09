import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandsApi } from '@/features/products/api/brandsApi';
import { categoriesApi } from '@/features/products/api/categoriesApi';

export function useResolveBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => brandsApi.findOrCreate(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}

export function useResolveCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => categoriesApi.findOrCreate(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
