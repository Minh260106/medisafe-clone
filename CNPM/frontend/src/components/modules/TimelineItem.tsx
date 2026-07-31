import React from 'react';
import { Pill, Check, X, Circle, Egg, Square, Droplet, Syringe } from 'lucide-react';
import { DosageScheduleItem, PillShape } from '@/types';

interface TimelineItemProps {
  item: DosageScheduleItem;
  isLast?: boolean;
  onTake: (id: string) => void;
  onSkip: (id: string) => void;
}

const renderPillIcon = (shape: PillShape, colorHex: string) => {
  const props = { className: 'w-6 h-6', style: { color: colorHex } };
  switch (shape) {
    case 'capsule':
      return <Pill {...props} />;
    case 'round':
      return <Circle {...props} />;
    case 'oval':
      return <Egg {...props} />;
    case 'square':
      return <Square {...props} />;
    case 'liquid':
      return <Droplet {...props} />;
    case 'injection':
      return <Syringe {...props} />;
    default:
      return <Pill {...props} />;
  }
};

export const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  isLast = false,
  onTake,
  onSkip,
}) => {
  const isTaken = item.status === 'taken';
  const isSkipped = item.status === 'skipped';

  return (
    <div className="relative flex items-start gap-4 sm:gap-6 group">
      {/* Vertical Connecting Line */}
      {!isLast && (
        <span className="absolute left-6 top-14 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-400 transition-colors" />
      )}

      {/* Left Column: Scheduled Time & Pill Shape Icon */}
      <div className="flex flex-col items-center shrink-0 z-10">
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center group-hover:border-blue-500 transition-all">
          {renderPillIcon(item.shape, item.color)}
        </div>
        <span className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">
          {item.scheduledTime}
        </span>
      </div>

      {/* Middle Column: Card Content */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm group-hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-slate-800 dark:text-white">
              {item.medicationName}
            </h4>
            {isTaken && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Đã uống
              </span>
            )}
            {isSkipped && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                Bỏ qua
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Liều dùng: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.dosage} {item.unit}</span>
          </p>
        </div>

        {/* Right Column: Quick Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => onTake(item.id)}
            title="Đánh dấu đã uống (Take)"
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
              isTaken
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white'
            }`}
          >
            <Check className="w-5 h-5 stroke-[3]" />
          </button>

          <button
            onClick={() => onSkip(item.id)}
            title="Đánh dấu bỏ qua (Skip)"
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
              isSkipped
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 hover:bg-rose-500 hover:text-white'
            }`}
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
