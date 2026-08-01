'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Globe, Lock, Moon, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

const LANGUAGE_KEY = 'medisafe_language';

export default function SettingsPage() {
  const { theme, toggleTheme, notificationsEnabled, setNotificationsEnabled } = useAppStore();
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage === 'vi' || savedLanguage === 'en') {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Cài đặt hệ thống</h1>
          <p className="text-xs text-slate-500">Theme và ngôn ngữ lưu localStorage, còn các mục khác được khoá vì backend chưa hỗ trợ.</p>
        </div>

        <Card className="space-y-4 p-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-sky-600" /> Giao diện
          </h3>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-4">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Chế độ sáng/tối</div>
              <div className="text-xs text-slate-500">Đổi theme sẽ được lưu ngay vào localStorage.</div>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              {theme === 'light' ? 'Chuyển sang Dark' : 'Chuyển sang Light'}
            </Button>
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" /> Ngôn ngữ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Ngôn ngữ giao diện</label>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as 'vi' | 'en')}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 p-3 outline-none"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-6 opacity-90">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" /> Thông báo
          </h3>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-4">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Nhắc nhở uống thuốc</div>
              <div className="text-xs text-slate-500">Công tắc này chỉ lưu local UI state.</div>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(event) => setNotificationsEnabled(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
          </div>
        </Card>

        <Card className="space-y-4 p-6 border-dashed border-slate-300 dark:border-slate-700">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-500" /> Tính năng chưa hỗ trợ
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Đổi mật khẩu, quyền riêng tư và cài đặt nâng cao khác chưa có API thật ở backend hiện tại, nên chỉ hiển thị ghi chú thay vì form giả.
          </p>
          <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            Khi backend mở rộng, có thể thêm các form này mà không làm sai luồng thật hiện tại.
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
