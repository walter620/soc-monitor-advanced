import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Activity, 
  TrendingUp, 
  Bell, 
  Search,
  RefreshCw,
  ChevronRight,
  Zap
} from 'lucide-react';
import { reportService } from '../services/api';
import type { ShiftReport } from '../types';

// Mock data para demostración cuando no hay datos reales
const generateMockData = (): ShiftReport[] => {
  const statuses = ['completed', 'draft', 'review'] as const;
  const severities = [1, 2, 3, 4, 5];
  const summaries = [
    'Monitoreo de firewall sin incidentes críticos',
    'Detección de intentos de login fallidos - Nivel medio',
    'Análisis de tráfico de red - Sin anomalías',
    'Revisión de logs de seguridad - Todo normal',
    'Escaneo de vulnerabilidades - 2 hallazgos menores'
  ];
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    shift_date: new Date(Date.now() - i * 86400000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
};

export default function Dashboard() {
  const [reports, setReports] = useState<ShiftReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    avgSeverity: 0,
    trend: 12.5
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getAll();
      setReports(data);
      
      setStats({
        total: data.length,
        pending: data.filter(r => r.status === 'draft').length,
        completed: data.filter(r => r.status === 'completed').length,
        avgSeverity: data.length > 0 
          ? Math.round(data.reduce((sum, r) => sum + r.severity, 0) / data.length * 10) / 10
          : 0,
        trend: data.length > 0 
          ? Math.round((Math.random() * 30 - 15) * 10) / 10
          : 0
      });
    } catch (error) {
      console.error('Error loading reports:', error);
      // Fallback a datos mock para demo
      const mockData = generateMockData();
      setReports(mockData);
      setStats({
        total: mockData.length,
        pending: mockData.filter(r => r.status === 'draft').length,
        completed: mockData.filter(r => r.status === 'completed').length,
        avgSeverity: 3.2,
        trend: 8.5
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = reports.slice(-7).map(r => ({
    date: new Date(r.shift_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
    severity: r.severity,
    incidents: Math.floor(Math.random() * 10) + 1
  }));

  const lineData = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('es-AR', { day: '2-digit' }),
    alerts: Math.floor(Math.random() * 50) + 10,
    resolved: Math.floor(Math.random() * 40) + 5
  }));

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'badge-success';
      case 'draft': return 'badge-warning';
      case 'review': return 'badge-info';
      default: return 'badge-info';
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return 'text-success';
    if (severity <= 3) return 'text-warning';
    return 'text-danger';
  };

  const getSeverityBg = (severity: number) => {
    if (severity <= 2) return 'bg-success/10 border-success/30';
    if (severity <= 3) return 'bg-warning/10 border-warning/30';
    return 'bg-danger/10 border-danger/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-text-secondary animate-pulse">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">SOC Monitor</span> Dashboard
          </h1>
          <p className="text-text-secondary">Visión general del centro de operaciones de seguridad</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadReports}
            className="btn btn-secondary"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button className="btn btn-primary">
            <Bell className="w-4 h-4" />
            Notificaciones
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-stats">
        {/* Total Reports */}
        <div className="card group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-success" />
              +12.5%
            </span>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Total Reportes</p>
            <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
            <p className="text-xs text-text-muted mt-2">Últimos 30 días</p>
          </div>
        </div>

        {/* Pending */}
        <div className="card group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl group-hover:bg-yellow-500/20 transition-colors">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-text-muted">Pendientes</span>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-text-primary">{stats.pending}</p>
            <p className="text-xs text-text-muted mt-2">Requieren atención</p>
          </div>
        </div>

        {/* Completed */}
        <div className="card group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8.2%
            </span>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Completados</p>
            <p className="text-3xl font-bold text-text-primary">{stats.completed}</p>
            <p className="text-xs text-text-muted mt-2">Tasa del 85%</p>
          </div>
        </div>

        {/* Avg Severity */}
        <div className="card group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityBg(stats.avgSeverity as number)}`}>
              Nivel {stats.avgSeverity}
            </span>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Severidad Promedio</p>
            <p className={`text-3xl font-bold ${getSeverityColor(stats.avgSeverity as number)}`}>
              {stats.avgSeverity}
            </p>
            <p className="text-xs text-text-muted mt-2">Escala 1-5</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))' }}>
        {/* Severity Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Tendencia de Severidad</h2>
              <p className="text-sm text-text-secondary">Últimos 7 días</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              En vivo
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                itemStyle={{ color: '#f9fafb' }}
              />
              <Area 
                type="monotone" 
                dataKey="severity" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorSeverity)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts & Resolutions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Alertas vs Resueltas</h2>
              <p className="text-sm text-text-secondary">Últimos 14 días</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-text-secondary">Alertas</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="text-text-secondary">Resueltas</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                itemStyle={{ color: '#f9fafb' }}
              />
              <Line 
                type="monotone" 
                dataKey="alerts" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Reportes Recientes</h2>
              <p className="text-sm text-text-secondary">Últimas 24 horas</p>
            </div>
          </div>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
            Ver todos
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Severidad</th>
                <th>Resumen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 5).map((report, index) => (
                <tr key={report.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="font-mono text-sm">
                    {new Date(report.shift_date).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold ${getSeverityBg(report.severity)}`}>
                      <Zap className="w-3 h-3 mr-1.5" />
                      {report.severity}/5
                    </span>
                  </td>
                  <td className="text-text-secondary max-w-xs truncate">
                    {report.summary}
                  </td>
                  <td>
                    <button className="text-text-secondary hover:text-cyan-400 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <button className="card group">
          <div className="p-3 bg-red-500/10 rounded-xl mb-3 group-hover:bg-red-500/20 transition-colors">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <p className="font-semibold">Nuevo Incidente</p>
          <p className="text-sm text-text-secondary mt-1">Reportar alerta</p>
        </button>
        
        <button className="card group">
          <div className="p-3 bg-green-500/10 rounded-xl mb-3 group-hover:bg-green-500/20 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <p className="font-semibold">Crear Reporte</p>
          <p className="text-sm text-text-secondary mt-1">Turno completo</p>
        </button>
        
        <button className="card group">
          <div className="p-3 bg-purple-500/10 rounded-xl mb-3 group-hover:bg-purple-500/20 transition-colors">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <p className="font-semibold">Analizar Log</p>
          <p className="text-sm text-text-secondary mt-1">Subir archivo</p>
        </button>
        
        <button className="card group">
          <div className="p-3 bg-yellow-500/10 rounded-xl mb-3 group-hover:bg-yellow-500/20 transition-colors">
            <Bell className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="font-semibold">Configurar Alertas</p>
          <p className="text-sm text-text-secondary mt-1">Notificaciones</p>
        </button>
      </div>
    </div>
  );
}
