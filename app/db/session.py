"""
Inicilización de la base de datos y configuración de SQLAlchemy
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, scoped_session
from sqlalchemy.pool import QueuePool

from app.core.config import settings

# Crear engine con connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True,  # Verificar conexión antes de usar
    pool_recycle=3600,   # Recrear conexión cada hora
    echo=settings.DEBUG  # Logs SQL en debug mode
)

# Crear session factory con scoped_session para thread safety
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session_scope = scoped_session(SessionLocal)

# Base clase para modelos
Base = declarative_base()


def get_db():
    """Dependency para obtener sesión de DB con contexto"""
    db = session_scope()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Inicializar base de datos (crear tablas)"""
    from sqlalchemy import inspect
    inspector = inspect(engine)
    if not inspector.get_table_names():
        Base.metadata.create_all(bind=engine)
        print("✅ Base de datos inicializada")
    else:
        print("ℹ️  Base de datos ya existe")


def cleanup_db():
    """Limpiar base de datos (drop todas las tablas)"""
    Base.metadata.drop_all(bind=engine)
    print("🗑️  Base de datos eliminada")
