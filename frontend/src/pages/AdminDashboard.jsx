import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [therapists, setTherapists] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('therapists');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists();
    fetchAllUsers();
  }, []);

  const fetchTherapists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/therapists/unverified", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTherapists(data.therapists || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAllUsers(data.users || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const verifyTherapist = async (therapistId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/therapists/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ therapistId }),
      });

      if (response.ok) {
        alert("Терапевтът е верифициран успешно!");
        fetchTherapists();
        fetchAllUsers();
      }
    } catch (error) {
      alert("Грешка при верификация");
    }
  };

  const getRoleBadge = (role, verified) => {
    if (role === 'admin') return { emoji: '⚙️', text: 'Админ', color: '#ef4444' };
    if (role === 'therapist') {
      return verified 
        ? { emoji: '✅', text: 'Терапевт', color: '#10b981' }
        : { emoji: '⏳', text: 'Чака верификация', color: '#f59e0b' };
    }
    return { emoji: '👤', text: 'Потребител', color: '#3b82f6' };
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div style={{ fontSize: "48px" }}>⏳</div>
        <p>Зареждане...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
        ⚙️ Админ Панел
      </h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('therapists')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'therapists' ? '#ef4444' : '#e5e7eb',
            color: activeTab === 'therapists' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🩺 Терапевти ({therapists.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'users' ? '#ef4444' : '#e5e7eb',
            color: activeTab === 'users' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          👥 Всички акаунти ({allUsers.length})
        </button>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {activeTab === 'therapists' ? (
          <>
            <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
              🩺 Терапевти за верификация
            </h2>

            {therapists.length === 0 ? (
              <p style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>
                Няма терапевти за верификация
              </p>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                {therapists.map((therapist) => (
                  <div
                    key={therapist.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                        {therapist.name}
                      </h3>
                      <p style={{ margin: "4px 0", color: "#6b7280" }}>
                        📧 {therapist.email}
                      </p>
                      <p style={{ margin: "4px 0", color: "#6b7280" }}>
                        🏥 {therapist.specialty || "Не е посочена специалност"}
                      </p>
                      {therapist.education && (
                        <p style={{ margin: "4px 0", color: "#6b7280" }}>
                          🎓 {therapist.education}
                        </p>
                      )}
                      <p style={{ margin: "4px 0", fontSize: "12px", color: "#9ca3af" }}>
                        Регистриран: {new Date(therapist.created_at).toLocaleDateString("bg-BG")}
                      </p>
                    </div>
                    <button
                      onClick={() => verifyTherapist(therapist.id)}
                      style={{
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      ✓ Верифицирай
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
              👥 Всички акаунти
            </h2>
            <div style={{ display: "grid", gap: "15px" }}>
              {allUsers.map((user) => {
                const badge = getRoleBadge(user.role, user.verified);
                return (
                  <div
                    key={user.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "20px",
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                          {user.name}
                        </h3>
                        <p style={{ margin: "4px 0", color: "#6b7280" }}>
                          📧 {user.email}
                        </p>
                        {user.specialty && (
                          <p style={{ margin: "4px 0", color: "#6b7280" }}>
                            🏥 {user.specialty}
                          </p>
                        )}
                        {user.uin && (
                          <p style={{ margin: "4px 0", color: "#6b7280" }}>
                            🆔 УИН: {user.uin}
                          </p>
                        )}
                        <p style={{ margin: "4px 0", fontSize: "12px", color: "#9ca3af" }}>
                          Регистриран: {new Date(user.created_at).toLocaleDateString("bg-BG")}
                        </p>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: badge.color + '20',
                        color: badge.color,
                        border: `1px solid ${badge.color}40`
                      }}>
                        {badge.emoji} {badge.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
