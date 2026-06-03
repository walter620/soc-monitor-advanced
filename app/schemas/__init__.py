"""
Schemas Pydantic para validación de datos
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Schema para crear usuario"""
    username: str = Field(..., min_length=3, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., max_length=100)
    role: Optional[str] = "operator"


class UserResponse(BaseModel):
    """Response de usuario"""
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """Schema para actualizar usuario"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class Token(BaseModel):
    """Schema de token JWT"""
    access_token: str
    token_type: str = "bearer"
    username: Optional[str] = None
    role: Optional[str] = None


class ShiftReportCreate(BaseModel):
    """Schema para crear reporte de turno"""
    shift_date: datetime
    start_time: datetime
    end_time: datetime
    summary: str = Field(..., min_length=10, max_length=2000)
    status: Optional[str] = "draft"
    severity: Optional[int] = 0
    novedades: Optional[List[Dict[str, Any]]] = []
    logs_revisados: Optional[List[Dict[str, Any]]] = []


class ShiftReportUpdate(BaseModel):
    """Schema para actualizar reporte"""
    summary: Optional[str] = None
    status: Optional[str] = None
    severity: Optional[int] = None
    novedades: Optional[List[Dict[str, Any]]] = None
    logs_revisados: Optional[List[Dict[str, Any]]] = None


class ShiftReportResponse(BaseModel):
    """Response de reporte de turno"""
    id: int
    operator_id: int
    shift_date: datetime
    start_time: datetime
    end_time: datetime
    summary: str
    status: str
    severity: int
    novedades: Optional[str] = None
    logs_revisados: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class SystemStats(BaseModel):
    """Estadísticas del sistema"""
    total_users: int
    total_reports: int
    pending_reports: int
    completed_reports: int
    average_severity: float
