<script lang="ts">
  import App from '../App.svelte';
</script>

<App>
  <div class="welcome-page">
    <h1>🛡️ Bienvenido a SOC Monitor</h1>
    <p>Plataforma de monitoreo y gestión de incidentes de seguridad</p>
    
    <div class="features">
      <div class="feature-card">
        <h3>📊 Dashboard</h3>
        <p>Visualización en tiempo real de métricas de seguridad</p>
      </div>
      
      <div class="feature-card">
        <h3>📝 Reportes</h3>
        <p>Gestión y seguimiento de incidentes de seguridad</p>
      </div>
      
      <div class="feature-card">
        <h3>🔔 Notificaciones</h3>
        <p>Integración con Slack para alertas en tiempo real</p>
      </div>
      
      <div class="feature-card">
        <h3>📈 Estadísticas</h3>
        <p>Análisis de datos y reportes históricos</p>
      </div>
    </div>
    
    <div class="cta-section">
      <p>Próximamente: Autenticación, creación de reportes y más funcionalidades</p>
    </div>
  </div>
</App>

<style>
  .welcome-page {
    text-align: center;
    padding: 3rem 2rem;
  }
  
  h1 {
    color: #667eea;
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #4a5568;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
  }
  
  .feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.15);
  }
  
  .feature-card h3 {
    color: #667eea;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
  
  .feature-card p {
    font-size: 0.95rem;
    margin: 0;
  }
  
  .cta-section {
    margin-top: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
  }
  
  .cta-section p {
    color: white;
    font-size: 1.1rem;
  }
</style>
