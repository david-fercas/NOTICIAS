
import React, { useState, useEffect, useCallback } from 'react';
import { Category, NewsItem, WeatherInfo } from './types';
import { fetchDailyData } from './newsService';
import NewsCard from './NewsCard';
import WeatherWidget from './WeatherWidget';

const CATEGORIES = [
  Category.MUNDO,
  Category.ESPANA,
  Category.LEON,
  Category.DEPORTES,
  Category.CULTURA
];

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDailyData();
      setNews(data.news);
      setWeather(data.weather);
      setLastSync(new Date());
    } catch (err: any) {
      console.error(err);
      setError("Error de conexión. Asegúrate de que la API_KEY esté configurada en Vercel.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-10 border-b-2 border-black pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter flex flex-wrap items-center gap-x-4">
              <span className="bg-black text-white px-3 py-1 transform -skew-x-6">CANVAS</span>
              <span>NOTICIAS</span>
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-gray-600 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span>Última Hora</span>
              </div>
              <span>•</span>
              <span>Sincronizado: {lastSync ? lastSync.toLocaleTimeString('es-ES') : '--:--'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <WeatherWidget weather={weather} />
            <button 
              onClick={loadData}
              disabled={loading}
              className="px-8 py-3 font-bold text-white bg-blue-600 hover:bg-black rounded-xl active:scale-95 disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase text-sm transition-all"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Actualizar Noticias"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-900 p-6 rounded-xl mb-8">
            <p className="font-black uppercase tracking-tight">Atención</p>
            <p>{error}</p>
          </div>
        )}

        {loading && news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-handwriting text-2xl text-gray-800">Compilando el informe matutino...</p>
          </div>
        ) : (
          <div className="space-y-16">
            {CATEGORIES.map(category => {
              const catNews = news.filter(n => n.category === category);
              if (catNews.length === 0) return null;
              return (
                <section key={category}>
                  <div className="flex items-center gap-6 mb-8">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{category}</h2>
                    <div className="h-[2px] bg-gray-900 w-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {catNews.map(item => <NewsCard key={item.id} item={item} />)}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
