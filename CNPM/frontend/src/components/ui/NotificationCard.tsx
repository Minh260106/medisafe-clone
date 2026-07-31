'use client';

import React from 'react';
import { Clock, AlertTriangle, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { AppNotification } from '@/types';

interface NotificationCardProps {
  notification: AppNotification;
  onMarkRead?: (notif: AppNotification) => void;
  onDelete?: (notif: AppNotification) => void;
  onClick?: (notif: AppNotification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onDelete,
  onClick,
}) => {
  return (
    <Card
      onClick={() => onClick && onClick(notification)}
      className={`p-4 flex items-start justify-between gap-4 transition-all cursor-pointer ${
        !notification.isRead
          ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 shadow-sm'
          : 'border-slate-200/80 dark:border-slate-800 opacity-90'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
            notification.type === 'reminder'
              ? 'bg-blue-100 dark:bg-blue-950 text-blue-600'
              : notification.type === 'warning'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
              : notification.type === 'appointment'
              ? 'bg-teal-100 dark:bg-teal-950 text-teal-600'
              : 'bg-green-100 dark:bg-green-950 text-green-600'
          }`}
        >
          {notification.type === 'reminder' && <Clock className="w-5 h-5" />}
          {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
          {notification.type === 'appointment' && <Calendar className="w-5 h-5" />}
          {notification.type === 'system' && <CheckCircle2 className="w-5 h-5" />}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{notification.title}</h4>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{notification.message}</p>
          <span className="inline-block text-[11px] text-slate-400 font-medium pt-1">
            {new Date(notification.createdAt).toLocaleString('vi-VN')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {!notification.isRead && onMarkRead && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead(notification);
            }}
            className="text-xs text-blue-600 border-blue-200"
          >
            Đã đọc
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification);
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
};
