"""
Modelo de usuario
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship

from app.db.session import Base
from app.core.security import get_password_hash, verify_password


class User(Base):
    """Modelo de usuario del sistema"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(80), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(128), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="operator")  # admin, supervisor, operator
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    slack_user_id = Column(String(50), nullable=True, index=True)
    
    # Relaciones - Usando string reference para evitar circular import
    reports = relationship("ShiftReport", back_populates="operator", foreign_keys="ShiftReport.operator_id", lazy="dynamic")
    
    def set_password(self, password: str):
        """Establecer contraseña hasheada"""
        self.password_hash = get_password_hash(password)
    
    def verify_password(self, password: str) -> bool:
        """Verificar contraseña"""
        return verify_password(password, self.password_hash)
    
    def to_dict(self) -> dict:
        """Convertir a diccionario (sin password)"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "slack_user_id": self.slack_user_id
        }
    
    def __repr__(self):
        return f"<User {self.username} ({self.role})>"
