from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Importar dependencias necesarias
import asyncio
from typing import AsyncGenerator

# Configurar lifespan
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    print("API iniciando...")
    yield
    print("API deteniendo...")

# Crear aplicación
app = FastAPI(
    title="SOC Monitor API",
    version="2.0.0",
    lifespan=lifespan
)

# Agregar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "SOC Monitor API"}

@app.get("/health")
async def health():
    return {"status": "healthy", "app": "SOC Monitor", "version": "2.0.0"}

@app.get("/api/v1/auth/login")
async def login_alt(username: str = "", password: str = ""):
    """Endpoint alternativo para probar"""
    if username == "admin" and password == "admin123":
        return {"access_token": "test-token", "username": username, "role": "admin"}
    return {"detail": "Invalid credentials"}, 401

print("✅ API simplificada creada")
