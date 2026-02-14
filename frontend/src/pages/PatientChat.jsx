// pages/PatientChat.js - с реален онлайн статус

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStatus } from "../hooks/usePresence";
import { StatusBadge } from "../components/StatusBadge";
import { UserGroupIcon, ArrowLeftIcon, ChatBubbleLeftRightIcon, StarIcon, FaceSmileIcon, InformationCircleIcon, MagnifyingGlassIcon } from '../components/Icons';

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
  const messagesEndRef = React.useRef(null);
  const typingTimeoutRef = React.useRef(null);
  const messagesContainerRef = React.useRef(null);
  const prevMessagesLengthRef = React.useRef(0);
  const isMobile = window.innerWidth < 768;

  // Реален онлайн статус
  const therapistStatus = useUserStatus(therapist?.id);

  const emojis = ["😊", "😢", "😰", "😡", "❤️", "👍", "🙏", "💪", "🌟", "✨"];

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      prevMessagesLengthRef.current = messages.length;
      scrollToBottom();
    }
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
          <UserGroupIcon style={{ width: "64px", height: "64px", color: "#6b7280", strokeWidth: 1.5, marginBottom: "20px" }} />
          <h2 style={{ color: "#6b7280", marginBottom: "15px" }}>Нямате назначен терапевт</h2>
          <p style={{ color: "#9ca3af", marginBottom: "25px" }}>
            За да можете да чатите с терапевт, трябва първо да изпратите заявка и тя да бъде одобрена.
          </p>
          <a
            href="/therapists"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 24px",
              background: "linear-gradient(135deg, #91c481 0%, #7fb570 100%)",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "all 0.2s ease",
            }}
          >
            <MagnifyingGlassIcon style={{ width: "20px", height: "20px", marginRight: "8px" }} />
            Намери терапевт
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: isMobile ? "100%" : "800px", margin: "0 auto", padding: isMobile ? "0" : "0 20px", height: isMobile ? "calc(100vh - 60px)" : "auto" }}>
      <div
        style={{
          background: "white",
          borderRadius: isMobile ? "0" : "12px",
          boxShadow: isMobile ? "none" : "0 4px 20px rgba(0,0,0,0.1)",
          overflow: "hidden",
          height: isMobile ? "100%" : "70vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Хедър */}
        <div
          style={{
            padding: isMobile ? "10px 12px" : "20px",
            background: "linear-gradient(135deg, #91c481 0%, #7fb570 100%)",
            color: "white",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {!isMobile && (
            <button
              onClick={() => navigate("/patient-chat")}
              style={{
                position: "absolute",
                top: "15px",
                left: "15px",
                background: "rgba(255,255,255,0.95)",
                color: "#7fb570",
                border: "none",
                padding: "10px 16px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateX(-3px)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateX(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
              }}
            >
              <ArrowLeftIcon style={{ width: "18px", height: "18px", strokeWidth: 2.5 }} /> Назад
            </button>
          )}

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

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "15px", justifyContent: "center", paddingTop: "0" }}>
            {/* Аватар с онлайн точка */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: isMobile ? "32px" : "50px",
                  height: isMobile ? "32px" : "50px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "16px" : "24px",
                }}
              >
                <UserGroupIcon style={{ width: isMobile ? "16px" : "24px", height: isMobile ? "16px" : "24px", strokeWidth: 2 }} />
              </div>
              {/* Онлайн точка върху аватара */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1px",
                  right: "1px",
                  width: isMobile ? "10px" : "13px",
                  height: isMobile ? "10px" : "13px",
                  borderRadius: "50%",
                  background: therapistStatus.online ? "#7fb570" : "#d1d5db",
                  border: "2px solid rgba(255,255,255,0.8)",
                  transition: "background 0.4s ease",
                  animation: therapistStatus.online ? "pulse-green 2s infinite" : "none",
                }}
              />
            </div>

            <div>
              <h3 style={{ margin: "0 0 2px 0", fontSize: isMobile ? "15px" : "18px" }}>{therapist.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: isMobile ? "11px" : "14px" }}>
                <span style={{ opacity: 0.85, fontSize: isMobile ? "11px" : "14px" }}>{therapist.specialty}</span>
                <span style={{ opacity: 0.5 }}>•</span>
                {/* Реален статус в хедъра */}
                {therapistStatus.loading ? (
                  <span style={{ fontSize: "13px", opacity: 0.7 }}>...</span>
                ) : therapistStatus.online ? (
                  <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600 }}>
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
          ref={messagesContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: isMobile ? "10px" : "20px",
            background: "#f9fafb",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            width: "100%",
            maxWidth: "100%",
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
                alignItems: message.sender === "me" ? "flex-end" : "flex-start",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  maxWidth: isMobile ? "85%" : "70%",
                  padding: isMobile ? "8px 12px" : "12px 16px",
                  borderRadius: message.sender === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: message.sender === "me" ? "#91c481" : "white",
                  color: message.sender === "me" ? "white" : "#374151",
                  boxShadow: message.isImportant
                    ? "0 0 0 3px #fbbf24"
                    : "0 1px 3px rgba(0,0,0,0.1)",
                  position: "relative",
                  fontSize: isMobile ? "13px" : "16px",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  width: "fit-content",
                }}
              >
                {message.isImportant && (
                  <div style={{ position: "absolute", top: "-8px", right: "-8px" }}>
                    <StarIcon style={{ width: "20px", height: "20px", color: "#fbbf24", fill: "#fbbf24" }} />
                  </div>
                )}
                <p style={{ margin: "0 0 4px 0" }}>{message.text}</p>
                <span style={{ fontSize: isMobile ? "10px" : "12px", opacity: 0.7 }}>{message.time}</span>
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
                <ChatBubbleLeftRightIcon style={{ width: "18px", height: "18px", color: "#6b7280", strokeWidth: 2, marginRight: "6px" }} />
                <span style={{ color: "#6b7280", fontSize: "14px" }}>пише...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле за писане */}
        <div style={{ padding: isMobile ? "10px 12px" : "20px", borderTop: "1px solid #e5e7eb", background: "white", flexShrink: 0 }}>
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

          <div style={{ display: "flex", gap: isMobile ? "6px" : "10px" }}>
            {!isMobile && (
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{ padding: "12px", background: "#f3f4f6", border: "none", borderRadius: "25px", cursor: "pointer", fontSize: "20px" }}
              >
                <FaceSmileIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />
              </button>
            )}
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Напишете съобщение..."
              style={{ flex: 1, padding: isMobile ? "8px 12px" : "12px 16px", border: "1px solid #d1d5db", borderRadius: "25px", fontSize: isMobile ? "13px" : "16px", outline: "none" }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              style={{
                padding: isMobile ? "8px 14px" : "10px 16px",
                background: newMessage.trim() ? "rgba(255,255,255,0.95)" : "#9ca3af",
                color: newMessage.trim() ? "#7fb570" : "white",
                border: "none",
                borderRadius: "12px",
                cursor: newMessage.trim() ? "pointer" : "not-allowed",
                fontSize: isMobile ? "13px" : "15px",
                fontWeight: 700,
                boxShadow: newMessage.trim() ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (newMessage.trim() && !isMobile) {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (newMessage.trim() && !isMobile) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                }
              }}
            >
              {isMobile ? "➤" : "Изпрати"}
            </button>
          </div>

          {!isMobile && (
            <div style={{ marginTop: "8px", fontSize: "11px", color: "#6b7280", textAlign: "center" }}>
              <InformationCircleIcon style={{ width: "14px", height: "14px", color: "#6b7280", strokeWidth: 2, marginRight: "4px" }} />
              Споделете свободно мислите и чувствата си
            </div>
          )}
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