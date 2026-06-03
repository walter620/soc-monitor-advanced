"""
Modelos de base de datos
"""
from app.db.models.user import User
from app.db.models.report import ShiftReport
from app.db.models.slack_config import SlackConfig

__all__ = ["User", "ShiftReport", "SlackConfig"]
