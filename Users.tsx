import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Shield, 
  Mail, 
  Calendar,
  Eye,
  X,
  CheckCircle2,
  MoreVertical,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiService, User, UserCreate, UserUpdate } from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<UserCreate>>({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'viewer'
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const roles = {
      admin: { class: 'badge-danger', icon: Shield, label: 'Admin' },
      analyst: { class: 'badge-info', icon: Eye, label: 'Analyst' },
      viewer: { class: 'badge-success', icon: CheckCircle2, label: 'Viewer' }
    };
    const { class: badgeClass, icon: Icon, label } = roles[role as keyof typeof roles] || roles.viewer;
    return (
      <span className={`badge ${badgeClass}`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const newUser: UserCreate = {
        username: formData.username!,
        email: formData.email!,
        full_name: formData.full_name!,
        password: formData.password!,
        role: formData.role!
      };

      const createdUser = await apiService.createUser(newUser);
      setUsers([...users, createdUser]);
      setShowModal(false);
      setFormData({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'viewer'
      });
      setSuccessMessage('Usuario creado exitosamente');
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData: UserUpdate = {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role as string,
        is_active: formData.role ? true : undefined
      };

      const updatedUser = await apiService.updateUser(editingUser.id, updateData);
      setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
      setShowModal(false);
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'viewer'
      });
      setSuccessMessage('Usuario actualizado exitosamente');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      await apiService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setSuccessMessage('Usuario eliminado exitosamente');
    } catch (err: any) {
      setError(err.message || 'Error al eliminar usuario');
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      full_name: '',
      password: '',
      role: 'viewer'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      full_name: '',
      password: '',
      role: 'viewer'
    });
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Usuarios</span>
          </h1>
          <p className="text-text-secondary">Gestión de acceso y roles del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid-stats">
        <div className="card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Administradores</p>
              <p className="text-3xl font-bold text-danger">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-colors">
              <Shield className="w-6 h-6 text-danger" />
            </div>
          </div>
        </div>

        <div className="card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Analistas</p>
              <p className="text-3xl font-bold text-info">{users.filter(u => u.role === 'analyst').length}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
              <Eye className="w-6 h-6 text-info" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuarios..."
              className="input pl-12"
            />
          </div>

          {/* Filter by Role */}
          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input max-w-[180px]"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="analyst">Analistas</option>
              <option value="viewer">Visualizadores</option>
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border-primary">
          <div className="text-center">
            <p className="text-2xl font-bold text-danger">{users.filter(u => u.role === 'admin').length}</p>
            <p className="text-sm text-text-secondary">Admins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-info">{users.filter(u => u.role === 'analyst').length}</p>
            <p className="text-sm text-text-secondary">Analysts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{users.filter(u => u.role === 'viewer').length}</p>
            <p className="text-sm text-text-secondary">Viewers</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-text-muted mx-auto mb-4 animate-spin" />
            <p className="text-text-secondary">Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary text-lg">No se encontraron usuarios</p>
            <p className="text-text-muted mt-2">Intenta con otra búsqueda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Fecha Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{user.full_name}</p>
                          <p className="text-sm text-text-secondary">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-text-muted" />
                      <span>{user.email}</span>
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-text-muted" />
                        <span className="font-mono text-sm">{formatDate(user.created_at)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm text-success">Activo</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-border-primary rounded-lg transition-colors text-text-secondary hover:text-yellow-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-border-primary rounded-lg transition-colors text-text-secondary hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-border-primary rounded-lg transition-colors text-text-secondary hover:text-cyan-400">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="card w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-border-primary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Nombre Completo
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="input" 
                  placeholder="Ej: Juan Pérez" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email Corporativo
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input 
                    type="email" 
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input pl-12" 
                    placeholder="usuario@empresa.com" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Username
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.username || ''}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="input" 
                  placeholder="juan.perez" 
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Contraseña
                  </label>
                  <input 
                    type="password" 
                    required
                    value={formData.password || ''}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="input" 
                    placeholder="••••••••" 
                    minLength={8}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Role
                </label>
                <select 
                  value={formData.role || 'viewer'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="input"
                >
                  <option value="viewer">Visualizador</option>
                  <option value="analyst">Analista SOC</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1"
                >
                  <Plus className="w-4 h-4" />
                  {editingUser ? 'Actualizar' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
