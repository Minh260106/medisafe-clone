import { VitalLog, ApiResponse } from '@/types';
import { initialMockVitals } from './mockData';

let mockVitals: VitalLog[] = [...initialMockVitals];

export const healthApi = {
  getVitals: async (): Promise<ApiResponse<VitalLog[]>> => {
    await new Promise((res) => setTimeout(res, 200));
    return { data: [...mockVitals], success: true };
  },

  logVitals: async (vital: Omit<VitalLog, 'id' | 'status' | 'recordedAt'>): Promise<ApiResponse<VitalLog>> => {
    await new Promise((res) => setTimeout(res, 300));
    
    // Evaluate clinical status
    let status: VitalLog['status'] = 'normal';
    const sys = vital.systolic || 0;
    const dia = vital.diastolic || 0;
    if (sys >= 140 || dia >= 90) status = 'high_stage2';
    else if (sys >= 130 || dia >= 80) status = 'high_stage1';
    else if (sys >= 120 && sys <= 129 && dia < 80) status = 'elevated';

    const newLog: VitalLog = {
      ...vital,
      id: `vit_${Date.now()}`,
      recordedAt: new Date().toISOString(),
      status,
    };

    mockVitals = [newLog, ...mockVitals];
    return { data: newLog, success: true, message: 'Đã lưu chỉ số sức khỏe' };
  },

  deleteVitalLog: async (id: string): Promise<ApiResponse<boolean>> => {
    await new Promise((res) => setTimeout(res, 200));
    mockVitals = mockVitals.filter((v) => v.id !== id);
    return { data: true, success: true, message: 'Đã xóa chỉ số' };
  },
};
