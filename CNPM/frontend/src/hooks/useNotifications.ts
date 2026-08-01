'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/services/notification.api';
import { NotificationResponse } from '@/types/api';
import { useToastStore } from '@/store/useToastStore';

export function useNotifications() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data: notifications = [], isLoading, isError, refetch } = useQuery<NotificationResponse[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
    staleTime: 1000 * 60 * 2,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      addToast({
        type: 'info',
        title: 'Đã đọc tất cả',
        description: 'Tất cả thông báo đã được đánh dấu là đã đọc.',
      });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    isError,
    refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    deleteNotification: deleteNotificationMutation.mutateAsync,
  };
}
