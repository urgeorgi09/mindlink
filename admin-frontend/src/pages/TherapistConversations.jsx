import React, { useState, useEffect } from "react";
import { useAnonymous } from "../context/AnonymousContext";

const TherapistConversations = () => {
  const { userRole, canAccess } = useAnonymous();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        patientName: "Анна Петрова",
        patientId: "patient_1",
        lastMessage: "Благодаря за сесията днес. Чувствам се по-добре.",
        lastMessageTime: "2024-12-21T14:30:00",
        unreadCount: 2,
        status: "active",
      },
      {
        id: 2,
        patientName: "Георги Иванов",
        patientId: "patient_2",
        lastMessage: "Имам въпрос относно упражненията.",
        lastMessageTime: "2024-12-21T10:15:00",
        unreadCount: 0,
        status: "active",
      },
      {
        id: 3,
        patientName: "Мария Димитрова",
        patientId: "patient_3",
        lastMessage: "Ще се видим следващата седмица.",
        lastMessageTime: "2024-12-20T16:45:00",
        unreadCount: 1,
        status: "pending",
      },
    ];

    setConversations(mockConversations);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString("bg-BG");
    }
  };

  if (!canAccess("therapist")) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2 style={{ color: "#ef4444" }}>🚫 Достъп отказан</h2>
        <p>Нямате права за достъп до разговорите с пациенти.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#2d3748", marginBottom: "30px" }}>
        💬 Разговори с пациенти
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: selectedConversation ? "400px 1fr" : "1fr",
          gap: "20px",
          height: "calc(100vh - 200px)",
        }}
      >
        {/* Conversations List */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "18px", color: "#2d3748" }}>
              Активни разговори ({conversations.length})
            </h2>
          </div>

          <div style={{ height: "100%", overflowY: "auto" }}>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                style={{
                  padding: "20px",
                  borderBottom: "1px solid #f1f5f9",
                  cursor: "pointer",
                  background: selectedConversation?.id === conversation.id ? "#e0f2fe" : "white",
                  borderLeft:
                    selectedConversation?.id === conversation.id
                      ? "4px solid #0ea5e9"
                      : "4px solid transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                    {conversation.patientName}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {conversation.unreadCount > 0 && (
                      <span
                        style={{
                          background: "#ef4444",
                          color: "white",
                          borderRadius: "10px",
                          padding: "2px 6px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        {conversation.unreadCount}
                      </span>
                    )}
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "600",
                        background: conversation.status === "active" ? "#dcfce7" : "#fef3c7",
                        color: conversation.status === "active" ? "#166534" : "#92400e",
                      }}
                    >
                      {conversation.status === "active" ? "Активен" : "Чакащ"}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "14px",
                    color: "#64748b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {conversation.lastMessage}
                </p>

                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {formatTime(conversation.lastMessageTime)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Details */}
        {selectedConversation && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "18px", color: "#2d3748" }}>
                {selectedConversation.patientName}
              </h2>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#64748b" }}>
                ID: {selectedConversation.patientId}
              </p>
            </div>

            <div
              style={{
                flex: 1,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  background: "#f0f9ff",
                  borderRadius: "12px",
                  border: "1px solid #e0f2fe",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#0369a1" }}>
                  📋 Информация за пациента
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    fontSize: "14px",
                  }}
                >
                  <div>
                    <strong>Статус:</strong>{" "}
                    {selectedConversation.status === "active" ? "Активен" : "Чакащ"}
                  </div>
                  <div>
                    <strong>Последно съобщение:</strong>{" "}
                    {formatTime(selectedConversation.lastMessageTime)}
                  </div>
                  <div>
                    <strong>Непрочетени:</strong> {selectedConversation.unreadCount}
                  </div>
                  <div>
                    <strong>ID:</strong> {selectedConversation.patientId}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => (window.location.href = "/therapist-chat")}
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  💬 Отвори чат
                </button>

                <button
                  style={{
                    background: "linear-gradient(135deg, #48bb78, #38a169)",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📝 Добави бележка
                </button>

                <button
                  style={{
                    background: "linear-gradient(135deg, #ed8936, #dd6b20)",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📊 Преглед на прогреса
                </button>
              </div>

              <div
                style={{
                  padding: "15px",
                  background: "#fef3c7",
                  borderRadius: "8px",
                  border: "1px solid #fbbf24",
                }}
              >
                <h4 style={{ margin: "0 0 8px 0", color: "#92400e" }}>⚠️ Последно съобщение:</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#92400e" }}>
                  "{selectedConversation.lastMessage}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistConversations;
