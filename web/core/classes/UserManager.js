/**
 * SOC Monitor v3.0 - UserManager
 * Clase para gestión de usuarios con mejor manejo de errores
 */

class UserManager {
  constructor() {
    this.users = [];
    this.logger = window.userLogger || console;
    this.api = window.mockAPI;
    this.loading = false;
    this.lastError = null;
  }

  async init() {
    this.logger.info('Inicializando UserManager...');
    
    if (!this.api) {
      this.logger.error('API no disponible');
      throw new Error('MockAPI no está definido');
    }

    try {
      await this.loadUsers();
      this.logger.info('UserManager inicializado exitosamente');
      return true;
    } catch (error) {
      this.logger.error('Error al inicializar UserManager:', error);
      this.lastError = error;
      return false;
    }
  }

  async loadUsers() {
    this.logger.debug('Cargando usuarios...');
    this.loading = true;

    try {
      if (!this.api) {
        throw new Error('API no disponible');
      }

      this.users = await this.api.getUsers();
      this.loading = false;
      
      this.logger.info(`Usuarios cargados: ${this.users.length}`);
      return this.users;
      
    } catch (error) {
      this.loading = false;
      this.lastError = error;
      this.logger.error('Error al cargar usuarios:', error);
      throw error;
    }
  }

  getUsers() {
    return this.users;
  }

  getUserById(id) {
    return this.users.find(u => u.id === id);
  }

  async createUser(userData) {
    this.logger.info('Creando nuevo usuario...');
    
    try {
      if (!this.api) {
        throw new Error('API no disponible');
      }

      const result = await this.api.createUser(userData);
      
      if (result.success) {
        await this.loadUsers();
        this.logger.info(`Usuario creado: ${result.user.username}`);
        return result;
      } else {
        this.logger.warn(`Error al crear usuario: ${result.message}`);
        return result;
      }
      
    } catch (error) {
      this.logger.error('Error al crear usuario:', error);
      return { success: false, message: error.message };
    }
  }

  async updateUser(id, userData) {
    this.logger.info(`Actualizando usuario ID: ${id}`);
    
    try {
      if (!this.api) {
        throw new Error('API no disponible');
      }

      const result = await this.api.updateUser(id, userData);
      
      if (result.success) {
        await this.loadUsers();
        this.logger.info(`Usuario actualizado: ${result.user.username}`);
        return result;
      } else {
        this.logger.warn(`Error al actualizar usuario: ${result.message}`);
        return result;
      }
      
    } catch (error) {
      this.logger.error('Error al actualizar usuario:', error);
      return { success: false, message: error.message };
    }
  }

  async deleteUser(id) {
    this.logger.info(`Eliminando usuario ID: ${id}`);
    
    try {
      if (!this.api) {
        throw new Error('API no disponible');
      }

      // Verificar que no sea admin
      const user = this.getUserById(id);
      if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      if (id === 1) {
        return { success: false, message: 'No puedes eliminar al administrador principal' };
      }

      const result = await this.api.deleteUser(id);
      
      if (result.success) {
        await this.loadUsers();
        this.logger.info(`Usuario eliminado: ${user.username}`);
        return result;
      } else {
        this.logger.warn(`Error al eliminar usuario: ${result.message}`);
        return result;
      }
      
    } catch (error) {
      this.logger.error('Error al eliminar usuario:', error);
      return { success: false, message: error.message };
    }
  }

  getLastError() {
    return this.lastError;
  }

  clearLastError() {
    this.lastError = null;
  }

  isLoading() {
    return this.loading;
  }

  getCount() {
    return this.users.length;
  }
}

// Crear instancia global
const userManager = new UserManager();

// Exportar
window.userManager = userManager;
window.UserManager = UserManager;

// Auto-inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => userManager.init());
} else {
  userManager.init();
}
