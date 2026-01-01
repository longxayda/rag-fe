import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Loader2, Menu, X, MessageSquare, Home, BookOpen, HelpCircle } from 'lucide-react';


// Custom Hook for Streaming Chat
function useStreamingChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI về di sản văn hóa tỉnh Cà Mau. Bạn có thể hỏi tôi về các di sản như Lễ Hội Đờn Ca Tài Tử hoặc bất kỳ di sản văn hóa nào khác.'
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  // const [currentStream, setCurrentStream] = useState('');
  const [error, setError] = useState(null);

  const streamFromBackend = useCallback(async (userMessage) => {
    setIsStreaming(true);
    // setCurrentStream('');
    setError(null);

    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: '' }
    ]);

    try {
      const response = await fetch('http://localhost:8000/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });


        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk
          };
          return updated;
        });
        // fullResponse += chunk;
        // setCurrentStream(chunk);
      }

      // Add complete response to messages
      // setMessages(prev => [
      //   ...prev,
      //   { role: 'assistant', content: fullResponse }
      // ]);

      // setCurrentStream('');
    } catch (err) {
      console.error('Streaming error:', err);
      setError(err.message);

      // Add error message
      const errorMessage = 'Xin lỗi, đã có lỗi xảy ra khi kết nối với server. Vui lòng thử lại sau.';
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: errorMessage }
      ]);
    } finally {
      setIsStreaming(false);
      // setCurrentStream('');
    }
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: text
    }]);

    // Stream response from backend
    await streamFromBackend(text);
  }, [streamFromBackend]);

  return { messages, isStreaming, sendMessage, error };
}




// Message Bubble Component
function MessageBubble({ message, isStreaming = false }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
        ? 'bg-red-600 text-white rounded-br-none'
        : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-start">
          {message.content}
          {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse"></span>}
        </p>
      </div>
    </div>
  );
}

// Suggested Questions Component
function SuggestedQuestions({ onQuestionClick, disabled }) {
  const questions = [
    'Di tích lịch sử Nọc Nạng là gì?',
    'Sự kiện Nọc Nạng năm 1928 có ý nghĩa như thế nào?',
    'Ông Mười Chức là ai?',
    'Lễ hội Dấu ấn Đồng Nọc Nạng được tổ chức khi nào?'
  ];


  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {questions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onQuestionClick(q)}
          disabled={disabled}
          className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-50 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

// Chat Window Component
function ChatWindow() {
  const { messages, isStreaming, sendMessage } = useStreamingChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedQuestion = (question) => {
    if (!isStreaming) {
      sendMessage(question);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex items-center gap-3">
        <MessageSquare className="w-6 h-6" />
        <div>
          <h2 className="font-semibold text-lg">Trợ lý di sản AI</h2>
          <p className="text-xs text-red-100">Hỏi tôi về di sản văn hóa tỉnh Cà Mau</p>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 bg-gray-50"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} isStreaming={isStreaming && idx === messages.length - 1 && msg.role === 'assistant'} />
        ))}

        {/* Streaming Message */}
        {/* {isStreaming && currentStream && (
          <MessageBubble
            message={{ role: 'assistant', content: currentStream }}
            isStreaming={true}
          />
        )} */}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <SuggestedQuestions
          onQuestionClick={handleSuggestedQuestion}
          disabled={isStreaming}
        />

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Hỏi về di sản văn hóa..."
            disabled={isStreaming}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSubmit}
            disabled={isStreaming || !input.trim()}
            className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Header Component
function Header({ onMenuClick }) {
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

// Sidebar Component
function Sidebar({ isOpen, onClose, currentPage, onNavigate }) {
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
                ? 'bg-red-50 text-red-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Khám phá Di sản</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${currentPage === 'chat'
                ? 'bg-red-50 text-red-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Trò chuyện AI</span>
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${currentPage === 'quiz'
                ? 'bg-red-50 text-red-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Làm bài kiểm tra</span>
            </button>
          </nav>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">💡 Mẹo</h3>
            <p className="text-sm text-yellow-800">
              {currentPage === 'heritage'
                ? 'Click vào từng di sản để xem thông tin chi tiết!'
                : 'Hãy thử hỏi chatbot về bất kỳ di sản văn hóa nào của Cà Mau!'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © 2025 Di sản Văn hóa Cà Mau. Powered by RAG & LLM Technology.
        </p>
        <p className="text-xs mt-2 text-gray-400">
          Dự án nghiên cứu về ứng dụng AI trong bảo tồn di sản
        </p>
      </div>
    </footer>
  );
}

const HERITAGE_DATA = [
  {
    id: 1,
    name: 'Di tích lịch sử Nọc Nạng',
    location: 'Ấp 4, xã Phong Thạnh A, thị xã Giá Rai, tỉnh Bạc Liêu',
    type: 'Di tích lịch sử - văn hóa cấp Quốc gia',
    year: 1991,
    description:
      'Di tích ghi dấu cuộc đấu tranh kiên cường của gia đình nông dân Mười Chức năm 1928, tạo tiếng vang lớn trong phong trào đấu tranh chống địa chủ và thực dân tại Bạc Liêu.',
    image: 'https://th.bing.com/th/id/R.c4245e3bcd229707b741966d7f5886f1?rik=apwB5sTm0n1ORw&riu=http%3a%2f%2fphotos.wikimapia.org%2fp%2f00%2f01%2f82%2f52%2f50_big.jpg&ehk=DzKDd2sYCyrKjVGL%2boDW1YbCbGg0EnCl8Hx%2fepeYgKE%3d&risl=&pid=ImgRaw&r=0',
    category: 'historical'
  },
  {
    id: 2,
    name: 'Nhà Công tử Bạc Liêu',
    location: '13 Điện Biên Phủ, Phường 13, TP. Bạc Liêu',
    type: 'Di tích kiến trúc nghệ thuật',
    year: 1920,
    description:
      'Công trình kiến trúc tiêu biểu của thời hoàng kim xứ Bạc Liêu, hiện là điểm tham quan văn hóa – du lịch nổi bật của tỉnh.',
    image: 'https://tse2.mm.bing.net/th/id/OIP.Cx3gTuFXeUbLv8jQB8aeJQHaFj?rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'architectural'
  },
  {
    id: 3,
    name: 'Quảng trường Hùng Vương',
    location: 'TP. Bạc Liêu',
    type: 'Công trình văn hóa – công cộng',
    year: 2014,
    description:
      'Không gian sinh hoạt văn hóa – giải trí với các biểu tượng nghệ thuật gắn liền với Đờn ca tài tử Nam Bộ và sự giao thoa văn hóa Kinh – Hoa – Khmer.',
    image: 'https://tse1.mm.bing.net/th/id/OIP.JCdWoxS7CTObgE5sc9708gHaFj?rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'cultural'
  },
  {
    id: 4,
    name: 'Nhà hát Cao Văn Lầu',
    location: 'TP. Bạc Liêu',
    type: 'Công trình văn hóa – nghệ thuật',
    year: 2014,
    description:
      'Nhà hát có kiến trúc hình nón lá độc đáo, được xác lập kỷ lục là công trình có hình dạng nón lá lớn nhất Việt Nam.',
    image: 'https://tse2.mm.bing.net/th/id/OIP.VFhrM6Qd9JNipcAJ_6QNpwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'cultural'
  },
  {
    id: 5,
    name: 'Điểm du lịch Điện Gió Bạc Liêu',
    location: 'Ven biển tỉnh Bạc Liêu',
    type: 'Điểm du lịch – năng lượng tái tạo',
    year: null,
    description:
      'Khu điện gió ven biển Bạc Liêu là dự án tiên phong về năng lượng tái tạo, kết hợp phát điện và du lịch sinh thái, góp phần giảm phát thải khí nhà kính và phát triển kinh tế địa phương.',
    image: 'https://dulichthienlac.com/wp-content/uploads/2022/11/canh-dong-dien-gio-bac-lieu-3.jpg',
    category: 'tourism'
  },
  {
    id: 6,
    name: 'Vườn quốc gia Mũi Cà Mau',
    location:
      'Các xã Đất Mũi, Viên An (Ngọc Hiển) và Đất Mới (Năm Căn), tỉnh Cà Mau',
    type: 'Vườn quốc gia – khu dự trữ sinh quyển',
    year: 2003,
    description:
      'Vườn quốc gia Mũi Cà Mau là khu rừng ngập mặn nguyên sinh lớn nhất Việt Nam, được UNESCO công nhận là khu dự trữ sinh quyển thế giới và khu Ramsar có tầm quan trọng quốc tế.',
    image: 'https://dulichokela.com/wp-content/uploads/2023/12/vuon-quoc-gia-mui-ca-mau.jpg',
    category: 'natural'
  },
  {
    id: 7,
    name: 'Hệ sinh thái rừng ngập mặn Mũi Cà Mau',
    location: 'Khu vực bán đảo Cà Mau',
    type: 'Di sản sinh thái tự nhiên',
    year: null,
    description:
      'Hệ sinh thái rừng ngập mặn có giá trị khoa học và sinh thái đặc biệt, đóng vai trò quan trọng trong bảo vệ bờ biển, đa dạng sinh học và cân bằng sinh thái ven biển.',
    image: 'https://tse1.mm.bing.net/th/id/OIP.fTPSL6R_TRkvMuhN8ury0gHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'natural'
  }
];

const PEOPLE_DATA = [
  {
    id: 1,
    name: 'Hồ Thị Kỷ',
    birthYear: 1949,
    deathYear: 1970,
    classification: 'Anh hùng lực lượng vũ trang nhân dân',
    hometown: 'Ấp Cây Khô, xã Tân Lợi (nay là xã Hồ Thị Kỷ), huyện Thới Bình, tỉnh Cà Mau',
    description:
      'Nữ chiến sĩ biệt động thị xã Cà Mau, anh dũng hy sinh năm 1970. Được truy tặng danh hiệu Anh hùng lực lượng vũ trang nhân dân.',
    image: 'https://th.bing.com/th/id/R.64eefdeb9bc2ef864af11141a32af27b?rik=bBEEaOgK9LLFfw&pid=ImgRaw&r=0',
    category: 'hero'
  },
  {
    id: 2,
    name: 'Trần Ngọc Hy',
    birthYear: 1924,
    deathYear: 1957,
    classification: 'Anh hùng lực lượng vũ trang nhân dân',
    hometown: 'Xã Tạ An Khương, huyện Đầm Dơi, tỉnh Cà Mau',
    description:
      'Nhà báo, Trưởng Ban Biên tập báo Hòa Bình Thống Nhất, người chiến sĩ cách mạng kiên trung, hy sinh năm 1957.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    category: 'historical_figure'
  },
  {
    id: 3,
    name: 'Trần Nguyên Đán',
    birthYear: 1325,
    deathYear: 1390,
    classification: 'Nhân vật lịch sử',
    hometown: 'Làng Tức Mặc, huyện Mỹ Lộc, tỉnh Nam Định',
    description:
      'Danh sĩ đời Trần, hiệu Băng Hồ, giữ nhiều chức vụ quan trọng triều đình, sống thanh liêm và để lại dấu ấn lớn trong lịch sử.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    category: 'historical_figure'
  }
];

const FESTIVAL_DATA = [
  {
    id: 1,
    name: 'Đờn ca Tài tử Nam Bộ',
    location: 'Các tỉnh Nam Bộ',
    type: 'Di sản văn hóa phi vật thể',
    year: 2013,
    description:
      'Đờn ca Tài tử là loại hình âm nhạc truyền thống của Nam Bộ, được UNESCO ghi danh là Di sản văn hóa phi vật thể đại diện của nhân loại.',
    category: 'intangible_heritage'
  }
];

// Heritage Card Component
function HeritageCard({ heritage, onClick }) {
  const isPerson = heritage.dataType === 'people';
  const isFestival = heritage.dataType === 'festival';

  return (
    <div
      onClick={() => onClick(heritage)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={heritage.image || '/src/assets/ukn.png'}
          alt={heritage.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-red-600">
          {isPerson ? `${heritage.birthYear} - ${heritage.deathYear}` : heritage.year || 'N/A'}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{heritage.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500">
            📍 {heritage.location || heritage.hometown || 'N/A'}
          </span>
        </div>
        <div className="text-sm text-gray-500 mb-2">
          {heritage.type || heritage.classification || 'N/A'}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{heritage.description}</p>

        <button className="mt-4 w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
          Xem chi tiết →
        </button>
      </div>
    </div>
  );
}

// Filter Component
function HeritageFilter({ activeFilter, onFilterChange, viewMode, onViewModeChange }) {
  const filters = [
    { id: 'all', label: 'Tất cả', icon: '🌏' },
    { id: 'heritage', label: 'Di sản', icon: '🏛️' },
    { id: 'people', label: 'Nhân vật', icon: '👤' },
    { id: 'festival', label: 'Lễ hội', icon: '🎭' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === filter.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            title="Grid View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            title="List View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Heritage List Item (for list view)
function HeritageListItem({ heritage, onClick }) {
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

// Heritage List Page Component
function HeritageListPage() {
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
        <h2 className="text-3xl font-bold mb-3">
          Di sản Văn hóa, Nhân vật & Lễ hội tỉnh Cà Mau
        </h2>
        <p className="text-lg opacity-90 mb-4">
          Khám phá di sản văn hóa, nhân vật lịch sử và lễ hội truyền thống tỉnh Cà Mau
        </p>

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

// Chat Page Component
function ChatPage() {
  return (
    <div>
      {/* <div className="bg-gradient-to-br from-red-600 to-yellow-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-3">
          Khám phá Di sản Văn hóa tỉnh Cà Mau
        </h2>
        <p className="text-lg opacity-90">
          Trò chuyện với AI để tìm hiểu về các di sản văn hóa tỉnh Cà Mau
        </p>
      </div> */}

      <div className="h-[600px]">
        <ChatWindow />
      </div>
    </div>
  );
}

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