import { HERITAGE_DATA } from '../data/heritages';
import { PEOPLE_DATA } from '../data/people';
import { FESTIVAL_DATA } from '../data/festivals';

import { useState } from 'react';
import { HeritageFilter } from '../Filter';
import { HeritageCard } from '../components/HeritageCard';
import { HeritageListItem } from '../components/HeritageItem';

export function HeritageListPage() {
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine all data sources
  const allData = [
    ...HERITAGE_DATA.map(item => ({ ...item, dataType: 'heritage' })),
    ...PEOPLE_DATA.map(item => ({ ...item, dataType: 'people' })),
    ...FESTIVAL_DATA.map(item => ({ ...item, dataType: 'festival' }))
  ];

  const filteredHeritage = allData.filter(item => {
    const matchesFilter = filter === 'all' || item.dataType === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.hometown && item.hometown.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleHeritageClick = (item) => {
    const typeLabel = item.dataType === 'people' ? 'nhân vật' : item.dataType === 'festival' ? 'lễ hội' : 'di sản';
    alert(`Clicked: ${item.name}\n\nĐây là nơi bạn sẽ navigate đến trang chi tiết ${typeLabel}!`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-yellow-500 rounded-2xl p-8 mb-6 text-white shadow-xl">

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm di sản, nhân vật, hoặc lễ hội..."
            className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filter */}
      <HeritageFilter
        activeFilter={filter}
        onFilterChange={setFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Tìm thấy <span className="font-semibold text-gray-800">{filteredHeritage.length}</span> kết quả
      </div>

      {/* Heritage Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHeritage.map(heritage => (
            <HeritageCard
              key={`${heritage.dataType}-${heritage.id}`}
              heritage={heritage}
              onClick={handleHeritageClick}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHeritage.map(heritage => (
            <HeritageListItem
              key={`${heritage.dataType}-${heritage.id}`}
              heritage={heritage}
              onClick={handleHeritageClick}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredHeritage.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Không tìm thấy kết quả phù hợp
          </h3>
          <p className="text-gray-600">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
        </div>
      )}
    </div>
  );
}