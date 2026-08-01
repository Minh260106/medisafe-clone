import { apiClient } from './apiClient';
import { NotificationResponse } from '@/types/api';
import { mockDelay, useMockApi } from './serviceMode';
import { mockNotifications } from './mockFixtures';

export const notificationApi = {
  async getNotifications(): Promise<NotificationResponse[]> {
    if (useMockApi) {
      await mockDelay();
      return [...mockNotifications];
    }

    const response = await apiClient.get<NotificationResponse[]>('/notifications');
    return response.data;
  },

  async markAsRead(id: string): Promise<NotificationResponse> {
    if (useMockApi) {
      await mockDelay();
      const notif = mockNotifications.find((n) => n.id === id);
      if (!notif) throw new Error('Thông báo không tồn tại');
      notif.is_read = true;
      return { ...notif };
    }

    const response = await apiClient.put<NotificationResponse>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    if (useMockApi) {
      await mockDelay();
      mockNotifications.forEach((n) => {
        n.is_read = true;
      });
      return { success: true };
    }

    const response = await apiClient.put<{ success: boolean }>('/notifications/read-all');
    return response.data;
  },

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    if (useMockApi) {
      await mockDelay();
      const idx = mockNotifications.findIndex((n) => n.id === id);
      if (idx !== -1) mockNotifications.splice(idx, 1);
      return { success: true };
    }

    await apiClient.delete(`/notifications/${id}`);
    return { success: true };
  },
};
