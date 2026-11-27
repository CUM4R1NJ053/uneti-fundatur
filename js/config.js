// Configuración global

export const CONFIG = {
  institution: {
    name: "FUNDATUR SOCIAL (Fundación Nacional para el Turismo Social y Recreativo de Venezuela)",
    shortName: "FUNDATUR SOCIAL",
    slogan: "Tu descanso es nuestro destino: turismo accesible para quienes mueven el país.",
    university: "Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI)",
    acronym: "FUNDATUR / UNETI",
    subject: "Diagnóstico Tecnológico e Infraestructura de TI • Proyecto Socio Tecnológico",
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

  // Credenciales por defecto
  auth: {
    defaultUser: "admin",
    defaultPass: "uneti2025",
    sessionStorageKey: "uneti_admin_session"
  },

  // Mapeo de recursos
  resourceTypes: {
    video: { label: "Video Demostrativo", icon: "fa-solid fa-play", color: "text-red-400 bg-red-950/40 border-red-800/50" },
    pdf: { label: "Informe / Documento PDF", icon: "fa-solid fa-file-pdf", color: "text-amber-400 bg-amber-950/40 border-amber-800/50" },
    presentation: { label: "Presentación (Slides)", icon: "fa-solid fa-file-powerpoint", color: "text-orange-400 bg-orange-950/40 border-orange-800/50" },
    image: { label: "Evidencia Fotográfica", icon: "fa-solid fa-image", color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50" },
    sheet: { label: "Matriz / Datos Financieros", icon: "fa-solid fa-file-excel", color: "text-green-400 bg-green-950/40 border-green-800/50" },
    drive: { label: "Recurso Google Drive", icon: "fa-brands fa-google-drive", color: "text-sky-400 bg-sky-950/40 border-sky-800/50" }
  }
};
