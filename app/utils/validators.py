"""
Validadores para el sistema
"""
from typing import Optional
from datetime import datetime


def validate_severity(severity: int) -> bool:
    """Validar que la severidad esté entre 1 y 10"""
    return 1 <= severity <= 10


def validate_datetime_range(start: datetime, end: datetime) -> bool:
    """Validar que la hora de fin sea posterior a la de inicio"""
    return end > start


def validate_summary_length(summary: str, min_length: int = 50, max_length: int = 2000) -> bool:
    """Validar longitud del resumen"""
    return min_length <= len(summary) <= max_length


def validate_username(username: str) -> bool:
    """Validar nombre de usuario"""
    if len(username) < 3 or len(username) > 80:
        return False
    if not username.isalnum() and '_' not in username:
        return False
    return True


def validate_email(email: str) -> bool:
    """Validar formato de email (simple)"""
    from email_validator import validate_email as validate
    try:
        valid = validate(email)
        return True
    except:
        return False
