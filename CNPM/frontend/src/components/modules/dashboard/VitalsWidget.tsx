'use client';

import React, { useState } from 'react';
import { Activity, Heart, Droplets, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VitalLog } from '@/types';

interface VitalsWidgetProps {
  onSaveVital?: (vital: Partial<VitalLog>) => void;
}

export const VitalsWidget: React.FC<VitalsWidgetProps> = ({ onSaveVital }) => {
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [heartRate, setHeartRate] = useState<number>(75);
  const [bloodGlucose, setBloodGlucose] = useState<number>(95);
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);

  // Recent logs mock state
  const [logs, setLogs] = useState<VitalLog[]>([
    {
      id: 'v-1',
      systolic: 120,
      diastolic: 80,
      heartRate: 75,
      bloodGlucose: 95,
      recordedAt: '08:00 AM Hôm nay',
      status: 'normal',
    },
  ]);

  // Clinical calculation for Blood Pressure Stage
  const getBPClassification = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: 'Huyết Áp Lý Tưởng', color: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300' };
    if (sys <= 129 && dia < 80) return { label: 'Huyết Áp Tiền Cao', color: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300' };
    if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) return { label: 'Cao Huyết Áp Độ 1', color: 'bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-950 dark:text-amber-300' };
    return { label: 'Cao Huyết Áp Độ 2 🚨', color: 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300' };
  };

  const bpStatus = getBPClassification(systolic, diastolic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: VitalLog = {
      id: `v-${Date.now()}`,
      systolic,
      diastolic,
      heartRate,
      bloodGlucose,
      recordedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: systolic > 140 ? 'high_stage2' : 'normal',
    };

    setLogs((prev) => [newLog, ...prev]);
    if (onSaveVital) onSaveVital(newLog);

    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  return (
    <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
            Chỉ Số Sinh Tồn (Vitals Log)
          </h4>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-extrabold ${bpStatus.color}`}>
          {bpStatus.label}
        </span>
      </div>

      {/* Form Input Grid */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Blood Pressure */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-sky-600" /> Huyết Áp (mmHg)
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                className="w-14 p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-center tabular-nums outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="120"
                required
              />
              <span className="text-xs font-bold text-slate-400">/</span>
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(Number(e.target.value))}
                className="w-14 p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-center tabular-nums outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="80"
                required
              />
            </div>
          </div>

          {/* Heart Rate */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Nhịp Tim (BPM)
            </label>
            <input
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(Number(e.target.value))}
              className="w-full p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-center tabular-nums outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="75"
              required
            />
          </div>
        </div>

        {/* Blood Glucose */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-purple-600" />
            <span className="text-[11px] font-bold text-slate-500">Đường Huyết (mg/dL)</span>
          </div>
          <input
            type="number"
            value={bloodGlucose}
            onChange={(e) => setBloodGlucose(Number(e.target.value))}
            className="w-20 p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-center tabular-nums outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="95"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-md shadow-sky-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Ghi Nhận Chỉ Số Mới
        </button>
      </form>

      {/* Success Notification */}
      <AnimatePresence>
        {isSavedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Đã lưu chỉ số sinh tồn thành công!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Log History */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Lịch sử gần đây</span>
        {logs.slice(0, 2).map((log) => (
          <div key={log.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">
              BP: {log.systolic}/{log.diastolic} • HR: {log.heartRate} bpm
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{log.recordedAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
