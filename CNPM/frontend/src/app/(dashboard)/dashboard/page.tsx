'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format, isToday, parseISO } from 'date-fns';
import { BellRing, CalendarClock, ClipboardList, HeartPulse, Pill, ShieldCheck, TriangleAlert } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { medicationApi } from '@/services/medication.api';
import { scheduleApi } from '@/services/schedule.api';
import { logApi } from '@/services/log.api';
import { statsApi } from '@/services/stats.api';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { Medication, Schedule } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

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

  const complianceQuery = useQuery({
    queryKey: ['compliance'],
    queryFn: () => statsApi.getComplianceStats(),
  });

  const medications = medicationsQuery.data || [];
  const schedules = schedulesQuery.data || [];
  const logs = logsQuery.data || [];
  const compliance = complianceQuery.data;

  const medicationMap = useMemo(
    () => new Map<number, Medication>(medications.map((medication) => [medication.id, medication])),
    [medications]
  );

  const scheduleMap = useMemo(
    () => new Map<number, Schedule>(schedules.map((schedule) => [schedule.id, schedule])),
    [schedules]
  );

  const recentLogs = useMemo(
    () => logs.slice(0, 5),
    [logs]
  );

  const todayLogs = useMemo(
    () => logs.filter((log) => isToday(parseISO(log.timestamp))),
    [logs]
  );

  const lowStockMedications = useMemo(
    () => medications.filter((medication) => medication.stock <= 5),
    [medications]
  );

  const summaryCards = [
    { label: 'Thuốc đang theo dõi', value: medications.length, icon: Pill, color: 'text-sky-600' },
    { label: 'Lịch đang hoạt động', value: schedules.length, icon: CalendarClock, color: 'text-emerald-600' },
    { label: 'Log hôm nay', value: todayLogs.length, icon: ClipboardList, color: 'text-violet-600' },
    { label: 'Cảnh báo tồn kho', value: lowStockMedications.length, icon: TriangleAlert, color: 'text-amber-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Card className="overflow-hidden bg-gradient-to-br from-sky-600 via-cyan-600 to-emerald-600 text-white p-6 sm:p-8 relative">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
                <ShieldCheck className="w-4 h-4" /> Dữ liệu thật từ backend
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
                <HeartPulse className="w-4 h-4" /> Không còn mock fallback
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Xin chào, {user?.username || 'bạn'}
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-cyan-50 leading-relaxed">
              Dashboard này chỉ hiển thị dữ liệu thật đang lưu trên {`/api/medications`}, {`/api/schedules`}, {`/api/logs`} và {`/api/stats/compliance`}.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="secondary" onClick={() => router.push(ROUTES.DASHBOARD.REMINDER)} leftIcon={<BellRing className="w-4 h-4" />}>
                Mở nhắc nhở hôm nay
              </Button>
              <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD.MEDICATIONS)} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Quản lý thuốc
              </Button>
              <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD.STATISTICS)} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Xem thống kê
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="p-5 space-y-3 border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{item.label}</span>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                {medicationsQuery.isLoading || schedulesQuery.isLoading || logsQuery.isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-black text-slate-900 dark:text-white">{item.value}</div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Hoạt động gần đây</h2>
                <p className="text-xs text-slate-500">Từ logs thật đã lấy về từ backend.</p>
              </div>
              {compliance && (
                <div className="text-right text-xs text-slate-500">
                  <div>Tuân thủ 7 ngày</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {compliance.taken_percentage}% đúng, {compliance.skipped_percentage}% bỏ qua
                  </div>
                </div>
              )}
            </div>

            {logsQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : recentLogs.length === 0 ? (
              <EmptyActivityState />
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => {
                  const schedule = scheduleMap.get(log.schedule_id);
                  const medication = schedule ? medicationMap.get(schedule.medication_id) : undefined;
                  return (
                    <div key={log.id} className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{medication?.name || `#${log.schedule_id}`}</div>
                        <div className="text-xs text-slate-500">{schedule?.frequency || 'Không có tần suất'} · {schedule?.time_to_take || '—'}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${log.status === 'Taken' ? 'text-emerald-600' : log.status === 'Skipped' ? 'text-rose-600' : 'text-amber-600'}`}>
                          {log.status}
                        </div>
                        <div className="text-xs text-slate-500">{format(parseISO(log.timestamp), 'dd/MM HH:mm')}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Thuốc sắp hết</h2>
              <p className="text-xs text-slate-500">Cần nạp lại trước khi log bị ảnh hưởng.</p>
            </div>

            {medicationsQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : lowStockMedications.length === 0 ? (
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                Không có thuốc nào trong trạng thái sắp hết kho.
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockMedications.slice(0, 5).map((medication) => (
                  <div key={medication.id} className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 p-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{medication.name}</div>
                    <div className="text-xs text-slate-500">{medication.form} · {medication.dosage}</div>
                    <div className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-300">Tồn kho: {medication.stock}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function EmptyActivityState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center text-sm text-slate-500">
      Chưa có log nào. Vào trang Nhắc nhở hôm nay để tạo dữ liệu đầu tiên.
    </div>
  );
}
