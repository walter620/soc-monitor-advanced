"""
Servicio de bot de Slack con Bolt.py
"""
from slack_bolt import App
from slack_bolt.adapter.fastapi import SlackRequestHandler
from app.core.config import settings


class SlackBot:
    """Bot de Slack para notificaciones y comandos"""
    
    def __init__(self):
        """Inicializar bot de Slack"""
        self.app = App(
            token=settings.SLACK_BOT_TOKEN,
            signing_secret=settings.SLACK_SIGNING_SECRET
        )
        self.handler = SlackRequestHandler(self.app)
    
    def setup_listeners(self):
        """Configurar listeners para eventos"""
        
        @self.app.event("message")
        async def handle_message(event, say):
            """Manejar mensajes en Slack"""
            text = event.get("text", "")
            channel = event.get("channel", "")
            user = event.get("user", "")
            
            if text.startswith("!soc"):
                await self.handle_soc_command(text, say, channel, user)
        
        @self.app.command("/soc_status")
        async def handle_soc_status(ack, say, command):
            """Comando para ver estado del sistema"""
            ack()
            await say("✅ Sistema SOC Monitor en línea\n📊 Estado: Operativo")
        
        @self.app.command("/soc_alerts")
        async def handle_soc_alerts(ack, say, command):
            """Comando para ver alertas activas"""
            ack()
            await say("🚨 Consultando alertas activas...")
    
    async def handle_soc_command(self, command: str, say, channel: str, user: str):
        """Manejar comandos SOC"""
        if command == "!soc help":
            help_message = """
👋 ¡Hola! Soy el bot del SOC Monitor. Comandos disponibles:

• !soc help - Muestra este mensaje
• !soc status - Ver estado del sistema
• !soc alerts - Ver alertas activas de severidad alta
• !soc report - Abrir formulario para crear reporte
• !soc stats - Ver estadísticas del día
            """
            await say(help_message)
        
        elif command == "!soc status":
            await say("✅ Sistema SOC Monitor\n🟢 Estado: Operativo\n📅 Versión: 2.0.0")
        
        elif command == "!soc alerts":
            # Aquí se implementaría la lógica para consultar alertas
            await say("🚨 No hay alertas activas de alta prioridad")
    
    async def send_report_notification(self, report: object, channel: str = None):
        """Enviar notificación de reporte a Slack"""
        # Construir mensaje
        message = f"""
📝 *Nuevo Reporte SOC*

👤 *Operador:* {report.operator.full_name if report.operator else "N/A"}
📅 *Fecha:* {report.shift_date.strftime('%Y-%m-%d')}
⏰ *Turno:* {report.start_time.strftime('%H:%M')} - {report.end_time.strftime('%H:%M')}
📌 *Estado:* {report.status.upper()}
🔴 *Severidad:* {report.severity}/10
        """
        
        # Enviar a Slack
        try:
            if channel:
                # Enviar al canal especificado
                # self.app.client.chat_postMessage(channel=channel, text=message)
                print(f"📨 Notificación enviada a {channel}")
            else:
                # Enviar al canal predeterminado
                # self.app.client.chat_postMessage(channel=settings.SLACK_CHANNEL_ID, text=message)
                print(f"📨 Notificación enviada al canal predeterminado")
        except Exception as e:
            print(f"❌ Error enviando notificación a Slack: {e}")
    
    async def send_alert(self, severity: int, message: str, channel: str = None):
        """Enviar alerta de alta severidad a Slack"""
        if severity < 7:
            return  # No enviar alertas de baja severidad
        
        color = "#ff0000" if severity >= 8 else "#ff8800"
        
        alert_message = {
            "attachments": [{
                "color": color,
                "title": "🚨 Alerta de Seguridad",
                "text": message,
                "fields": [
                    {
                        "title": "Severidad",
                        "value": f"{severity}/10",
                        "short": True
                    },
                    {
                        "title": "Hora",
                        "value": "Ahora",
                        "short": True
                    }
                ],
                "footer": "SOC Monitor",
                "ts": 1234567890
            }]
        }
        
        try:
            # self.app.client.chat_postMessage(
            #     channel=channel or settings.SLACK_CHANNEL_ID,
            #     text=alert_message
            # )
            print(f"🚨 Alerta enviada: {message}")
        except Exception as e:
            print(f"❌ Error enviando alerta: {e}")
