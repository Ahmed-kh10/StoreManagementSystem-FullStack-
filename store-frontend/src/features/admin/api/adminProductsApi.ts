import { apiClient } from '@/lib/api/apiClient';
import type { ProductDto } from '@/features/products/types/product.types';
import type { ProductPayload } from '../types/product-payload.types';

export const adminProductsApi = {
  create: async (payload: ProductPayload): Promise<ProductDto> => {
    const { data } = await apiClient.post<ProductDto>('/Products', payload);
    return data;
  },

  update: async (id: number, payload: ProductPayload): Promise<ProductDto> => {
    const { data } = await apiClient.put<ProductDto>(
      `/Products/${id}`,
      payload,
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/Products/${id}`);
  },

  uploadImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<{ imageUrl: string }>(
      '/Products/upload-image',
      formData,
      { headers: { 'Content-Type': undefined } },
    );
    return data;
  },
};
