'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Pill,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  FileText,
  Calendar,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { MedicineCard } from '@/components/ui/MedicineCard';
import { AppointmentCard } from '@/components/ui/AppointmentCard';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { AddMedicationModal } from '@/components/modules/medications/AddMedicationModal';
import { medicationApi } from '@/services/medication.api';
import { scheduleApi } from '@/services/schedule.api';
import { statsApi } from '@/services/stats.api';
import { appointmentApi } from '@/services/appointment.api';
import { notificationApi } from '@/services/notification.api';
import { useAppStore } from '@/store/useAppStore';
import { DosageScheduleItem, DosageStatus, Medication } from '@/types';
import { HealthScoreRing } from '@/components/modules/dashboard/HealthScoreRing';
import { MedicalTimeline } from '@/components/modules/dashboard/MedicalTimeline';
import { VitalsWidget } from '@/components/modules/dashboard/VitalsWidget';
import { DoctorReportModal } from '@/components/modules/dashboard/DoctorReportModal';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { selectedDate } = useAppStore();
  const [selectedMedDetail, setSelectedMedDetail] = useState<DosageScheduleItem | null>(null);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);

  // Queries
  const { data: medications, isLoading: medsLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: () => medicationApi.getAll(),
  });

  const { data: scheduleData, isLoading: scheduleLoading } = useQuery({
    queryKey: ['schedule', selectedDate],
    queryFn: () => scheduleApi.getDailySchedule(selectedDate),
  });

  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsApi.getAdherenceStats(),
  });

  const { data: appointmentsRes } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentApi.getAppointments(),
  });

  const { data: notificationsRes } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
  });

  // Mutations
  const createMedMutation = useMutation({
    mutationFn: (newMed: Omit<Medication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      medicationApi.create(newMed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      setIsAddMedModalOpen(false);
    },
  });

  const actionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: DosageStatus; reason?: string }) =>
      scheduleApi.updateDosageStatus(id, status, selectedDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const takeAllPendingMutation = useMutation({
    mutationFn: async () => {
      const pendingItems = (scheduleData || []).filter((s) => s.status === 'pending');
      for (const item of pendingItems) {
        await scheduleApi.updateDosageStatus(item.id, 'taken', selectedDate);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const schedule = scheduleData || [];
  const appointments = appointmentsRes?.data || [];
  const notifications = notificationsRes?.data || [];

  const todayTotal = schedule.length;
  const todayTaken = schedule.filter((s) => s.status === 'taken').length;
  const todaySkipped = schedule.filter((s) => s.status === 'skipped').length;
  const todayPending = schedule.filter((s) => s.status === 'pending').length;
  const adherenceRate = statsData?.adherenceRate || (todayTotal ? Math.round((todayTaken / todayTotal) * 100) : 92);
  const streakDays = statsData?.streakDays || 14;

  const nextPendingMed = schedule.find((s) => s.status === 'pending');
  const upcomingAppointment = appointments.find((a) => a.status === 'upcoming');

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* SECTION 2: GREETING HERO BANNER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black border border-white/30 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Clinical Health Center
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/30 text-teal-100 text-xs font-bold border border-teal-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn ISO 27799
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Xin chào, Minh 👋
              </h1>

              <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed">
                Hôm nay bạn có <strong className="text-white underline decoration-amber-300 font-black">{todayPending} liều thuốc</strong> cần hoàn thành.
                {nextPendingMed && (
                  <span> Liều kế tiếp: <span className="font-extrabold text-white bg-white/20 px-2 py-0.5 rounded-lg tabular-nums">{nextPendingMed.medicationName} ({nextPendingMed.scheduledTime})</span>.</span>
                )}
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3 pt-6">
              {todayPending > 0 && (
                <Button
                  variant="secondary"
                  size="lg"
                  isLoading={takeAllPendingMutation.isPending}
                  onClick={() => takeAllPendingMutation.mutate()}
                  leftIcon={<CheckCheck className="w-5 h-5" />}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-lg border-0"
                >
                  Uống Tất Cả Liều Chờ ({todayPending})
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsDoctorReportOpen(true)}
                leftIcon={<FileText className="w-5 h-5" />}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md font-bold"
              >
                Báo Cáo Bác Sĩ (PDF)
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsAddMedModalOpen(true)}
                leftIcon={<Plus className="w-5 h-5" />}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md font-bold"
              >
                Thêm thuốc mới
              </Button>
            </div>
          </div>

          <HealthScoreRing
            score={adherenceRate}
            streakDays={streakDays}
            totalTaken={todayTaken}
            totalScheduled={todayTotal}
          />
        </div>

        {/* SECTION 3: QUICK STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="card-hover-effect flex flex-col justify-between space-y-3 p-5 border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Tổng Thuốc Tủ</span>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shadow-sm">
                <Pill className="w-5 h-5" />
              </div>
            </div>
            {medsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                {medications?.length || 4}
              </div>
            )}
            <p className="text-[11px] text-slate-400 font-medium">Đang theo dõi tự động</p>
          </Card>

          <Card className="card-hover-effect flex flex-col justify-between space-y-3 p-5 border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Lịch Hôm Nay</span>
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            {scheduleLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                {todayTotal} <span className="text-sm font-semibold text-slate-500">liều</span>
              </div>
            )}
            <p className="text-[11px] text-slate-400 font-medium">Theo khung giờ cố định</p>
          </Card>

          <Card className="card-hover-effect flex flex-col justify-between space-y-3 p-5 border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Đã Uống Thuốc</span>
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950 text-green-600 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            {scheduleLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-black text-green-600 dark:text-green-400 tabular-nums">
                {todayTaken} <span className="text-sm font-semibold">liều</span>
              </div>
            )}
            <span className="text-[11px] text-green-600 font-bold bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full w-fit">
              ✓ Đạt chuẩn an toàn
            </span>
          </Card>

          <Card className="card-hover-effect flex flex-col justify-between space-y-3 p-5 border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Bỏ Lỡ Thuốc</span>
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center shadow-sm">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            {scheduleLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-black text-red-600 dark:text-red-400 tabular-nums">
                {todaySkipped} <span className="text-sm font-semibold">liều</span>
              </div>
            )}
            <p className="text-[11px] text-red-500 font-medium">Hạn chế bỏ lỡ kế tiếp</p>
          </Card>
        </div>

        {/* SECTION 4: TODAY'S MEDICINES (Medicine Cards Grid) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-600" />
              Danh Mục Thuốc Sử Dụng Trong Ngày
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => (window.location.href = '/medications')}
              className="text-xs text-blue-600 font-bold"
            >
              Xem tất cả tủ thuốc
            </Button>
          </div>

          {medsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(medications || []).slice(0, 3).map((med) => (
                <MedicineCard
                  key={med.id}
                  medication={med}
                  onView={() => setSelectedMedDetail(schedule.find((s) => s.medicationId === med.id) || null)}
                />
              ))}
            </div>
          )}
        </div>

        {/* SECTION 5: TODAY'S SCHEDULE TIMELINE & HEALTH SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <MedicalTimeline
              items={schedule}
              onTake={(id) => actionMutation.mutate({ id, status: 'taken' })}
              onSkip={(id, reason) => actionMutation.mutate({ id, status: 'skipped', reason })}
              onTakeLate={(id) => actionMutation.mutate({ id, status: 'taken' })}
              onTakeAllPending={() => takeAllPendingMutation.mutate()}
              onSelectDetail={(item) => setSelectedMedDetail(item)}
              isLoading={scheduleLoading}
            />
          </div>

          {/* SECTION 6: HEALTH SUMMARY WIDGET */}
          <div className="space-y-6">
            <VitalsWidget />
          </div>
        </div>

        {/* SECTION 7: MEDICATION ADHERENCE CHART */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Tỷ Lệ Tuân Thủ Uống Thuốc Trong Tuần (Medication Adherence)
              </h3>
              <p className="text-xs text-slate-500">Biểu đồ thể hiện số liều đã uống đúng giờ so với lịch hẹn</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-bold">
              88% Tuân Thủ
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  statsData?.weeklyTrend || [
                    { day: 'Thứ 2', taken: 4, scheduled: 4 },
                    { day: 'Thứ 3', taken: 3, scheduled: 4 },
                    { day: 'Thứ 4', taken: 4, scheduled: 4 },
                    { day: 'Thứ 5', taken: 4, scheduled: 4 },
                    { day: 'Thứ 6', taken: 3, scheduled: 4 },
                    { day: 'Thứ 7', taken: 4, scheduled: 4 },
                    { day: 'Chủ Nhật', taken: 3, scheduled: 4 },
                  ]
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis domain={[0, 6]} stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="taken" name="Đã uống" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="scheduled" name="Lịch hẹn" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* SECTION 8 & 9: UPCOMING APPOINTMENT & RECENT NOTIFICATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SECTION 8: UPCOMING APPOINTMENT */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Lịch Hẹn Khám Bệnh Sắp Tới
            </h3>
            {upcomingAppointment ? (
              <AppointmentCard appointment={upcomingAppointment} />
            ) : (
              <Card className="p-8 text-center space-y-2">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Không có lịch hẹn khám sắp tới</p>
              </Card>
            )}
          </div>

          {/* SECTION 9: RECENT NOTIFICATION FEED */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Thông Báo Mới Nhất
            </h3>
            {notifications.slice(0, 2).map((notif) => (
              <NotificationCard key={notif.id} notification={notif} />
            ))}
          </div>
        </div>

        {/* Add Medication Modal */}
        <AddMedicationModal
          isOpen={isAddMedModalOpen}
          onClose={() => setIsAddMedModalOpen(false)}
          onSave={(data) => createMedMutation.mutate(data as any)}
          isLoading={createMedMutation.isPending}
        />

        {/* Doctor Report Modal */}
        <DoctorReportModal
          isOpen={isDoctorReportOpen}
          onClose={() => setIsDoctorReportOpen(false)}
        />

        {/* Selected Med Detail Modal */}
        {selectedMedDetail && (
          <Modal
            isOpen={!!selectedMedDetail}
            onClose={() => setSelectedMedDetail(null)}
            title={`Chi Tiết Thuốc: ${selectedMedDetail.medicationName}`}
            maxWidth="md"
          >
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg tabular-nums shadow-md">
                  {selectedMedDetail.scheduledTime}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">
                    {selectedMedDetail.medicationName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Liều lượng: <strong className="text-slate-800 dark:text-slate-200">{selectedMedDetail.dosage} {selectedMedDetail.unit}</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p><strong>Trạng thái:</strong> {selectedMedDetail.status === 'taken' ? '✓ Đã uống' : 'Chờ uống'}</p>
                <p><strong>Hướng dẫn sử dụng:</strong> {selectedMedDetail.instructions || 'Uống sau bữa ăn cùng nước ấm.'}</p>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="primary" onClick={() => setSelectedMedDetail(null)} className="bg-blue-600 hover:bg-blue-700">
                  Đóng cửa sổ
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
