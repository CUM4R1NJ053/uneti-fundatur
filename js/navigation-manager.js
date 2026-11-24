/**
 * UNETI - PROYECTO SOCIOECONÓMICO
 * NavigationManager - Gestión de navegación SPA por secciones/tabs
 * Convierte la plataforma en Single Page Application con navegación por secciones
 */

export class NavigationManager {
  constructor() {
    // Mapeo de secciones a sus IDs de elemento DOM y rutas de hash
    this.sections = {
      institucional: { id: 'institucional', element: null, requiresBanner: true },
      inventario: { id: 'inventario', element: null, requiresBanner: false },
      'soporte-glpi': { id: 'soporte-glpi', element: null, requiresBanner: false },
      sesiones: { id: 'sesiones', element: null, requiresBanner: false },
      'drive-guide': { id: 'drive-guide', element: null, requiresBanner: false },
      equipo: { id: 'equipo', element: null, requiresBanner: false }
    };

    // Configuración de estilos de botones
    this.activeButtonClass = 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm shadow-sky-500/20 font-bold';
    this.inactiveButtonClass = 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent';

    // Referencia al menú mobile
    this.mobileNav = null;

    // Inicializar referencias después de que el DOM esté listo
    this.init = this.init.bind(this);
  }

  /**
   * Inicializa la NavigationManager: configura referencias DOM y listeners
   */
  init() {
    this.cacheDomElements();
    this.setupNavigation();
    this.handleHashNavigation();
    this.showSection('institucional'); // Sección por defecto al cargar
    this.setupMobileNav();
  }

  /**
   * Cachea los elementos del DOM relacionados con las secciones y navegación
   */
  cacheDomElements() {
    // Cachear elementos de sección
    for (const key of Object.keys(this.sections)) {
      const element = document.getElementById(this.sections[key].id);
      if (element) {
        this.sections[key].element = element;
      }
    }

    // Cachear botones de navegación desktop
    this.navButtons = document.querySelectorAll('nav.gap-5 a[href^="#"]');

    // Agregar datos section-id a botones si no los tienen
    if (this.navButtons) {
      this.navButtons.forEach(btn => {
        const hash = btn.getAttribute('href');
        if (hash && hash.startsWith('#')) {
          const sectionId = hash.slice(1);
          if (this.sections[sectionId]) {
            btn.setAttribute('data-section', sectionId);
          }
        }
      });
    }
  }

  /**
   * Configura los event listeners de navegación
   */
  setupNavigation() {
    // Manejador para botones de navegación desktop
    if (this.navButtons) {
      this.navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const sectionId = btn.dataset.section;
          if (sectionId) {
            this.showSection(sectionId);
          }
        });
      });
    }

    // Manejar hash en URL al cargar/change
    window.addEventListener('hashchange', () => this.handleHashNavigation());
  }

  /**
   * Muestra la sección especificada y oculta todas las demás
   * @param {string} sectionId - ID de la sección a mostrar (clave del objeto sections)
   */
  showSection(sectionId) {
    // Verificar que la sección existe
    if (!this.sections[sectionId]) {
      console.warn(`Sección "${sectionId}" no encontrada en NavigationManager`);
      return;
    }

    const targetSection = this.sections[sectionId];

    // Ocultar todas las secciones
    for (const key of Object.keys(this.sections)) {
      const section = this.sections[key];
      if (section.element) {
        section.element.classList.add('hidden');
        section.element.classList.remove('block', 'flex');
      }
    }

    // Mostrar la sección seleccionada
    if (targetSection.element) {
      targetSection.element.classList.remove('hidden');
      targetSection.element.classList.add('block', 'flex');
    }

    // Actualizar estilo de botones de navegación
    this.updateActiveButton(sectionId);
  }

  /**
   * Actualiza el estilo de los botones de navegación
   * @param {string} activeSectionId - ID de la sección activa
   */
  updateActiveButton(activeSectionId) {
    if (!this.navButtons) return;

    this.navButtons.forEach(btn => {
      const btnSection = btn.dataset.section;
      if (btnSection === activeSectionId) {
        btn.className = this.activeButtonClass;
        // Añadir atributo aria-active para accesibilidad
        btn.setAttribute('aria-active', 'true');
      } else {
        btn.className = this.inactiveButtonClass;
        btn.removeAttribute('aria-active');
      }
    });
  }

  /**
   * Maneja la navegación basada en hash en la URL
   * Si hay un hash como #inventario, abre esa sección directamente
   */
  handleHashNavigation() {
    const hash = window.location.hash.slice(1); // Remover el '#'

    // Si hay un hash y corresponde a una sección conocida
    if (hash && this.sections[hash]) {
      this.showSection(hash);
    } else {
      // Si no hay hash o no es reconocido, mostrar la sección por defecto
      this.showSection('institucional');
    }
  }

  /**
   * Configura la navegación mobile (barra horizontal o botones)
   * Crea un menú mobile responsive si no existe
   */
  setupMobileNav() {
    // Verificar si ya existe un menú mobile
    this.mobileNav = document.querySelector('.mobile-nav');

    if (!this.mobileNav) {
      // Crear menú mobile
      this.mobileNav = document.createElement('nav');
      this.mobileNav.className = 'mobile-nav hidden sm:flex lg:hidden flex-col space-y-2 px-4 py-3 bg-slate-900/95 border-t border-slate-800/60';
      this.mobileNav.innerHTML = `
        <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Navegación</span>
        <div class="space-y-1">
          <!-- Los botones se poblarán dinámicamente -->
        </div>
      `;

      // Insertar después del header/nav
      const header = document.querySelector('header.glass-header');
      if (header) {
        header.parentNode.insertBefore(this.mobileNav, header.nextSibling);
      } else {
        document.body.insertBefore(this.mobileNav, document.querySelector('main'));
      }
    }

    // Poblar botones mobile
    const mobileContainer = this.mobileNav.querySelector('div');
    if (mobileContainer && this.navButtons) {
      mobileContainer.innerHTML = '';
      this.navButtons.forEach(btn => {
        const sectionId = btn.dataset.section;
        if (sectionId && this.sections[sectionId]) {
          const sectionName = btn.querySelector('span')?.textContent || sectionId;
          const mobileBtn = document.createElement('a');
          mobileBtn.href = `#${sectionId}`;
          mobileBtn.className = `block px-4 py-3 rounded-md text-left text-slate-300 hover:text-sky-300 hover:bg-sky-800/60 transition-colors flex items-center gap-2`;
          mobileBtn.dataset.section = sectionId;
          mobileBtn.innerHTML = `<i class="${btn.querySelector('i')?.className || 'fa-solid fa-list'} text-sm"></i>${sectionName}`;
          mobileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection(sectionId);
            this.hideMobileMenu();
          });
          mobileContainer.appendChild(mobileBtn);
        }
      });
    }

    // Most/ocultar menú mobile al hacer click en el botón hamburger
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => {
        if (this.mobileNav) {
          this.mobileNav.classList.toggle('hidden');
          this.mobileNav.classList.toggle('flex');
        }
      });
    }
  }

  /**
   * Oculta el menú mobile
   */
  hideMobileMenu() {
    if (this.mobileNav) {
      this.mobileNav.classList.add('hidden');
      this.mobileNav.classList.remove('flex');
    }
  }
}

// Exportar para uso global: window.navManager
if (typeof window !== 'undefined') {
  window.navManager = new NavigationManager();
}