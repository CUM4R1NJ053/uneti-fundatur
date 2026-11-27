# FUNDATUR SOCIAL × UNETI — Plataforma Web de Turismo Social e Inventario Tecnológico

## 📋 Descripción General

**FUNDATUR SOCIAL × UNETI** es una plataforma web educativa de turismo social e inventario tecnológico, desarrollada como proyecto universitario PNF Ingeniería en Informática. El sistema integra la identidad institucional de la Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI) con funcionalidades de cotización de paquetes turísticos, reservas simuladas, inventario tecnológico auditado y testimonios interactivos. Funciona completamente desde `index.html` sin necesidad de servidores ni instalaciones, ideal para evaluación y demostración académica.

---

## 🚀 Características Principales

| # | Característica | Descripción |
|---|---|---|
| 1 | **Identidad Turismo Social** | Paleta océano profundo teal/amber, logo FUNDATUR SOCIAL, slogan "Tu descanso es nuestro destino: turismo accesible para quienes mueven el país." |
| 2 | **Zonas de Viaje** | Cuatro regiones con filtros por región, precio y accesibilidad; cada zona tiene itinerarios desplegables `<details>`: <br>• **Morrocoy** – Costa caribeña, cayos, snorkeling <br>• **Margarita** – Destino insular, playas, cultura <br>• **Mérida** – Andes, páramo, teleférico Mukumbarí <br>• **Canaima** – Gran Sabana, saltos Ángel, tepuyes |
| 3 | **Paquetes y Promociones** | Cuatro paquetes turísticos con cálculo de precios en tiempo real con descuentos por beneficiario y temporada alta. |
| 4 | **Cotizador Dinámico** | `js/cotizador.js` con descuentos estudiantiles (30%), público (20%) y multiplicadores de temporada (1.0x normal, 1.25x alta); botón de descarga de voucher `.txt` demo. |
| 5 | **Módulo de Reservas Demo** | Modal de reserva con `FirebaseSync.registrarReserva`; cupo máximo 20 por paquete; fallback a `localStorage` si Firebase no está configurado. Sin pagos reales — flujo educativo simulado. |
| 6 | **Testimonios Interactivos** | Los usuarios pueden registrar testimonios con rating de estrellas (guardado en `localStorage`); visualización con estrellas activas y descripción del viaje. |
| 7 | **Inventario Tecnológico Auditado** | 40 equipos (FND-01 a FND-40) con ficha técnica completa; exportación a CSV con todos los campos; estadísticas en tiempo real (operativos, con fallas, prioridad crítica). |
| 8 | **Sesiones Didácticas + Visor Google Drive + RBAC + Optimización Móvil** | 5 fases didácticas con integración Google Drive; sistema de roles (visitante/Administrador); interfaz optimizada para touch en dispositivos móviles. |

---

## 📁 Estructura del Código Fuente

```text
UNETI/
├── index.html              ← Punto de entrada principal (abre esto en el navegador)
├── README.md               ← Esta documentación
├── server.js               ← Servidor Node.js opcional
├── css/
│   └── styles.css          ← Estilos personalizados, fondo oceánico profundo, animaciones
├── js/
│   ├── app.js              ← Inicializador y enlace entre componentes
│   ├── auth.js             ← Módulo RBAC de autenticación (modo visitante / admin)
│   ├── config.js           ← Metadatos institucionales y credenciales de admin
│   ├── cotizador.js        ← Dinámico cotizador de paquetes con descuentos y descarga voucher
│   ├── drive-helper.js     ← Motor de extracción de IDs y embeds de Google Drive
│   ├── firebase-config.js  ← Configuración de Firebase Realtime Database
│   ├── firebase-sync.js    ← Sincronización en tiempo real con Firebase
│   ├── fundatur-info.js    ← Información institucional FUNDATUR y diagnóstico técnico
│   ├── inventory-data.js   ├── Datos del inventario auditado (40 equipos, FND-01 a FND-40)
│   ├── inventory-ui.js     ← Gestión visual y eventos de la tabla de inventario
│   ├── main.js             ← Núcleo principal configuración FUNDATUR SOCIAL / UNETI
│   ├── navigation-manager.js← Router SPA para control de vistas por sección
│   ├── storage.js          ← Almacenamiento persistente (localStorage) con datos semilla
│   └── ui.js               ← Gestión de componentes de interfaz y modales
└── assets/
    ├── destino-morrocoy.jpg   ← Morrocoy (Costa Caribeña)
    ├── destino-margarita.jpg  ← Isla de Margarita (Destino Insular)
    ├── destino-merida.jpg     ← Mérida (Andes Venezolanos)
    ├── destino-canaima.jpg    ├── Canaima (Gran Sabana)
    ├── banner-fundatur.jpeg   ← Banner institucional FUNDATUR SOCIAL
    ├── logo-uneti.png         ← Logotipo oficial UNETI (PNG)
    ├── logo-uneti.svg         ← Logotipo vectorial UNETI
    ├── favicon.png            ← Ícono PNG
    └── favicon.svg            ← Ícono SVG
```

---

## 🖥️ Cómo Ejecutar la Aplicación

**No requiere instalación compleja:**
1. Haz **doble clic** en `index.html` para abrir directamente en tu navegador.
2. O ejecuta `./servidor-local.bat` o `node server.js` si prefieres entorno local con servidor.

---

## 🔐 Sistema de Acceso y Roles (RBAC)

- **Modo Visitante:** Exploración libre de zonas de viaje, cotizador, inventario y sesiones didácticas.
- **Modo Administrador:** Credenciales predeterminadas (`admin` / `uneti2025`) para gestión completa de datos, respaldo e inventario.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 & CSS3** (Océano Profundo / Tailwind CSS)
- **JavaScript Vanilla (ES2020+)** modular (`cotizador.js`, `firebase-sync.js`, etc.)
- **Firebase Realtime Database & localStorage** para persistencia y reservas con cupo limitado.

---

## 📝 Nota Importante: Flujos Simulados Educativos

**Los flujos de cotización y reserva son simulaciones educativas (demo) sin pagos reales.**
- El cotizador genera vouchers `.txt` de demostración.
- El módulo de reservas (`FirebaseSync.registrarReserva`) limita a 20 cupos por paquete con fallback a `localStorage`.

---

## 👥 Créditos y Autoría

Desarrollado para la evaluación universitaria PNF Ingeniería en Informática — **FUNDATUR SOCIAL × UNETI**. Periodo Académico 2026-2027.
