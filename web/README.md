# SOC Monitor Web - Frontend

Aplicación frontend del sistema SOC Monitor, construida con SvelteKit.

## 🚀 Tecnologías

- **SvelteKit** - Framework web moderno y rápido
- **TypeScript** - Tipado estático para mayor seguridad
- **Axios** - Cliente HTTP para llamadas a la API
- **Recharts** - Gráficos y visualizaciones de datos
- **French Toast** - Notificaciones toast

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🛠️ Instalación

```bash
cd web
npm install
```

## 🚀 Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Check de tipos
npm run check
```

## 🔗 Integración con Backend

La aplicación se conecta automáticamente a la API de FastAPI en `http://localhost:8000`.

Variables de entorno:
- `VITE_API_URL` - URL de la API backend (default: http://localhost:8000)

## 📁 Estructura del Proyecto

```
web/
├── src/
│   ├── lib/
│   │   └── components/    # Componentes reutilizables
│   ├── routes/            # Páginas SvelteKit
│   ├── stores/            # Estado global (stores)
│   ├── services/          # Servicios de API
│   └── app.html           # Plantilla HTML
├── static/                # Archivos estáticos
├── package.json
├── svelte.config.js
├── vite.config.js
└── tsconfig.json
```

## 🎯 Características Futuras

- [ ] Dashboard principal
- [ ] Listado de reportes
- [ ] Creación de reportes
- [ ] Gráficos de estadísticas
- [ ] Notificaciones en tiempo real
- [ ] Integración con Slack UI

## 💡 Notas

- Los tokens JWT se almacenan en localStorage
- Las rutas se sirven automáticamente por SvelteKit
- El proxy de Vite redirige `/api` al backend FastAPI

---

**Autor:** Walter Rios  
**Última actualización:** 02/06/2026  
