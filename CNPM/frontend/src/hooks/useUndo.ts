'use client';

import { useState, useCallback, useRef } from 'react';
import { useToastStore } from '@/store/useToastStore';

interface UndoItem<T> {
  item: T;
  deleteFn: () => Promise<void>;
  restoreFn: () => Promise<void> | void;
  label: string;
}

export function useUndo<T>() {
  const [deletedItem, setDeletedItem] = useState<T | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { addToast } = useToastStore();

  const performDelete = useCallback(
    async ({ item, deleteFn, restoreFn, label }: UndoItem<T>) => {
      setDeletedItem(item);

      // Perform optimistic removal or call deleteFn immediately
      await deleteFn();

      // Show toast with Undo button
      addToast({
        type: 'warning',
        title: `Đã xóa ${label}`,
        description: 'Bạn có thể hoàn tác hành động này trong ít giây.',
        actionLabel: 'Hoàn tác',
        onAction: async () => {
          if (timerRef.current) clearTimeout(timerRef.current);
          try {
            await restoreFn();
            setDeletedItem(null);
            addToast({
              type: 'success',
              title: 'Khôi phục thành công',
              description: `Đã hoàn tác xóa ${label}.`,
            });
          } catch {
            addToast({
              type: 'error',
              title: 'Lỗi khôi phục',
              description: 'Không thể hoàn tác hành động này.',
            });
          }
        },
      });

      // Clear undo window after 6 seconds
      timerRef.current = setTimeout(() => {
        setDeletedItem(null);
      }, 6000);
    },
    [addToast]
  );

  return { deletedItem, performDelete };
}
