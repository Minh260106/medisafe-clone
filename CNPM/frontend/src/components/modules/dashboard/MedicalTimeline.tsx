'use client';

import React, { useState } from 'react';
import { Clock, CheckCheck } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { DosageScheduleItem } from '@/types';
import { TimelineItem } from './TimelineItem';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface MedicalTimelineProps {
  items: DosageScheduleItem[];
  onTake: (id: string) => void;
  onSkip: (id: string, reason?: string) => void;
  onTakeLate: (id: string) => void;
  onTakeAllPending: () => void;
  onSelectDetail: (item: DosageScheduleItem) => void;
  isLoading?: boolean;
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({
  items,
  onTake,
  onSkip,
  onTakeLate,
  onTakeAllPending,
  onSelectDetail,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [loggingReasonItem, setLoggingReasonItem] = useState<DosageScheduleItem | null>(null);
  const [skipReasonText, setSkipReasonText] = useState('');

  // Filter items by time period
  const filteredItems = items.filter((item) => {
    if (filterPeriod === 'all') return true;
    const hour = parseInt(item.scheduledTime.split(':')[0], 10);
    if (filterPeriod === 'morning') return hour >= 5 && hour < 12;
    if (filterPeriod === 'afternoon') return hour >= 12 && hour < 18;
    if (filterPeriod === 'evening') return hour >= 18 || hour < 5;
    return true;
  });

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  const handleSaveSkipReason = () => {
    if (loggingReasonItem) {
      onSkip(loggingReasonItem.id, skipReasonText);
      setLoggingReasonItem(null);
      setSkipReasonText('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
            Timeline Uống Thuốc
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-black text-xs tabular-nums">
            {items.length} Liều
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'morning', label: '🌅 Sáng' },
            { id: 'afternoon', label: '☀️ Trưa' },
            { id: 'evening', label: '🌙 Tối' },
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => setFilterPeriod(period.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                filterPeriod === period.id
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {period.label}
            </button>
          ))}

          {pendingCount > 0 && (
            <button
              onClick={onTakeAllPending}
              className="ml-2 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-md shadow-emerald-500/20 transition-transform active:scale-95 flex items-center gap-1 shrink-0"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Uống Tất Cả ({pendingCount})
            </button>
          )}
        </div>
      </div>

      {/* Timeline Container with Vertical Stem Line */}
      <div className="relative pl-4 sm:pl-6 space-y-4">
        {/* Vertical Stem Line */}
        <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-sky-400 via-emerald-400 to-slate-200 dark:to-slate-800" />

        <AnimatePresence>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="relative">
                {/* Node Bullet on Vertical Stem */}
                <div
                  className={`absolute -left-4 sm:-left-6 top-6 w-3 h-3 rounded-full border-2 bg-white dark:bg-slate-900 transition-colors z-10 ${
                    item.status === 'taken'
                      ? 'border-emerald-500 bg-emerald-500'
                      : item.status === 'skipped'
                      ? 'border-rose-500 bg-rose-500'
                      : 'border-sky-500 animate-pulse'
                  }`}
                />
                <TimelineItem
                  item={item}
                  onTake={onTake}
                  onSkip={onSkip}
                  onTakeLate={onTakeLate}
                  onLogReason={(item) => setLoggingReasonItem(item)}
                  onSelectDetail={onSelectDetail}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-500">
                Không có lịch uống thuốc nào trong khoảng thời gian đã chọn.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Log Reason when Missed */}
      {loggingReasonItem && (
        <Modal
          isOpen={!!loggingReasonItem}
          onClose={() => setLoggingReasonItem(null)}
          title={`Ghi Nhận Lý Do Bỏ Thuốc: ${loggingReasonItem.medicationName}`}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Vui lòng cho biết lý do bạn bỏ lỡ liều <strong className="text-slate-800 dark:text-slate-200">{loggingReasonItem.scheduledTime}</strong> để báo cáo bác sĩ theo dõi chính xác.
            </p>

            <div className="space-y-2">
              {[
                'Tác dụng phụ gây khó chịu (buồn nôn, mệt mỏi)',
                'Quên mang theo thuốc khi ra ngoài',
                'Cảm thấy đã bớt bệnh nên ngưng',
                'Bị trùng giờ với công việc quan trọng',
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSkipReasonText(reason)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                    skipReasonText === reason
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <textarea
              value={skipReasonText}
              onChange={(e) => setSkipReasonText(e.target.value)}
              placeholder="Hoặc nhập lý do khác..."
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setLoggingReasonItem(null)}>
                Hủy
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveSkipReason}>
                Lưu Báo Cáo
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
