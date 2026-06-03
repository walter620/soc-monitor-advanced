"""
Servicio de gestión de reportes
"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from typing import Optional

from app.db.models.report import ShiftReport


class ReportService:
    """Servicio para lógica de negocio de reportes"""
    
    @staticmethod
    def calculate_sla_deadline(severity: int) -> Optional[datetime]:
        """Calcular deadline de SLA basado en severidad"""
        if severity < 7:
            return None
        
        sla_hours = 4 if severity >= 8 else 8
        return datetime.utcnow() + timedelta(hours=sla_hours)
    
    @staticmethod
    def is_sla_violated(report: ShiftReport) -> bool:
        """Verificar si SLA fue violado"""
        if not report.sla_deadline:
            return False
        
        if report.sla_violated:
            return True
        
        if datetime.utcnow() > report.sla_deadline:
            report.sla_violated = True
            report.auto_escalated = True
            return True
        
        return False
    
    @staticmethod
    def update_severity(report: ShiftReport) -> int:
        """Actualizar severidad basada en novedades"""
        if not report.novedades:
            return 0
        
        max_severity = max(
            (n.get('severity', 0) for n in report.novedades),
            default=0
        )
        
        report.severity = max_severity
        return max_severity
    
    @staticmethod
    def auto_escalate_violated_reports(db: Session):
        """Escalar automáticamente reportes con SLA violado"""
        from app.db.models.report import ShiftReport
        
        violated = db.query(ShiftReport).filter(
            ShiftReport.sla_violated == True,
            ShiftReport.auto_escalated == False
        ).all()
        
        for report in violated:
            report.auto_escalated = True
            db.add(report)
        
        db.commit()
        return len(violated)
