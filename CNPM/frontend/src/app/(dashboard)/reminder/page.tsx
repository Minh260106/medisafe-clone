'use client';

import React, { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, isToday, parseISO } from 'date-fns';
import { BellRing, CheckCircle2, CircleSlash2, Clock3, SkipForward } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { medicationApi } from '@/services/medication.api';
import { scheduleApi } from '@/services/schedule.api';
import { logApi } from '@/services/log.api';
import { statsApi } from '@/services/stats.api';
import { getApiErrorMessage } from '@/utils/medisafe';
import { IntakeLog, IntakeStatus, Medication } from '@/types';

const statusMeta: Record<IntakeStatus, { label: string; className: string; icon: React.ReactNode }> = {
  Taken: { label: 'Đã uống', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', icon: <CheckCircle2 className="w-4 h-4" /> },
  Skipped: { label: 'Bỏ qua', className: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300', icon: <SkipForward className="w-4 h-4" /> },
  Snoozed: { label: 'Nhắc lại', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300', icon: <BellRing className="w-4 h-4" /> },
};

export default function ReminderPage() {
  const queryClient = useQueryClient();

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

  const markMutation = useMutation({
    mutationFn: ({ scheduleId, status }: { scheduleId: number; status: IntakeStatus }) =>
      logApi.create({ schedule_id: scheduleId, status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['logs'] });
      await queryClient.invalidateQueries({ queryKey: ['medications'] });
      await queryClient.invalidateQueries({ queryKey: ['compliance'] });
    },
  });

  const medications = medicationsQuery.data || [];
  const schedules = schedulesQuery.data || [];
  const logs = logsQuery.data || [];
  const compliance = complianceQuery.data;

  const medicationMap = useMemo(
    () => new Map<number, Medication>(medications.map((medication) => [medication.id, medication])),
    [medications]
  );

  const todayLogsBySchedule = useMemo(() => {
    const grouped = new Map<number, IntakeLog[]>();
    logs
      .filter((log) => isToday(parseISO(log.timestamp)))
      .forEach((log) => {
        const current = grouped.get(log.schedule_id) || [];
        grouped.set(log.schedule_id, [log, ...current]);
      });
    return grouped;
  }, [logs]);

  const reminderRows = useMemo(() => {
    return schedules
      .map((schedule) => {
        const scheduleLogs = todayLogsBySchedule.get(schedule.id) || [];
        const latestLog = scheduleLogs[0];
        const status = latestLog?.status || null;
        return {
          schedule,
          medication: medicationMap.get(schedule.medication_id),
          latestLog,
          status,
        };
      })
      .sort((left, right) => left.schedule.time_to_take.localeCompare(right.schedule.time_to_take));
  }, [medicationMap, schedules, todayLogsBySchedule]);

  const summary = useMemo(() => {
    return reminderRows.reduce(
      (accumulator, row) => {
        if (!row.status) accumulator.pending += 1;
        if (row.status === 'Taken') accumulator.taken += 1;
        if (row.status === 'Skipped') accumulator.skipped += 1;
        if (row.status === 'Snoozed') accumulator.snoozed += 1;
        return accumulator;
      },
      { pending: 0, taken: 0, skipped: 0, snoozed: 0 }
    );
  }, [reminderRows]);

  const loading = medicationsQuery.isLoading || schedulesQuery.isLoading || logsQuery.isLoading;
  const error = medicationsQuery.error || schedulesQuery.error || logsQuery.error || complianceQuery.error;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Nhắc nhở hôm nay</h1>
            <p className="text-xs text-slate-500">Trạng thái được suy ra hoàn toàn từ schedules + logs thật trong ngày.</p>
          </div>

          {compliance && (
            <Card className="p-4 text-sm font-semibold text-slate-900 dark:text-white">
              Tuân thủ 7 ngày: {compliance.taken_percentage}% uống đúng, {compliance.skipped_percentage}% bỏ qua
            </Card>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 space-y-1">
            <div className="text-xs text-slate-500">Tổng nhắc hôm nay</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{reminderRows.length}</div>
          </Card>
          <Card className="p-4 space-y-1">
            <div className="text-xs text-slate-500">Đã uống</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{summary.taken}</div>
          </Card>
          <Card className="p-4 space-y-1">
            <div className="text-xs text-slate-500">Đang chờ</div>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400">{summary.pending}</div>
          </Card>
          <Card className="p-4 space-y-1">
            <div className="text-xs text-slate-500">Bỏ qua / Nhắc lại</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{summary.skipped + summary.snoozed}</div>
          </Card>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error ? (
          <EmptyState title="Không tải được dữ liệu nhắc nhở" description={getApiErrorMessage(error, 'Không thể kết nối backend.')} />
        ) : reminderRows.length === 0 ? (
          <EmptyState title="Chưa có lịch nào" description="Tạo lịch ở trang Lịch thuốc để trang nhắc nhở có dữ liệu thật." />
        ) : (
          <div className="space-y-3">
            {reminderRows.map(({ schedule, medication, latestLog, status }) => (
              <Card key={schedule.id} className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-slate-200/80 dark:border-slate-800">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4 text-sky-600" />
                    <h3 className="font-extrabold text-slate-900 dark:text-white">{medication?.name || `Thuốc #${schedule.medication_id}`}</h3>
                  </div>
                  <p className="text-xs text-slate-500">{schedule.frequency}</p>
                  <p className="text-xs text-slate-500">
                    Giờ uống: <span className="font-semibold text-slate-800 dark:text-slate-200">{schedule.time_to_take}</span>
                  </p>
                  <div className="text-xs text-slate-500">
                    Cập nhật cuối: {latestLog ? format(parseISO(latestLog.timestamp), 'dd/MM/yyyy HH:mm') : 'Chưa có log hôm nay'}
                  </div>
                </div>

                <div className="flex flex-col gap-3 items-start md:items-end">
                  <div className="flex items-center gap-2">
                    {status ? (
                      <Badge variant={status === 'Taken' ? 'success' : status === 'Skipped' ? 'danger' : 'warning'}>
                        <span className="inline-flex items-center gap-1.5">{statusMeta[status].icon}{statusMeta[status].label}</span>
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        <span className="inline-flex items-center gap-1.5"><CircleSlash2 className="w-4 h-4" />Đang chờ</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => markMutation.mutate({ scheduleId: schedule.id, status: 'Taken' })} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                      Đã uống
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => markMutation.mutate({ scheduleId: schedule.id, status: 'Skipped' })} leftIcon={<SkipForward className="w-4 h-4" />}>
                      Bỏ qua
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => markMutation.mutate({ scheduleId: schedule.id, status: 'Snoozed' })} leftIcon={<BellRing className="w-4 h-4" />}>
                      Nhắc lại
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
