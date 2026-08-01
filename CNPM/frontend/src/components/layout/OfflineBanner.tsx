'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="sticky top-0 z-[60] border-b border-amber-200 bg-amber-50 px-4 py-2 text-amber-900 dark:border-amber-900 dark:bg-amber-950/80 dark:text-amber-100"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-sm font-medium">
            <WifiOff className="h-4 w-4" />
            Bạn đang ngoại tuyến. Dữ liệu sẽ được đồng bộ lại khi kết nối trở lại.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
