import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notificationsEnabled: boolean;
  selectedDate: string; // YYYY-MM-DD
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setSelectedDate: (dateStr: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarOpen: true,
      notificationsEnabled: true,
      selectedDate: new Date().toISOString().split('T')[0],
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
    }),
    {
      name: 'medisafe-app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
