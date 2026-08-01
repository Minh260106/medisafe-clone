export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  heightCm?: number;
  weightKg?: number;
  allergies?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
}

export type PillShape = 'capsule' | 'round' | 'oval' | 'square' | 'liquid' | 'injection';
export type DosageStatus = 'taken' | 'skipped' | 'pending' | 'snoozed';

export interface DDIInteraction {
  id: string;
  drugA: string;
  drugB: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
  detectedAt?: string;
}

export interface VitalLog {
  id: string;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  bloodGlucose?: number;
  glucoseType?: 'fasting' | 'postprandial' | 'random';
  recordedAt: string;
  status: 'normal' | 'elevated' | 'high_stage1' | 'high_stage2' | 'critical';
  notes?: string;
}

export interface PRNMedication {
  id: string;
  name: string;
  dosage: number;
  unit: string;
  shape: PillShape;
  color: string;
  indication: string;
  minHoursBetweenDoses: number;
  maxDosesPerDay: number;
  takenTodayCount: number;
  lastTakenAt?: string;
  stockQuantity: number;
  unitPrice?: number;
}

export interface TaperingScheduleStep {
  dayNumber: number;
  date: string;
  dosage: number;
  unit: string;
  status: 'completed' | 'current' | 'upcoming';
  notes?: string;
}

export interface TaperingMedication {
  id: string;
  medicationName: string;
  totalDays: number;
  currentDay: number;
  steps: TaperingScheduleStep[];
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  description?: string;
  dosage: number;
  unit: string;
  shape: PillShape;
  color: string;
  stockQuantity: number;
  lowStockThreshold: number;
  frequencyTimesPerDay: number;
  reminderTimes: string[];
  startDate: string;
  endDate?: string;
  instructions?: string;
  isPRN?: boolean;
  isTapering?: boolean;
  taperingInfo?: string;
  ddiWarnings?: DDIInteraction[];
  createdAt: string;
  updatedAt: string;
}

export interface DosageScheduleItem {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: number;
  unit: string;
  shape: PillShape;
  color: string;
  scheduledTime: string;
  scheduledDate: string;
  status: DosageStatus;
  takenAt?: string;
  notes?: string;
  isPRN?: boolean;
  isTapering?: boolean;
  taperingDay?: number;
  instructions?: string;
}

export interface AdherenceStats {
  adherenceRate: number;
  totalScheduled: number;
  totalTaken: number;
  totalSkipped: number;
  totalPending: number;
  streakDays: number;
  weeklyTrend: {
    day: string;
    taken: number;
    skipped: number;
    scheduled: number;
  }[];
}

export interface AdherenceHeatmapDay {
  date: string;
  count: number;
  status: 'perfect' | 'partial' | 'missed' | 'empty';
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  address?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  reminderMinutesBefore?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'appointment' | 'system' | 'warning';
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}