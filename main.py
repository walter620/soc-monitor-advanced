"""
Aplicación principal FastAPI con Slack integration
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.core.exceptions import CustomException
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan handler para inicialización"""
    # Startup
    print(f"🚀 Iniciando {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"📝 Mode: {'Debug' if settings.DEBUG else 'Production'}")
    
    yield
    
    # Shutdown
    print("👋 Cerrando aplicación...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API para gestión de monitoreo SOC L1 con integración Slack",
    lifespan=lifespan
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080", "*"],  # Configurar según entorno
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware de seguridad - EXCEPTO para /health
if not settings.DEBUG:
    # Definir hosts permitidos
    allowed_hosts = ["localhost", "127.0.0.1", "150.240.162.65"]
    
    # Agregar TrustedHostMiddleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=allowed_hosts
    )


# Rutas de la API
app.include_router(api_router, prefix="/api/v1")


# Exception handlers
@app.exception_handler(CustomException)
async def custom_exception_handler(request, exc: CustomException):
    """Manejar excepciones personalizadas"""
    return {
        "detail": exc.message,
        "status_code": exc.status_code,
        "details": exc.details
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    """Manejar excepciones no manejadas"""
    import traceback
    traceback.print_exc()
    return {
        "detail": "Error interno del servidor",
        "status_code": 500
    }


# Health check - EXCLUIDO de TrustedHost verificación
@app.get("/health")
async def health_check():
    """Endpoint de health check (público, no requiere autenticación)"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        workers=4 if not settings.DEBUG else 1
    )
