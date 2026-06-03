# Arquitectura del Sistema SOC Monitor Advanced

## 🏗️ Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTES                                │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐         │
│  │ Navegador   │  │    Slack    │  │   CLI/API    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘         │
│         │                │                 │                  │
└─────────┼────────────────┼─────────────────┼──────────────────┘
          │                │                 │
          ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY                               │
│                   (FastAPI + Uvicorn)                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware Stack:                                   │  │
│  │  - CORS                                              │  │
│  │  - Authentication (JWT)                              │  │
│  │  - Request Validation (Pydantic)                     │  │
│  │  - Rate Limiting                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────┬──────────────────────┬──────────────────┘
                    │                      │
                    ▼                      ▼
        ┌─────────────────────┐  ┌──────────────────────┐
        │   APPLICATION LAYER │  │  SLACK INTEGRATION   │
        │                     │  │                      │
        │  • Auth Service     │  │  • Slack Bot         │
        │  • Reports Service  │  │  • Commands          │
        │  • Stats Service    │  │  • Notifications     │
        │  • User Service     │  │  • Events            │
        └───────────┬─────────┘  └──────────┬───────────┘
                    │                        │
                    ▼                        ▼
        ┌─────────────────────────────────────────────────┐
        │              DATA ACCESS LAYER                   │
        │                                                  │
        │  • SQLAlchemy ORM                                │
        │  • Connection Pooling                            │
        │  • Migrations (Alembic)                          │
        └───────────────┬──────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ PostgreSQL  │ │    Redis    │ │    S3/FS    │
│   Primary   │ │   Cache     │ │  Attachments│
│   Database  │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
```

## 📦 Componentes

### 1. FastAPI Application Layer

**Responsabilidades:**
- Manejo de requests HTTP
- Autenticación JWT
- Validación de datos con Pydantic
- Routing a servicios internos

**Tecnologías:**
- FastAPI 0.109.0+
- Uvicorn (ASGI server)
- Pydantic v2

### 2. Slack Integration

**Responsabilidades:**
- Webhooks de eventos
- Slash commands
- Notificaciones de alertas
- Interacción con usuarios

**Tecnologías:**
- slack-bolt
- Slack Web API
- Slack Events API

### 3. Database Layer

**PostgreSQL:**
- Almacenamiento persistente
- Relaciones entre entidades
- Queries complejos
- Connection pooling

**Redis:**
- Cache de datos frecuentes
- Session storage
- Rate limiting
- Message queuing (opcional)

### 4. Services Layer

**Services implementados:**
- `ReportService` - Lógica de negocio de reportes
- `SlackBot` - Integración con Slack
- `NotificationService` - Envío de notificaciones
- `AuthService` - Autenticación y autorización

## 🔐 Seguridad

### Autenticación
- JWT tokens con expiration
- Password hashing con bcrypt (260000 iteraciones)
- Refresh tokens para sesiones extendidas

### Autorización
- RBAC (Role-Based Access Control)
- Roles: admin, supervisor, operator
- Scoped permissions por endpoint

### Data Protection
- Input validation con Pydantic
- SQL injection prevention (ORM)
- XSS protection (headers)
- CORS configuration
- Environment variables para secrets

## 📊 Escalabilidad

### Horizontal
- Stateless API servers
- External session storage (Redis)
- Database connection pooling
- Load balancer ready

### Vertical
- Database indexing
- Query optimization
- Caching strategies
- Background tasks (Celery - future)

## 🔄 Patrones de Diseño

### Arquitectura
- Layered Architecture
- Repository Pattern
- Service Pattern
- Dependency Injection

### API
- RESTful
- Versioning (v1)
- Pagination
- Filtering/Sorting

### Data
- ORM (SQLAlchemy)
- Active Record
- DTO/Schema separation

## 🧪 Testing Strategy

### Tests por Capa
```
tests/
├── unit/          # Tests de servicios y utils
├── integration/   # Tests de API endpoints
├── e2e/          # End-to-end tests
└── fixtures/     # Datos de prueba
```

### Cobertura Meta
- API Layer: 80%+
- Services: 90%+
- Utils: 95%+

## 🚀 Deployment

### Docker
- Multi-stage builds
- Non-root user
- Health checks
- Resource limits

### Environment
- Development: Local PostgreSQL, Redis
- Staging: Docker Compose
- Production: Kubernetes/ECS

## 📈 Monitoreo

### Metrics
- Request latency (P50, P95, P99)
- Error rates
- Database connection pool usage
- Slack message delivery rates

### Logging
- Structured JSON logs
- Request correlation IDs
- Error tracking
- Audit logs for security events

---

**Última Actualización:** 02/06/2026  
**Versión:** 2.0.0
