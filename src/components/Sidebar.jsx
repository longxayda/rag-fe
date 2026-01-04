import { Send, Loader2, Menu, X, MessageSquare, Home, BookOpen, HelpCircle } from 'lucide-react';

export function Sidebar({ isOpen, onClose, currentPage, onNavigate }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => onNavigate('heritage')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${currentPage === 'heritage'
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Khám phá Di sản</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${currentPage === 'chat'
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Trò chuyện AI</span>
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${currentPage === 'quiz'
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Hỏi xoay đáp xoáy</span>
            </button>
            <button
              onClick={() => onNavigate('tts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${currentPage === 'tts'
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Đọc văn bản</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}