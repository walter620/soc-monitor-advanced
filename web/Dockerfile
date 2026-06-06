FROM python:3.11-slim

WORKDIR /app

# Copiar archivos estáticos
COPY index.html .
COPY dashboard.html .

# Instalar servidor HTTP simple
RUN pip install --no-cache-dir simple-http-server

EXPOSE 5173

CMD ["python", "-m", "simple_http_server", "5173"]
