import { Appointment, ApiResponse } from '@/types';
import { initialMockAppointments } from './mockData';

let mockAppointments: Appointment[] = [...initialMockAppointments];

export const appointmentApi = {
  getAppointments: async (): Promise<ApiResponse<Appointment[]>> => {
    await new Promise((res) => setTimeout(res, 200));
    return { data: [...mockAppointments], success: true };
  },

  createAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<ApiResponse<Appointment>> => {
    await new Promise((res) => setTimeout(res, 300));
    const newApt: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}`,
    };
    mockAppointments = [newApt, ...mockAppointments];
    return { data: newApt, success: true, message: 'Đã tạo lịch hẹn thành công' };
  },

  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<ApiResponse<Appointment>> => {
    await new Promise((res) => setTimeout(res, 250));
    const index = mockAppointments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy lịch hẹn');
    }
    mockAppointments[index] = { ...mockAppointments[index], ...updates };
    return { data: mockAppointments[index], success: true, message: 'Đã cập nhật lịch hẹn' };
  },

  deleteAppointment: async (id: string): Promise<ApiResponse<boolean>> => {
    await new Promise((res) => setTimeout(res, 200));
    mockAppointments = mockAppointments.filter((a) => a.id !== id);
    return { data: true, success: true, message: 'Đã xóa lịch hẹn' };
  },
};
