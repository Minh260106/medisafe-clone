'use client';

import React, { memo } from 'react';
import {
  AreaChart,
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

interface DailyDataPoint {
  date: string;
  taken: number;
  skipped: number;
  snoozed: number;
}

interface MedicationStatPoint {
  name: string;
  taken: number;
  total: number;
}

interface StatusPiePoint {
  name: string;
  value: number;
}

interface StatisticsChartsProps {
  dailyData: DailyDataPoint[];
  medicationStats: MedicationStatPoint[];
  statusData: StatusPiePoint[];
}

export const StatisticsCharts: React.FC<StatisticsChartsProps> = memo(({
  dailyData,
  medicationStats,
  statusData,
}) => {
  return (
    <div className="space-y-6">
      {/* Daily Trend Chart */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Xu hướng uống thuốc theo ngày</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="taken" name="Đã uống" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Area type="monotone" dataKey="skipped" name="Bỏ qua" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Phân bổ tuân thủ theo loại thuốc</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={medicationStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="taken" name="Số lần đã uống" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Tỷ lệ trạng thái uống thuốc</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
});

StatisticsCharts.displayName = 'StatisticsCharts';
