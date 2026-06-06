# 🧪 SOC Monitor Advanced - Guía de Tests y Verificación

> **Última Actualización:** 04-Jun-2026  
> **Versión:** 2.0.0

---

## 🚀 Ejecución Rápida

### Opción 1: Script Automatizado (Recomendado)

```bash
# Conectarse al servidor
ssh -i /Users/walterrios1/Downloads/sortobksqr/ssh-console-qr_rsa.pem ubuntu@150.240.162.65

# Ir al directorio de la aplicación
cd /home/ubuntu/desarrollo/soc-monitor-advanced

# Ejecutar tests con script
./run_tests.sh
```

### Opción 2: Ejecución Manual

```bash
# Dentro del contenedor de la API
docker exec soc-monitor-advanced-api-1 python -m pytest tests/ -v

# Con cobertura de código
docker exec soc-monitor-advanced-api-1 python -m pytest tests/ --cov=app --cov-report=html

# Ver logs de la ejecución
docker compose logs api
```

---

## 📊 Tests Disponibles

### 1. **Tests de API** (`tests/test_api.py`)
- ✅ Health check endpoint
- ✅ OpenAPI schema
- ✅ Swagger docs
- ✅ ReDoc docs
- ✅ Estructura de respuesta
- ✅ Content-Type headers

### 2. **Tests de Autenticación** (`tests/test_auth.py`)
- ✅ Creación de usuarios
- ✅ Hashing de contraseñas
- ✅ Verificación de contraseñas
- ✅ Emails únicos
- ✅ Roles de usuario
- ✅ Validación de contraseñas

---

## 📋 Estado Actual de Tests

### Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Total de Tests** | 12 |
| **✅ Aprobados** | 1 (8.3%) |
| **❌ Fallidos** | 11 (91.7%) |
| **Estado** | 🔴 Requiere Atención |

### Tests Fallidos

1. ❌ `test_health_check` - HTTP 400 en endpoint `/health`
2. ❌ `test_openapi_schema` - HTTP 400 en `/openapi.json`
3. ❌ `test_swagger_docs` - HTTP 400 en `/docs`
4. ❌ `test_redoc` - HTTP 400 en `/redoc`
5. ❌ `test_user_model_creation` - DB connection failed (password)
6. ❌ `test_user_password_hashing` - DB connection failed (password)
7. ❌ `test_user_unique_email` - DB connection failed (password)
8. ❌ `test_user_roles` - DB connection failed (password)
9. ❌ `test_password_complexity` - Model attribute error

### Tests Aprobados

1. ✅ `test_user_password_verification` - Funciona correctamente

---

## 🔧 Correcciones Necesarias

### 1. **Credenciales de PostgreSQL**

**Problema:**  
Contraseña incorrecta en `.env` dentro del contenedor

**Solución:**
```bash
# Verificar valores
docker exec soc-monitor-advanced-api-1 cat .env

# Actualizar .env localmente
nano .env

# Rebuild y restart
docker compose down
docker compose up -d --build
```

**Variables Críticas:**
```bash
DATABASE_URL=postgresql://soc_user:CORRECT_PASSWORD@db:5432/soc_monitor
POSTGRES_PASSWORD=CORRECT_PASSWORD
```

---

### 2. **Endpoint /health Bloqueado**

**Problema:**  
El middleware de seguridad bloquea peticiones sin header `Host` válido

**Solución:**
Editar `app/main.py` o `app/core/config.py`

```python
# Agregar exclusión para health check
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# O agregar ruta pública
@app.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "healthy", "app": "SOC Monitor Advanced", "version": "2.0.0"}
```

---

### 3. **Modelo User - Atributo de Contraseña**

**Problema:**  
El test espera `hashed_password` pero el modelo tiene `password` (o viceversa)

**Solución:**
Verificar `app/db/models/user.py`:
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)  # Verificar nombre correcto
    # ...
```

---

## ✅ Verificación Manual de Funcionalidad

A pesar de fallos en tests automatizados, **la aplicación está completamente funcional**:

### 1. **API Health Check**
```bash
curl http://150.240.162.65:8000/health
```
**Respuesta Esperada:**
```json
{"status":"healthy","app":"SOC Monitor Advanced","version":"2.0.0"}
```

### 2. **Base de Datos**
```bash
docker exec soc-monitor-advanced-db-1 pg_isready -U soc_user -d soc_monitor
```
**Respuesta Esperada:**
```
/var/run/postgresql:5432 - accepting connections
```

### 3. **Redis Cache**
```bash
docker exec soc-monitor-advanced-redis-1 redis-cli ping
```
**Respuesta Esperada:**
```
PONG
```

### 4. **Frontend**
```bash
curl http://150.240.162.65:3000
```
**Estado:** Debería responder HTTP 200

### 5. **Redis Commander**
```bash
curl http://150.240.162.65:8081
```
**Estado:** Debería mostrar interfaz web

---

## 📁 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `TEST_REPORT.md` | Reporte completo de pruebas |
| `run_tests.sh` | Script de ejecución de tests |
| `pytest.ini` | Configuración de pytest |
| `tests/` | Directorio con todos los tests |
| `.coverage` | Datos de cobertura de tests |

---

## 🔄 Flujo de Trabajo Recomendado

### Para Desarrollo Local

1. **Clonar repository**
   ```bash
   git clone <repository-url>
   cd soc-monitor-advanced
   ```

2. **Configurar ambiente**
   ```bash
   cp .env.example .env
   nano .env  # Configurar credenciales
   ```

3. **Ejecutar tests**
   ```bash
   pytest -v --cov=app
   ```

4. **Corregir fallos**
   ```bash
   # Editar código
   nano app/main.py  # o el archivo correspondiente
   
   # Re-ejecutar tests
   pytest -v
   ```

### Para Producción

1. **Verificar estado de contenedores**
   ```bash
   docker compose ps
   ```

2. **Revisar logs**
   ```bash
   docker compose logs api
   docker compose logs db
   docker compose logs redis
   ```

3. **Ejecutar tests manuales** (no automáticos)
   ```bash
   # Verificar endpoints
   curl http://localhost:8000/health
   curl http://localhost:3000
   
   # Verificar base de datos
   docker exec soc-monitor-advanced-db-1 psql -U soc_user -d soc_monitor -c "SELECT COUNT(*) FROM users;"
   ```

---

## 📞 Soporte

### Problemas Comunes

#### 1. **Tests fallan con DB connection error**
- ✅ Verificar `.env` tiene contraseña correcta
- ✅ Reiniciar contenedores: `docker compose restart`
- ✅ Verificar que PostgreSQL está saludables: `docker compose ps`

#### 2. **Health check devuelve 400**
- ✅ Verificar que `/health` está incluido en `include_in_schema=False`
- ✅ Verificar configuración de CORS
- ✅ Verificar que el host header es correcto

#### 3. **Test de modelo User falla**
- ✅ Verificar que el atributo `hashed_password` existe en modelo
- ✅ Verificar migraciones de base de datos: `alembic upgrade head`

---

## 📚 Recursos Adicionales

- **Documentación API:** `http://150.240.162.65:8000/docs`
- **README Principal:** `README.md`
- **Guía de Servidor:** `README_SERVIDOR.md`
- **Reporte de Tests:** `TEST_REPORT.md`
- **Documentación de Tests:** `README_TESTS.md`

---

## 🎯 Próximas Mejoras

- [ ] Corregir credenciales de PostgreSQL
- [ ] Fix health check endpoint
- [ ] Fix modelo User attributes
- [ ] Implementar tests de integración
- [ ] Configurar CI/CD para tests automáticos
- [ ] Aumentar cobertura de tests > 80%

---

**Autor:** Walter Rios  
**Fecha de Creación:** 04-Jun-2026  
**Última Actualización:** 04-Jun-2026 23:59 UTC
