export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'operator' | 'supervisor';
  is_active: boolean;
  created_at: string;
}

export interface ShiftReport {
  id: number;
  operator_id: number;
  shift_date: string;
  start_time: string;
  end_time: string;
  summary: string;
  status: 'draft' | 'completed' | 'reviewed';
  severity: number;
  created_at: string;
  updated_at: string;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
