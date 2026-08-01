'use client';

import React from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export default function HealthTrackerPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <EmptyState
          icon={Activity}
          title="Theo dõi sức khỏe đang ở chế độ xem trước"
          description="Backend hiện chưa có vitals/health tracker, nên trang này không còn biểu mẫu ghi chỉ số giả."
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
