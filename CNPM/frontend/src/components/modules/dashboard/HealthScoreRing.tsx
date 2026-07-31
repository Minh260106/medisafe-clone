'use client';

import React from 'react';
import { Flame, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthScoreRingProps {
  score: number; // 0 to 100
  streakDays: number;
  totalTaken: number;
  totalScheduled: number;
}

export const HealthScoreRing: React.FC<HealthScoreRingProps> = ({
  score = 92,
  streakDays = 5,
  totalTaken = 4,
  totalScheduled = 5,
}) => {
  // Radial dimensions
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Dynamic status color
  const getGradientId = () => {
    if (score >= 80) return 'emeraldGradient';
    if (score >= 50) return 'amberGradient';
    return 'roseGradient';
  };

  const getScoreColorText = () => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 50) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getBadgeStyle = () => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300/40';
    if (score >= 50) return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300/40';
    return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300/40';
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Gamification Streak Badge */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/30 text-amber-600 dark:text-amber-400 font-extrabold text-xs shadow-sm"
      >
        <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
        <span>🔥 {streakDays} Ngày Liên Tiếp!</span>
      </motion.div>

      {/* SVG Radial Progress Ring */}
      <div className="relative my-3 flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
            <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>
          </defs>

          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />

          {/* Animated Foreground Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${getGradientId()})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Content: Heartbeat + Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mb-1 shadow-sm">
            <Heart className="w-5 h-5 fill-rose-500 animate-heartbeat" />
          </div>
          <div className="flex items-baseline">
            <span className={`text-3xl font-black tabular-nums tracking-tight ${getScoreColorText()}`}>
              {score}
            </span>
            <span className="text-sm font-bold text-slate-400 ml-0.5">%</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Tuân Thủ Uống Thuốc</span>
        </div>
      </div>

      {/* Footer Info Badge */}
      <div className="mt-2 text-center space-y-1">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${getBadgeStyle()}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{totalTaken}/{totalScheduled} liều thuốc đã hoàn thành</span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium">
          Chỉ số lâm sàng duy trì nồng độ thuốc an toàn trong máu
        </p>
      </div>
    </div>
  );
};
