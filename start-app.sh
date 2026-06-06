#!/bin/bash
# Script para iniciar TODA la aplicación (Backend + Frontend)
# Este script arranca ambos servicios en el orden correcto

set -e

# Directorio del proyecto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "============================================================"
echo "  🚀 INICIANDO SOC MONITOR ADVANCED - ENTORNO COMPLETO"
echo "============================================================"
echo ""

# 1. Verificar Python y venv
echo "📦 Verificando entorno Python..."
PYTHON_VENV="${PROJECT_DIR}/venv/bin/python"

if [ ! -f "${PYTHON_VENV}" ]; then
    echo "❌ Virtualenv de Python no encontrado"
    echo "Ejecutando ./start.sh para crearlo..."
    "${PROJECT_DIR}/start.sh"
    exit 1
fi

echo "✅ Python venv listo"

# 2. Verificar Node.js
echo ""
echo "📦 Verificando entorno Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no instalado"
    exit 1
fi

if [ ! -d "${PROJECT_DIR}/web/node_modules" ]; then
    echo "⚠️  Dependencias de frontend no encontradas"
    echo "Instalando..."
    cd "${PROJECT_DIR}/web"
    npm install
    cd "${PROJECT_DIR}"
fi

echo "✅ Node.js listo"

# 3. Iniciar Backend en segundo plano
echo ""
echo "🚀 Iniciando BACKEND (FastAPI)..."
echo "   puerto: 8000"
echo "   docs:   http://localhost:8000/docs"
echo ""

"${PYTHON_VENV}" -m uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --reload \
    > "${PROJECT_DIR}/backend.log" 2>&1 &

BACKEND_PID=$!
echo "Backend PID: ${BACKEND_PID}"

# Esperar a que el backend esté listo
echo "Esperando que el backend inicie..."
sleep 5

# Verificar que el backend esté响应
for i in {1..10}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ Backend listo y saludable"
        break
    fi
    
    if [ $i -eq 10 ]; then
        echo "❌ Backend no inició correctamente"
        echo "Logs:"
        cat "${PROJECT_DIR}/backend.log"
        kill ${BACKEND_PID}
        exit 1
    fi
    
    echo "   Esperando... (${i}/10)"
    sleep 1
done

# 4. Iniciar Frontend en segundo plano
echo ""
echo "🚀 Iniciando FRONTEND (Vite)..."
echo "   puerto: 3000"
echo "   docs:   http://localhost:3000"
echo ""

cd "${PROJECT_DIR}/web"
npm run dev -- --host --port 3000 \
    > "${PROJECT_DIR}/frontend.log" 2>&1 &

FRONTEND_PID=$!
cd "${PROJECT_DIR}"
echo "Frontend PID: ${FRONTEND_PID}"

# Esperar a que el frontend esté listo
echo "Esperando que el frontend inicie..."
sleep 3

# Verificar que el frontend esté响应
for i in {1..5}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend listo"
        break
    fi
    
    if [ $i -eq 5 ]; then
        echo "⚠️  Frontend podría no estar listo aún (normal en desarrollo)"
    fi
    
    echo "   Esperando... (${i}/5)"
    sleep 1
done

# 5. Resumen
echo ""
echo "============================================================"
echo "  ✅ ¡APLICACIÓN COMPLETA EN EJECUCIÓN!"
echo "============================================================"
echo ""
echo "  📱 Frontend:   http://localhost:3000"
echo "  🔌 API:        http://localhost:8000"
echo "  📚 API Docs:   http://localhost:8000/docs"
echo "  🔗 Swagger:    http://localhost:8000/redoc"
echo ""
echo "  📝 Logs:"
echo "     Backend:  ${PROJECT_DIR}/backend.log"
echo "     Frontend: ${PROJECT_DIR}/frontend.log"
echo ""
echo "  🛑 Para detener:"
echo "     Presiona Ctrl+C"
echo ""
echo "============================================================"

# Mantener ambos procesos corriendo
wait