import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Tipos de datos
const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'draft', label: 'Borrador' },
  { value: 'completed', label: 'Completado' },
  { value: 'review', label: 'Revisión' }
];

const SEVERITY_OPTIONS = [1, 2, 3, 4, 5];

// Datos iniciales de ejemplo
const INITIAL_REPORTS = [
  {
    id: 1,
    shift_date: new Date().toISOString(),
    status: 'completed',
    severity: 2,
    summary: 'Monitoreo de firewall sin incidentes críticos durante el turno de la mañana. Actividad normal en los logs de seguridad.',
    incidents_count: 3,
    resolved_incidents: 3,
    created_by: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    shift_date: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    severity: 3,
    summary: 'Detección de 5 intentos de login fallidos provenientes de IP externa. Acciones preventivas aplicadas. Caso cerrado.',
    incidents_count: 5,
    resolved_incidents: 5,
    created_by: 'admin',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    shift_date: new Date(Date.now() - 172800000).toISOString(),
    status: 'draft',
    severity: 1,
    summary: 'Escaneo de vulnerabilidades programado completado. 2 hallazgos de baja severidad identificados y en proceso de validación.',
    incidents_count: 2,
    resolved_incidents: 0,
    created_by: 'admin',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 4,
    shift_date: new Date(Date.now() - 259200000).toISOString(),
    status: 'review',
    severity: 4,
    summary: 'Intento de ataque DDoS detectado y mitigado por WAF. 50 conexiones bloqueadas. Se recomienda revisar reglas de firewall.',
    incidents_count: 50,
    resolved_incidents: 50,
    created_by: 'admin',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 5,
    shift_date: new Date(Date.now() - 345600000).toISOString(),
    status: 'completed',
    severity: 1,
    summary: 'Revisión de logs de seguridad sin incidencias. Tráfico de red dentro de parámetros normales.',
    incidents_count: 0,
    resolved_incidents: 0,
    created_by: 'admin',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString()
  }
];

export default function Reports() {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    summary: '',
    severity: 1,
    status: 'draft'
  });

  // Estadísticas
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'draft').length,
    completed: reports.filter(r => r.status === 'completed').length,
    avgSeverity: reports.length > 0 
      ? Math.round(reports.reduce((sum, r) => sum + r.severity, 0) / reports.length * 10) / 10
      : 0
  };

  // Filtrar reportes
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.created_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Manejar creación de reporte
  const handleCreate = () => {
    const newReport = {
      id: reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1,
      shift_date: new Date().toISOString(),
      status: formData.status,
      severity: formData.severity,
      summary: formData.summary,
      incidents_count: 0,
      resolved_incidents: 0,
      created_by: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setReports([newReport, ...reports]);
    setShowCreateModal(false);
    setFormData({ summary: '', severity: 1, status: 'draft' });
  };

  // Manejar edición de reporte
  const handleEdit = () => {
    if (!editingReport) return;
    
    setReports(reports.map(r => 
      r.id === editingReport.id 
        ? { ...r, ...formData, updated_at: new Date().toISOString() }
        : r
    ));
    setShowEditModal(false);
    setEditingReport(null);
    setFormData({ summary: '', severity: 1, status: 'draft' });
  };

  // Manejar eliminación
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este reporte?')) {
      setReports(reports.filter(r => r.id !== id));
      if (selectedReport?.id === id) {
        setSelectedReport(null);
      }
    }
  };

  // Abrir modal de edición
  const openEditModal = (report) => {
    setEditingReport(report);
    setFormData({
      summary: report.summary,
      severity: report.severity,
      status: report.status
    });
    setShowEditModal(true);
  };

  // Obtener color de estado
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'draft': return '#f59e0b';
      case 'review': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Reportes</h1>
            <p className="text-text-secondary">Crea, edita y gestiona los reportes de turno del SOC</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Reporte
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-stats">
        <div className="card group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total Reportes</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Pendientes</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="card group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Completados</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="card group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Severidad Promedio</p>
              <p className="text-3xl font-bold">{stats.avgSeverity}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por resumen o autor..."
                className="input pl-12 w-full"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input pl-12 pr-12 appearance-none cursor-pointer"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-text-muted">
            {filteredReports.length} resultado(s) encontrado(s)
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-left">Fecha</th>
                <th className="text-left">Severidad</th>
                <th className="text-left">Estado</th>
                <th className="text-left">Resumen</th>
                <th className="text-left">Incidentes</th>
                <th className="text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr 
                    key={report.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => setSelectedReport(report)}
                  >
                    <td className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-text-muted" />
                        {formatDate(report.shift_date)}
                      </div>
                    </td>
                    <td>
                      <span 
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold"
                        style={{ 
                          backgroundColor: `rgba(6, 182, 212, ${0.1 + (report.severity - 1) * 0.1})`,
                          border: `1px solid rgba(6, 182, 212, ${0.3 + report.severity * 0.1})`,
                          color: report.severity <= 2 ? '#10b981' : report.severity <= 3 ? '#f59e0b' : '#ef4444'
                        }}
                      >
                        ⚡ {report.severity}/5
                      </span>
                    </td>
                    <td>
                      <span 
                        className="badge"
                        style={{ backgroundColor: `${getStatusColor(report.status)}/10`, borderColor: getStatusColor(report.status) }}
                      >
                        {report.status === 'draft' && '📝 '}
                        {report.status === 'completed' && '✅ '}
                        {report.status === 'review' && '👁️ '}
                        {report.status}
                      </span>
                    </td>
                    <td className="text-text-secondary max-w-xs truncate">
                      {report.summary}
                    </td>
                    <td>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-text-secondary">{report.resolved_incidents}/{report.incidents_count}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                          className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4 text-cyan-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(report);
                          }}
                          className="p-2 hover:bg-yellow-500/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(report.id);
                          }}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-secondary text-lg">No se encontraron reportes</p>
                    <p className="text-text-muted text-sm mt-2">
                      {searchTerm || statusFilter !== 'all' ? 'Intenta ajustar los filtros' : 'Crea tu primer reporte'}
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary mt-4"
                      >
                        <Plus className="w-4 h-4" />
                        Crear Reporte
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-secondary border border-border-primary rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Detalles del Reporte</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Report Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-text-muted mb-1">Fecha</p>
                  <p className="font-semibold">{formatDate(selectedReport.shift_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Severidad</p>
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-lg text-sm font-semibold"
                    style={{ 
                      backgroundColor: `rgba(6, 182, 212, ${0.1 + (selectedReport.severity - 1) * 0.1})`,
                      color: selectedReport.severity <= 2 ? '#10b981' : selectedReport.severity <= 3 ? '#f59e0b' : '#ef4444'
                    }}
                  >
                    ⚡ {selectedReport.severity}/5
                  </span>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Estado</p>
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: `${getStatusColor(selectedReport.status)}/10`, color: getStatusColor(selectedReport.status) }}
                  >
                    {selectedReport.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Autor</p>
                  <p className="font-semibold">@{selectedReport.created_by}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <p className="text-sm text-text-muted mb-2">Resumen</p>
                <p className="text-text-primary">{selectedReport.summary}</p>
              </div>

              {/* Incidents */}
              <div className="bg-bg-tertiary rounded-xl p-4">
                <p className="text-sm text-text-muted mb-3">Incidentes</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm">Totales: <strong>{selectedReport.incidents_count}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm">Resueltos: <strong>{selectedReport.resolved_incidents}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm">Pendientes: <strong>{selectedReport.incidents_count - selectedReport.resolved_incidents}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border-primary">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    openEditModal(selectedReport);
                    setSelectedReport(null);
                  }}
                  className="btn btn-secondary flex-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(selectedReport.id)}
                  className="btn btn-danger flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-secondary border border-border-primary rounded-2xl w-full max-w-xl">
            <div className="p-6 border-b border-border-primary">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Crear Nuevo Reporte</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ summary: '', severity: 1, status: 'draft' });
                  }}
                  className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Resumen del Turno *
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Describe los eventos principales, incidentes y actividades del turno..."
                  rows={4}
                  className="input w-full resize-none"
                  required
                />
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Severidad *
                </label>
                <div className="flex gap-2">
                  {SEVERITY_OPTIONS.map(severity => (
                    <button
                      key={severity}
                      onClick={() => setFormData({ ...formData, severity })}
                      className={`
                        flex-1 py-2 rounded-lg font-semibold transition-all
                        ${formData.severity === severity 
                          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                          : 'bg-bg-tertiary hover:bg-bg-secondary'}
                      `}
                    >
                      {severity}/5
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Estado *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {STATUS_OPTIONS.filter(o => o.value !== 'all').map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, status: option.value })}
                      className={`
                        py-2 rounded-lg font-medium transition-all
                        ${formData.status === option.value 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-bg-tertiary hover:bg-bg-secondary text-text-secondary'}
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border-primary flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ summary: '', severity: 1, status: 'draft' });
                }}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!formData.summary.trim()}
                className="btn btn-primary flex-1"
              >
                <Plus className="w-4 h-4" />
                Crear Reporte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Report Modal */}
      {showEditModal && editingReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-secondary border border-border-primary rounded-2xl w-full max-w-xl">
            <div className="p-6 border-b border-border-primary">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Editar Reporte</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingReport(null);
                    setFormData({ summary: '', severity: 1, status: 'draft' });
                  }}
                  className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Resumen del Turno
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Describe los eventos principales..."
                  rows={4}
                  className="input w-full resize-none"
                />
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Severidad
                </label>
                <div className="flex gap-2">
                  {SEVERITY_OPTIONS.map(severity => (
                    <button
                      key={severity}
                      onClick={() => setFormData({ ...formData, severity })}
                      className={`
                        flex-1 py-2 rounded-lg font-semibold transition-all
                        ${formData.severity === severity 
                          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                          : 'bg-bg-tertiary hover:bg-bg-secondary'}
                      `}
                    >
                      {severity}/5
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Estado
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {STATUS_OPTIONS.filter(o => o.value !== 'all').map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, status: option.value })}
                      className={`
                        py-2 rounded-lg font-medium transition-all
                        ${formData.status === option.value 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-bg-tertiary hover:bg-bg-secondary text-text-secondary'}
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border-primary flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingReport(null);
                  setFormData({ summary: '', severity: 1, status: 'draft' });
                }}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button onClick={handleEdit} className="btn btn-primary flex-1">
                <CheckCircle2 className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
