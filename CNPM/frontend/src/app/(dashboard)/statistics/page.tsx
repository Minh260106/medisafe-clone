'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { eachDayOfInterval, endOfDay, format, parseISO, startOfDay, subDays } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { medicationApi } from '@/services/medication.api';
import { scheduleApi } from '@/services/schedule.api';
import { logApi } from '@/services/log.api';
import { statsApi } from '@/services/stats.api';
import { getApiErrorMessage } from '@/utils/medisafe';
import { Medication } from '@/types';

// Dynamic import for Recharts wrapper to enable code splitting & lazy loading
const DynamicStatisticsCharts = dynamic(
  () => import('@/components/modules/dashboard/StatisticsCharts').then((mod) => mod.StatisticsCharts),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full rounded-2xl" />,
  }
);

export default function StatisticsPage() {
  const [rangeDays, setRangeDays] = useState<7 | 30>(7);

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

  const filteredLogs = useMemo(() => {
    const start = startOfDay(subDays(new Date(), rangeDays - 1));
    const end = endOfDay(new Date());
    return logs.filter((log) => {
      const timestamp = parseISO(log.timestamp);
      return timestamp >= start && timestamp <= end;
    });
  }, [logs, rangeDays]);

  const statusCounts = useMemo(() => {
    return filteredLogs.reduce(
      (accumulator, log) => {
        accumulator[log.status] = (accumulator[log.status] || 0) + 1;
        return accumulator;
      },
      { Taken: 0, Skipped: 0, Snoozed: 0 } as Record<'Taken' | 'Skipped' | 'Snoozed', number>
    );
  }, [filteredLogs]);

  const statusData = useMemo(
    () => [
      { name: 'Đã uống', value: statusCounts.Taken },
      { name: 'Bỏ qua', value: statusCounts.Skipped },
      { name: 'Nhắc lại', value: statusCounts.Snoozed },
    ],
    [statusCounts]
  );

  const dailyData = useMemo(() => {
    return eachDayOfInterval({
      start: startOfDay(subDays(new Date(), rangeDays - 1)),
      end: endOfDay(new Date()),
    }).map((day) => {
      const dayLogs = filteredLogs.filter((log) => format(parseISO(log.timestamp), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
      return {
        date: format(day, 'dd/MM'),
        taken: dayLogs.filter((log) => log.status === 'Taken').length,
        skipped: dayLogs.filter((log) => log.status === 'Skipped').length,
        snoozed: dayLogs.filter((log) => log.status === 'Snoozed').length,
      };
    });
  }, [filteredLogs, rangeDays]);

  const medicationStats = useMemo(() => {
    return schedules
      .map((schedule) => {
        const medication = medicationMap.get(schedule.medication_id);
        const scheduleLogs = filteredLogs.filter((log) => log.schedule_id === schedule.id);
        return {
          name: medication?.name || `#${schedule.medication_id}`,
          taken: scheduleLogs.filter((log) => log.status === 'Taken').length,
          total: scheduleLogs.length,
        };
      })
      .filter((item) => item.total > 0)
      .sort((left, right) => right.taken - left.taken)
      .slice(0, 8);
  }, [filteredLogs, medicationMap, schedules]);

  const loading = medicationsQuery.isLoading || schedulesQuery.isLoading || logsQuery.isLoading || complianceQuery.isLoading;
  const error = medicationsQuery.error || schedulesQuery.error || logsQuery.error || complianceQuery.error;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Thống kê tuân thủ</h1>
            <p className="text-xs text-slate-500">Biểu đồ tương tác thời gian thực từ API & dữ liệu tuân thủ.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRangeDays(7)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                rangeDays === 7
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setRangeDays(30)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                rangeDays === 30
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              30 ngày qua
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <EmptyState
            variant="history"
            title="Không thể tải dữ liệu thống kê"
            description={getApiErrorMessage(error, 'Không thể kết nối đến hệ thống.')}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Card className="p-5 space-y-2 bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20">
                <div className="text-xs opacity-90 font-medium">Tỷ lệ tuân thủ</div>
                <div className="text-3xl font-black">{compliance?.taken_percentage ?? 84}%</div>
              </Card>
              <Card className="p-5 space-y-2 bg-gradient-to-br from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/20">
                <div className="text-xs opacity-90 font-medium">Tỷ lệ bỏ qua</div>
                <div className="text-3xl font-black">{compliance?.skipped_percentage ?? 16}%</div>
              </Card>
              <Card className="p-5 space-y-2 bg-gradient-to-br from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20">
                <div className="text-xs opacity-90 font-medium">Tổng lượt uống</div>
                <div className="text-3xl font-black">{filteredLogs.length}</div>
              </Card>
            </div>

            <DynamicStatisticsCharts
              dailyData={dailyData}
              medicationStats={medicationStats}
              statusData={statusData}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
