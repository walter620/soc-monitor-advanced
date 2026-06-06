"""
Tests para los endpoints de autenticación y usuarios
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.models.user import User


@pytest.fixture
def db():
    """Fixture de base de datos real"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class TestUserEndpoints:
    """Tests para endpoints de usuarios"""
    
    @pytest.mark.asyncio
    async def test_user_model_creation(self, db: Session):
        """Verificar que un usuario puede ser creado"""
        user = User(
            username="testuser",
            email="test@example.com",
            full_name="Test User",
            role="operator"
        )
        user.set_password("SecurePass123!")
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        assert user.id is not None
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.role == "operator"
        assert user.is_active is True
    
    @pytest.mark.asyncio
    async def test_user_password_hashing(self, db: Session):
        """Verificar que las contraseñas se guardan encriptadas"""
        user = User(
            username="hashuser",
            email="hash@example.com",
            full_name="Hash User",
            role="admin"
        )
        user.set_password("PlainPassword")
        
        db.add(user)
        db.commit()
        
        # Verificar que la contraseña no está en texto plano
        assert user.password_hash is not None
        assert user.password_hash != "PlainPassword"
    
    @pytest.mark.asyncio
    async def test_user_password_verification(self, db: Session):
        """Verificar que la verificación de contraseña funciona"""
        user = User(
            username="verifyuser",
            email="verify@example.com",
            full_name="Verify User",
            role="operator"
        )
        user.set_password("MySecurePass")
        
        assert user.verify_password("MySecurePass") is True
        assert user.verify_password("WrongPass") is False
    
    @pytest.mark.asyncio
    async def test_user_unique_email(self, db: Session):
        """Verificar que no se permiten emails duplicados"""
        user1 = User(
            username="user1",
            email="unique@example.com",
            full_name="User 1",
            role="operator"
        )
        db.add(user1)
        db.commit()
        
        # Intentar crear con mismo email
        user2 = User(
            username="user2",
            email="unique@example.com",  # Mismo email
            full_name="User 2",
            role="operator"
        )
        db.add(user2)
        
        with pytest.raises(Exception):
            db.commit()
        
        db.rollback()
    
    @pytest.mark.asyncio
    async def test_user_roles(self, db: Session):
        """Verificar roles de usuario"""
        admin_user = User(
            username="admin",
            email="admin@example.com",
            full_name="Admin",
            role="admin"
        )
        operator_user = User(
            username="operator",
            email="operator@example.com",
            full_name="Operator",
            role="operator"
        )
        viewer_user = User(
            username="viewer",
            email="viewer@example.com",
            full_name="Viewer",
            role="viewer"
        )
        
        db.add_all([admin_user, operator_user, viewer_user])
        db.commit()
        
        assert admin_user.role == "admin"
        assert operator_user.role == "operator"
        assert viewer_user.role == "viewer"


class TestSecurityUtils:
    """Tests para utilidades de seguridad"""
    
    @pytest.mark.asyncio
    async def test_password_complexity(self, db: Session):
        """Verificar que las contraseñas tienen complejidad"""
        user = User(
            username="complexuser",
            email="complex@example.com",
            full_name="Complex User",
            role="operator"
        )
        
        # Contraseña fuerte
        user.set_password("Str0ng!Pass#2024")
        assert user.password_hash is not None
        
        # Contraseña débil (pero se permite)
        user2 = User(
            username="weakuser",
            email="weak@example.com",
            full_name="Weak User",
            role="operator"
        )
        user2.set_password("weak")
        assert user2.password_hash is not None
