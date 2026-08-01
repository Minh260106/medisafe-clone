'use client';

import React from 'react';
import QueryProvider from './QueryProvider';
import { ToastViewport } from '@/components/ui/ToastViewport';
import { OfflineBanner } from '@/components/layout/OfflineBanner';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <OfflineBanner />
      {children}
      <ToastViewport />
    </QueryProvider>
  );
}
