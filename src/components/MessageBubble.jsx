export function MessageBubble({ message, isStreaming = false }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
        ? 'bg-teal-600 text-white rounded-br-none'
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
