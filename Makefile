.PHONY: help dev test lint format docker docker-up docker-down migrate init-db

help: ## Mostrar ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Iniciar en modo desarrollo
	@uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test: ## Ejecutar tests
	@pytest tests/ -v --cov=app --cov-report=html

lint: ## Ejecutar linting
	@ruff check app/
	@mypy app/

format: ## Formatear código
	@black app/
	@isort app/

docker-up: ## Iniciar Docker Compose
	@docker-compose up -d --build

docker-down: ## Detener Docker Compose
	@docker-compose down

docker-logs: ## Ver logs de Docker
	@docker-compose logs -f

migrate: ## Crear nueva migration
	@alembic revision --autogenerate -m "$(message)"

init-db: ## Inicializar base de datos
	@python -c "from app.db.session import init_db; init_db()"

reset-db: ## Resetear base de datos
	@python -c "from app.db.session import cleanup_db; cleanup_db()"

install: ## Instalar dependencias
	@pip install -r requirements.txt
	@pip install -r requirements.dev.txt

install-dev: ## Instalar dependencias de desarrollo
	@pip install -e ".[dev]"

serve: ## Servir aplicación
	@uvicorn app.main:app --host 0.0.0.0 --port 8000

docs: ## Generar documentación
	@mkdocs build

coverage: ## Ver cobertura de tests
	@coverage html
	@open htmlcov/index.html
