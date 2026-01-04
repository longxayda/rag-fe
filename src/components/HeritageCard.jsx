import { Search, Grid, List, MapPin, Calendar, Landmark, X } from 'lucide-react';

export function HeritageCard({ item, onClick }) {
  const getTypeLabel = (type) => {
    switch(type) {
      case 'heritage': return 'Di sản';
      case 'people': return 'Nhân vật';
      case 'festival': return 'Lễ hội';
      default: return '';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'heritage': return 'bg-blue-100 text-blue-700';
      case 'people': return 'bg-purple-100 text-purple-700';
      case 'festival': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      onClick={() => onClick(item)}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
    >
      <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-8 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
        {item.image}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800 flex-1">{item.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(item.type)}`}>
            {getTypeLabel(item.type)}
          </span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
          <span className="font-medium">{item.commune}</span>
        </div>
        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
        {item.year && (
          <p className="text-xs text-gray-400">📅 {item.year}</p>
        )}
        {item.period && (
          <p className="text-xs text-gray-400">⏳ {item.period}</p>
        )}
        {item.date && (
          <p className="text-xs text-gray-400">📆 {item.date}</p>
        )}
      </div>
    </div>
  );
}