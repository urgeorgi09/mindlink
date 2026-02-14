import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const TherapistChat = () => {
  const { colors } = useTheme();
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("patients");
  const [isTyping, setIsTyping] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = React.useRef(null);
  const typingTimeoutRef = React.useRef(null);

  const emojis = ["😊", "😢", "😰", "😡", "❤️", "👍", "🙏", "💪", "🌟", "✨"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    
    scrollToBottom();
  }, [messages, selectedPatient]);

  useEffect(() => {
    fetchRequests();
    fetchPatients();
    // Симулирани съобщения
    setMessages({
      1: [
        { id: 1, text: "Здравейте, доктор", sender: "patient", time: "14:25" },
        {
          id: 2,
          text: "Здравей, Мария! Как се чувстваш днес?",
          sender: "therapist",
          time: "14:27",
        },
        { id: 3, text: "По-добре, благодаря", sender: "patient", time: "14:30" },
      ],
    });
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/therapist/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/therapist/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient) return;

    try {
      const token = localStorage.getItem("token");
      await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: selectedPatient.id,
          text: newMessage,
          isImportant: false,
        }),
      });

      setNewMessage("");
      setShowEmojiPicker(false);
      sendTypingStatus(false);
      loadMessages(selectedPatient.id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendTypingStatus = async (typing) => {
    if (!selectedPatient) return;
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/chat/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: selectedPatient.id,
          typing,
        }),
      });
    } catch (error) {
      // Silent fail
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    
    if (!selectedPatient) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (value.length > 0) {
      sendTypingStatus(true);
      
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStatus(false);
      }, 1000);
    } else {
      sendTypingStatus(false);
    }
  };

  const loadMessages = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/chat/messages/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setMessages((prev) => ({ ...prev, [patientId]: [] }));
        return;
      }

      const data = await response.json();

      if (!data.messages) {
        setMessages((prev) => ({ ...prev, [patientId]: [] }));
        return;
      }

      const formattedMessages = data.messages.map((msg) => {
        const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
        return {
          id: msg.id,
          text: msg.text,
          sender: msg.sender_id === currentUserId ? "therapist" : "patient",
          time: msg.time,
          isImportant: msg.is_important,
        };
      });

      setMessages((prev) => ({
        ...prev,
        [patientId]: formattedMessages,
      }));
      // Ensure scroll to bottom after messages update
      setTimeout(() => scrollToBottom(), 50);
      
      // Check typing status
      if (data.isTyping !== undefined) {
        setIsTyping((prev) => ({ ...prev, [patientId]: data.isTyping }));
      }
    } catch (error) {
      setMessages((prev) => ({ ...prev, [patientId]: [] }));
    }
  };

  useEffect(() => {
    if (selectedPatient) {
      loadMessages(selectedPatient.id);
      const interval = setInterval(() => loadMessages(selectedPatient.id), 2000);
      return () => clearInterval(interval);
    }
  }, [selectedPatient]);

  const acceptRequest = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/therapist/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ patientId }),
      });

      if (response.ok) {
        fetchRequests();
        fetchPatients();
        setActiveTab("patients");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "80vh", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Списък с пациенти */}
      <div
        style={{
          width: "300px",
          borderRight: `1px solid ${colors.border}`,
          background: colors.surface,
        }}
      >
        <div style={{ padding: "20px", borderBottom: `1px solid ${colors.border}` }}>
          <h2 style={{ margin: "0 0 15px 0", color: colors.primary }}>💬 Пациенти</h2>

          {/* Табове */}
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              onClick={() => setActiveTab("patients")}
              style={{
                flex: 1,
                padding: "8px 12px",
                background: activeTab === "patients" ? colors.primary : "transparent",
                color: activeTab === "patients" ? "white" : colors.textSecondary,
                border: `1px solid ${colors.primary}`,
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Чатове
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              style={{
                flex: 1,
                padding: "8px 12px",
                background: activeTab === "requests" ? colors.primary : "transparent",
                color: activeTab === "requests" ? "white" : colors.textSecondary,
                border: `1px solid ${colors.primary}`,
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
                position: "relative",
              }}
            >
              Заявки
              {requests.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {requests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div style={{ overflowY: "auto", height: "calc(100% - 120px)" }}>
          {activeTab === "patients" &&
            patients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                style={{
                  padding: "15px 20px",
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: "pointer",
                  background:
                    selectedPatient?.id === patient.id ? `${colors.primary}20` : "transparent",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", color: colors.text }}>
                    {patient.name}
                  </h4>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/patient-emotions/${patient.id}`;
                      }}
                      style={{
                        padding: "4px 8px",
                        background: colors.primary,
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      📊 Емоции
                    </button>
                    {patient.unread > 0 && (
                      <span
                        style={{
                          background: "#ef4444",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        {patient.unread}
                      </span>
                    )}
                  </div>
                </div>
                <p style={{ margin: "0", color: colors.textSecondary, fontSize: "14px" }}>
                  {patient.lastMessage}
                </p>
                <span style={{ fontSize: "12px", color: colors.textSecondary }}>
                  {patient.time}
                </span>
              </div>
            ))}

          {activeTab === "requests" &&
            requests.map((request) => (
              <div
                key={request.id}
                style={{
                  padding: "15px 20px",
                  borderBottom: `1px solid ${colors.border}`,
                  background: `${colors.warning}20`,
                }}
              >
                <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", color: colors.warning }}>
                  📝 {request.name}
                </h4>
                <p style={{ margin: "0", color: colors.textSecondary, fontSize: "14px" }}>
                  Нова заявка за терапия
                </p>
                <span style={{ fontSize: "12px", color: colors.textSecondary }}>
                  {new Date(request.requestDate).toLocaleDateString("bg-BG")}
                </span>
                <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                  <button
                    onClick={() => acceptRequest(request.id)}
                    style={{
                      padding: "4px 8px",
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Приеми
                  </button>
                  <button
                    style={{
                      padding: "4px 8px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Откажи
                  </button>
                </div>
              </div>
            ))}

          {activeTab === "requests" && requests.length === 0 && (
            <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
              Няма нови заявки
            </div>
          )}
        </div>
      </div>

      {/* Чат прозорец */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedPatient ? (
          <>
            {/* Хедър */}
            <div
              style={{
                padding: "20px",
                borderBottom: `1px solid ${colors.border}`,
                background: colors.surface,
              }}
            >
              <h3 style={{ margin: 0, color: colors.primary }}>🩺 {selectedPatient.name}</h3>
            </div>

            {/* Съобщения */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                background: colors.background,
              }}
            >
              {(messages[selectedPatient.id] || []).map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: "15px",
                    display: "flex",
                    justifyContent: message.sender === "therapist" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "12px 16px",
                      borderRadius: "18px",
                      background: message.sender === "therapist" ? colors.primary : colors.surface,
                      color: message.sender === "therapist" ? "white" : colors.text,
                      boxShadow: message.isImportant 
                        ? "0 0 0 3px #fbbf24" 
                        : "0 1px 3px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                    }}
                  >
                    {message.isImportant && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          fontSize: "20px",
                        }}
                      >
                        ⭐
                      </div>
                    )}
                    <p style={{ margin: "0 0 5px 0" }}>{message.text}</p>
                    <span
                      style={{
                        fontSize: "12px",
                        opacity: 0.7,
                      }}
                    >
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping[selectedPatient.id] && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "18px",
                      background: colors.surface,
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>
                      💬 пише...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле за писане */}
            <div
              style={{
                padding: "20px",
                borderTop: `1px solid ${colors.border}`,
                background: colors.surface,
              }}
            >
              {showEmojiPicker && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                    padding: "10px",
                    background: colors.background,
                    borderRadius: "12px",
                  }}
                >
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setNewMessage(newMessage + emoji);
                        setShowEmojiPicker(false);
                      }}
                      style={{
                        fontSize: "24px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        padding: "5px",
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  style={{
                    padding: "12px",
                    background: colors.background,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                >
                  😊
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Напишете съобщение..."
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "25px",
                    fontSize: "16px",
                    outline: "none",
                    background: colors.background,
                    color: colors.text,
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    padding: "12px 24px",
                    background: colors.primary,
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  Изпрати
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h3>Изберете пациент</h3>
              <p>Кликнете върху пациент от списъка, за да започнете разговор</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistChat;
