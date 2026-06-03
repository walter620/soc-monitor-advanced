"""
Endpoints de integración con Slack
"""
from fastapi import APIRouter, Request, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.config import settings


router = APIRouter(prefix="/slack", tags=["slack"])


# Inicializar bot de Slack (opcional - deshabilitado si no hay tokens)
if settings.SLACK_BOT_TOKEN and settings.SLACK_SIGNING_SECRET:
    from slack_bolt import App
    from slack_bolt.adapter.fastapi import SlackRequestHandler
    
    slack_app = App(
        token=settings.SLACK_BOT_TOKEN,
        signing_secret=settings.SLACK_SIGNING_SECRET
    )
    handler = SlackRequestHandler(slack_app)
else:
    slack_app = None
    handler = None


@router.post("/events")
async def slack_events(request: Request):
    """Manejar eventos de Slack"""
    if not handler:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Slack integration is not configured"
        )
    
    return await handler.handle(request)
