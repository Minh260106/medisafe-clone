'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Pill,
  Calendar,
  History,
  CalendarDays,
  Activity,
  Bell,
  User,
  Settings,
  X,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ROUTES } from '@/constants/routes';

const navItems = [
  { name: 'Tổng quan', href: ROUTES.DASHBOARD.OVERVIEW, icon: LayoutDashboard },
  { name: 'Danh mục Thuốc', href: ROUTES.DASHBOARD.MEDICATIONS, icon: Pill },
  { name: 'Lịch & Nhắc nhở', href: ROUTES.DASHBOARD.SCHEDULE, icon: Calendar },
  { name: 'Lịch sử uống thuốc', href: ROUTES.DASHBOARD.HISTORY, icon: History },
  { name: 'Lịch hẹn khám bệnh', href: ROUTES.DASHBOARD.APPOINTMENTS, icon: CalendarDays },
  { name: 'Theo dõi Sức khỏe', href: ROUTES.DASHBOARD.HEALTH_TRACKER, icon: Activity },
  { name: 'Thông báo hệ thống', href: ROUTES.DASHBOARD.NOTIFICATIONS, icon: Bell },
  { name: 'Hồ sơ cá nhân', href: ROUTES.DASHBOARD.PROFILE, icon: User },
  { name: 'Cài đặt hệ thống', href: ROUTES.DASHBOARD.SETTINGS, icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-800 border-r border-slate-200/80 dark:border-slate-700/80 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-700/60">
          <Link href={ROUTES.DASHBOARD.OVERVIEW} className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 min-w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Pill className="w-6 h-6" />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent truncate">
                MediSafe
              </span>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                {sidebarOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer info badge when open */}
        {sidebarOpen && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-700/60">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/60 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
                <ShieldCheck className="w-4 h-4 text-teal-500" /> MediSafe Pro
              </div>
              <p className="text-slate-500 dark:text-slate-400">Hệ thống Y tế Chuẩn hóa</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
