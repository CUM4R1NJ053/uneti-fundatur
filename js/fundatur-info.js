/**
 * Información institucional y diagnóstico tecnológico de FUNDATUR SOCIAL
 * Módulo ES6
 */

export const FUNDATUR_INFO = {
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
