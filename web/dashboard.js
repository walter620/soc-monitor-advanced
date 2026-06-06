// Dashboard específico

document.addEventListener('DOMContentLoaded', () => {
  updateDashboardStats();
  loadRecentAlerts();
});

// Actualizar estadísticas del dashboard
async function updateDashboardStats() {
  try {
    // Aquí podrías cargar datos reales de la API
    // Por ahora, usamos datos simulados
    
    const stats = {
      totalReports: 45,
      pending: 3,
      completed: 42,
      severity: 3.2
    };
    
    // Actualizar elementos del DOM
    updateStatElement('.stat-value', stats);
    updateChangeElements();
    
  } catch (error) {
    console.error('Error al actualizar estadísticas:', error);
  }
}

// Actualizar elementos de estadística
function updateStatElement(selector, stats) {
  const elements = document.querySelectorAll(selector);
  
  if (elements.length >= 1) elements[0].textContent = stats.totalReports;
  if (elements.length >= 2) elements[1].textContent = stats.pending;
  if (elements.length >= 3) elements[2].textContent = stats.completed;
  if (elements.length >= 4) elements[3].textContent = stats.severity + ' / 5';
}

// Actualizar elementos de cambio
function updateChangeElements() {
  const changeElements = document.querySelectorAll('.stat-change');
  
  if (changeElements.length >= 1) {
    changeElements[0].textContent = '↑ +12.5% vs mes pasado';
    changeElements[0].classList.add('positive');
  }
  
  if (changeElements.length >= 2) {
    changeElements[1].textContent = 'Requieren atención inmediata';
    changeElements[1].classList.remove('positive');
  }
  
  if (changeElements.length >= 3) {
    changeElements[2].textContent = '↑ +8.2% vs mes pasado';
    changeElements[2].classList.add('positive');
  }
  
  if (changeElements.length >= 4) {
    changeElements[3].textContent = 'Nivel medio de alertas';
    changeElements[3].classList.remove('positive');
  }
}

// Cargar alertas recientes
async function loadRecentAlerts() {
  try {
    // Cargar de mockAPI
    const reports = await mockAPI.getReports({ limit: 4 });
    
    const tableBody = document.querySelector('.alerts-table tbody');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    reports.forEach(report => {
      const row = createAlertRow(report);
      tableBody.appendChild(row);
    });
    
  } catch (error) {
    console.error('Error al cargar alertas:', error);
  }
}

// Crear fila de alerta
function createAlertRow(report) {
  const row = document.createElement('tr');
  
  const severityClass = report.severity || 'unknown';
  const statusClass = report.status || 'pending';
  
  row.innerHTML = `
    <td>#${report.id}</td>
    <td>${report.title || 'Sin título'}</td>
    <td><span class="severity ${severityClass}">${getSeverityLabel(report.severity)}</span></td>
    <td><span class="status ${statusClass}">${getStatusLabel(report.status)}</span></td>
    <td>${formatDate(report.date)}</td>
  `;
  
  return row;
}

// Obtener etiqueta de severidad
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

// Obtener etiqueta de estado
function getStatusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    processing: 'Procesando',
    completed: 'Resuelto',
    cancelled: 'Cancelado',
    unknown: 'Desconocido'
  };
  return labels[status] || labels.unknown;
}

// Agregar evento de click a las action cards
document.addEventListener('DOMContentLoaded', () => {
  const actionCards = document.querySelectorAll('.action-card');
  
  actionCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Animación de click
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
    });
  });
});

// Actualizar dashboard cada X minutos
setInterval(() => {
  console.log('Actualizando dashboard...');
  updateDashboardStats();
  loadRecentAlerts();
}, 300000); // 5 minutos
