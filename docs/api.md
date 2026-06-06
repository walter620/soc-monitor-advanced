# SOC Monitor API v1 - Documentación de Endpoints

> **Versión:** 2.0.0  
> **Base URL:** `http://localhost:8000/api/v1`  
> **Fecha:** 06-JUN-2026  
> **Formato:** OpenAPI 3.0

---

## 🚀 Autenticación

### Obtener Token JWT

**Endpoint:** `POST /auth/login`

**Descripción:** Autenticar usuario y obtener token de acceso.

**ContentType:** `application/x-www-form-urlencoded`

**Parámetros de Form:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `username` | string | Sí | Nombre de usuario |
| `password` | string | Sí | Contraseña |

**Ejemplo de Request:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "username": "admin",
  "role": "admin"
}
```

**Response (401 Unauthorized):**
```json
{
  "detail": "Nombre de usuario o contraseña incorrectos"
}
```

---

### Registrar Nuevo Usuario

**Endpoint:** `POST /auth/register`

**Descripción:** Crear nueva cuenta de usuario.

**ContentType:** `application/json`

**Body:**
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@example.com",
  "password": "password123",
  "full_name": "Juan Pérez",
  "role": "operator"  // opcional, default: "operator"
}
```

**Validaciones:**
- Username: único, 3-80 caracteres
- Email: válido, único
- Password: mínimo 6 caracteres
- full_name: obligatorio

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "nuevo_usuario",
  "email": "usuario@example.com",
  "full_name": "Juan Pérez",
  "role": "operator",
  "is_active": true,
  "created_at": "2026-06-06T10:30:00Z",
  "slack_user_id": null
}
```

**Response (400 Bad Request):**
```json
{
  "detail": "El nombre de usuario ya existe"
}
```

---

## 👥 Gestión de Usuarios

### Listar Usuarios

**Endpoint:** `GET /users`

**Descripción:** Obtener lista de usuarios (solo admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@local",
    "full_name": "Admin User",
    "role": "admin",
    "is_active": true,
    "created_at": "2026-06-01T00:00:00Z",
    "slack_user_id": "U123456"
  },
  {
    "id": 2,
    "username": "analista",
    "email": "analista@local",
    "full_name": "Juan Analista",
    "role": "operator",
    "is_active": true,
    "created_at": "2026-06-02T00:00:00Z",
    "slack_user_id": null
  }
]
```

---

### Obtener Usuario por ID

**Endpoint:** `GET /users/{user_id}`

**Descripción:** Obtener detalles de un usuario específico.

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `user_id` | integer | ID del usuario |

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@local",
  "full_name": "Admin User",
  "role": "admin",
  "is_active": true,
  "created_at": "2026-06-01T00:00:00Z",
  "updated_at": "2026-06-01T00:00:00Z",
  "last_login": "2026-06-06T09:00:00Z",
  "slack_user_id": "U123456"
}
```

**Response (404 Not Found):**
```json
{
  "detail": "Usuario no encontrado"
}
```

---

## 📊 Gestión de Reportes

### Listar Reportes

**Endpoint:** `GET /reports`

**Descripción:** Obtener lista de reportes con paginación.

**Query Parameters:**
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `skip` | integer | 0 | Número de registros a saltar |
| `limit` | integer | 100 | Máximo de registros a retornar |

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "status": "completed",
    "severity": 3,
    "summary": "Monitoreo de firewall sin incidentes críticos...",
    "created_at": "2026-06-06T08:00:00Z"
  },
  {
    "id": 2,
    "status": "pending",
    "severity": 7,
    "summary": "Detección de intentos de login fallidos...",
    "created_at": "2026-06-06T09:00:00Z"
  }
]
```

**Permisos:**
- **Admin**: Todos los reportes
- **Supervisor**: Reportes de operadores bajo su supervisión
- **Operator**: Solo sus propios reportes

---

### Obtener Reporte por ID

**Endpoint:** `GET /reports/{report_id}`

**Descripción:** Obtener detalles completos de un reporte.

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `report_id` | integer | ID del reporte |

**Response (200 OK):**
```json
{
  "id": 1,
  "operator_id": 2,
  "shift_date": "2026-06-06T00:00:00Z",
  "start_time": "2026-06-06T08:00:00Z",
  "end_time": "2026-06-06T16:00:00Z",
  "summary": "Monitoreo de firewall sin incidentes críticos durante el turno matutino",
  "status": "completed",
  "severity": 2,
  "sla_deadline": "2026-06-06T20:00:00Z",
  "sla_violated": false,
  "auto_escalated": false,
  "novedades": [
    {
      "timestamp": "2026-06-06T10:30:00Z",
      "description": "Escaneo de vulnerabilidades completado",
      "severity": "low"
    }
  ],
  "logs_revisados": [
    "/var/log/auth.log - Revisión completa",
    "/var/log/syslog - 2 alertas menores"
  ],
  "created_at": "2026-06-06T16:30:00Z",
  "updated_at": "2026-06-06T17:00:00Z"
}
```

---

### Crear Nuevo Reporte

**Endpoint:** `POST /reports`

**Descripción:** Crear un nuevo reporte de turno.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "shift_date": "2026-06-06T00:00:00Z",
  "start_time": "2026-06-06T08:00:00Z",
  "end_time": "2026-06-06T16:00:00Z",
  "summary": "Turno de monitoreo de seguridad - Sin incidentes críticos",
  "status": "draft",  // draft, pending, approved, closed
  "severity": 2,  // 0-10
  "novedades": [
    {
      "timestamp": "2026-06-06T10:30:00Z",
      "description": "Revisión de logs completada"
    }
  ],
  "logs_revisados": [
    "/var/log/auth.log",
    "/var/log/syslog"
  ]
}
```

**Validaciones:**
- `end_time` debe ser posterior a `start_time`
- `severity` debe estar entre 0-10
- `summary` es obligatorio

**Response (201 Created):**
```json
{
  "id": 3,
  "status": "draft",
  "severity": 2,
  "summary": "Turno de monitoreo de seguridad - Sin incidentes críticos",
  "created_by": "analista"
}
```

---

### Actualizar Reporte

**Endpoint:** `PUT /reports/{report_id}`

**Descripción:** Actualizar un reporte existente.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `report_id` | integer | ID del reporte |

**Body (parciales permitidos):**
```json
{
  "summary": "Turno actualizado - Se detectó 1 alerta menor",
  "status": "pending",
  "severity": 4,
  "novedades": [
    {
      "timestamp": "2026-06-06T11:00:00Z",
      "description": "Alerta de firewall actualizada"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "pending",
  "message": "Reporte actualizado exitosamente"
}
```

**Response (403 Forbidden):**
```json
{
  "detail": "No tienes permisos para actualizar este reporte"
}
```

---

### Eliminar Reporte

**Endpoint:** `DELETE /reports/{report_id}`

**Descripción:** Eliminar un reporte (solo admin o creador).

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `report_id` | integer | ID del reporte |

**Response (204 No Content):**
```
(no content)
```

**Response (403 Forbidden):**
```json
{
  "detail": "No tienes permisos para eliminar este reporte"
}
```

**Response (404 Not Found):**
```json
{
  "detail": "Reporte no encontrado"
}
```

---

## 📈 Estadísticas

### Dashboard Statistics

**Endpoint:** `GET /stats/dashboard`

**Descripción:** Obtener estadísticas generales del dashboard.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "total_reports": 156,
  "pending_reports": 12,
  "completed_reports": 144,
  "avg_severity": 2.8,
  "trend": 12.5,
  "sla_violations": 3,
  "high_severity_alerts": 5
}
```

---

### Trends Data

**Endpoint:** `GET /stats/trends`

**Descripción:** Obtener datos de tendencias temporales.

**Query Parameters:**
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `period` | string | `7d` | `7d`, `30d`, `90d` |

**Response (200 OK):**
```json
[
  {
    "date": "2026-05-30",
    "reports_count": 12,
    "avg_severity": 2.5,
    "alerts": 45,
    "resolved": 42
  },
  {
    "date": "2026-05-31",
    "reports_count": 10,
    "avg_severity": 3.1,
    "alerts": 38,
    "resolved": 36
  }
]
```

---

## 🔔 Slack Integration

### Webhook de Eventos

**Endpoint:** `POST /slack/webhook`

**Descripción:** Recibir eventos de Slack.

**Headers:**
```
Content-Type: application/json
X-Slack-Signature: sha256=...  // Signing secret verification
X-Slack-Request-Timestamp: 1234567890
```

**Body (ejemplo de slash command):**
```json
{
  "token": "Slack_verification_token",
  "team_id": "T123456",
  "command": "/soc_status",
  "response_url": "https://hooks.slack.com/commands/...",
  "user_id": "U123456",
  "user_name": "analista",
  "channel_id": "C123456",
  "channel_name": "soc-monitor"
}
```

**Response (200 OK):**
```json
{
  "text": "✅ Sistema SOC Monitor en línea\n📊 Estado: Operativo",
  "response_type": "in_channel"
}
```

---

### Notificación de Alerta

**Endpoint:** `POST /slack/alert`

**Descripción:** Enviar alerta de alta severidad a Slack.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "report_id": 1,
  "severity": 8,
  "message": "Se detectó 50 intentos de login fallidos en el firewall",
  "channel": "C123456"  // opcional
}
```

**Response (200 OK):**
```json
{
  "status": "sent",
  "channel": "C123456",
  "timestamp": "2026-06-06T10:30:00Z"
}
```

---

## 🔍 Health Check

### Verificar Estado de la API

**Endpoint:** `GET /health`

**Descripción:** Endpoint de health check sin autenticación.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "app": "SOC Monitor",
  "version": "2.0.0"
}
```

---

## 📚 Schema Definitions

### User (Response)
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@local",
  "full_name": "Admin User",
  "role": "admin",  // admin, supervisor, operator
  "is_active": true,
  "created_at": "2026-06-01T00:00:00Z",
  "updated_at": "2026-06-01T00:00:00Z",
  "last_login": "2026-06-06T09:00:00Z",
  "slack_user_id": "U123456"
}
```

### Report (Full Response)
```json
{
  "id": 1,
  "operator_id": 2,
  "shift_date": "2026-06-06T00:00:00Z",
  "start_time": "2026-06-06T08:00:00Z",
  "end_time": "2026-06-06T16:00:00Z",
  "summary": "Monitoreo de firewall sin incidentes críticos",
  "status": "completed",  // draft, pending, approved, closed
  "severity": 2,  // 0-10
  "sla_deadline": "2026-06-06T20:00:00Z",
  "sla_violated": false,
  "auto_escalated": false,
  "novedades": [],  // array of objects
  "logs_revisados": [],  // array of strings
  "critical_cases": null,  // array of objects
  "resolution_time_minutes": null,
  "false_positive_rate": null,
  "escalation_count": 0,
  "tuning_suggestions": 0,
  "created_at": "2026-06-06T16:30:00Z",
  "updated_at": "2026-06-06T17:00:00Z"
}
```

### Token
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "username": "admin",
  "role": "admin"
}
```

---

## 🛡️ Seguridad

### Headers Requeridos

**Autenticación:**
```
Authorization: Bearer <token>
```

**Slack Verification:**
```
Content-Type: application/json
X-Slack-Signature: sha256=<signature>
X-Slack-Request-Timestamp: <timestamp>
```

### Code Status Codes

| Código | Descripción |
|--------|-------------|
| 200 | OK - Request exitoso |
| 201 | Created - Recurso creado |
| 204 | No Content - Eliminación exitosa |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Autenticación requerida |
| 403 | Forbidden - Permisos insuficientes |
| 404 | Not Found - Recurso no existe |
| 422 | Unprocessable Entity - Validación fallida |
| 500 | Internal Server Error - Error del servidor |

---

## 🧪 Testing con cURL

### Ejemplo Completo: Crear y Listar Reportes

```bash
# 1. Login
TOKEN=$(curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123" | \
  jq -r '.access_token')

# 2. Crear reporte
curl -X POST "http://localhost:8000/api/v1/reports" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shift_date": "2026-06-06T00:00:00Z",
    "start_time": "2026-06-06T08:00:00Z",
    "end_time": "2026-06-06T16:00:00Z",
    "summary": "Turno de monitoreo - Sin incidentes",
    "severity": 2
  }'

# 3. Listar reportes
curl -X GET "http://localhost:8000/api/v1/reports" \
  -H "Authorization: Bearer $TOKEN"

# 4. Obtener reporte
curl -X GET "http://localhost:8000/api/v1/reports/1" \
  -H "Authorization: Bearer $TOKEN"

# 5. Actualizar reporte
curl -X PUT "http://localhost:8000/api/v1/reports/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# 6. Obtener estadísticas
curl -X GET "http://localhost:8000/api/v1/stats/dashboard" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📖 Recursos Adicionales

- [OpenAPI Specification](http://localhost:8000/openapi.json)
- [Swagger UI](http://localhost:8000/docs)
- [Redoc](http://localhost:8000/redoc)

---

**Última actualización:** 06-JUN-2026  
**Versión:** 2.0.0  
**API Status:** Production Ready ✅
