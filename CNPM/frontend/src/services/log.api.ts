import { apiClient } from './apiClient';
import { IntakeLog } from '@/types';
import { CreateIntakeLogRequest } from '@/types/api';
import { mockDelay, useMockApi } from './serviceMode';
import { mockLogs, nextLogId } from './mockFixtures';

export type IntakeLogPayload = CreateIntakeLogRequest;

export const logApi = {
  async list(): Promise<IntakeLog[]> {
    if (useMockApi) {
      await mockDelay();
      return [...mockLogs];
    }

    const response = await apiClient.get<IntakeLog[]>('/history');
    return response.data;
  },

  async create(data: CreateIntakeLogRequest): Promise<IntakeLog> {
    if (useMockApi) {
      await mockDelay();
      const log: IntakeLog = {
        id: nextLogId(),
        user_id: 1,
        schedule_id: data.schedule_id,
        status: data.status,
        timestamp: data.timestamp || new Date().toISOString(),
      };
      mockLogs.unshift(log);
      return log;
    }

    const response = await apiClient.post<IntakeLog>('/history', data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    if (useMockApi) {
      await mockDelay();
      const index = mockLogs.findIndex((item) => item.id === id);
      if (index !== -1) mockLogs.splice(index, 1);
      return;
    }

    await apiClient.delete(`/history/${id}`);
  },
};

export const historyApi = logApi;