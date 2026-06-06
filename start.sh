#!/bin/bash
# Script para iniciar la aplicación SOC Monitor Advanced
# Este script asume que ya has creado y activado el virtualenv

set -e

# Directorio del proyecto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="${PROJECT_DIR}/venv"
VENV_PYTHON="${VENV_DIR}/bin/python"

# Verificar que el virtualenv existe
if [ ! -f "${VENV_PYTHON}" ]; then
    echo "❌ Virtualenv no encontrado. Creando..."
    python3 -m venv "${VENV_DIR}"
    echo "✅ Virtualenv creado"
fi

# Actualizar pip
echo "🔄 Actualizando pip..."
"${VENV_PYTHON}" -m pip install --upgrade pip -q

# Instalar dependencias
echo "📦 Instalando dependencias..."
"${VENV_PYTHON}" -m pip install -q -r "${PROJECT_DIR}/requirements.txt"

# Iniciar la aplicación
echo "🚀 Iniciando SOC Monitor Advanced API..."
echo "📍 La API estará disponible en: http://localhost:8000"
echo "📍 Documentación de la API: http://localhost:8000/docs"
echo "📍 Swagger UI: http://localhost:8000/redoc"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

# Ejecutar uvicorn
exec "${VENV_PYTHON}" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
