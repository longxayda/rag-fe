import { useState, useMemo } from 'react';
import { Search, Grid, List, MapPin, Calendar, Landmark, X } from 'lucide-react';
import heritageData from '../data/heritages.json' with {"type": "json"}
import { PEOPLE_DATA } from '../data/people';
import { FESTIVAL_DATA } from '../data/festivals';

import { HeritageCard } from '../components/HeritageCard'
import { HeritageListItem } from '../components/HeritageItem';
import { HeritageDetailModal } from '../components/Detail';
import { COMMUNES } from '../data/communes';

function normalizeHeritage(item) {
  return {
    id: Number(item.id),
    name: item.name?.trim() ?? '',
    address: item.address ?? '',
    yearRanked: item.yearRanked ?? null,
    rankingType: item.rankingType ?? 'Unknown',
    yearBuilt: item.yearBuilt ?? null,
    information: item.information ?? '',
    notes: item.notes ?? '',
    audioFile: item.audioFile ?? null,
    image: item.image ?? null
  };
}

const extractCommune = (address) => {
  if (!address) return '';
  // Try to match "xã X" or "phường X" pattern
  const match = address.match(/(xã|phường)\s+([^,]+)/i);
  return match ? `${match[1]} ${match[2]}`.trim() : address;
};


const HERITAGE_DATA = heritageData.map(normalizeHeritage)

export default function HeritageListPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [communeFilter, setCommuneFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Combine all data
  const allData = useMemo(() => [
    ...HERITAGE_DATA.map(item => ({ ...item, dataType: 'heritage' })),
    ...PEOPLE_DATA.map(item => ({ ...item, dataType: 'people' })),
    ...FESTIVAL_DATA.map(item => ({ ...item, dataType: 'festival' }))
  ], []);

  // Filter data
  const filteredData = useMemo(() => {
    return allData.filter(item => {
      const matchesType = typeFilter === 'all' || item.dataType === typeFilter;

      // Flexible commune matching
      const itemCommune = extractCommune(item.address);
      const matchesCommune = communeFilter === 'all' ||
        item.address.toLowerCase().includes(communeFilter.toLowerCase()) ||
        itemCommune.toLowerCase().includes(communeFilter.toLowerCase());

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesType && matchesCommune && matchesSearch;
    });
  }, [allData, typeFilter, communeFilter, searchQuery]);

  // Get communes that have data
  const availableCommunes = useMemo(() => {
    const communesWithData = new Set(
      allData
        .map(item => extractCommune(item.address))
        .filter(Boolean)
    );

    return COMMUNES.filter(commune =>
      communesWithData.has(commune)
    );
  }, [allData]);


  const handleItemClick = (item) => {
    setSelectedItem(item);
  };


  const clearFilters = () => {
    setTypeFilter('all');
    setCommuneFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Landmark className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-bold">Khám phá</h1>
            </div>
          </div>
          <p className="text-emerald-50 mb-6">Khám phá di tích lịch sử, văn hóa, nhân vật và lễ hội của 55 xã và 9 phường</p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm di sản, nhân vật, lễ hội hoặc xã/phường..."
              className="w-full px-4 py-3 pl-11 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loại hình
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 text-gray-700"
              >
                <option value="all">Tất cả loại hình</option>
                <option value="heritage">🏛️ Di sản</option>
                <option value="people">👤 Nhân vật</option>
                <option value="festival">🎉 Lễ hội</option>
              </select>
            </div>

            {/* Commune Filter - MAIN FEATURE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Xã/Phường (64 đơn vị)
              </label>
              <select
                value={communeFilter}
                onChange={(e) => setCommuneFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 text-gray-700"
              >
                <option value="all">Tất cả xã/phường</option>
                <optgroup label="Có dữ liệu">
                  {availableCommunes.map(commune => (
                    <option key={commune} value={commune}>
                      {commune.startsWith('Phường') ? '🏙️' : '🏘️'} {commune}
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hiển thị {availableCommunes.length} xã/phường có dữ liệu
              </p>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hiển thị
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${viewMode === 'grid'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Grid className="w-5 h-5" />
                  Lưới
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${viewMode === 'list'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <List className="w-5 h-5" />
                  Danh sách
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(typeFilter !== 'all' || communeFilter !== 'all' || searchQuery) && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-semibold">Đang lọc:</span>
              {typeFilter !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                  {typeFilter === 'heritage' ? '🏛️ Di sản' : typeFilter === 'people' ? '👤 Nhân vật' : '🎉 Lễ hội'}
                  <button onClick={() => setTypeFilter('all')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {communeFilter !== 'all' && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-1">
                  {communeFilter}
                  <button onClick={() => setCommuneFilter('all')} className="hover:bg-emerald-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium flex items-center gap-1">
                  🔍 "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:bg-teal-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{filteredData.length}</div>
              <div className="text-xs text-gray-600">Kết quả</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">64</div>
              <div className="text-xs text-gray-600">Xã/Phường</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{allData.length}</div>
              <div className="text-xs text-gray-600">Tổng di sản</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            55 xã • 9 phường
          </div>
        </div>

        {/* Heritage Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(item => (
              <HeritageCard
                key={`${item.dataType}-${item.id}`}
                item={item}
                onClick={handleItemClick}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map(item => (
              <HeritageListItem
                key={`${item.dataType}-${item.id}`}
                item={item}
                onClick={handleItemClick}
              />
            ))}
          </div>
        )}

        {selectedItem && (
          <HeritageDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-600 mb-4">
              {communeFilter !== 'all'
                ? `Chưa có dữ liệu cho ${communeFilter}`
                : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}