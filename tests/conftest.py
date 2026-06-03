"""
Fixtures para tests
"""
import pytest
from unittest.mock import MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.session import Base, SessionLocal
from app.db.models.user import User
from app.core.security import get_password_hash


@pytest.fixture
def db_session():
    """Fixture para base de datos de prueba"""
    engine = create_engine("sqlite:///./test.db")
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Crear tablas
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


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
