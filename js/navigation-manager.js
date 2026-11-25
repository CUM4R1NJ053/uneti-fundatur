// Router SPA para control de vistas por sección

export class NavigationManager {
  constructor() {
    this.sections = {
      institucional: { id: 'institucional', element: null, requiresBanner: true },
      inventario: { id: 'inventario', element: null, requiresBanner: false },
      'soporte-glpi': { id: 'soporte-glpi', element: null, requiresBanner: false },
      'habilidades-blandas': { id: 'habilidades-blandas', element: null, requiresBanner: false },
      sesiones: { id: 'sesiones', element: null, requiresBanner: false },
      'drive-guide': { id: 'drive-guide', element: null, requiresBanner: false },
      equipo: { id: 'equipo', element: null, requiresBanner: false }
    };

    this.activeButtonClass = 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm shadow-sky-500/20 font-bold';
    this.inactiveButtonClass = 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent';
    this.mobileNav = null;

    this.init = this.init.bind(this);
  }

  init() {
    this.cacheDomElements();
    this.setupNavigation();
    this.handleHashNavigation();
    this.showSection('institucional');
    this.setupMobileNav();
  }

  cacheDomElements() {
    for (const key of Object.keys(this.sections)) {
      const element = document.getElementById(this.sections[key].id);
      if (element) {
        this.sections[key].element = element;
      }
    }

    this.navButtons = document.querySelectorAll('nav.gap-5 a[href^="#"]');

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

  setupNavigation() {
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

    window.addEventListener('hashchange', () => this.handleHashNavigation());
  }

  showSection(sectionId) {
    if (!this.sections[sectionId]) {
      console.warn(`Sección "${sectionId}" no encontrada en NavigationManager`);
      return;
    }

    const targetSection = this.sections[sectionId];

    for (const key of Object.keys(this.sections)) {
      const section = this.sections[key];
      if (section.element) {
        section.element.classList.add('hidden');
        section.element.classList.remove('block', 'flex');
      }
    }

    if (targetSection.element) {
      targetSection.element.classList.remove('hidden');
      targetSection.element.classList.add('block', 'flex');
    }

    this.updateActiveButton(sectionId);
  }

  updateActiveButton(activeSectionId) {
    if (!this.navButtons) return;

    this.navButtons.forEach(btn => {
      const btnSection = btn.dataset.section;
      if (btnSection === activeSectionId) {
        btn.className = this.activeButtonClass;
        btn.setAttribute('aria-active', 'true');
      } else {
        btn.className = this.inactiveButtonClass;
        btn.removeAttribute('aria-active');
      }
    });
  }

  handleHashNavigation() {
    const hash = window.location.hash.slice(1);

    if (hash && this.sections[hash]) {
      this.showSection(hash);
    } else {
      this.showSection('institucional');
    }
  }

  setupMobileNav() {
    this.mobileNav = document.querySelector('.mobile-nav');

    if (!this.mobileNav) {
      this.mobileNav = document.createElement('nav');
      this.mobileNav.className = 'mobile-nav hidden sm:flex lg:hidden flex-col space-y-2 px-4 py-3 bg-slate-900/95 border-t border-slate-800/60';
      this.mobileNav.innerHTML = `
        <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Navegación</span>
        <div class="space-y-1">
        </div>
      `;

      const header = document.querySelector('header.glass-header');
      if (header) {
        header.parentNode.insertBefore(this.mobileNav, header.nextSibling);
      } else {
        document.body.insertBefore(this.mobileNav, document.querySelector('main'));
      }
    }

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

  hideMobileMenu() {
    if (this.mobileNav) {
      this.mobileNav.classList.add('hidden');
      this.mobileNav.classList.remove('flex');
    }
  }
}

// Instancia global del router SPA
if (typeof window !== 'undefined') {
  window.navManager = new NavigationManager();
}
