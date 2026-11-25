// Sincronización en tiempo real con Firebase Realtime Database
(function () {
  'use strict';

  const DB_ROOT = 'uneti_fundatur';
  let db = null;
  let enabled = false;

  // Cuando nosotros mismos disparamos un push, ignoramos el echo de Firebase
  let localWriteTimestamp = 0;
  const ECHO_DEBOUNCE_MS = 1500;

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
        console.info('[FirebaseSync] Modo local activo — configura js/firebase-config.js para sincronizar en la nube.');
        return false;
      }

      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(cfg);
        }
        db = firebase.database();
        enabled = true;

        const rootRef = db.ref(DB_ROOT);

        // Leer datos iniciales UNA sola vez al cargar
        rootRef.once('value', (snapshot) => {
          const data = snapshot.val();

          if (!data) {
            // Base de datos vacía: sembrar con datos locales actuales
            if (typeof options.getSeedData === 'function') {
              rootRef.set(options.getSeedData())
                .then(() => console.log('[FirebaseSync] Base de datos inicializada con datos locales.'))
                .catch((err) => console.warn('[FirebaseSync] No se pudo inicializar la DB:', err));
            }
          } else {
            // Cargar datos desde la nube al arrancar la app
            if (typeof options.onRemoteData === 'function') {
              try { options.onRemoteData(data); } catch (e) {
                console.warn('[FirebaseSync] Error aplicando datos remotos iniciales:', e);
              }
            }
          }

          // Después de la carga inicial, escuchar cambios remotos en tiempo real
          rootRef.on('value', (snap) => {
            // Ignorar el eco inmediato de nuestras propias escrituras
            if (Date.now() - localWriteTimestamp < ECHO_DEBOUNCE_MS) return;

            const remoteData = snap.val();
            if (!remoteData) return;

            if (typeof options.onRemoteData === 'function') {
              try { options.onRemoteData(remoteData); } catch (e) {
                console.warn('[FirebaseSync] Error aplicando cambio remoto en tiempo real:', e);
              }
            }
          });
        }, (err) => {
          console.warn('[FirebaseSync] Error leyendo datos iniciales de Firebase:', err);
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
      if (!enabled || !db) return;
      localWriteTimestamp = Date.now();
      db.ref(`${DB_ROOT}/${subPath}`).set(value).catch((err) => {
        console.warn(`[FirebaseSync] Error guardando ${subPath} en la nube:`, err);
      });
    }
  };

  window.FirebaseSync = FirebaseSync;
})();
