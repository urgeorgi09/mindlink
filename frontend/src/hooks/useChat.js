import { useState, useEffect } from 'react';
import { getChatMessages, sendChatMessage, getAIResponse } from '../services/api';
import { getOrCreateUserId } from '../utils/userId';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  
  const userId = getOrCreateUserId();

  // Load chat messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const response = await getChatMessages(userId);
        
        console.log('📥 Loaded messages:', response);
        
        const msgs = response.messages || response.data?.messages || [];
        
        // Ако няма съобщения, добави welcome message
        if (msgs.length === 0) {
          const welcomeMsg = {
            _id: 'welcome',
            message: 'Здравей! 👋 Аз съм твоят AI помощник. Как мога да ти помогна днес?',
            isAi: true,
            timestamp: new Date()
          };
          
          // Запази welcome message
          await sendChatMessage({
            userId,
            message: welcomeMsg.message,
            isAi: true
          });
          
          setMessages([welcomeMsg]);
        } else {
          setMessages(msgs);
        }
        
      } catch (err) {
        console.error('❌ Error loading messages:', err);
        setError(err.userMessage || 'Грешка при зареждане на съобщенията');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadMessages();
    }
  }, [userId]);

  // Send message function
  const sendMessage = async (text) => {
    if (!text?.trim() || sending) return null;

    try {
      setSending(true);
      setError('');

      console.log('📤 Sending message:', text);

      // Запази user message
      const userMsgResponse = await sendChatMessage({
        userId,
        message: text,
        isAi: false
      });

      const userMsg = userMsgResponse.msg || userMsgResponse.data?.msg;

      // Добави в UI
      setMessages(prev => [...prev, {
        ...userMsg,
        message: text,
        isAi: false
      }]);

      // Получи AI отговор
      let aiReply = '';
      try {
        const aiResponse = await getAIResponse(text);
        aiReply = aiResponse.reply || 'Съжалявам, не мога да отговоря в момента.';
      } catch (aiErr) {
        console.error('AI Error:', aiErr);
        aiReply = 'Съжалявам, възникна грешка при генерирането на отговор. Моля, опитай отново.';
      }

      // Запази AI message
      const aiMsgResponse = await sendChatMessage({
        userId,
        message: aiReply,
        isAi: true
      });

      const aiMsg = aiMsgResponse.msg || aiMsgResponse.data?.msg;

      // Добави AI message в UI
      setMessages(prev => [...prev, {
        ...aiMsg,
        message: aiReply,
        isAi: true
      }]);

      return aiReply;

    } catch (err) {
      console.error('❌ Send message error:', err);
      setError(err.userMessage || 'Грешка при изпращане на съобщението');
      return null;
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    message,
    setMessage,
    loading,
    sending,
    error,
    sendMessage
  };
}

export default useChat;