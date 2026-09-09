import { apiClient } from '@/lib/api/apiClient';
import type { CreateOrderDto, OrderDto } from '../types/order.types';

export const ordersApi = {
  create: async (payload: CreateOrderDto): Promise<OrderDto> => {
    const { data } = await apiClient.post<OrderDto>('/Orders', payload);
    return data;
  },

  getAll: async (): Promise<OrderDto[]> => {
    const { data } = await apiClient.get<OrderDto[]>('/Orders');
    return data;
  },

  getById: async (id: number): Promise<OrderDto> => {
    const { data } = await apiClient.get<OrderDto>(`/Orders/${id}`);
    return data;
  },
};
