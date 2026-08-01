'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, User as UserIcon, Mail, BadgeCheck, CalendarClock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { authApi } from '@/services/auth.api';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/medisafe';

export default function ProfilePage() {
  const { user: storedUser } = useAuthStore();

  const profileQuery = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authApi.getProfile(),
    enabled: !storedUser,
    initialData: storedUser || undefined,
  });

  const user = profileQuery.data || storedUser;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hồ sơ cá nhân</h1>
          <p className="text-xs text-slate-500">Chỉ hiển thị các field backend thật trả về từ /api/auth/me.</p>
        </div>

        {profileQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        ) : profileQuery.error ? (
          <EmptyState title="Không tải được hồ sơ" description={getApiErrorMessage(profileQuery.error, 'Không thể lấy dữ liệu người dùng hiện tại.')} />
        ) : user ? (
          <>
            <Card className="p-6 flex flex-col sm:flex-row gap-5 sm:items-center">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white flex items-center justify-center text-3xl font-black">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user.username}</h2>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <Mail className="w-3.5 h-3.5" /> {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <BadgeCheck className="w-3.5 h-3.5" /> {user.role}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${user.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>
                    <ShieldCheck className="w-3.5 h-3.5" /> {user.is_active ? 'Đang hoạt động' : 'Đang bị khoá'}
                  </span>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5 space-y-2">
                <div className="text-xs text-slate-500">ID</div>
                <div className="font-semibold text-slate-900 dark:text-white">#{user.id}</div>
              </Card>
              <Card className="p-5 space-y-2">
                <div className="text-xs text-slate-500">Trạng thái</div>
                <div className="font-semibold text-slate-900 dark:text-white">{user.is_active ? 'Kích hoạt' : 'Vô hiệu hóa'}</div>
              </Card>
              <Card className="p-5 space-y-2">
                <div className="text-xs text-slate-500">Tạo lúc</div>
                <div className="font-semibold text-slate-900 dark:text-white">{user.created_at ? new Date(user.created_at).toLocaleString('vi-VN') : '—'}</div>
              </Card>
              <Card className="p-5 space-y-2">
                <div className="text-xs text-slate-500">Cập nhật lúc</div>
                <div className="font-semibold text-slate-900 dark:text-white">{user.updated_at ? new Date(user.updated_at).toLocaleString('vi-VN') : '—'}</div>
              </Card>
            </div>

            <Card className="p-6 space-y-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-sky-600" />
                Ghi chú
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Trang hồ sơ này là dạng xem בלבד. Backend hiện chỉ hỗ trợ username, email, role và trạng thái tài khoản, nên các field mở rộng như avatar, chiều cao, cân nặng hay dị ứng không còn xuất hiện ở đây.
              </p>
              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 text-xs text-slate-500 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-sky-600" />
                Nếu backend mở rộng sau này, có thể thêm form chỉnh sửa riêng mà không làm sai contract hiện tại.
              </div>
            </Card>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
