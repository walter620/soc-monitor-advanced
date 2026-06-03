# SOC Monitor Advanced - Frontend Setup Guide

## 🚀 Instalación Rápida

### Opción 1: Desarrollo Local (Recomendado)

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd soc-monitor-advanced

# 2. Crear branch frontend (si no estás en él)
git checkout -b frontend

# 3. Instalar dependencias del backend
pip install -r requirements.txt

# 4. Instalar dependencias del frontend
cd web
npm install

# 5. Configurar variables de entorno
cp ../.env.example ../.env
# Editar .env con tus credenciales

# 6. Iniciar servicios
cd ..
docker-compose up -d db redis

# 7. Ejecutar backend
pip install -e .
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 8. Ejecutar frontend (en otro terminal)
cd web
npm run dev
```

### Opción 2: Docker Compose (Producción)

```bash
# 1. Inicializar todo con Docker
docker-compose up -d --build

# 2. Verificar servicios
docker-compose ps

# 3. Acceder a aplicaciones
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
# Redis Commander: http://localhost:8081
```

## 📋 Requisitos del Sistema

### Backend (Python)
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (opcional)

### Frontend (Node.js)
- Node.js 18+
- npm 9+ o yarn 1.22+

## 🔧 Comandos Útiles

### Frontend (SvelteKit)

```bash
cd web

# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run dev -- --host    # Accesible desde red local

# Build
npm run build           # Build para producción
npm run preview         # Previsualizar build

# Check
npm run check          # Verificar tipos con TypeScript
npm run check:watch    # Check en tiempo real

# Limpieza
npm run clean          # Limpiar directorios build
```

### Backend (FastAPI)

```bash
# Desarrollo
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Producción
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Tests
pytest tests/ -v --cov=app
```

### Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Iniciar solo frontend
docker-compose up -d web

# Iniciar solo backend
docker-compose up -d api

# Ver logs
docker-compose logs -f api
docker-compose logs -f web

# Detener todo
docker-compose down

# Detener y limpiar volumes
docker-compose down -v

# Reconstruir
docker-compose up -d --build
```

## 📁 Estructura de Directorios

```
soc-monitor-advanced/
├── app/                      # Backend (FastAPI)
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── schemas/
│   ├── services/
│   └── main.py
├── web/                      # Frontend (SvelteKit)
│   ├── src/
│   │   ├── lib/
│   │   │   └── components/
│   │   ├── routes/
│   │   ├── stores/
│   │   ├── services/
│   │   └── App.svelte
│   ├── static/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── alembic/
├── tests/
├── docs/
├── docker-compose.yml
├── .env
└── README.md
```

## 🎯 Integración Backend-Frontend

### Configuración del Proxy

El proxy de Vite está configurado para redirigir todas las llamadas a `/api` al backend:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
});
```

### Servicio de API

```typescript
// web/src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exportar servicios
export const authService = {
  login: (username: string, password: string) => 
    api.post('/api/v1/auth/login', { username, password }),
  
  register: (userData: RegisterData) => 
    api.post('/api/v1/auth/register', userData)
};

export const reportService = {
  getAll: () => api.get('/api/v1/reports'),
  getById: (id: number) => api.get(`/api/v1/reports/${id}`),
  create: (data: CreateReportData) => api.post('/api/v1/reports', data),
  update: (id: number, data: UpdateReportData) => 
    api.put(`/api/v1/reports/${id}`, data),
  delete: (id: number) => api.delete(`/api/v1/reports/${id}`)
};
```

## 🔐 Seguridad

### Variables de Entorno

```bash
# Backend (.env)
SECRET_KEY=your-super-secret-key-min-32-chars
DATABASE_URL=postgresql://user:pass@localhost:5432/db
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
REDIS_URL=redis://localhost:6379/0

# Frontend (web/.env.local)
VITE_API_URL=http://localhost:8000
```

### JWT Authentication Flow

1. Usuario hace login → `POST /api/v1/auth/login`
2. Backend verifica credenciales y devuelve JWT
3. Frontend guarda token en localStorage
4. Frontend incluye token en headers de todas las solicitudes
5. Backend valida token con `get_current_user()`

## 🚀 Despliegue en Producción

### Build Frontend

```bash
cd web
npm run build
```

### Build Backend

```bash
docker build -t soc-monitor-api:latest .
```

### Docker Compose Production

```bash
docker-compose -f docker-compose.yml up -d --build
```

## 🧪 Testing

### Frontend

```bash
# Install testing dependencies
npm install -D @testing-library/svelte vitest

# Run tests
npm run test
```

### Backend

```bash
# Run all tests
pytest tests/ -v --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v
```

## 📚 Recursos

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 🆘 Troubleshooting

### Frontend no carga

```bash
# Verificar que npm install se ejecutó correctamente
cd web
rm -rf node_modules package-lock.json
npm install

# Verificar que el backend está corriendo
curl http://localhost:8000/health
```

### Error de CORS

```bash
# Verificar que el proxy de Vite está configurado
# En vite.config.js debe existir el proxy para /api

# Verificar que el backend tiene CORS habilitado
# app/main.py debe tener CORSMiddleware configurado
```

### Docker no inicia

```bash
# Limpiar containers anteriores
docker-compose down -v

# Reconstruir desde cero
docker-compose up -d --build --no-cache

# Ver logs
docker-compose logs
```

---

**Última actualización:** 02/06/2026  
**Autor:** Walter Rios  
**Versión:** 2.0.0
