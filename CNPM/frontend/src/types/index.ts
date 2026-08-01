export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Medication {
  id: number;
  user_id?: number | null;
  name: string;
  form: string;
  dosage: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: number;
  user_id?: number | null;
  medication_id: number;
  frequency: string;
  time_to_take: string;
  created_at: string;
  updated_at: string;
}

export type IntakeStatus = 'Taken' | 'Skipped' | 'Snoozed';

export interface IntakeLog {
  id: number;
  user_id?: number | null;
  schedule_id: number;
  status: IntakeStatus;
  timestamp: string;
}

export interface ComplianceStats {
  taken_percentage: number;
  skipped_percentage: number;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
