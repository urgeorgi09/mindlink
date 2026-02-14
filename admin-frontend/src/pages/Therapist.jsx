import React, { useState, useEffect } from "react";
import { ShieldCheckIcon, ClockIcon, CheckCircleIcon } from '../components/Icons';

const Therapist = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTherapists(data.users.filter(u => u.role === 'therapist') || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <ClockIcon style={{ width: "48px", height: "48px", strokeWidth: 1.5, color: "#9ca3af", margin: "0 auto 10px" }} />
        <p>Зареждане...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <ShieldCheckIcon style={{ width: "32px", height: "32px", strokeWidth: 2 }} />
        Терапевти ({therapists.length})
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
                <th style={{ padding: "12px", textAlign: "left", color: "#6b7280" }}>Специалност</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#6b7280" }}>УИН</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#6b7280" }}>Статус</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#6b7280" }}>Регистрация</th>
              </tr>
            </thead>
            <tbody>
              {therapists.map((therapist) => (
                <tr key={therapist.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px", color: "#9ca3af" }}>#{therapist.id}</td>
                  <td style={{ padding: "12px", fontWeight: "600" }}>{therapist.name}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{therapist.email}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>
                    {therapist.specialty || '-'}
                  </td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>
                    {therapist.uin || '-'}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: therapist.verified ? '#10b98120' : '#f59e0b20',
                      color: therapist.verified ? '#10b981' : '#f59e0b',
                      border: `1px solid ${therapist.verified ? '#10b98140' : '#f59e0b40'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {therapist.verified ? (
                        <><CheckCircleIcon style={{ width: "14px", height: "14px", strokeWidth: 2 }} /> Верифициран</>
                      ) : (
                        <><ClockIcon style={{ width: "14px", height: "14px", strokeWidth: 2 }} /> Чака верификация</>
                      )}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "#9ca3af", fontSize: "13px" }}>
                    {new Date(therapist.created_at).toLocaleDateString("bg-BG")}
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

export default Therapist;
