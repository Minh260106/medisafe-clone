import { apiClient } from './apiClient';
import { ComplianceStats } from '@/types';
import { AdherenceStatsResponse, ChartDataResponse } from '@/types/api';
import { mockComplianceStats, mockDailyTrends, mockVitalTrends } from './mockFixtures';
import { mockDelay, useMockApi } from './serviceMode';

export const statsApi = {
  async getComplianceStats(): Promise<ComplianceStats> {
    if (useMockApi) {
      await mockDelay();
      return mockComplianceStats;
    }

    const response = await apiClient.get<ComplianceStats>('/stats/compliance');
    return response.data;
  },

  async getAdherenceStats(): Promise<AdherenceStatsResponse> {
    if (useMockApi) {
      await mockDelay();
      return {
        ...mockComplianceStats,
        adherence_rate: 84,
        streak_days: 14,
        total_scheduled: 50,
        total_taken: 42,
        total_skipped: 8,
        total_pending: 0,
        weekly_trend: mockDailyTrends,
      };
    }

    const response = await apiClient.get<AdherenceStatsResponse>('/stats/adherence');
    return response.data;
  },

  async getChartData(): Promise<ChartDataResponse> {
    if (useMockApi) {
      await mockDelay();
      return {
        adherence: {
          ...mockComplianceStats,
          adherence_rate: 84,
          streak_days: 14,
          total_scheduled: 50,
          total_taken: 42,
          total_skipped: 8,
          total_pending: 0,
          weekly_trend: mockDailyTrends,
        },
        vitals: mockVitalTrends,
      };
    }

    const response = await apiClient.get<ChartDataResponse>('/stats/charts');
    return response.data;
  },
};
