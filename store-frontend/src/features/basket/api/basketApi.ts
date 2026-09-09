import { apiClient } from '@/lib/api/apiClient';
import type { ApiError } from '@/types/api';
import type { BasketDto } from '../types/basket.types';

export const basketApi = {
  getBasket: async (): Promise<BasketDto | null> => {
    try {
      const { data } = await apiClient.get<BasketDto>('/Basket');
      return data;
    } catch (err) {
      if ((err as ApiError).status === 404) return null;
      throw err;
    }
  },

  saveBasket: async (basket: BasketDto): Promise<BasketDto> => {
    const { data } = await apiClient.post<BasketDto>('/Basket', basket);
    return data;
  },

  deleteBasket: async (): Promise<void> => {
    await apiClient.delete('/Basket');
  },
};
