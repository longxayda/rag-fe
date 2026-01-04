import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Loader2, Menu, X, MessageSquare, Home, BookOpen, HelpCircle } from 'lucide-react';
import { HeritageListPage } from './pages/HeritageList';
import QuizPage from './pages/QuizPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';

import { ChatPage } from './pages/Chat';

// Main App Component
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('heritage');

  const navigateTo = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={navigateTo}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 xl:p-8 min-h-0">
          <div className="max-w-7xl mx-auto h-full">
            {currentPage === 'heritage' && <HeritageListPage />}
            {currentPage === 'chat' && <ChatPage />}
            {currentPage === 'quiz' && <QuizPage />}
          </div>
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  );
}