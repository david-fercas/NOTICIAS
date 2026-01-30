
import React from 'react';
import { WeatherInfo } from '../types';

interface WeatherWidgetProps {
  weather: WeatherInfo | null;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-6 min-w-fit">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">León, ESP</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-gray-900">{weather.temperature}</span>
          <span className="text-sm font-bold text-gray-600">{weather.condition}</span>
        </div>
      </div>
      
      <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
      
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
          <div className="flex items-center gap-1">
            <span className="text-gray-300">Hum:</span> {weather.humidity}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-300">Viento:</span> {weather.wind}
          </div>
          <div className="col-span-2 text-blue-600 truncate max-w-[180px]">
            {weather.forecast}
          </div>
        </div>
        
        <div className="flex gap-3 mt-1 pt-1 border-t border-gray-100 md:border-t-0">
          <a 
            href="https://www.aemet.es/es/eltiempo/prediccion/municipios/leon-id24089" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] font-black text-blue-500 hover:text-blue-700 underline uppercase tracking-tighter"
          >
            AEMET
          </a>
          <a 
            href="https://www.eltiempo.es/leon.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] font-black text-blue-500 hover:text-blue-700 underline uppercase tracking-tighter"
          >
            ELTIEMPO.ES
          </a>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
