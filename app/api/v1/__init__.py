"""
Inicializar routers de endpoints
"""
from app.api.v1.endpoints import auth, users, reports, slack, stats

__all__ = ["auth", "users", "reports", "slack", "stats"]
