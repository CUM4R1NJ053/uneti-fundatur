/**
 * UNETI - PROYECTO SOCIOECONÓMICO
 * Capa de Presentación, Renderizado de Interfaz y Control de Modales
 */

import { CONFIG } from './config.js';
import { DriveHelper } from './drive-helper.js';
import { StorageManager } from './storage.js';
import { AuthManager } from './auth.js';

export class UIManager {
  static currentFilter = 'all';
  static searchQuery = '';
  static activeEditingSessionId = null;

  /**
   * Inicializa la interfaz de usuario
   */
  static init() {
    this.renderHeaderAndHero();
    this.renderFilterPills();
    this.renderSessions();
    this.renderTeam();
    this.updateStats();
    this.updateAdminUI(AuthManager.isAdmin());
    this.setupEventListeners();
  }

  /**
   * Renderiza el encabezado institucional y estadísticas
   */
  static renderHeaderAndHero() {
    const institutionTitle = document.getElementById('inst-name');
    if (institutionTitle) institutionTitle.textContent = CONFIG.institution.name;

    const subjectTitle = document.getElementById('project-subject');
    if (subjectTitle) subjectTitle.textContent = CONFIG.institution.subject;

    const trayectoInfo = document.getElementById('project-trayecto');
    if (trayectoInfo) trayectoInfo.textContent = `${CONFIG.institution.trayecto} • ${CONFIG.institution.academicPeriod}`;

    const mainTitle = document.getElementById('project-title');
    if (mainTitle) mainTitle.textContent = CONFIG.institution.projectTitle;
  }

  /**
   * Renderiza los filtros por sesión dinámicos
   */
  static renderFilterPills() {
    const container = document.getElementById('filter-pills-container');
    if (!container) return;

    const sessions = StorageManager.getSessions();
    const distinctPhases = [];
    sessions.forEach(s => {
      if (s.phase && !distinctPhases.includes(s.phase)) {
        distinctPhases.push(s.phase);
      }
    });

    if (this.currentFilter !== 'all' && !distinctPhases.includes(this.currentFilter)) {
      this.currentFilter = 'all';
    }

    const allActive = this.currentFilter === 'all';

    let html = `
      <button 
        onclick="window.ui.filterByPhase('all')" 
        class="shrink-0 px-3.5 py-1.5 rounded-full font-medium border transition ${allActive ? 'bg-sky-600 text-white border-sky-500 shadow-sm' : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-slate-600'}"
      >
        Todas las Sesiones Didácticas (${sessions.length})
      </button>
    `;

    distinctPhases.forEach(phase => {
      const isActive = this.currentFilter.toLowerCase() === phase.toLowerCase();
      html += `
        <button 
          onclick="window.ui.filterByPhase('${phase}')" 
          class="shrink-0 px-3.5 py-1.5 rounded-full font-medium border transition ${isActive ? 'bg-sky-600 text-white border-sky-500 shadow-sm' : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-slate-600'}"
        >
          ${phase}
        </button>
      `;
    });

    container.innerHTML = html;
  }

  static filterByPhase(phase) {
    this.currentFilter = phase;
    this.renderFilterPills();
    this.renderSessions();
  }

  /**
   * Actualiza el contador de estadísticas del Hero
   */
  static updateStats() {
    const sessions = StorageManager.getSessions();
    const totalSessions = sessions.length;
    let totalResources = 0;
    let completedCount = 0;

    sessions.forEach(s => {
      if (s.resources) totalResources += s.resources.length;
      if (s.status === 'Aprobado' || s.status === 'Completado') completedCount++;
    });

    const statSessionsEl = document.getElementById('stat-total-sessions');
    if (statSessionsEl) statSessionsEl.textContent = totalSessions;

    const statResourcesEl = document.getElementById('stat-total-resources');
    if (statResourcesEl) statResourcesEl.textContent = totalResources;

    const statProgressEl = document.getElementById('stat-progress-pct');
    if (statProgressEl) {
      const pct = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;
      statProgressEl.textContent = `${pct}%`;
    }
  }

  /**
   * Renderiza el listado interactivo de sesiones didácticas
   */
  static renderSessions() {
    const container = document.getElementById('sessions-container');
    if (!container) return;

    let sessions = StorageManager.getSessions();

    // Filtro por sesión específica
    if (this.currentFilter !== 'all') {
      sessions = sessions.filter(s => s.phase.toLowerCase() === this.currentFilter.toLowerCase());
    }

    // Filtro por búsqueda
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      sessions = sessions.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.phase.toLowerCase().includes(q) ||
        (s.resources && s.resources.some(r => r.title.toLowerCase().includes(q)))
      );
    }

    if (sessions.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center glass-panel rounded-2xl p-8 border border-dashed border-slate-700">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-2xl">
            <i class="fa-solid fa-folder-open"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-200 mb-2">No se encontraron sesiones didácticas</h3>
          <p class="text-slate-400 max-w-md mx-auto text-sm">
            ${this.searchQuery ? `No hay resultados para "${this.searchQuery}". Intenta con otros términos.` : 'Aún no se han registrado sesiones didácticas en este módulo.'}
          </p>
          ${AuthManager.isAdmin() ? `
            <button onclick="window.ui.openNewSessionModal()" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition shadow-lg shadow-sky-600/30 text-sm">
              <i class="fa-solid fa-plus"></i> Crear Primera Sesión
            </button>
          ` : ''}
        </div>
      `;
      return;
    }

    const isAdmin = AuthManager.isAdmin();

    container.innerHTML = sessions.map((session) => {
      const statusBadgeColor = session.status === 'Aprobado' 
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
        : session.status === 'Completado' 
          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
          : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

      const pulseDot = (session.status === 'En Desarrollo' || session.status === 'En Curso') 
        ? '<span class="w-2 h-2 rounded-full bg-amber-400 pulse-dot inline-block mr-1.5"></span>' 
        : '<span class="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5"></span>';

      const objectivesList = (session.objectives || []).map(obj => `
        <li class="flex items-start gap-2.5 text-sm text-slate-300">
          <i class="fa-solid fa-circle-check text-sky-400 text-xs mt-1 shrink-0"></i>
          <span>${obj}</span>
        </li>
      `).join('');

      const resourcesList = (session.resources || []).map(res => {
        const typeConfig = CONFIG.resourceTypes[res.type] || CONFIG.resourceTypes.drive;
        const downloadUrl = DriveHelper.getDownloadUrl(res.driveUrl);
        const viewUrl = DriveHelper.getViewUrl(res.driveUrl);

        return `
          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-3 group">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${typeConfig.color}">
                <i class="${typeConfig.icon} text-lg"></i>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h5 class="text-sm font-semibold text-slate-100 truncate">${res.title}</h5>
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full border ${typeConfig.color}">
                    ${typeConfig.label}
                  </span>
                </div>
                ${res.description ? `<p class="text-xs text-slate-400 truncate mt-0.5">${res.description}</p>` : ''}
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button 
                onclick="window.ui.openViewer('${session.id}', '${res.id}')"
                class="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-medium transition flex items-center gap-1.5"
                title="Visualizar dentro de la plataforma"
              >
                <i class="fa-solid fa-eye text-xs"></i>
                <span>Ver / Reproducir</span>
              </button>

              <a 
                href="${viewUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition inline-flex items-center justify-center"
                title="Abrir en Google Drive en pestaña nueva"
              >
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>

              <a 
                href="${downloadUrl}" 
                target="_blank" 
                download
                class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition inline-flex items-center justify-center"
                title="Descarga directa"
              >
                <i class="fa-solid fa-download"></i>
              </a>
            </div>
          </div>
        `;
      }).join('');

      return `
        <article class="glass-panel rounded-2xl overflow-hidden border border-slate-800 transition-all duration-300 hover:border-slate-700" id="card-${session.id}">
          <div class="p-6 pb-4">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-sky-950/60 text-sky-400 border border-sky-800/60 uppercase tracking-wider">
                  ${session.phase}
                </span>
                <span class="text-xs text-slate-400 font-medium">
                  <i class="fa-regular fa-calendar-check text-slate-500 mr-1"></i> ${session.week} • ${session.date}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-medium border flex items-center ${statusBadgeColor}">
                  ${pulseDot} ${session.status}
                </span>

                ${isAdmin ? `
                  <div class="flex items-center gap-1 ml-2 pl-2 border-l border-slate-800">
                    <button onclick="window.ui.moveSession('${session.id}', 'up')" class="p-1.5 text-xs text-slate-400 hover:text-white rounded bg-slate-800/80 hover:bg-slate-700 transition" title="Mover arriba">
                      <i class="fa-solid fa-chevron-up"></i>
                    </button>
                    <button onclick="window.ui.moveSession('${session.id}', 'down')" class="p-1.5 text-xs text-slate-400 hover:text-white rounded bg-slate-800/80 hover:bg-slate-700 transition" title="Mover abajo">
                      <i class="fa-solid fa-chevron-down"></i>
                    </button>
                    <button onclick="window.ui.openEditSessionModal('${session.id}')" class="p-1.5 text-xs text-sky-400 hover:text-sky-300 rounded bg-slate-800/80 hover:bg-slate-700 transition ml-1" title="Editar Sesión">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="window.ui.confirmDeleteSession('${session.id}')" class="p-1.5 text-xs text-red-400 hover:text-red-300 rounded bg-slate-800/80 hover:bg-slate-700 transition" title="Eliminar Sesión">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ` : ''}
              </div>
            </div>

            <h3 class="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-sky-400 transition">
              ${session.title}
            </h3>

            <p class="text-sm text-slate-300 leading-relaxed">
              ${session.summary}
            </p>
          </div>

          <div class="px-6 pb-6">
            <details class="group bg-slate-950/60 rounded-xl border border-slate-800/80 transition overflow-hidden open:border-slate-700" open>
              <summary class="p-3.5 px-4 flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-300 uppercase tracking-wider hover:bg-slate-900/80 transition">
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-bullseye text-sky-400"></i>
                  Objetivos Didácticos & Recursos de Drive (${session.resources ? session.resources.length : 0})
                </span>
                <i class="fa-solid fa-chevron-down accordion-chevron transition-transform duration-200 text-slate-400"></i>
              </summary>

              <div class="p-4 pt-3 border-t border-slate-800/60 space-y-4">
                <div>
                  <h5 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                    Competencias y Objetivos Específicos
                  </h5>
                  <ul class="space-y-2">
                    ${objectivesList}
                  </ul>
                </div>

                <div>
                  <h5 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>Recursos Multimedia y Archivos de Drive</span>
                    <span class="text-[11px] text-sky-400 lowercase font-normal">
                      <i class="fa-brands fa-google-drive mr-1"></i>sincronizado
                    </span>
                  </h5>
                  <div class="space-y-2.5">
                    ${resourcesList.length > 0 ? resourcesList : '<p class="text-xs text-slate-500 italic">No hay recursos multimedia adjuntos para esta sesión.</p>'}
                  </div>
                </div>
              </div>
            </details>
          </div>
        </article>
      `;
    }).join('');
  }

  /**
   * Actualiza los elementos de la interfaz basados en el estado de autenticación (RBAC)
   */
  static updateAdminUI(isAdmin) {
    const adminBanner = document.getElementById('admin-floating-banner');
    const loginBtn = document.getElementById('btn-nav-login');
    const btnAddStudent = document.getElementById('btn-add-student');
    const btnAddJury = document.getElementById('btn-add-jury');

    if (adminBanner) {
      if (isAdmin) {
        adminBanner.classList.remove('hidden');
        adminBanner.classList.add('flex');
      } else {
        adminBanner.classList.add('hidden');
        adminBanner.classList.remove('flex');
      }
    }

    if (loginBtn) {
      if (isAdmin) {
        loginBtn.innerHTML = `
          <i class="fa-solid fa-right-from-bracket text-red-400"></i>
          <span class="hidden sm:inline">Cerrar Sesión</span>
        `;
        loginBtn.classList.remove('bg-sky-600', 'hover:bg-sky-500', 'text-white');
        loginBtn.classList.add('bg-slate-800', 'hover:bg-red-950/40', 'text-red-400', 'border-red-900/40');
      } else {
        loginBtn.innerHTML = `
          <i class="fa-solid fa-shield-halved text-sky-400"></i>
          <span>Acceso Docente / Admin</span>
        `;
        loginBtn.classList.add('bg-slate-800', 'hover:bg-slate-700', 'text-slate-200');
        loginBtn.classList.remove('hover:bg-red-950/40', 'text-red-400', 'border-red-900/40');
      }
    }

    // Botones de agregar integrantes restringidos a administradores
    if (btnAddStudent) {
      if (isAdmin) {
        btnAddStudent.classList.remove('hidden');
        btnAddStudent.classList.add('inline-flex');
      } else {
        btnAddStudent.classList.add('hidden');
        btnAddStudent.classList.remove('inline-flex');
      }
    }

    if (btnAddJury) {
      if (isAdmin) {
        btnAddJury.classList.remove('hidden');
        btnAddJury.classList.add('inline-flex');
      } else {
        btnAddJury.classList.add('hidden');
        btnAddJury.classList.remove('inline-flex');
      }
    }

    this.renderSessions();
    this.renderTeam();
    this.renderFilterPills();
  }

  /**
   * Abre el Visor Multimedia de Google Drive incrustado
   */
  static openViewer(sessionId, resourceId) {
    const sessions = StorageManager.getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const resource = session.resources.find(r => r.id === resourceId);
    if (!resource) return;

    const modal = document.getElementById('viewer-modal');
    const titleEl = document.getElementById('viewer-title');
    const sessionEl = document.getElementById('viewer-session');
    const frameContainer = document.getElementById('viewer-iframe-container');
    const externalLink = document.getElementById('viewer-external-link');
    const downloadLink = document.getElementById('viewer-download-link');

    if (titleEl) titleEl.textContent = resource.title;
    if (sessionEl) sessionEl.textContent = `${session.phase} • ${session.title}`;

    const embedUrl = DriveHelper.getEmbedUrl(resource.driveUrl, resource.type);
    const viewUrl = DriveHelper.getViewUrl(resource.driveUrl);
    const downloadUrl = DriveHelper.getDownloadUrl(resource.driveUrl);

    if (externalLink) externalLink.href = viewUrl;
    if (downloadLink) downloadLink.href = downloadUrl;

    const isVideo = resource.type === 'video';

    if (isVideo) {
      frameContainer.innerHTML = `
        <div class="drive-embed-container rounded-xl overflow-hidden shadow-2xl border border-slate-800">
          <iframe 
            src="${embedUrl}" 
            allow="autoplay; encrypted-media; fullscreen" 
            allowfullscreen>
          </iframe>
        </div>
      `;
    } else {
      frameContainer.innerHTML = `
        <div class="drive-doc-container rounded-xl overflow-hidden shadow-2xl border border-slate-800">
          <iframe 
            src="${embedUrl}" 
            allow="fullscreen" 
            allowfullscreen>
          </iframe>
        </div>
      `;
    }

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
  }

  static closeViewer() {
    const modal = document.getElementById('viewer-modal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
      modal.classList.add('hidden');
      const frameContainer = document.getElementById('viewer-iframe-container');
      if (frameContainer) frameContainer.innerHTML = '';
      document.body.style.overflow = '';
    }, 250);
  }

  static openLoginModal() {
    if (AuthManager.isAdmin()) {
      AuthManager.logout();
      this.showToast("Sesión de Administrador cerrada correctamente.", "info");
      return;
    }

    const modal = document.getElementById('login-modal');
    const userInput = document.getElementById('login-username');
    const passInput = document.getElementById('login-password');
    const errorEl = document.getElementById('login-error');

    if (userInput) userInput.value = '';
    if (passInput) passInput.value = '';
    if (errorEl) errorEl.classList.add('hidden');

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('active');
      if (userInput) userInput.focus();
    }, 10);
  }

  static closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  static handleLoginSubmit(e) {
    e.preventDefault();
    const userInput = document.getElementById('login-username').value;
    const passInput = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    const success = AuthManager.login(userInput, passInput);
    if (success) {
      this.closeLoginModal();
      this.showToast("¡Bienvenido! Modo Administrador desbloqueado.", "success");
    } else {
      if (errorEl) {
        errorEl.textContent = "Credenciales incorrectas. (Pista: admin / uneti2025)";
        errorEl.classList.remove('hidden');
      }
    }
  }

  static openNewSessionModal() {
    this.activeEditingSessionId = null;
    const modal = document.getElementById('session-form-modal');
    const title = document.getElementById('modal-session-title');
    const form = document.getElementById('session-editor-form');

    if (title) title.innerHTML = '<i class="fa-solid fa-plus-circle text-sky-400 mr-2"></i>Nueva Sesión Didáctica';
    if (form) form.reset();

    this.renderFormResourceRows([]);

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);
  }

  static openEditSessionModal(sessionId) {
    this.activeEditingSessionId = sessionId;
    const sessions = StorageManager.getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const modal = document.getElementById('session-form-modal');
    const title = document.getElementById('modal-session-title');

    if (title) title.innerHTML = '<i class="fa-solid fa-pen-to-square text-sky-400 mr-2"></i>Editar Sesión Didáctica';

    document.getElementById('form-session-phase').value = session.phase;
    document.getElementById('form-session-week').value = session.week;
    document.getElementById('form-session-date').value = session.date;
    document.getElementById('form-session-status').value = session.status;
    document.getElementById('form-session-name').value = session.title;
    document.getElementById('form-session-summary').value = session.summary;
    document.getElementById('form-session-objectives').value = (session.objectives || []).join('\n');

    this.renderFormResourceRows(session.resources || []);

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);
  }

  static closeSessionModal() {
    const modal = document.getElementById('session-form-modal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  static renderFormResourceRows(resources) {
    const container = document.getElementById('form-resources-list');
    if (!container) return;

    if (!resources || resources.length === 0) {
      container.innerHTML = `
        <div id="no-resources-msg" class="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-800 rounded-lg">
          Sin recursos multimedia. Presiona "+ Agregar Recurso" arriba.
        </div>
      `;
      return;
    }

    container.innerHTML = resources.map((res, index) => `
      <div class="resource-row p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 relative" data-index="${index}">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-semibold text-sky-400">Recurso #${index + 1}</span>
          <button type="button" onclick="this.closest('.resource-row').remove()" class="text-xs text-red-400 hover:text-red-300">
            <i class="fa-solid fa-trash-can mr-1"></i> Eliminar
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label class="block text-[11px] text-slate-400 mb-1">Título del Recurso</label>
            <input type="text" class="res-title w-full px-2.5 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-slate-100" value="${res.title || ''}" placeholder="Ej: Video Explicativo" required>
          </div>
          <div>
            <label class="block text-[11px] text-slate-400 mb-1">Tipo de Recurso</label>
            <select class="res-type w-full px-2.5 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-slate-100">
              <option value="video" ${res.type === 'video' ? 'selected' : ''}>Video (MP4 / Grabación)</option>
              <option value="pdf" ${res.type === 'pdf' ? 'selected' : ''}>Informe / Documento (PDF)</option>
              <option value="presentation" ${res.type === 'presentation' ? 'selected' : ''}>Presentación (Slides)</option>
              <option value="image" ${res.type === 'image' ? 'selected' : ''}>Evidencia Fotográfica</option>
              <option value="sheet" ${res.type === 'sheet' ? 'selected' : ''}>Matriz de Costos (Sheet)</option>
              <option value="drive" ${res.type === 'drive' ? 'selected' : ''}>Carpeta / Archivo Drive</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-[11px] text-slate-400 mb-1">Enlace de Google Drive</label>
          <input type="url" class="res-url w-full px-2.5 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-slate-100 font-mono" value="${res.driveUrl || ''}" placeholder="https://drive.google.com/file/d/.../view" required>
        </div>
        <div>
          <label class="block text-[11px] text-slate-400 mb-1">Descripción corta (Opcional)</label>
          <input type="text" class="res-desc w-full px-2.5 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-slate-100" value="${res.description || ''}" placeholder="Resumen del material didáctico">
        </div>
      </div>
    `).join('');
  }

  static addResourceFormRow() {
    const noMsg = document.getElementById('no-resources-msg');
    if (noMsg) noMsg.remove();

    const container = document.getElementById('form-resources-list');
    const count = container.querySelectorAll('.resource-row').length;

    const row = document.createElement('div');
    row.className = "resource-row p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 relative";
    row.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-sky-400">Nuevo Recurso #${count + 1}</span>
        <button type="button" onclick="this.closest('.resource-row').remove()" class="text-xs text-red-400 hover:text-red-300">
          <i class="fa-solid fa-trash-can mr-1"></i> Eliminar
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label class="block text-[11px] text-slate-400 mb-1">Título del Recurso</label>
          <input type="text" class="res-title w-full px-2.5 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-slate-100" placeholder="Ej: Video Demostrativo" required>
        </div>
        <div>
          <label class="block text-[11px] text-slate-400 mb-1">Tipo de Recurso</label>
          <select class="res-type w-full px-2.5 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-slate-100">
            <option value="video">Video (MP4 / Grabación)</option>
            <option value="pdf">Informe / Documento (PDF)</option>
            <option value="presentation">Presentación (Slides)</option>
            <option value="image">Evidencia Fotográfica</option>
            <option value="sheet">Matriz de Costos (Sheet)</option>
            <option value="drive">Carpeta / Archivo Drive</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Enlace de Google Drive</label>
        <input type="url" class="res-url w-full px-2.5 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-slate-100 font-mono" placeholder="https://drive.google.com/file/d/.../view" required>
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Descripción corta (Opcional)</label>
        <input type="text" class="res-desc w-full px-2.5 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-slate-100" placeholder="Resumen del material didáctico">
      </div>
    `;
    container.appendChild(row);
  }

  static handleSessionFormSubmit(e) {
    e.preventDefault();

    const phase = document.getElementById('form-session-phase').value.trim();
    const week = document.getElementById('form-session-week').value.trim();
    const date = document.getElementById('form-session-date').value.trim();
    const status = document.getElementById('form-session-status').value;
    const title = document.getElementById('form-session-name').value.trim();
    const summary = document.getElementById('form-session-summary').value.trim();
    const rawObjectives = document.getElementById('form-session-objectives').value;

    const objectives = rawObjectives
      .split('\n')
      .map(o => o.trim())
      .filter(o => o.length > 0);

    const resourceRows = document.querySelectorAll('.resource-row');
    const resources = [];
    resourceRows.forEach((row, idx) => {
      const resTitle = row.querySelector('.res-title').value.trim();
      const resType = row.querySelector('.res-type').value;
      const resUrl = row.querySelector('.res-url').value.trim();
      const resDesc = row.querySelector('.res-desc').value.trim();

      if (resTitle && resUrl) {
        resources.push({
          id: `res-${Date.now()}-${idx}`,
          title: resTitle,
          type: resType,
          driveUrl: resUrl,
          description: resDesc
        });
      }
    });

    const sessionPayload = {
      phase,
      week,
      date,
      status,
      title,
      summary,
      objectives,
      resources
    };

    if (this.activeEditingSessionId) {
      StorageManager.updateSession(this.activeEditingSessionId, sessionPayload);
      this.showToast("Sesión didáctica actualizada correctamente.", "success");
    } else {
      StorageManager.addSession(sessionPayload);
      this.showToast("Nueva sesión agregada exitosamente.", "success");
    }

    this.closeSessionModal();
    this.renderFilterPills();
    this.renderSessions();
    this.updateStats();
  }

  static confirmDeleteSession(sessionId) {
    const sessions = StorageManager.getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    if (confirm(`¿Estás seguro de eliminar la sesión "${session.title}"?`)) {
      StorageManager.deleteSession(sessionId);
      this.renderFilterPills();
      this.renderSessions();
      this.updateStats();
      this.showToast("Sesión eliminada correctamente.", "info");
    }
  }

  static moveSession(sessionId, direction) {
    StorageManager.moveSession(sessionId, direction);
    this.renderFilterPills();
    this.renderSessions();
  }

  static resetToDefaultData() {
    if (confirm("¿Deseas restablecer todas las sesiones a los datos iniciales de la UNETI?")) {
      StorageManager.resetToDefaults();
      this.renderFilterPills();
      this.renderSessions();
      this.renderTeam();
      this.updateStats();
      this.showToast("Datos restablecidos a la configuración inicial.", "success");
    }
  }

  static exportBackup() {
    const jsonStr = StorageManager.exportToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UNETI_Proyecto_Socioeconomico_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast("Copia de seguridad descargada exitosamente.", "success");
  }

  static showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const iconMap = {
      success: 'fa-solid fa-circle-check text-emerald-400',
      info: 'fa-solid fa-circle-info text-sky-400',
      warning: 'fa-solid fa-triangle-exclamation text-amber-400',
      error: 'fa-solid fa-circle-xmark text-red-400'
    };

    const toast = document.createElement('div');
    toast.className = `toast-item glass-panel px-4 py-3 rounded-xl border border-slate-700 shadow-xl flex items-center gap-3 text-sm text-slate-100 max-w-sm pointer-events-auto`;
    toast.innerHTML = `
      <i class="${iconMap[type] || iconMap.info} text-lg shrink-0"></i>
      <span class="flex-1">${message}</span>
      <button class="text-slate-400 hover:text-white ml-2 text-xs" onclick="this.parentElement.remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /* =========================================================================
     MÉTODOS DE GESTIÓN DE EQUIPO: ESTUDIANTES Y JURADO / PROFESORES (RBAC)
     ========================================================================= */
  static renderTeam() {
    const isAdmin = AuthManager.isAdmin();
    const team = StorageManager.getTeam();
    const studentsContainer = document.getElementById('students-container');
    const juryContainer = document.getElementById('jury-container');
    const stdBadge = document.getElementById('students-count-badge');
    const juryBadge = document.getElementById('jury-count-badge');

    const studentCount = (team.students || []).length;
    const juryCount = (team.jury || []).length;

    if (stdBadge) stdBadge.textContent = `${studentCount} Integrante${studentCount === 1 ? '' : 's'}`;
    if (juryBadge) juryBadge.textContent = `${juryCount} Docente${juryCount === 1 ? '' : 's'}`;

    // 1. Renderizar Estudiantes
    if (studentsContainer) {
      if (!team.students || team.students.length === 0) {
        studentsContainer.innerHTML = `
          <div class="text-center py-6 text-slate-500 border border-dashed border-slate-800 rounded-xl text-xs">
            <i class="fa-solid fa-users text-lg mb-1 block text-slate-600"></i>
            No hay integrantes registrados. ${isAdmin ? 'Presiona "+ Agregar Integrante".' : 'Inicia sesión como Administrador para registrar integrantes.'}
          </div>
        `;
      } else {
        studentsContainer.innerHTML = team.students.map((std, i) => {
          const initials = (std.name || 'UN').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
          const colorGradients = [
            'from-sky-500 to-blue-600',
            'from-emerald-500 to-teal-600',
            'from-purple-500 to-indigo-600',
            'from-amber-500 to-orange-600'
          ];
          const grad = colorGradients[i % colorGradients.length];

          return `
            <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 group">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                  ${initials}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <h5 class="text-sm font-bold text-white truncate">${std.name}</h5>
                    <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-300 shrink-0">
                      ${std.cedula || 'C.I. V-N/A'}
                    </span>
                  </div>
                  <p class="text-xs text-sky-400 font-medium truncate">${std.role || 'Investigador'}</p>
                  <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    ${std.email ? `<span class="truncate"><i class="fa-regular fa-envelope text-[10px] mr-1"></i>${std.email}</span>` : ''}
                    ${std.phone ? `<span class="shrink-0"><i class="fa-brands fa-whatsapp text-[10px] mr-1 text-emerald-400"></i>${std.phone}</span>` : ''}
                  </div>
                </div>
              </div>

              ${isAdmin ? `
                <div class="flex items-center gap-1.5 shrink-0">
                  <button 
                    onclick="window.ui.openStudentModal('${std.id}')"
                    class="p-2 text-xs text-slate-400 hover:text-sky-300 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
                    title="Editar datos del integrante"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    onclick="window.ui.confirmDeleteStudent('${std.id}')"
                    class="p-2 text-xs text-slate-400 hover:text-red-400 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
                    title="Eliminar integrante"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      }
    }

    // 2. Renderizar Jurado / Profesores
    if (juryContainer) {
      if (!team.jury || team.jury.length === 0) {
        juryContainer.innerHTML = `
          <div class="text-center py-6 text-slate-500 border border-dashed border-slate-800 rounded-xl text-xs">
            <i class="fa-solid fa-chalkboard-user text-lg mb-1 block text-slate-600"></i>
            No hay docentes registrados. ${isAdmin ? 'Presiona "+ Agregar Profesor / Jurado".' : 'Inicia sesión como Administrador para registrar docentes.'}
          </div>
        `;
      } else {
        juryContainer.innerHTML = team.jury.map((j) => {
          const isTutor = (j.role || '').toLowerCase().includes('tutor');
          const roleBadgeColor = isTutor 
            ? 'bg-blue-950/60 text-blue-300 border-blue-800/60'
            : 'bg-purple-950/60 text-purple-300 border-purple-800/60';

          return `
            <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 group">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 text-base shrink-0 shadow-md">
                  <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <h5 class="text-sm font-bold text-white truncate">${j.name}</h5>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-full border ${roleBadgeColor} shrink-0">
                      ${j.role}
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 font-medium truncate">${j.title || 'Docente Evaluador'}</p>
                  <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    ${j.department ? `<span class="truncate"><i class="fa-solid fa-building-columns text-[10px] mr-1"></i>${j.department}</span>` : ''}
                    ${j.email ? `<span class="truncate hidden sm:inline"><i class="fa-regular fa-envelope text-[10px] mr-1"></i>${j.email}</span>` : ''}
                  </div>
                </div>
              </div>

              ${isAdmin ? `
                <div class="flex items-center gap-1.5 shrink-0">
                  <button 
                    onclick="window.ui.openJuryModal('${j.id}')"
                    class="p-2 text-xs text-slate-400 hover:text-blue-300 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
                    title="Editar datos del docente o jurado"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    onclick="window.ui.confirmDeleteJury('${j.id}')"
                    class="p-2 text-xs text-slate-400 hover:text-red-400 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
                    title="Eliminar docente o jurado"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      }
    }
  }

  /* Modales de Estudiante */
  static openStudentModal(studentId = null) {
    if (!AuthManager.isAdmin()) {
      this.openLoginModal();
      this.showToast("Debes identificarte como Administrador para agregar o editar integrantes.", "warning");
      return;
    }

    const modal = document.getElementById('student-modal');
    const titleEl = document.getElementById('modal-student-title');
    const idInput = document.getElementById('form-student-id');
    const nameInput = document.getElementById('form-student-name');
    const cedulaInput = document.getElementById('form-student-cedula');
    const roleInput = document.getElementById('form-student-role');
    const emailInput = document.getElementById('form-student-email');
    const phoneInput = document.getElementById('form-student-phone');

    if (!modal) return;

    if (studentId) {
      const team = StorageManager.getTeam();
      const std = (team.students || []).find(s => s.id === studentId);
      if (std) {
        titleEl.innerHTML = '<i class="fa-solid fa-user-pen text-sky-400 mr-2"></i> Editar Integrante Estudiante';
        idInput.value = std.id;
        nameInput.value = std.name || '';
        cedulaInput.value = std.cedula || '';
        roleInput.value = std.role || '';
        emailInput.value = std.email || '';
        phoneInput.value = std.phone || '';
      }
    } else {
      titleEl.innerHTML = '<i class="fa-solid fa-user-plus text-sky-400 mr-2"></i> Agregar Integrante Estudiante';
      document.getElementById('student-form').reset();
      idInput.value = '';
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('active');
      nameInput.focus();
    }, 10);
  }

  static closeStudentModal() {
    const modal = document.getElementById('student-modal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  static handleStudentSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('form-student-id').value;
    const name = document.getElementById('form-student-name').value.trim();
    const cedula = document.getElementById('form-student-cedula').value.trim();
    const role = document.getElementById('form-student-role').value.trim();
    const email = document.getElementById('form-student-email').value.trim();
    const phone = document.getElementById('form-student-phone').value.trim();

    const payload = { name, cedula, role, email, phone };

    if (id) {
      StorageManager.updateStudent(id, payload);
      this.showToast("Datos del estudiante actualizados correctamente.", "success");
    } else {
      StorageManager.addStudent(payload);
      this.showToast("Nuevo integrante agregado exitosamente.", "success");
    }

    this.closeStudentModal();
    this.renderTeam();
  }

  static confirmDeleteStudent(studentId) {
    if (!AuthManager.isAdmin()) {
      this.openLoginModal();
      this.showToast("Debes iniciar sesión como Administrador para eliminar integrantes.", "warning");
      return;
    }

    const team = StorageManager.getTeam();
    const std = (team.students || []).find(s => s.id === studentId);
    if (!std) return;

    if (confirm(`¿Estás seguro de eliminar a "${std.name}" del equipo de investigación?`)) {
      StorageManager.deleteStudent(studentId);
      this.renderTeam();
      this.showToast("Integrante eliminado del proyecto.", "info");
    }
  }

  /* Modales de Jurado / Docente */
  static openJuryModal(juryId = null) {
    if (!AuthManager.isAdmin()) {
      this.openLoginModal();
      this.showToast("Debes identificarte como Administrador para agregar o editar docentes o jurados.", "warning");
      return;
    }

    const modal = document.getElementById('jury-modal');
    const titleEl = document.getElementById('modal-jury-title');
    const idInput = document.getElementById('form-jury-id');
    const nameInput = document.getElementById('form-jury-name');
    const titleDegreeInput = document.getElementById('form-jury-title');
    const roleInput = document.getElementById('form-jury-role');
    const deptInput = document.getElementById('form-jury-dept');
    const emailInput = document.getElementById('form-jury-email');

    if (!modal) return;

    if (juryId) {
      const team = StorageManager.getTeam();
      const j = (team.jury || []).find(x => x.id === juryId);
      if (j) {
        titleEl.innerHTML = '<i class="fa-solid fa-user-pen text-blue-400 mr-2"></i> Editar Profesor / Jurado';
        idInput.value = j.id;
        nameInput.value = j.name || '';
        titleDegreeInput.value = j.title || '';
        roleInput.value = j.role || 'Tutor Académico de Proyecto';
        deptInput.value = j.department || '';
        emailInput.value = j.email || '';
      }
    } else {
      titleEl.innerHTML = '<i class="fa-solid fa-user-tie text-blue-400 mr-2"></i> Agregar Profesor / Jurado';
      document.getElementById('jury-form').reset();
      idInput.value = '';
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('active');
      nameInput.focus();
    }, 10);
  }

  static closeJuryModal() {
    const modal = document.getElementById('jury-modal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  static handleJurySubmit(e) {
    e.preventDefault();
    const id = document.getElementById('form-jury-id').value;
    const name = document.getElementById('form-jury-name').value.trim();
    const title = document.getElementById('form-jury-title').value.trim();
    const role = document.getElementById('form-jury-role').value;
    const department = document.getElementById('form-jury-dept').value.trim();
    const email = document.getElementById('form-jury-email').value.trim();

    const payload = { name, title, role, department, email };

    if (id) {
      StorageManager.updateJury(id, payload);
      this.showToast("Datos del docente/jurado actualizados.", "success");
    } else {
      StorageManager.addJury(payload);
      this.showToast("Nuevo docente/jurado registrado exitosamente.", "success");
    }

    this.closeJuryModal();
    this.renderTeam();
  }

  static confirmDeleteJury(juryId) {
    if (!AuthManager.isAdmin()) {
      this.openLoginModal();
      this.showToast("Debes iniciar sesión como Administrador para eliminar docentes o jurados.", "warning");
      return;
    }

    const team = StorageManager.getTeam();
    const j = (team.jury || []).find(x => x.id === juryId);
    if (!j) return;

    if (confirm(`¿Estás seguro de eliminar a "${j.name}" del comité evaluador?`)) {
      StorageManager.deleteJury(juryId);
      this.renderTeam();
      this.showToast("Docente eliminado del comité evaluador.", "info");
    }
  }

  /* Alternador de Vista (Tarjetas vs Cronograma) */
  static switchView(view) {
    const btnCards = document.getElementById('btn-view-cards');
    const btnTimeline = document.getElementById('btn-view-timeline');
    const container = document.getElementById('sessions-container');

    if (!container) return;

    if (view === 'timeline') {
      if (btnCards) {
        btnCards.classList.remove('bg-sky-600', 'text-white');
        btnCards.classList.add('text-slate-400');
      }
      if (btnTimeline) {
        btnTimeline.classList.add('bg-sky-600', 'text-white');
        btnTimeline.classList.remove('text-slate-400');
      }
      this.renderTimelineView();
    } else {
      if (btnCards) {
        btnCards.classList.add('bg-sky-600', 'text-white');
        btnCards.classList.remove('text-slate-400');
      }
      if (btnTimeline) {
        btnTimeline.classList.remove('bg-sky-600', 'text-white');
        btnTimeline.classList.add('text-slate-400');
      }
      this.renderSessions();
    }
  }

  static renderTimelineView() {
    const container = document.getElementById('sessions-container');
    if (!container) return;

    const sessions = StorageManager.getSessions();

    container.innerHTML = `
      <div class="relative pl-6 sm:pl-8 border-l-2 border-sky-500/30 space-y-8 my-6">
        ${sessions.map((s) => `
          <div class="relative group">
            <div class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-sky-400 group-hover:scale-125 transition-transform"></div>
            
            <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-950 text-sky-400 border border-sky-800 uppercase">
                    ${s.phase}
                  </span>
                  <span class="text-xs text-slate-400 font-semibold">${s.week} • ${s.date}</span>
                </div>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-medium ${s.status === 'Aprobado' ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40' : 'text-sky-400 bg-sky-950/40 border border-sky-800/40'}">
                  ${s.status}
                </span>
              </div>

              <h4 class="text-lg font-bold text-white">${s.title}</h4>
              <p class="text-xs text-slate-300 leading-relaxed">${s.summary}</p>

              <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span class="text-[11px] text-slate-400">
                  <i class="fa-brands fa-google-drive text-emerald-400 mr-1"></i> ${(s.resources || []).length} archivos asociados
                </span>
                <button onclick="window.ui.switchView('cards')" class="text-xs text-sky-400 hover:underline">
                  Ver en detalle &rarr;
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* Importar Respaldo JSON */
  static handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const success = StorageManager.importFromJson(content);
      if (success) {
        this.renderFilterPills();
        this.renderSessions();
        this.renderTeam();
        this.updateStats();
        this.showToast("Copia de seguridad importada con éxito.", "success");
      } else {
        this.showToast("El archivo seleccionado no es un respaldo válido de la UNETI.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  /**
   * Configuración de oyentes de eventos globales
   */
  static setupEventListeners() {
    // Barra de búsqueda
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderSessions();
      });
    }

    // Modal de Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));

    // Modal de Sesión
    const sessionForm = document.getElementById('session-editor-form');
    if (sessionForm) sessionForm.addEventListener('submit', (e) => this.handleSessionFormSubmit(e));

    // Formulario de Estudiante
    const studentForm = document.getElementById('student-form');
    if (studentForm) studentForm.addEventListener('submit', (e) => this.handleStudentSubmit(e));

    // Formulario de Jurado / Profesor
    const juryForm = document.getElementById('jury-form');
    if (juryForm) juryForm.addEventListener('submit', (e) => this.handleJurySubmit(e));

    // Tecla Escape para cerrar modales
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeViewer();
        this.closeLoginModal();
        this.closeSessionModal();
        this.closeStudentModal();
        this.closeJuryModal();
      }
    });

    // Suscripción a cambios de autenticación
    AuthManager.subscribe((isAdmin) => {
      this.updateAdminUI(isAdmin);
    });
  }
}
