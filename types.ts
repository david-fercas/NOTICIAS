
export enum Category {
  MUNDO = 'Mundo',
  ESPANA = 'España',
  LEON = 'León & Provincia',
  DEPORTES = 'Deportes',
  CULTURA = 'Cultura/Sociedad'
}

export interface WeatherInfo {
  temperature: string;
  condition: string;
  forecast: string;
  humidity: string;
  wind: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sources: string[];
  veracityScore: 'verified' | 'unverified';
  category: Category;
  timestamp: string;
}

export interface NewsCanvasData {
  news: NewsItem[];
  weather: WeatherInfo;
  lastUpdated: string;
}
