"""
Tests básicos para la API REST de SOC Monitor Advanced
Estos tests verifican el funcionamiento del endpoint de health y la documentación
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app


# Cliente de prueba síncrono para FastAPI
client = TestClient(app)


class TestHealthEndpoint:
    """Tests para el endpoint de health check"""
    
    def test_health_check(self):
        """Verificar que el endpoint /health responde correctamente"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["status"] == "healthy"
        assert data["app"] == "SOC Monitor Advanced"
        assert data["version"] == "2.0.0"


class TestOpenAPI:
    """Tests para la documentación OpenAPI"""
    
    def test_openapi_schema(self):
        """Verificar que el schema OpenAPI está disponible"""
        response = client.get("/openapi.json")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "openapi" in data
        assert data["info"]["title"] == "SOC Monitor Advanced"
        assert data["info"]["version"] == "2.0.0"
    
    def test_swagger_docs(self):
        """Verificar que Swagger UI está disponible"""
        response = client.get("/docs")
        
        assert response.status_code == 200
        # Verificar que contiene HTML
        assert "<html" in response.text.lower() or "<!doctype" in response.text.lower()
    
    def test_redoc(self):
        """Verificar que Redoc está disponible"""
        response = client.get("/redoc")
        
        assert response.status_code == 200


class TestSecurity:
    """Tests para seguridad básica"""
    
    def test_response_structure(self):
        """Verificar que las respuestas tienen la estructura esperada"""
        response = client.get("/health")
        
        data = response.json()
        assert isinstance(data, dict)
        assert "status" in data
        assert "app" in data
        assert "version" in data
    
    def test_content_type(self):
        """Verificar que las respuestas JSON tienen el tipo correcto"""
        response = client.get("/health")
        
        assert "application/json" in response.headers.get("content-type", "")
