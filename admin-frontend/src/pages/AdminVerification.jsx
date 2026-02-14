import React, { useState, useEffect } from "react";

const AdminVerification = () => {
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    fetchUnverifiedTherapists();
  }, []);

  const fetchUnverifiedTherapists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/therapists/unverified", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTherapists(data.therapists || []);
    } catch (error) {
      console.error("Error fetching therapists:", error);
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
        fetchUnverifiedTherapists();
      }
    } catch (error) {
      console.error("Error verifying therapist:", error);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#2d3748", marginBottom: "30px" }}>
        🔐 Верификация на терапевти
      </h1>

      {therapists.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          <h3>Няма терапевти за верификация</h3>
          <p>Всички терапевти са верифицирани</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {therapists.map((therapist) => (
            <div
              key={therapist.id}
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#2d3748" }}>
                    👨‍⚕️ {therapist.name}
                  </h3>
                  <p style={{ margin: "5px 0", color: "#4b5563" }}>
                    <strong>Email:</strong> {therapist.email}
                  </p>
                  <p style={{ margin: "5px 0", color: "#4b5563" }}>
                    <strong>Специалност:</strong> {therapist.specialty}
                  </p>
                  {therapist.experience && (
                    <p style={{ margin: "5px 0", color: "#4b5563" }}>
                      <strong>Опит:</strong> {therapist.experience}
                    </p>
                  )}
                  {therapist.education && (
                    <p style={{ margin: "5px 0", color: "#4b5563" }}>
                      <strong>Образование:</strong> {therapist.education}
                    </p>
                  )}
                  <p style={{ margin: "5px 0", color: "#6b7280", fontSize: "14px" }}>
                    Регистриран на:{" "}
                    {new Date(therapist.created_at).toLocaleDateString("bg-BG")}
                  </p>
                </div>

                <button
                  onClick={() => verifyTherapist(therapist.id)}
                  style={{
                    padding: "10px 20px",
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  ✓ Верифицирай
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerification;
