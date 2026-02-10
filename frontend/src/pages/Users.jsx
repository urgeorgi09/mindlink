import React, { useState, useEffect } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data.users.filter(u => u.role === 'user') || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
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
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        👥 Потребители ({users.length})
      </h1>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ padding: "12px", textAlign: "left", color: "#6b7280" }}>ID</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#6b7280" }}>Име</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#6b7280" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#6b7280" }}>Регистрация</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px", color: "#9ca3af" }}>#{user.id}</td>
                  <td style={{ padding: "12px", fontWeight: "600" }}>{user.name}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{user.email}</td>
                  <td style={{ padding: "12px", color: "#9ca3af", fontSize: "13px" }}>
                    {new Date(user.created_at).toLocaleDateString("bg-BG")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
