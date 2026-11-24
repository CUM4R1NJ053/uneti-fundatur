// Punto de entrada

import { CONFIG } from './config.js';
import { DriveHelper } from './drive-helper.js';
import { StorageManager } from './storage.js';
import { AuthManager } from './auth.js';
import { UIManager } from './ui.js';
import { InventoryUI } from './inventory-ui.js';
import { NavigationManager } from './navigation-manager.js';
import { FUNDATUR_INFO } from './fundatur-info.js';

// Navegación
const navManager = new NavigationManager();

// Handlers UI globales
window.ui = {
  openViewer: (sessionId, resId) => UIManager.openViewer(sessionId, resId),
  closeViewer: () => UIManager.closeViewer(),
  openLoginModal: () => UIManager.openLoginModal(),
  closeLoginModal: () => UIManager.closeLoginModal(),
  openNewSessionModal: () => UIManager.openNewSessionModal(),
  openEditSessionModal: (id) => UIManager.openEditSessionModal(id),
  closeSessionModal: () => UIManager.closeSessionModal(),
  confirmDeleteSession: (id) => UIManager.confirmDeleteSession(id),
  moveSession: (id, dir) => UIManager.moveSession(id, dir),
  addResourceFormRow: () => UIManager.addResourceFormRow(),
  resetToDefaultData: () => UIManager.resetToDefaultData(),
  exportBackup: () => UIManager.exportBackup(),
  handleImportFile: (e) => UIManager.handleImportFile(e),
  switchView: (view) => UIManager.switchView(view),

  // Modal estudiantes
  openStudentModal: (id) => UIManager.openStudentModal(id),
  closeStudentModal: () => UIManager.closeStudentModal(),
  confirmDeleteStudent: (id) => UIManager.confirmDeleteStudent(id),

  // Modal jurado
  openJuryModal: (id) => UIManager.openJuryModal(id),
  closeJuryModal: () => UIManager.closeJuryModal(),
  confirmDeleteJury: (id) => UIManager.confirmDeleteJury(id),
  
  // Validador manual de URLs Drive
  testDriveUrl: () => {
    const input = prompt("Introduce un enlace de Google Drive para validar el ID y formato de incrustación:");
    if (!input) return;
    const id = DriveHelper.extractId(input);
    if (id) {
      const embed = DriveHelper.getEmbedUrl(input);
      const download = DriveHelper.getDownloadUrl(input);
      alert(`✅ Enlace Válido de Google Drive Detectado:\n\nID: ${id}\nURL de Incrustación: ${embed}\nURL de Descarga Directa: ${download}`);
    } else {
      alert("❌ No se pudo extraer un ID válido de Google Drive de esa URL. Asegúrate de que el enlace tenga formato https://drive.google.com/file/d/... o similar.");
    }
  }
};

// Módulos en window
window.inventoryUI = InventoryUI;
window.fundaturInfo = FUNDATUR_INFO;

// Inicialización DOM
document.addEventListener('DOMContentLoaded', () => {
  UIManager.init();
  InventoryUI.init();
  navManager.init();
  console.log(`[FUNDATUR / UNETI] Plataforma Web para "${CONFIG.institution.subject}" iniciada con éxito.`);
});
