import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await api.post('/api/v1/auth/login', formData);
    return response.data;
  },
  
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
  }) => {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  },
};

export const reportService = {
  getAll: async () => {
    const response = await api.get('/api/v1/reports');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/api/v1/reports/${id}`);
    return response.data;
  },
  
  create: async (reportData: any) => {
    const response = await api.post('/api/v1/reports', reportData);
    return response.data;
  },
  
  update: async (id: number, reportData: any) => {
    const response = await api.put(`/api/v1/reports/${id}`, reportData);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/api/v1/reports/${id}`);
    return response.data;
  },
};

export const userService = {
  getAll: async () => {
    const response = await api.get('/api/v1/users');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data;
  },
  
  create: async (userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
  }) => {
    const response = await api.post('/api/v1/users', userData);
    return response.data;
  },
};
