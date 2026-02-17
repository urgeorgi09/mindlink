import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAnonymous } from "../context/AnonymousContext";
import { PencilSquareIcon, UserIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    specialty: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Паролите не съвпадат");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Паролата трябва да е поне 6 символа");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          ...(formData.role === 'therapist' && formData.specialty ? { specialty: formData.specialty } : {}),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        
        // Redirect therapists to verification page
        if (formData.role === 'therapist') {
          navigate("/therapist-verification");
        } else {
          navigate("/");
        }
        
        window.location.reload();
      } else {
        // Show specific error message from server
        if (response.status === 409) {
          setError("Потребител с този имейл вече съществува");
        } else if (response.status === 400) {
          setError("Невалидни данни. Моля проверете въведената информация");
        } else if (response.status === 500) {
          setError("Сървърна грешка. Моля опитайте отново.");
        } else {
          setError(data.message || `Грешка ${response.status}: ${response.statusText}`);
        }
      }
    } catch (err) {
      setError("Грешка в мрежата. Моля опитайте отново.");
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
          maxWidth: "450px",
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
            <PencilSquareIcon style={{ width: "28px", height: "28px" }} />
            Регистрация
          </h2>
          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "16px",
            }}
          >
            Създайте вашия MindLink+ акаунт
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
              Име
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Въведете вашето име"
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

          {formData.role === "therapist" && (
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#2d3748",
                }}
              >
                Специалност
              </label>
              <select
                name="specialty"
                value={formData.specialty || ""}
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
                  background: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4299e1")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              >
                <option value="">Изберете специалност</option>
                <option value="Клиничен психолог">Клиничен психолог</option>
                <option value="Психотерапевт">Психотерапевт</option>
                <option value="Детски психолог">Детски психолог</option>
                <option value="Психиатър">Психиатър</option>
              </select>
            </div>
          )}

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

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#2d3748",
              }}
            >
              Роля
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
                background: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4299e1")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            >
              <option value="user">
                <UserIcon style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} />
                Потребител
              </option>
              <option value="therapist">
                <UserGroupIcon style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} />
                Терапевт
              </option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
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

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#2d3748",
              }}
            >
              Потвърдете паролата
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
              background: loading ? "#a0aec0" : "linear-gradient(135deg, #48bb78, #38a169)",
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
            {loading ? "Регистрация..." : "Регистрация"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            paddingTop: "20px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <p style={{ margin: 0, color: "#718096" }}>
            Вече имате акаунт?{" "}
            <Link
              to="/login"
              style={{
                color: "#4299e1",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Влезте
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
