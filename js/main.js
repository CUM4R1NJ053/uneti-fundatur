// Punto de entrada principal

(function () {
  'use strict';

  

const CONFIG = {
  institution: {
    name: "FUNDATUR SOCIAL (Fundación Nacional para el Turismo Social y Recreativo de Venezuela)",
    shortName: "FUNDATUR SOCIAL",
    slogan: "Tu descanso es nuestro destino: turismo accesible para quienes mueven el país.",
    university: "Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI)",
    acronym: "FUNDATUR / UNETI",
    subject: "Diagnóstico Tecnológico e Infraestructura de TI • Proyecto Socioeconómico",
    trayecto: "PNF en Ingeniería en Informática",
    academicPeriod: "Periodo Académico 2026-2027",
    projectTitle: "Auditoría del Parque Informático, Implementación de Mesa de Ayuda GLPI / RustDesk y Plan de Reemplazo Tecnológico en 4 Sedes",
    authors: [
      { name: "Estudiante 1 / Investigador", role: "Jefe de Área TI (Ing. en Sistemas) / Plataforma Web" },
      { name: "Estudiante 2 / Investigador", role: "Soporte Operativo (Técnico en Informática) / Levantamiento de Campo" }
    ],
    tutor: "Prof. Asesor de Proyecto UNETI",
    location: "Caracas (Sede Principal), Maracay, Maracaibo, Puerto La Cruz"
  },

  auth: {
    defaultUser: "admin",
    defaultPass: "uneti2025",
    sessionStorageKey: "uneti_admin_session"
  },

  resourceTypes: {
    video: { label: "Video Demostrativo", icon: "fa-solid fa-play", color: "text-red-400 bg-red-950/40 border-red-800/50" },
    pdf: { label: "Informe / Documento PDF", icon: "fa-solid fa-file-pdf", color: "text-amber-400 bg-amber-950/40 border-amber-800/50" },
    presentation: { label: "Presentación (Slides)", icon: "fa-solid fa-file-powerpoint", color: "text-orange-400 bg-orange-950/40 border-orange-800/50" },
    image: { label: "Evidencia Fotográfica", icon: "fa-solid fa-image", color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50" },
    sheet: { label: "Matriz / Datos Financieros", icon: "fa-solid fa-file-excel", color: "text-green-400 bg-green-950/40 border-green-800/50" },
    drive: { label: "Recurso Google Drive", icon: "fa-brands fa-google-drive", color: "text-sky-400 bg-sky-950/40 border-sky-800/50" }
  }
};

  

class DriveHelper {
  static extractId(url) {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim();

        if (/^[a-zA-Z0-9_-]{25,}$/.test(cleanUrl)) {
      return cleanUrl;
    }

    const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

        const docsMatch = cleanUrl.match(/\/(?:document|presentation|spreadsheets)\/d\/([a-zA-Z0-9_-]+)/);
    if (docsMatch && docsMatch[1]) return docsMatch[1];

        const queryIdMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (queryIdMatch && queryIdMatch[1]) return queryIdMatch[1];

        const folderMatch = cleanUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch && folderMatch[1]) return folderMatch[1];

    return null;
  }

  static getEmbedUrl(url, type = 'drive') {
    const fileId = this.extractId(url);
    if (!fileId) return url;

        if (url.includes('docs.google.com/presentation')) {
      return `https://docs.google.com/presentation/d/${fileId}/embed?start=false&loop=false&delayms=3000`;
    }
    if (url.includes('docs.google.com/document')) {
      return `https://docs.google.com/document/d/${fileId}/preview`;
    }
    if (url.includes('docs.google.com/spreadsheets')) {
      return `https://docs.google.com/spreadsheets/d/${fileId}/preview?widget=true&headers=false`;
    }
    if (url.includes('/folders/')) {
      return `https://drive.google.com/embeddedfolderview?id=${fileId}#grid`;
    }

        return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  static getDownloadUrl(url) {
    const fileId = this.extractId(url);
    if (!fileId) return url;

        if (url.includes('docs.google.com/presentation')) {
      return `https://docs.google.com/presentation/d/${fileId}/export/pdf`;
    }
    if (url.includes('docs.google.com/document')) {
      return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
    }

        return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  static getViewUrl(url) {
    const fileId = this.extractId(url);
    if (!fileId) return url;
    
    if (url.includes('/folders/')) {
      return `https://drive.google.com/drive/folders/${fileId}`;
    }
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }

  static getThumbnailUrl(url, width = 800) {
    const fileId = this.extractId(url);
    if (!fileId) return '';
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
  }

  static isValidDriveUrl(url) {
    return Boolean(this.extractId(url));
  }
}

  
  // Persistencia en localStorage para sesiones, equipo e inventario

const STORAGE_KEY = 'fundatur_uneti_socioeconomico_sessions_v3';
const TEAM_STORAGE_KEY = 'fundatur_uneti_socioeconomico_team_v3';
const INVENTORY_STORAGE_KEY = 'fundatur_uneti_inventory_v3';

const INITIAL_TEAM = {
  students: [
    {
      id: "std-1",
      name: "Ingeniero en Sistemas (Jefe de TI)",
      cedula: "V-28.450.123",
      role: "Jefe de Área de Tecnología (TI) • Arquitectura y Servidores",
      email: "ti.jefe@fundatur.gob.ve",
      phone: "+58 412-5550101"
    },
    {
      id: "std-2",
      name: "Técnico en Informática (Soporte Operativo)",
      cedula: "V-29.890.456",
      role: "Soporte Operativo Nivel 1 • GLPI & RustDesk Remoto",
      email: "soporte.ti@fundatur.gob.ve",
      phone: "+58 414-5550202"
    }
  ],
  jury: [
    {
      id: "jury-1",
      name: "Prof. Asesor de Proyecto",
      title: "Ing. en Informática / Magíster en Telecomunicaciones",
      role: "Tutor Académico de Proyecto - UNETI",
      department: "Coordinación de Proyecto Socioeconómico - UNETI",
      email: "tutor.academico@uneti.edu.ve"
    },
    {
      id: "jury-2",
      name: "Prof. Jurado Calificador",
      title: "Especialista en Infraestructura y Redes",
      role: "Jurado Calificador Principal - UNETI",
      department: "Comité Técnico Evaluador - UNETI",
      email: "jurado.evaluador@uneti.edu.ve"
    }
  ]
};

const INITIAL_SESSIONS = [
  {
    id: "sesion-1",
    phase: "Sesión Didáctica I",
    week: "Semanas 1 - 3",
    status: "Aprobado",
    statusColor: "emerald",
    title: "Diagnóstico Institucional y Auditoría de Parque Informático (40 Equipos)",
    date: "Octubre 2024",
    summary: "Levantamiento técnico exhaustivo en las 4 sedes de FUNDATUR SOCIAL (Caracas, Maracay, Maracaibo, Puerto La Cruz). Identificación de 22 equipos operativos y 18 con fallas críticas tras la cuarentena.",
    objectives: [
      "Auditar técnicamente la muestra representativa de 40 computadoras de la Fundación (marca, modelo, CPU, RAM, almacenamiento y estado).",
      "Identificar los factores críticos: pérdida de trazabilidad post-cuarentena, modificaciones no autorizadas y obsolescencia en sedes foráneas.",
      "Consolidar la base de datos de hardware codificada de FND-01 a FND-40 para la toma de decisiones directivas."
    ],
    resources: [
      {
        id: "res-1-1",
        title: "Informe Técnico - Auditoría de 40 Equipos y Diagnóstico de TI",
        type: "pdf",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_FASE1_DIAGNOSTICO_UNETI/view?usp=sharing",
        description: "Documento oficial con la ficha técnica detallada de los 40 equipos en Caracas, Maracay, Maracaibo y Puerto La Cruz."
      },
      {
        id: "res-1-2",
        title: "Matriz de Inventario Tecnológico Auditado (Hoja de Cálculo)",
        type: "sheet",
        driveUrl: "https://docs.google.com/spreadsheets/d/1vC_EX_HOJA_COSTOS_UNETI/edit?usp=sharing",
        description: "Tabla de cálculo con seriales, usuarios asignados, especificaciones de hardware y estado de operatividad."
      },
      {
        id: "res-1-3",
        title: "Presentación Ejecutiva para Presidencia y Dirección",
        type: "presentation",
        driveUrl: "https://docs.google.com/presentation/d/1vC_EX_SLIDES_FASE1_UNETI/edit?usp=sharing",
        description: "Láminas presentadas a la Presidencia Ejecutiva demostrando la urgencia de ejecución del convenio de dotación."
      }
    ]
  },
  {
    id: "sesion-2",
    phase: "Sesión Didáctica II",
    week: "Semanas 4 - 7",
    status: "Aprobado",
    statusColor: "emerald",
    title: "Plan de Reemplazo Tecnológico y Factibilidad del Convenio Empresarial",
    date: "Noviembre 2024",
    summary: "Diseño del plan de recepción, homologación y asignación de equipos nuevos producto del convenio firmado con el sector privado para sustituir prioritariamente las 18 máquinas obsoletas.",
    objectives: [
      "Priorizar la sustitución de los 18 puestos críticos en áreas que paralizan atención al usuario y sucursales del interior.",
      "Establecer la estructura de costos cero en licencias mediante la selección de software libre y open-source.",
      "Diseñar la logística de distribución desde la Sede Central Caracas hacia Maracay, Maracaibo y Puerto La Cruz."
    ],
    resources: [
      {
        id: "res-2-1",
        title: "Estudio de Factibilidad y Plan de Ejecución del Convenio",
        type: "pdf",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_FASE2_FACTIBILIDAD_UNETI/view?usp=sharing",
        description: "Plan de renovación tecnológica y cronograma de despliegue para sustituir los 18 equipos con fallas."
      },
      {
        id: "res-2-2",
        title: "Diagrama de Distribución Física y Conectividad en 4 Sedes",
        type: "image",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_MAPA_CARTOGRAFIA_UNETI/view?usp=sharing",
        description: "Mapa de la infraestructura de red en Caracas (Planta Baja y Piso 1) y enlace remoto a las 3 sucursales."
      },
      {
        id: "res-2-3",
        title: "Video Demostrativo del Análisis de Rendimiento del Hardware",
        type: "video",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_VIDEO_SIMULACION_RED/view?usp=sharing",
        description: "Comparativa técnica entre equipos con SSD/16GB vs equipos obsoletos con HDD/2GB de RAM."
      }
    ]
  },
  {
    id: "sesion-3",
    phase: "Sesión Didáctica III",
    week: "Semanas 8 - 11",
    status: "Completado",
    statusColor: "sky",
    title: "Despliegue de Mesa de Ayuda GLPI y Soporte Remoto RustDesk",
    date: "Diciembre 2024 - Enero 2025",
    summary: "Puesta en marcha de GLPI para gestión centralizada de tickets e inventario de hardware/software, junto con RustDesk para asistencia remota en tiempo real hacia las sucursales del interior.",
    objectives: [
      "Instalar y configurar la instancia de GLPI adaptada a la nomenclatura de equipos FND-01 al FND-40.",
      "Configurar el servidor y clientes de RustDesk para soporte remoto directo hacia Maracay, Maracaibo y Puerto La Cruz.",
      "Validar el flujo de soporte técnico operado por solo 2 personas (Ingeniero en Sistemas y Técnico en Informática)."
    ],
    resources: [
      {
        id: "res-3-1",
        title: "Video Demostrativo del Sistema de Tickets GLPI y RustDesk",
        type: "video",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_VIDEO_INSTALACION_CAMPO/view?usp=sharing",
        description: "Simulación de resolución de falla remota en la sucursal Maracaibo mediante enlace RustDesk desde Caracas."
      },
      {
        id: "res-3-2",
        title: "Manual Técnico de Administración de GLPI e Inventario",
        type: "pdf",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_MANUAL_TECNICO_RED/view?usp=sharing",
        description: "Guía de configuración para categorías de tickets, prioridades y ciclo de vida de incidencias."
      },
      {
        id: "res-3-3",
        title: "Guía Rápida para el Usuario Final sobre Apertura de Reportes",
        type: "pdf",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_GUIA_TALLER_COMUNIDAD/view?usp=sharing",
        description: "Instructivo para trabajadores de FUNDATUR SOCIAL para reportar fallas indicando código de equipo."
      }
    ]
  },
  {
    id: "sesion-4",
    phase: "Sesión Didáctica IV",
    week: "Semanas 12 - 14",
    status: "Completado",
    statusColor: "sky",
    title: "Protocolo de Atención, SLA y Capacitación a Usuarios en 4 Sedes",
    date: "Febrero 2025",
    summary: "Estandarización de normas de atención al usuario: tiempos de respuesta (Alta <1h, Media <4h, Baja 24-48h), niveles de escalamiento y restricción de instalaciones no autorizadas.",
    objectives: [
      "Implementar el flujo de 5 pasos: Registro, Asignación, Nivel 1 (Técnico), Nivel 2 (Ingeniero) y Cierre con conformidad.",
      "Capacitar al personal administrativo y turístico de las 4 sedes en el uso adecuado del equipo informático asignado.",
      "Eliminar prácticas de instalación de programas no supervisados que comprometen la estabilidad del sistema."
    ],
    resources: [
      {
        id: "res-4-1",
        title: "Manual de Normas de Uso y Políticas de Seguridad Informática",
        type: "pdf",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_INFORME_IMPACTO_UNETI/view?usp=sharing",
        description: "Reglamento interno institucional aprobado para la custodia de computadoras y prevención de fallas."
      },
      {
        id: "res-4-2",
        title: "Evidencias Fotográficas de Jornadas de Soporte y Capacitación",
        type: "image",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_FOTOS_DESPLIEGUE_UNETI/view?usp=sharing",
        description: "Registro gráfico de las sesiones de adiestramiento con trabajadores de FUNDATUR SOCIAL."
      },
      {
        id: "res-4-3",
        title: "Video de Testimonios y Eficiencia en Gestión de Falla",
        type: "video",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_VIDEO_TESTIMONIOS_UNETI/view?usp=sharing",
        description: "Entrevistas con coordinadores de sucursales confirmando la reducción en tiempos de espera por soporte."
      }
    ]
  },
  {
    id: "sesion-5",
    phase: "Sesión Didáctica V",
    week: "Semanas 15 - 16",
    status: "Aprobado",
    statusColor: "emerald",
    title: "Evaluación de Sostenibilidad, Impacto Socioeconómico y Cierre de Proyecto",
    date: "Marzo 2025",
    summary: "Medición final de indicadores: 85% de reducción en tiempos de inactividad de sucursales, ahorro económico total por adopción de software libre y operatividad garantizada para el turismo social.",
    objectives: [
      "Evaluar la eficiencia operativa de los planes turísticos para estudiantes y trabajadores públicos tras la modernización.",
      "Consolidar el expediente técnico académico final para la evaluación de jurado de la UNETI.",
      "Entregar a la Presidencia de FUNDATUR SOCIAL el cuadro de mando y recomendaciones de mantenimiento continuo."
    ],
    resources: [
      {
        id: "res-5-1",
        title: "Tomo Académico Final - Proyecto Socioeconómico UNETI",
        type: "pdf",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_TOMO_FINAL_TESIS_UNETI/view?usp=sharing",
        description: "Memoria descriptiva completa con metodología, marco legal, estudio técnico-financiero y conclusiones."
      },
      {
        id: "res-5-2",
        title: "Láminas de Defensa Pública de Grado ante Jurado Evaluador",
        type: "presentation",
        driveUrl: "https://docs.google.com/presentation/d/1vC_EX_SLIDES_DEFENSA_UNETI/edit?usp=sharing",
        description: "Presentación final para la socialización de resultados ante el cuerpo docente de la UNETI."
      },
      {
        id: "res-5-3",
        title: "Video Resumen del Despliegue Tecnológico en FUNDATUR SOCIAL",
        type: "video",
        driveUrl: "https://drive.google.com/file/d/1vC_EX_VIDEO_RESUMEN_EJECUTIVO/view?usp=sharing",
        description: "Recorrido audiovisual demostrando el impacto directo del proyecto en la conectividad de las 4 sedes."
      }
    ]
  }
];

class StorageManager {
  static getSessions() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveSessions(INITIAL_SESSIONS);
      return INITIAL_SESSIONS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("[StorageManager] Error leyendo sesiones, restableciendo:", e);
      this.saveSessions(INITIAL_SESSIONS);
      return INITIAL_SESSIONS;
    }
  }

  static saveSessions(sessions, skipRemote = false) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      if (!skipRemote && window.FirebaseSync) {
        window.FirebaseSync.push('sessions', sessions);
      }
      return true;
    } catch (e) {
      console.error("[StorageManager] Error guardando sesiones:", e);
      return false;
    }
  }

  static getSessionById(id) {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === id) || null;
  }

  static upsertSession(sessionData) {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === sessionData.id);

    if (index >= 0) {
      sessions[index] = { ...sessions[index], ...sessionData };
    } else {
      if (!sessionData.id) {
        sessionData.id = `sesion-${Date.now()}`;
      }
      sessions.push(sessionData);
    }

    this.saveSessions(sessions);
    return sessionData;
  }

  static deleteSession(id) {
    let sessions = this.getSessions();
    sessions = sessions.filter(s => s.id !== id);
    this.saveSessions(sessions);
    return true;
  }

  static addSession(data) {
    return this.upsertSession(data);
  }

  static updateSession(id, data) {
    return this.upsertSession({ id, ...data });
  }

  static moveSession(id, direction) {
    const sessions = this.getSessions();
    const idx = sessions.findIndex(s => s.id === id);
    if (idx < 0) return false;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sessions.length) return false;
    const temp = sessions[idx];
    sessions[idx] = sessions[targetIdx];
    sessions[targetIdx] = temp;
    this.saveSessions(sessions);
    return true;
  }

  static resetSessions() {
    this.saveSessions(INITIAL_SESSIONS);
    this.saveTeam(INITIAL_TEAM);
    return true;
  }

  static resetToDefaults() {
    return this.resetSessions();
  }

  static getTeam() {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) {
      this.saveTeam(INITIAL_TEAM);
      return INITIAL_TEAM;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("[StorageManager] Error leyendo equipo, restableciendo:", e);
      this.saveTeam(INITIAL_TEAM);
      return INITIAL_TEAM;
    }
  }

  static saveTeam(teamData, skipRemote = false) {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));
      if (!skipRemote && window.FirebaseSync) {
        window.FirebaseSync.push('team', teamData);
      }
      return true;
    } catch (e) {
      console.error("[StorageManager] Error guardando equipo:", e);
      return false;
    }
  }

  static upsertStudent(student) {
    const team = this.getTeam();
    if (!team.students) team.students = [];
    const idx = team.students.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      team.students[idx] = { ...team.students[idx], ...student };
    } else {
      if (!student.id) student.id = `std-${Date.now()}`;
      team.students.push(student);
    }
    this.saveTeam(team);
    return student;
  }

  static deleteStudent(id) {
    const team = this.getTeam();
    if (team.students) {
      team.students = team.students.filter(s => s.id !== id);
      this.saveTeam(team);
    }
    return true;
  }

  static upsertJury(member) {
    const team = this.getTeam();
    if (!team.jury) team.jury = [];
    const idx = team.jury.findIndex(j => j.id === member.id);
    if (idx >= 0) {
      team.jury[idx] = { ...team.jury[idx], ...member };
    } else {
      if (!member.id) member.id = `jury-${Date.now()}`;
      team.jury.push(member);
    }
    this.saveTeam(team);
    return member;
  }

  static addStudent(student) {
    return this.upsertStudent(student);
  }

  static updateStudent(id, studentData) {
    return this.upsertStudent({ id, ...studentData });
  }

  static addJury(member) {
    return this.upsertJury(member);
  }

  static updateJury(id, memberData) {
    return this.upsertJury({ id, ...memberData });
  }

  static deleteJury(id) {
    const team = this.getTeam();
    if (team.jury) {
      team.jury = team.jury.filter(j => j.id !== id);
      this.saveTeam(team);
    }
    return true;
  }

  static getInventory() {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) {
          if (typeof INVENTORY_DATA !== 'undefined' && Array.isArray(INVENTORY_DATA)) {
        this.saveInventory(INVENTORY_DATA);
        return INVENTORY_DATA;
      }
      return [];
    }
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("[StorageManager] Error leyendo inventario, restableciendo:", e);
      return [];
    }
  }

  static saveInventory(items, skipRemote = false) {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
      if (!skipRemote && window.FirebaseSync) {
        window.FirebaseSync.push('inventory', items);
      }
      return true;
    } catch (e) {
      console.error("[StorageManager] Error guardando inventario:", e);
      return false;
    }
  }

  static upsertEquipment(item) {
    const inventory = this.getInventory();
    if (!item.id) {
      const maxNum = inventory.reduce((max, cur) => {
        const m = (cur.id || '').match(/FND-(\d+)/i);
        return m ? Math.max(max, parseInt(m[1], 10)) : max;
      }, 0);
      item.id = `FND-${String(maxNum + 1).padStart(2, '0')}`;
    }
    const idx = inventory.findIndex(e => (e.id || '').toLowerCase() === item.id.toLowerCase());
    if (idx >= 0) {
      inventory[idx] = { ...inventory[idx], ...item };
    } else {
      inventory.push(item);
    }
    this.saveInventory(inventory);
    return item;
  }

  static deleteEquipment(id) {
    const inventory = this.getInventory();
    const filtered = inventory.filter(e => e.id !== id);
    this.saveInventory(filtered);
    return true;
  }

  static resetInventory(initialData = null) {
    const dataToSave = initialData || (typeof INVENTORY_DATA !== 'undefined' ? INVENTORY_DATA : []);
    this.saveInventory(dataToSave);
    return dataToSave;
  }
}

  

const FUNDATUR_INFO = {
  identidad: {
    nombre: "FUNDATUR SOCIAL (Fundación Nacional para el Turismo Social y Recreativo de Venezuela)",
    slogan: "Tu descanso es nuestro destino: turismo accesible para quienes mueven el país.",
    quienesSomos: "Promovemos planes vacacionales y recreacionales económicos para estudiantes de educación básica y universitaria, y trabajadores del sector público, impulsando a la vez los servicios y atractivos de cada región venezolana.",
    mision: "Ofrecer turismo social accesible a estudiantes y trabajadores públicos, fortaleciendo el desarrollo regional del país.",
    vision: "Ser el referente nacional en recreación social con una plataforma tecnológica moderna y conectada en todas nuestras sedes.",
    valores: [
      "Accesibilidad",
      "Compromiso regional",
      "Transparencia",
      "Calidad de servicio"
    ]
  },

  organigrama: [
    {
      cargo: "Presidencia Ejecutiva",
      rol: "Dirección estratégica y convenios"
    },
    {
      cargo: "Departamento de Tecnología TI",
      rol: "Jefe Ing. en Sistemas, Soporte Técnico en Informática"
    },
    {
      cargo: "Operaciones y Planes Turísticos",
      rol: "Diseño, logística, coordinación y ejecución de planes vacacionales"
    },
    {
      cargo: "Atención al Usuario y Relaciones Institucionales",
      rol: "Ventanilla de entrada, gestión de solicitudes y recepción de reportes"
    },
    {
      cargo: "Finanzas y Administración",
      rol: "Contabilidad, presupuesto y recursos económicos"
    },
    {
      cargo: "Talento Humano (RRHH)",
      rol: "Gestión de personal, nómina y bienestar social"
    }
  ],

  sedes: [
    {
      nombre: "Caracas",
      tipo: "Sede Principal",
      direccion: "Los Caobos, Av. Libertador",
      rol: "Edificio de 2 pisos. PB: Atención al Usuario, Operaciones, Tecnología; Piso 1: Presidencia, Administración, Talento Humano. Soporte técnico centralizado."
    },
    {
      nombre: "Maracay",
      tipo: "Sucursal",
      direccion: "Las Delicias, Av. Bolívar Este",
      rol: "Atiende el eje central; depende del soporte remoto de Caracas."
    },
    {
      nombre: "Maracaibo",
      tipo: "Sucursal",
      direccion: "Av. 5 de Julio, Edif. Costa Azul",
      rol: "Gestiona rutas del occidente y costas zulianas con enlace remoto a TI."
    },
    {
      nombre: "Puerto La Cruz",
      tipo: "Sucursal",
      direccion: "Paseo Colón, C.C. El Morro",
      rol: "Coordina planes del oriente e islas, conectada por soporte remoto."
    }
  ],

  diagnosticoTecnologico: {
    totalEquipos: 40,
    equiposOperativos: 22,
    equiposConFallas: 18,
    causasDetectadas: [
      "Sin control del inventario tras la cuarentena",
      "Cambios realizados por usuarios sin autorización",
      "Equipos obsoletos afectando el trabajo (2-4 GB RAM, discos mecánicos desgastados)",
      "Sedes del interior frenadas por falta de soporte presencial"
    ],
    convenio: "Convenio firmado con empresa privada para reemplazo progresivo comenzando por los 18 equipos críticos."
  },

  plataformaSoporte: {
    herramientas: {
      glpi: {
        nombre: "GLPI",
        descripcion: "Software de Mesa de Ayuda e Inventario con sistema de tickets y seguimiento de hardware/software."
      },
      rustdesk: {
        nombre: "RustDesk",
        descripcion: "Software de Soporte Remoto para atención a distancia de sucursales (Maracay, Maracaibo, Puerto La Cruz)."
      }
    },
    tiemposRespuesta: {
      alta: "< 1 hora (Sucursal paralizada o falla crítica)",
      media: "< 4 horas (Equipo lento o problema de software que permite trabajo parcial)",
      baja: "24 a 48 horas (Instalación de programas aprobados o consultas generales)"
    },
    protocoloPasos: [
      { paso: 1, titulo: "Registro del reporte", detalle: "El usuario ingresa a GLPI e indica sede, código de equipo (FND-XX) y problema." },
      { paso: 2, titulo: "Asignación de prioridad", detalle: "Tecnología evalúa e indica la prioridad (Alta <1h, Media <4h, Baja 24-48h)." },
      { paso: 3, titulo: "Atención Nivel 1", detalle: "Técnico en Informática resuelve fallas habituales presencialmente o vía RustDesk." },
      { paso: 4, titulo: "Escalamiento Nivel 2", detalle: "Ingeniero en Sistemas atiende revisiones profundas, cambio de piezas o reemplazo por convenio." },
      { paso: 5, titulo: "Validación y cierre", detalle: "El usuario confirma la solución y se cierra el ticket en GLPI." }
    ]
  }
};

  

const INVENTORY_DATA = [
  {
    "id": "FND-01",
    "code": "205201",
    "serial": "SR-FND-0101",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Tecnología (TI)",
    "brandModel": "HP ProDesk 400 G6",
    "processor": "Intel Core i5-10500",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Equipo en buen estado. Sistema estable, antivirus activo y sin problemas de rendimiento.",
    "priority": "Normal",
    "userAssigned": "Jefe de TI",
    "lastReview": "2024-11-15"
  },
  {
    "id": "FND-02",
    "code": "205202",
    "serial": "SR-FND-0102",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Presidencia Ejecutiva",
    "brandModel": "Lenovo ThinkCentre M720q",
    "processor": "Intel Core i7-9700",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Equipo institucional de alta gama. Rendimiento óptimo en tareas ejecutivas.",
    "priority": "Normal",
    "userAssigned": "Asistente Presidencial",
    "lastReview": "2024-11-14"
  },
  {
    "id": "FND-03",
    "code": "205203",
    "serial": "SR-FND-0103",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Finanzas y Administración",
    "brandModel": "Dell OptiPlex 5080",
    "processor": "Intel Core i5-10500",
    "ram": "16 GB DDR4",
    "storage": "SSD 240 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Operaciones contables fluidas. Antivirus institucional actualizado.",
    "priority": "Normal",
    "userAssigned": "Analista Contable",
    "lastReview": "2024-11-15"
  },
  {
    "id": "FND-04",
    "code": "205204",
    "serial": "SR-FND-0104",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Operaciones y Planes Turísticos",
    "brandModel": "HP ProDesk 600 G5",
    "processor": "AMD Ryzen 5 3600",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Excelente tiempo de respuesta en gestión de rutas y reservas turísticas.",
    "priority": "Normal",
    "userAssigned": "Coord. Logística",
    "lastReview": "2024-11-12"
  },
  {
    "id": "FND-05",
    "code": "205205",
    "serial": "SR-FND-0105",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Presidencia Ejecutiva",
    "brandModel": "Lenovo ThinkCentre M920t",
    "processor": "Intel Core i7-10700",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Estación de trabajo ejecutiva sin contratiempos.",
    "priority": "Normal",
    "userAssigned": "Director Ejecutivo",
    "lastReview": "2024-11-10"
  },
  {
    "id": "FND-06",
    "code": "205206",
    "serial": "SR-FND-0106",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Atención al Usuario",
    "brandModel": "Dell OptiPlex 3070",
    "processor": "Intel Core i3-10100",
    "ram": "8 GB DDR4",
    "storage": "SSD 240 GB SSD",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Taquilla principal con respuesta veloz y conexión estable a red local.",
    "priority": "Normal",
    "userAssigned": "Coord. Atención",
    "lastReview": "2024-11-15"
  },
  {
    "id": "FND-07",
    "code": "205207",
    "serial": "SR-FND-0107",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Talento Humano (RRHH)",
    "brandModel": "HP ProDesk 400 G6",
    "processor": "Intel Core i5-10500",
    "ram": "8 GB DDR4",
    "storage": "SSD 240 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Procesamiento de nómina sin bloqueos. Mantenimiento al día.",
    "priority": "Normal",
    "userAssigned": "Analista RRHH",
    "lastReview": "2024-11-11"
  },
  {
    "id": "FND-08",
    "code": "205208",
    "serial": "SR-FND-0108",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Tecnología (TI)",
    "brandModel": "Lenovo V530s",
    "processor": "AMD Ryzen 7 3700G",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Servidor de pruebas y monitoreo remoto funcionando al 100%.",
    "priority": "Normal",
    "userAssigned": "Soporte Técnico",
    "lastReview": "2024-11-16"
  },
  {
    "id": "FND-09",
    "code": "205209",
    "serial": "SR-FND-0109",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Operaciones y Planes Turísticos",
    "brandModel": "Dell OptiPlex 5070",
    "processor": "Intel Core i5-9500",
    "ram": "8 GB DDR4",
    "storage": "SSD 240 GB SSD",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Equipo en buen estado. Sistema estable, antivirus activo y sin problemas de rendimiento.",
    "priority": "Normal",
    "userAssigned": "Planner Vacacional",
    "lastReview": "2024-11-13"
  },
  {
    "id": "FND-10",
    "code": "205210",
    "serial": "SR-FND-0110",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Finanzas y Administración",
    "brandModel": "HP EliteDesk 800 G5",
    "processor": "Intel Core i7-9700",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Gestión presupuestaria eficiente. Hardware moderno y verificado.",
    "priority": "Normal",
    "userAssigned": "Jefe de Presupuesto",
    "lastReview": "2024-11-14"
  },
  {
    "id": "FND-11",
    "code": "205211",
    "serial": "SR-FND-0111",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Atención al Usuario",
    "brandModel": "HP Compaq Pro 6300",
    "processor": "Intel Core i3-3220",
    "ram": "4 GB DDR3",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Hardware",
    "diagnostics": "Falla severa de ventilador de disipador (ruido excesivo) y ruidos mecánicos en disco duro.",
    "priority": "Alta",
    "userAssigned": "Recepción Los Caobos",
    "lastReview": "2024-11-05"
  },
  {
    "id": "FND-12",
    "code": "205212",
    "serial": "SR-FND-0112",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Talento Humano (RRHH)",
    "brandModel": "Dell OptiPlex 3020",
    "processor": "Intel Core 2 Duo E8400",
    "ram": "2 GB DDR3",
    "storage": "HDD 320 GB mecánico",
    "status": "Con falla",
    "failureType": "Obsoleto",
    "diagnostics": "Hardware totalmente descontinuado, 2GB RAM insuficientes. Se congela al abrir hojas de nómina.",
    "priority": "Alta",
    "userAssigned": "Auxiliar Nómina",
    "lastReview": "2024-11-04"
  },
  {
    "id": "FND-13",
    "code": "205213",
    "serial": "SR-FND-0113",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Finanzas y Administración",
    "brandModel": "Lenovo ThinkCentre Edge 72",
    "processor": "Intel Core i3-2120",
    "ram": "4 GB DDR3",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Software",
    "diagnostics": "Software no autorizado instalado por usuario genera pantalla azul e incompatibilidad de drivers.",
    "priority": "Media",
    "userAssigned": "Auxiliar Contable",
    "lastReview": "2024-11-06"
  },
  {
    "id": "FND-14",
    "code": "205214",
    "serial": "SR-FND-0114",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Operaciones y Planes Turísticos",
    "brandModel": "HP Slim Desktop 290",
    "processor": "Intel Core i3-8100",
    "ram": "4 GB DDR4",
    "storage": "HDD 1 TB mecánico",
    "status": "Con falla",
    "failureType": "Sin control",
    "diagnostics": "Equipo movido de puesto durante la cuarentena sin registro administrativo. En cuarentena de TI.",
    "priority": "Media",
    "userAssigned": "Sin asignar (Cuarentena)",
    "lastReview": "2024-11-02"
  },
  {
    "id": "FND-15",
    "code": "205215",
    "serial": "SR-FND-0115",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Atención al Usuario",
    "brandModel": "Dell Inspiron 3470",
    "processor": "Intel Core i3-9100",
    "ram": "4 GB DDR4",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Hardware",
    "diagnostics": "Batería de la BIOS agotada y capacitores de la fuente con variación de voltaje.",
    "priority": "Alta",
    "userAssigned": "Taquilla 2",
    "lastReview": "2024-11-08"
  },
  {
    "id": "FND-16",
    "code": "205216",
    "serial": "SR-FND-0116",
    "branch": "Caracas",
    "branchFull": "Sede Principal — Caracas (Los Caobos)",
    "area": "Tecnología (TI)",
    "brandModel": "HP ProDesk 400 G2",
    "processor": "Intel Core i3-4160",
    "ram": "4 GB DDR3",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Software",
    "diagnostics": "S.O. corrupto por descarga no autorizada de utilitarios de terceros. Requiere re-formateo.",
    "priority": "Baja",
    "userAssigned": "Puesto de Prueba",
    "lastReview": "2024-11-07"
  },
  {
    "id": "FND-17",
    "code": "205217",
    "serial": "SR-FND-0201",
    "branch": "Maracay",
    "branchFull": "Sucursal — Maracay (Las Delicias)",
    "area": "Operaciones y Planes Turísticos",
    "brandModel": "Dell OptiPlex 3080",
    "processor": "Intel Core i5-10500",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Equipo en excelente estado. Conexión RustDesk activa con central de Caracas.",
    "priority": "Normal",
    "userAssigned": "Coordinador Maracay",
    "lastReview": "2024-11-12"
  },
  {
    "id": "FND-18",
    "code": "205218",
    "serial": "SR-FND-0202",
    "branch": "Maracay",
    "branchFull": "Sucursal — Maracay (Las Delicias)",
    "area": "Atención al Usuario",
    "brandModel": "HP ProDesk 400 G7",
    "processor": "AMD Ryzen 5 4600G",
    "ram": "8 GB DDR4",
    "storage": "SSD 240 GB SSD",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Atención continua a estudiantes y trabajadores. Sistema rápido y actualizado.",
    "priority": "Normal",
    "userAssigned": "Agente Maracay 1",
    "lastReview": "2024-11-14"
  },
  {
    "id": "FND-19",
    "code": "205219",
    "serial": "SR-FND-0203",
    "branch": "Maracay",
    "branchFull": "Sucursal — Maracay (Las Delicias)",
    "area": "Finanzas y Administración",
    "brandModel": "Lenovo ThinkCentre M70q",
    "processor": "Intel Core i3-10100",
    "ram": "8 GB DDR4",
    "storage": "SSD 240 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Revisión administrativa regional al día sin incidencias de hardware.",
    "priority": "Normal",
    "userAssigned": "Administrador Maracay",
    "lastReview": "2024-11-10"
  },
  {
    "id": "FND-20",
    "code": "205220",
    "serial": "SR-FND-0204",
    "branch": "Maracay",
    "branchFull": "Sucursal — Maracay (Las Delicias)",
    "area": "Tecnología (TI)",
    "brandModel": "Dell OptiPlex 5090",
    "processor": "Intel Core i7-11700",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Punto de enlace local para soporte remoto. Rendimiento óptimo.",
    "priority": "Normal",
    "userAssigned": "Enlace TI Maracay",
    "lastReview": "2024-11-15"
  },
  {
    "id": "FND-21",
    "code": "205221",
    "serial": "SR-FND-0205",
    "branch": "Maracay",
    "branchFull": "Sucursal — Maracay (Las Delicias)",
    "area": "Atención al Usuario",
    "brandModel": "HP Compaq 6000 Pro",
    "processor": "Intel Core 2 Duo E7500",
    "ram": "2 GB DDR2",
    "storage": "HDD 250 GB mecánico",
    "status": "Con falla",
    "failureType": "Obsoleto",
    "diagnostics": "Procesador descontinuado, 2GB RAM. Paraliza la taquilla de atención al público.",
    "priority": "Alta",
    "userAssigned": "Agente Maracay 2",
    "lastReview": "2024-11-03"
  },
  {
    "id": "FND-22",
    "code": "205222",
    "serial": "SR-FND-0206",
    "branch": "Maracay",
    "branchFull": "Sucursal — Maracay (Las Delicias)",
    "area": "Operaciones y Planes Turísticos",
    "brandModel": "Lenovo V330",
    "processor": "Intel Core i3-7100",
    "ram": "4 GB DDR4",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Hardware",
    "diagnostics": "Falla de ventilador de CPU produce apagados repentinos por alta temperatura.",
    "priority": "Alta",
    "userAssigned": "Promotor Maracay",
    "lastReview": "2024-11-05"
  },
  {
    "id": "FND-23",
    "code": "205223",
    "serial": "SR-FND-0207",
    "branch": "Maracay",
    "branchFull": "Sucursal — Maracay (Las Delicias)",
    "area": "Talento Humano (RRHH)",
    "brandModel": "Dell OptiPlex 3050",
    "processor": "Intel Core i3-6100",
    "ram": "4 GB DDR4",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Software",
    "diagnostics": "Infección de malware por descarga de programas no autorizados. Lentitud extrema.",
    "priority": "Media",
    "userAssigned": "Enlace RRHH Maracay",
    "lastReview": "2024-11-06"
  },
  {
    "id": "FND-24",
    "code": "205224",
    "serial": "SR-FND-0208",
    "branch": "Maracay",
    "branchFull": "Sucursal — Maracay (Las Delicias)",
    "area": "Finanzas y Administración",
    "brandModel": "HP ProDesk 400 G3",
    "processor": "Intel Core i3-6100",
    "ram": "4 GB DDR4",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Sin control",
    "diagnostics": "Equipo reubicado sin notificación en período de cuarentena. Falta ficha técnica.",
    "priority": "Media",
    "userAssigned": "Sin asignar (Cuarentena)",
    "lastReview": "2024-11-01"
  },
  {
    "id": "FND-25",
    "code": "205225",
    "serial": "SR-FND-0301",
    "branch": "Maracaibo",
    "branchFull": "Sucursal — Maracaibo (Av. 5 de Julio)",
    "area": "Operaciones y Planes Turísticos",
    "brandModel": "HP EliteDesk 800 G6",
    "processor": "Intel Core i7-10700",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Gestión de rutas turísticas de occidente activa y fluida.",
    "priority": "Normal",
    "userAssigned": "Coordinador Maracaibo",
    "lastReview": "2024-11-13"
  },
  {
    "id": "FND-26",
    "code": "205226",
    "serial": "SR-FND-0302",
    "branch": "Maracaibo",
    "branchFull": "Sucursal — Maracaibo (Av. 5 de Julio)",
    "area": "Finanzas y Administración",
    "brandModel": "Dell OptiPlex 7080",
    "processor": "Intel Core i5-10500",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Control contable regional perfecto. Antivirus institucional en verde.",
    "priority": "Normal",
    "userAssigned": "Administrador Maracaibo",
    "lastReview": "2024-11-15"
  },
  {
    "id": "FND-27",
    "code": "205227",
    "serial": "SR-FND-0303",
    "branch": "Maracaibo",
    "branchFull": "Sucursal — Maracaibo (Av. 5 de Julio)",
    "area": "Atención al Usuario",
    "brandModel": "Lenovo ThinkCentre M80q",
    "processor": "AMD Ryzen 7 4750GE",
    "ram": "16 GB DDR4",
    "storage": "SSD 240 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Atención al público en sede Zulia operando sin demora.",
    "priority": "Normal",
    "userAssigned": "Agente Zulia 1",
    "lastReview": "2024-11-11"
  },
  {
    "id": "FND-28",
    "code": "205228",
    "serial": "SR-FND-0304",
    "branch": "Maracaibo",
    "branchFull": "Sucursal — Maracaibo (Av. 5 de Julio)",
    "area": "Talento Humano (RRHH)",
    "brandModel": "HP ProDesk 400 G6",
    "processor": "Intel Core i3-10100",
    "ram": "8 GB DDR4",
    "storage": "SSD 240 GB SSD",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Trámites de personal regionales al día. Hardware en norma.",
    "priority": "Normal",
    "userAssigned": "Enlace RRHH Zulia",
    "lastReview": "2024-11-14"
  },
  {
    "id": "FND-29",
    "code": "205229",
    "serial": "SR-FND-0305",
    "branch": "Maracaibo",
    "branchFull": "Sucursal — Maracaibo (Av. 5 de Julio)",
    "area": "Atención al Usuario",
    "brandModel": "Dell Vostro 260",
    "processor": "Intel Pentium G630",
    "ram": "2 GB DDR3",
    "storage": "HDD 320 GB mecánico",
    "status": "Con falla",
    "failureType": "Obsoleto",
    "diagnostics": "Procesador Pentium obsoleto y 2GB RAM. Bloquea atención de solicitudes vacacionales.",
    "priority": "Alta",
    "userAssigned": "Agente Zulia 2",
    "lastReview": "2024-11-02"
  },
  {
    "id": "FND-30",
    "code": "205230",
    "serial": "SR-FND-0306",
    "branch": "Maracaibo",
    "branchFull": "Sucursal — Maracaibo (Av. 5 de Julio)",
    "area": "Operaciones y Planes Turísticos",
    "brandModel": "HP Pavilion 500",
    "processor": "Intel Core i3-4130",
    "ram": "4 GB DDR3",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Hardware",
    "diagnostics": "Batería agotada, falla en tarjeta madre e interrupciones térmicas por altas temperaturas.",
    "priority": "Alta",
    "userAssigned": "Guía Turístico Zulia",
    "lastReview": "2024-11-07"
  },
  {
    "id": "FND-31",
    "code": "205231",
    "serial": "SR-FND-0307",
    "branch": "Maracaibo",
    "branchFull": "Sucursal — Maracaibo (Av. 5 de Julio)",
    "area": "Tecnología (TI)",
    "brandModel": "Lenovo ThinkCentre E73",
    "processor": "Intel Core i3-4150",
    "ram": "4 GB DDR3",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Sin control",
    "diagnostics": "Equipo en cuarentena trasladado sin autorización previa ni registro formal.",
    "priority": "Media",
    "userAssigned": "Enlace TI Zulia",
    "lastReview": "2024-11-04"
  },
  {
    "id": "FND-32",
    "code": "205232",
    "serial": "SR-FND-0308",
    "branch": "Maracaibo",
    "branchFull": "Sucursal — Maracaibo (Av. 5 de Julio)",
    "area": "Finanzas y Administración",
    "brandModel": "Dell OptiPlex 3040",
    "processor": "Intel Core i3-6100",
    "ram": "4 GB DDR4",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Software",
    "diagnostics": "Instalación de paquetes de software no autorizado que consumen el 100% de CPU.",
    "priority": "Baja",
    "userAssigned": "Asistente Zulia",
    "lastReview": "2024-11-06"
  },
  {
    "id": "FND-33",
    "code": "205233",
    "serial": "SR-FND-0401",
    "branch": "Puerto La Cruz",
    "branchFull": "Sucursal — Puerto La Cruz (Paseo Colón)",
    "area": "Operaciones y Planes Turísticos",
    "brandModel": "Lenovo ThinkCentre M90q",
    "processor": "Intel Core i7-10700",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Plataforma de coordinación oriente/islas funcionando óptimamente.",
    "priority": "Normal",
    "userAssigned": "Coordinador Oriente",
    "lastReview": "2024-11-12"
  },
  {
    "id": "FND-34",
    "code": "205234",
    "serial": "SR-FND-0402",
    "branch": "Puerto La Cruz",
    "branchFull": "Sucursal — Puerto La Cruz (Paseo Colón)",
    "area": "Finanzas y Administración",
    "brandModel": "Dell OptiPlex 5080",
    "processor": "Intel Core i5-10500",
    "ram": "16 GB DDR4",
    "storage": "SSD 512 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Gestión financiera regional estable y comunicada vía GLPI/RustDesk.",
    "priority": "Normal",
    "userAssigned": "Administrador PLC",
    "lastReview": "2024-11-14"
  },
  {
    "id": "FND-35",
    "code": "205235",
    "serial": "SR-FND-0403",
    "branch": "Puerto La Cruz",
    "branchFull": "Sucursal — Puerto La Cruz (Paseo Colón)",
    "area": "Atención al Usuario",
    "brandModel": "HP ProDesk 400 G7",
    "processor": "AMD Ryzen 5 4600G",
    "ram": "8 GB DDR4",
    "storage": "SSD 240 GB NVMe",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Ventanilla de atención en Anzoátegui operativa sin fallas de velocidad.",
    "priority": "Normal",
    "userAssigned": "Agente PLC 1",
    "lastReview": "2024-11-15"
  },
  {
    "id": "FND-36",
    "code": "205236",
    "serial": "SR-FND-0404",
    "branch": "Puerto La Cruz",
    "branchFull": "Sucursal — Puerto La Cruz (Paseo Colón)",
    "area": "Talento Humano (RRHH)",
    "brandModel": "Dell OptiPlex 3080",
    "processor": "Intel Core i3-10100",
    "ram": "8 GB DDR4",
    "storage": "SSD 240 GB SSD",
    "status": "Sin fallas",
    "failureType": "Ninguna",
    "diagnostics": "Atención a trabajadores del oriente fluida y segura.",
    "priority": "Normal",
    "userAssigned": "Enlace RRHH PLC",
    "lastReview": "2024-11-10"
  },
  {
    "id": "FND-37",
    "code": "205237",
    "serial": "SR-FND-0405",
    "branch": "Puerto La Cruz",
    "branchFull": "Sucursal — Puerto La Cruz (Paseo Colón)",
    "area": "Atención al Usuario",
    "brandModel": "HP Compaq dx2400",
    "processor": "Intel Core 2 Duo E4600",
    "ram": "2 GB DDR2",
    "storage": "HDD 160 GB mecánico",
    "status": "Con falla",
    "failureType": "Obsoleto",
    "diagnostics": "Arquitectura arcaica de 2GB RAM con fallas físicas de lectura en disco mecánico.",
    "priority": "Alta",
    "userAssigned": "Agente PLC 2",
    "lastReview": "2024-11-01"
  },
  {
    "id": "FND-38",
    "code": "205238",
    "serial": "SR-FND-0406",
    "branch": "Puerto La Cruz",
    "branchFull": "Sucursal — Puerto La Cruz (Paseo Colón)",
    "area": "Operaciones y Planes Turísticos",
    "brandModel": "Lenovo ThinkCentre M73",
    "processor": "Intel Core i3-4130",
    "ram": "4 GB DDR3",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Hardware",
    "diagnostics": "Ventilador obstruido por salitre/ambiente marino. Apagado preventivo por calor.",
    "priority": "Alta",
    "userAssigned": "Promotor Oriente",
    "lastReview": "2024-11-05"
  },
  {
    "id": "FND-39",
    "code": "205239",
    "serial": "SR-FND-0407",
    "branch": "Puerto La Cruz",
    "branchFull": "Sucursal — Puerto La Cruz (Paseo Colón)",
    "area": "Finanzas y Administración",
    "brandModel": "Dell OptiPlex 3020",
    "processor": "Intel Core i3-4150",
    "ram": "4 GB DDR3",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Software",
    "diagnostics": "Modificación no autorizada de drivers de red. Pérdida intermitente de conectividad GLPI.",
    "priority": "Media",
    "userAssigned": "Asistente PLC",
    "lastReview": "2024-11-08"
  },
  {
    "id": "FND-40",
    "code": "205240",
    "serial": "SR-FND-0408",
    "branch": "Puerto La Cruz",
    "branchFull": "Sucursal — Puerto La Cruz (Paseo Colón)",
    "area": "Tecnología (TI)",
    "brandModel": "HP ProDesk 400 G1",
    "processor": "Intel Core i3-4130",
    "ram": "4 GB DDR3",
    "storage": "HDD 500 GB mecánico",
    "status": "Con falla",
    "failureType": "Sin control",
    "diagnostics": "Equipo desubicado durante pandemia sin hoja de trazabilidad técnica.",
    "priority": "Media",
    "userAssigned": "Enlace TI PLC",
    "lastReview": "2024-11-03"
  }
];

const INVENTORY_STATS = {
  "total": 40,
  "optimal": 22,
  "withFailures": 18,
  "byBranch": {
    "Caracas": 16,
    "Maracay": 8,
    "Maracaibo": 8,
    "Puerto La Cruz": 8
  },
  "byFailureType": {
    "Ninguna": 22,
    "Hardware": 5,
    "Software": 5,
    "Obsoleto": 4,
    "Sin control": 4
  },
  "byPriority": {
    "Normal": 22,
    "Alta": 9,
    "Media": 7,
    "Baja": 2
  }
};

  

class InventoryUI {
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

    const inventory = StorageManager.getInventory();
    const total = inventory.length || 40;
    const optimal = inventory.filter(e => e.status === 'Sin fallas').length;
    const faulty = inventory.filter(e => e.status === 'Con falla').length;
    const critical = inventory.filter(e => e.priority === 'Alta').length;

    const pctOp = Math.round((optimal / total) * 100);
    const pctFail = Math.round((faulty / total) * 100);
    const pctCrit = Math.round((critical / total) * 100);

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
        <div class="mt-2 text-[10px] text-emerald-300/80 bg-emerald-950/60 py-0.5 px-2 rounded-full inline-block">${pctOp}% Disponibilidad</div>
      </div>

      <div class="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 text-center relative overflow-hidden group hover:border-red-500/40 transition">
        <div class="absolute -right-4 -bottom-4 text-red-500/10 text-6xl group-hover:scale-110 transition"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <span class="block text-2xl sm:text-3xl font-black text-red-400 tracking-tight">${faulty}</span>
        <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Equipos Con Falla</span>
        <div class="mt-2 text-[10px] text-red-300/80 bg-red-950/60 py-0.5 px-2 rounded-full inline-block">Diagnóstico Crítico</div>
      </div>

      <div class="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 text-center relative overflow-hidden group hover:border-amber-500/40 transition">
        <div class="absolute -right-4 -bottom-4 text-amber-500/10 text-6xl group-hover:scale-110 transition"><i class="fa-solid fa-fire"></i></div>
        <span class="block text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">${critical}</span>
        <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Prioridad Crítica</span>
        <div class="mt-2 text-[10px] text-amber-300/80 bg-amber-950/60 py-0.5 px-2 rounded-full inline-block">Urgente Convenio</div>
      </div>
    `;

    const elOpN = document.getElementById('dash-n-op');
    const elOpPct = document.getElementById('dash-pct-op');
    const elOpBar = document.getElementById('dash-bar-op');
    if (elOpN) elOpN.textContent = optimal;
    if (elOpPct) elOpPct.textContent = `${pctOp}%`;
    if (elOpBar) elOpBar.style.width = `${pctOp}%`;

    const elFailN = document.getElementById('dash-n-fail');
    const elFailPct = document.getElementById('dash-pct-fail');
    const elFailBar = document.getElementById('dash-bar-fail');
    if (elFailN) elFailN.textContent = faulty;
    if (elFailPct) elFailPct.textContent = `${pctFail}%`;
    if (elFailBar) elFailBar.style.width = `${pctFail}%`;

    const elCritN = document.getElementById('dash-n-crit');
    const elCritPct = document.getElementById('dash-pct-crit');
    const elCritBar = document.getElementById('dash-bar-crit');
    if (elCritN) elCritN.textContent = critical;
    if (elCritPct) elCritPct.textContent = `${pctCrit}%`;
    if (elCritBar) elCritBar.style.width = `${pctCrit}%`;
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
    let list = [...StorageManager.getInventory()];

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
    const allData = StorageManager.getInventory();
    if (countBadge) countBadge.textContent = `${data.length} de ${allData.length} equipos`;

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
          <td class="py-3.5 px-4 font-mono font-bold text-sky-300 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded bg-slate-800/90 text-slate-300 flex items-center justify-center text-[10px] font-bold">${item.id.replace('FND-', '')}</span>
              <span>${item.id}</span>
            </div>
            <span class="text-[10px] text-slate-500 font-normal block pl-8">Cód. ${item.code}</span>
          </td>

          <td class="py-3.5 px-4">
            <div class="font-semibold text-slate-200 flex items-center gap-1.5">
              <i class="${branchIcons[item.branch] || 'fa-solid fa-location-dot text-slate-400'} text-[11px]"></i>
              <span>${item.branch}</span>
            </div>
            <span class="text-[11px] text-slate-400 block">${item.area}</span>
          </td>

          <td class="py-3.5 px-4">
            <span class="font-bold text-slate-100 block truncate max-w-[180px]">${item.brandModel}</span>
            <span class="text-[11px] text-slate-400 block truncate max-w-[200px]">${item.processor}</span>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-sky-300 border border-slate-700/60">${item.ram}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">${item.storage}</span>
            </div>
          </td>

          <td class="py-3.5 px-4 whitespace-nowrap">
            ${statusBadge}
          </td>

          <td class="py-3.5 px-4 text-slate-300 max-w-xs">
            <p class="line-clamp-2 leading-relaxed text-[11.5px]">${item.diagnostics}</p>
            <span class="text-[10px] text-slate-500 mt-1 block">Custodio: <strong class="text-slate-400 font-medium">${item.userAssigned}</strong></span>
          </td>

          <td class="py-3.5 px-4 whitespace-nowrap text-center">
            ${priorityBadge}
          </td>

          <td class="py-3.5 px-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-1.5">
              <button 
                onclick="window.inventoryUI.openEquipmentModal('${item.id}')"
                class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 shadow-sm"
                title="Ver ficha técnica completa del equipo"
              >
                <i class="fa-solid fa-eye text-[11px]"></i>
                <span class="hidden sm:inline">Detalle</span>
              </button>
              ${AuthManager.isAdmin() ? `
              <button 
                onclick="window.inventoryUI.openEquipmentFormModal('${item.id}')"
                class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 shadow-sm"
                title="Editar datos del equipo"
              >
                <i class="fa-solid fa-pen-to-square text-[11px]"></i>
              </button>
              <button 
                onclick="window.inventoryUI.confirmDeleteEquipment('${item.id}')"
                class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 shadow-sm"
                title="Eliminar equipo"
              >
                <i class="fa-solid fa-trash-can text-[11px]"></i>
              </button>` : ''}
            </div>
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

    const eqForm = document.getElementById('equipment-form');
    if (eqForm) {
      eqForm.addEventListener('submit', (e) => this.handleEquipmentFormSubmit(e));
    }
  }

  static openEquipmentModal(id) {
    const item = StorageManager.getInventory().find(e => e.id === id);
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
        : `<span class="px-3 py-1 rounded-full bg-red-950 border border-red-800 text-red-300 font-bold text-xs"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i> Con Falla (${item.failureType || 'Requiere Atención'})</span>`;
    }

    const priorityEl = document.getElementById('eq-modal-priority');
    if (priorityEl) {
      const pColor = item.priority === 'Alta' ? 'text-red-400 bg-red-950/80 border-red-800' : 'text-slate-300 bg-slate-900 border-slate-700';
      priorityEl.innerHTML = `<span class="px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${pColor}">Prioridad: ${item.priority}</span>`;
    }

    const recEl = document.getElementById('eq-modal-recommendation');
    if (recEl) {
      recEl.innerHTML = isOptimal
        ? `<div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-xs">
             <strong>Recomendación Técnica:</strong> Mantener en producción. Continuar con plan de monitoreo preventivo y actualización de parches vía soporte centralizado de TI.
           </div>`
        : `<div class="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs">
             <strong>Acción Requerida (Convenio Privado):</strong> Este equipo forma parte del lote de 18 máquinas críticas. Priorizar para dotación y reemplazo inmediato por el convenio firmado por la Presidencia.
           </div>`;
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  static closeEquipmentModal() {
    const modal = document.getElementById('equipment-detail-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 250);
    }
    document.body.style.overflow = '';
  }

  static openEquipmentFormModal(id = null) {
    if (!AuthManager.isAdmin()) {
      UIManager.showToast('Debes iniciar sesión como Administrador para agregar o editar equipos.', 'warning');
      UIManager.openLoginModal();
      return;
    }

    const modal = document.getElementById('equipment-form-modal');
    if (!modal) return;

    const titleEl = document.getElementById('modal-eq-form-title');
    const form = document.getElementById('equipment-form');
    if (form) form.reset();

    if (id) {
      const item = StorageManager.getInventory().find(e => e.id === id);
      if (item) {
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-sky-400 mr-2"></i> Editar Equipo: ${item.id}`;
        document.getElementById('form-eq-id').value = item.id;
        document.getElementById('form-eq-code').value = item.code || '';
        document.getElementById('form-eq-serial').value = item.serial || '';
        document.getElementById('form-eq-branch').value = item.branch || 'Caracas';
        document.getElementById('form-eq-area').value = item.area || 'Tecnología';
        document.getElementById('form-eq-brand').value = item.brandModel || '';
        document.getElementById('form-eq-cpu').value = item.processor || '';
        document.getElementById('form-eq-ram').value = item.ram || '';
        document.getElementById('form-eq-storage').value = item.storage || '';
        document.getElementById('form-eq-user').value = item.userAssigned || '';
        document.getElementById('form-eq-status').value = item.status || 'Sin fallas';
        document.getElementById('form-eq-priority').value = item.priority || 'Normal';
        document.getElementById('form-eq-review').value = item.lastReview || '';
        document.getElementById('form-eq-diag').value = item.diagnostics || '';
      }
    } else {
      if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-plus text-sky-400 mr-2"></i> Registrar Nuevo Equipo`;
      document.getElementById('form-eq-id').value = '';
      document.getElementById('form-eq-status').value = 'Sin fallas';
      document.getElementById('form-eq-priority').value = 'Normal';
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  static closeEquipmentFormModal() {
    const modal = document.getElementById('equipment-form-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 250);
    }
    document.body.style.overflow = '';
  }

  static handleEquipmentFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const id = document.getElementById('form-eq-id').value.trim();
    const code = document.getElementById('form-eq-code').value.trim() || 'N/A';
    const serial = document.getElementById('form-eq-serial').value.trim() || 'S/N';
    const branch = document.getElementById('form-eq-branch').value;
    const branchMap = {
      'Caracas': 'Sede Principal Caracas (Torre Este)',
      'Maracay': 'Sucursal Maracay (Centro de Operaciones)',
      'Maracaibo': 'Sucursal Maracaibo (Occidente)',
      'Puerto La Cruz': 'Sucursal Puerto La Cruz (Oriente)'
    };
    const branchFull = branchMap[branch] || branch;
    const area = document.getElementById('form-eq-area').value.trim() || 'Tecnología';
    const brandModel = document.getElementById('form-eq-brand').value.trim() || 'Genérico';
    const processor = document.getElementById('form-eq-cpu').value.trim() || 'Procesador Estándar';
    const ram = document.getElementById('form-eq-ram').value.trim() || '8 GB DDR4';
    const storage = document.getElementById('form-eq-storage').value.trim() || '256 GB SSD';
    const status = document.getElementById('form-eq-status').value;
    const failureType = document.getElementById('form-eq-failure').value.trim() || (status === 'Sin fallas' ? 'Ninguna' : 'Falla de hardware');
    const priority = document.getElementById('form-eq-priority').value;
    const userAssigned = document.getElementById('form-eq-user').value.trim() || 'Personal de Operaciones';
    const diagnostics = document.getElementById('form-eq-diag').value.trim() || 'Equipo registrado en el sistema.';
    const lastReview = new Date().toISOString().slice(0, 10);

    const payload = {
      id: id || undefined,
      code,
      serial,
      branch,
      branchFull,
      area,
      brandModel,
      processor,
      ram,
      storage,
      status,
      failureType,
      priority,
      userAssigned,
      diagnostics,
      lastReview
    };

    StorageManager.upsertEquipment(payload);
    this.closeEquipmentFormModal();
    this.renderStats();
    this.renderFilters();
    this.renderTable();
    UIManager.showToast(id ? "Equipo actualizado exitosamente en la base de datos." : "Nuevo equipo registrado exitosamente.", "success");
  }

  static confirmDeleteEquipment(id) {
    if (!AuthManager.isAdmin()) {
      UIManager.showToast('Debes iniciar sesión como Administrador para eliminar equipos.', 'warning');
      UIManager.openLoginModal();
      return;
    }
    if (confirm(`¿Estás seguro de eliminar el equipo "${id}" de la base de datos del inventario?`)) {
      StorageManager.deleteEquipment(id);
      this.renderStats();
      this.renderFilters();
      this.renderTable();
      UIManager.showToast(`Equipo ${id} eliminado del inventario.`, "info");
    }
  }

  static exportCSV() {
    const headers = ["ID", "Codigo", "Serial", "Sede", "Area", "Marca_Modelo", "Procesador", "RAM", "Almacenamiento", "Estado", "Tipo_Falla", "Prioridad", "Usuario", "Ultima_Revision", "Diagnostico"];
    const rows = StorageManager.getInventory().map(i => [
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

  
  // Visibilidad de controles según rol de usuario

class AuthManager {
  static listeners = [];

  static isAdmin() {
    return localStorage.getItem(CONFIG.auth.sessionStorageKey) === 'true';
  }

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

  static logout() {
    localStorage.removeItem(CONFIG.auth.sessionStorageKey);
    this.notifyListeners(false);
  }

  static subscribe(callback) {
    this.listeners.push(callback);
  }

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

  

class UIManager {
  static currentFilter = 'all';
  static searchQuery = '';
  static activeEditingSessionId = null;

  static init() {
    this.renderHeaderAndHero();
    this.renderFilterPills();
    this.renderSessions();
    this.renderTeam();
    this.updateStats();
    this.updateAdminUI(AuthManager.isAdmin());
    this.setupEventListeners();
  }

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

  static renderSessions() {
    const container = document.getElementById('sessions-container');
    if (!container) return;

    let sessions = StorageManager.getSessions();

    if (this.currentFilter !== 'all') {
      sessions = sessions.filter(s => s.phase.toLowerCase() === this.currentFilter.toLowerCase());
    }

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

  static updateAdminUI(isAdmin) {
      const adminBanner = document.getElementById('admin-floating-banner');
      const loginBtn = document.getElementById('btn-nav-login');
      const btnAddStudent = document.getElementById('btn-add-student');
      const btnAddJury = document.getElementById('btn-add-jury');
      const btnTestDriveNav = document.getElementById('btn-test-drive-nav');
      const btnTestDriveGuide = document.getElementById('btn-test-drive-guide');

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

      if (btnTestDriveNav) {
        if (isAdmin) {
          btnTestDriveNav.classList.remove('hidden');
          btnTestDriveNav.classList.add('sm:inline-flex');
        } else {
          btnTestDriveNav.classList.add('hidden');
          btnTestDriveNav.classList.remove('sm:inline-flex', 'inline-flex');
        }
      }

    if (btnTestDriveGuide) {
      if (isAdmin) {
        btnTestDriveGuide.classList.remove('hidden');
        btnTestDriveGuide.classList.add('inline-flex');
      } else {
        btnTestDriveGuide.classList.add('hidden');
        btnTestDriveGuide.classList.remove('inline-flex');
      }
    }

    this.renderSessions();
    this.renderTeam();
    this.renderFilterPills();
  }

  // Visor modal para archivos de Google Drive
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
      this.updateAdminUI(false);
      this.renderTeam();
      this.renderSessions();
      if (window.inventoryUI) window.inventoryUI.renderTable();
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
      this.updateAdminUI(true);
      this.renderTeam();
      this.renderSessions();
      if (window.inventoryUI) window.inventoryUI.renderTable();
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

  static setupEventListeners() {

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderSessions();
      });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));

    const sessionForm = document.getElementById('session-editor-form');
    if (sessionForm) sessionForm.addEventListener('submit', (e) => this.handleSessionFormSubmit(e));

    const studentForm = document.getElementById('student-form');
    if (studentForm) studentForm.addEventListener('submit', (e) => this.handleStudentSubmit(e));

    const juryForm = document.getElementById('jury-form');
    if (juryForm) juryForm.addEventListener('submit', (e) => this.handleJurySubmit(e));

    // Cierre de modales mediante la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeViewer();
        this.closeLoginModal();
        this.closeSessionModal();
        this.closeStudentModal();
        this.closeJuryModal();
        if (window.inventoryUI) {
          window.inventoryUI.closeEquipmentModal();
          window.inventoryUI.closeEquipmentFormModal();
        }
      }
    });

    AuthManager.subscribe((isAdmin) => {
      this.updateAdminUI(isAdmin);
    });
  }
}

  
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
    filterByPhase: (phase) => UIManager.filterByPhase(phase),

      openStudentModal: (id) => UIManager.openStudentModal(id),
    closeStudentModal: () => UIManager.closeStudentModal(),
    confirmDeleteStudent: (id) => UIManager.confirmDeleteStudent(id),

      openJuryModal: (id) => UIManager.openJuryModal(id),
    closeJuryModal: () => UIManager.closeJuryModal(),
    confirmDeleteJury: (id) => UIManager.confirmDeleteJury(id),

      testDriveUrl: () => {
      if (!AuthManager.isAdmin()) {
        UIManager.showToast("🔒 Acción restringida: Debes iniciar sesión como Docente o Administrador para probar enlaces.", "warning");
        UIManager.openLoginModal();
        return;
      }
      const input = prompt("Introduce un enlace de Google Drive para validar el ID y formato de incrustación:");
      if (!input) return;
      const id = DriveHelper.extractId(input);
      if (id) {
        const embed = DriveHelper.getEmbedUrl(input);
        const download = DriveHelper.getDownloadUrl(input);
        alert(`✅ Enlace Válido de Google Drive Detectado:\n\nID: ${id}\nURL de Incrustación: ${embed}\nURL de Descarga Directa: ${download}`);
      } else {
        alert("❌ No se pudo extraer un ID válido de Google Drive de esa URL.");
      }
    }
  };

  window.inventoryUI = InventoryUI;
  window.fundaturInfo = FUNDATUR_INFO;
  window.storageManager = StorageManager;

  
  class NavigationManager {
    static sections = [
      'institucional',
      'inventario',
      'soporte-glpi',
      'sesiones',
      'equipo'
    ];

    static currentSection = 'institucional';

    static init() {
          window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (this.sections.includes(hash)) {
          this.switchSection(hash, false);
        }
      });

          const initialHash = window.location.hash.replace('#', '');
      const defaultSection = this.sections.includes(initialHash) ? initialHash : 'institucional';
      this.switchSection(defaultSection, false);
    }

    static switchSection(targetId, updateHash = true) {
      if (!this.sections.includes(targetId)) return;
      this.currentSection = targetId;

    
      const bannerEl = document.getElementById('banner-section');
      const heroEl = document.getElementById('hero');
      const instEl = document.getElementById('institucional');

      if (targetId === 'institucional') {
        if (bannerEl) bannerEl.classList.remove('hidden');
        if (heroEl) heroEl.classList.remove('hidden');
        if (instEl) instEl.classList.remove('hidden');
      } else {
        if (bannerEl) bannerEl.classList.add('hidden');
        if (heroEl) heroEl.classList.add('hidden');
        if (instEl) instEl.classList.add('hidden');
      }

      this.sections.forEach(secId => {
        if (secId === 'institucional') return;
        const el = document.getElementById(secId);
        if (el) {
          if (secId === targetId) {
            el.classList.remove('hidden');
          } else {
            el.classList.add('hidden');
          }
        }
      });

      const driveEl = document.getElementById('drive-guide');
      if (driveEl) {
        if (targetId === 'sesiones') {
          driveEl.classList.remove('hidden');
        } else {
          driveEl.classList.add('hidden');
        }
      }

          document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        const btnTarget = btn.getAttribute('data-section');
        const isMobile = btn.classList.contains('shrink-0');
        const padClass = isMobile ? 'px-3 py-1.5 rounded-lg' : 'px-3 py-1.5 rounded-xl';

        if (btnTarget === targetId) {
          btn.className = `nav-tab-btn ${isMobile ? 'shrink-0 ' : ''}${padClass} transition flex items-center gap-1.5 bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm shadow-sky-500/20 font-bold`;
        } else {
          btn.className = `nav-tab-btn ${isMobile ? 'shrink-0 ' : ''}${padClass} transition flex items-center gap-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent font-medium`;
        }
      });

          if (updateHash) {
        window.history.replaceState(null, null, `#${targetId}`);
      }

          if (targetId === 'inventario' && window.inventoryUI) {
        window.inventoryUI.renderStats();
        window.inventoryUI.renderTable();
      }

          window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  window.navManager = NavigationManager;

  document.addEventListener('DOMContentLoaded', () => {
    UIManager.init();
    InventoryUI.init();
    NavigationManager.init();

    if (window.FirebaseSync) {
      window.FirebaseSync.init({
        getSeedData: () => ({
          sessions: StorageManager.getSessions(),
          team: StorageManager.getTeam(),
          inventory: StorageManager.getInventory()
        }),
        onRemoteData: (data) => {
          if (Array.isArray(data.sessions)) {
            StorageManager.saveSessions(data.sessions, true);
            UIManager.renderFilterPills();
            UIManager.renderSessions();
            UIManager.updateStats();
            UIManager.renderTimelineView();
          }
          if (data.team && typeof data.team === 'object') {
            StorageManager.saveTeam(data.team, true);
            UIManager.renderTeam();
          }
          if (Array.isArray(data.inventory)) {
            StorageManager.saveInventory(data.inventory, true);
            InventoryUI.renderStats();
            InventoryUI.renderTable();
          }
        }
      });
    }

        const trayectoEl = document.getElementById('config-trayecto');
    const periodEl   = document.getElementById('config-period');
    const tutorEl    = document.getElementById('config-tutor');
    if (trayectoEl) trayectoEl.textContent = CONFIG.institution.trayecto || '—';
    if (periodEl)   periodEl.textContent   = CONFIG.institution.academicPeriod || '—';
    if (tutorEl)    tutorEl.textContent    = CONFIG.institution.tutor || '—';

    console.log(`[FUNDATUR / UNETI] Plataforma "${CONFIG.institution.subject}" iniciada con éxito.`);
  });

})();
