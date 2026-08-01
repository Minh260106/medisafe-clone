'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <main
      role="main"
      className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-6 py-12"
    >
      <div className="max-w-md w-full rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner border border-emerald-100 dark:border-emerald-900/50">
          <FileQuestion className="w-10 h-10" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/80 px-3 py-1 rounded-full">
            Mã lỗi 404
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Không tìm thấy trang</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển. Hãy quay về bảng điều khiển để tiếp tục.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors"
          >
            <Home className="w-4 h-4" /> Bảng điều khiển
          </Link>

          <button
            onClick={() => history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
        </div>
      </div>
    </main>
  );
}
