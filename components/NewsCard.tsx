
import React from 'react';
import { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const getVeracityColor = (score: string) => {
    return score === 'verified' ? 'bg-green-500' : 'bg-yellow-500';
  };

  const getCardColor = (category: string) => {
    switch (category) {
      case 'Mundo': return 'bg-white border-blue-500/20 shadow-blue-100';
      case 'España': return 'bg-white border-red-500/20 shadow-red-100';
      case 'León & Provincia': return 'bg-white border-purple-500/20 shadow-purple-100';
      case 'Deportes': return 'bg-white border-emerald-500/20 shadow-emerald-100';
      default: return 'bg-white border-amber-500/20 shadow-amber-100';
    }
  };

  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'Mundo': return 'bg-blue-600 text-white';
      case 'España': return 'bg-red-600 text-white';
      case 'León & Provincia': return 'bg-purple-700 text-white';
      case 'Deportes': return 'bg-emerald-600 text-white';
      default: return 'bg-amber-600 text-white';
    }
  };

  return (
    <div className={`group flex flex-col p-6 rounded-2xl border-2 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ${getCardColor(item.category)}`}>
      <div className="flex justify-between items-center mb-4">
        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${getBadgeStyle(item.category)}`}>
          {item.category}
        </span>
        <div className="flex items-center gap-2 group/status">
          <div className={`w-2.5 h-2.5 rounded-full ${getVeracityColor(item.veracityScore)} shadow-sm ring-4 ring-opacity-20 ${item.veracityScore === 'verified' ? 'ring-green-500 animate-pulse' : 'ring-yellow-500'}`}></div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter opacity-0 group-hover/status:opacity-100 transition-opacity">
            {item.veracityScore === 'verified' ? 'Contrastado' : 'Revisando'}
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
        <p className="text-[9px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Fuentes Verificadas</p>
        <div className="flex flex-wrap gap-2">
          {item.sources.map((source, idx) => {
            let domain = "Fuente";
            try {
              domain = new URL(source).hostname.replace('www.', '');
            } catch(e) {}
            
            return (
              <a 
                key={idx}
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-gray-700 bg-gray-100 hover:bg-black hover:text-white px-2.5 py-1.5 rounded-md transition-all truncate max-w-[120px]"
                title={source}
              >
                {domain}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
