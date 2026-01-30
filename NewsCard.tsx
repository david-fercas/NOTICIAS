
import React from 'react';
import { NewsItem } from './types';

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const veracityColor = item.veracityScore === 'verified' ? 'bg-green-500' : 'bg-yellow-500';
  
  const categoryStyles: Record<string, string> = {
    'Mundo': 'border-blue-500/20 shadow-blue-100 bg-blue-600',
    'España': 'border-red-500/20 shadow-red-100 bg-red-600',
    'León & Provincia': 'border-purple-500/20 shadow-purple-100 bg-purple-700',
    'Deportes': 'border-emerald-500/20 shadow-emerald-100 bg-emerald-600',
    'default': 'border-amber-500/20 shadow-amber-100 bg-amber-600'
  };

  const style = categoryStyles[item.category] || categoryStyles['default'];

  // Función segura para extraer el dominio de una URL
  const getDomainName = (urlStr: string) => {
    try {
      // Intentar limpiar espacios en blanco comunes
      const cleanUrl = urlStr.trim();
      if (!cleanUrl.startsWith('http')) return 'Fuente';
      const url = new URL(cleanUrl);
      return url.hostname.replace('www.', '');
    } catch (e) {
      console.warn("URL inválida detectada:", urlStr);
      return 'Enlace';
    }
  };

  return (
    <div className={`group flex flex-col p-6 rounded-2xl border-2 shadow-lg transition-all hover:-translate-y-1 duration-300 bg-white ${style.split(' ')[0]}`}>
      <div className="flex justify-between items-center mb-4">
        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full text-white ${style.split(' ').pop()}`}>
          {item.category}
        </span>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${veracityColor} shadow-sm ring-4 ring-opacity-20 ${item.veracityScore === 'verified' ? 'ring-green-500 animate-pulse' : 'ring-yellow-500'}`}></div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
            {item.veracityScore === 'verified' ? 'Verificado' : 'En revisión'}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-black text-gray-900 leading-[1.1] mb-3 group-hover:text-blue-700 transition-colors">
        {item.title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">
        {item.summary}
      </p>
      
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-[8px] font-black text-gray-400 uppercase mb-2 tracking-widest">Fuentes de consulta</p>
        <div className="flex flex-wrap gap-2">
          {item.sources.map((source, idx) => (
            <a 
              key={idx} 
              href={source.startsWith('http') ? source : '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] font-bold text-gray-700 bg-gray-100 hover:bg-black hover:text-white px-2 py-1 rounded truncate max-w-[120px] transition-colors"
            >
              {getDomainName(source)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
