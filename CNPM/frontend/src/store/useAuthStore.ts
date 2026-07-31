import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (userPartial: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user: User, token: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('medisafe_token', token);
        }
        set({ user, token, isAuthenticated: true });
      },
      updateUser: (userPartial: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userPartial } : null,
        }));
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('medisafe_token');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'medisafe-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
