'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { notificationApi } from '@/services/notification.api';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState<'all' | 'reminder' | 'appointment' | 'system' | 'warning'>('all');

  const { data: response, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
  });

  const notifications = response?.data || [];

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const filteredNotifications = notifications.filter((n) => {
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Trung Tâm Thông Báo</h1>
            <p className="text-xs text-slate-500">Quản lý toàn bộ nhắc nhở uống thuốc, lịch hẹn khám và cảnh báo hệ thống</p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllReadMutation.mutate()}
              leftIcon={<CheckCheck className="w-4 h-4 text-blue-600" />}
              isLoading={markAllReadMutation.isPending}
            >
              Đánh dấu tất cả đã đọc ({unreadCount})
            </Button>
          )}
        </div>

        {/* Category Tabs */}
        <Card className="p-3 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              typeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            onClick={() => setTypeFilter('reminder')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              typeFilter === 'reminder'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Nhắc uống thuốc
          </button>
          <button
            onClick={() => setTypeFilter('warning')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              typeFilter === 'warning'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Cảnh báo tồn kho
          </button>
          <button
            onClick={() => setTypeFilter('appointment')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              typeFilter === 'appointment'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Lịch hẹn khám
          </button>
        </Card>

        {/* Notification List */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            title="Không có thông báo nào"
            description="Các thông báo mới về nhắc nhở uống thuốc và cảnh báo tồn kho sẽ hiển thị ở đây."
          />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onMarkRead={(n) => markReadMutation.mutate(n.id)}
                onDelete={(n) => deleteMutation.mutate(n.id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
