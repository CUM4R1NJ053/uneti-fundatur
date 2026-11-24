/**
 * UNETI - PROYECTO SOCIOECONÓMICO
 * Módulo de Autenticación y Control de Acceso Basado en Roles (RBAC)
 */

import { CONFIG } from './config.js';

export class AuthManager {
  static listeners = [];

  /**
   * Verifica si el usuario actual tiene privilegios de Administrador
   * @returns {boolean}
   */
  static isAdmin() {
    return localStorage.getItem(CONFIG.auth.sessionStorageKey) === 'true';
  }

  /**
   * Intenta autenticarse con usuario y contraseña
   * @param {string} username 
   * @param {string} password 
   * @returns {boolean}
   */
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

  /**
   * Cierra la sesión de administrador regresando al modo público/visitante
   */
  static logout() {
    localStorage.removeItem(CONFIG.auth.sessionStorageKey);
    this.notifyListeners(false);
  }

  /**
   * Registra un observador que se ejecuta al cambiar el estado de autenticación
   * @param {Function} callback 
   */
  static subscribe(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notifica a todos los componentes de la interfaz sobre el cambio de sesión
   * @param {boolean} isAuthenticated 
   */
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
