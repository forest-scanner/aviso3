
export const MAINTENANCE_PROGRAMS = [
  "Z3_ESCARDA_FLOR_2026",
  "Z3_DESBROCE_FORESTAL_2026",
  "Z3_PODA_VIVACES_2026",
  "Z3_PODA_SETOS_2026",
  "Z3_PODA_ARBUSTOS_2026",
  "Z3_PLANTACION_VIVACES_2026",
  "Z3_PLANTACION_ARBUSTOS_2026",
  "Z3_PLANTACION_FLOR_2026",
  "Z3_AIREADO_CESPED_2026",
  "Z3_RESIEMBRA_CESPED_2026",
  "Z3_RENOVACION_CESPED_2026",
  "Z3_PLANTACION_ARBOLES_ADICIONALES_2024_2026",
  "Z3_PLANTACION_ARBOLES_ADICIONALES_V2_2024_2026",
  "Z3_PODA_ARBOLES_2025_2026",
  "Z3_PLANTACION_ARBOLES_2025_2026",
  "Z3_ABONO_ORGANICO_CESPED_2026",
  "Z3_ACONDICIONAMIENTO_TERRIZOS_2026",
  "Z3_ARBORICULTURA_2026",
  "Z3_ENTRECAVA_ARBOLES_ALCORQUE_2026",
  "Z3_ENTRECAVA_ARBUSTOS_2026",
  "Z3_ENTRECAVA_FLOR_2026",
  "Z3_ENTRECAVA_FLOR_SINGULAR_2026",
  "Z3_ENTRECAVA_VIVACES_2026",
  "Z3_ESCARDA_ALCORQUE_2026",
  "Z3_ESCARDA_ARBUSTOS_2026",
  "Z3_ESCARDA_TERRIZOS_2026",
  "Z3_ESCARDA_VIVACES_2026",
  "Z3_LIMPIEZA_DRENAJE_2026",
  "Z3_PERFILADO_CESPED_2026",
  "Z3_PLANTACION_FLOR_SINGULAR_2026",
  "Z3_RECEBO_TERRIZOS_2026"
];

export const INCIDENT_TYPES = [
  { 
    id: 'riego', 
    title: 'Red de Riego', 
    subtitle: 'Fugas, aspersores rotos, inundación o falta de agua', 
    icon: 'water_drop', 
    color: 'bg-cyan-100 text-cyan-700' 
  },
  { 
    id: 'hierba', 
    title: 'Exceso de hierba', 
    subtitle: 'Programas de Desbroce Forestal', 
    icon: 'grass', 
    color: 'bg-green-100 text-green-700' 
  },
  { 
    id: 'arbolado_peligroso', 
    title: 'Arbolado peligroso', 
    subtitle: 'Riesgo de caída, ramas rotas o arboricultura', 
    icon: 'warning', 
    color: 'bg-red-100 text-red-700' 
  },
  { 
    id: 'cesped_mal', 
    title: 'Césped en mal estado', 
    subtitle: 'Necesidad de renovación o resiembra', 
    icon: 'terrain', 
    color: 'bg-yellow-100 text-yellow-700' 
  },
  { 
    id: 'carcavas', 
    title: 'Presencia de cárcavas', 
    subtitle: 'Acondicionamiento de terrizos', 
    icon: 'landscape', 
    color: 'bg-amber-100 text-amber-700' 
  },
  { 
    id: 'marras', 
    title: 'Presencia de Marras', 
    subtitle: 'Faltas en árboles o arbustos', 
    icon: 'nature_people', 
    color: 'bg-emerald-100 text-emerald-700' 
  },
  { 
    id: 'limpieza_basura', 
    title: 'Basura / Papeleras', 
    subtitle: 'Papeleras llenas o residuos en zona', 
    icon: 'delete_sweep', 
    color: 'bg-gray-100 text-gray-700' 
  },
  { 
    id: 'plagas', 
    title: 'Plagas y Vectores', 
    subtitle: 'Procesionaria, pulgón o roedores', 
    icon: 'pest_control', 
    color: 'bg-orange-100 text-orange-700' 
  }
];
