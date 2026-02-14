import React, { useState, useEffect, useRef } from "react";
import { useAnonymous } from "../context/AnonymousContext";
import api from "../services/api";

const TherapistChat = ({ conversation, onBack }) => {
  const { userId, userRole } = useAnonymous();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/therapist-chat/messages/${conversation._id}`);
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post("/therapist-chat/send-message", {
        conversationId: conversation._id,
        content: newMessage,
      });

      if (response.data.success) {
        setMessages([...messages, response.data.message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getOtherParticipant = () => {
    return conversation.participants.find((p) => p.userId !== userId);
  };

  const otherParticipant = getOtherParticipant();

  if (loading) {
    return <div className="text-center py-8">Зареждане на съобщения...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-700">
            ← Назад
          </button>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-xl">{otherParticipant?.role === "therapist" ? "🩺" : "👤"}</span>
          </div>
          <div>
            <h3 className="font-semibold">
              {otherParticipant?.role === "therapist"
                ? `Терапевт ${otherParticipant.userId.slice(0, 8)}`
                : `Пациент ${otherParticipant.userId.slice(0, 8)}`}
            </h3>
            <p className="text-sm text-green-600">Онлайн</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.userId === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.userId === userId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.userId === userId ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишете съобщение..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Изпрати
          </button>
        </div>
      </form>
    </div>
  );
};

export default TherapistChat;
