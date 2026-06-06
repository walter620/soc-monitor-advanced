# 🚀 Inicio Rápido - SOC Monitor Advanced

## Problemática Detectada
La aplicación no arrancaba porque las dependencias de Python no estaban instaladas. Se creó un virtualenv en `/Users/walterrios1/Desarrollo/soc-monitor-advanced/venv` y se instalaron todas las dependencias necesarias.

## Estado Actual
✅ **Aplicación funcionando correctamente**
- API disponible en: `http://localhost:8000`
- Documentación disponible en: `http://localhost:8000/docs`
- Swagger UI en: `http://localhost:8000/redoc`
- Endpoint de health check: `http://localhost:8000/health`
- Status: `{'status': 'healthy', 'app': 'SOC Monitor Advanced', 'version': '2.0.0'}`

## Cómo Iniciar la Aplicación

### Opción 1: Usar el script de inicio (Recomendado)
```bash
cd /Users/walterrios1/Desarrollo/soc-monitor-advanced
./start.sh
```

### Opción 2: Manual con virtualenv
```bash
cd /Users/walterrios1/Desarrollo/soc-monitor-advanced

# Activar virtualenv
source venv/bin/activate

# Iniciar la aplicación
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Opción 3: Sin activar virtualenv explícitamente
```bash
cd /Users/walterrios1/Desarrollo/soc-monitor-advanced
./venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Verificaciones Realizadas
- ✅ Virtualenv creado en `venv/`
- ✅ Todas las dependencias de `requirements.txt` instaladas
- ✅ API FastAPI iniciando correctamente
- ✅ Endpoints disponibles y respondiendo
- ✅ CORS configurado para `http://localhost:3000` y `http://localhost:8000`

## Estructura del Proyecto
```
soc-monitor-advanced/
├── app/                    # Código Python (FastAPI)
│   ├── main.py            # Punto de entrada de la API
│   ├── api/               # Routers y endpoints
│   ├── core/              # Configuración y utilidad
│   ├── db/                # Base de datos
│   └── ...
├── web/                    # Frontend (React + Vite)
├── venv/                   # Virtualenv de Python
├── requirements.txt        # Dependencias Python
├── start.sh                # Script de inicio
└── .env                    # Variables de entorno (NO COMMITTEE)
```

## Configuración
La aplicación requiere un archivo `.env` con las siguientes variables:
- `DATABASE_URL`: URL de la base de datos PostgreSQL
- `SECRET_KEY`: Clave secreta para JWT
- `SLACK_BOT_TOKEN`: Token del bot de Slack
- `SLACK_TEAM_ID`: ID del equipo de Slack

## Depuración
Si encuentras problemas al iniciar:

1. **Verificar virtualenv**:
   ```bash
   ./venv/bin/python --version
   ```

2. **Verificar dependencias instaladas**:
   ```bash
   ./venv/bin/python -m pip list
   ```

3. **Verificar logs**:
   ```bash
   # Los logs aparecen en la terminal donde se ejecutó uvicorn
   ```

4. **Reinstalar dependencias**:
   ```bash
   rm -rf venv/
   ./start.sh
   ```

## Próximos Pasos
1. Configurar las variables de entorno en `.env`
2. Verificar que la base de datos esté disponible
3. Configurar el webhook de Slack si es necesario
4. Probar los endpoints con `http://localhost:8000/docs`

## Notas Importantes
- **NO** commitear el archivo `.env` (está en `.gitignore`)
- **NO** commitear el directorio `venv/`
- Usar `./start.sh` para asegurar que siempre se usa el virtualenv correcto
