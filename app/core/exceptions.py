"""
Excepciones personalizadas del sistema
"""
from fastapi import HTTPException, status
from pydantic import BaseModel


class CustomException(Exception):
    """Excepción base personalizada"""
    def __init__(self, message: str, status_code: int = 500, details: dict = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class NotFoundException(CustomException):
    """Recurso no encontrado"""
    def __init__(self, resource: str, resource_id: int):
        super().__init__(
            message=f"{resource} con ID {resource_id} no encontrado",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"resource": resource, "id": resource_id}
        )


class UnauthorizedException(CustomException):
    """No autorizado"""
    def __init__(self, message: str = "No autorizado"):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class ForbiddenException(CustomException):
    """Prohibido - permisos insuficientes"""
    def __init__(self, message: str = "Acceso prohibido"):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN
        )


class BadRequestException(CustomException):
    """Solicitud inválida"""
    def __init__(self, message: str):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class ConflictException(CustomException):
    """Recurso en conflicto (ya existe)"""
    def __init__(self, message: str):
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT
        )


class SlackAPIException(CustomException):
    """Error en API de Slack"""
    def __init__(self, error: str, response: dict = None):
        super().__init__(
            message=f"Error en Slack API: {error}",
            status_code=status.HTTP_502_BAD_GATEWAY,
            details={"error": error, "response": response}
        )


class DatabaseException(CustomException):
    """Error de base de datos"""
    def __init__(self, error: str):
        super().__init__(
            message=f"Error de base de datos: {error}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
