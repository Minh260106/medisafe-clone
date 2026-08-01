import { User, Medication, Schedule, IntakeLog, ComplianceStats } from './index';

// --- Generic REST Wrappers ---
export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// --- Auth DTOs ---
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// --- Medication DTOs ---
export interface CreateMedicationRequest {
  name: string;
  form: string;
  dosage: string;
  stock: number;
  description?: string;
  unit?: string;
  shape?: string;
  color?: string;
  low_stock_threshold?: number;
  instructions?: string;
}

export type UpdateMedicationRequest = Partial<CreateMedicationRequest>;

export interface MedicationResponse extends Medication {
  description?: string;
  unit?: string;
  shape?: string;
  color?: string;
  low_stock_threshold?: number;
  instructions?: string;
}

// --- Reminder / Schedule DTOs ---
export interface CreateReminderRequest {
  medication_id: number;
  frequency: string;
  time_to_take: string;
  notes?: string;
}

export type UpdateReminderRequest = Partial<CreateReminderRequest>;

export interface ReminderResponse extends Schedule {
  medication_name?: string;
  notes?: string;
}

// --- Profile DTOs ---
export interface UserProfileResponse extends User {
  full_name?: string;
  avatar_url?: string;
  height_cm?: number;
  weight_kg?: number;
  allergies?: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  height_cm?: number;
  weight_kg?: number;
  allergies?: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

// --- History / Log DTOs ---
export interface CreateIntakeLogRequest {
  schedule_id: number;
  status: 'Taken' | 'Skipped' | 'Snoozed';
  timestamp?: string;
  notes?: string;
}

export interface IntakeLogResponse extends IntakeLog {
  medication_name?: string;
  time_to_take?: string;
  notes?: string;
}

// --- Notification DTOs ---
export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'warning' | 'appointment' | 'system';
  is_read: boolean;
  created_at: string;
  link_url?: string;
}

// --- Chart / Stats DTOs ---
export interface DailyTrendPoint {
  day: string;
  taken: number;
  skipped: number;
  scheduled: number;
}

export interface VitalTrendPoint {
  id: string;
  systolic: number;
  diastolic: number;
  heart_rate: number;
  blood_glucose: number;
  recorded_at: string;
  status: 'normal' | 'elevated' | 'high';
}

export interface AdherenceStatsResponse extends ComplianceStats {
  adherence_rate: number;
  streak_days: number;
  total_scheduled: number;
  total_taken: number;
  total_skipped: number;
  total_pending: number;
  weekly_trend: DailyTrendPoint[];
}

export interface ChartDataResponse {
  adherence: AdherenceStatsResponse;
  vitals: VitalTrendPoint[];
}
