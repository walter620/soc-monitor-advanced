"""
Modelo de configuración de Slack
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON

from app.db.session import Base


class SlackConfig(Base):
    """Configuración de Slack para la aplicación"""
    __tablename__ = "slack_config"
    
    id = Column(Integer, primary_key=True)
    bot_token = Column(String(200), nullable=False)
    signing_secret = Column(String(100), nullable=False)
    app_token = Column(String(200), nullable=True)
    authorized_channels = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<SlackConfig id={self.id}>"
