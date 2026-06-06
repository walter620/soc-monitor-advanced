import React, { useState, useEffect } from 'react';
import { Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Credenciales inválidas. Verifica usuario y contraseña.');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-pattern">
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-4 shadow-lg shadow-cyan-500/25">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">SOC Monitor</span>
          </h1>
          <p className="text-text-secondary">Centro de Operaciones de Seguridad</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Login Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Nombre de Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-text-muted" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej: admin o walterio"
                  className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-text-primary"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-text-muted" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-text-primary"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
            Credenciales de prueba:{' '}
            <span className="text-cyan-400">admin</span> / <span className="text-cyan-400">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
