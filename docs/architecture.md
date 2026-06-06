# Arquitectura del Sistema SOC Monitor Advanced v2.0

> **Fecha:** 06-JUN-2026 | **Versión:** 2.0.0 | **Autor:** Walter Rios

---

## 🏗️ Visión General

SOC Monitor Advanced es una aplicación **full-stack** diseñada para centros de operaciones de seguridad (SOC L1), siguiendo principios de **arquitectura moderna**, **escalabilidad** y **seguridad**.

### Objetivos de Arquitectura
- ✅ **Alta disponibilidad** - Servicios stateless con health checks
- ✅ **Escalabilidad horizontal** - Load balancer ready
- ✅ **Seguridad por diseño** - JWT, RBAC, encryption
- ✅ **Mantenibilidad** - Separación de responsabilidades
- ✅ **Observabilidad** - Logging, metrics, tracing

---

## 📐 Diagrama de Arquitectura

```
┌──────────────────────────────────────────────────────────────────────┐
│                           CLIENTES                                    │
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐       │
│  │  Navegador   │    │    Slack     │    │   CLI/API Tools  │       │
│  │   (React)    │    │   Bot/Web    │    │    (Postman,     │       │
│  │              │    │   Hooks      │    │     curl, etc)   │       │
│  └──────┬───────┘    └──────┬───────┘    └────────┬─────────┘       │
│         │                   │                     │                   │
└─────────┼───────────────────┼─────────────────────┼───────────────────┘
          │                   │                     │
          ▼                   ▼                     ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                                    │
│                    (FastAPI + Uvicorn)                                │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Middleware Stack:                                           │   │
│  │  • CORS (Cross-Origin Resource Sharing)                      │   │
│  │  • JWT Authentication (Bearer tokens)                        │   │
│  │  • Request Validation (Pydantic v2)                          │   │
│  │  • Rate Limiting (Redis)                                     │   │
│  │  • Request Logging (Structured JSON)                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Routing Layer (v1)                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐  │   │
│  │  │  /auth      │  │  /users     │  │    /reports          │  │   │
│  │  │  /stats     │  │  /slack     │  │    /                 │  │   │
│  │  └─────────────┘  └─────────────┘  └──────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────┬──────────────────────────────────────────────────┘
                    │
                    ▼
        ┌─────────────────────┐  ┌──────────────────────┐
        │   APPLICATION LAYER │  │  SLACK INTEGRATION   │
        │                     │  │                      │
        │  • Auth Service     │  │  • Slack Bot         │
        │  • Reports Service  │  │  • Commands          │
        │  • Stats Service    │  │  • Notifications     │
        │  • User Service     │  │  • Events            │
        │  • Validation       │  │  • Webhooks          │
        └───────────┬─────────┘  └──────────┬───────────┘
                    │                        │
                    ▼                        ▼
        ┌─────────────────────────────────────────────────────────┐
        │              DATA ACCESS LAYER                           │
        │                                                          │
        │  • SQLAlchemy ORM (2.0+)                                 │
        │  • Connection Pooling (10 + 20 overflow)                 │
        │  • Migrations (Alembic)                                  │
        │  • Repository Pattern                                    │
        └───────────────┬──────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ PostgreSQL  │ │    Redis    │ │    S3/FS    │
│   Primary   │ │   Cache     │ │  Attachments│
│   Database  │ │             │ │             │
│  (Port 5432)│ │ (Port 6379) │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
```

---

## 📦 Componentes Principales

### 1. FastAPI Application Layer

**Responsabilidades:**
- Manejo de requests HTTP (ASGI)
- Autenticación JWT
- Validación de datos con Pydantic
- Routing a servicios internos
- Serialización de respuestas

**Tecnologías:**
- **FastAPI 0.109+** - Framework asíncrono moderno
- **Uvicorn** - ASGI server de alto rendimiento
- **Pydantic v2** - Validación de datos type-safe
- **Python 3.11+** - Últimas optimizaciones

**Patrones:**
- Layered Architecture
- Dependency Injection (FastAPI Depends)
- RESTful design
- Versioning (v1)

---

### 2. Slack Integration

**Responsabilidades:**
- Webhooks de eventos
- Slash commands
- Notificaciones de alertas
- Interacción con usuarios
- Respuestas en tiempo real

**Tecnologías:**
- **slack-bolt 1.19+** - SDK oficial de Slack
- **Slack Web API** - Interfaz programática
- **Slack Events API** - Event-driven architecture

**Implementación:**
```python
class SlackBot:
    def __init__(self):
        self.app = App(
            token=settings.SLACK_BOT_TOKEN,
            signing_secret=settings.SLACK_SIGNING_SECRET
        )
    
    def setup_listeners(self):
        @self.app.command("/soc_status")
        async def handle_soc_status(ack, say, command):
            ack()
            await say("✅ Sistema SOC Monitor en línea")
```

---

### 3. Database Layer

#### PostgreSQL

**Responsabilidades:**
- Almacenamiento persistente
- Relaciones entre entidades
- Queries complejos
- ACID transactions
- Connection pooling

**Configuración:**
- **Versión:** PostgreSQL 15
- **Pool size:** 10 connections
- **Max overflow:** 20 connections
- **Isolation level:** READ COMMITTED

**Modelos:**
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'operator',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    slack_user_id VARCHAR(50)
);

-- Shift reports table
CREATE TABLE shift_reports (
    id SERIAL PRIMARY KEY,
    operator_id INTEGER REFERENCES users(id),
    shift_date TIMESTAMP NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    summary TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    severity INTEGER DEFAULT 0,
    sla_deadline TIMESTAMP,
    sla_violated BOOLEAN DEFAULT FALSE,
    novedades JSONB,
    logs_revisados JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Redis

**Responsabilidades:**
- Cache de datos frecuentes
- Session storage
- Rate limiting
- Message queuing (opcional)

**Configuración:**
- **Versión:** Redis 7 Alpine
- **Purposes:** Cache, sessions, rate limiting
- **Persistence:** AOF enabled (opcional)

**Estrategias de Cache:**
```python
@cache_key("reports:{user_id}")
def get_user_reports(user_id: int):
    return db.query(ShiftReport).filter_by(operator_id=user_id).all()
```

---

### 4. Services Layer

#### AuthService
```python
class AuthService:
    def login(self, username: str, password: str) -> Token:
        user = self.verify_credentials(username, password)
        token = self.create_jwt(user)
        return Token(access_token=token, token_type="bearer")
    
    def verify_token(self, token: str) -> User:
        payload = jwt.decode(token, self.secret_key)
        return self.get_user_by_id(payload["sub"])
```

#### ReportService
```python
class ReportService:
    def create_report(self, report_data: dict, user: User) -> ShiftReport:
        report = ShiftReport(
            operator_id=user.id,
            **report_data
        )
        db.add(report)
        db.commit()
        
        # Notificar si severidad >= 7
        if report.severity >= 7:
            self.send_slack_alert(report)
        
        return report
    
    def check_sla(self, report: ShiftReport) -> bool:
        if datetime.utcnow() > report.sla_deadline:
            report.sla_violated = True
            return True
        return False
```

#### SlackNotificationService
```python
class SlackNotificationService:
    def send_alert(self, report: ShiftReport, channel: str):
        color = "#ff0000" if report.severity >= 8 else "#ff8800"
        
        message = {
            "attachments": [{
                "color": color,
                "title": "🚨 Alerta de Seguridad",
                "text": report.summary,
                "fields": [
                    {"title": "Severidad", "value": str(report.severity), "short": True},
                    {"title": "Operador", "value": report.operator.full_name, "short": True}
                ]
            }]
        }
        
        self.app.client.chat_postMessage(channel=channel, text="", attachments=message)
```

---

### 5. Frontend (React)

**Responsabilidades:**
- UI/UX para usuarios SOC
- Consumir API REST
- Manejo de estado
- Routing
- Authentication flow

**Estructura:**
```
web/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx      # Vista principal
│   │   ├── Login.tsx          # Autenticación
│   │   ├── Reports.tsx        # CRUD reportes
│   │   ├── Users.tsx          # Gestión usuarios
│   │   └── Settings.tsx       # Configuración
│   ├── components/
│   │   ├── Layout.tsx         # Layout principal
│   │   ├── charts/            # Components de gráficos
│   │   └── tables/            # Tablas reutilizables
│   ├── services/
│   │   └── api.ts             # Cliente HTTP
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── utils/
│       └── formatters.ts      # Helpers de formato
```

**Key Dependencies:**
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **TailwindCSS** - Styling
- **React Router** - Navigation

---

## 🔐 Seguridad

### Autenticación

**Flujo JWT:**
```
1. Usuario → POST /api/v1/auth/login {username, password}
2. Backend → Verificar credenciales (bcrypt)
3. Backend → Generar JWT token (exp: 30 min)
4. Backend → Return {access_token, token_type, role}
5. Cliente → Store token (localStorage)
6. Cliente → Request → Header: Authorization: Bearer {token}
7. Backend → Validate token → Extract user_id
8. Backend → Return data or 401
```

**Configuración:**
- **Algoritmo:** HS256
- **Expiración:** 30 minutos (configurable)
- **Hash:** bcrypt (260000 iteraciones)
- **Secret key:** Mínimo 32 caracteres

### Autorización (RBAC)

**Roles:**
| Rol | Permisos |
|-----|----------|
| **admin** | Acceso completo, CRUD todos los recursos |
| **supervisor** | Ver/editar reportes de operadores, aprobar reportes |
| **operator** | Solo CRUD de sus propios reportes |

**Implementación:**
```python
async def get_current_active_user(
    current_user = Depends(get_current_user)
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin_user(
    current_user = Depends(get_current_active_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user
```

### Protección de Datos

**Defensas:**
- ✅ **Input Validation** - Pydantic schemas
- ✅ **SQL Injection Prevention** - SQLAlchemy ORM
- ✅ **XSS Protection** - React escaping + Content-Security-Policy
- ✅ **CSRF Protection** - Same-site cookies + tokens
- ✅ **CORS** - Origin allowlist
- ✅ **Environment Variables** - Secrets no hardcodeados
- ✅ **HTTPS** - TLS en producción

---

## 🔄 Patrones de Diseño

### Arquitectura

1. **Layered Architecture**
   - Presentation Layer (API routes, React components)
   - Business Logic Layer (Services)
   - Data Access Layer (Repository pattern)
   - Database Layer (PostgreSQL)

2. **Dependency Injection**
   - FastAPI `Depends()`
   - Service classes inlined
   - No global state

3. **Repository Pattern**
   ```python
   class ReportRepository:
       def get_by_operator(self, db: Session, operator_id: int):
           return db.query(ShiftReport).filter_by(operator_id=operator_id).all()
       
       def create(self, db: Session, report_data: dict):
           report = ShiftReport(**report_data)
           db.add(report)
           db.commit()
           return report
   ```

### API

1. **RESTful**
   - Recursos bien definidos
   - HTTP verbs semánticos
   - Status codes correctos

2. **Versioning**
   - `/api/v1/` prefix
   - Future: v2, v3 without breaking changes

3. **Pagination**
   ```python
   @router.get("/")
   async def list_reports(
       skip: int = 0,
       limit: int = 100,
       current_user = Depends(get_current_user),
       db: Session = Depends(get_db)
   ):
       query = db.query(ShiftReport)
       return query.offset(skip).limit(limit).all()
   ```

4. **Filtering/Sorting**
   - Query params para filtros
   - Sorting por campos configurados

### Data

1. **ORM (SQLAlchemy)**
   - Mapeo objeto-relacional
   - Session management
   - Transaction control

2. **DTO/Schema Separation**
   ```python
   # Pydantic schemas
   class ReportCreate(BaseModel):
       shift_date: datetime
       start_time: datetime
       end_time: datetime
       summary: str
       severity: int = Field(ge=0, le=10)
   
   # SQLAlchemy models
   class ShiftReport(Base):
       __tablename__ = "shift_reports"
       id: Mapped[int] = mapped_column(primary_key=True)
       # ... columns
   ```

---

## 🧪 Testing Strategy

### Tests por Capa

```
tests/
├── unit/              # Tests de servicios y utils (90% coverage)
│   ├── test_auth.py
│   ├── test_report_service.py
│   └── test_slack_bot.py
├── integration/       # Tests de API endpoints (80% coverage)
│   ├── test_api.py
│   ├── test_auth_flow.py
│   └── test_reports_crud.py
└── fixtures/          # Datos de prueba
    ├── sample_reports.json
    └── test_users.sql
```

### Estrategia

1. **Unit Tests**
   - Aislar componentes
   - Mock dependencias externas
   - Rápida ejecución

2. **Integration Tests**
   - Probar flujos completos
   - Base de datos de test
   - Endpoints reales

3. **E2E Tests (Future)**
   - React testing library
   - Cypress para flows completos
   - Browser automation

### Ejemplo de Test

```python
class TestAuthEndpoint:
    def test_login_success(self, client, test_user):
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "test", "password": "password123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_wrong_password(self, client, test_user):
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "test", "password": "wrong"}
        )
        
        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid credentials"
```

---

## 🚀 Deployment

### Docker

**Multi-stage Builds:**
```dockerfile
# Stage 1: Build
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Security Best Practices:**
- ✅ Non-root user
- ✅ Health checks
- ✅ Resource limits
- ✅ .dockerignore para files sensibles
- ✅ Multi-stage para reducir tamaño

### Environment

| Ambiente | Base de Datos | Redis | API |
|----------|--------------|-------|-----|
| **Development** | Local PostgreSQL | Local Redis | Local + hot-reload |
| **Staging** | Docker Compose | Docker Compose | Docker Compose |
| **Production** | Managed DB (RDS) | Managed Cache | Kubernetes/ECS |

---

## 📈 Monitoreo

### Metrics

**Métricas Clave:**
- Request latency (P50, P95, P99)
- Error rates (4xx, 5xx)
- Database connection pool usage
- Slack message delivery rates
- JWT token validation failures
- Cache hit/miss ratio

**Implementation:**
```python
from prometheus_client import Counter, Histogram, Gauge

REQUEST_LATENCY = Histogram('api_request_latency_seconds', 'Request latency')
ERROR_COUNT = Counter('api_errors_total', 'Error count')
DB_CONNECTIONS = Gauge('db_connections_active', 'Active DB connections')

@app.middleware("http")
async def monitor_metrics(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    REQUEST_LATENCY.observe(duration)
    if response.status_code >= 500:
        ERROR_COUNT.inc()
    
    return response
```

### Logging

**Estructura JSON:**
```json
{
  "timestamp": "2026-06-06T10:30:00Z",
  "level": "INFO",
  "message": "User logged in",
  "user_id": 123,
  "request_id": "abc-123-def",
  "duration_ms": 45,
  "ip": "192.168.1.100"
}
```

**Herramientas:**
- **Logging** - Python logging module
- **ELK Stack** - Elasticsearch, Logstash, Kibana (future)
- **Sentry** - Error tracking (future)
- **Prometheus + Grafana** - Metrics dashboard (future)

---

## 📊 Escalabilidad

### Horizontal Scaling

**Stateless API:**
- No sessions en memoria (usar Redis)
- Configuración externa (env vars)
- Load balancer ready

**Patrones:**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  API Server │    │  API Server │    │  API Server │
│   (Port 8000)│    │   (Port 8000)│    │   (Port 8000)│
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
                 ┌─────────────────┐
                 │  Load Balancer  │
                 │ (Nginx/ALB)     │
                 └────────┬────────┘
                          │
                  ┌───────┴───────┐
                  ▼               ▼
           ┌──────────┐    ┌──────────┐
           │ PostgreSQL│    │  Redis   │
           └──────────┘    └──────────┘
```

### Vertical Scaling

**Optimizaciones:**
- Database indexing (indexes en username, email, operator_id)
- Query optimization (eager loading, selectinload)
- Caching strategies (Redis para datos frecuentes)
- Background tasks (Celery - future)

**Connection Pooling:**
```python
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

---

## 🔮 Roadmap Técnico

### v2.1
- [ ] WebSocket para dashboard en tiempo real
- [ ] Exportación a PDF (WeasyPrint)
- [ ] GraphQL como opción adicional
- [ ] Webhooks personalizados
- [ ] Background tasks (Celery/Redis)

### v2.2
- [ ] Machine Learning para detección de anomalías (Scikit-learn)
- [ ] Multi-tenancy support
- [ ] Audit trail completo
- [ ] API rate limiting avanzado
- [ ] CI/CD pipeline completo

### v3.0
- [ ] Microservicios (si escala)
- [ ] Mobile app (React Native)
- [ ] Integración con SIEM
- [ ] Threat intelligence feeds
- [ ] SOAR (Security Orchestration)

---

## 📚 Referencias

### Frameworks y Librerías
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/)
- [Pydantic v2 Documentation](https://docs.pydantic.dev/)
- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [React Documentation](https://react.dev/)

### Patrones de Diseño
- [Layered Architecture](https://martinfowler.com/eaaDev/layeredArchitecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCode/repository.html)
- [Dependency Injection](https://martinfowler.com/articles/injection.html)
- [RESTful API Design](https://restfulapi.net/)

### Seguridad
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [bcrypt Parameters](https://passlib.readthedocs.io/)

---

**Última actualización:** 06-JUN-2026  
**Versión:** 2.0.0  
**Estado:** Production Ready ✅
