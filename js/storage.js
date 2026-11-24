/**
 * FUNDATUR SOCIAL & UNETI - PROYECTO SOCIOECONÓMICO
 * Módulo de Almacenamiento, Persistencia y Gestión de Sesiones Didácticas
 */

const STORAGE_KEY = 'fundatur_uneti_socioeconomico_sessions_v3';
const TEAM_STORAGE_KEY = 'fundatur_uneti_socioeconomico_team_v3';
const INVENTORY_STORAGE_KEY = 'fundatur_uneti_inventory_v3';

export const INITIAL_TEAM = {
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

export const INITIAL_SESSIONS = [
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

export class StorageManager {
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

  static saveSessions(sessions) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
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

  static resetSessions() {
    this.saveSessions(INITIAL_SESSIONS);
    this.saveTeam(INITIAL_TEAM);
    return true;
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

  static saveTeam(teamData) {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));
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

  // ==========================================
  // INVENTARIO DINÁMICO DE EQUIPOS (CRUD)
  // ==========================================
  static getInventory() {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return [];
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("[StorageManager] Error leyendo inventario:", e);
      return [];
    }
  }

  static saveInventory(items) {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
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
    const idx = inventory.findIndex(e => e.id.toLowerCase() === item.id.toLowerCase());
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

  static resetInventory(initialData = []) {
    this.saveInventory(initialData);
    return initialData;
  }
}
