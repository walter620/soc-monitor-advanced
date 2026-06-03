"""
Configuración segura del proyecto con variables de entorno
"""
import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """Configuración del proyecto desde variables de entorno"""
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    # Aplicación
    APP_NAME: str = Field(default="SOC Monitor Advanced", description="Nombre de la aplicación")
    APP_VERSION: str = Field(default="2.0.0", description="Versión de la aplicación")
    DEBUG: bool = Field(default=False, description="Modo debug")
    
    # Seguridad
    SECRET_KEY: str = Field(..., description="Clave secreta para JWT (32 bytes mínimo)")
    ALGORITHM: str = Field(default="HS256", description="Algoritmo de encriptación")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, description="Expiración token")
    
    # Base de datos
    DATABASE_URL: str = Field(
        default="postgresql://user:password@localhost:5432/soc_monitor",
        description="URL de conexión PostgreSQL"
    )
    DATABASE_POOL_SIZE: int = Field(default=10, description="Tamaño del pool de conexiones")
    DATABASE_MAX_OVERFLOW: int = Field(default=20, description="Máximo overflow del pool")
    
    # Slack (opcional - deshabilitado en modo desarrollo)
    SLACK_BOT_TOKEN: str = Field(default="", description="Slack Bot Token (xoxb-...)")
    SLACK_SIGNING_SECRET: str = Field(default="", description="Slack Signing Secret")
    SLACK_APP_TOKEN: str = Field(default="", description="Slack App Level Token (xapp-...)")
    SLACK_CHANNEL_ID: str = Field(default="", description="Canal de notificaciones")
    
    # Redis (para caching y session storage)
    REDIS_URL: str = Field(default="redis://localhost:6379/0", description="URL de conexión a Redis")
    
    # CORS
    CORS_ORIGINS: list[str] = Field(default=["http://localhost:3000"], description="Origens permitidos")
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO", description="Nivel de logging")
    LOG_FILE: str = Field(default="/var/log/soc-monitor/app.log", description="Archivo de logs")
    
    # SLA
    SLA_DEFAULT_HOURS: int = Field(default=4, description="SLA por defecto en horas")
    SLA_CRITICAL_THRESHOLD: int = Field(default=7, description="Umbral severidad crítica (7+)")


@lru_cache()
def get_settings() -> Settings:
    """Obtener configuración cachada"""
    return Settings()


settings = get_settings()
