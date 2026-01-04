import { Search, Grid, List, MapPin, Calendar, Landmark, X } from 'lucide-react';

export function HeritageListItem({ item, onClick }) {
  const getTypeLabel = (type) => {
    switch (type) {
      case 'heritage': return 'Di sản';
      case 'people': return 'Nhân vật';
      case 'festival': return 'Lễ hội';
      default: return '';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'heritage': return 'bg-blue-100 text-blue-700';
      case 'people': return 'bg-purple-100 text-purple-700';
      case 'festival': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      onClick={() => onClick(item)}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer p-5 flex gap-4"
    >
      <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg w-20 h-20 flex items-center justify-center text-4xl flex-shrink-0">
        {item.image}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(item.type)}`}>
            {getTypeLabel(item.type)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="font-medium">{item.commune}</span>
        </div>
        <p className="text-sm text-gray-500 mb-1">{item.description}</p>
        {item.year && <span className="text-xs text-gray-400 mr-3">📅 {item.year}</span>}
        {item.period && <span className="text-xs text-gray-400 mr-3">⏳ {item.period}</span>}
        {item.date && <span className="text-xs text-gray-400">📆 {item.date}</span>}
      </div>
    </div>
  );
}