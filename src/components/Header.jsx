import { Send, Loader2, Menu, X, MessageSquare, Home, BookOpen, HelpCircle } from 'lucide-react';

export function Header({ onMenuClick }) {
  return (
    <header className="bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-red-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Di sản Văn hóa Cà Mau</h1>
        </div>
        <nav className="hidden lg:flex items-center gap-6">
          <a href="#" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
            <Home className="w-5 h-5" />
            <span>Trang chủ</span>
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
            <BookOpen className="w-5 h-5" />
            <span>Di sản</span>
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span>Kiểm tra</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
