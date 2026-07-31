'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const labelMap: Record<string, string> = {
  dashboard: 'Tổng quan',
  medications: 'Danh mục thuốc',
  schedule: 'Lịch & Nhắc nhở',
  history: 'Lịch sử uống thuốc',
  statistics: 'Thống kê tuân thủ',
  profile: 'Hồ sơ cá nhân',
  settings: 'Cài đặt hệ thống',
};

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
      <Link href={ROUTES.DASHBOARD.OVERVIEW} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>Trang chủ</span>
      </Link>
      {segments.map((segment, idx) => {
        const isLast = idx === segments.length - 1;
        const href = '/' + segments.slice(0, idx + 1).join('/');
        const label = labelMap[segment] || segment;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-white capitalize">{label}</span>
            ) : (
              <Link href={href} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors capitalize">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
