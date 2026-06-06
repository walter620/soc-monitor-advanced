# 🔧 Guía Paso a Paso: Cambiar Puerto del Servidor Vite

## SOC Monitor Advanced - Cambio de Puerto 3000 a 3001

---

## 📋 Resumen

Esta guía te permitirá cambiar el puerto del servidor de desarrollo Vite desde el puerto 3000 (predeterminado) al puerto 3001.

---

## 🎯 Método 1: Cambiar Puerto Temporalmente (Para Desarrollo)

### Paso 1: Detener el Servidor Actual

```bash
# Si el servidor está corriendo en terminal foreground
# Presiona: Ctrl + C

# Si el servidor está en background
cd /Users/walterrios1/Desarrollo/soc-monitor-advanced/web
pkill -f vite
```

### Paso 2: Iniciar con Nuevo Puerto

```bash
# Navega al directorio web
cd /Users/walterrios1/Desarrollo/soc-monitor-advanced/web

# Inicia el servidor en puerto 3001
npm run dev -- --host 0.0.0.0 --port 3001
```

### Paso 3: Verificar Cambio

Abre tu navegador y accede a:
```
http://localhost:3001
```

---

## 🎯 Método 2: Configurar Puerto por Defecto (Recomendado)

### Opción A: Modificar package.json

#### Paso 1: Abrir package.json

```bash
cd /Users/walterrios1/Desarrollo/soc-monitor-advanced/web
nano package.json
```

#### Paso 2: Cambiar el Script de Development

Busca la línea:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  ...
}
```

Cámbiala a:
```json
"scripts": {
  "dev": "vite --port 3001",
  "build": "vite build",
  ...
}
```

#### Paso 3: Guardar y Salir

En nano:
- Presiona `Ctrl + O` → Enter (guardar)
- Presiona `Ctrl + X` (salir)

#### Paso 4: Iniciar el Servidor

```bash
npm run dev
```

El servidor ahora iniciará automáticamente en el puerto 3001.

---

### Opción B: Modificar vite.config.ts (Recomendado)

#### Paso 1: Abrir vite.config.ts

```bash
cd /Users/walterrios1/Desarrollo/soc-monitor-advanced/web
nano vite.config.ts
```

#### Paso 2: Agregar Configuración de Puerto

Busca el archivo y agrega/modifica la configuración así:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,        // ← Agrega esta línea
    host: true,        // ← Permite acceso desde fuera
  },
})
```

#### Paso 3: Guardar y Salir

En nano:
- Presiona `Ctrl + O` → Enter (guardar)
- Presiona `Ctrl + X` (salir)

#### Paso 4: Iniciar el Servidor

```bash
npm run dev
```

Verás un mensaje como:
```
  ➜  Local:   http://localhost:3001/
  ➜  Network: http://172.20.36.42:3001/
```

---

## 🎯 Método 3: Usar Variables de Entorno (Avanzado)

### Paso 1: Crear archivo .env

```bash
cd /Users/walterrios1/Desarrollo/soc-monitor-advanced/web
echo "VITE_PORT=3001" > .env
```

### Paso 2: Modificar vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT || '3001'),
    host: true,
  },
})
```

### Paso 3: Iniciar el Servidor

```bash
npm run dev
```

---

## 🔍 Verificación del Cambio

### 1. Verificar en Terminal

Cuando inicies el servidor, deberías ver:
```
  VITE v5.0.0  ready in 232 ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: http://172.20.36.42:3001/
  ➜  press h + enter to show help
```

### 2. Verificar en Navegador

Accede a:
- **Local:** `http://localhost:3001`
- **Red:** `http://172.20.36.42:3001`

### 3. Verificar con curl

```bash
curl -I http://localhost:3001
```

Deberías recibir:
```
HTTP/1.1 200 OK
```

### 4. Verificar con netstat

```bash
# macOS
lsof -i :3001

# Linux
sudo netstat -tlnp | grep 3001
# o
sudo ss -tlnp | grep 3001
```

---

## 📝 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `package.json` | Script dev actualizado (opcional) |
| `vite.config.ts` | Configuración de puerto agregada |
| `.env` | Variable de entorno (opcional) |

---

## ⚙️ Configuraciones Adicionales

### Habilitar Acceso desde Fuera de la Red Local

En `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,        // Permite acceso desde otros dispositivos
    strictPort: true,  // Solo usa el puerto especificado
    cors: true,        // Habilita CORS
  },
})
```

### Configurar Proxy Backend (si tienes backend en puerto diferente)

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Tu backend
        changeOrigin: true,
      },
    },
  },
})
```

---

## 🚀 Despliegue en Producción

### Paso 1: Compilar para Producción

```bash
cd /Users/walterrios1/Desarrollo/soc-monitor-advanced/web
npm run build
```

### Paso 2: Servir con Puerto Diferente (Opcional)

```bash
# Opción A: Con Vite preview
npx vite preview --port 3001

# Opción B: Con nginx (recomendado)
nginx -c /path/to/nginx.conf
```

### Paso 3: Configurar Nginx (Ejemplo)

```nginx
server {
    listen 3001;
    server_name localhost;

    location / {
        root /path/to/web/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy al backend si es necesario
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Consideraciones de Seguridad

### 1. Firewall

Asegura el puerto 3001:

```bash
# macOS (pf)
sudo pfctl -f /etc/pf.conf

# Linux (ufw)
sudo ufw allow 3001/tcp

# Linux (firewalld)
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload

# Linux (iptables)
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
```

### 2. HTTPS (Producción)

Usa un certificado SSL:

```bash
# Con Let's Encrypt
sudo certbot --nginx -d tu-dominio.com
```

### 3. Variables de Entorno

No expongas credenciales:

```bash
# Usa .env con permisos restringidos
chmod 600 .env
```

---

## 🐛 Solución de Problemas

### Problema: Puerto 3001 ya está en uso

**Solución:**
```bash
# Encontrar el proceso
lsof -i :3001

# Matar el proceso
kill -9 <PID>

# O usar un puerto diferente
npm run dev -- --port 3002
```

### Problema: No puedo acceder desde otro dispositivo

**Verifica:**
1. Firewall permite puerto 3001
2. `host: true` en vite.config.ts
3. IP del servidor correcta

### Problema: El servidor no inicia

**Solución:**
```bash
# Limpiar caché
rm -rf node_modules
rm -rf package-lock.json
npm install
npm run dev
```

### Problema: Errores de TypeScript

**Verifica:**
```bash
npx tsc --noEmit
```

---

## 📊 Resumen de Comandos

### Desarrollo

```bash
# Iniciar con puerto 3001 (temporal)
npm run dev -- --port 3001

# Iniciar con puerto por defecto (configurado)
npm run dev

# Detener servidor
Ctrl + C

# Matar todos los procesos vite
pkill -f vite
```

### Producción

```bash
# Compilar
npm run build

# Servir en producción
npx vite preview --port 3001
```

---

## ✅ Checklist de Verificación

- [ ] Detener servidor anterior (puerto 3000)
- [ ] Modificar `vite.config.ts` o `package.json`
- [ ] Guardar cambios
- [ ] Iniciar servidor (`npm run dev`)
- [ ] Verificar en `http://localhost:3001`
- [ ] Probar desde otro dispositivo (si es necesario)
- [ ] Verificar firewall y seguridad
- [ ] Documentar cambio en el equipo

---

## 📞 Soporte

Si encuentras problemas:

1. Verifica los logs: `npm run dev`
2. Revisa errores de terminal
3. Comprueba que el puerto no esté en uso
4. Verifica configuración de red/firewall

---

## 📅 Historial de Cambios

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 03/06/2025 | Guía inicial creada |

---

**Documento creado para SOC Monitor Advanced v1.0**

---

*Para más información, consulta la documentación oficial de Vite: https://vitejs.dev/config/*
