'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, Home } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-6">
      <div className="max-w-lg w-full rounded-3xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-800 p-8 text-center space-y-6 shadow-xl">
        <div className="text-sm uppercase tracking-[0.3em] text-rose-500 font-bold">Error boundary</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Đã có lỗi xảy ra</h1>
          <p className="text-sm text-slate-500">Trang này không thể render đúng lúc này. Bạn có thể thử tải lại hoặc quay về dashboard.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-rose-600/20">
            <RefreshCcw className="w-4 h-4" /> Thử lại
          </button>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Home className="w-4 h-4" /> Về dashboard
          </Link>
          <button onClick={() => history.back()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
