'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  title?: string;
  message?: string;
  className?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  title = 'Thành công!',
  message = 'Thao tác của bạn đã được ghi nhận.',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-6 text-center space-y-3 ${className}`}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30"
      >
        <Check className="w-8 h-8 stroke-[3]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-1"
      >
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h4>
        {message && <p className="text-xs text-slate-500 dark:text-slate-400">{message}</p>}
      </motion.div>
    </div>
  );
};
