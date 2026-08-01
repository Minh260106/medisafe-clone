import { apiClient } from './apiClient';
import { User } from '@/types';
import { LoginRequest, RegisterRequest, AuthResponse, TokenResponse, RefreshTokenRequest } from '@/types/api';
import { mockDelay, useMockApi } from './serviceMode';
import { mockUsers } from './mockFixtures';

export interface ForgotPasswordResponse {
  message: string;
}

export const authApi = {
  async login(params: LoginRequest): Promise<AuthResponse> {
    if (useMockApi) {
      await mockDelay();
      return {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        token_type: 'bearer',
        expires_in: 86400,
        user: mockUsers[0],
      };
    }

    const response = await apiClient.post<AuthResponse>('/auth/login', params);
    return response.data;
  },

  async register(params: RegisterRequest): Promise<AuthResponse> {
    if (useMockApi) {
      await mockDelay();
      return {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        token_type: 'bearer',
        expires_in: 86400,
        user: mockUsers[0],
      };
    }

    const response = await apiClient.post<AuthResponse>('/auth/register', params);
    return response.data;
  },

  async refreshToken(params: RefreshTokenRequest): Promise<TokenResponse> {
    if (useMockApi) {
      await mockDelay();
      return {
        access_token: 'mock-refreshed-access-token',
        token_type: 'bearer',
        expires_in: 86400,
      };
    }

    const response = await apiClient.post<TokenResponse>('/auth/refresh', params);
    return response.data;
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    if (useMockApi) {
      await mockDelay();
      return {
        message: `Đã gửi liên kết khôi phục mật khẩu tới ${email}.`,
      };
    }

    const response = await apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
    return response.data;
  },

  async getProfile(): Promise<User> {
    if (useMockApi) {
      await mockDelay();
      return mockUsers[0];
    }

    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
