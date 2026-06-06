import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Bell,
  Menu,
  X,
  LogOut,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    alerts: 12,
    pending: 3,
    critical: 1
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState('admin');

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/reports', label: 'Reportes', icon: <FileText className="w-5 h-5" /> },
    { path: '/users', label: 'Usuarios', icon: <Users className="w-5 h-5" /> },
    { path: '/settings', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-bg-secondary border-r border-border-primary
        transform transition-transform duration-300 z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-border-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg gradient-text">SOC Monitor</h1>
              <p className="text-xs text-text-muted">Centro de Operaciones</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${location.pathname === item.path 
                  ? 'bg-gradient-primary shadow-lg shadow-cyan-500/25' 
                  : 'hover:bg-bg-tertiary text-text-secondary hover:text-text-primary'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-primary">
          <p className="text-xs text-text-muted mb-3">Estado del Sistema</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-text-secondary">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Alertas
              </span>
              <span className="font-semibold text-red-400">{stats.alerts}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-text-secondary">
                <Clock className="w-4 h-4 text-yellow-400" />
                Pendientes
              </span>
              <span className="font-semibold text-yellow-400">{stats.pending}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-text-secondary">
                <Activity className="w-4 h-4 text-cyan-400" />
                Severidad
              </span>
              <span className="font-semibold text-cyan-400">Media</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-bg-secondary/80 backdrop-blur-xl border-b border-border-primary sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-bg-tertiary rounded-lg"
                >
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Page Title */}
                <div>
                  <h2 className="text-xl font-bold">
                    {location.pathname === '/' && 'Dashboard'}
                    {location.pathname === '/reports' && 'Gestión de Reportes'}
                    {location.pathname === '/users' && 'Gestión de Usuarios'}
                    {location.pathname === '/settings' && 'Configuración'}
                  </h2>
                  <p className="text-sm text-text-muted hidden sm:block">
                    Bienvenido, {currentUser}
                  </p>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-text-secondary" />
                  {stats.alerts > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  )}
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-border-primary">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-text-primary">{currentUser}</p>
                    <p className="text-xs text-text-muted">Analista SOC L1</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{currentUser[0].toUpperCase()}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-5 h-5 text-text-secondary" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
