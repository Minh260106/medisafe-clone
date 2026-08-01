'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationApi } from '@/services/medication.api';
import { Medication } from '@/types';
import { CreateMedicationRequest, UpdateMedicationRequest } from '@/types/api';
import { useToastStore } from '@/store/useToastStore';
import { restoreMockMedication } from '@/services/mockFixtures';

export function useMedications() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data: medications = [], isLoading, isError, error, refetch } = useQuery<Medication[]>({
    queryKey: ['medications'],
    queryFn: () => medicationApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateMedicationRequest) => medicationApi.create(data),
    onSuccess: (newMed) => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      addToast({
        type: 'success',
        title: 'Thêm thuốc thành công',
        description: `Đã thêm "${newMed.name}" vào danh sách tủ thuốc.`,
      });
    },
    onError: (err: { message?: string }) => {
      addToast({
        type: 'error',
        title: 'Lỗi khi thêm thuốc',
        description: err.message || 'Không thể thêm thuốc mới.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMedicationRequest }) =>
      medicationApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      addToast({
        type: 'success',
        title: 'Cập nhật thành công',
        description: `Đã cập nhật thông tin thuốc "${updated.name}".`,
      });
    },
    onError: (err: { message?: string }) => {
      addToast({
        type: 'error',
        title: 'Lỗi cập nhật',
        description: err.message || 'Không thể cập nhật thuốc.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => medicationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });

  const restoreMedication = (medication: Medication) => {
    restoreMockMedication(medication);
    queryClient.invalidateQueries({ queryKey: ['medications'] });
  };

  return {
    medications,
    isLoading,
    isError,
    error,
    refetch,
    createMedication: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateMedication: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteMedication: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    restoreMedication,
  };
}
