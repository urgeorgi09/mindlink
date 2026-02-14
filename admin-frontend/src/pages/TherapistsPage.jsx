import React, { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import TherapistProfile from "../components/TherapistProfile";
import { ShieldCheckIcon, CalendarIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, StarIcon, BanknotesIcon } from '../components/Icons';

const TherapistsPage = () => {
  const toast = useToast();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTherapistId, setSelectedTherapistId] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await fetch("/api/therapists");
      const data = await response.json();
      setTherapists(data.therapists || []);
    } catch (error) {
      console.error("Error fetching therapists:", error);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    { value: "all", label: "Всички" },
    { value: "Клиничен психолог", label: "Клинични психолози" },
    { value: "Психотерапевт", label: "Психотерапевти" },
    { value: "Детски психолог", label: "Детски психолози" },
    { value: "Психиатър", label: "Психиатри" },
  ];

  const filteredTherapists =
    selectedSpecialty === "all"
      ? therapists
      : therapists.filter((t) => t.specialty === selectedSpecialty);

  const bookAppointment = async (therapist) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/therapist/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ therapistId: therapist.id }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Заявката е изпратена към ${therapist.name}`);
      } else {
        toast.error(data.message || "Грешка при изпращане на заявката");
      }
    } catch (error) {
      toast.error("Грешка в мрежата");
    }
  };

  const showSuccessPopup = (message) => {
    const popup = document.createElement("div");
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      z-index: 10000;
      text-align: center;
      min-width: 300px;
    `;

    popup.innerHTML = `
      <div style="margin-bottom: 15px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" style="margin: 0 auto; display: block;">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <h3 style="margin: 0 0 10px 0; color: #22c55e;">Успешно!</h3>
      <p style="margin: 0; color: #6b7280;">${message}</p>
    `;

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    setTimeout(() => {
      document.body.removeChild(overlay);
      document.body.removeChild(popup);
    }, 2500);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Зареждане на терапевти...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#22c55e", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <ShieldCheckIcon style={{ width: "32px", height: "32px", strokeWidth: 2 }} />
          Нашите терапевти
        </h1>
        <p style={{ color: "#6b7280", fontSize: "18px" }}>
          Намерете подходящия специалист за вашите нужди
        </p>
      </div>

      {/* Филтър */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            background: "white",
          }}
        >
          {specialties.map((specialty) => (
            <option key={specialty.value} value={specialty.value}>
              {specialty.label}
            </option>
          ))}
        </select>
      </div>

      {/* Списък с терапевти */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "25px",
        }}
      >
        {filteredTherapists.map((therapist) => (
          <div
            key={therapist.id}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "25px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
            }}
          >
            {/* Хедър */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <div style={{ position: "relative", marginRight: "15px" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: therapist.profileImage
                      ? `url(${therapist.profileImage})`
                      : "#f0fdf4",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: therapist.profileImage ? "0" : "30px",
                  }}
                >
                  {!therapist.profileImage && <ShieldCheckIcon style={{ width: "30px", height: "30px", strokeWidth: 1.5 }} />}
                  {therapist.profileImage && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        right: "-2px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        color: "white",
                        border: "2px solid white",
                      }}
                    >
                      <ShieldCheckIcon style={{ width: "10px", height: "10px", strokeWidth: 2 }} />
                    </div>
                  )}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: "0 0 5px 0",
                    color: "#1f2937",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => setSelectedTherapistId(therapist.id)}
                >
                  {therapist.name}
                </h3>
                <p style={{ margin: "0", color: "#22c55e", fontWeight: 600 }}>
                  {therapist.specialty}
                </p>
              </div>
              <div
                style={{
                  background: therapist.available ? "#dcfce7" : "#fee2e2",
                  color: therapist.available ? "#16a34a" : "#dc2626",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {therapist.available ? "Свободен" : "Зает"}
              </div>
            </div>

            {/* Информация */}
            <div style={{ marginBottom: "15px" }}>
              <p style={{ margin: "0 0 8px 0", color: "#6b7280", display: "flex", alignItems: "center", gap: "6px" }}>
                <CalendarIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                {therapist.experience}
              </p>
              <p style={{ margin: "0 0 8px 0", color: "#6b7280", display: "flex", alignItems: "center", gap: "6px" }}>
                <StarIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                {therapist.rating}/5.0 рейтинг
              </p>
              <p style={{ margin: "0 0 15px 0", color: "#6b7280", display: "flex", alignItems: "center", gap: "6px" }}>
                <BanknotesIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                {therapist.price}
              </p>
            </div>

            {/* Бутони */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => bookAppointment(therapist)}
                disabled={!therapist.available}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: therapist.available ? "#22c55e" : "#9ca3af",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: therapist.available ? "pointer" : "not-allowed",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {therapist.available ? (
                  <><CalendarIcon style={{ width: "20px", height: "20px", strokeWidth: 2, display: "inline", marginRight: "6px" }} />Запиши час</>
                ) : (
                  "Недостъпен"
                )}
              </button>
              <button
                style={{
                  padding: "12px 16px",
                  background: "transparent",
                  color: "#22c55e",
                  border: "2px solid #22c55e",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                <ChatBubbleLeftRightIcon style={{ width: "20px", height: "20px", strokeWidth: 2, display: "inline", marginRight: "6px" }} />
                Чат
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTherapists.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#6b7280",
          }}
        >
          <h3>Няма намерени терапевти</h3>
          <p>Опитайте с друг филтър или се регистрирайте като терапевт</p>
        </div>
      )}

      {/* Therapist Profile Modal */}
      {selectedTherapistId && (
        <TherapistProfile
          therapistId={selectedTherapistId}
          onClose={() => setSelectedTherapistId(null)}
        />
      )}
    </div>
  );
};

export default TherapistsPage;
