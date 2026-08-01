import { apiClient } from './apiClient';
import { UserProfileResponse, UpdateProfileRequest } from '@/types/api';
import { mockDelay, useMockApi } from './serviceMode';
import { mockUsers } from './mockFixtures';

export const profileApi = {
  async getProfile(): Promise<UserProfileResponse> {
    if (useMockApi) {
      await mockDelay();
      return mockUsers[0];
    }

    const response = await apiClient.get<UserProfileResponse>('/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfileResponse> {
    if (useMockApi) {
      await mockDelay();
      const updated: UserProfileResponse = {
        ...mockUsers[0],
        ...data,
        updated_at: new Date().toISOString(),
      };
      mockUsers[0] = updated;
      return updated;
    }

    const response = await apiClient.put<UserProfileResponse>('/profile', data);
    return response.data;
  },
};
