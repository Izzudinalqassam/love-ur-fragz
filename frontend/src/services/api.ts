import axios from 'axios';
import type { Perfume, AromaTag, RecommendationRequest, RecommendationResult, AuthResponse, DashboardStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const perfumeService = {
  getAll: async (): Promise<Perfume[]> => {
    const response = await api.get('/api/perfumes');
    return response.data;
  },

  getById: async (id: number): Promise<Perfume> => {
    const response = await api.get(`/api/perfumes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Perfume>): Promise<Perfume> => {
    const response = await api.post('/api/admin/perfumes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Perfume>): Promise<Perfume> => {
    const response = await api.put(`/api/admin/perfumes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/perfumes/${id}`);
  },
};

export const aromaService = {
  getAll: async (): Promise<AromaTag[]> => {
    const response = await api.get('/api/aromas');
    return response.data;
  },

  create: async (data: Partial<AromaTag>): Promise<AromaTag> => {
    const response = await api.post('/api/admin/aromas', data);
    return response.data;
  },

  update: async (id: number, data: Partial<AromaTag>): Promise<AromaTag> => {
    const response = await api.put(`/api/admin/aromas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/aromas/${id}`);
  },
};

export const recommendationService = {
  getRecommendations: async (data: RecommendationRequest): Promise<RecommendationResult[]> => {
    const response = await api.post('/api/recommend', data);
    return response.data;
  },
};

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('admin_token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('admin_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('admin_token', token);
  },
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },
};

export default api;
