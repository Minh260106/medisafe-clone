'use client';

import React from 'react';
import { BellRing, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <EmptyState
          icon={BellRing}
          title="Thông báo hệ thống đang ở chế độ xem trước"
          description="Chưa có API thật cho notifications, nên trang này chỉ mô tả tính năng thay vì giả lập dữ liệu."
        />
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD.OVERVIEW)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Về dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
