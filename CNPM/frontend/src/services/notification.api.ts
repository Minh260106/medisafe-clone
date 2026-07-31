import { AppNotification, ApiResponse } from '@/types';
import { initialMockNotifications } from './mockData';

let mockNotifications = [...initialMockNotifications];

export const notificationApi = {
  getNotifications: async (): Promise<ApiResponse<AppNotification[]>> => {
    await new Promise((res) => setTimeout(res, 200));
    return { data: [...mockNotifications], success: true };
  },

  markAsRead: async (id: string): Promise<ApiResponse<AppNotification>> => {
    await new Promise((res) => setTimeout(res, 150));
    const index = mockNotifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      mockNotifications[index] = { ...mockNotifications[index], isRead: true };
    }
    return { data: mockNotifications[index], success: true };
  },

  markAllAsRead: async (): Promise<ApiResponse<boolean>> => {
    await new Promise((res) => setTimeout(res, 200));
    mockNotifications = mockNotifications.map((n) => ({ ...n, isRead: true }));
    return { data: true, success: true };
  },

  deleteNotification: async (id: string): Promise<ApiResponse<boolean>> => {
    await new Promise((res) => setTimeout(res, 150));
    mockNotifications = mockNotifications.filter((n) => n.id !== id);
    return { data: true, success: true };
  },
};
