'use client';

import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Pill,
  Syringe,
  Droplet,
  RotateCcw,
  MessageSquareText,
  Info,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DosageScheduleItem, PillShape } from '@/types';

interface TimelineItemProps {
  item: DosageScheduleItem;
  onTake: (id: string) => void;
  onSkip: (id: string) => void;
  onTakeLate?: (id: string) => void;
  onLogReason?: (item: DosageScheduleItem) => void;
  onSelectDetail: (item: DosageScheduleItem) => void;
}

export const TimelineItemIcon: React.FC<{ shape: PillShape; className?: string }> = ({ shape, className = "w-5 h-5" }) => {
  switch (shape) {
    case 'injection':
      return <Syringe className={className} />;
    case 'liquid':
      return <Droplet className={className} />;
    case 'capsule':
      return <Pill className={className} />;
    default:
      return <Pill className={className} />;
  }
};

export const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  onTake,
  onSkip,
  onTakeLate,
  onLogReason,
  onSelectDetail,
}) => {
  const isTaken = item.status === 'taken';
  const isSkipped = item.status === 'skipped';
  const isPending = item.status === 'pending';

  // Dynamic visual styling based on status
  const getContainerStyle = () => {
    if (isTaken) {
      return 'opacity-60 bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:opacity-90';
    }
    if (isSkipped) {
      return 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 shadow-sm';
    }
    return 'bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-900/80 shadow-[0_4px_20px_-4px_rgba(14,165,233,0.12)] hover:border-sky-400 hover:shadow-md';
  };

  const getTimeBadgeStyle = () => {
    if (isTaken) return 'bg-emerald-600 text-white';
    if (isSkipped) return 'bg-rose-600 text-white';
    return 'bg-sky-600 text-white animate-pulse-subtle';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`relative group rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${getContainerStyle()}`}
      onClick={() => onSelectDetail(item)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Scheduled Time + Details */}
        <div className="flex items-center gap-4">
          {/* Icon + Time Box */}
          <div className="flex flex-col items-center shrink-0">
            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-sm shadow-md transition-transform group-hover:scale-105 ${getTimeBadgeStyle()}`}>
              <TimelineItemIcon shape={item.shape} className="w-5 h-5 mb-0.5" />
              <span className="tabular-nums font-extrabold">{item.scheduledTime}</span>
            </div>
          </div>

          {/* Med Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {item.medicationName}
              </span>

              {/* Status Badge */}
              {isTaken && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã uống
                </span>
              )}

              {isSkipped && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-300 dark:border-rose-800">
                  <XCircle className="w-3.5 h-3.5" />
                  Bỏ lỡ
                </span>
              )}

              {isPending && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-300 dark:border-sky-800 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  Chờ uống
                </span>
              )}

              {/* Tags for PRN / Tapering */}
              {item.isPRN && (
                <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase">
                  PRN (Khi cần)
                </span>
              )}
              {item.isTapering && (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase">
                  Liều Giảm Dần (Ngày {item.taperingDay || 1})
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
              <span>Liều lượng: <strong className="text-slate-800 dark:text-slate-200 font-bold tabular-nums">{item.dosage} {item.unit}</strong></span>
              <span>•</span>
              <span className="text-slate-500">{item.instructions || 'Uống theo đúng hướng dẫn bác sĩ'}</span>
            </p>

            {/* Timestamp log if taken */}
            {isTaken && item.takenAt && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                ✓ Đã xác nhận uống lúc <span className="tabular-nums font-bold">{item.takenAt}</span>
              </p>
            )}

            {/* Notes log if skipped */}
            {isSkipped && item.notes && (
              <p className="text-[11px] text-rose-500 font-medium pt-0.5">
                Lý do: {item.notes}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Action Triggers */}
        <div 
          className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0" 
          onClick={(e) => e.stopPropagation()}
        >
          {isPending && (
            <>
              <button
                onClick={() => onTake(item.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Đã Uống
              </button>
              <button
                onClick={() => onSkip(item.id)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold active:scale-95 transition-all flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                Bỏ qua
              </button>
            </>
          )}

          {isSkipped && (
            <>
              <button
                onClick={() => onTakeLate && onTakeLate(item.id)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Uống Bù
              </button>
              <button
                onClick={() => onLogReason && onLogReason(item)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold active:scale-95 transition-all flex items-center gap-1"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                Lý do
              </button>
            </>
          )}

          {isTaken && (
            <button
              onClick={() => onSelectDetail(item)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-bold flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" /> Chi tiết
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
