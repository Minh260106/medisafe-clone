'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Flame, ShieldCheck, Zap } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { statsApi } from '@/services/stats.api';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export default function StatisticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsApi.getAdherenceStats(),
  });

  const pieData = [
    { name: 'Đã uống', value: stats?.totalTaken || 24 },
    { name: 'Bỏ qua', value: stats?.totalSkipped || 2 },
    { name: 'Chờ uống', value: stats?.totalPending || 2 },
  ];

  const weeklyTrendData = stats?.weeklyTrend || [
    { day: 'Thứ 2', taken: 4, skipped: 0, scheduled: 4 },
    { day: 'Thứ 3', taken: 3, skipped: 1, scheduled: 4 },
    { day: 'Thứ 4', taken: 4, skipped: 0, scheduled: 4 },
    { day: 'Thứ 5', taken: 4, skipped: 0, scheduled: 4 },
    { day: 'Thứ 6', taken: 3, skipped: 1, scheduled: 4 },
    { day: 'Thứ 7', taken: 3, skipped: 0, scheduled: 4 },
    { day: 'Chủ Nhật', taken: 3, skipped: 0, scheduled: 4 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Thống Kê & Báo Cáo Tuân Thủ</h1>
          <p className="text-xs text-slate-500">Phân tích trực quan tỉ lệ hoàn thành lịch uống thuốc và chỉ số sức khỏe</p>
        </div>

        {/* 3 Healthcare Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="card-hover-effect flex items-center gap-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 glow-amber">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
              <Flame className="w-7 h-7 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="text-xs opacity-90 font-medium">Chuỗi Tuân Thủ</div>
              <div className="text-2xl font-black">14 Ngày Liên Tiếp 🔥</div>
            </div>
          </Card>

          <Card className="card-hover-effect flex items-center gap-4 bg-gradient-to-br from-sky-600 to-indigo-600 text-white p-6 glow-sky">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7 text-sky-200" />
            </div>
            <div>
              <div className="text-xs opacity-90 font-medium">Điểm Sức Khỏe AI</div>
              <div className="text-2xl font-black">95 / 100 Điểm</div>
            </div>
          </Card>

          <Card className="card-hover-effect flex items-center gap-4 bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-6 glow-emerald">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
              <Zap className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <div className="text-xs opacity-90 font-medium">Tốc Độ Uống Trung Bình</div>
              <div className="text-2xl font-black">2.4 Phút Sau Nhắc</div>
            </div>
          </Card>
        </div>

        {/* Recharts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <Card className="space-y-4 p-6">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-sky-600" />
              Tỉ Lệ Phân Phối Trạng Thái Uống Thuốc
            </h3>

            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Bar Chart */}
          <Card className="space-y-4 p-6">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Số Liều Uống Hằng Ngày (Tuần Này)
            </h3>

            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="taken" name="Đã uống" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="skipped" name="Bỏ qua" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Line Chart */}
          <Card className="lg:col-span-2 space-y-4 p-6">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Xu Hướng Báo Cáo Tuân Thủ Điều Trị 7 Ngày Gần Nhất
            </h3>

            {isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="taken"
                      name="Số liều đã hoàn thành"
                      stroke="#0284c7"
                      strokeWidth={4}
                      dot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="scheduled"
                      name="Tổng số liều dự kiến"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
