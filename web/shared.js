// Configuración global
const APP_CONFIG = {
  API_URL: 'http://150.240.162.65:8000',
  STORAGE_KEYS: {
    TOKEN: 'authToken',
    USER: 'username',
    ROLE: 'role',
    LOGGED_IN: 'isLoggedIn'
  }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  updateUserInfo();
});

// Verificar autenticación
function checkAuthentication() {
  const isLoggedIn = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.LOGGED_IN);
  
  if (!isLoggedIn) {
    // Redirigir a login si no está logueado
    if (window.location.pathname !== '/index.html' && 
        window.location.pathname !== '/login.html' &&
        !window.location.pathname.includes('index.html')) {
      window.location.href = 'index.html';
    }
  }
}

// Actualizar información de usuario
function updateUserInfo() {
  const username = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER) || 'admin';
  const role = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.ROLE) || 'Admin';
  
  // Actualizar sidebar
  const sidebarUsername = document.getElementById('sidebarUsername');
  const sidebarRole = document.getElementById('sidebarRole');
  
  if (sidebarUsername) {
    sidebarUsername.textContent = username;
  }
  
  if (sidebarRole) {
    sidebarRole.textContent = role;
  }
}

// Logout
function logout() {
  // Limpiar storage
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER);
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.ROLE);
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.LOGGED_IN);
  
  // Redirigir a login
  window.location.href = 'index.html';
}

// Logout handler para los botones de logout
function handleLogout() {
  logout();
}

// Verificar autenticación para páginas protegidas
function checkAuth() {
  const isLoggedIn = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.LOGGED_IN);
  const currentUser = getCurrentUser();
  
  if (!isLoggedIn || !currentUser.username) {
    // No autenticado, redirigir al login
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}

// Obtener usuario actual
function getCurrentUser() {
  return {
    username: localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER) || 'admin',
    role: localStorage.getItem(APP_CONFIG.STORAGE_KEYS.ROLE) || 'admin'
  };
}

// Verificar si tiene permisos
function hasPermission(requiredRole) {
  const currentUser = getCurrentUser();
  const roles = ['admin']; // Roles con permisos completos
  
  if (requiredRole === 'all') return true;
  if (roles.includes(currentUser.role)) return true;
  return false;
}

// Formatear fecha
function formatDate(date) {
  const d = new Date(date);
  const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  };
  return d.toLocaleDateString('es-ES', options);
}

// Obtener severidad por color
function getSeverityColor(severity) {
  const colors = {
    critical: 'red',
    high: '#f59e0b',
    medium: '#06b6d4',
    low: '#10b981',
    unknown: '#6b7280'
  };
  return colors[severity] || colors.unknown;
}

// Mostrar mensaje de éxito/error
function showMessage(message, type = 'error') {
  // Esta función puede ser usada en páginas individuales
  console.log(`${type.toUpperCase()}: ${message}`);
}

// Simulación de API (para desarrollo sin backend)
const mockAPI = {
  async login(username, password) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (username === 'admin' && password === 'admin123') {
      return {
        success: true,
        token: 'mock-token-' + Date.now(),
        user: {
          username: 'admin',
          role: 'admin'
        }
      };
    } else if (username === 'walterio' && password === 'admin123') {
      return {
        success: true,
        token: 'mock-token-' + Date.now(),
        user: {
          username: 'walterio',
          role: 'admin'
        }
      };
    }
    
    return {
      success: false,
      message: 'Usuario o contraseña incorrectos'
    };
  },
  
  async getReports(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Datos de ejemplo
    return [
      {
        id: 1001,
        title: 'Intento de acceso fallido múltiple',
        description: 'Múltiples intentos de acceso fallidos desde IP 192.168.1.100',
        severity: 'high',
        status: 'pending',
        date: '2024-06-05T10:00:00Z',
        user: 'admin',
        resolved_by: null
      },
      {
        id: 1002,
        title: 'Pico de tráfico inusual',
        description: 'Tráfico de red aumentó 300% en los últimos 5 minutos',
        severity: 'medium',
        status: 'processing',
        date: '2024-06-05T08:00:00Z',
        user: 'admin',
        resolved_by: null
      },
      {
        id: 1003,
        title: 'Acceso desde IP sospechosa',
        description: 'Acceso exitoso desde IP en lista negra',
        severity: 'high',
        status: 'completed',
        date: '2024-06-05T06:00:00Z',
        user: 'admin',
        resolved_by: 'admin'
      }
    ];
  },
  
  async getUsers() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 1,
        username: 'admin',
        email: 'admin@empresa.com',
        role: 'admin',
        full_name: 'Administrador',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        username: 'walterio',
        email: 'walter@empresa.com',
        role: 'admin',
        full_name: 'Walter Rios',
        is_active: true,
        created_at: '2024-06-01T00:00:00Z'
      }
    ];
  },
  
  async createUser(userData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      user: {
        id: Date.now(),
        ...userData,
        is_active: true,
        created_at: new Date().toISOString()
      }
    };
  },
  
  async updateUser(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      user: {
        id: id,
        ...userData
      }
    };
  },
  
  async deleteUser(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      message: 'Usuario eliminado correctamente'
    };
  },
  
  async createReport(reportData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      report: {
        id: Date.now(),
        ...reportData,
        created_by: getCurrentUser().username,
        created_at: new Date().toISOString()
      }
    };
  },
  
  async updateReport(id, reportData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      report: {
        id: id,
        ...reportData
      }
    };
  }
};

// Exportar para uso global
window.mockAPI = mockAPI;
window.APP_CONFIG = APP_CONFIG;
