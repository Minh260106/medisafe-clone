'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarClock, ChevronLeft, ChevronRight, Plus, Search, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { medicationApi } from '@/services/medication.api';
import { scheduleApi, SchedulePayload } from '@/services/schedule.api';
import { downloadCsv, getApiErrorMessage } from '@/utils/medisafe';
import { Schedule } from '@/types';

type SortMode = 'time-asc' | 'time-desc' | 'updated-desc';

const DEFAULT_FORM: SchedulePayload = {
  medication_id: 0,
  frequency: '',
  time_to_take: '08:00',
};

export default function SchedulePage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('time-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState<SchedulePayload>(DEFAULT_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const medicationsQuery = useQuery({
    queryKey: ['medications'],
    queryFn: () => medicationApi.getAll(),
  });

  const schedulesQuery = useQuery({
    queryKey: ['schedules'],
    queryFn: () => scheduleApi.list(),
  });

  const medications = medicationsQuery.data || [];
  const schedules = schedulesQuery.data || [];

  const medicationMap = useMemo(() => {
    return new Map(medications.map((medication) => [medication.id, medication]));
  }, [medications]);

  const filteredSchedules = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    const items = schedules.filter((schedule) => {
      const medication = medicationMap.get(schedule.medication_id);
      const medicationName = medication?.name || `#${schedule.medication_id}`;
      return (
        medicationName.toLowerCase().includes(search) ||
        schedule.frequency.toLowerCase().includes(search) ||
        schedule.time_to_take.includes(search)
      );
    });

    items.sort((left, right) => {
      switch (sortMode) {
        case 'time-desc':
          return right.time_to_take.localeCompare(left.time_to_take);
        case 'updated-desc':
          return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
        case 'time-asc':
        default:
          return left.time_to_take.localeCompare(right.time_to_take);
      }
    });

    return items;
  }, [medicationMap, schedules, searchQuery, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filteredSchedules.length / 8));
  const paginatedSchedules = filteredSchedules.slice((currentPage - 1) * 8, currentPage * 8);

  const createMutation = useMutation({
    mutationFn: (payload: SchedulePayload) => scheduleApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsFormOpen(false);
      setEditingSchedule(null);
      setFormData(DEFAULT_FORM);
    },
    onError: (error) => setFormError(getApiErrorMessage(error, 'Không thể tạo lịch.')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SchedulePayload }) => scheduleApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsFormOpen(false);
      setEditingSchedule(null);
      setFormData(DEFAULT_FORM);
    },
    onError: (error) => setFormError(getApiErrorMessage(error, 'Không thể cập nhật lịch.')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => scheduleApi.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['schedules'] });
      await queryClient.invalidateQueries({ queryKey: ['logs'] });
      setDeleteTarget(null);
    },
    onError: (error) => setFormError(getApiErrorMessage(error, 'Không thể xoá lịch.')),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.medication_id || !formData.frequency.trim() || !formData.time_to_take.trim()) {
      setFormError('Vui lòng chọn thuốc, nhập tần suất và giờ uống.');
      return;
    }

    if (editingSchedule) {
      updateMutation.mutate({ id: editingSchedule.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openCreateModal = () => {
    setEditingSchedule(null);
    setFormData({ ...DEFAULT_FORM, medication_id: medications[0]?.id || 0 });
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      medication_id: schedule.medication_id,
      frequency: schedule.frequency,
      time_to_take: schedule.time_to_take,
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleExportCsv = () => {
    downloadCsv(
      `medisafe-schedules-${new Date().toISOString().slice(0, 10)}.csv`,
      ['ID', 'Thuốc', 'Tần suất', 'Giờ uống', 'Cập nhật cuối'],
      filteredSchedules.map((schedule) => [
        schedule.id,
        medicationMap.get(schedule.medication_id)?.name || `#${schedule.medication_id}`,
        schedule.frequency,
        schedule.time_to_take,
        format(new Date(schedule.updated_at), 'dd/MM/yyyy HH:mm'),
      ])
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lịch thuốc</h1>
            <p className="text-xs text-slate-500">Mỗi lịch chỉ có 1 mốc giờ, đúng với backend thật. Muốn nhiều mốc thì tạo nhiều record.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleExportCsv}>Xuất CSV</Button>
            <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
              Thêm lịch
            </Button>
          </div>
        </div>

        <Card className="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Tìm theo tên thuốc, tần suất hoặc giờ"
              value={searchQuery}
              onChange={(event) => {
                setCurrentPage(1);
                setSearchQuery(event.target.value);
              }}
              className="pl-10"
            />
          </div>

          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs px-3 py-2.5 text-slate-900 dark:text-slate-100"
          >
            <option value="time-asc">Giờ tăng dần</option>
            <option value="time-desc">Giờ giảm dần</option>
            <option value="updated-desc">Mới cập nhật</option>
          </select>
        </Card>

        {schedulesQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : schedulesQuery.error ? (
          <EmptyState title="Không tải được lịch" description={getApiErrorMessage(schedulesQuery.error, 'Không thể kết nối đến backend.')} />
        ) : filteredSchedules.length === 0 ? (
          <EmptyState
            title="Chưa có lịch nào"
            description="Tạo lịch đầu tiên để Reminder và History có dữ liệu thật."
            actionLabel="Thêm lịch"
            onAction={openCreateModal}
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {paginatedSchedules.map((schedule) => {
                const medication = medicationMap.get(schedule.medication_id);
                return (
                  <Card key={schedule.id} className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-slate-200/80 dark:border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 text-sky-600" />
                        <h3 className="font-extrabold text-slate-900 dark:text-white">{medication?.name || `Thuốc #${schedule.medication_id}`}</h3>
                      </div>
                      <p className="text-xs text-slate-500">{schedule.frequency}</p>
                      <p className="text-xs text-slate-500">Giờ uống: <span className="font-semibold text-slate-800 dark:text-slate-200">{schedule.time_to_take}</span></p>
                    </div>

                    <div className="flex flex-wrap gap-2 self-start md:self-center">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(schedule)}>Sửa</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteTarget(schedule)} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                        Xoá
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Hiển thị {Math.min((currentPage - 1) * 8 + 1, filteredSchedules.length)}-
                {Math.min(currentPage * 8, filteredSchedules.length)} / {filteredSchedules.length}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setCurrentPage((value) => Math.max(1, value - 1))} leftIcon={<ChevronLeft className="w-4 h-4" />}>
                  Trước
                </Button>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {currentPage} / {totalPages}
                </span>
                <Button size="sm" variant="outline" onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))} rightIcon={<ChevronRight className="w-4 h-4" />}>
                  Sau
                </Button>
              </div>
            </div>
          </div>
        )}

        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={editingSchedule ? 'Chỉnh sửa lịch' : 'Thêm lịch mới'}
          description="Dữ liệu sẽ được lưu thật vào /api/schedules."
          maxWidth="md"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            {formError && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{formError}</div>}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Thuốc</label>
              <select
                value={formData.medication_id}
                onChange={(event) => setFormData((current) => ({ ...current, medication_id: Number(event.target.value) }))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 p-3 outline-none"
              >
                <option value={0}>-- Chọn thuốc --</option>
                {medications.map((medication) => (
                  <option key={medication.id} value={medication.id}>
                    {medication.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Tần suất"
              value={formData.frequency}
              onChange={(event) => setFormData((current) => ({ ...current, frequency: event.target.value }))}
              placeholder="Ví dụ: 2 lần/ngày sau ăn"
              required
            />

            <Input
              label="Giờ uống"
              type="time"
              value={formData.time_to_take}
              onChange={(event) => setFormData((current) => ({ ...current, time_to_take: event.target.value }))}
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Huỷ
              </Button>
              <Button type="submit" variant="primary" isLoading={createMutation.isPending || updateMutation.isPending}>
                {editingSchedule ? 'Lưu thay đổi' : 'Tạo lịch'}
              </Button>
            </div>
          </form>
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
          title="Xoá lịch"
          message="Xoá lịch sẽ ảnh hưởng trực tiếp tới Reminder và History."
          isLoading={deleteMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
