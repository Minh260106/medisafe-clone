import { apiClient } from './apiClient';
import { Schedule } from '@/types';
import { CreateReminderRequest, UpdateReminderRequest } from '@/types/api';
import { mockDelay, useMockApi } from './serviceMode';
import { mockSchedules, nextScheduleId } from './mockFixtures';

export type SchedulePayload = CreateReminderRequest;

export const scheduleApi = {
  async list(): Promise<Schedule[]> {
    if (useMockApi) {
      await mockDelay();
      return [...mockSchedules];
    }

    const response = await apiClient.get<Schedule[]>('/reminders');
    return response.data;
  },

  async getById(id: number): Promise<Schedule> {
    if (useMockApi) {
      await mockDelay();
      const schedule = mockSchedules.find((item) => item.id === id);
      if (!schedule) throw new Error('Lịch nhắc không tồn tại');
      return schedule;
    }

    const response = await apiClient.get<Schedule>(`/reminders/${id}`);
    return response.data;
  },

  async create(data: CreateReminderRequest): Promise<Schedule> {
    if (useMockApi) {
      await mockDelay();
      const now = new Date().toISOString();
      const schedule: Schedule = {
        id: nextScheduleId(),
        user_id: 1,
        medication_id: data.medication_id,
        frequency: data.frequency,
        time_to_take: data.time_to_take,
        created_at: now,
        updated_at: now,
      };
      mockSchedules.unshift(schedule);
      return schedule;
    }

    const response = await apiClient.post<Schedule>('/reminders', data);
    return response.data;
  },

  async update(id: number, data: UpdateReminderRequest): Promise<Schedule> {
    if (useMockApi) {
      await mockDelay();
      const index = mockSchedules.findIndex((item) => item.id === id);
      if (index === -1) throw new Error('Lịch nhắc không tồn tại');
      const updated: Schedule = { ...mockSchedules[index], ...data, updated_at: new Date().toISOString() };
      mockSchedules[index] = updated;
      return updated;
    }

    const response = await apiClient.put<Schedule>(`/reminders/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    if (useMockApi) {
      await mockDelay();
      const index = mockSchedules.findIndex((item) => item.id === id);
      if (index !== -1) mockSchedules.splice(index, 1);
      return;
    }

    await apiClient.delete(`/reminders/${id}`);
  },
};

export const reminderApi = scheduleApi;
