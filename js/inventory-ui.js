/**
 * FUNDATUR SOCIAL - UNETI
 * Módulo de Interfaz y Lógica del Inventario Tecnológico Auditado (40 Equipos)
 */

import { INVENTORY_DATA, INVENTORY_STATS } from './inventory-data.js';

export class InventoryUI {
  static currentBranch = 'all';
  static currentStatus = 'all';
  static searchQuery = '';
  static currentPage = 1;
  static pageSize = 10;

  static init() {
    this.renderStats();
    this.renderFilters();
    this.renderTable();
    this.setupListeners();
  }

  static renderStats() {
    const statsContainer = document.getElementById('inventory-stats-container');
    if (!statsContainer) return;

    const total = INVENTORY_DATA.length;
    const optimal = INVENTORY_DATA.filter(e => e.status === 'Sin fallas').length;
    const faulty = INVENTORY_DATA.filter(e => e.status === 'Con falla').length;
    const critical = INVENTORY_DATA.filter(e => e.priority === 'Alta').length;

    statsContainer.innerHTML = `
      <div class="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 text-center relative overflow-hidden group hover:border-sky-500/40 transition">
        <div class="absolute -right-4 -bottom-4 text-sky-500/10 text-6xl group-hover:scale-110 transition"><i class="fa-solid fa-desktop"></i></div>
        <span class="block text-2xl sm:text-3xl font-black text-sky-400 tracking-tight">${total}</span>
        <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Flota Auditada</span>
        <div class="mt-2 text-[10px] text-sky-300/80 bg-sky-950/60 py-0.5 px-2 rounded-full inline-block">100% de la Fundación</div>
      </div>

      <div class="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 text-center relative overflow-hidden group hover:border-emerald-500/40 transition">
        <div class="absolute -right-4 -bottom-4 text-emerald-500/10 text-6xl group-hover:scale-110 transition"><i class="fa-solid fa-circle-check"></i></div>
        <span class="block text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">${optimal}</span>
        <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Equipos Operativos</span>
        <div class="mt-2 text-[10px] text-emerald-300/80 bg-emerald-950/60 py-0.5 px-2 rounded-full inline-block">SSD / 8–16 GB RAM</div>
      </div>

      <div class="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 text-center relative overflow-hidden group hover:border-amber-500/40 transition">
        <div class="absolute -right-4 -bottom-4 text-amber-500/10 text-6xl group-hover:scale-110 transition"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <span class="block text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">${faulty}</span>
        <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Con Fallas / Obsoletos</span>
        <div class="mt-2 text-[10px] text-amber-300/80 bg-amber-950/60 py-0.5 px-2 rounded-full inline-block">A Reemplazar Convenio</div>
      </div>

      <div class="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 text-center relative overflow-hidden group hover:border-red-500/40 transition">
        <div class="absolute -right-4 -bottom-4 text-red-500/10 text-6xl group-hover:scale-110 transition"><i class="fa-solid fa-fire"></i></div>
        <span class="block text-2xl sm:text-3xl font-black text-red-400 tracking-tight">${critical}</span>
        <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Prioridad Crítica</span>
        <div class="mt-2 text-[10px] text-red-300/80 bg-red-950/60 py-0.5 px-2 rounded-full inline-block">Paralizan Sedes / Atención</div>
      </div>
    `;
  }

  static renderFilters() {
    const branchContainer = document.getElementById('inventory-branch-filters');
    const statusContainer = document.getElementById('inventory-status-filters');

    if (branchContainer) {
      const branches = [
        { id: 'all', label: 'Todas las Sedes (40)' },
        { id: 'Caracas', label: 'Caracas (16)' },
        { id: 'Maracay', label: 'Maracay (8)' },
        { id: 'Maracaibo', label: 'Maracaibo (8)' },
        { id: 'Puerto La Cruz', label: 'Puerto La Cruz (8)' }
      ];

      branchContainer.innerHTML = branches.map(b => {
        const active = this.currentBranch === b.id;
        return `
          <button 
            onclick="window.inventoryUI.filterByBranch('${b.id}')"
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
              active 
                ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30' 
                : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
            }"
          >
            ${b.label}
          </button>
        `;
      }).join('');
    }

    if (statusContainer) {
      const statuses = [
        { id: 'all', label: 'Todos los Estados' },
        { id: 'Sin fallas', label: '✅ Sin Fallas (22)', color: 'text-emerald-400' },
        { id: 'Con falla', label: '⚠️ Con Falla (18)', color: 'text-amber-400' },
        { id: 'critical', label: '🚨 Prioridad Alta (9)', color: 'text-red-400' }
      ];

      statusContainer.innerHTML = statuses.map(s => {
        const active = this.currentStatus === s.id;
        return `
          <button 
            onclick="window.inventoryUI.filterByStatus('${s.id}')"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              active 
                ? 'bg-slate-800 text-white border-sky-400 shadow-sm' 
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }"
          >
            ${s.label}
          </button>
        `;
      }).join('');
    }
  }

  static getFilteredData() {
    let list = [...INVENTORY_DATA];

    if (this.currentBranch !== 'all') {
      list = list.filter(item => item.branch.toLowerCase() === this.currentBranch.toLowerCase());
    }

    if (this.currentStatus === 'critical') {
      list = list.filter(item => item.priority === 'Alta');
    } else if (this.currentStatus !== 'all') {
      list = list.filter(item => item.status.toLowerCase() === this.currentStatus.toLowerCase());
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.id.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.serial.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.brandModel.toLowerCase().includes(q) ||
        item.processor.toLowerCase().includes(q) ||
        item.userAssigned.toLowerCase().includes(q) ||
        item.diagnostics.toLowerCase().includes(q) ||
        item.failureType.toLowerCase().includes(q)
      );
    }

    return list;
  }

  static renderTable() {
    const tbody = document.getElementById('inventory-table-body');
    const countBadge = document.getElementById('inventory-count-badge');
    if (!tbody) return;

    const data = this.getFilteredData();
    if (countBadge) countBadge.textContent = `${data.length} de ${INVENTORY_DATA.length} equipos`;

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-12 text-center text-slate-400">
            <div class="flex flex-col items-center justify-center gap-3">
              <i class="fa-solid fa-box-open text-4xl text-slate-600"></i>
              <p class="font-medium">No se encontraron equipos que coincidan con los filtros aplicados.</p>
              <button onclick="window.inventoryUI.resetFilters()" class="text-xs text-sky-400 hover:underline">Restablecer filtros</button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.map((item, idx) => {
      const isOptimal = item.status === 'Sin fallas';
      const statusBadge = isOptimal 
        ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-[11px] font-semibold">
             <i class="fa-solid fa-circle-check text-[9px]"></i> Operativo
           </span>`
        : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-300 text-[11px] font-semibold">
             <i class="fa-solid fa-triangle-exclamation text-[9px]"></i> ${item.failureType}
           </span>`;

      const priorityBadge = {
        'Alta': '<span class="px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-700/60 font-bold text-[10px]">Alta</span>',
        'Media': '<span class="px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/60 font-medium text-[10px]">Media</span>',
        'Baja': '<span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Baja</span>',
        'Normal': '<span class="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 text-[10px]">Estable</span>'
      }[item.priority] || `<span class="text-slate-400 text-[10px]">${item.priority}</span>`;

      const branchIcons = {
        'Caracas': 'fa-solid fa-city text-sky-400',
        'Maracay': 'fa-solid fa-mountain-sun text-emerald-400',
        'Maracaibo': 'fa-solid fa-bridge-water text-amber-400',
        'Puerto La Cruz': 'fa-solid fa-umbrella-beach text-cyan-400'
      };

      return `
        <tr class="border-b border-slate-800/60 hover:bg-slate-900/60 transition group text-xs">
          <!-- Código e ID -->
          <td class="py-3.5 px-4 font-mono font-bold text-sky-300 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded bg-slate-800/90 text-slate-300 flex items-center justify-center text-[10px] font-bold">${item.id.replace('FND-', '')}</span>
              <span>${item.id}</span>
            </div>
            <span class="text-[10px] text-slate-500 font-normal block pl-8">Cód. ${item.code}</span>
          </td>

          <!-- Sede y Área -->
          <td class="py-3.5 px-4">
            <div class="font-semibold text-slate-200 flex items-center gap-1.5">
              <i class="${branchIcons[item.branch] || 'fa-solid fa-location-dot text-slate-400'} text-[11px]"></i>
              <span>${item.branch}</span>
            </div>
            <span class="text-[11px] text-slate-400 block">${item.area}</span>
          </td>

          <!-- Hardware -->
          <td class="py-3.5 px-4">
            <span class="font-bold text-slate-100 block truncate max-w-[180px]">${item.brandModel}</span>
            <span class="text-[11px] text-slate-400 block truncate max-w-[200px]">${item.processor}</span>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-sky-300 border border-slate-700/60">${item.ram}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">${item.storage}</span>
            </div>
          </td>

          <!-- Estado -->
          <td class="py-3.5 px-4 whitespace-nowrap">
            ${statusBadge}
          </td>

          <!-- Diagnóstico / Problemas -->
          <td class="py-3.5 px-4 text-slate-300 max-w-xs">
            <p class="line-clamp-2 leading-relaxed text-[11.5px]">${item.diagnostics}</p>
            <span class="text-[10px] text-slate-500 mt-1 block">Custodio: <strong class="text-slate-400 font-medium">${item.userAssigned}</strong></span>
          </td>

          <!-- Prioridad -->
          <td class="py-3.5 px-4 whitespace-nowrap text-center">
            ${priorityBadge}
          </td>

          <!-- Acciones -->
          <td class="py-3.5 px-4 text-right whitespace-nowrap">
            <button 
              onclick="window.inventoryUI.openEquipmentModal('${item.id}')"
              class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 inline-flex shadow-sm"
              title="Ver ficha técnica completa del equipo"
            >
              <i class="fa-solid fa-eye text-[11px]"></i>
              <span class="hidden sm:inline">Detalle</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  static filterByBranch(branch) {
    this.currentBranch = branch;
    this.renderFilters();
    this.renderTable();
  }

  static filterByStatus(status) {
    this.currentStatus = status;
    this.renderFilters();
    this.renderTable();
  }

  static handleSearch(q) {
    this.searchQuery = q;
    this.renderTable();
  }

  static resetFilters() {
    this.currentBranch = 'all';
    this.currentStatus = 'all';
    this.searchQuery = '';
    const searchInput = document.getElementById('inventory-search-input');
    if (searchInput) searchInput.value = '';
    this.renderFilters();
    this.renderTable();
  }

  static setupListeners() {
    const searchInput = document.getElementById('inventory-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
  }

  static openEquipmentModal(id) {
    const item = INVENTORY_DATA.find(e => e.id === id);
    if (!item) return;

    const modal = document.getElementById('equipment-detail-modal');
    if (!modal) return;

    const isOptimal = item.status === 'Sin fallas';

    document.getElementById('eq-modal-title').textContent = `Ficha Técnica: ${item.id} — ${item.brandModel}`;
    document.getElementById('eq-modal-code').textContent = item.code;
    document.getElementById('eq-modal-serial').textContent = item.serial;
    document.getElementById('eq-modal-branch').textContent = item.branchFull;
    document.getElementById('eq-modal-area').textContent = item.area;
    document.getElementById('eq-modal-cpu').textContent = item.processor;
    document.getElementById('eq-modal-ram').textContent = item.ram;
    document.getElementById('eq-modal-storage').textContent = item.storage;
    document.getElementById('eq-modal-user').textContent = item.userAssigned;
    document.getElementById('eq-modal-review').textContent = item.lastReview;
    document.getElementById('eq-modal-diag').textContent = item.diagnostics;

    const statusEl = document.getElementById('eq-modal-status');
    if (statusEl) {
      statusEl.innerHTML = isOptimal
        ? `<span class="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold text-xs"><i class="fa-solid fa-circle-check mr-1.5"></i> Operativo (Sin fallas)</span>`
        : `<span class="px-3 py-1 rounded-full bg-red-950 border border-red-800 text-red-300 font-bold text-xs"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i> Falla: ${item.failureType} (${item.priority} prioridad)</span>`;
    }

    const actionEl = document.getElementById('eq-modal-action-recommendation');
    if (actionEl) {
      actionEl.innerHTML = isOptimal
        ? `<div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-xs">
             <strong>Recomendación Técnica:</strong> Mantener en producción. Continuar con plan de monitoreo preventivo y actualización de parches vía soporte centralizado de TI.
           </div>`
        : `<div class="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs">
             <strong>Acción Requerida (Convenio Privado):</strong> Este equipo forma parte del lote de 18 máquinas críticas. Priorizar para dotación y reemplazo inmediato por el convenio firmado por la Presidencia.
           </div>`;
    }

    modal.classList.remove('hidden');
  }

  static closeEquipmentModal() {
    const modal = document.getElementById('equipment-detail-modal');
    if (modal) modal.classList.add('hidden');
  }

  static exportCSV() {
    const headers = ["ID", "Codigo", "Serial", "Sede", "Area", "Marca_Modelo", "Procesador", "RAM", "Almacenamiento", "Estado", "Tipo_Falla", "Prioridad", "Usuario", "Ultima_Revision", "Diagnostico"];
    const rows = INVENTORY_DATA.map(i => [
      `"${i.id}"`,
      `"${i.code}"`,
      `"${i.serial}"`,
      `"${i.branch}"`,
      `"${i.area}"`,
      `"${i.brandModel}"`,
      `"${i.processor}"`,
      `"${i.ram}"`,
      `"${i.storage}"`,
      `"${i.status}"`,
      `"${i.failureType}"`,
      `"${i.priority}"`,
      `"${i.userAssigned}"`,
      `"${i.lastReview}"`,
      `"${i.diagnostics.replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventario_fundatur_social_40_equipos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
