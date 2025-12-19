import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, IncidentData, DISTRICTS_Z2 } from "../types";

const SYSTEM_INSTRUCTION = `
Rol: Eres un Inspector Senior de Infraestructura Verde del Ayuntamiento de Madrid.
Tu misión es validar incidencias reportadas por técnicos de campo.

CRITERIOS DE VALIDACIÓN:
1. PRIORIDAD TÉCNICA: Si el técnico describe una incidencia específica (ej: "nidos de procesionaria", "fuga en goteo") y la imagen muestra el entorno correcto de una zona verde, debes ser propenso a la validación EXITOSA, incluso si la incidencia es difícil de ver a simple vista en la foto.
2. FALLO DE VALIDACIÓN: Solo marcarás "FALLIDA" si la imagen es totalmente ajena al reporte (ej: foto de un interior, un selfie, o imagen totalmente negra/borrosa que impida ver el activo verde).
3. DIAGNÓSTICO: Proporciona un análisis profesional basado en la patología vegetal o hidráulica detectada.
4. SOLUCIÓN: Propón una actuación concreta basada en los Pliegos de Mantenimiento de Madrid.

REQUERIMIENTO: Responde EXCLUSIVAMENTE en formato JSON. No incluyas texto fuera del bloque JSON.
`;

export const analyzeIncident = async (data: IncidentData): Promise<GeminiResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY no configurada");

  const ai = new GoogleGenAI({ apiKey });
  const zone = DISTRICTS_Z2.includes(data.location.district) ? "Z2" : "Z3";

  const prompt = `
    INFORME DEL TÉCNICO:
    - Distrito: ${data.location.district} (Zona ${zone})
    - Tipo reportado: ${data.type}
    - Descripción: "${data.description}"
    - Urgencia percibida: ${data.isUrgent ? 'ALTA' : 'NORMAL'}

    TAREA: Analiza la imagen adjunta. Si coincide mínimamente con el contexto de la descripción, marca validacion="EXITO". Si no tiene nada que ver, marca validacion="FALLIDA".
  `;

  if (!data.photo) throw new Error("No photo provided");

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: data.photo.split(',')[1],
    },
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          validacion: { 
            type: Type.STRING, 
            description: "Debe ser 'EXITO' o 'FALLIDA'" 
          },
          mensaje_usuario: { type: Type.STRING },
          diagnostico_ia: { type: Type.STRING },
          solucion_propuesta: { type: Type.STRING },
          codigo_programa: { type: Type.STRING },
          requiere_seguimiento: { type: Type.STRING },
          nivel_urgencia: { type: Type.INTEGER },
          analisis_daño_potencial: { type: Type.STRING }
        },
        required: ["validacion", "mensaje_usuario", "diagnostico_ia", "solucion_propuesta", "codigo_programa"]
      }
    },
  });

  const text = response.text;
  if (!text) throw new Error("Respuesta vacía de la API");
  return JSON.parse(text) as GeminiResponse;
};

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; district: string } | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Coordenadas (lat, lng) y distrito para: "${address}". Responde únicamente con JSON: {"lat": 40.41, "lng": -3.70, "distrito": "Nombre"}`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        lat: Number(data.lat),
        lng: Number(data.lng),
        district: data.distrito || 'Madrid'
      };
    }
    return null;
  } catch (error) {
    console.error("[GEOCODE] Error:", error);
    return null;
  }
};