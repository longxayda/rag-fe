import { useState, useRef, useEffect } from 'react';
import { X, MapPin, Calendar, Info, Volume2, Pause, Play, Loader, Landmark, Award } from 'lucide-react';
import DocIframe from './Doc';
export function HeritageDetailModal({ item, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioError, setAudioError] = useState(false);
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
        utterance.text = `${item.name}. ${item.notes || item.information}`;
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

    const getRankingTypeColor = (rankingType) => {
        switch (rankingType?.toLowerCase()) {
            case 'quốc gia đặc biệt': return 'bg-red-100 text-red-700';
            case 'quốc gia': return 'bg-blue-100 text-blue-700';
            case 'cấp tỉnh': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeGradient = (rankingType) => {
        switch (rankingType?.toLowerCase()) {
            case 'quốc gia đặc biệt': return 'from-red-500 to-red-600';
            case 'quốc gia': return 'from-blue-500 to-blue-600';
            case 'cấp tỉnh': return 'from-green-500 to-green-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Header with Hero Image */}
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10 text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Hero Image */}
                    <div className="relative h-64 overflow-hidden">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className={`bg-gradient-to-br ${getTypeGradient(item.rankingType)} h-full flex items-center justify-center`}>
                                <Landmark className="w-24 h-24 text-white/80" />
                            </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>

                    {/* Content Over Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRankingTypeColor(item.rankingType)}`}>
                                {item.rankingType}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">{item.name}</h2>
                        <div className="flex items-center gap-4 text-sm flex-wrap">
                            {item.yearBuilt && (
                                <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
                                    <Calendar className="w-4 h-4" />
                                    <span>Năm xây dựng: {item.yearBuilt}</span>
                                </div>
                            )}
                            {item.yearRanked && (
                                <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
                                    <Award className="w-4 h-4" />
                                    <span>Xếp hạng: {item.yearRanked}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
                                <MapPin className="w-4 h-4" />
                                <span>{item.address.split(',').slice(-2).join(',').trim()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)]">
                    {/* Audio Control */}
                    {item.audioFile && (
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
                                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${isLoading
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
                    )}

                    {/* Information Sections */}
                    <div className="space-y-6">
                        {/* Description */}
                        {item.notes && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-emerald-600" />
                                    Thông tin chi tiết
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {item.notes}
                                </p>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {item.rankingType && (
                                <div className="p-4 rounded-xl bg-gray-50">
                                    <div className="text-sm text-gray-600 mb-1">Loại xếp hạng</div>
                                    <div className="font-semibold text-gray-800">{item.rankingType}</div>
                                </div>
                            )}

                            {item.address && (
                                <div className="p-4 rounded-xl bg-gray-50">
                                    <div className="text-sm text-gray-600 mb-1">Địa chỉ đầy đủ</div>
                                    <div className="font-semibold text-gray-800">{item.address}</div>
                                </div>
                            )}

                            {item.yearBuilt && (
                                <div className="p-4 rounded-xl bg-gray-50">
                                    <div className="text-sm text-gray-600 mb-1">Năm xây dựng</div>
                                    <div className="font-semibold text-gray-800">{item.yearBuilt}</div>
                                </div>
                            )}

                            {item.yearRanked && (
                                <div className="p-4 rounded-xl bg-gray-50">
                                    <div className="text-sm text-gray-600 mb-1">Năm xếp hạng</div>
                                    <div className="font-semibold text-gray-800">{item.yearRanked}</div>
                                </div>
                            )}
                        </div>

                        {/* Additional Information */}
                        {item.information && (
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <div className="text-sm text-blue-600 font-semibold mb-2">Thông tin bổ sung</div>
                                <div className="text-sm text-gray-700">
                                    {item.information.startsWith('https') ? (
                                        <DocIframe source={item.information} />
                                    ) : (
                                        item.information
                                    )}
                                </div>
                            </div>
                        )}
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