import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBatchStatus } from "../hooks/usePresence";
import { StatusBadge } from "../components/StatusBadge";
import { UserGroupIcon, ChatBubbleLeftRightIcon, MagnifyingGlassIcon, InformationCircleIcon } from '../components/Icons';

const PatientChatHub = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Взимаме ID-тата на всички терапевти за batch статус заявка
  const therapistIds = therapists.map((t) => t.id);
  const statuses = useBatchStatus(therapistIds);

  useEffect(() => {
    fetchTherapists();
    const interval = setInterval(fetchTherapists, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTherapists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/patient/therapists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTherapists(data.therapists || []);
    } catch (error) {
      console.error("Error fetching therapists:", error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (therapistId) => {
    navigate(`/patient-chat/${therapistId}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Зареждане...</h2>
      </div>
    );
  }

  if (therapists.length === 0) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "50px" }}>
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <UserGroupIcon style={{ width: "64px", height: "64px", color: "#6b7280", strokeWidth: 1.5, marginBottom: "20px" }} />
          <h2 style={{ color: "#6b7280", marginBottom: "15px" }}>Нямате назначен терапевт</h2>
          <p style={{ color: "#9ca3af", marginBottom: "25px" }}>
            За да можете да чатите с терапевт, трябва първо да изпратите заявка и тя да бъде одобрена.
          </p>
          <button
            onClick={() => navigate("/therapists")}
            style={{
              padding: "12px 24px",
              background: "#91c481",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            <MagnifyingGlassIcon style={{ width: "20px", height: "20px", marginRight: "8px", display: "inline" }} />
            Намери терапевт
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "30px", color: "#1f2937", display: "flex", alignItems: "center", gap: "10px" }}>
        <ChatBubbleLeftRightIcon style={{ width: "32px", height: "32px", strokeWidth: 2 }} />
        Моите терапевти
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {therapists.map((therapist) => {
          // Вземаме реалния статус от batch заявката
          const presenceStatus = statuses[therapist.id] || { online: false, lastSeen: null };

          return (
            <div
              key={therapist.id}
              onClick={() => openChat(therapist.id)}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "2px solid transparent",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.borderColor = "#91c481";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              {therapist.unread > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
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
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {therapist.unread > 9 ? "9+" : therapist.unread}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                {/* Аватар с онлайн индикатор */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: presenceStatus.online
                        ? "linear-gradient(135deg, #91c481 0%, #7fb570 100%)"
                        : "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      transition: "background 0.3s ease",
                    }}
                  >
                    <UserGroupIcon style={{ width: "28px", height: "28px", strokeWidth: 2 }} />
                  </div>
                  {/* Малка точка върху аватара */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: presenceStatus.online ? "#91c481" : "#9ca3af",
                      border: "2px solid white",
                      animation: presenceStatus.online ? "pulse-green 2s infinite" : "none",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "#1f2937" }}>
                    {therapist.name}
                  </h3>
                  <p style={{ margin: "0 0 6px 0", color: "#6b7280", fontSize: "14px" }}>
                    {therapist.specialty}
                  </p>
                  {/* Реален статус */}
                  <StatusBadge
                    online={presenceStatus.online}
                    lastSeen={presenceStatus.lastSeen}
                  />
                </div>
              </div>

              {therapist.lastMessage && (
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#4b5563",
                      fontSize: "14px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {therapist.lastMessage}
                  </p>
                  {therapist.time && (
                    <span style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px", display: "block" }}>
                      {therapist.time}
                    </span>
                  )}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <StatusBadge
                  online={presenceStatus.online}
                  lastSeen={presenceStatus.lastSeen}
                />

                <button
                  style={{
                    padding: "8px 16px",
                    background: "#91c481",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openChat(therapist.id);
                  }}
                >
                  Отвори чат →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          background: "#e8f5e3",
          borderRadius: "12px",
          border: "1px solid #91c481",
        }}
      >
        <p style={{ margin: 0, color: "#3d5a2f", fontSize: "14px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <InformationCircleIcon style={{ width: "18px", height: "18px", strokeWidth: 2, flexShrink: 0 }} />
          Можете да чатите с всички ваши одобрени терапевти. Кликнете на някой от тях, за да започнете разговор.
        </p>
      </div>
    </div>
  );
};

export default PatientChatHub;