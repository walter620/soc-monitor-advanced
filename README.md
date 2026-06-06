# SOC Monitor Advanced - Sistema de Monitoreo SOC L1 v2.0

> **Versión Mejorada con FastAPI, Slack, PostgreSQL y Docker**  
> **Autor:** Walter Rios | **Fecha:** 06-JUN-2026 | **Versión:** 2.0.0

---

## 🎯 Resumen Ejecutivo

**SOC Monitor Advanced** es un **sistema de monitoreo para centro de operaciones de seguridad (SOC L1)** diseñado para gestionar reportes de turno, alertas de seguridad e integrarse con Slack para notificaciones en tiempo real.

### Características Principales
- ✅ **FastAPI** - API moderna, asíncrona y type-safe
- ✅ **PostgreSQL** - Base de datos relacional con connection pooling
- ✅ **Redis** - Cache y sesión
- ✅ **Slack Integration** - Bots, notificaciones y comandos
- ✅ **Docker** - Contenedores seguros y escalables
- ✅ **JWT Authentication** - Autenticación segura con RBAC
- ✅ **Alembic Migrations** - Gestión de esquemas
- ✅ **Pydantic Validation** - Validación de datos
- ✅ **Test Coverage** - Tests unitarios y de integración

---

## 🚀 Características

### 📊 Gestión de Reportes
- Creación, edición y eliminación de reportes de turno
- Sistema de estados: draft, pending, approved, closed
- Calificación de severidad (0-10)
- Seguimiento de SLA con alertas automáticas
- Almacenamiento estructurado de novedades y logs

### 🔐 Autenticación y Autorización
- JWT tokens con expiration configurable
- Password hashing con bcrypt (260000 iteraciones)
- RBAC con roles: admin, supervisor, operator
- Refresh tokens para sesiones extendidas

### 📈 Dashboard y Visualización
- Gráficos de tendencias de severidad
- Alertas vs resueltas (últimos 14 días)
- Métricas en tiempo real
- Estadísticas por período

### 🤖 Integración con Slack
- Comandos slash: `/soc_status`, `/soc_alerts`, `/soc_report`, `/soc_stats`
- Notificaciones de reportes de alta severidad
- Alertas en tiempo real con attachments coloreados
- Webhooks de eventos

---

## 📋 Requisitos

### Desarrollo
- Docker & Docker Compose (recomendado)
- Python 3.11+ (para desarrollo local)
- Node.js 18+ (para frontend)
- PostgreSQL 15+
- Redis 7+

### Producción
- Docker 29+
- Docker Compose 2.4+
- Sistema operativo: Ubuntu 24.04+ / 26.04 LTS

---

## 🛠️ Instalación Rápida

### Opción 1: Docker Compose (Recomendado) ⭐

```bash
# Clonar repositorio
git clone <repository-url>
cd soc-monitor-advanced

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
# ¡IMPORTANTE! Cambia SECRET_KEY y DATABASE_URL antes de iniciar

# Iniciar servicios
docker-compose up -d --build

# Verificar que todo esté funcionando
docker-compose ps

# Acceder a la API
curl http://localhost:8000/health

# Documentación OpenAPI
open http://localhost:8000/docs

# Redis Commander (interfaz web para Redis)
open http://localhost:8081
```

**Credenciales por defecto:**
| Usuario | Contraseña |
|---------|-----------|
| admin | admin123 |
| demo | demo123 |

### Opción 2: Desarrollo Local

```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt
pip install -r requirements.dev.txt

# Configurar variables
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servicios locales (PostgreSQL y Redis)
brew services start postgresql  # macOS
brew services start redis       # macOS
# sudo systemctl start postgresql  # Linux
# sudo systemctl start redis     # Linux

# Crear base de datos
createdb soc_monitor

# Migrar base de datos
alembic upgrade head

# Ejecutar aplicación
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Opcional)

```bash
cd web
npm install
npm run dev  # http://localhost:3000
```

---

## 📁 Estructura del Proyecto

```
soc-monitor-advanced/
├── app/                        # Aplicación principal FastAPI
│   ├── api/                    # Endpoints API
│   │   └── v1/
│   │       ├── endpoints/      # Endpoints de negocio
│   │       │   ├── auth.py     # Autenticación JWT
│   │       │   ├── users.py    # Gestión de usuarios
│   │       │   ├── reports.py  # CRUD de reportes
│   │       │   ├── slack.py    # Webhooks Slack
│   │       │   └── stats.py    # Estadísticas
│   │       └── router.py       # Router principal
│   ├── core/                   # Configuración y seguridad
│   │   ├── config.py          # Variables de entorno
│   │   ├── security.py        # JWT, password hashing
│   │   └── exceptions.py      # Excepciones personalizadas
│   ├── db/                     # Base de datos
│   │   ├── session.py         # Conexión y sessions
│   │   └── models/            # Modelos SQLAlchemy
│   │       ├── user.py        # Modelo User
│   │       └── report.py      # Modelo ShiftReport
│   ├── schemas/               # Pydantic schemas
│   ├── services/              # Servicios de negocio
│   │   ├── slack_bot.py       # Bot Slack con bolt.py
│   │   └── report_service.py  # Lógica de reportes
│   ├── utils/                 # Utilidades
│   └── main.py                # Entry point FastAPI
├── web/                        # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx  # Vista principal
│   │   │   ├── Login.tsx      # Autenticación
│   │   │   ├── Reports.tsx    # Gestión de reportes
│   │   │   ├── Users.tsx      # Gestión de usuarios
│   │   │   └── Settings.tsx   # Configuración
│   │   ├── services/
│   │   │   └── api.ts         # Cliente HTTP (axios)
│   │   ├── layouts/
│   │   │   └── Layout.tsx     # Layout principal
│   │   ├── types/             # TypeScript interfaces
│   │   └── App.tsx            # App root
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
├── alembic/                    # Migraciones de base de datos
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
├── tests/                      # Tests
│   ├── conftest.py            # Configuración pytest
│   ├── test_api.py            # Tests de endpoints
│   ├── test_auth.py           # Tests de autenticación
│   └── __init__.py
├── docs/                       # Documentación
│   ├── architecture.md         # Arquitectura del sistema
│   ├── api.md                  # Documentación API
│   └── CONFIGURACION_PASO_A_PASO.md
├── .env.example               # Variables de entorno (ejemplo)
├── .env                       # Variables de entorno (local, NO commit)
├── .gitignore
├── docker-compose.yml         # Orquestación Docker
├── Dockerfile                 # Construcción de imagen API
├── requirements.txt           # Dependencias producción
├── requirements.dev.txt       # Dependencias desarrollo
├── Makefile                   # Comandos utilitarios
├── pyproject.toml             # Configuración herramientas
├── README.md                  # Este archivo
├── README_SERVIDOR.md         # Guía de despliegue en servidor
├── INICIO_RAPIDO.md           # Quickstart troubleshooting
└── GUÍA DE REPORTES.md        # Uso del módulo de reportes
```

---

## 🔑 Variables de Entorno

Copia `.env.example` a `.env` y edita los valores:

```bash
# =========================
# APLICACIÓN
# =========================
APP_NAME=SOC Monitor Advanced
APP_VERSION=2.0.0
DEBUG=false
PORT=8000

# =========================
# SEGURIDAD
# =========================
# ¡IMPORTANTE! Cambia esta clave por una segura y única (mínimo 32 caracteres)
SECRET_KEY=tu-clave-secreta-aqui-mínimo-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# =========================
# BASE DE DATOS
# =========================
# Para Docker: postgresql://soc_user:soc_pass123@db:5432/soc_monitor
# Para local: postgresql://usuario:password@localhost:5432/soc_monitor
DATABASE_URL=postgresql://soc_user:soc_pass123@localhost:5432/soc_monitor
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20

# =========================
# REDIS
# =========================
REDIS_URL=redis://localhost:6379/0

# =========================
# SLACK (OPCIONAL)
# =========================
# Deshabilitado en modo desarrollo si no se configuran
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_CHANNEL_ID=C0123456789  # Canal de notificaciones
```

---

## 🌐 API Endpoints

### Autenticación (`/api/v1/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/register` | Registrar nuevo usuario |
| `POST` | `/login` | Iniciar sesión (OAuth2 form-urlencoded) |
| `GET` | `/me` | Obtener usuario actual (requiere JWT) |

**Ejemplo de Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -d "username=admin&password=admin123"
```

### Reportes (`/api/v1/reports`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Listar reportes (paginado) |
| `GET` | `/{id}` | Obtener reporte por ID |
| `POST` | `/` | Crear nuevo reporte |
| `PUT` | `/{id}` | Actualizar reporte |
| `DELETE` | `/{id}` | Eliminar reporte |

**Crear Reporte:**
```bash
curl -X POST http://localhost:8000/api/v1/reports \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "shift_date": "2026-06-06T08:00:00",
    "start_time": "2026-06-06T08:00:00",
    "end_time": "2026-06-06T20:00:00",
    "summary": "Monitoreo de firewall sin incidentes críticos",
    "severity": 2,
    "status": "completed",
    "novedades": [],
    "logs_revisados": []
  }'
```

### Usuarios (`/api/v1/users`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Listar usuarios |
| `GET` | `/{id}` | Obtener usuario |
| `POST` | `/` | Crear usuario (admin) |

### Estadísticas (`/api/v1/stats`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/dashboard` | Estadísticas generales |
| `GET` | `/trends` | Tendencias temporales |

### Slack (`/api/v1/slack`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/webhook` | Webhook de eventos |
| `POST` | `/commands` | Slash commands |

### Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/docs` | Swagger UI |
| `GET` | `/redoc` | ReDoc |
| `GET` | `/openapi.json` | Schema OpenAPI |

---

## 🗄️ Modelos de Datos

### Modelo User
```python
class User(Base):
    id: int                # PK
    username: str          # Unique, indexed
    email: str             # Unique, indexed
    password_hash: str     # bcrypt hash
    full_name: str
    role: str              # admin, supervisor, operator
    is_active: bool
    slack_user_id: str     # Optional
    created_at: datetime
    updated_at: datetime
    last_login: datetime
```

### Modelo ShiftReport
```python
class ShiftReport(Base):
    id: int                    # PK
    operator_id: int           # FK -> User.id
    shift_date: datetime
    start_time: datetime
    end_time: datetime
    summary: str               # Text summary
    status: str                # draft, pending, approved, closed
    severity: int              # 0-10 scale
    sla_deadline: datetime     # Optional
    sla_violated: bool
    auto_escalated: bool
    approved_at: datetime      # Optional
    approved_by: int           # FK -> User.id (optional)
    resolution_time_minutes: int  # Optional
    false_positive_rate: float # Optional
    escalation_count: int      # Default 0
    tuning_suggestions: int    # Default 0
    novedades: JSON            # Array de novedades
    logs_revisados: JSON       # Array de logs revisados
    critical_cases: JSON       # Optional
    created_at: datetime
    updated_at: datetime
    created_by: int            # FK -> User.id
```

---

## 🔒 Seguridad

### Autenticación
- **JWT tokens** con expiration configurable (30 min por defecto)
- **OAuth2PasswordRequestForm** para login (form-urlencoded)
- **Bcrypt** con 260000 iteraciones para password hashing
- Refresh tokens para sesiones extendidas

### Autorización (RBAC)

| Rol | Permisos |
|-----|----------|
| **admin** | Acceso completo, CRUD de todos los reportes y usuarios |
| **supervisor** | Ver y aprobar reportes de operadores, ver estadísticas |
| **operator** | Solo CRUD de sus propios reportes |

### Protección de Datos
- ✅ Validación con **Pydantic v2** (type-safe)
- ✅ Prevención de SQL Injection (ORM SQLAlchemy)
- ✅ CORS configurado
- ✅ Environment variables para secrets
- ✅ Input sanitization
- ✅ Rate limiting (configurable)

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests básicos
pytest tests/ -v

# Con cobertura
pytest tests/ --cov=app --cov-report=html

# Tests de autenticación
pytest tests/test_auth.py -v

# Test específico
pytest tests/test_api.py::TestHealthEndpoint::test_health_check -v
```

### Cobertura Meta
| Componente | Meta |
|------------|------|
| API Layer | 80%+ |
| Services | 90%+ |
| Utils | 95%+ |

### Test Cases Disponibles
- ✅ Health endpoint
- ✅ Autenticación JWT
- ✅ Login con credenciales correctas/incorrectas
- ✅ Creación de reportes
- ✅ Permisos por rol
- ✅ Validaciones de datos
- ✅ Paginación de reportes

---

## 🐳 Docker Deployment

### Servicios Orquestados

| Servicio | Imagen | Puerto | Descripción |
|----------|--------|--------|-------------|
| `api` | python:3.11-slim | 8000 | FastAPI backend |
| `web` | python:3.11-slim | 3000 | React frontend |
| `db` | postgres:15 | 5432 | PostgreSQL database |
| `redis` | redis:7-alpine | 6379 | Cache/session |

### Comandos Docker

```bash
# Iniciar todos los servicios
docker-compose up -d --build

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f
docker-compose logs api
docker-compose logs db

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (limpieza completa)
docker-compose down -v

# Reiniciar servicios
docker-compose restart

# Ejecutar comandos en contenedor
docker exec -it soc-monitor-advanced-api-1 bash
docker exec -it soc-monitor-advanced-api-1 python --version

# Migraciones
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

### Monitoreo de Recursos
```bash
# Uso de recursos
docker stats

# Espacio en disco
docker system df

# Limpiar recursos no usados
docker system prune -a
```

---

## 📊 Frontend

### Tecnologías
- **React 19** con TypeScript
- **Vite** como build tool
- **TailwindCSS** para styling
- **React Router** para navigation
- **Axios** para HTTP client
- **Recharts** para data visualization
- **Lucide React** para icons

### Páginas

#### 1. Dashboard
- Estadísticas en tiempo real
- Gráficos de tendencias de severidad
- Alertas vs resueltas (14 días)
- Tabla de reportes recientes
- Quick actions

#### 2. Login
- Autenticación OAuth2
- Form-urlencoded (compatible con backend)
- Redirect después de login exitoso
- Manejo de errores

#### 3. Reports
- Listado con paginación
- Filtrado por estado y severidad
- CRUD completo
- Vista detallada

#### 4. Users
- Listado de usuarios
- Creación/edición (admin)
- Gestión de roles

#### 5. Settings
- Configuración del sistema
- Integración Slack
- Parámetros globales

### Components Clave
- ✅ Tablas con paginación
- ✅ Gráficos de área y línea
- ✅ Badges para estados
- ✅ Toast notifications
- ✅ Loading spinners
- ✅ Modal para confirmaciones

---

## 🤖 Slack Integration

### Comandos Slash

| Comando | Descripción |
|---------|-------------|
| `/soc_status` | Ver estado del sistema |
| `/soc_alerts` | Consultar alertas activas |
| `/soc_report` | Abrir formulario de reporte |
| `/soc_stats` | Ver estadísticas del día |

### Notificaciones

- **Reportes de alta severidad (≥7/10)**: Alertas con attachments coloreados
- **SLA violations**: Notificaciones automáticas
- **Actualizaciones de estado**: Cambios de status
- **Comandos en tiempo real**: Respuestas inmediatas

### Configuración

1. Crear Slack app en [Slack Developers](https://api.slack.com/apps)
2. Instalar app al workspace
3. Obtener tokens:
   - Bot Token: `xoxb-...`
   - Signing Secret
   - App Level Token: `xapp-...`
4. Configurar en `.env`

---

## 📈 Métricas y Monitoreo

### Metrics en Tiempo Real
- Request latency (P50, P95, P99)
- Error rates
- Database connection pool usage
- Slack message delivery rates
- JWT token validation rate

### Logging
- **Structured JSON logs**
- Request correlation IDs
- Error tracking
- Audit logs for security events
- Slow query logging

### Health Check
```bash
curl http://localhost:8000/health

# Response:
{
  "status": "healthy",
  "app": "SOC Monitor Advanced",
  "version": "2.0.0"
}
```

---

## 🛠️ Troubleshooting

### Problemas Comunes

#### 1. Error: "Port 8000 already in use"
```bash
# Detener proceso usando el puerto
lsof -i :8000
kill -9 <PID>

# O cambiar puerto en .env
PORT=8001
```

#### 2. Error: "Database connection failed"
```bash
# Verificar PostgreSQL está corriendo
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Verificar credenciales en .env
grep DATABASE_URL .env

# Probar conexión
psql $(grep DATABASE_URL .env | cut -d'=' -f2)
```

#### 3. Error: "Module not found"
```bash
# En entorno virtual
source venv/bin/activate
pip install -r requirements.txt

# En Docker, reconstruir
docker-compose build --no-cache
docker-compose up -d
```

#### 4. Error: "Password authentication failed"
```bash
# Reiniciar contenedor y recrear usuarios
docker-compose down
docker-compose up -d --build

# O reinicializar manualmente
docker exec -it soc-monitor-advanced-api-1 python init_users.py
```

#### 5. Error: "JWT token invalid"
- Verifica que `SECRET_KEY` en `.env` coincida en todos los servicios
- Verifica que el token no haya expirado (default: 30 minutos)
- Limpiar localStorage del navegador

#### 6. Frontend no carga datos
```bash
# Verificar CORS
curl -v http://localhost:8000/api/v1/reports

# Verificar API está corriendo
curl http://localhost:8000/health

# Verificar variables de entorno en web
grep VITE_API_URL web/.env
```

#### 7. Docker containers no inician
```bash
# Ver logs
docker-compose logs

# Verificar puertos
sudo netstat -tlnp | grep :8000
sudo netstat -tlnp | grep :3000

# Reconstruir
docker-compose down -v
docker-compose up -d --build
```

---

## 📚 Recursos y Documentación

### Documentación del Proyecto
- [README.md](../README.md) - Este documento
- [README_SERVIDOR.md](../README_SERVIDOR.md) - Guía de despliegue en servidor
- [INICIO_RAPIDO.md](../INICIO_RAPIDO.md) - Quickstart troubleshooting
- [GUÍA DE REPORTES.md](../GUÍA%20DE%20REPORTES.md) - Uso del módulo de reportes
- [FRONTEND_SETUP.md](../FRONTEND_SETUP.md) - Configuración frontend
- [README_TESTS.md](../README_TESTS.md) - Guía de testing

### Documentación Técnica
- [docs/architecture.md](docs/architecture.md) - Arquitectura del sistema
- [docs/api.md](docs/api.md) - Documentación API OpenAPI
- [docs/CONFIGURACION_PASO_A_PASO.md](docs/CONFIGURACION_PASO_A_PASO.md) - Configuración paso a paso

### Recursos Externos
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Slack Bolt for Python](https://slack.dev/bolt-python)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📈 Roadmap

### v2.1 (Próxima Versión)
- [ ] Integración con más canales de notificación (Email, Webhooks)
- [ ] Dashboard en tiempo real con WebSocket
- [ ] Exportación de reportes a PDF
- [ ] Reportes automáticos programados
- [ ] Importación de reportes desde CSV/Excel
- [ ] Búsqueda avanzada con filtros
- [ ] Paginación infinita en frontend

### v2.2
- [ ] Machine Learning para detección de anomalías
- [ ] Webhooks personalizados
- [ ] API GraphQL (opcional)
- [ ] Microservicios (si escala)
- [ ] Multi-tenancy support
- [ ] Audit trail completo

### v3.0
- [ ] Mobile app (React Native)
- [ ] Dashboard de analítica avanzada
- [ ] Integración con SIEM
- [ ] Threat intelligence feeds
- [ ] Automatización de respuestas (SOAR)

---

## 📝 Contribuyendo

### Flujo de Trabajo

1. **Fork del repository**
```bash
git clone <tu-fork>
cd soc-monitor-advanced
```

2. **Crear rama**
```bash
git checkout -b feature/nueva-funcionalidad
```

3. **Hacer cambios**
```bash
# Añadir funcionalidad
# Escribir tests
# Actualizar documentación
```

4. **Commit**
```bash
git add .
git commit -m "feat: añadir nueva funcionalidad"
```

5. **Push y Pull Request**
```bash
git push origin feature/nueva-funcionalidad
# Crear PR en GitHub
```

### Convenciones de Commit

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat:` | Nueva funcionalidad | `feat: añadir exportación PDF` |
| `fix:` | Corrección de bug | `fix: corregir login JWT` |
| `docs:` | Documentación | `docs: actualizar README` |
| `style:` | Formato/código | `style: formatar con black` |
| `refactor:` | Refactorización | `refactor: extraer servicio` |
| `test:` | Tests | `test: añadir tests de autenticación` |
| `chore:` | Mantenimiento | `chore: actualizar dependencias` |

### Criterios de Aceptación
- [ ] Tests pasados
- [ ] Código siguiendo convenciones
- [ ] Documentación actualizada
- [ ] Sin breaking changes (o documentados)
- [ ] Revisión de al menos 1 maintainer

---

## 👨‍💻 Autor

**Walter Rios**  
Python Developer & SOC Specialist  
**Perfil:** [Tony](../../.hermes/skills/software-development/tony/)

---

## 📄 Licencia

Este proyecto es de uso interno para gestión de SOC.  
Todos los derechos reservados.

---

## 📞 Soporte

Para soporte o preguntas sobre la instalación:

1. Revisar logs: `docker-compose logs`
2. Verificar configuración en `.env`
3. Consultar documentación en `docs/`
4. Revisar troubleshooting en este README
5. Contactar al equipo de desarrollo

---

**Última actualización:** 06-JUN-2026  
**Versión:** 2.0.0  
**Estado:** Production Ready ✅
