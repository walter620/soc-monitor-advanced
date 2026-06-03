# API Documentation - SOC Monitor Advanced

## 📡 Base URL

```
Development: http://localhost:8000
Production:  https://api.soc-monitor.com
```

## 📚 Endpoints

### Autenticación

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "User Full Name",
  "role": "operator"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "username": "newuser",
  "email": "user@example.com",
  "full_name": "User Full Name",
  "role": "operator",
  "is_active": true,
  "created_at": "2026-06-02T10:00:00"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin123
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

**Response:** `200 OK`

---

### Reportes

#### Create Report
```http
POST /api/v1/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "shift_date": "2026-06-02T08:00:00",
  "start_time": "2026-06-02T08:00:00",
  "end_time": "2026-06-02T20:00:00",
  "summary": "Resumen de actividades del turno",
  "novedades": [
    {
      "description": "Alerta de firewall bloqueada",
      "severity": 7,
      "qradar_alerts": "12345, 12346",
      "notified": true
    }
  ],
  "logs_revisados": [
    {
      "description": "Proceso sshd normal",
      "level": "INFO",
      "source": "Firewall",
      "action_taken": true
    }
  ]
}
```

#### List Reports
```http
GET /api/v1/reports?skip=0&limit=100
Authorization: Bearer <token>
```

#### Get Report
```http
GET /api/v1/reports/{report_id}
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "operator_id": 1,
  "shift_date": "2026-06-02T08:00:00",
  "status": "pending",
  "severity": 7,
  "sla_violated": false,
  "novedades": [...],
  "logs_revisados": [...]
}
```

#### Update Report
```http
PUT /api/v1/reports/{report_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "summary": "Nuevo resumen actualizado"
}
```

#### Delete Report
```http
DELETE /api/v1/reports/{report_id}
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

### Estadísticas

#### Dashboard Stats
```http
GET /api/v1/stats/dashboard
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "total_reports": 150,
  "by_status": {
    "draft": 5,
    "pending": 12,
    "approved": 89,
    "closed": 44
  },
  "sla_violated": 3,
  "high_severity": 8
}
```

#### Top Offenses
```http
GET /api/v1/stats/top-offenses?days=30
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {"severity": 8, "count": 15},
  {"severity": 7, "count": 28},
  {"severity": 5, "count": 45}
]
```

#### SLA Compliance
```http
GET /api/v1/stats/sla-compliance?days=30
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "period_days": 30,
  "total_with_sla": 45,
  "violated": 3,
  "compliance_rate": 93.33
}
```

---

### Slack Integration

#### Events Webhook
```http
POST /api/v1/slack/events
Content-Type: application/json
X-Slack-Signature: v0=...
X-Slack-Request-Timestamp: 1234567890

{
  "token": "slack-webhook-token",
  "team_id": "T123456",
  "api_app_id": "A123456",
  "event": {
    "type": "message",
    "text": "!soc help",
    "user": "U123456",
    "channel": "C123456"
  }
}
```

#### Slash Commands

**/soc_status**
```
/post /api/v1/slack/events
{
  "command": "/soc_status",
  "text": "",
  "user_name": "john.doe",
  "channel_name": "#soc-alerts"
}
```

**/soc_alerts**
```
/post /api/v1/slack/events
{
  "command": "/soc_alerts",
  "text": "",
  "user_name": "john.doe",
  "channel_name": "#soc-alerts"
}
```

---

## 🔐 Autenticación

### JWT Token Flow

1. **Login** obtiene access token
2. **Use token** en Authorization header
3. **Token expiration** es 30 minutos
4. **Refresh** con nuevo login cuando expira

### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

---

## ⚠️ Errores

### Response Codes

| Code | Descripción |
|------|-------------|
| 200 | OK - Request exitoso |
| 201 | Created - Recurso creado |
| 204 | No Content - Eliminado exitosamente |
| 400 | Bad Request - Request inválido |
| 401 | Unauthorized - Sin autenticación |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Recurso existente |
| 500 | Internal Server Error - Error del servidor |

### Error Response Format
```json
{
  "detail": "Mensaje de error",
  "status_code": 400,
  "details": {}
}
```

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Ejecutar todos los tests
pytest tests/ -v

# Con cobertura
pytest tests/ -v --cov=app --cov-report=html
```

### Ejemplo de Test
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_endpoint():
    async with AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            data={"username": "admin", "password": "admin123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
```

---

## 📊 Rate Limiting

### Límites Actuales
- 100 requests/minute por IP
- 1000 requests/day por user

### Headers de Rate Limit
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## 📅 Versionado

### Current Version: v1
- `/api/v1/` - Version actual
- `deprecation-headers` - Para endpoints legacy
- `changelog` - Documentar cambios mayores

---

**Documentación Generada:** 02/06/2026  
**API Version:** 1.0.0  
**Base:** FastAPI OpenAPI 3.0
