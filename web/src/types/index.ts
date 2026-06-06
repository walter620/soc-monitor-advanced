// Tipo para Usuario
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'analyst' | 'viewer';
  created_at: string;
  updated_at: string;
}

// Tipo para Reporte de Turno
export interface ShiftReport {
  id: number;
  shift_date: string;
  status: 'completed' | 'draft' | 'review';
  severity: number; // 1-5
  summary: string;
  created_at: string;
  updated_at: string;
}

// Tipo para Configuración de Slack
export interface SlackConfig {
  id: number;
  bot_token: string;
  signing_secret: string;
  app_token: string;
  channel_id: string;
  created_at: string;
  updated_at: string;
}

// Tipo para Estadísticas
export interface Stats {
  total_reports: number;
  pending_reports: number;
  completed_reports: number;
  avg_severity: number;
  trend: number;
}

// Tipo para Alertas
export interface Alert {
  id: number;
  title: string;
  description: string;
  severity: number;
  status: 'active' | 'acknowledged' | 'resolved';
  created_at: string;
  resolved_at?: string;
}

// Tipo para Respuesta de API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
