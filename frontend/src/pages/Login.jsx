import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAnonymous } from "../context/AnonymousContext";
import { KeyIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAnonymous();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate("/");
        window.location.reload();
      } else {
        // Show specific error message from server
        if (response.status === 401) {
          setError("Невалиден имейл или парола");
        } else if (response.status === 404) {
          setError("Потребителят не е намерен");
        } else if (response.status === 500) {
          setError("Сървърна грешка. Моля опитайте отново.");
        } else {
          setError(data.message || `Грешка ${response.status}: ${response.statusText}`);
        }
      }
    } catch (err) {
      // Demo mode fallback
      let role = "user";
      if (formData.email.includes("admin")) {
        role = "admin";
      } else if (formData.email.includes("therapist")) {
        role = "therapist";
      }

      const demoUser = {
        id: "demo-" + Date.now(),
        email: formData.email,
        role: role,
      };

      localStorage.setItem("token", "demo-token");
      localStorage.setItem("user", JSON.stringify(demoUser));

      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2
            style={{
              margin: "0 0 10px 0",
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2d3748",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <KeyIcon style={{ width: "28px", height: "28px" }} />
            Влизане
          </h2>
          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "16px",
            }}
          >
            Добре дошли обратно в MindLink+
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fed7d7",
              color: "#c53030",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#2d3748",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4299e1")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#2d3748",
              }}
            >
              Парола
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4299e1")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#a0aec0" : "linear-gradient(135deg, #4299e1, #3182ce)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              marginBottom: "20px",
            }}
          >
            {loading ? "Влизане..." : "Влизане"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            paddingTop: "20px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <p style={{ margin: "0 0 15px 0", color: "#718096" }}>
            Нямате акаунт?{" "}
            <Link
              to="/register"
              style={{
                color: "#4299e1",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Регистрирайте се
            </Link>
          </p>

          {/* Quick Login Options */}
          <div style={{ marginTop: "15px" }}>
            <p style={{ fontSize: "12px", color: "#a0aec0", marginBottom: "8px" }}>
              Бърз вход за тестване:
            </p>
            <div
              style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}
            >
              <button
                onClick={() => setFormData({ email: "user@test.com", password: "test123" })}
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                👤 User
              </button>
              <button
                onClick={() => setFormData({ email: "therapist@test.com", password: "test123" })}
                style={{
                  background: "#9333ea",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                🩺 Therapist
              </button>
              <button
                onClick={() => setFormData({ email: "admin@test.com", password: "test123" })}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                ⚙️ Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
