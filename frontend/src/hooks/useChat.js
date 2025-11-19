import { useState, useEffect } from 'react';
import { getChatMessages, sendChatMessage, getAIResponse } from '../services/api';
import { useAnonymous } from '../context/AnonymousContext';

export function useChat() {
  const { userId } = useAnonymous();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // Load chat messages
  useEffect(() => {
    if (!userId) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const response = await getChatMessages(userId);
        
        if (response.data.length === 0) {
          // Add welcome message if no history
          const welcomeMsg = {
            userId,
            message: 'Здравей! Аз съм твоят AI помощник. Как мога да ти помогна днес?',
            isAi: true,
          };
          const savedWelcome = await sendChatMessage(welcomeMsg);
          setMessages([savedWelcome.data]);
        } else {
          setMessages(response.data);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Грешка при зареждане на съобщенията.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [userId]);

  // Send message
  const sendMessage = async (text) => {
    if (!text.trim() || sending) return;

    try {
      setSending(true);
      setError('');

      // Save user message
      const userMsg = {
        userId,
        message: text,
        isAi: false,
      };
      const savedUserMsg = await sendChatMessage(userMsg);
      setMessages((prev) => [...prev, savedUserMsg.data]);

      // Get AI response
      let aiReply = '';
      try {
        const aiResponse = await getAIResponse(text);
        aiReply = aiResponse.data.reply || 'Няма отговор от AI.';
      } catch (err) {
        console.error('AI Error:', err);
        aiReply = 'Съжалявам, възникна грешка. Моля, опитай отново.';
      }

      // Save AI message
      const aiMsg = {
        userId,
        message: aiReply,
        isAi: true,
      };
      const savedAiMsg = await sendChatMessage(aiMsg);
      setMessages((prev) => [...prev, savedAiMsg.data]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Грешка при изпращане на съобщението.');
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
  };
}