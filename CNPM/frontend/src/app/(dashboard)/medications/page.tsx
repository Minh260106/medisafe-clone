'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Plus,
  Search,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { medicationApi, MedicationPayload } from '@/services/medication.api';
import { scheduleApi } from '@/services/schedule.api';
import { logApi } from '@/services/log.api';
import { downloadCsv, getApiErrorMessage } from '@/utils/medisafe';
import { Medication, Schedule } from '@/types';
import { useToastStore } from '@/store/useToastStore';
import { restoreMockMedication } from '@/services/mockFixtures';
import { useMockApi } from '@/services/serviceMode';

type SortMode = 'name-asc' | 'name-desc' | 'stock-asc' | 'stock-desc' | 'updated-desc';
type FilterMode = 'all' | 'low-stock';

const DEFAULT_FORM: MedicationPayload = {
  name: '',
  form: '',
  dosage: '',
  stock: 0,
};

const LOW_STOCK_THRESHOLD = 5;
const PAGE_SIZE = 8;

export default function MedicationsPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('name-asc');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Medication | null>(null);
  const [formData, setFormData] = useState<MedicationPayload>(DEFAULT_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const medicationsQuery = useQuery({
    queryKey: ['medications'],
    queryFn: () => medicationApi.getAll(),
  });

  const schedulesQuery = useQuery({
    queryKey: ['schedules'],
    queryFn: () => scheduleApi.list(),
  });

  const logsQuery = useQuery({
    queryKey: ['logs'],
    queryFn: () => logApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: MedicationPayload) => medicationApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['medications'] });
      setIsFormOpen(false);
      setEditingMedication(null);
      setFormData(DEFAULT_FORM);
    },
    onError: (error) => setFormError(getApiErrorMessage(error, 'Không thể tạo thuốc mới.')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MedicationPayload }) => medicationApi.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['medications'] });
      setIsFormOpen(false);
      setEditingMedication(null);
      setFormData(DEFAULT_FORM);
    },
    onError: (error) => setFormError(getApiErrorMessage(error, 'Không thể cập nhật thuốc.')),
  });

  const deleteMutation = useMutation({
    mutationFn: async (medication: Medication) => {
      await medicationApi.delete(medication.id);
      return medication;
    },
    onSuccess: async (deletedMedication) => {
      await queryClient.invalidateQueries({ queryKey: ['medications'] });
      await queryClient.invalidateQueries({ queryKey: ['schedules'] });
      await queryClient.invalidateQueries({ queryKey: ['logs'] });
      setDeleteTarget(null);

      addToast({
        type: 'success',
        title: 'Đã xoá thuốc',
        description: `${deletedMedication.name} đã được xoá thành công.`,
        duration: useMockApi ? 8000 : 4000,
        actionLabel: useMockApi ? 'Hoàn tác' : undefined,
        onAction: useMockApi
          ? () => {
              restoreMockMedication(deletedMedication);
              queryClient.invalidateQueries({ queryKey: ['medications'] });
              queryClient.invalidateQueries({ queryKey: ['schedules'] });
              queryClient.invalidateQueries({ queryKey: ['logs'] });
            }
          : undefined,
      });
    },
    onError: (error) => {
      setFormError(getApiErrorMessage(error, 'Không thể xoá thuốc.'));
      addToast({
        type: 'error',
        title: 'Không thể xoá thuốc',
        description: getApiErrorMessage(error, 'Đã xảy ra lỗi khi xoá thuốc.'),
      });
    },
  });

  const medications = medicationsQuery.data || [];
  const schedules = schedulesQuery.data || [];
  const logs = logsQuery.data || [];

  const scheduleMap = useMemo(() => {
    const map = new Map<number, Schedule[]>();
    schedules.forEach((schedule) => {
      const current = map.get(schedule.medication_id) || [];
      map.set(schedule.medication_id, [...current, schedule]);
    });
    return map;
  }, [schedules]);

  const filteredMedications = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    const items = medications.filter((medication) => {
      const matchesSearch =
        medication.name.toLowerCase().includes(search) ||
        medication.form.toLowerCase().includes(search) ||
        medication.dosage.toLowerCase().includes(search);
      const matchesFilter = filterMode === 'all' || medication.stock <= LOW_STOCK_THRESHOLD;
      return matchesSearch && matchesFilter;
    });

    items.sort((left, right) => {
      switch (sortMode) {
        case 'name-desc':
          return right.name.localeCompare(left.name);
        case 'stock-asc':
          return left.stock - right.stock;
        case 'stock-desc':
          return right.stock - left.stock;
        case 'updated-desc':
          return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
        case 'name-asc':
        default:
          return left.name.localeCompare(right.name);
      }
    });

    return items;
  }, [filterMode, medications, searchQuery, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filteredMedications.length / PAGE_SIZE));
  const paginatedMedications = filteredMedications.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreateModal = () => {
    setEditingMedication(null);
    setFormData(DEFAULT_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditModal = (medication: Medication) => {
    setEditingMedication(medication);
    setFormData({ name: medication.name, form: medication.form, dosage: medication.dosage, stock: medication.stock });
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMedication(null);
    setFormError(null);
    setFormData(DEFAULT_FORM);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.form.trim() || !formData.dosage.trim()) {
      setFormError('Vui lòng nhập đầy đủ tên, dạng bào chế và liều lượng.');
      return;
    }

    if (editingMedication) {
      updateMutation.mutate({ id: editingMedication.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleExportCsv = () => {
    downloadCsv(
      `medisafe-medications-${new Date().toISOString().slice(0, 10)}.csv`,
      ['ID', 'Tên thuốc', 'Dạng bào chế', 'Liều lượng', 'Tồn kho', 'Cập nhật cuối'],
      filteredMedications.map((medication) => [
        medication.id,
        medication.name,
        medication.form,
        medication.dosage,
        medication.stock,
        format(new Date(medication.updated_at), 'dd/MM/yyyy HH:mm'),
      ])
    );
  };

  const selectedSchedules = selectedMedication ? scheduleMap.get(selectedMedication.id) || [] : [];
  const selectedLogs = useMemo(() => {
    if (!selectedMedication) return [];
    const scheduleIds = new Set(selectedSchedules.map((schedule) => schedule.id));
    return logs.filter((log) => scheduleIds.has(log.schedule_id));
  }, [logs, selectedMedication, selectedSchedules]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Danh mục thuốc</h1>
            <p className="text-xs text-slate-500">CRUD thật với 4 field backend hỗ trợ: name, form, dosage, stock.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleExportCsv} leftIcon={<Download className="w-4 h-4" />}>
              Xuất CSV
            </Button>
            <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
              Thêm thuốc
            </Button>
          </div>
        </div>

        <Card className="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Tìm theo tên, dạng bào chế hoặc liều lượng"
              value={searchQuery}
              onChange={(event) => {
                setCurrentPage(1);
                setSearchQuery(event.target.value);
              }}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={filterMode === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setCurrentPage(1);
                setFilterMode('all');
              }}
              leftIcon={<Filter className="w-4 h-4" />}
            >
              Tất cả ({medications.length})
            </Button>
            <Button
              variant={filterMode === 'low-stock' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => {
                setCurrentPage(1);
                setFilterMode('low-stock');
              }}
              leftIcon={<AlertTriangle className="w-4 h-4" />}
            >
              Sắp hết kho
            </Button>

            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs px-3 py-2.5 text-slate-900 dark:text-slate-100"
            >
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="stock-asc">Tồn kho tăng dần</option>
              <option value="stock-desc">Tồn kho giảm dần</option>
              <option value="updated-desc">Mới cập nhật</option>
            </select>
          </div>
        </Card>

        {medicationsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        ) : medicationsQuery.error ? (
          <EmptyState
            title="Không tải được danh sách thuốc"
            description={getApiErrorMessage(medicationsQuery.error, 'Không thể kết nối đến backend.')}
          />
        ) : filteredMedications.length === 0 ? (
          <EmptyState
            title="Chưa có thuốc nào phù hợp"
            description="Hãy thêm thuốc mới hoặc thay đổi bộ lọc để xem dữ liệu khác."
            actionLabel="Thêm thuốc"
            onAction={openCreateModal}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedMedications.map((medication) => (
                <Card key={medication.id} className="p-5 space-y-4 border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white">{medication.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {medication.form} · {medication.dosage}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        medication.stock <= LOW_STOCK_THRESHOLD
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {medication.stock <= LOW_STOCK_THRESHOLD ? 'Sắp hết' : 'Còn đủ'}
                    </span>
                  </div>

                  <div className="flex items-end justify-between text-xs text-slate-500">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Tồn kho</div>
                      <div>{medication.stock}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 dark:text-white">Cập nhật</div>
                      <div>{format(new Date(medication.updated_at), 'dd/MM/yyyy HH:mm')}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button size="sm" variant="outline" onClick={() => setSelectedMedication(medication)} leftIcon={<Eye className="w-4 h-4" />}>
                      Chi tiết
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditModal(medication)}>
                      Sửa
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setDeleteTarget(medication)}>
                      Xoá
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Hiển thị {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredMedications.length)}-
                {Math.min(currentPage * PAGE_SIZE, filteredMedications.length)} / {filteredMedications.length}
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
          onClose={closeForm}
          title={editingMedication ? 'Chỉnh sửa thuốc' : 'Thêm thuốc mới'}
          description="Backend chỉ hỗ trợ 4 trường này, vì vậy form được giữ đúng contract thực tế."
          maxWidth="md"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            {formError && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{formError}</div>}
            <Input label="Tên thuốc" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} required />
            <Input label="Dạng bào chế" value={formData.form} onChange={(event) => setFormData((current) => ({ ...current, form: event.target.value }))} placeholder="Viên, Sirô, Kem..." required />
            <Input label="Liều lượng" value={formData.dosage} onChange={(event) => setFormData((current) => ({ ...current, dosage: event.target.value }))} placeholder="500mg, 1 viên..." required />
            <Input label="Tồn kho" type="number" min={0} step="0.01" value={formData.stock} onChange={(event) => setFormData((current) => ({ ...current, stock: Number(event.target.value) }))} required />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Huỷ
              </Button>
              <Button type="submit" variant="primary" isLoading={createMutation.isPending || updateMutation.isPending}>
                {editingMedication ? 'Lưu thay đổi' : 'Tạo thuốc'}
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={!!selectedMedication}
          onClose={() => setSelectedMedication(null)}
          title={selectedMedication ? `Chi tiết thuốc: ${selectedMedication.name}` : 'Chi tiết thuốc'}
          maxWidth="lg"
        >
          {selectedMedication && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <Card className="p-4">
                  <div className="text-xs text-slate-500">Dạng bào chế</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{selectedMedication.form}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs text-slate-500">Liều lượng</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{selectedMedication.dosage}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs text-slate-500">Tồn kho</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{selectedMedication.stock}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs text-slate-500">Lần tạo lịch</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{selectedSchedules.length}</div>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">Lịch liên quan</h4>
                {selectedSchedules.length === 0 ? (
                  <p className="text-xs text-slate-500">Chưa có lịch nào được gắn với thuốc này.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedSchedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-xs">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{schedule.frequency}</div>
                          <div className="text-slate-500">{schedule.time_to_take}</div>
                        </div>
                        <div className="text-slate-500">#{schedule.id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">Nhật ký liên quan</h4>
                {selectedLogs.length === 0 ? (
                  <p className="text-xs text-slate-500">Chưa có log uống thuốc cho các lịch này.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {selectedLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-xs">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{log.status}</div>
                          <div className="text-slate-500">{format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm')}</div>
                        </div>
                        <div className="text-slate-500">#{log.id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
          title="Xoá thuốc"
          message="Thao tác này sẽ xoá thuốc thật khỏi database và có thể ảnh hưởng các lịch liên quan."
          isLoading={deleteMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
