export const PILL_SHAPES = [
  { id: 'capsule', label: 'Viên nhộng', icon: 'Pill' },
  { id: 'round', label: 'Viên tròn', icon: 'Circle' },
  { id: 'oval', label: 'Viên bầu dục', icon: 'Egg' },
  { id: 'square', label: 'Viên vuông', icon: 'Square' },
  { id: 'liquid', label: 'Siro / Lỏng', icon: 'Droplet' },
  { id: 'injection', label: 'Tiêm / Chích', icon: 'Syringe' },
] as const;

export const PILL_COLORS = [
  { id: 'blue', hex: '#3b82f6', name: 'Xanh dương' },
  { id: 'green', hex: '#10b981', name: 'Xanh lá' },
  { id: 'red', hex: '#ef4444', name: 'Đỏ' },
  { id: 'yellow', hex: '#f59e0b', name: 'Vàng' },
  { id: 'purple', hex: '#8b5cf6', name: 'Tím' },
  { id: 'pink', hex: '#ec4899', name: 'Hồng' },
  { id: 'white', hex: '#ffffff', name: 'Trắng', border: true },
  { id: 'orange', hex: '#f97316', name: 'Cam' },
] as const;

export const DOSAGE_UNITS = [
  'Viên',
  'mg',
  'ml',
  'g',
  'Gọt',
  'Gói',
  'Ống',
  'Liều',
] as const;

export const DOSAGE_STATUS = {
  TAKEN: 'taken',
  SKIPPED: 'skipped',
  PENDING: 'pending',
  SNOOZED: 'snoozed',
} as const;
