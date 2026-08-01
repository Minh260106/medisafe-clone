'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: TriangleAlert,
} as const;

export function ToastViewport() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className={`pointer-events-auto rounded-2xl border bg-white p-4 shadow-xl dark:bg-slate-800 ${
                toast.type === 'success'
                  ? 'border-emerald-200 dark:border-emerald-900'
                  : toast.type === 'error'
                  ? 'border-rose-200 dark:border-rose-900'
                  : toast.type === 'warning'
                  ? 'border-amber-200 dark:border-amber-900'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-full p-2 ${
                    toast.type === 'success'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
                      : toast.type === 'error'
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300'
                      : toast.type === 'warning'
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{toast.title}</h4>
                      {toast.description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{toast.description}</p>}
                    </div>
                    <button
                      onClick={() => removeToast(toast.id)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      aria-label="Đóng thông báo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {(toast.actionLabel || toast.onAction) && (
                    <div className="mt-3 flex items-center justify-end gap-2">
                      {toast.onAction && toast.actionLabel && (
                        <button
                          onClick={() => {
                            toast.onAction?.();
                            removeToast(toast.id);
                          }}
                          className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                        >
                          {toast.actionLabel}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
