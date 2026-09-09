import { apiClient } from '@/lib/api/apiClient';
import type { BrandDto } from '../types/taxonomy.types';

export const brandsApi = {
  getAll: async (): Promise<BrandDto[]> => {
    const { data } = await apiClient.get<BrandDto[]>('/Brands');
    return data;
  },

  findOrCreate: async (name: string): Promise<BrandDto> => {
    const { data } = await apiClient.post<BrandDto>('/Brands/find-or-create', {
      name,
    });
    return data;
  },
};
