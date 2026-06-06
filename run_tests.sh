#!/bin/bash
# SOC Monitor Advanced - Script de Ejecución de Tests
# Versión: 1.0.0
# Fecha: 04-Jun-2026

set -e

echo "=========================================="
echo "🧪 SOC Monitor Advanced - Test Suite"
echo "=========================================="
echo ""

# Configuración
CONTAINER_NAME="soc-monitor-advanced-api-1"
REPORT_FILE="TEST_RESULTS_$(date +%Y%m%d_%H%M%S).log"

echo "📌 Configuración:"
echo "   Contenedor: $CONTAINER_NAME"
echo "   Reporte: $REPORT_FILE"
echo ""

# Verificar que el contenedor está corriendo
echo "⏳ Verificando estado del contenedor..."
if docker exec "$CONTAINER_NAME" ping -c 1 localhost > /dev/null 2>&1; then
    echo "✅ Contenedor activo"
    echo ""
else
    echo "❌ El contenedor no está disponible"
    echo "   Intenta: docker compose up -d"
    exit 1
fi

# Ejecutar tests
echo "🚀 Iniciando ejecución de tests..."
echo ""

docker exec "$CONTAINER_NAME" python -m pytest tests/ \
    -v \
    --tb=short \
    --color=yes \
    --disable-warnings \
    2>&1 | tee "$REPORT_FILE"

# Mostrar resumen
echo ""
echo "=========================================="
echo "📊 Resumen de Resultados"
echo "=========================================="
echo ""

# Contar results
PASSED=$(grep -c " PASSED " "$REPORT_FILE" || echo "0")
FAILED=$(grep -c " FAILED " "$REPORT_FILE" || echo "0")
TOTAL=$((PASSED + FAILED))

echo "   ✅ Aprobados: $PASSED"
echo "   ❌ Fallidos: $FAILED"
echo "   📦 Total: $TOTAL"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 ¡TODOS LOS TESTS PASARON!"
else
    echo "⚠️  Algunos tests fallaron. Revisa $REPORT_FILE para detalles."
fi

echo ""
echo "📁 Reporte guardado en: $REPORT_FILE"
echo ""
echo "=========================================="
