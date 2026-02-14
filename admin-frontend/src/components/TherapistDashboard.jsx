import React, { useState, useEffect } from "react";
import { useAnonymous } from "../context/AnonymousContext";

const TherapistDashboard = () => {
  const { userRole, canAccess } = useAnonymous();
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeChats: 0,
    todayNotes: 0,
    weeklyHours: 0,
  });

  useEffect(() => {
    // Load mock data
    const mockPatients = [
      { id: 1, name: "Анна П.", status: "active", lastContact: "2024-12-21" },
      { id: 2, name: "Георги И.", status: "active", lastContact: "2024-12-20" },
      { id: 3, name: "Мария Д.", status: "inactive", lastContact: "2024-12-18" },
    ];

    setPatients(mockPatients);
    setStats({
      totalPatients: mockPatients.length,
      activeChats: mockPatients.filter((p) => p.status === "active").length,
      todayNotes: 5,
      weeklyHours: 32,
    });
  }, []);

  if (!canAccess("therapist")) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2 style={{ color: "#ef4444" }}>🚫 Достъп отказан</h2>
        <p>Нямате права за достъп до терапевтичното табло.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#2d3748", marginBottom: "30px" }}>
        🩺 Терапевтично табло
      </h1>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>👥 Общо пациенти</h3>
          <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{stats.totalPatients}</p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #48bb78, #38a169)",
            color: "white",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>💬 Активни чатове</h3>
          <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{stats.activeChats}</p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #ed8936, #dd6b20)",
            color: "white",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>📝 Днешни бележки</h3>
          <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{stats.todayNotes}</p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #9f7aea, #805ad5)",
            color: "white",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>⏰ Седмични часове</h3>
          <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{stats.weeklyHours}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>⚡ Бързи действия</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <button
            onClick={() => (window.location.href = "/therapist-chat")}
            style={{
              background: "linear-gradient(135deg, #4299e1, #3182ce)",
              color: "white",
              border: "none",
              padding: "15px 20px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            💬 Чат с пациенти
          </button>

          <button
            onClick={() => (window.location.href = "/therapist")}
            style={{
              background: "linear-gradient(135deg, #48bb78, #38a169)",
              color: "white",
              border: "none",
              padding: "15px 20px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            📋 Управление на пациенти
          </button>

          <button
            style={{
              background: "linear-gradient(135deg, #ed8936, #dd6b20)",
              color: "white",
              border: "none",
              padding: "15px 20px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            📝 Нови бележки
          </button>

          <button
            style={{
              background: "linear-gradient(135deg, #9f7aea, #805ad5)",
              color: "white",
              border: "none",
              padding: "15px 20px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            📊 Отчети
          </button>
        </div>
      </div>

      {/* Recent Patients */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>👥 Последни пациенти</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {patients.map((patient) => (
            <div
              key={patient.id}
              style={{
                padding: "15px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => (window.location.href = "/therapist-chat")}
            >
              <div>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "600" }}>
                  {patient.name}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#718096" }}>
                  Последен контакт: {new Date(patient.lastContact).toLocaleDateString("bg-BG")}
                </p>
              </div>

              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: patient.status === "active" ? "#dcfce7" : "#fef3c7",
                  color: patient.status === "active" ? "#166534" : "#92400e",
                }}
              >
                {patient.status === "active" ? "Активен" : "Неактивен"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
