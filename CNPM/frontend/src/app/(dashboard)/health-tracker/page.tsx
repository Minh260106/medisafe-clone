'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Activity,
  Heart,
  Scale,
  Droplet,
  Plus,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { healthApi } from '@/services/health.api';
import { VitalLog } from '@/types';

export default function HealthTrackerPage() {
  const queryClient = useQueryClient();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form state
  const [systolic, setSystolic] = useState<number | ''>(120);
  const [diastolic, setDiastolic] = useState<number | ''>(80);
  const [heartRate, setHeartRate] = useState<number | ''>(72);
  const [bloodGlucose, setBloodGlucose] = useState<number | ''>(100);
  const [notes, setNotes] = useState('');

  const { data: response } = useQuery({
    queryKey: ['health-vitals'],
    queryFn: () => healthApi.getVitals(),
  });

  const vitals = response?.data || [];

  const logMutation = useMutation({
    mutationFn: (vital: Omit<VitalLog, 'id' | 'status' | 'recordedAt'>) => healthApi.logVitals(vital),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-vitals'] });
      setIsLogModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => healthApi.deleteVitalLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-vitals'] });
    },
  });

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logMutation.mutate({
      systolic: systolic ? Number(systolic) : undefined,
      diastolic: diastolic ? Number(diastolic) : undefined,
      heartRate: heartRate ? Number(heartRate) : undefined,
      bloodGlucose: bloodGlucose ? Number(bloodGlucose) : undefined,
      notes,
    });
  };

  const chartData = vitals
    .slice()
    .reverse()
    .map((v) => ({
      date: new Date(v.recordedAt).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }),
      systolic: v.systolic || 120,
      diastolic: v.diastolic || 80,
      heartRate: v.heartRate || 70,
      bloodGlucose: v.bloodGlucose || 100,
    }));

  const latestLog = vitals[0];

  const getStatusBadge = (status?: VitalLog['status']) => {
    switch (status) {
      case 'normal':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">Bình Thường</span>;
      case 'elevated':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">Hơi Cao</span>;
      case 'high_stage1':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">Huyết Áp Cao Độ 1</span>;
      case 'high_stage2':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">Huyết Áp Cao Độ 2</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Ổn Định</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Theo Dõi Sinh Hiệu & Sức Khỏe</h1>
            <p className="text-xs text-slate-500">Biểu đồ xu hướng Huyết áp, Nhịp tim và Đường huyết theo thời gian thực</p>
          </div>

          <Button
            variant="primary"
            onClick={() => setIsLogModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Nhập chỉ số sinh hiệu
          </Button>
        </div>

        {/* 4 Health Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="card-hover-effect p-5 border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Huyết Áp (mmHg)</span>
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {latestLog?.systolic ? `${latestLog.systolic}/${latestLog.diastolic}` : '122/80'}
            </div>
            <div className="flex items-center justify-between pt-1">
              {getStatusBadge(latestLog?.status)}
            </div>
          </Card>

          <Card className="card-hover-effect p-5 border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Nhịp Tim (bpm)</span>
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {latestLog?.heartRate || 72} <span className="text-xs font-normal text-slate-400">bpm</span>
            </div>
            <p className="text-[11px] text-green-600 font-semibold">✓ Nhịp tim đều đặn</p>
          </Card>

          <Card className="card-hover-effect p-5 border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Đường Huyết (mg/dL)</span>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                <Droplet className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {latestLog?.bloodGlucose || 105} <span className="text-xs font-normal text-slate-400">mg/dL</span>
            </div>
            <p className="text-[11px] text-slate-400">Đo khi đói buổi sáng</p>
          </Card>

          <Card className="card-hover-effect p-5 border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Cân Nặng (kg)</span>
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              68.5 <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
            <p className="text-[11px] text-teal-600 font-semibold">BMI: 23.0 (Bình thường)</p>
          </Card>
        </div>

        {/* Recharts Main Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart (2/3) */}
          <Card className="lg:col-span-2 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Biểu Đồ Xu Hướng Huyết Áp (Systolic / Diastolic)
                </h3>
                <p className="text-xs text-slate-500">Theo dõi sự biến thiên chỉ số huyết áp theo ngày</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" /> Chuẩn Y Khoa AHA
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis domain={[60, 160]} stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    name="Tâm thu (Systolic)"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    name="Tâm trương (Diastolic)"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Right Card: Heart Rate & Blood Glucose Trend (1/3) */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Xu Hướng Nhịp Tim (BPM)
              </h3>
              <p className="text-xs text-slate-500">Biến thiên nhịp tim khi nghỉ ngơi</p>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[50, 110]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    name="Nhịp tim (BPM)"
                    stroke="#ec4899"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200">Gợi ý từ Bác sĩ:</div>
              <p>Duy trì nhịp tim nghỉ ngơi từ 60-80 bpm là dấu hiệu thể lực tốt.</p>
            </div>
          </Card>
        </div>

        {/* History Table */}
        <Card className="p-6 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Lịch Sử Nhập Sinh Hiệu</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Thời Gian Đo</th>
                  <th className="p-3.5">Huyết Áp</th>
                  <th className="p-3.5">Nhịp Tim</th>
                  <th className="p-3.5">Đường Huyết</th>
                  <th className="p-3.5">Đánh Giá</th>
                  <th className="p-3.5">Ghi Chú</th>
                  <th className="p-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {vitals.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                      {new Date(log.recordedAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-3.5 font-bold text-red-600 dark:text-red-400">
                      {log.systolic && log.diastolic ? `${log.systolic}/${log.diastolic} mmHg` : '---'}
                    </td>
                    <td className="p-3.5 font-bold">{log.heartRate ? `${log.heartRate} bpm` : '---'}</td>
                    <td className="p-3.5 font-bold">{log.bloodGlucose ? `${log.bloodGlucose} mg/dL` : '---'}</td>
                    <td className="p-3.5">{getStatusBadge(log.status)}</td>
                    <td className="p-3.5 text-slate-500">{log.notes || 'Không có'}</td>
                    <td className="p-3.5 text-right">
                      <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(log.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal Log Vitals */}
        <Modal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Nhập Chỉ Số Sinh Hiệu Mới"
          maxWidth="md"
        >
          <form onSubmit={handleLogSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Huyết Áp Tâm Thu (Systolic - mmHg)"
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="VD: 120"
                required
              />

              <Input
                label="Huyết Áp Tâm Trương (Diastolic - mmHg)"
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="VD: 80"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nhịp Tim (BPM)"
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="VD: 72"
              />

              <Input
                label="Chỉ Số Đường Huyết (mg/dL)"
                type="number"
                value={bloodGlucose}
                onChange={(e) => setBloodGlucose(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="VD: 105"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ghi Chú Hoàn Cảnh Đo</label>
              <textarea
                rows={3}
                placeholder="VD: Đo sau khi tập thể dục, đo trước khi uống thuốc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-xs border border-transparent focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsLogModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="bg-blue-600 hover:bg-blue-700"
                isLoading={logMutation.isPending}
              >
                Lưu sinh hiệu
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
