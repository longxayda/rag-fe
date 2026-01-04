import { Menu, Home, BookOpen, HelpCircle } from 'lucide-react';

export function Header({ onMenuClick }) {
    return (
        <header className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg flex-shrink-0">
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-1.5 sm:p-2 hover:bg-red-800 rounded-lg transition-colors flex-shrink-0"
                    >
                        <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <img
                        src="logo.png"
                        alt="Logo Di sản Cà Mau"
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
                    />

                    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate">
                        Di sản Văn hóa Cà Mau
                    </h1>
                </div>
                <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0">
                    <a href="#" className="flex items-center gap-2 hover:text-yellow-300 transition-colors text-sm">
                        <Home className="w-4 h-4" />
                        <span>Trang chủ</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 hover:text-yellow-300 transition-colors text-sm">
                        <BookOpen className="w-4 h-4" />
                        <span>Trò chuyện</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 hover:text-yellow-300 transition-colors text-sm">
                        <HelpCircle className="w-4 h-4" />
                        <span>Hỏi đáp</span>
                    </a>
                </nav>
            </div>
        </header>
    );
}