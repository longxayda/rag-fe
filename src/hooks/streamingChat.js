import { useState, useCallback } from "react";

export function useStreamingChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI về di sản văn hóa tỉnh Cà Mau. Bạn có thể hỏi tôi về các di sản như Lễ Hội Đờn Ca Tài Tử hoặc bất kỳ di sản văn hóa nào khác.'
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const streamFromBackend = useCallback(async (userMessage) => {
    setIsStreaming(true);
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
        
      }

      

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