import { apiClient } from '@/lib/api/apiClient';
import type { CategoryDto } from '../types/taxonomy.types';

export const categoriesApi = {
  getAll: async (): Promise<CategoryDto[]> => {
    const { data } = await apiClient.get<CategoryDto[]>('/Categories');
    return data;
  },

  findOrCreate: async (name: string): Promise<CategoryDto> => {
    const { data } = await apiClient.post<CategoryDto>(
      '/Categories/find-or-create',
      { name },
    );
    return data;
  },
};
