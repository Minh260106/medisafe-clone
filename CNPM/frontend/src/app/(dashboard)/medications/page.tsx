'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Grid,
  List,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { MedicineCard } from '@/components/ui/MedicineCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { AddMedicationModal } from '@/components/modules/medications/AddMedicationModal';
import { medicationApi } from '@/services/medication.api';
import { useDebounce } from '@/hooks/useDebounce';
import { Medication, PillShape } from '@/types';

const PRESET_MEDICATIONS = [
  {
    name: 'Paracetamol 650mg (Cảm Cúm)',
    description: 'Giảm đau hạ sốt nhanh chóng',
    dosage: 650,
    unit: 'mg',
    shape: 'round' as PillShape,
    color: '#ef4444',
    stockQuantity: 20,
    lowStockThreshold: 5,
    frequencyTimesPerDay: 3,
    reminderTimes: ['08:00', '13:00', '19:00'],
    startDate: new Date().toISOString().split('T')[0],
  },
  {
    name: 'Amoxicillin 500mg (Kháng Sinh)',
    description: 'Kháng sinh điều trị nhiễm khuẩn đường hô hấp',
    dosage: 500,
    unit: 'mg',
    shape: 'capsule' as PillShape,
    color: '#2563eb',
    stockQuantity: 30,
    lowStockThreshold: 6,
    frequencyTimesPerDay: 2,
    reminderTimes: ['08:00', '20:00'],
    startDate: new Date().toISOString().split('T')[0],
  },
  {
    name: 'Omega-3 Fish Oil 1000mg',
    description: 'Bổ sung axit béo tốt cho tim mạch & trí nhớ',
    dosage: 1000,
    unit: 'mg',
    shape: 'oval' as PillShape,
    color: '#f59e0b',
    stockQuantity: 60,
    lowStockThreshold: 10,
    frequencyTimesPerDay: 1,
    reminderTimes: ['07:30'],
    startDate: new Date().toISOString().split('T')[0],
  },
];

export default function MedicationsPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 250);
  const [filterCategory, setFilterCategory] = useState<'all' | 'low_stock' | 'capsule'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [deletingMedId, setDeletingMedId] = useState<string | null>(null);

  // Queries
  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: () => medicationApi.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newMed: Omit<Medication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      medicationApi.create(newMed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Medication> }) =>
      medicationApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => medicationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      setDeletingMedId(null);
    },
  });

  const openAddModal = () => {
    setEditingMed(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (med: Medication) => {
    setEditingMed(med);
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingMed(null);
  };

  const filteredMeds = medications?.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (filterCategory === 'low_stock') return m.stockQuantity <= m.lowStockThreshold;
    if (filterCategory === 'capsule') return m.shape === 'capsule';
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Quản Lý Tủ Thuốc Cá Nhân</h1>
            <p className="text-xs text-slate-500">Danh mục đầy đủ các loại thuốc, liều lượng và cảnh báo tồn kho</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPresetModalOpen(true)}
              leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
              className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            >
              Nạp thuốc mẫu
            </Button>

            {/* View Switcher */}
            <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Grid className="w-4 h-4" /> Lưới
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <List className="w-4 h-4" /> Bảng
              </button>
            </div>

            <Button variant="primary" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />} className="bg-blue-600 hover:bg-blue-700">
              Thêm thuốc mới
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <Input
              placeholder="Tìm theo tên thuốc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tất cả ({medications?.length || 0})
            </button>
            <button
              onClick={() => setFilterCategory('low_stock')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                filterCategory === 'low_stock'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Sắp hết kho
            </button>
            <button
              onClick={() => setFilterCategory('capsule')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCategory === 'capsule'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Dạng viên nhộng
            </button>
          </div>
        </Card>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : filteredMeds?.length === 0 ? (
          <EmptyState
            title="Không tìm thấy loại thuốc nào"
            description="Hãy thử thay đổi từ khóa tìm kiếm hoặc thêm loại thuốc mới vào tủ thuốc gia đình."
            actionLabel="Thêm thuốc mới ngay"
            onAction={openAddModal}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeds?.map((med) => (
              <MedicineCard
                key={med.id}
                medication={med}
                onEdit={openEditModal}
                onDelete={(m) => setDeletingMedId(m.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold uppercase">
                <tr>
                  <th className="p-4">Tên Thuốc</th>
                  <th className="p-4">Liều Lượng</th>
                  <th className="p-4">Tần Suất</th>
                  <th className="p-4">Kho Còn Lại</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredMeds?.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{med.name}</td>
                    <td className="p-4">{med.dosage} {med.unit}</td>
                    <td className="p-4">{med.frequencyTimesPerDay} lần/ngày</td>
                    <td className="p-4 font-bold">{med.stockQuantity} {med.unit}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(med)}>
                        Sửa
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setDeletingMedId(med.id)}>
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* Preset Modal */}
        <Modal
          isOpen={isPresetModalOpen}
          onClose={() => setIsPresetModalOpen(false)}
          title="Nạp Nhanh Thuốc Mẫu Theo Đơn"
          maxWidth="md"
        >
          <div className="space-y-3">
            {PRESET_MEDICATIONS.map((preset, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-amber-400"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{preset.name}</h4>
                  <p className="text-xs text-slate-500">{preset.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    createMutation.mutate(preset);
                    setIsPresetModalOpen(false);
                  }}
                  leftIcon={<Zap className="w-3.5 h-3.5" />}
                >
                  Nạp ngay
                </Button>
              </div>
            ))}
          </div>
        </Modal>

        {/* Add/Edit Modal */}
        <AddMedicationModal
          isOpen={isAddModalOpen}
          onClose={closeModal}
          onSave={(medData) => {
            if (editingMed) updateMutation.mutate({ id: editingMed.id, data: medData });
            else createMutation.mutate(medData as any);
          }}
          initialData={editingMed}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        {/* Delete Dialog */}
        <ConfirmDialog
          isOpen={!!deletingMedId}
          onClose={() => setDeletingMedId(null)}
          onConfirm={() => deletingMedId && deleteMutation.mutate(deletingMedId)}
          title="Xóa Thuốc khỏi Tủ Thuốc?"
          message="Hành động này sẽ xóa vĩnh viễn thuốc và toàn bộ lịch nhắc liên quan."
          isLoading={deleteMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
