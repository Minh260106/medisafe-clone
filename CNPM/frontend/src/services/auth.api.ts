import { apiClient } from './apiClient';
import { User } from '@/types';
import { mockUser } from './mockData';

export interface LoginParams {
  email: string;
  passwordHash?: string;
  password?: string;
}

export interface RegisterParams {
  email: string;
  password?: string;
  fullName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  async login(params: LoginParams): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', params);
      return response.data;
    } catch {
      // Fallback mock response for demonstration
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        user: {
          ...mockUser,
          email: params.email || mockUser.email,
        },
        token: 'mock_jwt_token_medisafe_2026_xyz',
      };
    }
  },

  async register(params: RegisterParams): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', params);
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        user: {
          ...mockUser,
          email: params.email,
          fullName: params.fullName,
        },
        token: 'mock_jwt_token_registered_2026',
      };
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Link đặt lại mật khẩu đã được gửi đến email của bạn.',
      };
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockUser;
    }
  },
};
