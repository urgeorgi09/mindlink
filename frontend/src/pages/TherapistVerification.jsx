import React, { useState } from "react";

const TherapistVerification = () => {
  const [uin, setUin] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyUIN = async () => {
    if (!uin.trim()) {
      setMessage("Моля, въведете УИН номер");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/therapist/verify-uin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setMessage(data.message || "Грешка при верификация");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Грешка при свързване със сървъра");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🩺</div>
          <h2 style={{ margin: "0 0 10px 0", color: "#2d3748" }}>
            Верификация на терапевт
          </h2>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Въведете вашия УИН номер от БЛС регистъра
          </p>
          <a 
            href="https://blsbg.eu/bg/medics/search" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: "#8b5cf6", 
              fontSize: "13px", 
              textDecoration: "none",
              display: "inline-block",
              marginTop: "8px"
            }}
          >
            🔗 Проверете вашия УИН в БЛС регистъра
          </a>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#4b5563",
              fontWeight: "600",
            }}
          >
            УИН номер
          </label>
          <input
            type="text"
            value={uin}
            onChange={(e) => setUin(e.target.value)}
            placeholder="Например: 2300000754"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
            УИН номерът трябва да е 10 цифри (например: 2300000754)
          </p>
        </div>

        {message && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              background: isSuccess ? "#d1fae5" : "#fee2e2",
              color: isSuccess ? "#065f46" : "#991b1b",
              border: `1px solid ${isSuccess ? "#6ee7b7" : "#fca5a5"}`,
            }}
          >
            {message}
          </div>
        )}

        <button
          onClick={verifyUIN}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#9ca3af" : "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Проверка..." : "✓ Верифицирай"}
        </button>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f3f4f6",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#4b5563", fontSize: "14px" }}>
            ℹ️ Информация
          </h4>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#6b7280", fontSize: "13px" }}>
            <li>УИН се проверява директно в БЛС регистъра (blsbg.eu)</li>
            <li>Името ви трябва да съвпада с регистрираното име</li>
            <li>Верификацията е автоматична и отнема няколко секунди</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TherapistVerification;
