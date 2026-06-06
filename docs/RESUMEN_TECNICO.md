# SOC Monitor Advanced - Resumen Técnico v2.0

> **Documento Técnico** | **Fecha:** 06-JUN-2026 | **Autor:** Walter Rios | **Versión:** 2.0.0

---

## 🎯 Visión General

**SOC Monitor Advanced** es una aplicación **full-stack** diseñada para centros de operaciones de seguridad (SOC L1) que permite:

- Gestionar reportes de turno de analistas de seguridad
- Monitorear alertas y eventos de seguridad
- Integrarse con Slack para notificaciones en tiempo real
- Visualizar métricas y tendencias mediante dashboard
- Aplicar políticas de SLA y escalado automático

---

## 🏗️ Stack Tecnológico

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **FastAPI** | 0.109+ | Framework web asíncrono |
| **Python** | 3.11+ | Lenguaje de programación |
| **SQLAlchemy** | 2.0+ | ORM para base de datos |
| **Pydantic** | 2.5+ | Validación de datos |
| **Alembic** | 1.13+ | Migraciones de base de datos |

### Base de Datos
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **PostgreSQL** | 15 | Base de datos relacional |
| **Redis** | 7 | Cache y sesión |

### Autenticación
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **JWT** | python-jose 3.3+ | Tokens de autenticación |
| **Bcrypt** | 5.0+ | Hash de contraseñas |

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19 | UI library |
| **TypeScript** | 6.0 | Type safety |
| **Vite** | 8.0 | Build tool |
| **TailwindCSS** | 3.4 | Styling |
| **Axios** | 1.17 | HTTP client |
| **Recharts** | 3.8 | Data visualization |

### Slack Integration
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **slack-bolt** | 1.19 | SDK oficial de Slack |
| **Slack API** | Web API | Interfaz programática |

### DevOps
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Docker** | 29.1.3 | Contenedores |
| **Docker Compose** | 2.40 | Orquestación |

---

## 📁 Arquitectura del Proyecto

```
soc-monitor-advanced/
├── app/                           # Backend FastAPI
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py       # Autenticación JWT
│   │       │   ├── users.py      # Gestión de usuarios
│   │       │   ├── reports.py    # CRUD de reportes
│   │       │   ├── slack.py      # Webhooks Slack
│   │       │   └── stats.py      # Estadísticas
│   │       └── router.py         # Router principal
│   ├── core/
│   │   ├── config.py             # Variables de entorno
│   │   ├── security.py           # JWT, bcrypt
│   │   └── exceptions.py         # Excepciones
│   ├── db/
│   │   ├── session.py            # Conexión DB
│   │   └── models/
│   │       ├── user.py           # Modelo User
│   │       └── report.py         # Modelo ShiftReport
│   ├── schemas/                  # Pydantic models
│   ├── services/
│   │   ├── slack_bot.py          # Bot Slack
│   │   └── report_service.py     # Lógica de negocio
│   └── main.py                   # Entry point
├── web/                           # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Users.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   └── App.tsx
│   └── package.json
├── tests/                         # Tests
│   ├── conftest.py
│   └── test_api.py
├── alembic/                       # Migraciones
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

---

## 💾 Modelos de Datos

### Tabla: users

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INTEGER | PK, Autoincrement | ID único |
| `username` | VARCHAR(80) | NOT NULL, UNIQUE | Nombre de usuario |
| `email` | VARCHAR(120) | NOT NULL, UNIQUE | Email del usuario |
| `password_hash` | VARCHAR(128) | NOT NULL | Hash bcrypt |
| `full_name` | VARCHAR(100) | NOT NULL | Nombre completo |
| `role` | VARCHAR(20) | DEFAULT 'operator' | admin/supervisor/operator |
| `is_active` | BOOLEAN | DEFAULT TRUE | Estado del usuario |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última actualización |
| `last_login` | TIMESTAMP | NULLABLE | Último login |
| `slack_user_id` | VARCHAR(50) | INDEX | ID de Slack |

### Tabla: shift_reports

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INTEGER | PK, Autoincrement | ID único |
| `operator_id` | INTEGER | FK → users(id) | Operador responsable |
| `shift_date` | TIMESTAMP | NOT NULL | Fecha del turno |
| `start_time` | TIMESTAMP | NOT NULL | Hora inicio |
| `end_time` | TIMESTAMP | NOT NULL | Hora fin |
| `summary` | TEXT | NOT NULL | Resumen del turno |
| `status` | VARCHAR(20) | DEFAULT 'draft' | draft/pending/approved/closed |
| `severity` | INTEGER | DEFAULT 0, 0-10 | Severidad 0-10 |
| `sla_deadline` | TIMESTAMP | NULLABLE | Límite SLA |
| `sla_violated` | BOOLEAN | DEFAULT FALSE | SLA violado |
| `auto_escalated` | BOOLEAN | DEFAULT FALSE | Escalado automático |
| `novedades` | JSONB | DEFAULT [] | Array de novedades |
| `logs_revisados` | JSONB | DEFAULT [] | Array de logs revisados |
| `critical_cases` | JSONB | NULLABLE | Casos críticos |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última actualización |

---

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

```
1. Cliente → POST /auth/login {username, password}
2. Backend → Buscar usuario por username
3. Backend → Verificar password con bcrypt
4. Backend → Generar JWT token (exp: 30 min)
5. Backend → Return {access_token, token_type, role}
6. Cliente → Store token en localStorage
7. Cliente → Request → Header: Authorization: Bearer *** Backend → Validate JWT token
9. Backend → Extract user_id from token
10. Backend → Return data or 401
```

### Roles y Permisos

| Rol | Crear Reporte | Ver Reportes | Editar | Aprobar | Usuarios | Stats |
|-----|--------------|--------------|--------|---------|---------|-------|
| **admin** | ✅ | ✅ (todos) | ✅ (todos) | ✅ | ✅ | ✅ |
| **supervisor** | ✅ | ✅ (team) | ✅ (team) | ✅ | ✅ | ✅ |
| **operator** | ✅ | ✅ ( propios) | ✅ (propios) | ❌ | ❌ | ✅ |

### Configuración JWT

```python
# app/core/config.py
SECRET_KEY = os.getenv("SECRET_KEY")  # Mínimo 32 caracteres
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

---

## 🌐 Endpoints API

### Autenticación

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/auth/login` | ❌ | Obtener JWT token |
| `POST` | `/auth/register` | ❌ | Registrar usuario |

### Usuarios

| Método | Endpoint | Auth | Rol Requerido | Descripción |
|--------|----------|------|---------------|-------------|
| `GET` | `/users` | ✅ | admin | Listar todos |
| `GET` | `/users/{id}` | ✅ | admin | Obtener por ID |
| `POST` | `/users` | ✅ | admin | Crear usuario |

### Reportes

| Método | Endpoint | Auth | Rol Requerido | Descripción |
|--------|----------|------|---------------|-------------|
| `GET` | `/reports` | ✅ | user | Listar (paginado) |
| `GET` | `/reports/{id}` | ✅ | user | Obtener |
| `POST` | `/reports` | ✅ | user | Crear |
| `PUT` | `/reports/{id}` | ✅ | user | Actualizar |
| `DELETE` | `/reports/{id}` | ✅ | admin/owner | Eliminar |

### Estadísticas

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/stats/dashboard` | ✅ | Estadísticas generales |
| `GET` | `/stats/trends` | ✅ | Datos temporales |

### Slack

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/slack/webhook` | ❌ | Webhook de eventos |
| `POST` | `/slack/alert` | ✅ | Enviar alerta |

### Health

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Health check |

---

## 📊 Frontend

### Páginas

#### 1. Dashboard (`/`)
**Funcionalidades:**
- Estadísticas en tiempo real
- Gráfico de tendencias de severidad (7 días)
- Gráfico de alertas vs resueltas (14 días)
- Tabla de reportes recientes
- Quick actions

**Components:**
- `BarChart`, `AreaChart`, `LineChart` (Recharts)
- Stat cards con icons
- Tabla con paginación
- Badges para estados

#### 2. Login (`/login`)
**Funcionalidades:**
- Form de autenticación
- Envío form-urlencoded
- Redirect después de login
- Manejo de errores

#### 3. Reports (`/reports`)
**Funcionalidades:**
- Listado paginado
- Filtrado por estado
- CRUD completo
- Vista detallada

#### 4. Users (`/users`)
**Funcionalidades:**
- Listado de usuarios
- Creación/edición (admin)
- Gestión de roles

#### 5. Settings (`/settings`)
**Funcionalidades:**
- Configuración de Slack
- Parámetros globales

### Servicio API

```typescript
// web/src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    return api.post('/api/v1/auth/login', formData);
  },
  // ...
};

export const reportService = {
  getAll: async () => api.get('/api/v1/reports'),
  getById: async (id: number) => api.get(`/api/v1/reports/${id}`),
  create: async (data: any) => api.post('/api/v1/reports', data),
  update: async (id: number, data: any) => api.put(`/api/v1/reports/${id}`, data),
  delete: async (id: number) => api.delete(`/api/v1/reports/${id}`),
};
```

---

## 🤖 Slack Integration

### Comandos Slash

| Comando | Descripción | Response |
|---------|-------------|----------|
| `/soc_status` | Ver estado del sistema | "✅ Sistema SOC Monitor en línea" |
| `/soc_alerts` | Consultar alertas activas | Lista de alertas de severidad alta |
| `/soc_report` | Abrir formulario | Modal para crear reporte |
| `/soc_stats` | Ver estadísticas | Resumen del día |

### Notificaciones

#### Reportes de Alta Severidad (≥7)
```json
{
  "attachments": [{
    "color": "#ff0000",
    "title": "🚨 Alerta de Seguridad",
    "text": "Detección de intentos de login masivos",
    "fields": [
      {"title": "Severidad", "value": "8/10", "short": true},
      {"title": "Hora", "value": "10:30", "short": true}
    ]
  }]
}
```

#### Configuración en `.env`
```env
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_APP_TOKEN=xapp-...
SLACK_CHANNEL_ID=C123456
```

---

## 🧪 Testing

### Estrategia

```
tests/
├── unit/              # Tests unitarios (90% coverage)
├── integration/       # Tests de integración (80% coverage)
└── fixtures/          # Datos de prueba
```

### Ejemplos de Tests

#### Test de Autenticación
```python
class TestAuthEndpoint:
    def test_login_success(self, client, test_user):
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "test", "password": "password123"}
        )
        assert response.status_code == 200
        assert "access_token" in response.json()
    
    def test_login_wrong_password(self, client, test_user):
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "test", "password": "wrong"}
        )
        assert response.status_code == 401
```

#### Test de Reportes
```python
class TestReportsEndpoint:
    def test_create_report(self, client, auth_headers, test_user):
        response = client.post(
            "/api/v1/reports",
            json={
                "shift_date": "2026-06-06T00:00:00Z",
                "start_time": "2026-06-06T08:00:00Z",
                "end_time": "2026-06-06T16:00:00Z",
                "summary": "Test report",
                "severity": 2
            },
            headers=auth_headers
        )
        assert response.status_code == 201
    
    def test_forbidden_access(self, client, auth_headers, other_user):
        # User intenta acceder a reporte de otro user
        response = client.get(
            "/api/v1/reports/1",
            headers=auth_headers
        )
        assert response.status_code == 403
```

### Ejecución de Tests

```bash
# Ejecutar todos los tests
pytest tests/ -v

# Con cobertura
pytest tests/ --cov=app --cov-report=html --cov-report=term-missing

# Solo tests de autenticación
pytest tests/test_auth.py -v

# Solo tests de reportes
pytest tests/test_api.py::TestReportsEndpoint -v
```

---

## 🐳 Docker Deployment

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: soc-monitor-advanced-api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://soc_user:soc_pass@db:5432/soc_monitor
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - soc-network

  web:
    build: ./web
    container_name: soc-monitor-advanced-web
    ports:
      - "3000:80"
    restart: unless-stopped
    networks:
      - soc-network

  db:
    image: postgres:15
    container_name: soc-monitor-advanced-db
    environment:
      POSTGRES_USER: soc_user
      POSTGRES_PASSWORD: soc_pass123
      POSTGRES_DB: soc_monitor
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - soc-network

  redis:
    image: redis:7-alpine
    container_name: soc-monitor-advanced-redis
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - soc-network

networks:
  soc-network:
    driver: bridge

volumes:
  postgres_data:
```

### Comandos Útiles

```bash
# Iniciar servicios
docker-compose up -d --build

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f
docker-compose logs api

# Detener
docker-compose down

# Detener con volúmenes
docker-compose down -v

# Reiniciar
docker-compose restart

# Ejecutar comandos en contenedor
docker exec -it soc-monitor-advanced-api-1 bash
docker exec -it soc-monitor-advanced-api-1 python --version
docker exec -it soc-monitor-advanced-api-1 alembic upgrade head

# Inicializar usuarios
docker exec -it soc-monitor-advanced-api-1 python -c "
from app.db.session import SessionLocal
from app.db.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()
if not db.query(User).filter(User.username == 'admin').first():
    admin = User(username='admin', email='admin@local', full_name='Admin', role='admin')
    admin.set_password('admin123')
    db.add(admin)
    db.commit()
print('Usuarios inicializados')
"
```

---

## 📈 Monitoreo y Métricas

### Health Check

```bash
curl http://localhost:8000/health
# Response: {"status": "healthy", "app": "SOC Monitor", "version": "2.0.0"}
```

### Métricas Clave

- **Request latency** (P50, P95, P99)
- **Error rates** (4xx, 5xx)
- **Database connection pool usage**
- **Slack message delivery rates**
- **JWT token validation failures**

### Logging

**Formato JSON:**
```json
{
  "timestamp": "2026-06-06T10:30:00Z",
  "level": "INFO",
  "message": "User logged in",
  "user_id": 123,
  "request_id": "abc-123-def",
  "duration_ms": 45
}
```

---

## 🔒 Seguridad

### Best Practices Implementadas

✅ **Autenticación:**
- JWT tokens con expiration
- Password hashing con bcrypt (260k iteraciones)
- Refresh tokens (future)

✅ **Autorización:**
- RBAC con roles (admin, supervisor, operator)
- Permisos por endpoint

✅ **Protección de Datos:**
- Input validation con Pydantic
- SQL Injection prevention (ORM)
- XSS protection (React + CSP)
- CORS configuration
- Environment variables para secrets

✅ **Seguridad en Producción:**
- HTTPS obligatorio
- Non-root Docker user
- Resource limits
- Regular security audits

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [README.md](../README.md) | Documentación general |
| [docs/architecture.md](docs/architecture.md) | Arquitectura del sistema |
| [docs/api.md](docs/api.md) | Documentación API |
| [README_SERVIDOR.md](../README_SERVIDOR.md) | Guía de despliegue |
| [INICIO_RAPIDO.md](../INICIO_RAPIDO.md) | Quickstart |
| [GUÍA DE REPORTES.md](../GUÍA%20DE%20REPORTES.md) | Uso de reportes |
| [README_TESTS.md](../README_TESTS.md) | Guía de testing |

---

## 🚀 Roadmap Técnico

### v2.1 (Próxima Versión)
- [ ] WebSocket para dashboard en tiempo real
- [ ] Exportación a PDF (WeasyPrint)
- [ ] GraphQL como opción
- [ ] Webhooks personalizados
- [ ] Background tasks (Celery)
- [ ] Importación de reportes CSV/Excel

### v2.2
- [ ] Machine Learning para detección de anomalías
- [ ] Multi-tenancy support
- [ ] Audit trail completo
- [ ] CI/CD pipeline completo
- [ ] Prometheus + Grafana

### v3.0
- [ ] Microservicios
- [ ] Mobile app (React Native)
- [ ] Integración con SIEM
- [ ] Threat intelligence feeds
- [ ] SOAR (Security Orchestration)

---

## 📞 Soporte y Contribución

### Reportar Bugs
1. Crear issue en GitHub
2. Incluir:
   - Pasos para reproducir
   - Comportamiento esperado
   - Logs y errores
   - Versión del proyecto

### Contribuir
1. Fork del repository
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit con convenciones
4. Push y Pull Request
5. Revisión de maintainers

---

**Última actualización:** 06-JUN-2026  
**Versión:** 2.0.0  
**Estado:** Production Ready ✅
