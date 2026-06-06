# SOC Monitor Advanced - Sistema de Monitoreo SOC L1

## 📌 Información de Instalación

**Servidor:** 150.240.162.65  
**Usuario:** ubuntu  
**Fecha de instalación:** 04-Jun-2026  
**Directorio:** `/home/ubuntu/desarrollo/soc-monitor-advanced`

---

## 🐳 Dependencias Instaladas

| Componente | Versión | Estado |
|------------|---------|--------|
| **Docker** | 29.1.3 | ✅ Activo |
| **Docker Compose** | 2.40.3 | ✅ Activo |
| **Sistema Operativo** | Ubuntu 26.04 LTS | ✅ Soportado |

---

## 🚀 Despliegue

### Iniciar Servicios

```bash
cd /home/ubuntu/desarrollo/soc-monitor-advanced
docker-compose up -d --build
```

### Verificar Estado

```bash
docker-compose ps
```

### Ver Logs

```bash
docker-compose logs -f
```

### Detener Servicios

```bash
docker-compose down
```

---

## 🔧 Acceso a la Aplicación

- **API Health Check:** `http://150.240.162.65:8000/health`
- **Documentación OpenAPI:** `http://150.240.162.65:8000/docs`
- **Redis Commander:** `http://150.240.162.65:8081`

### Credenciales por Defecto

| Usuario | Contraseña |
|---------|------------|
| `admin` | `admin123` |
| `demo` | `demo123` |

---

## 📋 Comandos Útiles

### Rebuild de contenedores
```bash
docker-compose up -d --build
```

### Limpiar recursos
```bash
docker-compose down -v
docker system prune -a
```

### Ver imágenes
```bash
docker images | grep soc-monitor
```

### Ver contenedores (incluidos detenidos)
```bash
docker ps -a
```

### Ejecutar comandos en contenedor
```bash
docker exec -it soc-monitor-advanced-api-1 bash
docker exec -it soc-monitor-advanced-api-1 python --version
```

### Migrate base de datos
```bash
docker exec -it soc-monitor-advanced-api-1 alembic upgrade head
```

### Inicializar usuarios
```bash
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

## 📁 Estructura del Proyecto

```
/home/ubuntu/desarrollo/soc-monitor-advanced/
├── app/                        # Aplicación principal FastAPI
├── tests/                      # Tests unitarios y de integración
├── web/                        # Frontend React/Vite
├── alembic/                    # Migraciones de base de datos
├── docs/                       # Documentación
├── venv/                       # Entorno virtual (desarrollo local)
├── docker-compose.yml          # Orquestación de contenedores
├── Dockerfile                  # Construcción de imagen Docker
├── requirements.txt            # Dependencias de producción
├── .env                        # Variables de entorno (NO commit)
└── README.md                   # Este archivo
```

---

## ⚙️ Configuración

### Variables de Entorno

Editar archivo `.env` en el directorio del proyecto:

```bash
cd /home/ubuntu/desarrollo/soc-monitor-advanced
nano .env
```

**Importante:** Cambiar `SECRET_KEY` por una clave segura antes de producción.

### Puertos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| API | 8000 | FastAPI REST API |
| Redis Commander | 8081 | Interfaz web de Redis |
| PostgreSQL | 5432 | Base de datos (interno) |
| Redis | 6379 | Cache (interno) |

---

## 🔍 Troubleshooting

### Verificar que los contenedores estén corriendo
```bash
docker-compose ps
```

### Ver logs de errores
```bash
docker-compose logs api
```

### Reiniciar contenedores
```bash
docker-compose restart
```

### Limpiar y reiniciar
```bash
docker-compose down -v
docker-compose up -d --build
```

### Verificar puertos
```bash
sudo netstat -tlnp | grep :8000
sudo netstat -tlnp | grep :8081
```

---

## 📊 Monitorización

### Estado del sistema
```bash
docker system df
docker stats
```

### Espacio en disco
```bash
df -h
```

### Logs recientes
```bash
journalctl -u docker -f
```

---

## 📚 Documentación Adicional

- **Guía de Reportes:** `docs/REPORTES.md`
- **Arquitectura:** `docs/architecture.md`
- **Configuración Paso a Paso:** `docs/CONFIGURACION_PASO_A_PASO.md`
- **Frontend Setup:** `FRONTEND_SETUP.md`

---

## 🤝 Soporte

Para soporte o preguntas sobre la instalación:

1. Revisar logs: `docker-compose logs`
2. Verificar configuración en `.env`
3. Consultar documentación en `docs/`

---

## 📝 Notas

- Este despliegue está optimizado para producción
- Las variables de entorno en `.env` NO deben ser versionadas
- Realizar backups regulares de la base de datos PostgreSQL
- Monitorear uso de recursos regularmente

---

**Autor:** Walter Rios  
**Tecnología:** FastAPI, PostgreSQL, Redis, Docker, React  
**Versión:** 2.0.0
