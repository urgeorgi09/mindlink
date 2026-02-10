// pages/PatientChat.js - с реален онлайн статус

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StatusBadge } from "../components/StatusBadge";

const PatientChat = () => {
  const { therapistId } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);
  const [hasTherapist, setHasTherapist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [therapistStatus, setTherapistStatus] = useState({ online: false, lastSeen: null });
  const messagesEndRef = React.useRef(null);
  const typingTimeoutRef = React.useRef(null);

  const emojis = ["😊", "😢", "😰", "😡", "❤️", "👍", "🙏", "💪", "🌟", "✨"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkTherapist();
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chat/unread-count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const checkTherapist = async () => {
    try {
      const token = localStorage.getItem("token");

      const userResponse = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();
      setCurrentUserId(userData.user?.id);

      if (!therapistId) {
        navigate("/patient-chat");
        return;
      }

      const response = await fetch("/api/patient/therapists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      const selectedTherapist = (data.therapists || []).find(
        (t) => t.id === parseInt(therapistId)
      );

      if (selectedTherapist) {
        setHasTherapist(true);
        setTherapist(selectedTherapist);
        setMessages([]);
      } else {
        setHasTherapist(false);
      }
    } catch (error) {
      console.error("Error checking therapist:", error);
      setHasTherapist(false);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: therapist.id,
          text: newMessage,
          isImportant: false,
        }),
      });

      setNewMessage("");
      setShowEmojiPicker(false);
      sendTypingStatus(false);
      loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendTypingStatus = async (typing) => {
    if (!therapist) return;
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/chat/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId: therapist.id, typing }),
      });
    } catch {
      // Silent fail
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!therapist) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (value.length > 0) {
      sendTypingStatus(true);
      typingTimeoutRef.current = setTimeout(() => sendTypingStatus(false), 1000);
    } else {
      sendTypingStatus(false);
    }
  };

  const loadMessages = async () => {
    if (!therapist || !currentUserId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/chat/messages/${therapist.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) { setMessages([]); return; }

      const data = await response.json();
      if (!data.messages) { setMessages([]); return; }

      const formattedMessages = data.messages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender_id === currentUserId ? "me" : "other",
        time: msg.time,
        isImportant: msg.is_important,
      }));

      setMessages(formattedMessages);
      setTimeout(() => scrollToBottom(), 50);

      if (data.isTyping !== undefined) setIsTyping(data.isTyping);
    } catch (error) {
      setMessages([]);
    }
  };

  useEffect(() => {
    if (hasTherapist && therapist && currentUserId) {
      loadMessages();
      const interval = setInterval(loadMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [hasTherapist, therapist, currentUserId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Зареждане...</h2>
      </div>
    );
  }

  if (!hasTherapist) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "50px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>👩‍⚕️</div>
          <h2 style={{ color: "#6b7280", marginBottom: "15px" }}>Нямате назначен терапевт</h2>
          <p style={{ color: "#9ca3af", marginBottom: "25px" }}>
            За да можете да чатите с терапевт, трябва първо да изпратите заявка и тя да бъде одобрена.
          </p>
          <a
            href="/therapists"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#22c55e",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            🔍 Намери терапевт
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          overflow: "hidden",
          height: "70vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Хедър */}
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            color: "white",
            position: "relative",
          }}
        >
          <button
            onClick={() => navigate("/patient-chat")}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ← Назад
          </button>

          {unreadCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#ef4444",
                color: "white",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {unreadCount}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "15px", justifyContent: "center", paddingTop: "10px" }}>
            {/* Аватар с онлайн точка */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                🩺
              </div>
              {/* Онлайн точка върху аватара */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1px",
                  right: "1px",
                  width: "13px",
                  height: "13px",
                  borderRadius: "50%",
                  background: therapistStatus.online ? "#86efac" : "#d1d5db",
                  border: "2px solid rgba(255,255,255,0.8)",
                  transition: "background 0.4s ease",
                  animation: therapistStatus.online ? "pulse-green 2s infinite" : "none",
                }}
              />
            </div>

            <div>
              <h3 style={{ margin: "0 0 4px 0" }}>{therapist.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ opacity: 0.85, fontSize: "14px" }}>{therapist.specialty}</span>
                <span style={{ opacity: 0.5 }}>•</span>
                {/* Реален статус в хедъра */}
                {therapistStatus.loading ? (
                  <span style={{ fontSize: "13px", opacity: 0.7 }}>...</span>
                ) : therapistStatus.online ? (
                  <span style={{ color: "#86efac", fontSize: "13px", fontWeight: 600 }}>
                    ● онлайн
                  </span>
                ) : (
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                    ○ офлайн
                    {therapistStatus.lastSeen && (
                      <span style={{ marginLeft: "4px", fontSize: "12px" }}>
                        (последно: {formatLastSeen(therapistStatus.lastSeen)})
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Съобщения */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            background: "#f9fafb",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {messages.length === 0 && !isTyping && (
            <div style={{ textAlign: "center", color: "#6b7280", padding: "20px", marginTop: "20px" }}>
              <p>Няма съобщения все още</p>
              <p style={{ fontSize: "14px" }}>Започнете разговор с вашия терапевт</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: "15px",
                display: "flex",
                justifyContent: message.sender === "me" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "12px 16px",
                  borderRadius: "18px",
                  background: message.sender === "me" ? "#22c55e" : "white",
                  color: message.sender === "me" ? "white" : "#374151",
                  boxShadow: message.isImportant
                    ? "0 0 0 3px #fbbf24"
                    : "0 1px 3px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                {message.isImportant && (
                  <div style={{ position: "absolute", top: "-8px", right: "-8px", fontSize: "20px" }}>⭐</div>
                )}
                <p style={{ margin: "0 0 5px 0" }}>{message.text}</p>
                <span style={{ fontSize: "12px", opacity: 0.7 }}>{message.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ marginBottom: "15px", display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  borderRadius: "18px",
                  background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <span style={{ color: "#6b7280", fontSize: "14px" }}>💬 пише...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле за писане */}
        <div style={{ padding: "20px", borderTop: "1px solid #e5e7eb", background: "white" }}>
          {showEmojiPicker && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "8px",
                marginBottom: "10px",
                padding: "10px",
                background: "#f9fafb",
                borderRadius: "12px",
              }}
            >
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => { setNewMessage(newMessage + emoji); setShowEmojiPicker(false); }}
                  style={{ fontSize: "24px", border: "none", background: "transparent", cursor: "pointer", padding: "5px" }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              style={{ padding: "12px", background: "#f3f4f6", border: "none", borderRadius: "25px", cursor: "pointer", fontSize: "20px" }}
            >
              😊
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Напишете съобщение..."
              style={{ flex: 1, padding: "12px 16px", border: "1px solid #d1d5db", borderRadius: "25px", fontSize: "16px", outline: "none" }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              style={{
                padding: "12px 24px",
                background: newMessage.trim() ? "#22c55e" : "#9ca3af",
                color: "white",
                border: "none",
                borderRadius: "25px",
                cursor: newMessage.trim() ? "pointer" : "not-allowed",
                fontSize: "16px",
              }}
            >
              Изпрати
            </button>
          </div>

          <div style={{ marginTop: "10px", fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
            💡 Споделете свободно мислите и чувствата си
          </div>
        </div>
      </div>
    </div>
  );
};

// Локална помощна функция за форматиране на "последно виждан"
function formatLastSeen(isoString) {
  if (!isoString) return null;
  const diff = Date.now() - new Date(isoString);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return "току що";
  if (mins < 60) return `преди ${mins} мин`;
  if (hours < 24) return `преди ${hours} ч`;
  return `преди ${Math.floor(diff / 86400000)} дни`;
}

export default PatientChat;