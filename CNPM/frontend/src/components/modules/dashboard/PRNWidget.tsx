'use client';

import React, { useState } from 'react';
import { Pill, Thermometer, AlertCircle, Plus, CheckCircle2 } from 'lucide-react';
import { PRNMedication } from '@/types';

interface PRNWidgetProps {
  onLogPRN?: (med: PRNMedication, painLevel: number) => void;
}

export const PRNWidget: React.FC<PRNWidgetProps> = ({ onLogPRN }) => {
  const [painScale, setPainScale] = useState<number>(8);
  const [selectedMedId, setSelectedMedId] = useState<string>('prn-1');
  const [lastLoggedMessage, setLastLoggedMessage] = useState<string | null>(null);

  const prnMeds: PRNMedication[] = [
    {
      id: 'prn-1',
      name: 'Efferalgan Codeine',
      dosage: 500,
      unit: 'mg',
      shape: 'round',
      color: '#3b82f6',
      indication: 'Giảm đau cấp tính (Đau > 7/10)',
      minHoursBetweenDoses: 4,
      maxDosesPerDay: 4,
      takenTodayCount: 1,
      stockQuantity: 12,
    },
    {
      id: 'prn-2',
      name: 'Siro Gaviscon Dual Action',
      dosage: 10,
      unit: 'ml',
      shape: 'liquid',
      color: '#10b981',
      indication: 'Trào ngược dạ dày / Cơn ợ nóng',
      minHoursBetweenDoses: 3,
      maxDosesPerDay: 3,
      takenTodayCount: 0,
      stockQuantity: 8,
    },
  ];

  const currentMed = prnMeds.find((m) => m.id === selectedMedId) || prnMeds[0];

  const handleTakePRN = () => {
    if (onLogPRN) onLogPRN(currentMed, painScale);
    setLastLoggedMessage(`Đã ghi nhận 1 liều ${currentMed.name} (${painScale}/10) lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`);
    setTimeout(() => setLastLoggedMessage(null), 4000);
  };

  const getPainScaleColor = () => {
    if (painScale >= 8) return 'text-rose-600 dark:text-rose-400 bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-900';
    if (painScale >= 5) return 'text-amber-600 dark:text-amber-400 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-900';
    return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-900';
  };

  return (
    <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
            Thuốc Uống Khi Cần (PRN Medications)
          </h4>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-[11px]">
          Không Có Giờ Cố Định
        </span>
      </div>

      {/* Select Med Dropdown */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {prnMeds.map((med) => (
            <button
              key={med.id}
              onClick={() => setSelectedMedId(med.id)}
              className={`p-3 rounded-2xl border text-left flex-1 min-w-[160px] transition-all ${
                selectedMedId === med.id
                  ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <div className="font-bold text-xs text-slate-900 dark:text-white">{med.name}</div>
              <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                {med.indication}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-1 flex items-center justify-between">
                <span>{med.dosage} {med.unit}</span>
                <span>Hôm nay: {med.takenTodayCount}/{med.maxDosesPerDay} liều</span>
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Pain Scale Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-500" />
              Đánh Giá Cường Độ Đau / Triệu Chứng:
            </span>
            <span className={`px-3 py-1 rounded-xl border text-xs font-black tabular-nums ${getPainScaleColor()}`}>
              {painScale} / 10
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={painScale}
            onChange={(e) => setPainScale(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />

          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>0 - Không đau</span>
            <span>5 - Đau vừa</span>
            <span>10 - Đau dữ dội</span>
          </div>

          {/* Logic trigger warning */}
          {painScale >= 7 ? (
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Cường độ đau ({painScale}/10) vượt ngưỡng quy định. Đủ điều kiện dùng 1 liều {currentMed.name}.
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-medium">
              Cường độ đau nhẹ ({painScale}/10). Nên nghỉ ngơi và chỉ uống thuốc khi đau &gt; 7.
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleTakePRN}
          disabled={currentMed.takenTodayCount >= currentMed.maxDosesPerDay}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md shadow-purple-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Uống 1 Liều {currentMed.name} ({currentMed.dosage} {currentMed.unit})
        </button>

        {lastLoggedMessage && (
          <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {lastLoggedMessage}
          </div>
        )}
      </div>
    </div>
  );
};
