import { apiClient } from './apiClient';
import { Medication } from '@/types';
import { initialMockMedications } from './mockData';

// In-memory store for mock fallback
let mockMedicationsStore: Medication[] = [...initialMockMedications];

export const medicationApi = {
  async getAll(): Promise<Medication[]> {
    try {
      const response = await apiClient.get<Medication[]>('/medication');
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockMedicationsStore;
    }
  },

  async getById(id: string): Promise<Medication | null> {
    try {
      const response = await apiClient.get<Medication>(`/medication/${id}`);
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockMedicationsStore.find((m) => m.id === id) || null;
    }
  },

  async create(data: Omit<Medication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Medication> {
    try {
      const response = await apiClient.post<Medication>('/medication', data);
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newMed: Medication = {
        ...data,
        id: `med_${Date.now()}`,
        userId: 'usr_01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockMedicationsStore = [newMed, ...mockMedicationsStore];
      return newMed;
    }
  },

  async update(id: string, data: Partial<Medication>): Promise<Medication> {
    try {
      const response = await apiClient.put<Medication>(`/medication/${id}`, data);
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      let updatedMed: Medication | null = null;
      mockMedicationsStore = mockMedicationsStore.map((m) => {
        if (m.id === id) {
          updatedMed = { ...m, ...data, updatedAt: new Date().toISOString() };
          return updatedMed;
        }
        return m;
      });
      if (!updatedMed) throw new Error('Medication not found');
      return updatedMed;
    }
  },

  async delete(id: string): Promise<{ success: boolean }> {
    try {
      await apiClient.delete(`/medication/${id}`);
      return { success: true };
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      mockMedicationsStore = mockMedicationsStore.filter((m) => m.id !== id);
      return { success: true };
    }
  },
};
