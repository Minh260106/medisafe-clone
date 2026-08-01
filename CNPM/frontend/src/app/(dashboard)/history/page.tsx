'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { Download, Filter, Search, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { logApi } from '@/services/log.api';
import { medicationApi } from '@/services/medication.api';
import { scheduleApi } from '@/services/schedule.api';
import { downloadCsv, getApiErrorMessage } from '@/utils/medisafe';
import { IntakeLog, Medication, Schedule } from '@/types';

const statusLabel: Record<string, string> = {
  Taken: 'Đã uống',
  Skipped: 'Bỏ qua',
  Snoozed: 'Nhắc lại',
};

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Taken' | 'Skipped' | 'Snoozed'>('all');
  const [medicationFilter, setMedicationFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<IntakeLog | null>(null);

  const logsQuery = useQuery({
    queryKey: ['logs'],
    queryFn: () => logApi.list(),
  });

  const schedulesQuery = useQuery({
    queryKey: ['schedules'],
    queryFn: () => scheduleApi.list(),
  });

  const medicationsQuery = useQuery({
    queryKey: ['medications'],
    queryFn: () => medicationApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => logApi.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['logs'] });
      await queryClient.invalidateQueries({ queryKey: ['medications'] });
      setDeleteTarget(null);
    },
  });

  const logs = logsQuery.data || [];
  const schedules = schedulesQuery.data || [];
  const medications = medicationsQuery.data || [];

  const scheduleMap = useMemo(
    () => new Map<number, Schedule>(schedules.map((schedule) => [schedule.id, schedule])),
    [schedules]
  );

  const medicationMap = useMemo(
    () => new Map<number, Medication>(medications.map((medication) => [medication.id, medication])),
    [medications]
  );

  const filteredLogs = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    return logs.filter((log) => {
      const schedule = scheduleMap.get(log.schedule_id);
      const medication = schedule ? medicationMap.get(schedule.medication_id) : undefined;
      const medicationName = medication?.name || `#${log.schedule_id}`;
      const logDate = parseISO(log.timestamp);

      const matchesSearch = medicationName.toLowerCase().includes(search);
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      const matchesMedication = medicationFilter === 'all' || String(medication?.id) === medicationFilter;
      const matchesFrom = fromDate ? isWithinInterval(logDate, { start: parseISO(fromDate), end: toDate ? parseISO(toDate) : logDate }) : true;
      const matchesTo = toDate ? logDate <= parseISO(toDate + 'T23:59:59') : true;

      return matchesSearch && matchesStatus && matchesMedication && matchesFrom && matchesTo;
    });
  }, [fromDate, logs, medicationFilter, medicationMap, scheduleMap, searchQuery, statusFilter, toDate]);

  const handleExportCsv = () => {
    downloadCsv(
      `medisafe-history-${new Date().toISOString().slice(0, 10)}.csv`,
      ['ID', 'Thuốc', 'Tần suất', 'Giờ uống', 'Trạng thái', 'Thời gian ghi nhận'],
      filteredLogs.map((log) => {
        const schedule = scheduleMap.get(log.schedule_id);
        const medication = schedule ? medicationMap.get(schedule.medication_id) : undefined;
        return [
          log.id,
          medication?.name || `#${log.schedule_id}`,
          schedule?.frequency || '',
          schedule?.time_to_take || '',
          statusLabel[log.status] || log.status,
          format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm'),
        ];
      })
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lịch sử uống thuốc</h1>
            <p className="text-xs text-slate-500">Lọc và xuất CSV từ log thật. Không còn dữ liệu mô phỏng.</p>
          </div>

          <Button variant="outline" onClick={handleExportCsv} leftIcon={<Download className="w-4 h-4" />}>
            Xuất CSV
          </Button>
        </div>

        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Tìm theo tên thuốc"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs px-3 py-2.5 text-slate-900 dark:text-slate-100">
                <option value="all">Tất cả trạng thái</option>
                <option value="Taken">Đã uống</option>
                <option value="Skipped">Bỏ qua</option>
                <option value="Snoozed">Nhắc lại</option>
              </select>

              <select value={medicationFilter} onChange={(event) => setMedicationFilter(event.target.value)} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs px-3 py-2.5 text-slate-900 dark:text-slate-100">
                <option value="all">Tất cả thuốc</option>
                {medications.map((medication) => (
                  <option key={medication.id} value={medication.id}>
                    {medication.name}
                  </option>
                ))}
              </select>

              <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
              <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
            </div>
          </div>
        </Card>

        {logsQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : logsQuery.error ? (
          <EmptyState title="Không tải được lịch sử" description={getApiErrorMessage(logsQuery.error, 'Không thể kết nối đến backend.')} />
        ) : filteredLogs.length === 0 ? (
          <EmptyState title="Không có log phù hợp" description="Thử đổi bộ lọc hoặc tạo log mới ở trang Nhắc nhở hôm nay." />
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold uppercase">
                <tr>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4">Thuốc</th>
                  <th className="p-4">Lịch</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredLogs.map((log) => {
                  const schedule = scheduleMap.get(log.schedule_id);
                  const medication = schedule ? medicationMap.get(schedule.medication_id) : undefined;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">{format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm')}</td>
                      <td className="p-4">{medication?.name || `#${log.schedule_id}`}</td>
                      <td className="p-4">{schedule?.time_to_take || '—'}</td>
                      <td className="p-4">
                        <Badge variant={log.status === 'Taken' ? 'success' : log.status === 'Skipped' ? 'danger' : 'warning'}>
                          {statusLabel[log.status] || log.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button size="sm" variant="danger" onClick={() => setDeleteTarget(log)} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                          Xoá
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}

        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
          title="Xoá log uống thuốc"
          message="Xoá log sẽ cập nhật lại dữ liệu dùng để thống kê và lịch sử."
          isLoading={deleteMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
