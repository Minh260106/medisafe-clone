import { subDays } from 'date-fns';
import { ComplianceStats, IntakeLog, IntakeStatus, Medication, Schedule } from '@/types';
import { NotificationResponse, VitalTrendPoint, DailyTrendPoint, UserProfileResponse } from '@/types/api';

export const mockUsers: UserProfileResponse[] = [
  {
    id: 1,
    username: 'nguyenvana',
    email: 'nguyenvana@medisafe.vn',
    role: 'user',
    is_active: true,
    full_name: 'Nguyễn Văn A',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    height_cm: 172,
    weight_kg: 68,
    allergies: ['Penicillin', 'Aspirin'],
    emergency_contact_name: 'Nguyễn Thị B (Vợ)',
    emergency_contact_phone: '0901234567',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-07-30T10:00:00Z',
  },
];

const medicationTemplates = [
  { name: 'Paracetamol', form: 'Viên nén', dosage: '500mg', unit: 'mg', shape: 'round', color: 'white', instructions: 'Uống khi bị đau hoặc sốt trên 38.5°C' },
  { name: 'Amoxicillin', form: 'Viên nang', dosage: '500mg', unit: 'mg', shape: 'capsule', color: 'blue', instructions: 'Uống sau bữa ăn 30 phút' },
  { name: 'Omega-3 Fish Oil', form: 'Viên nang mềm', dosage: '1000mg', unit: 'mg', shape: 'oval', color: 'yellow', instructions: 'Uống cùng với bữa ăn sáng' },
  { name: 'Vitamin C Sủi', form: 'Dung dịch uống', dosage: '1000mg', unit: 'mg', shape: 'liquid', color: 'orange', instructions: 'Hòa tan vào 200ml nước' },
  { name: 'Ibuprofen', form: 'Viên nén', dosage: '400mg', unit: 'mg', shape: 'round', color: 'pink', instructions: 'Uống sau ăn để tránh đau dạ dày' },
  { name: 'Amlodipine', form: 'Viên nén', dosage: '5mg', unit: 'mg', shape: 'round', color: 'white', instructions: 'Uống vào buổi sáng định kỳ' },
  { name: 'Metformin', form: 'Viên nén', dosage: '850mg', unit: 'mg', shape: 'oval', color: 'white', instructions: 'Uống trong hoặc ngay sau bữa ăn' },
  { name: 'Atorvastatin', form: 'Viên nén', dosage: '20mg', unit: 'mg', shape: 'round', color: 'white', instructions: 'Uống trước khi đi ngủ' },
  { name: 'Losartan', form: 'Viên nén', dosage: '50mg', unit: 'mg', shape: 'oval', color: 'green', instructions: 'Uống mỗi ngày vào cùng một thời điểm' },
  { name: 'Omeprazole', form: 'Viên nang', dosage: '20mg', unit: 'mg', shape: 'capsule', color: 'purple', instructions: 'Uống trước bữa ăn sáng 30 phút' },
  { name: 'Magnesium B6', form: 'Viên nén', dosage: '470mg', unit: 'mg', shape: 'round', color: 'white', instructions: 'Uống với nhiều nước' },
  { name: 'Vitamin D3 + K2', form: 'Dung dịch nhỏ giọt', dosage: '1000IU', unit: 'IU', shape: 'dropper', color: 'yellow', instructions: 'Nhỏ 2 giọt vào buổi sáng' },
  { name: 'Cetirizine', form: 'Viên nén', dosage: '10mg', unit: 'mg', shape: 'oval', color: 'white', instructions: 'Uống buổi tối trước khi đi ngủ' },
  { name: 'Berberin', form: 'Viên nén', dosage: '50mg', unit: 'mg', shape: 'round', color: 'yellow', instructions: 'Uống trước bữa ăn khi bị rối loạn tiêu hóa' },
  { name: 'Panadol Extra', form: 'Viên nén', dosage: '500mg', unit: 'mg', shape: 'oval', color: 'red', instructions: 'Dùng khi đau đầu nặng' },
  { name: 'Zinc Zinc', form: 'Viên nén', dosage: '15mg', unit: 'mg', shape: 'round', color: 'white', instructions: 'Uống sau bữa ăn' },
  { name: 'Siro Ho Astex', form: 'Siro', dosage: '10ml', unit: 'ml', shape: 'liquid', color: 'brown', instructions: 'Uống 3 lần một ngày' },
  { name: 'Diclac Gel', form: 'Kem bôi', dosage: '10mg/g', unit: 'g', shape: 'tube', color: 'white', instructions: 'Bôi ngoài da vùng sưng đau' },
  { name: 'Biotin Collagen', form: 'Viên nang', dosage: '5000mcg', unit: 'mcg', shape: 'capsule', color: 'pink', instructions: 'Uống mỗi ngày 1 viên' },
  { name: 'Glucosamine', form: 'Viên nén', dosage: '1500mg', unit: 'mg', shape: 'oval', color: 'white', instructions: 'Uống trong bữa ăn' },
  { name: 'Ginkgo Biloba', form: 'Viên nang', dosage: '120mg', unit: 'mg', shape: 'capsule', color: 'green', instructions: 'Uống tăng cường trí nhớ' },
  { name: 'Loratadine', form: 'Viên nén', dosage: '10mg', unit: 'mg', shape: 'round', color: 'white', instructions: 'Uống khi dị ứng thời tiết' },
  { name: 'Calcium D3', form: 'Viên nén', dosage: '600mg', unit: 'mg', shape: 'oval', color: 'white', instructions: 'Uống sau bữa ăn sáng 1 giờ' },
  { name: 'Spaerocil', form: 'Viên nang', dosage: '200mg', unit: 'mg', shape: 'capsule', color: 'blue', instructions: 'Theo chỉ định của bác sĩ' },
  { name: 'Efferalgan 500', form: 'Viên sủi', dosage: '500mg', unit: 'mg', shape: 'liquid', color: 'white', instructions: 'Hòa tan vào 150ml nước' },
  { name: 'Smecta', form: 'Gói bột', dosage: '3g', unit: 'g', shape: 'powder', color: 'white', instructions: 'Hòa bột với nước uống' },
  { name: 'Salbutamol Inhaler', form: 'Bình xịt', dosage: '100mcg', unit: 'mcg', shape: 'inhaler', color: 'blue', instructions: 'Xịt khi lên cơn khó thở' },
  { name: 'Eye Drops Tears', form: 'Dung dịch nhỏ mắt', dosage: '10ml', unit: 'ml', shape: 'dropper', color: 'clear', instructions: 'Nhỏ 1-2 giọt mỗi bên mắt' },
  { name: 'Coenzyme Q10', form: 'Viên nang', dosage: '100mg', unit: 'mg', shape: 'capsule', color: 'red', instructions: 'Bổ sung tim mạch' },
  { name: 'Multivitamin Fort', form: 'Viên nén', dosage: '1 viên', unit: 'pill', shape: 'oval', color: 'gold', instructions: 'Uống buổi sáng sau ăn' },
];

export const mockMedications: Medication[] = medicationTemplates.map((template, idx) => {
  const id = idx + 1;
  return {
    id,
    user_id: 1,
    name: template.name,
    form: template.form,
    dosage: template.dosage,
    stock: Math.max(2, (id * 7) % 65),
    created_at: subDays(new Date(), (id % 20) + 1).toISOString(),
    updated_at: new Date().toISOString(),
  };
});

export const mockSchedules: Schedule[] = Array.from({ length: 15 }, (_, index) => {
  const id = index + 1;
  const medId = (index % mockMedications.length) + 1;
  const times = ['07:00', '08:00', '12:00', '13:00', '18:30', '20:00', '21:30'];
  return {
    id,
    user_id: 1,
    medication_id: medId,
    frequency: `${(index % 3) + 1} lần/ngày`,
    time_to_take: times[index % times.length],
    created_at: subDays(new Date(), 10).toISOString(),
    updated_at: new Date().toISOString(),
  };
});

export const mockLogs: IntakeLog[] = Array.from({ length: 100 }, (_, index) => {
  const id = index + 1;
  const status: IntakeStatus = index % 6 === 0 ? 'Skipped' : index % 8 === 0 ? 'Snoozed' : 'Taken';
  const schedule = mockSchedules[index % mockSchedules.length];
  const daysAgo = Math.floor(index / 4);
  const logDate = subDays(new Date(), daysAgo);
  
  return {
    id,
    user_id: 1,
    schedule_id: schedule.id,
    status,
    timestamp: logDate.toISOString(),
  };
});

export const mockNotifications: NotificationResponse[] = Array.from({ length: 20 }, (_, index) => {
  const id = `notif_${String(index + 1).padStart(2, '0')}`;
  const types: ('reminder' | 'warning' | 'appointment' | 'system')[] = ['reminder', 'warning', 'appointment', 'system'];
  const type = types[index % types.length];
  
  const titles = {
    reminder: 'Nhắc nhở uống thuốc',
    warning: 'Cảnh báo tồn kho thấp',
    appointment: 'Lịch hẹn tái khám',
    system: 'Báo cáo tuân thủ tuần',
  };

  const messages = {
    reminder: `Đã đến giờ uống thuốc ${mockMedications[index % mockMedications.length].name} (${mockMedications[index % mockMedications.length].dosage}).`,
    warning: `Thuốc ${mockMedications[index % mockMedications.length].name} sắp hết (chỉ còn ${mockMedications[index % mockMedications.length].stock} viên).`,
    appointment: `Bạn có lịch tái khám với bác sĩ chuyên khoa vào tuần tới.`,
    system: `Tỷ lệ tuân thủ tuần này của bạn đạt ${75 + (index % 20)}%. Tiếp tục duy trì!`,
  };

  return {
    id,
    title: titles[type],
    message: messages[type],
    type,
    is_read: index > 5,
    created_at: subDays(new Date(), Math.floor(index / 2)).toISOString(),
    link_url: type === 'reminder' ? '/schedule' : type === 'warning' ? '/medications' : type === 'appointment' ? '/appointments' : '/statistics',
  };
});

export const mockDailyTrends: DailyTrendPoint[] = [
  { day: 'Thứ 2', taken: 5, skipped: 0, scheduled: 5 },
  { day: 'Thứ 3', taken: 4, skipped: 1, scheduled: 5 },
  { day: 'Thứ 4', taken: 5, skipped: 0, scheduled: 5 },
  { day: 'Thứ 5', taken: 3, skipped: 2, scheduled: 5 },
  { day: 'Thứ 6', taken: 5, skipped: 0, scheduled: 5 },
  { day: 'Thứ 7', taken: 4, skipped: 1, scheduled: 5 },
  { day: 'Chủ Nhật', taken: 5, skipped: 0, scheduled: 5 },
  { day: 'Thứ 2 (Tuần này)', taken: 4, skipped: 0, scheduled: 4 },
  { day: 'Thứ 3 (Tuần này)', taken: 4, skipped: 1, scheduled: 5 },
  { day: 'Hôm nay', taken: 3, skipped: 0, scheduled: 4 },
];

export const mockVitalTrends: VitalTrendPoint[] = Array.from({ length: 10 }, (_, idx) => ({
  id: `vit_${idx + 1}`,
  systolic: 118 + (idx % 8),
  diastolic: 78 + (idx % 6),
  heart_rate: 70 + (idx % 10),
  blood_glucose: 95 + (idx % 15),
  recorded_at: subDays(new Date(), idx).toISOString(),
  status: idx % 4 === 0 ? 'elevated' : 'normal',
}));

export const mockComplianceStats: ComplianceStats = {
  taken_percentage: 84,
  skipped_percentage: 16,
};

export const mockNotificationCount = 20;
export const mockReminderCount = 15;
export const mockChartCount = 10;

export function nextMedicationId(): number {
  return Math.max(0, ...mockMedications.map((m) => m.id)) + 1;
}

export function nextScheduleId(): number {
  return Math.max(0, ...mockSchedules.map((s) => s.id)) + 1;
}

export function nextLogId(): number {
  return Math.max(0, ...mockLogs.map((l) => l.id)) + 1;
}

export function restoreMockMedication(medication: Medication): void {
  const index = mockMedications.findIndex((item) => item.id === medication.id);
  if (index === -1) {
    mockMedications.unshift(medication);
    return;
  }
  mockMedications.splice(index, 1, medication);
}
