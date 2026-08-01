'use client';

import React from 'react';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export default function AppointmentsPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <EmptyState
          icon={CalendarDays}
          title="Lịch hẹn khám bệnh đang ở chế độ xem trước"
          description="Backend hiện chưa có bảng/route cho appointments, nên trang này không còn cho thao tác CRUD giả."
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
