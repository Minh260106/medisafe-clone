import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '@/types';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('medisafe_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('medisafe_token');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login?expired=true';
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      'Có lỗi xảy ra khi kết nối máy chủ';

    return Promise.reject({
      message,
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    });
  }
);
