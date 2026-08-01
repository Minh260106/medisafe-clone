'use client';

import React from 'react';
import { PackageOpen, Plus, Pill, CalendarX, BellOff, History } from 'lucide-react';
import { Button } from './Button';

export type EmptyStateVariant = 'medications' | 'schedule' | 'notifications' | 'history' | 'generic';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const variantIconMap: Record<EmptyStateVariant, React.ElementType> = {
  medications: Pill,
  schedule: CalendarX,
  notifications: BellOff,
  history: History,
  generic: PackageOpen,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'generic',
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  const IconComponent = icon || variantIconMap[variant];

  return (
    <div
      role="region"
      aria-label={title}
      className={`p-10 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-5 max-w-lg mx-auto ${className}`}
    >
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        {/* Decorative background glow */}
        <div className="absolute inset-0 rounded-full bg-emerald-100/60 dark:bg-emerald-950/40 blur-xl" />

        <div className="relative w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-900/50">
          <IconComponent className="w-8 h-8" aria-hidden="true" />
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button
            variant="primary"
            onClick={onAction}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-700 font-semibold focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
