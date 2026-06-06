# SOC Monitor Advanced - Servicios de API

export const API_BASE_URL = 'http://localhost:8000';

// Interfaces
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  full_name?: string;
  role?: string;
  is_active?: boolean;
}

// Headers comunes
const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// Autenticación
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Servicios de API
export const apiService = {
  // Login
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error en autenticación');
    }

    const data = await response.json();
    setAuthToken(data.access_token);
    return data;
  },

  // Logout
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  },

  // Listar usuarios
  async getUsers(): Promise<User[]> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
      headers: {
        ...getHeaders(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Error al cargar usuarios');
    }

    return response.json();
  },

  // Crear usuario
  async createUser(userData: UserCreate): Promise<User> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear usuario');
    }

    return response.json();
  },

  // Actualizar usuario
  async updateUser(userId: number, userData: UserUpdate): Promise<User> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
      method: 'PUT',
      headers: {
        ...getHeaders(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al actualizar usuario');
    }

    return response.json();
  },

  // Eliminar usuario
  async deleteUser(userId: number): Promise<void> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
      method: 'DELETE',
      headers: {
        ...getHeaders(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al eliminar usuario');
    }
  },

  // Obtener usuario por ID
  async getUserById(userId: number): Promise<User> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
      headers: {
        ...getHeaders(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Usuario no encontrado');
    }

    return response.json();
  },
};
