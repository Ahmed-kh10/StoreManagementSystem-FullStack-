import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ProblemDetails } from '@/types/api';
import { tokenStorage } from '@/lib/auth/tokenStorage';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error('VITE_API_URL is not defined. Check your .env file.');
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------
// Request interceptor — attach JWT
// -----------------------------
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// -----------------------------
// Refresh-token queueing state
// -----------------------------
type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;

let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null): void {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });

  pendingQueue = [];
}

function normalizeError(error: AxiosError<ProblemDetails>): ApiError {
  return {
    status: error.response?.status ?? 0,
    message:
      error.response?.data?.detail ??
      error.response?.data?.title ??
      error.message ??
      'حدث خطأ غير متوقع',
    details: error.response?.data,
  };
}

// -----------------------------
// Response interceptor — normalize errors + auto-refresh
// -----------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ProblemDetails>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const isAuthEndpoint =
      originalRequest?.url?.includes('/Auth/login') ||
      originalRequest?.url?.includes('/Auth/register') ||
      originalRequest?.url?.includes('/Account/refresh-token');

    const shouldTryRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint;

    if (!shouldTryRefresh) {
      return Promise.reject(normalizeError(error));
    }

    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      tokenStorage.clearTokens();
      return Promise.reject(normalizeError(error));
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post<{
        token: string;
        refreshToken: string;
      }>(`${baseURL}/Account/refresh-token`, { refreshToken });

      tokenStorage.setTokens(response.data.token, response.data.refreshToken);
      processQueue(null, response.data.token);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clearTokens();
      window.location.href = '/login';
      return Promise.reject(normalizeError(error));
    } finally {
      isRefreshing = false;
    }
  },
);
