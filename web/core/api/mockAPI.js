/**
 * SOC Monitor v3.0 - Mock API
 * API simulada con localStorage, versionado y logging
 * Versión: 3.0.0
 */

const API_VERSION = "3.0.0";
const API_NAMESPACE = "soc_monitor_api";
const STORAGE_KEY_USERS = `${API_NAMESPACE}_users`;
const STORAGE_KEY_REPORTS = `${API_NAMESPACE}_reports`;
const STORAGE_KEY_SETTINGS = `${API_NAMESPACE}_settings`;

class MockAPI {
  constructor() {
    this.version = API_VERSION;
    this.logger = window.apiLogger || console;
    this.initialized = false;
  }

  async init() {
    this.logger.info('Inicializando MockAPI v' + this.version);
    
    if (!this.initialized) {
      await this.initializeData();
      this.initialized = true;
      this.logger.info('MockAPI inicializado exitosamente');
    }
    
    return this;
  }

  async initializeData() {
    this.logger.debug('Inicializando datos...');
    
    // Inicializar usuarios si no existen
    const existingUsers = this.getItem(STORAGE_KEY_USERS);
    if (!existingUsers) {
      const initialUsers = [
        {
          id: 1,
          username: 'admin',
          full_name: 'Administrador del Sistema',
          email: 'admin@empresa.com',
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString().split('T')[0],
          last_login: null
        },
        {
          id: 2,
          username: 'walterio',
          full_name: 'Walter Rios',
          email: 'walter@empresa.com',
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString().split('T')[0],
          last_login: null
        }
      ];
      this.setItem(STORAGE_KEY_USERS, initialUsers);
      this.logger.info('Usuarios iniciales creados');
    }

    // Inicializar reportes si no existen
    const existingReports = this.getItem(STORAGE_KEY_REPORTS);
    if (!existingReports) {
      const initialReports = [
        {
          id: 1,
          title: 'Primer Reporte de Seguridad',
          description: 'Reporte inicial del sistema',
          severity: 'medium',
          status: 'open',
          created_by: 'admin',
          created_at: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString().split('T')[0]
        }
      ];
      this.setItem(STORAGE_KEY_REPORTS, initialReports);
      this.logger.info('Reportes iniciales creados');
    }

    // Inicializar settings si no existen
    const existingSettings = this.getItem(STORAGE_KEY_SETTINGS);
    if (!existingSettings) {
      const defaultSettings = {
        system_name: 'SOC Monitor v3.0',
        system_version: API_VERSION,
        notifications_enabled: true,
        auto_refresh: true,
        refresh_interval: 30,
        theme: 'dark',
        language: 'es',
        max_reports: 1000,
        retention_days: 90
      };
      this.setItem(STORAGE_KEY_SETTINGS, defaultSettings);
      this.logger.info('Configuración inicial creada');
    }

    this.logger.debug('Inicialización de datos completada');
  }

  // Métodos generales
  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      this.logger.error(`Error al obtener ${key}:`, error);
      return null;
    }
  }

  setItem(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.logger.debug(`Datos guardados en ${key}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al guardar ${key}:`, error);
      return false;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      this.logger.debug(`${key} eliminado`);
      return true;
    } catch (error) {
      this.logger.error(`Error al eliminar ${key}:`, error);
      return false;
    }
  }

  // Métodos de Usuarios
  async getUsers() {
    this.logger.debug('Obteniendo usuarios...');
    const users = await this.getItem(STORAGE_KEY_USERS);
    this.logger.debug(`Usuarios encontrados: ${users?.length || 0}`);
    return users || [];
  }

  async getUserById(id) {
    this.logger.debug(`Obteniendo usuario con ID: ${id}`);
    const users = await this.getUsers();
    const user = users.find(u => u.id === id);
    this.logger.debug(`Usuario encontrado: ${!!user}`);
    return user || null;
  }

  async createUser(userData) {
    this.logger.info('Creando nuevo usuario...');
    
    try {
      const users = await this.getUsers();
      
      // Validaciones
      if (users.some(u => u.username === userData.username)) {
        this.logger.warn(`Username ya existe: ${userData.username}`);
        return { success: false, message: 'El nombre de usuario ya existe' };
      }

      if (users.some(u => u.email === userData.email)) {
        this.logger.warn(`Email ya existe: ${userData.email}`);
        return { success: false, message: 'El email ya está registrado' };
      }

      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: userData.username,
        full_name: userData.full_name || userData.username,
        email: userData.email,
        password: userData.password || '',
        role: userData.role || 'viewer',
        is_active: userData.is_active !== false,
        created_at: new Date().toISOString().split('T')[0],
        last_login: null
      };

      users.push(newUser);
      this.setItem(STORAGE_KEY_USERS, users);
      
      this.logger.info(`Usuario creado exitosamente: ${newUser.username} (ID: ${newUser.id})`);
      return { success: true, user: newUser, message: 'Usuario creado exitosamente' };
      
    } catch (error) {
      this.logger.error('Error al crear usuario:', error);
      return { success: false, message: 'Error al crear usuario: ' + error.message };
    }
  }

  async updateUser(id, userData) {
    this.logger.info(`Actualizando usuario con ID: ${id}`);
    
    try {
      const users = await this.getUsers();
      const index = users.findIndex(u => u.id === id);

      if (index === -1) {
        this.logger.warn(`Usuario no encontrado: ${id}`);
        return { success: false, message: 'Usuario no encontrado' };
      }

      // Validar username único (excluyendo el usuario actual)
      if (userData.username && userData.username !== users[index].username) {
        if (users.some(u => u.username === userData.username)) {
          this.logger.warn(`Username ya existe: ${userData.username}`);
          return { success: false, message: 'El nombre de usuario ya existe' };
        }
      }

      // Validar email único (excluyendo el usuario actual)
      if (userData.email && userData.email !== users[index].email) {
        if (users.some(u => u.email === userData.email)) {
          this.logger.warn(`Email ya existe: ${userData.email}`);
          return { success: false, message: 'El email ya está registrado' };
        }
      }

      // Actualizar usuario
      users[index] = {
        ...users[index],
        username: userData.username || users[index].username,
        full_name: userData.full_name || users[index].full_name,
        email: userData.email || users[index].email,
        role: userData.role || users[index].role,
        is_active: userData.is_active !== undefined ? userData.is_active : users[index].is_active,
        // Actualizar last_login si se proporciona nueva contraseña
        ...(userData.password && { last_login: new Date().toISOString() }),
        password: userData.password || users[index].password
      };

      this.setItem(STORAGE_KEY_USERS, users);
      
      this.logger.info(`Usuario actualizado: ${users[index].username}`);
      return { success: true, user: users[index], message: 'Usuario actualizado exitosamente' };
      
    } catch (error) {
      this.logger.error('Error al actualizar usuario:', error);
      return { success: false, message: 'Error al actualizar usuario: ' + error.message };
    }
  }

  async deleteUser(id) {
    this.logger.info(`Eliminando usuario con ID: ${id}`);
    
    try {
      const users = await this.getUsers();
      
      // Proteger admin principal
      if (id === 1) {
        this.logger.warn('Intento de eliminar admin principal');
        return { success: false, message: 'No puedes eliminar al administrador principal' };
      }

      const index = users.findIndex(u => u.id === id);
      
      if (index === -1) {
        this.logger.warn(`Usuario no encontrado: ${id}`);
        return { success: false, message: 'Usuario no encontrado' };
      }

      const deletedUser = users[index];
      users.splice(index, 1);
      this.setItem(STORAGE_KEY_USERS, users);
      
      this.logger.info(`Usuario eliminado: ${deletedUser.username} (ID: ${id})`);
      return { success: true, message: 'Usuario eliminado exitosamente' };
      
    } catch (error) {
      this.logger.error('Error al eliminar usuario:', error);
      return { success: false, message: 'Error al eliminar usuario: ' + error.message };
    }
  }

  // Métodos de Reportes
  async getReports() {
    this.logger.debug('Obteniendo reportes...');
    const reports = await this.getItem(STORAGE_KEY_REPORTS);
    this.logger.debug(`Reportes encontrados: ${reports?.length || 0}`);
    return reports || [];
  }

  async getReportById(id) {
    this.logger.debug(`Obteniendo reporte con ID: ${id}`);
    const reports = await this.getReports();
    const report = reports.find(r => r.id === id);
    return report || null;
  }

  async createReport(reportData) {
    this.logger.info('Creando nuevo reporte...');
    
    try {
      const reports = await this.getReports();
      
      const newReport = {
        id: reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1,
        title: reportData.title,
        description: reportData.description || '',
        severity: reportData.severity || 'low',
        status: reportData.status || 'open',
        created_by: reportData.created_by || 'admin',
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      };

      reports.push(newReport);
      this.setItem(STORAGE_KEY_REPORTS, reports);
      
      this.logger.info(`Reporte creado: ${newReport.title} (ID: ${newReport.id})`);
      return { success: true, report: newReport, message: 'Reporte creado exitosamente' };
      
    } catch (error) {
      this.logger.error('Error al crear reporte:', error);
      return { success: false, message: 'Error al crear reporte: ' + error.message };
    }
  }

  async updateReport(id, reportData) {
    this.logger.info(`Actualizando reporte con ID: ${id}`);
    
    try {
      const reports = await this.getReports();
      const index = reports.findIndex(r => r.id === id);

      if (index === -1) {
        return { success: false, message: 'Reporte no encontrado' };
      }

      reports[index] = {
        ...reports[index],
        title: reportData.title || reports[index].title,
        description: reportData.description || reports[index].description,
        severity: reportData.severity || reports[index].severity,
        status: reportData.status || reports[index].status,
        updated_at: new Date().toISOString().split('T')[0]
      };

      this.setItem(STORAGE_KEY_REPORTS, reports);
      this.logger.info(`Reporte actualizado: ${reports[index].title}`);
      return { success: true, report: reports[index], message: 'Reporte actualizado exitosamente' };
      
    } catch (error) {
      this.logger.error('Error al actualizar reporte:', error);
      return { success: false, message: 'Error al actualizar reporte: ' + error.message };
    }
  }

  async deleteReport(id) {
    this.logger.info(`Eliminando reporte con ID: ${id}`);
    
    try {
      const reports = await this.getReports();
      const index = reports.findIndex(r => r.id === id);

      if (index === -1) {
        return { success: false, message: 'Reporte no encontrado' };
      }

      const deletedReport = reports[index];
      reports.splice(index, 1);
      this.setItem(STORAGE_KEY_REPORTS, reports);
      
      this.logger.info(`Reporte eliminado: ${deletedReport.title} (ID: ${id})`);
      return { success: true, message: 'Reporte eliminado exitosamente' };
      
    } catch (error) {
      this.logger.error('Error al eliminar reporte:', error);
      return { success: false, message: 'Error al eliminar reporte: ' + error.message };
    }
  }

  // Métodos de Configuración
  async getSettings() {
    this.logger.debug('Obteniendo configuración...');
    const settings = await this.getItem(STORAGE_KEY_SETTINGS);
    return settings || {};
  }

  async updateSettings(settingsData) {
    this.logger.info('Actualizando configuración...');
    
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        ...settingsData,
        updated_at: new Date().toISOString()
      };
      
      this.setItem(STORAGE_KEY_SETTINGS, updatedSettings);
      this.logger.info('Configuración actualizada');
      return { success: true, settings: updatedSettings, message: 'Configuración actualizada' };
      
    } catch (error) {
      this.logger.error('Error al actualizar configuración:', error);
      return { success: false, message: 'Error al actualizar configuración: ' + error.message };
    }
  }

  // Estado del sistema
  async getSystemStatus() {
    this.logger.debug('Obteniendo estado del sistema...');
    
    return {
      version: this.version,
      initialized: this.initialized,
      timestamp: new Date().toISOString(),
      users_count: (await this.getUsers()).length,
      reports_count: (await this.getReports()).length,
      storage: {
        users: localStorage.getItem(STORAGE_KEY_USERS),
        reports: localStorage.getItem(STORAGE_KEY_REPORTS),
        settings: localStorage.getItem(STORAGE_KEY_SETTINGS)
      }
    };
  }
}

// Crear instancia global
const mockAPI = new MockAPI();

// Exportar para uso global
window.mockAPI = mockAPI;
window.MockAPI = MockAPI;

// Auto-inicializar cuando se cargue la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => mockAPI.init());
} else {
  mockAPI.init();
}
