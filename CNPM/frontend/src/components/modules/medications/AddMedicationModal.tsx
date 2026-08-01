'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill,
  Circle,
  Egg,
  Square,
  Droplet,
  Syringe,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Clock,
  Plus,
  Sparkles,
  Utensils,
  AlertTriangle,
  Package,
  ShieldCheck,
  Sun,
  Sunrise,
  Moon,
  Info,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PILL_SHAPES, PILL_COLORS, DOSAGE_UNITS } from '@/constants/theme';
import { Medication, PillShape } from '@/types/legacy';

export interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicationData: Partial<Medication>) => void;
  initialData?: Medication | null;
  isLoading?: boolean;
}

const CATEGORY_SUGGESTIONS = [
  'Kháng sinh',
  'Giảm đau & Hạ sốt',
  'Tim mạch & Huyết áp',
  'Tiểu đường',
  'Vitamin & Bổ brain',
  'Tiêu hóa',
  'Dị ứng',
];

const FOOD_TIMING_OPTIONS = [
  { id: 'after_meal', label: 'Sau khi ăn', desc: 'Uống sau ăn 15-30 phút', icon: Utensils },
  { id: 'before_meal', label: 'Trước khi ăn', desc: 'Uống trước ăn 30 phút', icon: Utensils },
  { id: 'with_meal', label: 'Cùng bữa ăn', desc: 'Uống ngay trong bữa ăn', icon: Utensils },
  { id: 'empty_stomach', label: 'Bụng đói', desc: 'Sáng sớm hoặc khi bụng rỗng', icon: Utensils },
];

const PRESET_TIME_CHIPS = [
  { label: '07:30 Sáng', time: '07:30', icon: Sunrise },
  { label: '12:00 Trưa', time: '12:00', icon: Sun },
  { label: '18:00 Chiều', time: '18:00', icon: Sun },
  { label: '21:00 Tối', time: '21:00', icon: Moon },
];

const renderPillIcon = (shape: PillShape, colorHex: string, sizeClass = 'w-8 h-8') => {
  const props = { className: `${sizeClass} drop-shadow-md transition-all duration-300`, style: { color: colorHex } };
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

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dosage, setDosage] = useState<number>(500);
  const [unit, setUnit] = useState<string>('mg');
  const [foodTiming, setFoodTiming] = useState<string>('after_meal');
  const [shape, setShape] = useState<PillShape>('capsule');
  const [color, setColor] = useState<string>('#3b82f6');
  const [reminderTimes, setReminderTimes] = useState<string[]>(['08:00', '20:00']);
  const [customTimeInput, setCustomTimeInput] = useState<string>('12:00');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [stockQuantity, setStockQuantity] = useState<number>(30);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [isPRN, setIsPRN] = useState<boolean>(false);
  const [isTapering, setIsTapering] = useState<boolean>(false);

  // Initialize form when opening or changing initialData
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setDosage(initialData.dosage || 500);
      setUnit(initialData.unit || 'mg');
      setShape(initialData.shape || 'capsule');
      setColor(initialData.color || '#3b82f6');
      setReminderTimes(initialData.reminderTimes || ['08:00', '20:00']);
      setStartDate(initialData.startDate || new Date().toISOString().split('T')[0]);
      setStockQuantity(initialData.stockQuantity ?? 30);
      setLowStockThreshold(initialData.lowStockThreshold ?? 5);
      setIsPRN(initialData.isPRN || false);
      setIsTapering(initialData.isTapering || false);
      setFoodTiming(initialData.instructions || 'after_meal');
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setStep(1);
    setName('');
    setDescription('');
    setCategory('');
    setDosage(500);
    setUnit('mg');
    setFoodTiming('after_meal');
    setShape('capsule');
    setColor('#3b82f6');
    setReminderTimes(['08:00', '20:00']);
    setCustomTimeInput('12:00');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDurationDays(7);
    setStockQuantity(30);
    setLowStockThreshold(5);
    setIsPRN(false);
    setIsTapering(false);
  };

  const handleAddReminderTime = (timeToAdd: string) => {
    if (!timeToAdd) return;
    if (reminderTimes.includes(timeToAdd)) return;
    const updated = [...reminderTimes, timeToAdd].sort();
    setReminderTimes(updated);
  };

  const handleRemoveReminderTime = (timeToRemove: string) => {
    setReminderTimes(reminderTimes.filter((t) => t !== timeToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timingLabel = FOOD_TIMING_OPTIONS.find((f) => f.id === foodTiming)?.label || '';
    const fullInstructions = timingLabel ? `${timingLabel}. ${description}`.trim() : description;

    onSave({
      name: name.trim(),
      description: fullInstructions,
      dosage: Number(dosage),
      unit,
      shape,
      color,
      stockQuantity: Number(stockQuantity),
      lowStockThreshold: Number(lowStockThreshold),
      frequencyTimesPerDay: reminderTimes.length || 1,
      reminderTimes: reminderTimes.length > 0 ? reminderTimes : ['08:00'],
      startDate,
      isPRN,
      isTapering,
    });
  };

  const canProceedStep1 = name.trim().length > 0 && dosage > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Chỉnh Sửa Thông Tin Thuốc' : 'Thêm Thuốc Mới Vào Tủ'}
      description="Quy trình nạp dữ liệu chuẩn lâm sàng với kiểm tra trực quan"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Step Indicator Header */}
        <div className="bg-slate-100 dark:bg-slate-750 p-2 rounded-2xl flex items-center justify-between gap-1">
          {(
            [
              { num: 1 as const, title: 'Thông tin & Liều' },
              { num: 2 as const, title: 'Nhận diện thị giác' },
              { num: 3 as const, title: 'Lịch nhắc nhở' },
              { num: 4 as const, title: 'Quản lý kho' },
            ] as const
          ).map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                if (s.num === 1 || canProceedStep1) setStep(s.num);
              }}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                step === s.num
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-black ${
                  step === s.num
                    ? 'bg-white text-sky-600'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline truncate">{s.title}</span>
            </button>
          ))}
        </div>

        {/* STEP CONTENT BODY */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: BASIC INFO & DOSAGE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Input
                      label="Tên Thuốc (*)"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Paracetamol, Amoxicillin, Omega-3..."
                      className="text-base font-bold"
                    />

                    {/* Quick Category Suggestion Tags */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500">Gợi ý danh mục nhanh:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORY_SUGGESTIONS.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setCategory(cat);
                              if (!description) setDescription(`Thuốc thuộc nhóm ${cat}`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              category === cat
                                ? 'bg-sky-600 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            + {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Input
                    label="Ghi Chú / Tác Dụng Mô Tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="VD: Thuốc hạ sốt nhanh, uống theo đơn bác sĩ"
                  />

                  {/* Dosage & Unit Stepper */}
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Hàm Lượng / Liều (*)"
                      type="number"
                      min={0.1}
                      step="any"
                      required
                      value={dosage}
                      onChange={(e) => setDosage(Number(e.target.value))}
                    />
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Đơn vị (*)</label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        {DOSAGE_UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Food Timing Selectors */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                    Thời Điểm Uống Thuốc Trong Bữa Ăn
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {FOOD_TIMING_OPTIONS.map((f) => {
                      const IconComp = f.icon;
                      const isSelected = foodTiming === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFoodTiming(f.id)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 ring-2 ring-sky-500/20'
                              : 'border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <IconComp
                              className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`}
                            />
                            {isSelected && <Check className="w-4 h-4 text-sky-600 font-bold" />}
                          </div>
                          <div className="mt-2">
                            <p
                              className={`text-xs font-bold ${
                                isSelected ? 'text-sky-900 dark:text-sky-300' : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {f.label}
                            </p>
                            <p className="text-[10px] text-slate-400 leading-tight line-clamp-1">{f.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: VISUAL IDENTITY & LIVE PILL PREVIEW CARD */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* LIVE PREVIEW CARD */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white shadow-xl relative overflow-hidden border border-slate-700">
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-sky-300 border border-white/10">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Thẻ Thuốc Nhận Diện Trực Quan
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">PREVIEW CARD</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner"
                      style={{ boxShadow: `0 0 20px ${color}40` }}
                    >
                      {renderPillIcon(shape, color, 'w-10 h-10')}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-white tracking-tight">
                        {name || 'Tên thuốc ví dụ'}
                      </h4>
                      <p className="text-xs text-sky-200 font-medium">
                        Liều lượng: <strong className="text-white">{dosage} {unit}</strong> •{' '}
                        {FOOD_TIMING_OPTIONS.find((f) => f.id === foodTiming)?.label}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Nhắc nhở: {reminderTimes.join(', ')} ({reminderTimes.length} lần/ngày)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shape Visual Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                    1. Chọn Hình Dáng Viên Thuốc (Shape)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {PILL_SHAPES.map((s) => {
                      const isSelected = shape === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setShape(s.id as PillShape)}
                          className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-600 font-bold ring-2 ring-sky-500/20 shadow-sm'
                              : 'border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          {renderPillIcon(s.id as PillShape, color, 'w-7 h-7')}
                          <span className="text-[11px] font-semibold">{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Visual Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                    2. Chọn Màu Sắc Đặc Trưng (Color Palette)
                  </label>
                  <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-750 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    {PILL_COLORS.map((c) => {
                      const isSelected = color === c.hex;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setColor(c.hex)}
                          style={{ backgroundColor: c.hex }}
                          className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center shadow-md ${
                            isSelected ? 'border-sky-500 scale-110 ring-4 ring-sky-500/20' : 'border-white/50'
                          }`}
                          title={c.name}
                        >
                          {isSelected && <Check className="w-4 h-4 text-slate-900 drop-shadow" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SMART SCHEDULE & REMINDER TIMES */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                    Mốc Giờ Nhắc Nhở Uống Thuốc Hằng Ngày
                  </label>

                  {/* Active Time Tags */}
                  <div className="flex flex-wrap items-center gap-2 min-h-[48px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
                    {reminderTimes.length > 0 ? (
                      reminderTimes.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 text-white font-extrabold text-xs shadow-md"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveReminderTime(t)}
                            className="p-0.5 rounded-full hover:bg-white/20 text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Chưa có mốc giờ nào. Vui lòng chọn bên dưới.</span>
                    )}
                  </div>

                  {/* Quick Preset Time Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Mốc giờ phổ biến:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_TIME_CHIPS.map((chip) => {
                        const IconComp = chip.icon;
                        const isAdded = reminderTimes.includes(chip.time);
                        return (
                          <button
                            key={chip.time}
                            type="button"
                            onClick={() =>
                              isAdded ? handleRemoveReminderTime(chip.time) : handleAddReminderTime(chip.time)
                            }
                            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                              isAdded
                                ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-600'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <IconComp className="w-3.5 h-3.5 text-amber-500" />
                              {chip.label}
                            </span>
                            {isAdded ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Time Adder */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-40">
                      <Input
                        type="time"
                        value={customTimeInput}
                        onChange={(e) => setCustomTimeInput(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddReminderTime(customTimeInput)}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Thêm mốc giờ
                    </Button>
                  </div>
                </div>

                {/* Treatment Duration & Start Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <Input
                    label="Ngày Bắt Đầu Uống (*)"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                      Thời Gian Liệu Trình (Ngày)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={365}
                        value={durationDays}
                        onChange={(e) => setDurationDays(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none"
                      />
                      <span className="text-xs font-bold text-slate-500 shrink-0">ngày</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: STOCK MANAGEMENT & ADVANCED CLINICAL SETTINGS */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Số Lượng Viên / Đơn Vị Hiện Có"
                    type="number"
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    leftIcon={<Package className="w-4 h-4 text-slate-400" />}
                  />
                  <Input
                    label="Ngưỡng Cảnh Báo Sắp Hết Kho"
                    type="number"
                    min={1}
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    leftIcon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
                  />
                </div>

                {/* Stock Refill Estimate Box */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <p className="font-bold">Dự đoán tiêu thụ tự động:</p>
                    <p>
                      Với <strong className="font-extrabold">{stockQuantity} {unit}</strong> hiện có và tần suất{' '}
                      <strong className="font-extrabold">{reminderTimes.length} lần/ngày</strong>, tủ thuốc sẽ đủ dùng trong khoảng{' '}
                      <strong className="font-extrabold text-amber-700 dark:text-amber-200">
                        {Math.floor(stockQuantity / (reminderTimes.length || 1))} ngày
                      </strong>.
                    </p>
                  </div>
                </div>

                {/* Advanced Options Toggles */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                    Tùy Chọn Lâm Sàng Đặc Biệt
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPRN(!isPRN)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isPRN
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                          : 'border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">Uống khi cần thiết (PRN)</p>
                        <p className="text-[10px] text-slate-400">Dùng cho thuốc giảm đau, hạ sốt khẩn cấp</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isPRN ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isPRN && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsTapering(!isTapering)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isTapering
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold'
                          : 'border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">Lịch giảm liều (Tapering)</p>
                        <p className="text-[10px] text-slate-400">Dành cho Corticoid hoặc thuốc ngắt liều</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isTapering ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isTapering && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOTTOM STEP NAVIGATION FOOTER */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : 1))}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Quay lại
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy bỏ
              </Button>
            )}

            {step < 4 ? (
              <Button
                type="button"
                variant="primary"
                disabled={!canProceedStep1}
                onClick={() => setStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : 4))}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Tiếp theo: {step === 1 ? 'Nhận diện thị giác' : step === 2 ? 'Lịch nhắc nhở' : 'Quản lý kho'}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-lg shadow-emerald-600/30"
              >
                Lưu Thuốc Vào Tủ
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};
