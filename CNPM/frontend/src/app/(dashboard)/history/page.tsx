'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Search, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { scheduleApi } from '@/services/schedule.api';
import { useAppStore } from '@/store/useAppStore';

export default function HistoryPage() {
  const { selectedDate } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: schedule, isLoading } = useQuery({
    queryKey: ['schedule', selectedDate],
    queryFn: () => scheduleApi.getDailySchedule(selectedDate),
  });

  const filteredItems = schedule?.filter((item) => {
    const matchesSearch = item.medicationName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export CSV Function
  const handleExportCSV = () => {
    if (!schedule || schedule.length === 0) return;

    const headers = ['ID', 'Thuoc', 'Lieu Luong', 'Ngay', 'Gio', 'Trang Thai', 'Thoi Gian Uong'];
    const rows = schedule.map((i) => [
      i.id,
      `"${i.medicationName}"`,
      `"${i.dosage} ${i.unit}"`,
      i.scheduledDate,
      i.scheduledTime,
      i.status,
      i.takenAt || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medisafe_history_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lịch Sử Nật Ký Uống Thuốc</h1>
            <p className="text-xs text-slate-500">Tra cứu nật ký và xuất báo cáo dữ liệu định dạng CSV</p>
          </div>

          <Button
            variant="secondary"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Xuất file CSV
          </Button>
        </div>

        {/* Filter Controls */}
        <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Lọc theo tên thuốc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 p-2.5 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="taken">Đã uống</option>
              <option value="skipped">Đã bỏ qua</option>
              <option value="pending">Chờ uống</option>
            </select>
          </div>
        </Card>

        {/* Table */}
        <Card className="overflow-x-auto p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold uppercase">
                <tr>
                  <th className="p-4">Thời Gian Nhắc</th>
                  <th className="p-4">Tên Thuốc</th>
                  <th className="p-4">Liều Lượng</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4">Thời Gian Ghi Nhận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredItems && filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{item.scheduledTime}</td>
                      <td className="p-4 font-semibold">{item.medicationName}</td>
                      <td className="p-4">
                        {item.dosage} {item.unit}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            item.status === 'taken'
                              ? 'success'
                              : item.status === 'skipped'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {item.status === 'taken'
                            ? 'Đã uống'
                            : item.status === 'skipped'
                            ? 'Bỏ qua'
                            : 'Chưa uống'}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-500">
                        {item.takenAt ? new Date(item.takenAt).toLocaleTimeString('vi-VN') : '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-slate-500">
                      Không có bản ghi lịch sử nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
