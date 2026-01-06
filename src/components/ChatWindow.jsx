// import { useStreamingChat } from "../hooks/streamingChat";
import { useStreamingChat } from "../hooks/streamingFakeChat";
import { useState, useRef} from "react";

import { Send, Loader2, Menu, X, MessageSquare, Home, BookOpen, HelpCircle } from 'lucide-react';
import { MessageBubble } from "./MessageBubble";
import { SuggestedQuestions } from "./SuggestedQuestions";


export function ChatWindow() {
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
    <div className="flex flex-col h-full p-3 sm:p-4 lg:p-6 xl:p-8 bg-white shadow-lg overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-700 text-white px-6 py-4 flex items-center gap-3">
        <MessageSquare className="w-6 h-6" />
        <div>
          <h2 className="font-semibold text-lg">Trợ lý di sản AI</h2>
          <p className="text-xs text-emerald-100">Hỏi tôi về di sản văn hóa tỉnh Cà Mau</p>
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
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSubmit}
            disabled={isStreaming || !input.trim()}
            className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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