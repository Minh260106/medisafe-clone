'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  ChevronDown,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { initialMockNotifications } from '@/services/mockData';

export const Header: React.FC = () => {
  const router = useRouter();
  const { toggleSidebar, theme, toggleTheme } = useAppStore();
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = initialMockNotifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <header className="h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Sidebar Trigger & Quick Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm thuốc, lịch uống, bác sĩ..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-900 dark:text-slate-100 text-xs border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right: Actions & User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Chuyển chế độ Dark/Light"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500" />
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Thông báo</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    router.push(ROUTES.DASHBOARD.NOTIFICATIONS);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {initialMockNotifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setShowNotifications(false);
                      if (notif.linkUrl) router.push(notif.linkUrl);
                    }}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                      !notif.isRead
                        ? 'bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40'
                        : 'bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {notif.type === 'reminder' && <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                    {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                    {notif.type === 'appointment' && <Calendar className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />}
                    {notif.type === 'system' && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                    <div className="text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white">{notif.title}</div>
                      <div className="text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-slate-900 dark:text-white">{user?.fullName || 'Minh'}</div>
              <div className="text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                {user?.email || 'minh@medisafe.vn'}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.fullName || 'Minh'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'minh@medisafe.vn'}</p>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push(ROUTES.DASHBOARD.PROFILE);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Hồ sơ cá nhân
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push(ROUTES.DASHBOARD.SETTINGS);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Cài đặt hệ thống
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
