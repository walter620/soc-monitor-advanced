"""
Fixtures para tests
"""
import pytest
import os
from unittest.mock import MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.session import Base, SessionLocal
from app.db.models.user import User
from app.core.security import get_password_hash


# Configurar pytest-asyncio
pytest_plugins = ('pytest_asyncio',)


@pytest.fixture(scope="session")
def anyio_backend():
    """Backend para pytest-asyncio"""
    return "asyncio"


@pytest.fixture
def db_session():
    """Fixture para base de datos de prueba usando SQLite"""
    # Usar SQLite para tests sin dependencia de PostgreSQL
    engine = create_engine(
        "sqlite:///./test.db",
        connect_args={"check_same_thread": False}
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Crear tablas
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        # Limpiar archivo de DB
        if os.path.exists("./test.db"):
            os.remove("./test.db")


@pytest.fixture
def sample_user(db_session):
    """Fixture para usuario de prueba"""
    user = User(
        username="testuser",
        email="test@example.com",
        full_name="Test User",
        role="operator"
    )
    user.set_password("testpass123")
    
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    return user


@pytest.fixture
def mock_slack_client():
    """Mock para cliente de Slack"""
    mock = MagicMock()
    mock.chat_postMessage = MagicMock(return_value={"ok": True})
    return mock


@pytest.fixture
def client():
    """Fixture para cliente HTTP de prueba"""
    from httpx import AsyncClient
    from app.main import app
    
    async def _get_client():
        async with AsyncClient(app=app, base_url="http://test") as ac:
            yield ac
    
    return _get_client
