import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import { apiService } from './services/api';

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await apiService.login(username, password);
      apiService.setAuthToken(response.access_token);
      setIsLoggedIn(true);
      setCurrentPath('/');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setCurrentPath('/login');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e17', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: '#111827', border: '1px solid #374151', borderRadius: '24px', padding: '40px' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 15px rgba(6, 182, 212, 0.25)' }}>
            <span style={{ fontSize: '36px' }}>🛡️</span>
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textAlign: 'center' }}>
            SOC Monitor
          </h1>
          
          <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: '32px' }}>
            Centro de Operaciones de Seguridad
          </p>

          {error && (
            <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Username
              </label>
              <input
                name="username"
                type="text"
                required
                defaultValue="admin"
                style={{ width: '100%', padding: '12px 16px', background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#f9fafb', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                defaultValue="admin123"
                style={{ width: '100%', padding: '12px 16px', background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#f9fafb', fontSize: '14px' }}
              />
            </div>
            
            <button
              type="submit"
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0e17' }}>
      <Sidebar currentPath={currentPath} setCurrentPath={setCurrentPath} onLogout={handleLogout} />
      
      <div style={{ flex: 1, padding: '32px' }}>
        {currentPath === '/reports' && <Reports />}
        {currentPath === '/users' && <Users />}
        {currentPath === '/settings' && <Settings />}
        {currentPath === '/' && (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Dashboard</h1>
            <p style={{ color: '#9ca3af' }}>Centro de Operaciones de Seguridad</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Sidebar({ currentPath, setCurrentPath, onLogout }: { currentPath: string, setCurrentPath: (path: string) => void, onLogout: () => void }) {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/reports', label: 'Reportes', icon: '📋' },
    { path: '/users', label: 'Usuarios', icon: '👥' },
    { path: '/settings', label: 'Configuración', icon: '⚙️' }
  ];

  return (
    <div style={{ width: '256px', background: '#111827', borderRight: '1px solid #374151', padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f9fafb' }}>
          SOC Monitor
        </h1>
      </div>
      
      <nav style={{ flex: 1 }}>
        {navItems.map(item => (
          <a
            key={item.path}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPath(item.path);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: currentPath === item.path ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : '#1f2937',
              color: currentPath === item.path ? 'white' : '#9ca3af',
              borderRadius: '12px',
              textDecoration: 'none',
              marginBottom: '8px',
              fontWeight: currentPath === item.path ? 600 : 500,
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
      
      <button
        onClick={onLogout}
        style={{
          marginTop: 'auto',
          padding: '12px 16px',
          background: '#374151',
          color: '#f9fafb',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <span>🚪</span> Cerrar Sesión
      </button>
    </div>
  );
}

export default App;
