// Sincronización en tiempo real con Firebase Realtime Database
(function () {
  'use strict';

  const DB_ROOT = 'uneti_fundatur';
  let db = null;
  let enabled = false;
  let applyingRemote = false;

  function isValidConfig(cfg) {
    if (!cfg || typeof cfg !== 'object') return false;
    if (!cfg.databaseURL || cfg.databaseURL.includes('TU_PROYECTO')) return false;
    if (!cfg.apiKey || cfg.apiKey === 'TU_API_KEY') return false;
    return /^https:\/\/.+firebaseio\.com|^https:\/\/.+firebasedatabase\.app/.test(cfg.databaseURL);
  }

  const FirebaseSync = {
    isEnabled() {
      return enabled;
    },

    init(options = {}) {
      const cfg = window.FIREBASE_CONFIG;
      if (typeof firebase === 'undefined' || !isValidConfig(cfg)) {
        console.info('[FirebaseSync] Modo local activo (configura js/firebase-config.js para sincronizar en la nube).');
        return false;
      }

      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(cfg);
        }
        db = firebase.database();
        enabled = true;

        const rootRef = db.ref(DB_ROOT);
        rootRef.on('value', (snapshot) => {
          const data = snapshot.val();
          if (!data) {
            // Inicializar nube con datos locales si está vacía
            if (typeof options.getSeedData === 'function') {
              rootRef.set(options.getSeedData()).catch((err) => {
                console.warn('[FirebaseSync] No se pudo inicializar la base de datos:', err);
              });
            }
            return;
          }

          applyingRemote = true;
          try {
            if (typeof options.onRemoteData === 'function') {
              options.onRemoteData(data);
            }
          } finally {
            applyingRemote = false;
          }
        }, (err) => {
          console.warn('[FirebaseSync] Error en escucha en tiempo real:', err);
        });

        console.log('[FirebaseSync] Sincronización en tiempo real activa.');
        return true;
      } catch (e) {
        console.warn('[FirebaseSync] Error iniciando Firebase, usando modo local:', e);
        enabled = false;
        return false;
      }
    },

    push(subPath, value) {
      if (!enabled || !db || applyingRemote) return;
      try {
        db.ref(`${DB_ROOT}/${subPath}`).set(value).catch((err) => {
          console.warn(`[FirebaseSync] Error guardando ${subPath} en la nube:`, err);
        });
      } catch (e) {
        console.warn(`[FirebaseSync] Error enviando ${subPath}:`, e);
      }
    }
  };

  window.FirebaseSync = FirebaseSync;
})();
