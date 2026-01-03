export function HeritageCard({ heritage, onClick }) {
  const isPerson = heritage.dataType === 'people';
  const isFestival = heritage.dataType === 'festival';

  return (
    <div
      onClick={() => onClick(heritage)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={heritage.image || '/src/assets/ukn.png'}
          alt={heritage.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-red-600">
          {isPerson ? `${heritage.birthYear} - ${heritage.deathYear}` : heritage.year || 'N/A'}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{heritage.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500">
            📍 {heritage.location || heritage.hometown || 'N/A'}
          </span>
        </div>
        <div className="text-sm text-gray-500 mb-2">
          {heritage.type || heritage.classification || 'N/A'}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{heritage.description}</p>

        <button className="mt-4 w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
          Xem chi tiết →
        </button>
      </div>
    </div>
  );
}