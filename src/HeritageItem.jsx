export function HeritageListItem({ heritage, onClick }) {
  const isPerson = heritage.dataType === 'people';
  const isFestival = heritage.dataType === 'festival';

  return (
    <div
      onClick={() => onClick(heritage)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex"
    >
      <div className="relative w-48 flex-shrink-0">
        <img
          src={heritage.image || '/src/assets/ukn.png'}
          alt={heritage.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{heritage.name}</h3>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
            {isPerson ? `${heritage.birthYear} - ${heritage.deathYear}` : heritage.year || 'N/A'}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-gray-600">
            📍 {heritage.location || heritage.hometown || 'N/A'}
          </span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            {heritage.type || heritage.classification || 'N/A'}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{heritage.description}</p>

        <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
          Xem chi tiết →
        </button>
      </div>
    </div>
  );
}