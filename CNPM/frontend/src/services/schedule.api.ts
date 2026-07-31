import { apiClient } from './apiClient';
import { DosageScheduleItem, DosageStatus } from '@/types';
import { getInitialSchedule } from './mockData';

// Map schedule cache per date
const scheduleCache: Record<string, DosageScheduleItem[]> = {};

export const scheduleApi = {
  async getDailySchedule(dateStr: string): Promise<DosageScheduleItem[]> {
    try {
      const response = await apiClient.get<DosageScheduleItem[]>(`/schedule?date=${dateStr}`);
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (!scheduleCache[dateStr]) {
        scheduleCache[dateStr] = getInitialSchedule(dateStr);
      }
      return scheduleCache[dateStr];
    }
  },

  async updateDosageStatus(
    scheduleId: string,
    status: DosageStatus,
    dateStr: string
  ): Promise<DosageScheduleItem> {
    try {
      const response = await apiClient.patch<DosageScheduleItem>(`/schedule/${scheduleId}`, { status });
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const items = scheduleCache[dateStr] || getInitialSchedule(dateStr);
      let updatedItem: DosageScheduleItem | null = null;
      
      const newItems = items.map((item) => {
        if (item.id === scheduleId) {
          updatedItem = {
            ...item,
            status,
            takenAt: status === 'taken' ? new Date().toISOString() : undefined,
          };
          return updatedItem;
        }
        return item;
      });

      scheduleCache[dateStr] = newItems;
      if (!updatedItem) {
        throw new Error('Dosage item not found');
      }
      return updatedItem;
    }
  },
};
