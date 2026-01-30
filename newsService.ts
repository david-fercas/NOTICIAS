
import { GoogleGenAI, Type } from "@google/genai";
import { Category, NewsItem, WeatherInfo } from "./types";

const NEWS_PROMPT = `
Actúa como un Analista de Medios de élite. Tu misión es generar un informe informativo real y verificado para HOY (${new Date().toLocaleDateString('es-ES')}).

CATEORÍAS REQUERIDAS:
1. Mundo: Geopolítica global.
2. España: Política y sociedad nacional.
3. León & Provincia: Incluye noticias de la capital, El Bierzo, deportes (Cultural, Ademar) y cultura leonesa.
4. Deportes: Fútbol, F1 y polideportivo.
5. Cultura/Sociedad: Ciencia y tendencias.

METEOROLOGÍA: Previsión exacta para la ciudad de León.

REGLAS DE FORMATO (ESTRICTAS):
- Las fuentes DEBEN ser URLs completas que empiecen por http:// o https://.
- Usa medios fiables (El País, RTVE, Diario de León, Leonoticias, etc.).
- Proporciona entre 3 y 5 noticias por categoría.
- El campo "veracityScore" debe ser 'verified' solo si la noticia está en múltiples medios.
- Responde exclusivamente en JSON.
`;

export async function fetchDailyData(): Promise<{ news: NewsItem[]; weather: WeatherInfo }> {
  // Inicialización dentro de la función para mayor robustez en entornos de despliegue
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: NEWS_PROMPT,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            news: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  sources: { type: Type.ARRAY, items: { type: Type.STRING } },
                  veracityScore: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ["title", "summary", "sources", "veracityScore", "category"]
              }
            },
            weather: {
              type: Type.OBJECT,
              properties: {
                temperature: { type: Type.STRING },
                condition: { type: Type.STRING },
                forecast: { type: Type.STRING },
                humidity: { type: Type.STRING },
                wind: { type: Type.STRING }
              },
              required: ["temperature", "condition", "forecast", "humidity", "wind"]
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || '{"news": [], "weather": {}}');
    const news = (json.news || []).map((item: any, index: number) => ({
      ...item,
      id: `news-${index}-${Date.now()}`,
      timestamp: new Date().toISOString()
    }));

    return { news, weather: json.weather };
  } catch (error) {
    console.error("Error crítico en servicio de noticias:", error);
    throw error;
  }
}
