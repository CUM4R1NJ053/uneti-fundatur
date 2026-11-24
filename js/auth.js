// Control de autenticación

import { CONFIG } from './config.js';

export class AuthManager {
  static listeners = [];

  // Estado sesión admin
  static isAdmin() {
    return localStorage.getItem(CONFIG.auth.sessionStorageKey) === 'true';
  }

  // Verificación de credenciales
  static login(username, password) {
    const cleanUser = (username || '').trim();
    const cleanPass = (password || '').trim();

    if (cleanUser === CONFIG.auth.defaultUser && cleanPass === CONFIG.auth.defaultPass) {
      localStorage.setItem(CONFIG.auth.sessionStorageKey, 'true');
      this.notifyListeners(true);
      return true;
    }
    return false;
  }

  // Cierre de sesión
  static logout() {
    localStorage.removeItem(CONFIG.auth.sessionStorageKey);
    this.notifyListeners(false);
  }

  // Suscriptores de cambio de sesión
  static subscribe(callback) {
    this.listeners.push(callback);
  }

  // Notificar suscriptores UI
  static notifyListeners(isAuthenticated) {
    this.listeners.forEach(cb => {
      try {
        cb(isAuthenticated);
      } catch (e) {
        console.error("Error en callback de autenticación:", e);
      }
    });
  }
}
