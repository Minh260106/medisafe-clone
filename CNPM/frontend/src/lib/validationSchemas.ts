import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirm_password: z.string().min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự'),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirm_password'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const medicationSchema = z.object({
  name: z.string().min(2, 'Tên thuốc phải có ít nhất 2 ký tự'),
  form: z.string().min(1, 'Vui lòng chọn dạng bào chế'),
  dosage: z.string().min(1, 'Vui lòng nhập liều lượng (ví dụ: 500mg)'),
  stock: z.coerce.number().min(0, 'Số lượng tồn kho không được âm'),
  description: z.string().optional(),
  unit: z.string().optional(),
  shape: z.string().optional(),
  color: z.string().optional(),
  low_stock_threshold: z.coerce.number().min(0).optional(),
  instructions: z.string().optional(),
});

export type MedicationFormData = z.infer<typeof medicationSchema>;

export const reminderSchema = z.object({
  medication_id: z.coerce.number().min(1, 'Vui lòng chọn thuốc'),
  frequency: z.string().min(1, 'Vui lòng chọn tần suất uống'),
  time_to_take: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ uống phải có dạng HH:mm (ví dụ: 08:00)'),
  notes: z.string().optional(),
});

export type ReminderFormData = z.infer<typeof reminderSchema>;

export const profileSchema = z.object({
  username: z.string().min(3, 'Tên người dùng phải có ít nhất 3 ký tự'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  full_name: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự').optional(),
  height_cm: z.coerce.number().min(50).max(250).optional(),
  weight_kg: z.coerce.number().min(20).max(300).optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
