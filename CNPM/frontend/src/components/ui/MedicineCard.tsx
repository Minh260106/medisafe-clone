'use client';

import React, { useState } from 'react';
import { Pill, Circle, Egg, Square, Droplet, Syringe, MoreVertical, Clock, Edit2, Trash2, Eye } from 'lucide-react';
import { Card } from './Card';
import { Medication, PillShape } from '@/types';

interface MedicineCardProps {
  medication: Medication;
  onView?: (med: Medication) => void;
  onEdit?: (med: Medication) => void;
  onDelete?: (med: Medication) => void;
  nextDoseTime?: string;
}

const renderPillIcon = (shape: PillShape, colorHex: string) => {
  const props = { className: 'w-7 h-7 drop-shadow-md', style: { color: colorHex || '#2563eb' } };
  switch (shape) {
    case 'capsule': return <Pill {...props} />;
    case 'round': return <Circle {...props} />;
    case 'oval': return <Egg {...props} />;
    case 'square': return <Square {...props} />;
    case 'liquid': return <Droplet {...props} />;
    case 'injection': return <Syringe {...props} />;
    default: return <Pill {...props} />;
  }
};

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medication,
  onView,
  onEdit,
  onDelete,
  nextDoseTime = '08:00',
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isLowStock = medication.stockQuantity <= medication.lowStockThreshold;
  const stockPercentage = Math.min(100, Math.round((medication.stockQuantity / 60) * 100));

  return (
    <Card className="card-hover-effect relative p-5 space-y-4 hover:border-blue-400 dark:hover:border-blue-600 transition-all">
      {/* Top Bar: Icon + Name + Action Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center border border-slate-200/60 dark:border-slate-700">
            {renderPillIcon(medication.shape, medication.color)}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
              {medication.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {medication.dosage} {medication.unit} • {medication.frequencyTimesPerDay} lần/ngày
            </p>
          </div>
        </div>

        {/* Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-20 text-xs">
              {onView && (
                <button
                  onClick={() => { setShowMenu(false); onView(medication); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => { setShowMenu(false); onEdit(medication); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => { setShowMenu(false); onDelete(medication); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa thuốc
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {medication.description && (
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {medication.description}
        </p>
      )}

      {/* Middle Bar: Next Dose & Status Badge */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Liều kế tiếp: <strong className="text-slate-900 dark:text-white tabular-nums">{nextDoseTime}</strong></span>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            isLowStock
              ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
              : 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
          }`}
        >
          {isLowStock ? 'Cảnh báo hết kho' : 'Đang sử dụng'}
        </span>
      </div>

      {/* Stock Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span className="text-slate-500">Tồn kho:</span>
          <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'}`}>
            {medication.stockQuantity} {medication.unit}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all ${isLowStock ? 'bg-red-500' : 'bg-blue-600'}`}
            style={{ width: `${stockPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
