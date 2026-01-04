import { Search, Grid, List, MapPin, Calendar, Landmark, X } from 'lucide-react';

export function HeritageCard({ item, onClick }) {
  const getRankingTypeColor = (rankingType) => {
    switch (rankingType?.toLowerCase()) {
      case 'quốc gia đặc biệt': return 'bg-red-100 text-red-700';
      case 'quốc gia': return 'bg-blue-100 text-blue-700';
      case 'cấp tỉnh': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      onClick={() => onClick(item)}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="bg-gradient-to-br from-emerald-100 to-teal-100 h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Landmark className="w-16 h-16 text-emerald-600" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800 flex-1">{item.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRankingTypeColor(item.rankingType)}`}>
            {item.rankingType}
          </span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
          <span className="font-medium">{item.address}</span>
        </div>
        {item.notes && (
          <p className="text-sm text-gray-500 mb-2">{item.notes}</p>
        )}
        {item.yearBuilt && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Năm xây dựng: {item.yearBuilt}
          </p>
        )}
        {item.yearRanked && (
          <p className="text-xs text-gray-400 mt-1">
            🏆 Xếp hạng: {item.yearRanked}
          </p>
        )}
      </div>
    </div>
  );
}