import { useState, useRef, useEffect } from 'react';
import { X, MapPin, Calendar, Info, Volume2, Pause, Play, Loader, Share2, Heart } from 'lucide-react';

// Sample data


export function HeritageDetailModal({ item, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayAudio = () => {
    // Since we don't have actual audio files, we'll use Web Speech API
    if (window.speechSynthesis.speaking) {
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      }
      return;
    }

    setIsLoading(true);
    setAudioError(false);

    // Create speech synthesis
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `${item.name}. ${item.fullDescription || item.description}`;
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to find Vietnamese voice
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(voice => 
      voice.lang.includes('vi') || voice.lang.includes('VN')
    );
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      setAudioError(true);
      setIsPlaying(false);
      setIsLoading(false);
      console.error('Speech synthesis error:', event);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: item.description,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${item.name} - ${item.description}`);
      alert('Đã sao chép liên kết!');
    }
  };

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
      case 'heritage': return 'from-blue-500 to-blue-600';
      case 'people': return 'from-purple-500 to-purple-600';
      case 'festival': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header with Hero Image */}
        <div className={`relative bg-gradient-to-br ${getTypeColor(item.type)} p-8 text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-7xl">{item.image}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 opacity-90">
                {getTypeLabel(item.type)}
              </div>
              <h2 className="text-3xl font-bold mb-2">{item.name}</h2>
              <div className="flex items-center gap-4 text-sm opacity-90">
                {item.year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Năm {item.year}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{item.commune}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center gap-2 text-sm font-semibold"
            >
              <Share2 className="w-4 h-4" />
              Chia sẻ
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold ${
                isFavorite ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Đã lưu' : 'Lưu'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Audio Control */}
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <Volume2 className="w-5 h-5" />
                <span className="font-semibold">Nghe giới thiệu</span>
              </div>
              {isPlaying && (
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-emerald-600 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 20 + 10}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={isPlaying ? handlePlayAudio : handlePlayAudio}
                disabled={isLoading}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                  isLoading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : isPlaying
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Đang tải...
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Tạm dừng
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Phát audio
                  </>
                )}
              </button>
              
              {isPlaying && (
                <button
                  onClick={handleStopAudio}
                  className="px-6 py-3 rounded-xl font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Dừng
                </button>
              )}
            </div>

            {audioError && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ Không thể phát audio. Vui lòng thử lại.
              </p>
            )}
          </div>

          {/* Information Sections */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-600" />
                Thông tin chi tiết
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {item.fullDescription || item.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.category && (
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="text-sm text-gray-600 mb-1">Phân loại</div>
                  <div className="font-semibold text-gray-800">{item.category}</div>
                </div>
              )}
              
              {item.address && (
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="text-sm text-gray-600 mb-1">Địa chỉ</div>
                  <div className="font-semibold text-gray-800">{item.address}</div>
                </div>
              )}
              
              {item.year && (
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="text-sm text-gray-600 mb-1">Năm xây dựng</div>
                  <div className="font-semibold text-gray-800">{item.year}</div>
                </div>
              )}
              
              <div className="p-4 rounded-xl bg-gray-50">
                <div className="text-sm text-gray-600 mb-1">Vị trí</div>
                <div className="font-semibold text-gray-800">{item.commune}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Mã số:</span> #{item.id}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// // Demo Component
// export default function HeritageListDemo() {
//   const [selectedItem, setSelectedItem] = useState(null);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             Danh sách Di Sản Cà Mau
//           </h1>
//           <p className="text-gray-600">Click vào thẻ để xem chi tiết và nghe giới thiệu</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {HERITAGE_DATA.map(item => (
//             <div
//               key={item.id}
//               onClick={() => setSelectedItem(item)}
//               className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
//             >
//               <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-8 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
//                 {item.image}
//               </div>
//               <div className="p-5">
//                 <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
//                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                   <MapPin className="w-4 h-4 text-emerald-600" />
//                   <span>{item.commune}</span>
//                 </div>
//                 <p className="text-sm text-gray-500 mb-2">{item.description}</p>
//                 <div className="flex items-center justify-between mt-4">
//                   <span className="text-xs text-gray-400">📅 {item.year}</span>
//                   <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-200 transition-colors flex items-center gap-1">
//                     <Volume2 className="w-4 h-4" />
//                     Nghe
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Detail Modal */}
//       {selectedItem && (
//         <HeritageDetailModal
//           item={selectedItem}
//           onClose={() => setSelectedItem(null)}
//         />
//       )}
//     </div>
//   );
// }