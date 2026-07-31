'use client';

import React, { useState } from 'react';
import { AlertTriangle, AlertOctagon, ShieldAlert, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DDIInteraction } from '@/types';

interface UrgentAlertsProps {
  ddiWarnings?: DDIInteraction[];
  lowStockItems?: { id: string; name: string; remaining: number; unit: string }[];
  abnormalVitals?: { type: string; value: string; note: string }[];
  onOpenMedicationStock?: () => void;
}

export const UrgentAlerts: React.FC<UrgentAlertsProps> = ({
  ddiWarnings = [
    {
      id: 'ddi-1',
      drugA: 'Aspirin 81mg',
      drugB: 'Ibuprofen 400mg',
      severity: 'critical',
      title: 'Tương Tác Thuốc Nguy Hiểm (DDI Level 1)',
      description: 'Chống chỉ định dùng chung Aspirin và Ibuprofen do giảm hiệu quả chống đông máu và tăng nguy cơ xuất huyết tiêu hóa.',
      recommendation: 'Tham khảo ý kiến bác sĩ hoặc giãn thời gian uống tối thiểu 8 tiếng.',
    },
  ],
  lowStockItems = [
    { id: 'm-1', name: 'Paracetamol 500mg', remaining: 2, unit: 'viên' },
  ],
  abnormalVitals = [
    { type: 'Huyết áp', value: '148/92 mmHg', note: 'Vượt ngưỡng bình thường (Stage 2 Hypertension)' },
  ],
  onOpenMedicationStock,
}) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const activeDDIs = ddiWarnings.filter((item) => !dismissedIds.includes(item.id));
  const activeStock = lowStockItems.filter((item) => !dismissedIds.includes(`stock-${item.id}`));
  const activeVitals = abnormalVitals.filter((item) => !dismissedIds.includes(`vital-${item.type}`));

  if (activeDDIs.length === 0 && activeStock.length === 0 && activeVitals.length === 0) {
    return null; // All alerts resolved
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {/* DDI Critical Warnings Banner */}
        {activeDDIs.map((ddi) => (
          <motion.div
            key={ddi.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden rounded-2xl border border-rose-300 dark:border-rose-900 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent p-4 sm:p-5 shadow-lg glow-rose relative"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30 animate-pulse">
                <AlertOctagon className="w-6 h-6" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                    🚨 DDI Critical Alert
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base text-rose-950 dark:text-rose-200">
                    {ddi.title}
                  </h4>
                </div>

                <p className="text-xs text-rose-900 dark:text-rose-300 leading-relaxed">
                  Phát hiện tương tác giữa <strong className="underline decoration-rose-400 font-extrabold">{ddi.drugA}</strong> và <strong className="underline decoration-rose-400 font-extrabold">{ddi.drugB}</strong>. {ddi.description}
                </p>

                <div className="pt-2 flex items-center gap-3 text-xs">
                  <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    💡 Khuyến nghị lâm sàng: {ddi.recommendation}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDismiss(ddi.id)}
                className="text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors"
                title="Đã xem cảnh báo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}

        {/* Low Inventory Warnings Ribbon */}
        {activeStock.map((stock) => (
          <motion.div
            key={`stock-${stock.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden rounded-2xl border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4 shadow-sm glow-amber"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    ⚠️ Tồn Kho Sắp Hết: {stock.name}
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                    Chỉ còn lại <span className="font-black underline">{stock.remaining} {stock.unit}</span>. Hãy nạp lại tủ thuốc để không ngắt quãng liệu trình.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onOpenMedicationStock && (
                  <button
                    onClick={onOpenMedicationStock}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1"
                  >
                    Nạp Thuốc <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDismiss(`stock-${stock.id}`)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Abnormal Vitals Warnings Ribbon */}
        {activeVitals.map((vital) => (
          <motion.div
            key={`vital-${vital.type}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden rounded-2xl border border-sky-300 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🚨 Cảnh Báo Sinh Tồn: {vital.type} ({vital.value})</span>
                  </h4>
                  <p className="text-xs text-sky-800 dark:text-sky-300 font-medium">
                    {vital.note}. Đã ghi nhận trong hồ sơ lâm sàng.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDismiss(`vital-${vital.type}`)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
