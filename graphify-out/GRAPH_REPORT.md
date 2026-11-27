# Graph Report - UNETI  (2026-11-27)

## Corpus Check
- 15 files · ~36,843 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .bat 2, .css 1)

## Summary
- 252 nodes · 621 edges · 12 communities (5 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5b964c6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UIManager
- UIManager
- app.js
- Plataforma Web Académica — UNETI
- InventoryUI
- StorageManager
- InventoryUI
- DriveHelper
- NavigationManager
- server.js
- firebase-sync.js

## God Nodes (most connected - your core abstractions)
1. `UIManager` - 38 edges
2. `UIManager` - 37 edges
3. `StorageManager` - 26 edges
4. `StorageManager` - 24 edges
5. `InventoryUI` - 18 edges
6. `InventoryUI` - 15 edges
7. `Plataforma Web Académica — UNETI` - 13 edges
8. `NavigationManager` - 11 edges
9. `DriveHelper` - 10 edges
10. `AuthManager` - 8 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (12 total, 7 thin omitted)

### Community 2 - "app.js"
Cohesion: 0.15
Nodes (7): navManager, AuthManager, CONFIG, DriveHelper, FUNDATUR_INFO, INITIAL_SESSIONS, INITIAL_TEAM

### Community 3 - "Plataforma Web Académica — UNETI"
Cohesion: 0.08
Nodes (23): A. Cambiar el Nombre del Proyecto y de la Carrera, B. Cambiar los Integrantes y el Profesor Predeterminados, C. Agregar o Editar Sesiones Didácticas Desde la Interfaz (Recomendado), 🚀 Características Principales, 👥 Colaboración Entre Compañeros de Equipo, 🌐 Configuración de Permisos en Google Drive, 🔧 Créditos y Autoría, ✏️ Cómo Editar el Código Fuente — Guía para Estudiantes (+15 more)

### Community 6 - "InventoryUI"
Cohesion: 0.21
Nodes (3): INVENTORY_DATA, INVENTORY_STATS, InventoryUI

### Community 7 - "DriveHelper"
Cohesion: 0.19
Nodes (3): AuthManager, DriveHelper, NavigationManager

### Community 9 - "server.js"
Cohesion: 0.22
Nodes (6): fs, http, MIME_TYPES, path, serveFile(), server

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UIManager` connect `UIManager` to `app.js`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `UIManager` be split into smaller, more focused modules?**
  _Cohesion score 0.10286382232612508 - nodes in this community are weakly interconnected._
- **Why does `StorageManager` connect `UIManager` to `app.js`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `Plataforma Web Académica — UNETI` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Why does `UIManager` connect `UIManager` to `DriveHelper`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._