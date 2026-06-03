# 📝 GUÍA PASO A PASO - CONFIGURAR SOC MONITOR ADVANCED

## 🎯 ¿QUÉ ACABAS DE HACER?

Te explico lo que acabamos de hacer juntos:

### ✅ PASO 1: Verificar el proyecto
**Comando:** `cd /Users/walterrios1/soc-monitor-advanced`
- Entramos a la carpeta donde creé el sistema
- Es como abrir una carpeta en Finder

### ✅ PASO 2: Copiar configuración
**Comando:** `cp .env.example .env`
- Copié un archivo de ejemplo llamado `.env.example`
- Lo llamé `.env` (que es como debe llamarse para que el programa lo lea)

### ✅ PASO 3: Configurar credenciales de prueba
Ya creé un archivo `.env` con valores para **pruebas locales**

---

## 📋 LO QUE SIGNIFICA CADA COSA

### 📄 Archivo `.env`
Es como un **archivo de configuración secreta** donde guardas:
- Contraseñas de base de datos
- Claves de Slack
- URLs de servicios

**No compartas este archivo con nadie** (ya tiene contraseñas)

### 🔑 Variables Principales

| Variable | ¿Qué es? | ¿Para qué sirve? |
|----------|----------|------------------|
| `APP_NAME` | Nombre del programa | Aparece en logs y mensajes |
| `SECRET_KEY` | Clave secreta | Para encriptar contraseñas y tokens |
| `DATABASE_URL` | Conexión a BD | Cómo conectarse a PostgreSQL |
| `SLACK_BOT_TOKEN` | Clave de Slack | Para que el bot pueda enviar mensajes |

---

## 🚀 ¿CÓMO USAR ESTO AHORA?

### OPCIÓN A: Docker (Recomendado - Más Fácil)

```bash
# 1. Ir a la carpeta del proyecto
cd /Users/walterrios1/soc-monitor-advanced

# 2. Iniciar todo con Docker
docker-compose up -d

# 3. Esperar 30 segundos...
# (Docker descarga PostgreSQL, Redis y la API)

# 4. Verificar que esté funcionando
curl http://localhost:8000/health
```

### OPCIÓN B: Desarrollo Local (Más Control)

**Requisitos previos:**
- PostgreSQL instalado
- Redis instalado
- Python 3.11+

```bash
# 1. Instalar PostgreSQL y Redis (si no los tienes)
brew install postgresql redis

# 2. Iniciar servicios
brew services start postgresql
brew services start redis

# 3. Crear base de datos
createdb soc_monitor

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Iniciar aplicación
uvicorn app.main:app --reload

# 6. En otra ventana, verificar
curl http://localhost:8000/health
```

---

## 📊 ¿QUÉ PASA CUANDO USAS `docker-compose up`?

Cuando ejecutas ese comando, **Docker hace esto automáticamente**:

```
┌─────────────────────────────────────────┐
│ 1. Descarga imágenes (si no las tienes)│
│    - PostgreSQL (base de datos)         │
│    - Redis (caché)                      │
│    - Python API (tu aplicación)         │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 2. Crea contenedores (máquinas virtuales│
│    pequeñas) para cada servicio          │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 3. Los conecta entre sí en red privada  │
│    - La API puede hablar con PostgreSQL │
│    - La API puede hablar con Redis      │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 4. Inicia todos los servicios           │
│    - PostgreSQL: listo para datos       │
│    - Redis: listo para caché            │
│    - API: lista en puerto 8000          │
└─────────────────────────────────────────┘
```

---

## 🎮 CÓMO PROBAR QUE FUNCIONA

### Paso 1: Verificar que la API esté en línea

```bash
curl http://localhost:8000/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "app": "SOC Monitor Advanced",
  "version": "2.0.0"
}
```

### Paso 2: Abrir documentación de la API

Abre tu navegador en:
```
http://localhost:8000/docs
```

**Verás:**
- Lista de todos los endpoints
- Botón "Try it out" para probar cada función
- Opciones para registrar usuarios, crear reportes, etc.

### Paso 3: Probar autenticación

En la misma página de docs, ve a `/api/v1/auth/register`:

1. Click en **"Try it out"**
2. Rellena con:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123456",
  "full_name": "Test User"
}
```
3. Click en **"Execute"**
4. **Deberías ver:** `201 Created` con los datos del usuario

### Paso 4: Iniciar sesión

Ve a `/api/v1/auth/login`:

1. Click en **"Try it out"**
2. Rellena:
```
username: admin
password: admin123
```
3. Click en **"Execute"**
4. **Deberías ver:** un token JWT (empieza con `eyJ...`)

---

## 📚 RESUMEN VISUAL

```
┌─────────────────────────────────────────────────────────┐
│ 1. YA TIENES EL PROYECTO EN:                            │
│    /Users/walterrios1/soc-monitor-advanced/             │
│                                                          │
│    ✓ 41 archivos creados                               │
│    ✓ 29 archivos Python                                 │
│    ✓ Configuración lista                                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ 2. CONFIGURACIÓN (.env)                                 │
│    ✓ Ya creado con valores de prueba                    │
│    ⚠️ Cambia contraseñas antes de producción           │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ 3. ¿QUÉ HACER DESPUÉS?                                  │
│                                                          │
│    Opción fácil (Docker):                               │
│      cd /Users/walterrios1/soc-monitor-advanced        │
│      docker-compose up -d                              │
│      → Abre: http://localhost:8000/docs                │
│                                                          │
│    Opción avanzada (Local):                             │
│      1. Instalar PostgreSQL y Redis                     │
│      2. Instalar Python 3.11+                           │
│      3. pip install -r requirements.txt                │
│      4. uvicorn app.main:app --reload                  │
└─────────────────────────────────────────────────────────┘
```

---

## ❓ ¿QUÉ PASA SI...?

### ❓ "No entiendo Docker"
No hay problema, puedes instalarlo:
```bash
brew install --cask docker
```
Luego abre la aplicación "Docker Desktop" y listo.

### ❓ "Tengo errores al iniciar"
1. Verifica que PostgreSQL esté corriendo:
   ```bash
   brew services list | grep postgresql
   ```
2. Verifica que Redis esté corriendo:
   ```bash
   brew services list | grep redis
   ```
3. O usa Docker que lo hace todo automáticamente

### ❓ "Quiero usar Slack real"
1. Ve a https://api.slack.com/apps
2. Crea un nuevo app
3. Obtén el Bot Token y Signing Secret
4. Edita el archivo `.env`:
   ```
   SLACK_BOT_TOKEN=xoxb-tu-token-real
   SLACK_SIGNING_SECRET=your-signing-secret
   ```

---

## 🎯 TU SIGUIENTE PASO

Elige una opción:

**Opción A: Probar con Docker (recomendado)**
```bash
cd /Users/walterrios1/soc-monitor-advanced
docker-compose up -d
```
→ Abre: http://localhost:8000/docs

**Opción B: Ayuda con instalación**
Si quieres que te ayude a instalar PostgreSQL y Redis en tu Mac, dime:
- "Instálame los servicios"

**Opción C: Explicar más**
Si quieres que te explique algo más en detalle, dime qué:
- Docker
- Variables de entorno
- API
- Base de datos

---

## 📞 ¿NECESITAS AYUDA?

Si te atascas en algún paso:
1. Dime **qué comando ejecutaste**
2. Dime **qué error apareció** (copia y pega el texto)
3. Te ayudo a solucionarlo

---

**Última actualización:** 02/06/2026  
**Vista:** Esta guía está en `/Users/walterrios1/soc-monitor-advanced/docs/CONFIGURACION_PASO_A_PASO.md`
