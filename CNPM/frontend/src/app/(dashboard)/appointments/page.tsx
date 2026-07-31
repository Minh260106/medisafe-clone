'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { AppointmentCard } from '@/components/ui/AppointmentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { appointmentApi } from '@/services/appointment.api';
import { useDebounce } from '@/hooks/useDebounce';
import { Appointment } from '@/types';

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 250);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');

  const { data: response, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentApi.getAppointments(),
  });

  const appointments = response?.data || [];

  const createMutation = useMutation({
    mutationFn: (newApt: Omit<Appointment, 'id'>) => appointmentApi.createAppointment(newApt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Appointment> }) =>
      appointmentApi.updateAppointment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => appointmentApi.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setDeletingId(null);
    },
  });

  const openAddModal = () => {
    setEditingApt(null);
    setDoctorName('');
    setSpecialty('Khoa Tim mạch');
    setClinicName('');
    setAddress('');
    setAppointmentDate(new Date().toISOString().split('T')[0]);
    setAppointmentTime('09:00');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (apt: Appointment) => {
    setEditingApt(apt);
    setDoctorName(apt.doctorName);
    setSpecialty(apt.specialty);
    setClinicName(apt.clinicName);
    setAddress(apt.address || '');
    setAppointmentDate(apt.appointmentDate);
    setAppointmentTime(apt.appointmentTime);
    setNotes(apt.notes || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingApt(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      doctorName,
      specialty,
      clinicName,
      address,
      appointmentDate,
      appointmentTime,
      status: editingApt ? editingApt.status : ('upcoming' as const),
      notes,
    };

    if (editingApt) {
      updateMutation.mutate({ id: editingApt.id, updates: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.doctorName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      apt.clinicName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(debouncedSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lịch Hẹn Khám Bệnh</h1>
            <p className="text-xs text-slate-500">Quản lý danh sách lịch khám bác sĩ & nhắc nhở đúng hẹn</p>
          </div>

          <Button variant="primary" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />} className="bg-blue-600 hover:bg-blue-700">
            Đặt lịch khám mới
          </Button>
        </div>

        {/* Filter Bar */}
        <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <Input
              placeholder="Tìm tên bác sĩ, bệnh viện, chuyên khoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tất cả ({appointments.length})
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'upcoming'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Sắp tới
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Đã khám
            </button>
          </div>
        </Card>

        {/* Appointments Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            title="Không tìm thấy lịch hẹn nào"
            description="Hãy tạo lịch hẹn khám bác sĩ mới để nhận nhắc nhở tự động trước ngày khám."
            actionLabel="Đặt lịch khám mới ngay"
            onAction={openAddModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onEdit={openEditModal}
                onDelete={(a) => setDeletingId(a.id)}
                onMarkComplete={(a) => updateMutation.mutate({ id: a.id, updates: { status: 'completed' } })}
              />
            ))}
          </div>
        )}

        {/* Modal Add / Edit */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingApt ? 'Chỉnh Sửa Lịch Hẹn Khám' : 'Đặt Lịch Hẹn Khám Bệnh Mới'}
          maxWidth="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tên Bác Sĩ"
              placeholder="VD: BS. CKII Nguyễn Thanh Sơn"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Chuyên Khoa</label>
                <input
                  type="text"
                  placeholder="VD: Khoa Tim mạch"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-xs border border-transparent focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tên Bệnh Viện / Phòng Khám</label>
                <input
                  type="text"
                  placeholder="VD: Bệnh viện Đa khoa Tâm Anh"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-xs border border-transparent focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <Input
              label="Địa chỉ Phòng khám"
              placeholder="108 Hoàng Như Tiếp, Long Biên, Hà Nội"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ngày Khám"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />

              <Input
                label="Giờ Khám"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ghi Chú Y Khoa</label>
              <textarea
                rows={3}
                placeholder="VD: Mang theo kết quả xét nghiệm cũ, nhịn ăn sáng..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-xs border border-transparent focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={closeModal}>
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="bg-blue-600 hover:bg-blue-700"
                isLoading={createMutation.isPending || updateMutation.isPending}
              >
                {editingApt ? 'Lưu cập nhật' : 'Tạo lịch hẹn'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Dialog */}
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
          title="Xóa Lịch Hẹn Khám Bệnh?"
          message="Bạn có chắc chắn muốn xóa lịch hẹn này không?"
          isLoading={deleteMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
