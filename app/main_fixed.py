from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import CustomException
from app.api.v1.router import api_router
from app.db.session import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan handler para inicialización"""
    # Crear tablas
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("📦 Tablas de BD creadas")
    yield
    # Cerrar conexión
    await engine.dispose()

app = FastAPI(
    title="SOC Monitor Advanced API",
    description="API para SOC Monitor",
    version="2.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "app": "SOC Monitor Advanced", "version": "2.0.0"}

@app.get("/")
async def root():
    return {"message": "SOC Monitor Advanced API"}

