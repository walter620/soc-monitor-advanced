"""
Servicio de notificaciones
"""
from app.services.slack_bot import SlackBot
from app.core.config import settings


class NotificationService:
    """Servicio para enviar notificaciones"""
    
    def __init__(self):
        """Inicializar servicio de notificaciones"""
        self.slack_bot = SlackBot()
    
    async def send_slack_notification(self, message: str, channel: str = None):
        """Enviar notificación a Slack"""
        await self.slack_bot.send_report_notification(
            None,  # Report object
            channel
        )
        print(f"📨 Notificación Slack: {message}")
    
    async def send_sla_alert(self, report_id: int, deadline: str, severity: int):
        """Enviar alerta de SLA inminente"""
        alert_message = f"""
⏰ *Alerta de SLA - Reporte #{report_id}*
    
📌 *Límite:* {deadline}
🔴 *Severidad:* {severity}/10

Por favor revisar y cerrar este reporte.
        """
        await self.slack_bot.send_alert(severity, alert_message)
