
import { GoogleGenAI, Type } from "@google/genai";
import { Category, NewsItem, WeatherInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NEWS_PROMPT = `
Actúa como un Analista de Medios experto de alto nivel. Tu objetivo es realizar una síntesis informativa exhaustiva de las noticias más relevantes de HOY (${new Date().toLocaleDateString('es-ES')}) para una lectura rápida pero profunda.

Selecciona TODAS las noticias con impacto real en las siguientes categorías:

1. Mundo: Geopolítica, grandes eventos, economía global.
2. España: Política nacional, sociedad, hitos económicos a nivel estatal.
3. León & Provincia: DEBES incluir una cobertura integral de la provincia leonesa:
   - Noticias generales y políticas de León y El Bierzo.
   - DEPORTES LOCALES: Resultados y actualidad de equipos como la Cultural Leonesa, Ademar León, Baloncesto Ponferrada, etc.
   - CULTURA Y SOCIEDAD LOCAL: Eventos en el MUSAC, festivales provinciales, noticias sociales de los pueblos y la capital.
   - Usa medios como Diario de León, La Nueva Crónica de León, Leonoticias e ileon.
4. Deportes: Actualidad deportiva nacional e internacional (La Liga, Champions, F1, etc.).
5. Cultura/Sociedad: Estrenos mundiales, ciencia, tendencias globales y sociedad general.

METEOROLOGÍA:
- Busca la previsión meteorológica específica para la ciudad de León hoy y mañana.

REGLAS CRÍTICAS DE CALIDAD:
- Proporciona entre 4 y 6 noticias para 'León & Provincia' para asegurar que se cubran los deportes y la cultura local.
- Para el resto de categorías, proporciona entre 3 y 5 noticias.
- El titular debe ser breve y "de impacto".
- Cada noticia DEBE estar verificada por al menos 2 fuentes de prestigio. 
- El "Semáforo de Veracidad" debe ser 'verified' solo si hay consenso en medios serios.

Genera una respuesta JSON pura que siga este esquema:
{
  "news": [
    {
      "title": "Titular breve y potente",
      "summary": "Resumen ejecutivo de 1 o 2 frases máximo",
      "sources": ["url_fuente_1", "url_fuente_2"],
      "veracityScore": "verified",
      "category": "Mundo" | "España" | "León & Provincia" | "Deportes" | "Cultura/Sociedad"
    }
  ],
  "weather": {
    "temperature": "Ej: 14°C",
    "condition": "Ej: Despejado / Lluvia débil",
    "forecast": "Breve descripción para las próximas 24h",
    "humidity": "Ej: 65%",
    "wind": "Ej: 15 km/h NO"
  }
}
`;

export async function fetchDailyData(): Promise<{ news: NewsItem[]; weather: WeatherInfo }> {
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
    const rawNews = json.news || [];
    
    const news = rawNews.map((item: any, index: number) => ({
      ...item,
      id: `news-${index}-${Date.now()}`,
      timestamp: new Date().toISOString()
    }));

    return { news, weather: json.weather };
  } catch (error) {
    console.error("Error fetching news and weather:", error);
    throw error;
  }
}
