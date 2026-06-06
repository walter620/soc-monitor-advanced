// Estado global
let reports = [];
let filteredReports = [];

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  await loadReports();
  setupEventListeners();
});

// Cargar reportes
async function loadReports() {
  try {
    reports = await mockAPI.getReports();
    filteredReports = [...reports];
    renderReports();
  } catch (error) {
    console.error('Error al cargar reportes:', error);
    showMessage('Error al cargar reportes', 'error');
  }
}

// Renderizar tabla de reportes
function renderReports() {
  const tableBody = document.getElementById('reportsTableBody');
  const countBadge = document.getElementById('reportsCount');
  
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  if (filteredReports.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: #9ca3af;">
          No se encontraron reportes
        </td>
      </tr>
    `;
    if (countBadge) countBadge.textContent = '0 reportes';
    return;
  }
  
  filteredReports.forEach(report => {
    const row = createReportRow(report);
    tableBody.appendChild(row);
  });
  
  if (countBadge) {
    countBadge.textContent = `${filteredReports.length} report${filteredReports.length !== 1 ? 'es' : 'e'}`;
  }
}

// Crear fila de reporte
function createReportRow(report) {
  const row = document.createElement('tr');
  
  const severityClass = report.severity || 'unknown';
  const statusClass = report.status || 'pending';
  
  row.innerHTML = `
    <td>#${report.id}</td>
    <td>
      <div class="report-title">${escapeHtml(report.title || report.description || 'Sin título')}</div>
      ${report.description ? `<div class="report-description">${escapeHtml(report.description.substring(0, 50))}...</div>` : ''}
    </td>
    <td><span class="severity ${severityClass}">${getSeverityLabel(report.severity)}</span></td>
    <td><span class="status ${statusClass}">${getStatusLabel(report.status)}</span></td>
    <td>${formatDate(report.date || report.created_at)}</td>
    <td class="actions-cell">
      <button class="btn-icon" onclick="editReport(${report.id})" title="Editar">✏️</button>
      <button class="btn-icon" onclick="deleteReport(${report.id})" title="Eliminar">🗑️</button>
    </td>
  `;
  
  return row;
}

// Filtrar reportes
function filterReports() {
  const search = document.getElementById('searchFilter')?.value.toLowerCase() || '';
  const severity = document.getElementById('severityFilter')?.value || '';
  const status = document.getElementById('statusFilter')?.value || '';
  const date = document.getElementById('dateFilter')?.value || '';
  
  filteredReports = reports.filter(report => {
    const matchesSearch = !search || 
      (report.title?.toLowerCase().includes(search)) ||
      (report.description?.toLowerCase().includes(search));
    
    const matchesSeverity = !severity || report.severity === severity;
    const matchesStatus = !status || report.status === status;
    const matchesDate = !date || formatDate(report.date || report.created_at) === date;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesDate;
  });
  
  renderReports();
}

// Crear nuevo reporte
async function createReport(event) {
  event.preventDefault();
  
  const title = document.getElementById('reportTitle').value;
  const description = document.getElementById('reportDescription').value;
  const severity = document.getElementById('reportSeverity').value;
  const status = document.getElementById('reportStatus').value;
  const reportDate = document.getElementById('reportDate').value || new Date().toISOString().split('T')[0];
  
  const newReport = {
    title,
    description,
    severity,
    status,
    date: reportDate,
    created_at: new Date().toISOString()
  };
  
  try {
    const result = await mockAPI.createReport(newReport);
    
    if (result.success) {
      // Agregar a la lista
      reports.unshift(result.report);
      filteredReports = [...reports];
      
      // Reiniciar formulario
      document.getElementById('newReportForm').reset();
      
      // Cerrar modal
      closeNewReportModal();
      
      // Renderizar
      renderReports();
      
      // Mostrar mensaje
      showMessage('✅ Reporte creado exitosamente', 'success');
      
    } else {
      showMessage('❌ Error al crear reporte', 'error');
    }
  } catch (error) {
    console.error('Error al crear reporte:', error);
    showMessage('❌ Error al crear reporte', 'error');
  }
}

// Editar reporte
async function editReport(id) {
  const report = reports.find(r => r.id === id);
  if (!report) {
    showMessage('Reporte no encontrado', 'error');
    return;
  }
  
  // Mostrar modal de edición (reutilizar modal existente)
  showNewReportModal();
  
  // Cambiar título del modal
  const modalHeader = document.querySelector('#newReportModal .modal-header h3');
  if (modalHeader) modalHeader.textContent = 'Editar Reporte';
  
  // Llenar formulario
  document.getElementById('reportTitle').value = report.title || '';
  document.getElementById('reportDescription').value = report.description || '';
  document.getElementById('reportSeverity').value = report.severity || '';
  document.getElementById('reportStatus').value = report.status || '';
  document.getElementById('reportDate').value = formatDate(report.date || report.created_at);
  
  // Cambiar botón de submit
  const submitBtn = document.querySelector('#newReportForm button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = 'Guardar Cambios';
    submitBtn.onclick = async () => await saveEditReport(id);
  }
}

// Guardar edición de reporte
async function saveEditReport(id) {
  const title = document.getElementById('reportTitle').value;
  const description = document.getElementById('reportDescription').value;
  const severity = document.getElementById('reportSeverity').value;
  const status = document.getElementById('reportStatus').value;
  const reportDate = document.getElementById('reportDate').value;
  
  const updateData = {
    title,
    description,
    severity,
    status,
    date: reportDate
  };
  
  try {
    const result = await mockAPI.updateReport(id, updateData);
    
    if (result.success) {
      // Actualizar en la lista
      const index = reports.findIndex(r => r.id === id);
      if (index !== -1) {
        reports[index] = { ...reports[index], ...updateData };
      }
      
      // Actualizar filtered
      filteredReports = [...reports];
      
      // Resetear modal
      resetEditModal();
      
      // Renderizar
      renderReports();
      
      // Mostrar mensaje
      showMessage('✅ Reporte actualizado exitosamente', 'success');
    } else {
      showMessage('❌ Error al actualizar reporte', 'error');
    }
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    showMessage('❌ Error al actualizar reporte', 'error');
  }
}

// Resetear modal de edición
function resetEditModal() {
  const modalHeader = document.querySelector('#newReportModal .modal-header h3');
  const submitBtn = document.querySelector('#newReportForm button[type="submit"]');
  
  if (modalHeader) modalHeader.textContent = 'Crear Nuevo Reporte';
  if (submitBtn) {
    submitBtn.textContent = 'Crear Reporte';
    submitBtn.onclick = createReport;
  }
}

// Eliminar reporte
async function deleteReport(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
    return;
  }
  
  try {
    const result = await mockAPI.deleteUser(id); // Reutilizando mock para demo
    
    if (result.success) {
      // Eliminar de la lista
      reports = reports.filter(r => r.id !== id);
      filteredReports = [...reports];
      
      // Renderizar
      renderReports();
      
      // Mostrar mensaje
      showMessage('✅ Reporte eliminado exitosamente', 'success');
    } else {
      showMessage('❌ Error al eliminar reporte', 'error');
    }
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    showMessage('❌ Error al eliminar reporte', 'error');
  }
}

// Mostrar modal de nuevo reporte
function showNewReportModal() {
  const modal = document.getElementById('newReportModal');
  if (modal) modal.style.display = 'flex';
  
  resetEditModal();
}

// Cerrar modal de nuevo reporte
function closeNewReportModal() {
  const modal = document.getElementById('newReportModal');
  if (modal) modal.style.display = 'none';
  
  document.getElementById('newReportForm').reset();
  resetEditModal();
}

// Configurar event listeners
function setupEventListeners() {
  // Cerrar modal al hacer click fuera
  document.getElementById('newReportModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'newReportModal') {
      closeNewReportModal();
    }
  });
}

// Utilidad: escapar HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Obtener etiquetas de severidad
function getSeverityLabel(severity) {
  const labels = {
    critical: 'Crítica',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
    unknown: 'Desconocida'
  };
  return labels[severity] || labels.unknown;
}

// Obtener etiquetas de estado
function getStatusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    processing: 'Procesando',
    completed: 'Completado',
    cancelled: 'Cancelado',
    unknown: 'Desconocido'
  };
  return labels[status] || labels.unknown;
}

// Añadir estilos CSS dinámicos
const modalStyles = `
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
  max-width: 600px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

.filters-section {
  background: #111827;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
}

.filter-group input,
.filter-group select {
  padding: 10px 16px;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  color: #f9fafb;
  font-size: 14px;
  outline: none;
}

.filter-group input:focus,
.filter-group select:focus {
  border-color: #06b6d4;
}

.reports-section {
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

.reports-table table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table th,
.reports-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #374151;
}

.reports-table th {
  color: #9ca3af;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
}

.reports-table tr:hover {
  background: #1f2937;
}

.report-title {
  font-weight: 600;
  color: #f9fafb;
  margin-bottom: 4px;
}

.report-description {
  color: #9ca3af;
  font-size: 13px;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
`;

// Agregar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);
