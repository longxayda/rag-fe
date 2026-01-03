import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Loader2, Menu, X, MessageSquare, Home, BookOpen, HelpCircle } from 'lucide-react';
import { HeritageListPage } from './HeritageList';
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={navigateTo}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {currentPage === 'heritage' && <HeritageListPage />}
            {currentPage === 'chat' && <ChatPage />}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}