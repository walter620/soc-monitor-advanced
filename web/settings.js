// Configuración de configuración

// Guardar configuración
function saveSettings(section) {
  const settings = {
    general: {
      appName: document.getElementById('appName')?.value,
      version: document.getElementById('appVersion')?.value,
      language: document.getElementById('language')?.value,
      timezone: document.getElementById('timezone')?.value
    },
    security: {
      sessionTimeout: document.getElementById('sessionTimeout')?.value,
      passwordPolicy: document.getElementById('passwordPolicy')?.value,
      require2fa: document.getElementById('require2fa')?.checked,
      lockoutPolicy: document.getElementById('lockoutPolicy')?.checked
    },
    notification: {
      emailNotifications: document.getElementById('emailNotifications')?.checked,
      slackNotifications: document.getElementById('slackNotifications')?.checked,
      smsNotifications: document.getElementById('smsNotifications')?.checked,
      alertSeverity: document.getElementById('alertSeverity')?.value
    },
    system: {
      dataRetention: document.getElementById('dataRetention')?.value,
      backupFrequency: document.getElementById('backupFrequency')?.value,
      logLevel: document.getElementById('logLevel')?.value,
      autoUpdate: document.getElementById('autoUpdate')?.checked
    }
  };
  
  // Guardar en localStorage
  localStorage.setItem('socSettings', JSON.stringify(settings));
  
  showMessage(`✅ Configuración de ${section} guardada exitosamente`, 'success');
  
  console.log('Configuración guardada:', settings[section]);
}

// Cargar configuración
async function loadSettings() {
  const savedSettings = localStorage.getItem('socSettings');
  
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    
    // Restaurar valores
    if (settings.general) {
      const languageEl = document.getElementById('language');
      const timezoneEl = document.getElementById('timezone');
      if (languageEl) languageEl.value = settings.general.language || 'es';
      if (timezoneEl) timezoneEl.value = settings.general.timezone || 'America/Argentina/Buenos_Aires';
    }
    
    if (settings.security) {
      const sessionTimeoutEl = document.getElementById('sessionTimeout');
      const passwordPolicyEl = document.getElementById('passwordPolicy');
      const require2faEl = document.getElementById('require2fa');
      const lockoutPolicyEl = document.getElementById('lockoutPolicy');
      if (sessionTimeoutEl) sessionTimeoutEl.value = settings.security.sessionTimeout || 30;
      if (passwordPolicyEl) passwordPolicyEl.value = settings.security.passwordPolicy || 'medium';
      if (require2faEl) require2faEl.checked = settings.security.require2fa !== false;
      if (lockoutPolicyEl) lockoutPolicyEl.checked = settings.security.lockoutPolicy !== false;
    }
    
    if (settings.notification) {
      const emailEl = document.getElementById('emailNotifications');
      const slackEl = document.getElementById('slackNotifications');
      const smsEl = document.getElementById('smsNotifications');
      const alertSeverityEl = document.getElementById('alertSeverity');
      if (emailEl) emailEl.checked = settings.notification.emailNotifications !== false;
      if (slackEl) slackEl.checked = settings.notification.slackNotifications || false;
      if (smsEl) smsEl.checked = settings.notification.smsNotifications || false;
      if (alertSeverityEl) alertSeverityEl.value = settings.notification.alertSeverity || 'all';
    }
    
    if (settings.system) {
      const dataRetentionEl = document.getElementById('dataRetention');
      const backupFreqEl = document.getElementById('backupFrequency');
      const logLevelEl = document.getElementById('logLevel');
      const autoUpdateEl = document.getElementById('autoUpdate');
      if (dataRetentionEl) dataRetentionEl.value = settings.system.dataRetention || 90;
      if (backupFreqEl) backupFreqEl.value = settings.system.backupFrequency || 'daily';
      if (logLevelEl) logLevelEl.value = settings.system.logLevel || 'info';
      if (autoUpdateEl) autoUpdateEl.checked = settings.system.autoUpdate !== false;
    }
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
});

// Añadir estilos CSS
const settingsStyles = `
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.settings-card {
  background: #111827;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 24px;
}

.settings-card h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #374151;
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

.form-group input[type="text"],
.form-group input[type="number"],
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

.btn-primary {
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(6, 182, 212, 0.3);
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
`;

// Agregar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = settingsStyles;
document.head.appendChild(styleSheet);
