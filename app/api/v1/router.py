"""
Router principal de la API
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, reports, slack, stats


api_router = APIRouter()

# Incluir routers
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(reports.router)
api_router.include_router(slack.router)
api_router.include_router(stats.router)
