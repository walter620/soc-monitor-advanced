"""
Helpers del sistema
"""
from datetime import datetime
from typing import Optional


def format_datetime(dt: Optional[datetime]) -> Optional[str]:
    """Formatear datetime a string ISO"""
    if dt is None:
        return None
    return dt.isoformat()


def format_sla_status(sla_deadline: Optional[datetime], sla_violated: bool) -> str:
    """Obtener estado de SLA"""
    if sla_violated:
        return "VIOLATED"
    elif sla_deadline and datetime.utcnow() > sla_deadline:
        return "EXPIRING_SOON"
    elif sla_deadline:
        return "OK"
    return "NO_SLA"


def calculate_severity_category(severity: int) -> str:
    """Categorizar severidad"""
    if severity == 0:
        return "NONE"
    elif 1 <= severity <= 3:
        return "LOW"
    elif 4 <= severity <= 6:
        return "MEDIUM"
    elif 7 <= severity <= 8:
        return "HIGH"
    elif 9 <= severity <= 10:
        return "CRITICAL"
    return "UNKNOWN"


def get_action_for_severity(severity: int) -> str:
    """Determinar acción requerida según severidad"""
    if severity >= 9:
        return "IMMEDIATE_ESCALATION"
    elif severity >= 7:
        return "ESCALATE_TO_SUPERVISOR"
    elif severity >= 5:
        return "REVIEW_REQUIRED"
    return "MONITOR"
