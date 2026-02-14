import React, { useState, useEffect } from "react";
import { useAnonymous } from "../context/AnonymousContext";

const AdminDashboard = () => {
  const { userRole, canAccess } = useAnonymous();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTherapists: 0,
    activeChats: 0,
    systemHealth: "good",
  });
  const [users, setUsers] = useState([]);
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    // Load mock data
    const mockUsers = [
      {
        id: 1,
        name: "Анна Петрова",
        email: "anna@example.com",
        role: "user",
        status: "active",
        joinDate: "2024-01-15",
      },
      {
        id: 2,
        name: "Георги Иванов",
        email: "georgi@example.com",
        role: "user",
        status: "active",
        joinDate: "2024-02-10",
      },
      {
        id: 3,
        name: "Мария Димитрова",
        email: "maria@example.com",
        role: "user",
        status: "inactive",
        joinDate: "2024-03-05",
      },
    ];

    const mockTherapists = [
      {
        id: 1,
        name: "Д-р Иванова",
        email: "dr.ivanova@example.com",
        role: "therapist",
        status: "active",
        patients: 15,
      },
      {
        id: 2,
        name: "Д-р Петров",
        email: "dr.petrov@example.com",
        role: "therapist",
        status: "active",
        patients: 12,
      },
    ];

    setUsers(mockUsers);
    setTherapists(mockTherapists);
    setStats({
      totalUsers: mockUsers.length,
      totalTherapists: mockTherapists.length,
      activeChats: 8,
      systemHealth: "good",
    });
  }, []);

  if (userRole !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2 style={{ color: "#ef4444" }}>🚫 Достъп отказан</h2>
        <p>Нямате права за достъп до админ панела.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#2d3748", marginBottom: "30px" }}>
        ⚙️ Админ панел
      </h1>

      {/* System Stats */}
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
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "white",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>👥 Общо потребители</h3>
          <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{stats.totalUsers}</p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #9333ea, #7c3aed)",
            color: "white",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>🩺 Терапевти</h3>
          <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{stats.totalTherapists}</p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
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
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "white",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>🔧 Система</h3>
          <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
            {stats.systemHealth === "good" ? "✅ Работи" : "❌ Проблем"}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Users Management */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>👥 Управление на потребители</h2>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  padding: "15px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "600" }}>
                    {user.name}
                  </h3>
                  <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#718096" }}>
                    {user.email}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                    Регистриран: {new Date(user.joinDate).toLocaleDateString("bg-BG")}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: user.status === "active" ? "#dcfce7" : "#fef3c7",
                      color: user.status === "active" ? "#166534" : "#92400e",
                    }}
                  >
                    {user.status === "active" ? "Активен" : "Неактивен"}
                  </span>

                  <button
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    Блокирай
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Therapists Management */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>🩺 Управление на терапевти</h2>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {therapists.map((therapist) => (
              <div
                key={therapist.id}
                style={{
                  padding: "15px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "600" }}>
                    {therapist.name}
                  </h3>
                  <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#718096" }}>
                    {therapist.email}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                    Пациенти: {therapist.patients}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: therapist.status === "active" ? "#dcfce7" : "#fef3c7",
                      color: therapist.status === "active" ? "#166534" : "#92400e",
                    }}
                  >
                    {therapist.status === "active" ? "Активен" : "Неактивен"}
                  </span>

                  <button
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    Преглед
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Actions */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginTop: "30px",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>🔧 Системни действия</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <button
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "white",
              border: "none",
              padding: "15px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            📊 Генерирай отчет
          </button>

          <button
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              border: "none",
              padding: "15px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            💾 Backup данни
          </button>

          <button
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "white",
              border: "none",
              padding: "15px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🔄 Рестарт система
          </button>

          <button
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "white",
              border: "none",
              padding: "15px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🚨 Аварийно спиране
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
