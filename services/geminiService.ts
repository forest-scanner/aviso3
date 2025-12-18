import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, IncidentData, DISTRICTS_Z2 } from "../types";

const SYSTEM_INSTRUCTION = `
Rol: Actúas como un Técnico Superior de Gestión de Infraestructura Verde Urbana para la aplicación "Avisos Valoriza". Tu objetivo es validar imágenes de incidencias, proponer soluciones técnicas y clasificar la actuación dentro del programa de mantenimiento correcto (Z2 o Z3).

Tarea 1: Validación de Imagen (Filtro de Calidad)
Analiza la fotografía subida por el usuario. Determina si la imagen muestra realmente lo que el usuario describe. Si la imagen es borrosa o no tiene relación, responde: VALIDACIÓN: FALLIDA.

Tarea 2: Diagnóstico y Solución
Identifica la patología y propón la solución técnica adecuada.

Tarea 3: Clasificación por Programa (Z2 / Z3)
Según el distrito, aplica el prefijo correspondiente (Z2 o Z3) y busca la coincidencia en la lista oficial.

REQUERIMIENTO: Responde EXCLUSIVAMENTE en formato JSON conforme al esquema proporcionado.
`;

export const analyzeIncident = async (data: IncidentData): Promise<GeminiResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY no configurada");

  const ai = new GoogleGenAI({ apiKey });
  const zone = DISTRICTS_Z2.includes(data.location.district) ? "Z2" : "Z3";

  const prompt = `
    Analiza esta imagen. El usuario está en el distrito ${data.location.district} (${zone}). 
    Descripción: '${data.description}'. 
    Valida la incidencia y asígnale el código de programa ${zone} correcto.
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
          validacion: { type: Type.STRING },
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
      model: "gemini-2.5-flash-native-audio-preview-09-2025",
      contents: `Proporciona las coordenadas (lat, lng) y el distrito de Madrid para la dirección: "${address}". Responde únicamente con un objeto JSON: {"lat": 0.0, "lng": 0.0, "distrito": "Nombre"}`,
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
    console.error("[GEOCODE] Error crítico:", error);
    return null;
  }
};