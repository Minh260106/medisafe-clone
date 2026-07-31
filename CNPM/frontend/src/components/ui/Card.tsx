import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, glass = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl border p-6 transition-all shadow-sm hover:shadow-md',
          glass
            ? 'glass-panel'
            : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
