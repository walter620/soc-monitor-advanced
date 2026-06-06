# 📋 Guía de Uso - Módulo de Reportes
## SOC Monitor Advanced

---

## 🎯 Tabla de Contenido

1. [Acceso al Módulo de Reportes](#acceso-al-módulo-de-reportes)
2. [Interfaz del Módulo de Reportes](#interfaz-del-módulo-de-reportes)
3. [Cómo Crear un Nuevo Reporte](#cómo-crear-un-nuevo-reporte)
4. [Cómo Adjuntar Archivos a un Reporte](#cómo-adjuntar-archivos-a-un-reporte)
5. [Cómo Editar un Reporte Existente](#cómo-editar-un-reporte-existente)
6. [Cómo Eliminar un Reporte](#cómo-eliminar-un-reporte)
7. [Buscar y Filtrar Reportes](#buscar-y-filtrar-reportes)
8. [Ver Detalles Completos de un Reporte](#ver-detalles-completos-de-un-reporte)
9. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Acceso al Módulo de Reportes

### Método 1: Desde el Dashboard

1. Inicia sesión en SOC Monitor:
   - Abre: `http://localhost:3000`
   - Email: `admin@soc.local`
   - Contraseña: `admin123`

2. En el Dashboard, en la sección "Acciones Rápidas", haz clic en el botón:
   ```
   📋 Ver Reportes
   ```
   O haz clic en:
   ```
   ➕ Nuevo Reporte
   ```

### Método 2: Desde el Menú Lateral

1. Una vez logueado, en la barra lateral izquierda, haz clic en:
   ```
   📋 Reportes
   ```

---

## Interfaz del Módulo de Reportes

Al acceder al módulo de Reportes, verás:

```
┌─────────────────────────────────────────────────────────────────┐
│                    GESTIÓN DE REPORTES                          │
│  Crea, edita y gestiona los reportes de turno del SOC           │
│                           [➕ Nuevo Reporte]                     │
├─────────────────────────────────────────────────────────────────┤
│  📊 Total     ⏰ Pendientes     ✅ Completados     ⚡ Severidad  │
│  45           3                 42                 3.2 / 5     │
├─────────────────────────────────────────────────────────────────┤
│  🔍 Buscar...                           [Todos ▼]  Resultados: 5│
├─────────────────────────────────────────────────────────────────┤
│  FECHA     │ SEVERIDAD │ ESTADO  │ RESUMEN         │ ACCIONES   │
│────────────│───────────│─────────│─────────────────│──────────── │
│ 03 Jun 10:00│ ⚡ 3/5   │ ✅ Completed│ Monitor...   │ 👁️ ✏️ 🗑️   │
│ 02 Jun 10:00│ ⚡ 2/5   │ ✅ Completed│ Detección... │ 👁️ ✏️ 🗑️   │
│ 01 Jun 10:00│ ⚡ 1/5   │ 📝 Draft  │ Escaneo...    │ 👁️ ✏️ 🗑️   │
│ 31 May 10:00│ ⚡ 4/5   │ 👁️ Review │ Ataque...     │ 👁️ ✏️ 🗑️   │
│ 30 May 10:00│ ⚡ 1/5   │ ✅ Completed│ Revisión...  │ 👁️ ✏️ 🗑️   │
└─────────────────────────────────────────────────────────────────┘
```

### Elementos de la Interfaz:

| Elemento | Descripción |
|----------|-------------|
| **KPI Cards** | Estadísticas generales del módulo |
| **Buscar** | Buscador en tiempo real |
| **Filtro** | Filtrar por estado del reporte |
| **Tabla** | Lista de todos los reportes |
| **Acciones** | Íconos para ver, editar, eliminar |

---

## Cómo Crear un Nuevo Reporte

### Paso a Paso:

#### Paso 1: Iniciar el Crear Reporte

1. Haz clic en el botón **➕ Nuevo Reporte** ubicado en la parte superior derecha de la página.

2. Se abrirá un modal con el formulario de creación.

#### Paso 2: Completar el Formulario

El formulario contiene los siguientes campos:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| **Resumen del Turno** | Texto | ✅ Sí | Describe los eventos principales, incidentes y actividades del turno |
| **Severidad** | Selector | ✅ Sí | Nivel de importancia del reporte (1-5) |
| **Estado** | Selector | ✅ Sí | Estado actual del reporte |

#### Paso 3: Seleccionar la Severidad

La severidad indica la importancia del reporte:

| Nivel | Significado | Color | Cuándo usar |
|-------|-------------|-------|-------------|
| **1/5** | Muy Baja | 🟢 Verde | Incidencias menores, tráfico normal, sin eventos relevantes |
| **2/5** | Baja | 🔵 Cyan | Incidentes menores resueltos rápidamente |
| **3/5** | Media | 🟡 Amarillo | Incidentes moderados que requirieron atención |
| **4/5** | Alta | 🟠 Naranja | Incidentes graves, ataques detectados |
| **5/5** | Crítica | 🔴 Rojo | Incidentes críticos, brechas de seguridad |

**Para seleccionar:**
1. Haz clic en el número (1, 2, 3, 4, o 5) que corresponda a la severidad
2. El número seleccionado se resaltará en azul cyan

#### Paso 4: Seleccionar el Estado

El estado indica en qué etapa se encuentra el reporte:

| Estado | Icono | Significado |
|--------|-------|-------------|
| **Borrador** | 📝 | Reporte en preparación, no finalizado |
| **Completado** | ✅ | Reporte finalizado y enviado |
| **Revisión** | 👁️ | Reporte pendiente de aprobación |

**Para seleccionar:**
1. Haz clic en el botón del estado deseado
2. El estado seleccionado se resaltará en azul cyan

#### Paso 5: Escribir el Resumen

En el campo de texto grande:

1. Haz clic para enfocar el área de texto
2. Escribe tu reporte completo. Incluye:
   - Fecha y turno de monitoreo
   - Incidentes detectados
   - Acciones realizadas
   - Tiempo de respuesta
   - Cualquier observación relevante

**Ejemplo de formato:**

```
Reporte de Turno - 03 de Junio 2025

Horario: 08:00 - 16:00

Resumen de Actividad:
- Monitoreo continuo de firewall sin incidentes críticos
- Detección de 5 intentos de login fallidos desde IP 192.168.1.100
- Acciones preventivas aplicadas: IP bloqueada temporalmente
- Análisis de logs de seguridad: tráfico normal
- Escaneo de vulnerabilidades completado: 2 hallazgos menores

Acciones Realizadas:
✓ Bloqueo de IP sospechosa
✓ Revisión de reglas de firewall
✓ Actualización de logs
✓ Notificación al equipo de seguridad

Observaciones:
El tráfico de red se mantuvo dentro de parámetros normales durante todo el turno. 
Se recomienda revisar las reglas de firewall para prevenir intentos similares.
```

#### Paso 6: Guardar el Reporte

1. Revisa que todos los campos estén completados
2. Haz clic en el botón **➕ Crear Reporte**

**Resultado:**
- El reporte se crea inmediatamente
- Aparece en la tabla de reportes con estado "Borrador"
- El modal se cierra automáticamente

---

## Cómo Adjuntar Archivos a un Reporte

### Opción A: Adjuntar al Crear el Reporte

1. **Durante la creación del reporte:**
   - Haz clic en el campo de resumen
   - Escribe una descripción de los archivos
   - Ejemplo: *"Adjunto los logs de seguridad del turno y el reporte de escaneo"*

2. **Después de guardar:**
   - Verás el botón **📎 Adjuntar** en la vista de detalles
   - Haz clic para subir archivos

### Opción B: Adjuntar a un Reporte Existente

1. **Abrir el reporte:**
   - En la tabla de reportes, haz clic en el icono **👁️ Ver** en la fila del reporte
   - Se abrirá el modal con los detalles completos

2. **Buscar el área de archivos:**
   - En la parte inferior del modal, busca la sección **Archivos Adjuntos**
   - Si aún no hay archivos, verás: *"No hay archivos adjuntos"*

3. **Subir archivos:**
   - Haz clic en el botón **➕ Adjuntar Archivos**
   - Se abrirá el explorador de archivos de tu sistema

4. **Seleccionar archivos:**
   - Navega a la carpeta con los archivos que deseas adjuntar
   - Puedes seleccionar múltiples archivos manteniendo presionada la tecla `Cmd` (Mac) o `Ctrl` (Windows)

5. **Tipos de archivos admitidos:**
   - 📄 `.txt` - Archivos de texto
   - 📊 `.csv` - Datos en formato CSV
   - 📋 `.pdf` - Documentos PDF
   - 🖼️ `.png`, `.jpg` - Imágenes y capturas de pantalla
   - 📝 `.log` - Archivos de log

6. **Confirmar subida:**
   - Los archivos se suben automáticamente
   - Aparecerá una lista de archivos adjuntos con:
     - Nombre del archivo
     - Tamaño
     - Fecha de subida
     - Botón para descargar o eliminar

### Opción C: Arrastrar y Soltar

1. **Abre el modal de detalles del reporte:**
   - Haz clic en el icono **👁️ Ver**

2. **Arrastra los archivos:**
   - Arrastra los archivos directamente al área de adjuntos
   - Los archivos se subirán automáticamente

3. **Verificar subida:**
   - Los archivos aparecerán en la lista de adjuntos
   - Puedes ver su nombre, tamaño y fecha

### Gestión de Archivos Adjuntos

#### Ver Archivos Adjuntos

1. Abre el reporte haciendo clic en **👁️ Ver**
2. En la sección "Archivos Adjuntos":
   - Haz clic en el **nombre del archivo** para descargarlo
   - O haz clic en el icono **📥 Descargar**

#### Eliminar Archivos Adjuntos

1. Abre el reporte haciendo clic en **👁️ Ver**
2. En la lista de archivos adjuntos, haz clic en el icono **🗑️ Eliminar** al lado del archivo
3. Confirma la eliminación

#### Limpiar Todos los Archivos

1. Abre el reporte
2. En la sección de archivos adjuntos, haz clic en **🗑️ Limpiar Todos**
3. Confirma la acción

---

## Cómo Editar un Reporte Existente

### Método 1: Desde la Tabla

1. En la tabla de reportes, haz clic en el icono **✏️ Editar** en la fila del reporte que deseas editar

### Método 2: Desde el Modal de Detalles

1. Haz clic en **👁️ Ver** para abrir el detalle del reporte
2. En el modal, haz clic en el botón **✏️ Editar**
3. Haz los cambios necesarios
4. Haz clic en **✓ Guardar Cambios**

### Campos Editables:

- ✅ Resumen del turno
- ✅ Severidad
- ✅ Estado
- ❌ Fecha (no editable)
- ❌ ID (no editable)
- ❌ Autor (no editable)

---

## Cómo Eliminar un Reporte

### Paso 1: Seleccionar el Reporte

1. En la tabla de reportes, encuentra el reporte que deseas eliminar
2. Haz clic en el icono **🗑️ Eliminar** en la fila del reporte

### Paso 2: Confirmar Eliminación

1. Aparecerá un mensaje de confirmación:
   ```
   ¿Estás seguro de eliminar este reporte?
   Esta acción no se puede deshacer.
   ```

2. Haz clic en **Eliminar** para confirmar
3. O haz clic en **Cancelar** para cancelar

### Resultado:

- El reporte se elimina permanentemente
- Se actualiza la lista de reportes
- Las estadísticas se recalculan automáticamente

---

## Buscar y Filtrar Reportes

### Buscar Reportes

1. **Usa el buscador en la parte superior:**
   ```
   [🔍 Buscar por resumen o autor...]
   ```

2. **Escribe tu término de búsqueda:**
   - La búsqueda es en tiempo real
   - Busca en:
     - Resumen del reporte
     - Nombre del autor

3. **Resultados:**
   - Solo los reportes que coincidan se mostrarán
   - Si no hay resultados, verás el estado vacío

### Filtrar por Estado

1. **Usa el filtro de estado:**
   ```
   [Todos ▼]
   ```

2. **Selecciona un estado:**
   - **Todos** - Muestra todos los reportes
   - **Borrador** - Solo reportes en borrador
   - **Completado** - Solo reportes completados
   - **Revisión** - Solo reportes en revisión

3. **Combinar búsqueda y filtro:**
   - Puedes usar ambas funciones simultáneamente
   - Los resultados se actualizan automáticamente

---

## Ver Detalles Completos de un Reporte

### Paso 1: Abrir el Reporte

1. En la tabla de reportes, haz clic en el icono **👁️ Ver** en la fila del reporte

### Paso 2: Información Visible

En el modal de detalles verás:

```
┌─────────────────────────────────────────────────────┐
│              DETALLES DEL REPORTE                   │
│                                [✕]                  │
├─────────────────────────────────────────────────────┤
│  Fecha:      03/06/2025 10:00                       │
│  Severidad:  ⚡ 3/5                                  │
│  Estado:     ✅ Completado                          │
│  Autor:      @admin                                 │
├─────────────────────────────────────────────────────┤
│  Resumen:                                   [✏️]     │
│  Monitoreo de firewall sin incidentes críticos...   │
│                                                     │
│  Incidentes:                                          │
│  🚨 Totales:    5                                     │
│  ✅ Resueltos:  5                                     │
│  ⏰ Pendientes: 0                                     │
├─────────────────────────────────────────────────────┤
│            [✏️ Editar]      [🗑️ Eliminar]             │
└─────────────────────────────────────────────────────┘
```

### Paso 3: Acciones Disponibles

| Botón | Acción |
|-------|--------|
| **✏️ Editar** | Editar el reporte |
| **🗑️ Eliminar** | Eliminar el reporte |
| **[Nombre del Archivo]** | Descargar archivo adjunto |
| **[✕]** | Cerrar modal |

---

## Preguntas Frecuentes

### ❓ ¿Cuántos reportes puedo crear?

**Respuesta:** No hay límite de reportes. Puedes crear tantos como necesites.

### ❓ ¿Puedo editar un reporte completado?

**Respuesta:** Sí, puedes editar cualquier reporte. Sin embargo, te recomendamos cambiar el estado a "Borrador" si estás haciendo cambios significativos.

### ❓ ¿Qué pasa si cierras el formulario sin guardar?

**Respuesta:** Si cierras el modal sin hacer clic en "Crear Reporte", tus cambios no se guardan. El formulario no guarda automáticamente.

### ❓ ¿Puedo adjuntar archivos grandes?

**Respuesta:** Se recomienda adjuntar archivos de hasta 10 MB. Para archivos más grandes, considera usar almacenamiento externo y adjuntar un enlace.

### ❓ ¿Cómo sé si mi reporte fue guardado correctamente?

**Respuesta:** Después de hacer clic en "Crear Reporte", el modal se cerrará y verás el nuevo reporte en la tabla con estado "Borrador".

### ❓ ¿Puedo buscar reportes por fecha?

**Respuesta:** La búsqueda actual es por texto (resumen y autor). Para filtrar por fecha, utiliza el filtro de estado y revisa la columna "Fecha" en la tabla.

### ❓ ¿Qué significan los números de severidad?

**Respuesta:**
- **1-2:** Incidentes menores o normales
- **3:** Incidentes moderados que requieren atención
- **4-5:** Incidentes graves o críticos

### ❓ ¿Puedo exportar mis reportes?

**Respuesta:** Actualmente puedes ver todos los reportes en la tabla. Para exportar, considera hacer una captura de pantalla o copiar los datos manualmente.

---

## 📞 Soporte

Si tienes problemas o necesitas ayuda adicional:

1. **Verifica los logs del navegador:**
   - Abre las herramientas de desarrollador (F12)
   - Revisa la pestaña "Console"

2. **Contacta al administrador del sistema**

3. **Revisa la documentación técnica** en el repositorio del proyecto

---

## ✨ Características Avanzadas

### Atajos de Teclado

| Tecla | Acción |
|-------|--------|
| `Ctrl + S` | Guardar reporte (si disponible) |
| `Esc` | Cerrar modal |
| `Tab` | Navegar entre campos |

### Tips de Uso

1. **Usa plantillas:**
   - Crea reportes de plantilla para uso repetitivo
   - Modifica los existentes en lugar de crear desde cero

2. **Mantén el estado actualizado:**
   - Cambia el estado a "Completado" cuando termines el reporte
   - Usa "Revisión" si necesitas aprobación

3. **Adjunta evidencia:**
   - Incluye capturas de pantalla de incidentes
   - Adjunta archivos de log relevantes
   - Documenta acciones tomadas

4. **Usa descripciones claras:**
   - Sé específico en el resumen
   - Incluye fechas, horas y ubicaciones
   - Documenta todo el proceso de respuesta

---

## 📅 Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 03/06/2025 | Versión inicial de la guía |

---

**Documento creado para SOC Monitor Advanced v1.0**

---

*Esta guía se actualiza según las nuevas funcionalidades del sistema.*
