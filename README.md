# Plataforma Web Académica — UNETI
## Proyecto Socioeconómico · Ingeniería en Informática

**Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI)**  
*Carrera: Ingeniería en Informática*  
*Materia: Proyecto Socioeconómico · Periodo Académico 2024-2025*

---

## 📋 Descripción General

Plataforma web académica de alto impacto, interactiva y modular, desarrollada para la gestión, presentación y evaluación continua de las **Sesiones Didácticas** del Proyecto Socioeconómico.

El portal integra la identidad institucional oficial de la UNETI con un diseño moderno (High-Impact UI/UX), soporte 100% responsivo, gestión dinámica de integrantes y jurado evaluador, y un visor multimedia conectado directamente a **Google Drive**. Todo funciona directamente desde el archivo `index.html` sin necesidad de servidores ni instalaciones.

---

## 🚀 Características Principales

| # | Característica | Descripción |
|---|---|---|
| 1 | **Identidad UNETI** | Logo oficial, favicon y paleta institucional (azul marino, naranja, cyan) |
| 2 | **Sesiones Didácticas** | Tarjetas con acordeón para organizar sesiones I, II, III… dinámicamente |
| 3 | **Visor Google Drive** | Reproduce videos, muestra PDFs, imágenes y presentaciones embebidas |
| 4 | **Equipo & Jurado** | Gestión de integrantes del equipo y profesor/jurado evaluador |
| 5 | **Control de Acceso (RBAC)** | Modo visitante (solo lectura) y modo administrador (gestión completa) |
| 6 | **Filtros Dinámicos** | Pastillas de filtro que aparecen solo para las sesiones que existen |
| 7 | **Exportar / Importar** | Respaldo en JSON para compartir datos entre compañeros |

---

## 📁 Estructura del Código Fuente

```text
UNETI/
├── index.html              ← Punto de entrada principal (abre esto en el navegador)
├── README.md               ← Esta documentación
├── css/
│   └── styles.css          ← Estilos personalizados, fondo geométrico, animaciones
├── js/
│   ├── main.js             ← Núcleo principal unificado (compatible con file://)
│   ├── config.js           ← Metadatos institucionales y credenciales de admin
│   ├── drive-helper.js     ← Motor de extracción de IDs y embeds de Google Drive
│   ├── storage.js          ← Almacenamiento persistente (localStorage) con datos semilla
│   ├── auth.js             ← Módulo RBAC de autenticación
│   ├── ui.js               ← Renderizado dinámico del DOM, modales y notificaciones
│   └── app.js              ← Inicializador y enlace entre componentes
└── assets/
    ├── logo-uneti.png      ← Logotipo oficial UNETI (PNG de alta resolución)
    ├── favicon.png         ← Ícono de pestaña del navegador
    └── logo-uneti.svg      ← Logotipo vectorial complementario
```

---

## 🖥️ Cómo Ejecutar la Aplicación

**No requiere instalación, Node.js ni servidores:**

1. Haz **doble clic** en `index.html`.
2. Se abrirá automáticamente en tu navegador web (Chrome, Edge, Firefox).
3. ¡Listo! La plataforma funciona completamente desde allí.

> **Opcional (Servidor Local):** Si usas VS Code con la extensión *Live Server*, haz clic derecho en `index.html` → *Open with Live Server* para tener recarga automática mientras editas.

---

## 🔐 Sistema de Acceso y Roles (RBAC)

La plataforma tiene dos modos de uso:

### Modo Visitante (Sin login)
- Navegar por todas las sesiones didácticas.
- Reproducir videos y abrir documentos de Google Drive.
- Ver la lista de integrantes y jurado evaluador.
- **No puede** agregar, editar ni eliminar contenido.

### Modo Administrador (Con login)
Para acceder como administrador:
1. Haz clic en el botón **🔒 Admin** en la barra de navegación superior, o en **"Acceso Administrativo"** en el pie de página.
2. Ingresa las credenciales:

| Campo | Valor |
|---|---|
| **Usuario** | `admin` |
| **Contraseña** | `uneti2025` |

3. Se habilitarán los botones para:
   - ✅ Agregar / Editar / Eliminar sesiones didácticas.
   - ✅ Agregar / Editar / Eliminar integrantes del equipo.
   - ✅ Agregar / Editar / Eliminar miembros del jurado.
   - ✅ Exportar respaldo (JSON) e importar datos.
   - ✅ Restablecer a valores de fábrica.

> ⚠️ **Para cambiar la contraseña:** Edita el archivo `js/config.js`, línea `defaultPass: "uneti2025"`, y coloca tu nueva contraseña.

---

## ✏️ Cómo Editar el Código Fuente — Guía para Estudiantes

### A. Cambiar el Nombre del Proyecto y de la Carrera

Abre el archivo `js/config.js` con cualquier editor de texto (Bloc de notas, VS Code, Notepad++):

```javascript
// js/config.js — Líneas de interés:
institution: {
  name: "Universidad Nacional Experimental de las Telecomunicaciones e Informática",
  acronym: "UNETI",
  subject: "Proyecto Socioeconómico",
  trayecto: "Ingeniería en Informática",        // ← Tu carrera aquí
  academicPeriod: "Periodo Académico 2024-2025", // ← Año académico
  projectTitle: "Título de tu proyecto aquí",    // ← Título real del proyecto
}
```

### B. Cambiar los Integrantes y el Profesor Predeterminados

Los datos que aparecen la primera vez que abres la app vienen de `js/storage.js`. Busca el objeto `INITIAL_TEAM`:

```javascript
// js/storage.js — Busca "INITIAL_TEAM"
const INITIAL_TEAM = {
  students: [
    {
      name: "Tu Nombre Completo",    // ← Nombre real del estudiante
      cedula: "V-00.000.000",        // ← Cédula de identidad
      role: "Desarrollo Web",        // ← Tu rol en el proyecto
      email: "correo@ejemplo.com",   // ← Correo (opcional)
      phone: "0414-0000000"          // ← Teléfono (opcional)
    },
    // Agrega más estudiantes repitiendo el bloque { } arriba
  ],
  jury: [
    {
      name: "Prof. Nombre del Profesor",  // ← Nombre del tutor/profesor
      title: "Mg. / Lic. / Dr.",         // ← Título académico
      role: "Tutor Académico",           // ← Rol: Tutor, Jurado, etc.
      department: "Coordinación UNETI",  // ← Departamento
      email: "profe@uneti.edu.ve"        // ← Correo del profesor
    }
  ]
};
```

> **Importante:** Después de editar `INITIAL_TEAM`, abre el navegador, presiona `F12` → Consola → escribe `localStorage.clear()` y presiona Enter → recarga la página (`F5`). Así los nuevos datos aparecerán.

### C. Agregar o Editar Sesiones Didácticas Desde la Interfaz (Recomendado)

1. Inicia sesión como administrador (`admin` / `uneti2025`).
2. Haz clic en el botón **"+ Nueva Sesión Didáctica"** (aparece solo al estar logueado).
3. Llena el formulario:
   - **Sesión:** Escribe `Sesión Didáctica I` (o II, III, IV…).
   - **Título:** El tema de esa sesión.
   - **Objetivos:** Lo que se logra en esa sesión.
   - **Descripción:** Detalles del contenido.
   - **Recursos:** Pega los enlaces de Google Drive de tus videos, PDFs o imágenes.
4. Haz clic en **"Guardar"**. La tarjeta aparecerá inmediatamente.

### D. Cambiar los Colores e Identidad Visual

Abre `css/styles.css` para cambiar colores del fondo y efectos. Las variables de Tailwind están en `index.html` dentro de la etiqueta `<style>`.

Para cambiar el logo, reemplaza el archivo `assets/logo-uneti.png` con tu imagen (mismo nombre de archivo, formato PNG recomendado).

---

## 📦 Instrucciones para Subir a Google Classroom

### Paso 1 — Verificar que todo funcione
1. Haz doble clic en `index.html` y revisa que:
   - El logo aparezca correctamente.
   - Las sesiones didácticas se muestren.
   - Los nombres de tu equipo y profesor estén correctos.
   - Los enlaces de Google Drive carguen los recursos.

### Paso 2 — Comprimir la carpeta
1. Haz clic derecho en la carpeta **`UNETI`** (la carpeta completa, no solo el archivo).
2. Selecciona **"Enviar a" → "Carpeta comprimida (zip)"** (en Windows) o **"Comprimir"** (en Mac).
3. Se creará el archivo **`UNETI.zip`**.

> **En Windows 11:** Clic derecho → *Comprimir en archivo ZIP*.

### Paso 3 — Subir a Google Classroom
1. Entra a [classroom.google.com](https://classroom.google.com) con tu cuenta institucional.
2. Busca la tarea asignada de **Proyecto Socioeconómico**.
3. Haz clic en **"Agregar o crear"** → **"Archivo"**.
4. Sube el archivo **`UNETI.zip`**.
5. Haz clic en **"Entregar"** (o "Turn in").

### Nota para el Evaluador / Profesor
Para revisar la plataforma:
1. Descomprimir el archivo `UNETI.zip`.
2. Abrir la carpeta `UNETI` resultante.
3. Hacer doble clic en `index.html`.
4. La plataforma cargará completamente en el navegador. No requiere internet para funcionar (excepto para los recursos alojados en Google Drive).

---

## 🌐 Configuración de Permisos en Google Drive

Para que los videos, PDFs y presentaciones carguen dentro del visor integrado:

1. En Google Drive, haz clic derecho sobre el archivo → **"Compartir"**.
2. En **"Acceso general"**, selecciona **"Cualquier persona con el enlace"** en modo **"Lector"**.
3. Haz clic en **"Copiar enlace"**.
4. Pega ese enlace en la plataforma al agregar o editar un recurso de la sesión.

> Los formatos compatibles son: **MP4** (video), **PDF**, **Google Docs**, **Google Slides**, **Google Sheets**, imágenes (JPG, PNG).

---

## 👥 Colaboración Entre Compañeros de Equipo

Para sincronizar los datos entre los dos integrantes del equipo:

1. El **Integrante A** inicia sesión como admin y agrega todos los datos (sesiones, integrantes, jurado).
2. Hace clic en **"Descargar Datos (JSON)"** (en el pie de página) → se descarga un archivo `.json`.
3. Le envía ese archivo al **Integrante B** (por WhatsApp, correo, etc.).
4. El **Integrante B** hace clic en **"Importar"** (en la barra de administración) y selecciona el archivo recibido.
5. ✅ Ambos tienen la misma información al instante.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso | Versión |
|---|---|---|
| **HTML5** | Estructura semántica y accesible | — |
| **Tailwind CSS** | Framework de utilidades de diseño | v3.x (CDN) |
| **JavaScript Vanilla** | Lógica dinámica sin frameworks | ES2020+ |
| **Font Awesome** | Íconos vectoriales | v6.x (CDN) |
| **Google Drive API** | Visor y reproductor multimedia | Embeds públicos |
| **localStorage** | Persistencia de datos en el navegador | Web API |

> No se usa ningún backend, base de datos externa ni framework como React o Vue. El proyecto es 100% estático y portable.

---

## 🔧 Créditos y Autoría

Desarrollado para la comunidad universitaria de la **UNETI** — *Ingeniería en Informática*.  
Periodo Académico 2024-2025 · Proyecto Socioeconómico.

*Plataforma construida con HTML5, Tailwind CSS y JavaScript Vanilla.*
