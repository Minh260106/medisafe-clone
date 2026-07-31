'use client';

import React, { useState } from 'react';
import { Bell, Moon, Globe, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsPage() {
  const { theme, toggleTheme, notificationsEnabled, setNotificationsEnabled } = useAppStore();
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');
  const [pushStatus, setPushStatus] = useState<string>('Sẵn sàng kích hoạt Web Push');

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setPushStatus('✅ Đã bật Web Push Notification thành công!');
        } else {
          setPushStatus('⚠️ Quyền thông báo bị từ chối.');
        }
      } catch {
        setPushStatus('Không thể yêu cầu quyền thông báo trên trình duyệt này.');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cài Đặt Hệ Thống</h1>
          <p className="text-xs text-slate-500">Cấu hình giao diện, thông báo Web Push và múi giờ nhắc nhở</p>
        </div>

        {/* Theme Settings */}
        <Card className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-sky-600" />
            Giao Diện & Chế Độ Tối
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-750">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">Chế độ tối (Dark Mode)</div>
              <div className="text-xs text-slate-500">Bật chế độ tối giúp dịu mắt khi sử dụng ban đêm</div>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              {theme === 'light' ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Thông Báo Web Push & Âm Báo
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-750">
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white">Bật nhắc nhở uống thuốc</div>
                <div className="text-xs text-slate-500">Tự động phát thông báo khi tới giờ hẹn uống thuốc</div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/40">
              <div className="space-y-1">
                <div className="font-bold text-sm text-sky-900 dark:text-sky-300">PWA Web Push Notification</div>
                <div className="text-xs text-sky-700 dark:text-sky-400">{pushStatus}</div>
              </div>
              <Button size="sm" variant="secondary" onClick={requestPushPermission}>
                Kích hoạt Web Push
              </Button>
            </div>
          </div>
        </Card>

        {/* Regional & Timezone Settings */}
        <Card className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            Ngôn Ngữ & Múi Giờ (Timezone)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Ngôn ngữ giao diện</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'vi' | 'en')}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 p-2.5 outline-none"
              >
                <option value="vi">Tiếng Việt (Việt Nam)</option>
                <option value="en">English (United States)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Múi giờ nhắc nhở</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 p-2.5 outline-none"
              >
                <option value="Asia/Ho_Chi_Minh">(UTC+07:00) Bangkok, Hanoi, Jakarta</option>
                <option value="UTC">(UTC+00:00) Coordinated Universal Time</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>MediSafe Clone Version 1.0.0 (Enterprise Progressive Web App Ready)</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
