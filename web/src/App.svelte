<svelte:options hydrateMeta={true} />
<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { toast } from 'svelte-french-toast';
  
  export let children;
  
  onMount(() => {
    if (browser) {
      console.log('SOC Monitor Web initialized');
    }
  });
</script>

<svelte:head>
  <title>SOC Monitor Advanced</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="app-container">
  <nav class="navbar">
    <div class="nav-brand">
      <h2>🛡️ SOC Monitor</h2>
    </div>
    <div class="nav-links">
      <a href="/">Dashboard</a>
      <a href="/reports">Reportes</a>
      <a href="/stats">Estadísticas</a>
    </div>
  </nav>
  
  <main class="main-content">
    {@render children()}
  </main>
  
  <footer class="footer">
    <p>© 2026 SOC Monitor Advanced - v2.0.0</p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #f5f7fa;
  }
  
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .navbar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .nav-brand h2 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
  }
  
  .nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }
  
  .nav-links a:hover {
    opacity: 0.8;
  }
  
  .main-content {
    flex: 1;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }
  
  .footer {
    background: #2d3748;
    color: white;
    text-align: center;
    padding: 1rem;
    margin-top: auto;
  }
</style>
