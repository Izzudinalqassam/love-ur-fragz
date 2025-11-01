import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: {
    id: number;
    username: string;
    email: string;
  } | null;
  setAuth: (token: string, user: { id: number; username: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('admin_token'),
  user: null,
  setAuth: (token, user) => {
    localStorage.setItem('admin_token', token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    set({ token: null, user: null });
  },
}));
