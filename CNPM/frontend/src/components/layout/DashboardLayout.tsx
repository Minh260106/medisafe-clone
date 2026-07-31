'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';
import { useAppStore } from '@/store/useAppStore';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarOpen, theme } = useAppStore();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans transition-colors duration-200">
        <Sidebar />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
          }`}
        >
          <Header />
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
