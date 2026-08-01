import { apiClient } from './apiClient';
import { Medication } from '@/types';
import { CreateMedicationRequest, UpdateMedicationRequest } from '@/types/api';
import { mockDelay, useMockApi } from './serviceMode';
import { mockMedications, nextMedicationId } from './mockFixtures';

export type MedicationPayload = CreateMedicationRequest;

export const medicationApi = {
  async getAll(): Promise<Medication[]> {
    if (useMockApi) {
      await mockDelay();
      return [...mockMedications];
    }

    const response = await apiClient.get<Medication[]>('/medications');
    return response.data;
  },

  async getById(id: number): Promise<Medication> {
    if (useMockApi) {
      await mockDelay();
      const medication = mockMedications.find((item) => item.id === id);
      if (!medication) throw new Error('Thuốc không tồn tại');
      return medication;
    }

    const response = await apiClient.get<Medication>(`/medications/${id}`);
    return response.data;
  },

  async create(data: CreateMedicationRequest): Promise<Medication> {
    if (useMockApi) {
      await mockDelay();
      const now = new Date().toISOString();
      const medication: Medication = {
        id: nextMedicationId(),
        user_id: 1,
        name: data.name,
        form: data.form,
        dosage: data.dosage,
        stock: Number(data.stock),
        created_at: now,
        updated_at: now,
      };
      mockMedications.unshift(medication);
      return medication;
    }

    const response = await apiClient.post<Medication>('/medications', data);
    return response.data;
  },

  async update(id: number, data: UpdateMedicationRequest): Promise<Medication> {
    if (useMockApi) {
      await mockDelay();
      const medication = mockMedications.find((item) => item.id === id);
      if (!medication) throw new Error('Thuốc không tồn tại');
      const updated = { ...medication, ...data, updated_at: new Date().toISOString() };
      mockMedications.splice(mockMedications.findIndex((item) => item.id === id), 1, updated);
      return updated;
    }

    const response = await apiClient.put<Medication>(`/medications/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    if (useMockApi) {
      await mockDelay();
      const index = mockMedications.findIndex((item) => item.id === id);
      if (index !== -1) mockMedications.splice(index, 1);
      return;
    }

    await apiClient.delete(`/medications/${id}`);
  },
};
