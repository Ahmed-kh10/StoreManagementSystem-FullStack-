import { apiClient } from '@/lib/api/apiClient';
import type {
  AuthResponseDto,
  CurrentUserDto,
  LoginPayload,
  RegisterPayload,
} from '../types/auth.types';

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponseDto> => {
    const { data } = await apiClient.post<AuthResponseDto>(
      '/Auth/register',
      payload,
    );
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponseDto> => {
    const { data } = await apiClient.post<AuthResponseDto>(
      '/Auth/login',
      payload,
    );
    return data;
  },

  getCurrentUser: async (): Promise<CurrentUserDto> => {
    const { data } = await apiClient.get<CurrentUserDto>(
      '/Account/current-user',
    );
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/Account/logout');
  },
};
