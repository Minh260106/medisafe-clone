'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { AdherenceHeatmapDay } from '@/types';

interface AdherenceHeatmapProps {
  days?: AdherenceHeatmapDay[];
}

export const AdherenceHeatmap: React.FC<AdherenceHeatmapProps> = ({ days }) => {
  const [hoveredDay, setHoveredDay] = useState<AdherenceHeatmapDay | null>(null);

  // Generate 30 days mock data if not provided
  const heatmapData: AdherenceHeatmapDay[] = days || Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    
    // Create realistic pattern
    let status: AdherenceHeatmapDay['status'] = 'perfect';
    if (i === 5 || i === 18) status = 'missed';
    else if (i === 12 || i === 22) status = 'partial';

    return {
      date: dateStr,
      count: status === 'perfect' ? 4 : status === 'partial' ? 2 : status === 'missed' ? 0 : 0,
      status,
    };
  });

  const getSquareColor = (status: AdherenceHeatmapDay['status']) => {
    switch (status) {
      case 'perfect':
        return 'bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/30';
      case 'partial':
        return 'bg-amber-400 hover:bg-amber-500 shadow-sm shadow-amber-400/30';
      case 'missed':
        return 'bg-rose-500 hover:bg-rose-600 shadow-sm shadow-rose-500/30';
      default:
        return 'bg-slate-200 dark:bg-slate-800';
    }
  };

  const perfectCount = heatmapData.filter((d) => d.status === 'perfect').length;
  const adherencePercent = Math.round((perfectCount / heatmapData.length) * 100);

  return (
    <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
            Ma Trận Tuân Thủ (30 Ngày)
          </h4>
        </div>
        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          {adherencePercent}% Đạt Chuẩn
        </span>
      </div>

      {/* Grid Render */}
      <div className="space-y-2">
        <div className="grid grid-cols-10 gap-1.5 pt-1">
          {heatmapData.map((day) => (
            <div
              key={day.date}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`h-6 rounded-md transition-all duration-200 cursor-pointer transform hover:scale-110 ${getSquareColor(
                day.status
              )}`}
              title={`${day.date}: ${day.status === 'perfect' ? '100% Đúng Giờ' : day.status === 'partial' ? 'Uống Một Phần' : 'Bỏ Lỡ'}`}
            />
          ))}
        </div>

        {/* Hover Info Tooltip Bar */}
        <div className="h-6 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 pt-1">
          {hoveredDay ? (
            <span className="font-bold text-slate-800 dark:text-slate-200">
              📅 {hoveredDay.date}:{' '}
              <span className={hoveredDay.status === 'perfect' ? 'text-emerald-600 font-extrabold' : hoveredDay.status === 'missed' ? 'text-rose-600 font-extrabold' : 'text-amber-500 font-extrabold'}>
                {hoveredDay.status === 'perfect' ? '100% Hoàn Thành' : hoveredDay.status === 'partial' ? 'Chưa Uống Đủ' : 'Bỏ Lỡ Thuốc'}
              </span>
            </span>
          ) : (
            <span>Di chuột vào từng ô để xem chi tiết</span>
          )}

          {/* Legend */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" title="Hoàn thành" />
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" title="Uống 1 phần" />
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" title="Bỏ lỡ" />
          </div>
        </div>
      </div>
    </div>
  );
};
