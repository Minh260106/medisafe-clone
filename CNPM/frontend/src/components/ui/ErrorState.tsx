'use client';

import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Có lỗi xảy ra khi tải dữ liệu',
  message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-8 text-center rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/60 space-y-4 max-w-lg mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 flex items-center justify-center mx-auto shadow-sm">
        <AlertOctagon className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-base text-red-900 dark:text-red-200">{title}</h3>
        <p className="text-xs text-red-700/80 dark:text-red-300/80 leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={onRetry}
            leftIcon={<RotateCw className="w-4 h-4 text-red-600" />}
            className="border-red-300 text-red-700 hover:bg-red-100 font-semibold"
          >
            Thử lại
          </Button>
        </div>
      )}
    </div>
  );
};
