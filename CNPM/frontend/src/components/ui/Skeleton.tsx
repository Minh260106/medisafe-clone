import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700/60';
  const variantClasses = {
    text: 'h-4 rounded-md w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div className={twMerge(clsx(baseClasses, variantClasses[variant], className))} {...props} />
  );
};
