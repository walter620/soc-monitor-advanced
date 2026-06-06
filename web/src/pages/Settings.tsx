import React from 'react';
import { 
  Shield, 
  Bell, 
  Lock, 
  User, 
  Database, 
  Server, 
  Globe,
  Save,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function Settings() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
    critical: true,
    info: true
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-text-secondary">Gestiona las preferencias del sistema SOC Monitor</p>
      </div>

      {/* System Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-500/10 rounded-xl">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Configuración del Sistema</h2>
            <p className="text-sm text-text-secondary">Ajustes generales del SOC Monitor</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* System Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Nombre del Sistema
            </label>
            <input
              type="text"
              defaultValue="SOC Monitor Advanced"
              className="input"
            />
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Zona Horaria
            </label>
            <select className="input">
              <option>America/Argentina/Buenos_Aires</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Formato de Fecha
            </label>
            <select className="input">
              <option>DD/MM/YYYY HH:mm</option>
              <option>MM/DD/YYYY HH:mm</option>
              <option>YYYY-MM-DD HH:mm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-yellow-500/10 rounded-xl">
            <Bell className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Notificaciones</h2>
            <p className="text-sm text-text-secondary">Configura cómo recibir alertas</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border-primary">
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-text-muted">Recibir alertas por correo electrónico</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border-primary">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-text-muted">Notificaciones en el navegador</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border-primary">
            <div>
              <p className="font-medium">Alertas Críticas</p>
              <p className="text-sm text-text-muted">Recibir solo alertas de severidad alta</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.critical}
                onChange={(e) => setNotifications({ ...notifications, critical: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Alertas Informativas</p>
              <p className="text-sm text-text-muted">Recibir alertas de severidad baja</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.info}
                onChange={(e) => setNotifications({ ...notifications, info: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <Lock className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Seguridad</h2>
            <p className="text-sm text-text-secondary">Configuración de seguridad y autenticación</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Tiempo de Sesión (minutos)
            </label>
            <input
              type="number"
              defaultValue="30"
              min="5"
              max="1440"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Intentos Fallidos antes de Bloqueo
            </label>
            <input
              type="number"
              defaultValue="5"
              min="1"
              max="10"
              className="input"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-border-primary">
            <div>
              <p className="font-medium">Autenticación de Dos Factores (2FA)</p>
              <p className="text-sm text-text-muted">Requiere código adicional al iniciar sesión</p>
            </div>
            <button className="btn btn-secondary">
              Configurar 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Data Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-500/10 rounded-xl">
            <Database className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Datos y Almacenamiento</h2>
            <p className="text-sm text-text-secondary">Gestión de datos históricos</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Retención de Reportes (días)
            </label>
            <input
              type="number"
              defaultValue="90"
              min="30"
              max="365"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Retención de Logs (días)
            </label>
            <input
              type="number"
              defaultValue="30"
              min="7"
              max="365"
              className="input"
            />
          </div>

          <div className="flex gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Limpiar Cache
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Exportar Datos
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="btn btn-primary flex items-center gap-2">
          <Save className="w-5 h-5" />
          Guardar Cambios
        </button>
        <button className="btn btn-secondary flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Restaurar Predeterminados
        </button>
      </div>

      {/* Info Alert */}
      <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-yellow-400">Información</p>
          <p className="text-sm text-text-muted mt-1">
            Los cambios en la configuración del sistema se aplicarán inmediatamente. 
            Algunos ajustes pueden requerir reinicio del servicio.
          </p>
        </div>
      </div>
    </div>
  );
}
