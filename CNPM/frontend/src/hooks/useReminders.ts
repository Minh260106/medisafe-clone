'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleApi } from '@/services/schedule.api';
import { Schedule } from '@/types';
import { CreateReminderRequest, UpdateReminderRequest } from '@/types/api';
import { useToastStore } from '@/store/useToastStore';

export function useReminders() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data: reminders = [], isLoading, isError, error, refetch } = useQuery<Schedule[]>({
    queryKey: ['reminders'],
    queryFn: () => scheduleApi.list(),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateReminderRequest) => scheduleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      addToast({
        type: 'success',
        title: 'Tạo lịch nhắc thành công',
        description: 'Lịch nhắc đã được thiết lập.',
      });
    },
    onError: (err: { message?: string }) => {
      addToast({
        type: 'error',
        title: 'Không thể tạo lịch nhắc',
        description: err.message || 'Có lỗi xảy ra khi tạo lịch.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReminderRequest }) =>
      scheduleApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      addToast({
        type: 'success',
        title: 'Cập nhật thành công',
        description: 'Thông tin lịch nhắc đã thay đổi.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => scheduleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  return {
    reminders,
    isLoading,
    isError,
    error,
    refetch,
    createReminder: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateReminder: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteReminder: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
