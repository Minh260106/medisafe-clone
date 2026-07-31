import React from 'react';
import { Pill, AlertTriangle, Circle, Egg, Square, Droplet, Syringe } from 'lucide-react';
import { Medication, PillShape } from '@/types';

interface MedicationCardProps {
  medication: Medication;
  onEdit?: (med: Medication) => void;
  onDelete?: (id: string) => void;
}

const renderPillIcon = (shape: PillShape, colorHex: string) => {
  const props = { className: 'w-7 h-7 drop-shadow-sm', style: { color: colorHex } };
  switch (shape) {
    case 'capsule':
      return <Pill {...props} />;
    case 'round':
      return <Circle {...props} />;
    case 'oval':
      return <Egg {...props} />;
    case 'square':
      return <Square {...props} />;
    case 'liquid':
      return <Droplet {...props} />;
    case 'injection':
      return <Syringe {...props} />;
    default:
      return <Pill {...props} />;
  }
};

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onEdit,
  onDelete,
}) => {
  const isLowStock = medication.stockQuantity < 5;

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center shadow-inner">
            {renderPillIcon(medication.shape, medication.color)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-snug">
              {medication.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Tần suất: {medication.frequencyTimesPerDay} lần/ngày ({medication.dosage} {medication.unit})
            </p>
          </div>
        </div>
      </div>

      {medication.description && (
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {medication.description}
        </p>
      )}

      {/* Low Stock Warning Badge */}
      {isLowStock ? (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 animate-bounce" />
          <span>Sắp hết thuốc - Cần mua thêm ({medication.stockQuantity} {medication.unit} còn lại)</span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <span className="text-slate-500 font-medium">Kho còn lại:</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">
            {medication.stockQuantity} {medication.unit}
          </span>
        </div>
      )}

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          {onEdit && (
            <button
              onClick={() => onEdit(medication)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
            >
              Sửa
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(medication.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 hover:bg-rose-100"
            >
              Xóa
            </button>
          )}
        </div>
      )}
    </div>
  );
};
