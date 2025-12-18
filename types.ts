
export enum Step {
  LOGIN,
  WELCOME,
  LOCATION,
  PHOTO,
  TYPE,
  DETAILS,
  REVIEW,
  SUCCESS,
  HISTORY
}

export interface GeminiResponse {
  validacion: 'EXITO' | 'FALLIDA';
  mensaje_usuario: string;
  diagnostico_ia: string;
  solucion_propuesta: string;
  codigo_programa: string;
  requiere_seguimiento: 'SI' | 'NO';
  nivel_urgencia: 1 | 2 | 3 | 4 | 5; // 1: Bajo, 5: Crítico
  analisis_daño_potencial: string;   // Descripción del riesgo si no se actúa
}

export interface SavedReport {
  id: string;
  timestamp: string;
  type: string;
  address: string;
  coordinates: string; // "lat, lng"
  description: string;
  aiResponse: GeminiResponse;
  photo: string | null;
  fotoUrl?: string; // URL pública en Supabase Storage
  status: 'PENDIENTE' | 'VALIDADO' | 'MANUAL';
  synced?: boolean;
  technician: string;
}

export interface IncidentData {
  location: {
    address: string;
    lat: number;
    lng: number;
    district: string;
  };
  photo: string | null;
  type: string;
  description: string;
  isUrgent: boolean;
  isDangerous: boolean;
  aiValidation?: GeminiResponse;
  technician: string;
}

export const DISTRICTS_Z2 = ["Arganzuela", "Retiro", "Salamanca", "Chamartín"];
export const DISTRICTS_Z3 = ["Fuencarral-El Pardo", "Latina", "Moncloa-Aravaca"];
