'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Pill,
  BellRing,
  CheckCheck,
  Sun,
  Moon,
  Sunrise,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { scheduleApi } from '@/services/schedule.api';
import { useAppStore } from '@/store/useAppStore';
import { DosageStatus } from '@/types';

export default function SchedulePage() {
  const queryClient = useQueryClient();
  const { selectedDate, setSelectedDate } = useAppStore();
  const [timeTab, setTimeTab] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  // Queries
  const { data: schedule, isLoading } = useQuery({
    queryKey: ['schedule', selectedDate],
    queryFn: () => scheduleApi.getDailySchedule(selectedDate),
  });

  // Action Mutation with Optimistic Updates
  const actionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: DosageStatus }) =>
      scheduleApi.updateDosageStatus(id, status, selectedDate),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['schedule', selectedDate] });
      const previousSchedule = queryClient.getQueryData(['schedule', selectedDate]);

      queryClient.setQueryData(['schedule', selectedDate], (old: any) => {
        if (!old) return [];
        return old.map((item: any) =>
          item.id === id ? { ...item, status, takenAt: status === 'taken' ? new Date().toISOString() : undefined } : item
        );
      });

      return { previousSchedule };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSchedule) {
        queryClient.setQueryData(['schedule', selectedDate], context.previousSchedule);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  // Batch Action: Take All
  const takeAllMutation = useMutation({
    mutationFn: async () => {
      if (!schedule) return;
      for (const item of filteredSchedule) {
        if (item.status !== 'taken') {
          await scheduleApi.updateDosageStatus(item.id, 'taken', selectedDate);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', selectedDate] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  // Helper for Week Strip (7 Days around selected date)
  const getWeeklyDays = () => {
    const current = new Date(selectedDate);
    const dayOfWeek = current.getDay(); // 0 is Sunday
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(current);
    monday.setDate(current.getDate() + distanceToMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()];
      days.push({ dayName, dateStr, dayNum: d.getDate() });
    }
    return days;
  };

  const weekDays = getWeeklyDays();

  // Filter Schedule by Time Tab
  const filteredSchedule = (schedule || []).filter((item) => {
    if (timeTab === 'all') return true;
    const hour = parseInt(item.scheduledTime.split(':')[0], 10);
    if (timeTab === 'morning') return hour >= 5 && hour < 12;
    if (timeTab === 'afternoon') return hour >= 12 && hour < 17;
    if (timeTab === 'evening') return hour >= 17 || hour < 5;
    return true;
  });

  const changeDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lịch & Lời Nhắc Uống Thuốc</h1>
            <p className="text-xs text-slate-500">Quản lý trực quan toàn bộ các liều thuốc theo từng mốc thời gian</p>
          </div>

          {filteredSchedule.some((s) => s.status !== 'taken') && (
            <Button
              variant="secondary"
              isLoading={takeAllMutation.isPending}
              onClick={() => takeAllMutation.mutate()}
              leftIcon={<CheckCheck className="w-4 h-4" />}
            >
              Uống nhanh các liều ({filteredSchedule.filter((s) => s.status !== 'taken').length})
            </Button>
          )}
        </div>

        {/* Interactive Weekly Calendar Strip */}
        <Card className="p-4 bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 text-white rounded-3xl glow-sky shadow-xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CalendarIcon className="w-4 h-4" />
              <span>Tuần: {weekDays[0].dateStr} - {weekDays[6].dateStr}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changeDate(-7)}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                title="Tuần trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-3 py-1 rounded-xl bg-white/20 text-xs font-bold hover:bg-white/30 transition-colors"
              >
                Hôm nay
              </button>
              <button
                onClick={() => changeDate(7)}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                title="Tuần sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 7 Days Strip */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((d) => {
              const isSelected = d.dateStr === selectedDate;
              return (
                <button
                  key={d.dateStr}
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-white text-sky-600 font-extrabold shadow-lg scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white font-medium'
                  }`}
                >
                  <span className="text-[11px] opacity-80 uppercase">{d.dayName}</span>
                  <span className="text-lg font-black">{d.dayNum}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" />
                </button>
              );
            })}
          </div>
        </Card>

        {/* Time-of-Day Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
          <button
            onClick={() => setTimeTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              timeTab === 'all'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" /> Tất cả mốc giờ ({schedule?.length || 0})
          </button>
          <button
            onClick={() => setTimeTab('morning')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              timeTab === 'morning'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sunrise className="w-4 h-4" /> Buổi Sáng (05h - 12h)
          </button>
          <button
            onClick={() => setTimeTab('afternoon')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              timeTab === 'afternoon'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-4 h-4" /> Buổi Trưa (12h - 17h)
          </button>
          <button
            onClick={() => setTimeTab('evening')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              timeTab === 'evening'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-4 h-4" /> Buổi Tối & Đêm
          </button>
        </div>

        {/* Schedule List */}
        <Card className="space-y-4 p-6">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : filteredSchedule.length > 0 ? (
            <div className="space-y-3">
              {filteredSchedule.map((item) => (
                <div
                  key={item.id}
                  className="card-hover-effect flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-sm gap-4 hover:border-sky-400"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-700 text-white flex flex-col items-center justify-center font-black text-sm shadow-md shadow-sky-600/20">
                      <span>{item.scheduledTime}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-slate-900 dark:text-white text-lg">
                          {item.medicationName}
                        </span>
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
                            : 'Chờ uống'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Liều lượng: <strong className="text-slate-700 dark:text-slate-300">{item.dosage} {item.unit}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Button
                      size="sm"
                      variant={item.status === 'taken' ? 'secondary' : 'outline'}
                      onClick={() => actionMutation.mutate({ id: item.id, status: 'taken' })}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Đã Uống
                    </Button>
                    <Button
                      size="sm"
                      variant={item.status === 'skipped' ? 'danger' : 'outline'}
                      onClick={() => actionMutation.mutate({ id: item.id, status: 'skipped' })}
                      leftIcon={<XCircle className="w-4 h-4" />}
                    >
                      Bỏ qua
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => actionMutation.mutate({ id: item.id, status: 'snoozed' })}
                      leftIcon={<BellRing className="w-4 h-4 text-amber-500" />}
                    >
                      Nhắc lại 15p
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <Pill className="w-16 h-16 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-500">Không có lịch uống thuốc nào phù hợp với bộ lọc mốc giờ này.</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
