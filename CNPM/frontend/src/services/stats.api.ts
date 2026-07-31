import { apiClient } from './apiClient';
import { AdherenceStats } from '@/types';
import { mockAdherenceStats } from './mockData';

export const statsApi = {
  async getAdherenceStats(): Promise<AdherenceStats> {
    try {
      const response = await apiClient.get<AdherenceStats>('/stats/adherence');
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockAdherenceStats;
    }
  },
};
