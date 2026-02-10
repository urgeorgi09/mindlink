import React from "react";
import { Link } from "react-router-dom";
import { useAnonymous } from "../context/AnonymousContext";

const Home = () => {
  const { userRole } = useAnonymous();
  const isLoggedIn = localStorage.getItem("token");

  if (!isLoggedIn) {
    return (
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px",
          }}
        >
          Добре дошли в MindLink+ 🧠
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#666",
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px auto",
          }}
        >
          Вашата платформа за психично здраве с професионални инструменти.
        </p>

        <div
          style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "60px" }}
        >
          <Link
            to="/login"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              padding: "15px 30px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            🔑 Влизане
          </Link>
          <Link
            to="/register"
            style={{
              background: "#22c55e",
              color: "white",
              padding: "15px 30px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            📝 Регистрация
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📊</div>
            <h3>Mood Tracking</h3>
            <p>Проследявайте настроението си ежедневно</p>
          </div>

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📖</div>
            <h3>Digital Journal</h3>
            <p>Водете цифров дневник за мислите си</p>
          </div>

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🩺</div>
            <h3>Professional Care</h3>
            <p>Свържете се с лицензирани терапевти</p>
          </div>
        </div>
      </div>
    );
  }

  // Show cards for logged in users
  if (userRole === "user") {
    return (
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px",
          }}
        >
          Добре дошли в MindLink+ 🧠
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#666",
            marginBottom: "60px",
          }}
        >
          Изберете функция за да започнете
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          <Link to="/mood" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>😊</div>
              <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
                Емоции
              </h3>
              <p style={{ color: "#718096", fontSize: "1rem" }}>
                Проследете и анализирайте емоциите си
              </p>
            </div>
          </Link>

          <Link to="/journal" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📖</div>
              <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
                Дневник
              </h3>
              <p style={{ color: "#718096", fontSize: "1rem" }}>
                Водете личен дневник за мислите и емоциите си
              </p>
            </div>
          </Link>

          <Link to="/patient-chat" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>💬</div>
              <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
                Чат с лекар
              </h3>
              <p style={{ color: "#718096", fontSize: "1rem" }}>
                Свържете се с вашия терапевт за консултация
              </p>
            </div>
          </Link>

          <Link to="/therapists" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🩺</div>
              <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
                Терапевти
              </h3>
              <p style={{ color: "#718096", fontSize: "1rem" }}>
                Намерете и свържете се с лицензирани терапевти
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // For admin/therapist - simple welcome
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "20px",
        }}
      >
        Добре дошли в MindLink+ 🧠
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#666",
          marginBottom: "40px",
        }}
      >
        Използвайте навигацията за достъп до функциите на платформата.
      </p>
    </div>
  );
};

export default Home;
