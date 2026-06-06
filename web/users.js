// Estado global
let users = [];

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  await loadUsers();
});

// Cargar usuarios
async function loadUsers() {
  try {
    users = await mockAPI.getUsers();
    renderUsers();
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    showMessage('Error al cargar usuarios', 'error');
  }
}

// Renderizar tabla de usuarios
function renderUsers() {
  const tableBody = document.getElementById('usersTableBody');
  const countBadge = document.getElementById('usersCount');
  
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  if (users.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: #9ca3af;">
          No hay usuarios registrados
        </td>
      </tr>
    `;
    if (countBadge) countBadge.textContent = '0 usuarios';
    return;
  }
  
  users.forEach(user => {
    const row = createUserRow(user);
    tableBody.appendChild(row);
  });
  
  if (countBadge) {
    countBadge.textContent = `${users.length} usuario${users.length !== 1 ? 's' : ''}`;
  }
}

// Crear fila de usuario
function createUserRow(user) {
  const row = document.createElement('tr');
  
  const statusClass = user.is_active ? 'active' : 'inactive';
  const statusLabel = user.is_active ? 'Activo' : 'Inactivo';
  
  row.innerHTML = `
    <td>${user.id}</td>
    <td>
      <div style="display: flex; align-items: center; gap: 8px;">
        <div class="user-avatar-small" style="
          width: 32px;
          height: 32px;
          background: #374151;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;">
          👤
        </div>
        <div>
          <div style="font-weight: 600; color: #f9fafb;">${escapeHtml(user.full_name || user.username)}</div>
        </div>
      </div>
    </td>
    <td style="color: #f9fafb;">${escapeHtml(user.username)}</td>
    <td>${escapeHtml(user.email)}</td>
    <td><span class="status ${user.role === 'admin' ? 'critical' : 'medium'}">${user.role}</span></td>
    <td><span class="status ${statusClass}">${statusLabel}</span></td>
    <td>${formatDate(user.created_at)}</td>
    <td class="actions-cell">
      <button class="btn-icon" onclick="editUser(${user.id})" title="Editar">✏️</button>
      ${user.id !== 1 ? `<button class="btn-icon" onclick="deleteUser(${user.id})" title="Eliminar">🗑️</button>` : ''}
    </td>
  `;
  
  return row;
}

// Mostrar modal de nuevo usuario
function showNewUserModal() {
  const modal = document.getElementById('userModal');
  if (modal) modal.style.display = 'flex';
  
  // Resetear formulario
  document.getElementById('userForm').reset();
  document.getElementById('userId').value = '';
  document.getElementById('userActive').checked = true;
  document.getElementById('userModalTitle').textContent = 'Crear Nuevo Usuario';
  document.getElementById('saveUserBtn').textContent = 'Crear Usuario';
}

// Cerrar modal de usuario
function closeUserModal() {
  const modal = document.getElementById('userModal');
  if (modal) modal.style.display = 'none';
  
  document.getElementById('userForm').reset();
  
  // Resetear también el botón si estaba en modo edición
  const saveBtn = document.getElementById('saveUserBtn');
  if (saveBtn) {
    saveBtn.textContent = 'Crear Usuario';
  }
  
  const modalTitle = document.getElementById('userModalTitle');
  if (modalTitle) {
    modalTitle.textContent = 'Crear Nuevo Usuario';
  }
  
  // Limpiar ID oculto
  document.getElementById('userId').value = '';
}

// Editar usuario
function editUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) {
    showMessage('Usuario no encontrado', 'error');
    return;
  }
  
  // Abrir modal
  const modal = document.getElementById('userModal');
  if (modal) modal.style.display = 'flex';
  
  // Cambiar título
  document.getElementById('userModalTitle').textContent = 'Editar Usuario';
  document.getElementById('saveUserBtn').textContent = 'Guardar Cambios';
  
  // Llenar formulario
  document.getElementById('userId').value = user.id;
  document.getElementById('userUsername').value = user.username || '';
  document.getElementById('userFullName').value = user.full_name || '';
  document.getElementById('userEmail').value = user.email || '';
  document.getElementById('userPassword').value = ''; // No mostrar contraseña actual
  document.getElementById('userRole').value = user.role || 'admin';
  document.getElementById('userActive').checked = user.is_active !== false;
}

// Guardar usuario (crear o editar)
async function saveUser(event) {
  event.preventDefault();
  
  const id = document.getElementById('userId').value;
  const username = document.getElementById('userUsername').value;
  const fullName = document.getElementById('userFullName').value;
  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('userPassword').value;
  const role = document.getElementById('userRole').value;
  const isActive = document.getElementById('userActive').checked;
  
  const userData = {
    username,
    full_name: fullName,
    email,
    role,
    is_active: isActive
  };
  
  try {
    let result;
    
    if (id) {
      // Editar usuario existente
      result = await mockAPI.updateUser(id, userData);
    } else {
      // Crear nuevo usuario
      if (!password) {
        showMessage('❌ La contraseña es obligatoria para nuevos usuarios', 'error');
        return;
      }
      result = await mockAPI.createUser({ ...userData, password });
    }
    
    if (result.success) {
      if (id) {
        // Actualizar en la lista
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
          users[index] = { ...users[index], ...result.user };
        }
        
        showMessage('✅ Usuario actualizado exitosamente', 'success');
      } else {
        // Agregar a la lista
        users.push(result.user);
        
        showMessage('✅ Usuario creado exitosamente', 'success');
      }
      
      // Cerrar modal
      closeUserModal();
      
      // Recargar lista
      await loadUsers();
      
    } else {
      showMessage('❌ Error al guardar usuario', 'error');
    }
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    showMessage('❌ Error al guardar usuario', 'error');
  }
}

// Eliminar usuario
async function deleteUser(id) {
  if (id === 1) {
    showMessage('❌ No puedes eliminar al administrador principal', 'error');
    return;
  }
  
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
    return;
  }
  
  try {
    const result = await mockAPI.deleteUser(id);
    
    if (result.success) {
      // Eliminar de la lista
      users = users.filter(u => u.id !== id);
      
      // Recargar
      await loadUsers();
      
      // Mostrar mensaje
      showMessage('✅ Usuario eliminado exitosamente', 'success');
    } else {
      showMessage('❌ Error al eliminar usuario', 'error');
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    showMessage('❌ Error al eliminar usuario', 'error');
  }
}

// Cerrar modal al hacer click fuera
const userModalEl = document.getElementById('userModal');
if (userModalEl) {
  userModalEl.addEventListener('click', (e) => {
    if (e.target === userModalEl) {
      closeUserModal();
    }
  });
}

// Utilidad: escapar HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Añadir estilos CSS dinámicos
const userStyles = `
.user-avatar-small {
  flex-shrink: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1e293b;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: bold;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.modal-close:hover {
  background: #374151;
  color: #f9fafb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary, .btn-secondary, .btn-icon {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(6, 182, 212, 0.3);
}

.btn-secondary {
  background: #374151;
  color: #f9fafb;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-icon {
  background: #374151;
  color: #f9fafb;
  padding: 6px 12px;
  font-size: 16px;
}

.btn-icon:hover {
  background: #4b5563;
}

.users-section {
  background: #111827;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: bold;
}

.count-badge {
  background: #374151;
  color: #9ca3af;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.users-table table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #374151;
}

.users-table th {
  color: #9ca3af;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
}

.users-table tr:hover {
  background: #1f2937;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #9ca3af;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 16px;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  color: #f9fafb;
  font-size: 14px;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #06b6d4;
}

.form-group label input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status.active {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.status.inactive {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
}

.status.admin {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.status.operator {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.status.viewer {
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
}
`;

// Agregar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = userStyles;
document.head.appendChild(styleSheet);
