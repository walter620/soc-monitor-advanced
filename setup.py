#!/usr/bin/env python3
"""
Script de inicialización del sistema SOC Monitor Advanced
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.db.session import init_db, engine
from app.db.models import User
from app.core.security import get_password_hash
from sqlalchemy import inspect


def check_dependencies():
    """Verificar dependencias instaladas"""
    required = ["fastapi", "uvicorn", "sqlalchemy", "pydantic"]
    missing = []
    
    for pkg in required:
        try:
            __import__(pkg)
        except ImportError:
            missing.append(pkg)
    
    if missing:
        print(f"❌ Dependencias faltantes: {', '.join(missing)}")
        print("Ejecuta: pip install -r requirements.txt")
        return False
    
    print("✅ Todas las dependencias están instaladas")
    return True


def initialize_database():
    """Inicializar base de datos"""
    print("🔄 Inicializando base de datos...")
    
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    if tables:
        print(f"⚠️  Base de datos ya existe con {len(tables)} tablas")
        print("Ejecutando migrations de Alembic...")
        
        # Ejecutar migrations
        from alembic.config import Config
        from alembic import command
        
        alembic_cfg = Config(str(Path(__file__).parent / "alembic.ini"))
        command.upgrade(alembic_cfg, "head")
        print("✅ Migrations ejecutadas correctamente")
    else:
        print("🆕 Creando nuevas tablas...")
        init_db()
        print("✅ Tablas creadas exitosamente")


def create_admin_user():
    """Crear usuario admin por defecto"""
    print("👤 Creando usuario admin por defecto...")
    
    from app.db.session import SessionLocal
    db = SessionLocal()
    
    # Verificar si ya existe
    existing = db.query(User).filter(User.username == "admin").first()
    if existing:
        print("⚠️  Usuario admin ya existe")
        db.close()
        return
    
    # Crear admin
    admin = User(
        username="admin",
        email="admin@soc-monitor.local",
        full_name="Administrador del Sistema",
        role="admin"
    )
    admin.set_password("admin123")  # Cambiar en producción
    
    db.add(admin)
    db.commit()
    db.close()
    
    print("✅ Usuario admin creado")
    print("   Email: admin@soc-monitor.local")
    print("   Password: admin123 (¡CAMBIAR EN PRODUCCIÓN!)"  )

def create_demo_user():
    """Crear usuario demo para pruebas"""
    print("👤 Creando usuario demo...")
    
    from app.db.session import SessionLocal
    db = SessionLocal()
    
    # Verificar si ya existe
    existing = db.query(User).filter(User.username == "demo").first()
    if existing:
        print("⚠️  Usuario demo ya existe")
        db.close()
        return
    
    # Crear demo
    demo = User(
        username="demo",
        email="demo@soc-monitor.local",
        full_name="Usuario Demo",
        role="operator"
    )
    demo.set_password("demo123")
    
    db.add(demo)
    db.commit()
    db.close()
    
    print("✅ Usuario demo creado")
    print("   Email: demo@soc-monitor.local")
    print("   Password: demo123 (¡CAMBIAR EN PRODUCCIÓN!)"  )


def show_setup_complete():
    """Mostrar mensaje de configuración completada"""
    print("\n" + "=" * 60)
    print("✅ CONFIGURACIÓN COMPLETADA")
    print("=" * 60)
    print("\n📋 Información de acceso:")
    print("  • URL API: http://localhost:8000")
    print("  • Docs:   http://localhost:8000/docs")
    print("  • Health: http://localhost:8000/health")
    print("\n👤 Usuarios por defecto:")
    print("  • admin / admin123 (Administrador)")
    print("  • demo  / demo123  (Operador)")
    print("\n⚠️  IMPORTANTE:")
    print("  • Cambiar todas las contraseñas en producción")
    print("  • Configurar variables de entorno seguras")
    print("  • Revisar docker-compose.yml para producción")
    print("\n" + "=" * 60)


def main():
    """Función principal"""
    print("\n🚀 Iniciando configuración de SOC Monitor Advanced...")
    print("=" * 60)
    
    # Verificar dependencias
    if not check_dependencies():
        sys.exit(1)
    
    # Inicializar base de datos
    initialize_database()
    
    # Crear usuarios
    create_admin_user()
    create_demo_user()
    
    # Mostrar mensaje final
    show_setup_complete()


if __name__ == "__main__":
    main()
