'use client';

import React from 'react';
import { Check, TrendingDown } from 'lucide-react';
import { TaperingMedication } from '@/types';

interface TaperingDoseWidgetProps {
  taperingData?: TaperingMedication;
}

export const TaperingDoseWidget: React.FC<TaperingDoseWidgetProps> = ({ taperingData }) => {
  const data: TaperingMedication = taperingData || {
    id: 'tap-1',
    medicationName: 'Methylprednisolone 16mg (Corticosteroid)',
    totalDays: 5,
    currentDay: 2,
    steps: [
      { dayNumber: 1, date: '30/07', dosage: 3, unit: 'viên (48mg)', status: 'completed', notes: 'Uống sáng 2 viên, tối 1 viên' },
      { dayNumber: 2, date: '31/07 (Hôm nay)', dosage: 2, unit: 'viên (32mg)', status: 'current', notes: 'Uống sáng 1 viên, tối 1 viên' },
      { dayNumber: 3, date: '01/08', dosage: 1, unit: 'viên (16mg)', status: 'upcoming', notes: 'Uống buổi sáng' },
      { dayNumber: 4, date: '02/08', dosage: 0.5, unit: 'viên (8mg)', status: 'upcoming', notes: 'Uống buổi sáng' },
      { dayNumber: 5, date: '03/08', dosage: 0, unit: 'Ngừng thuốc', status: 'upcoming', notes: 'Kết thúc liệu trình' },
    ],
  };

  return (
    <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-amber-500" />
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Lịch Trình Liều Giảm Dần (Tapering Schedule)
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              {data.medicationName}
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black text-[11px]">
          Ngày {data.currentDay}/{data.totalDays}
        </span>
      </div>

      {/* Step Visualizer */}
      <div className="grid grid-cols-5 gap-2 pt-2">
        {data.steps.map((step) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div
              key={step.dayNumber}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                isCurrent
                  ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/50 ring-2 ring-amber-400/30 shadow-md'
                  : isCompleted
                  ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20 opacity-80'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Ngày {step.dayNumber}
                </span>
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                  {step.date.split(' ')[0]}
                </div>
              </div>

              {/* Pillar Representation */}
              <div className="my-2 flex flex-col items-center">
                <div className={`w-8 rounded-lg flex items-center justify-center font-black text-xs tabular-nums text-white ${
                  isCurrent ? 'bg-amber-500 h-10 shadow-sm' : isCompleted ? 'bg-emerald-500 h-8' : 'bg-slate-300 dark:bg-slate-700 h-6'
                }`}>
                  {step.dosage}
                </div>
              </div>

              <div className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
                {step.unit}
              </div>

              {isCompleted && (
                <span className="mt-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-bold flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" /> Hoàn thành
                </span>
              )}
              {isCurrent && (
                <span className="mt-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-bold animate-pulse">
                  Đang áp dụng
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
        💡 <strong>Ghi chú lâm sàng:</strong> Giảm dần liều Corticosteroid giúp tuyến thượng thận dần phục hồi chức năng tự nhiên, tránh hội chứng cai thuốc.
      </div>
    </div>
  );
};
