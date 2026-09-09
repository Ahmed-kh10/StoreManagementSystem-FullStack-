import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminProductsApi } from '../api/adminProductsApi';
import { productsApi } from '@/features/products/api/productsApi';
import type { ProductPayload } from '../types/product-payload.types';

// نفس منتجات صفحة العرض العادية، بس بحجم صفحة أكبر يناسب جدول الإدارة
export function useAdminProductsList(pageIndex: number) {
  return useQuery({
    queryKey: ['admin-products', pageIndex],
    queryFn: () => productsApi.getAll({ pageIndex, pageSize: 10 }),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ProductPayload) => adminProductsApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ProductPayload) => adminProductsApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminProductsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUploadProductImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const result = await adminProductsApi.uploadImage(file);
      return result.imageUrl;
    },
  });
}
