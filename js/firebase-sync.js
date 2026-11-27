//
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
    if (!cfg.apiKey || cfg.apiKey === 'TU_API_KEY' || cfg.apiKey.includes('reda') || cfg.apiKey.includes('«') || cfg.apiKey.length < 10) return false;
    return /^https:\\/\\/.+firebaseio\\.com|^https:\\/\\/.+firebasedatabase\\.app/.test(cfg.databaseURL);
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

        let isInitialLoad = true;
        const rootRef = db.ref(DB_ROOT);

        rootRef.on('value', (snap) => {
          const remoteData = snap.val();

          if (isInitialLoad) {
            isInitialLoad = false;
            if (!remoteData) {
              if (typeof options.getSeedData === 'function') {
                rootRef.set(options.getSeedData())
                  .then(() => console.log('[FirebaseSync] Base de datos inicializada con datos locales.'))
                  .catch((err) => console.warn('[FirebaseSync] No se pudo inicializar la DB:', err));
              }
            } else if (typeof options.onRemoteData === 'function') {
              try { options.onRemoteData(remoteData); } catch (e) {
                console.warn('[FirebaseSync] Error aplicando datos remotos iniciales:', e);
              }
            }
            return;
          }

          if (Date.now() - localWriteTimestamp < ECHO_DEBOUNCE_MS) return;
          if (!remoteData) return;

          if (typeof options.onRemoteData === 'function') {
            try { options.onRemoteData(remoteData); } catch (e) {
              console.warn('[FirebaseSync] Error aplicando cambio remoto en tiempo real:', e);
            }
          }
        }, (err) => {
          console.warn('[FirebaseSync] Error leyendo datos de Firebase:', err);
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
    },

    registrarReserva(datos) {
      if (!enabled || !db) {
        // Fallback a localStorage si Firebase no está configurado o falla
        try {
          const reservasLS = JSON.parse(localStorage.getItem('fundatur_reservas') || '{}');
          const paquete = datos.paquete || 'desconocido';
          const reservaId = datos.reservaId || Date.now().toString();
          if (!reservasLS[paquete]) reservasLS[paquete] = {};
          // Verificar cupo máximo 20 por paquete
          const currentCount = Object.keys(reservasLS[paquete]).length;
          if (currentCount >= 20) {
            console.warn('[FirebaseSync] Cupo máximo (20) alcanzado para paquete:', paquete);
            return reservaId;
          }
          reservasLS[paquete][reservaId] = {...datos, fecha: new Date().toISOString()};
          localStorage.setItem('fundatur_reservas', JSON.stringify(reservasLS));
          console.info('[FirebaseSync] Reserva guardada en localStorage:', reservaId);
          return reservaId;
        } catch (e) {
          console.error('[FirebaseSync] Error en localStorage fallback:', e);
          return null;
        }
      }
      try {
        const paquete = datos.paquete || 'desconocido';
        const reservaId = datos.reservaId || Date.now().toString();
        // Verificar cupo máximo 20 consultando la DB primero
        return db.ref(`reservas/${paquete}`).once('value').then(snap => {
          const currentCount = snap.val() ? Object.keys(snap.val()).length : 0;
          if (currentCount >= 20) {
            console.warn('[FirebaseSync] Cupo máximo (20) alcanzado para paquete:', paquete);
            return null;
          }
          // Guardar la reserva
          return db.ref(`reservas/${paquete}/${reservaId}`).set({
            ...datos,
            fecha: new Date().toISOString(),
            sync: true
          }).then(() => {
            console.info('[FirebaseSync] Reserva guardada en Firebase:', {paquete, reservaId});
            return reservaId;
          }).catch((err) => {
            console.warn('[FirebaseSync] Error guardando en Firebase, fallback a localStorage:', err);
            // Fallback a localStorage
            const reservasLS = JSON.parse(localStorage.getItem('fundatur_reservas') || '{}');
            if (!reservasLS[paquete]) reservasLS[paquete] = {};
            reservasLS[paquete][reservaId] = {...datos, fecha: new Date().toISOString(), sync: false};
            localStorage.setItem('fundatur_reservas', JSON.stringify(reservasLS));
            console.info('[FirebaseSync] Reserva guardada en localStorage (fallback):', reservaId);
            return reservaId;
          });
        }).catch((err) => {
          console.error('[FirebaseSync] Error checking capacity:', err);
          return null;
        });
      } catch (e) {
        console.error('[FirebaseSync] Error inesperado en registrarReserva:', e);
        return null;
      }
    }
  };

  window.FirebaseSync = FirebaseSync;
})();