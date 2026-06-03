"""
Modelo de reporte de turno
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship

from app.db.session import Base


class ShiftReport(Base):
    """Modelo de reporte de turno"""
    __tablename__ = "shift_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    operator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Información del turno
    shift_date = Column(DateTime, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    summary = Column(Text, nullable=False)
    
    # Estado y seguimiento
    status = Column(String(20), default="draft")  # draft, pending, approved, closed
    severity = Column(Integer, default=0)  # 0-10
    sla_deadline = Column(DateTime, nullable=True)
    sla_violated = Column(Boolean, default=False)
    auto_escalated = Column(Boolean, default=False)
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Métricas y análisis
    resolution_time_minutes = Column(Integer, nullable=True)
    false_positive_rate = Column(Float, nullable=True)
    escalation_count = Column(Integer, default=0)
    tuning_suggestions = Column(Integer, default=0)
    
    # Datos estructurados en JSON
    novedades = Column(JSON, default=list)
    logs_revisados = Column(JSON, default=list)
    critical_cases = Column(JSON, nullable=True)
    
    # Auditoría
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relaciones
    operator = relationship("User", back_populates="reports", foreign_keys=[operator_id])
    approved_by_user = relationship("User", foreign_keys=[approved_by], lazy="joined")
    
    def check_sla(self) -> bool:
        """Verificar si SLA fue violado"""
        if not self.sla_deadline or self.sla_violated:
            return self.sla_violated
        
        if datetime.utcnow() > self.sla_deadline:
            self.sla_violated = True
            return True
        return False
    
    def to_dict(self) -> dict:
        """Convertir a diccionario"""
        return {
            "id": self.id,
            "operator_id": self.operator_id,
            "shift_date": self.shift_date.isoformat() if self.shift_date else None,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "summary": self.summary,
            "status": self.status,
            "severity": self.severity,
            "sla_deadline": self.sla_deadline.isoformat() if self.sla_deadline else None,
            "sla_violated": self.sla_violated,
            "auto_escalated": self.auto_escalated,
            "novedades": self.novedades,
            "logs_revisados": self.logs_revisados,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f"<ShiftReport {self.id} - {self.status}>"
