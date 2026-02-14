import React from "react";
import { Link } from "react-router-dom";
import { useAnonymous } from "../context/AnonymousContext";
import { useTheme } from "../context/ThemeContext";
import { 
  FaceSmileIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon,
  ChartBarIcon,
  KeyIcon,
  PencilSquareIcon
} from '../components/Icons';
import '../styles/cards.css';

const Home = () => {
  const { userRole } = useAnonymous();
  const { colors } = useTheme();
  const isLoggedIn = localStorage.getItem("token");

  const isMobile = window.innerWidth < 768;

  if (!isLoggedIn) {
    return (
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "20px" : "40px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: isMobile ? '30px' : '60px' }}>
          <h1
            style={{
              fontSize: isMobile ? "2rem" : "3.5rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "20px",
              fontWeight: 800,
            }}
          >
            🧠 MindLink+
          </h1>
          <p
            style={{
              fontSize: isMobile ? "1rem" : "1.3rem",
              color: colors.textSecondary,
              marginBottom: "15px",
              maxWidth: "700px",
              margin: "0 auto 15px auto",
              lineHeight: 1.6,
              padding: isMobile ? "0 10px" : "0",
            }}
          >
            Вашата платформа за психично здраве с професионални инструменти
          </p>
          <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: colors.textSecondary, marginBottom: isMobile ? '20px' : '40px' }}>
            🏆 Първо място на Hack TUES X - 2025
          </p>
        </div>

        <div
          style={{ display: "flex", gap: isMobile ? "10px" : "20px", justifyContent: "center", marginBottom: isMobile ? "40px" : "80px", flexDirection: isMobile ? "column" : "row", padding: isMobile ? "0 20px" : "0" }}
        >
          <Link
            to="/login"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              padding: isMobile ? "14px 30px" : "16px 40px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: isMobile ? '1rem' : '1.1rem',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            <KeyIcon style={{ width: '24px', height: '24px' }} />
            Влизане
          </Link>
          <Link
            to="/register"
            style={{
              background: "linear-gradient(135deg, #91c481 0%, #7fb570 100%)",
              color: "white",
              padding: isMobile ? "14px 30px" : "16px 40px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: isMobile ? '1rem' : '1.1rem',
              boxShadow: '0 4px 15px rgba(145, 196, 129, 0.4)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(145, 196, 129, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(145, 196, 129, 0.4)';
            }}
          >
            <PencilSquareIcon style={{ width: '24px', height: '24px' }} />
            Регистрация
          </Link>
        </div>

        <div style={{ marginBottom: isMobile ? '30px' : '60px' }}>
          <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: isMobile ? '20px' : '40px', color: colors.text }}>✨ Основни функции</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
              gap: isMobile ? "20px" : "30px",
              padding: isMobile ? "0 10px" : "0",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                padding: isMobile ? "25px" : "35px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: '2px solid #bae6fd',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <ChartBarIcon style={{ width: isMobile ? "2.5rem" : "3.5rem", height: isMobile ? "2.5rem" : "3.5rem", marginBottom: isMobile ? "15px" : "20px", color: "#0c4a6e" }} />
              <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', marginBottom: '12px', color: '#0c4a6e' }}>Проследяване на емоции</h3>
              <p style={{ color: '#475569', lineHeight: 1.6 }}>Проследявайте настроението си ежедневно и анализирайте тенденциите</p>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                padding: isMobile ? "25px" : "35px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: '2px solid #fcd34d',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <BookOpenIcon style={{ width: isMobile ? "2.5rem" : "3.5rem", height: isMobile ? "2.5rem" : "3.5rem", marginBottom: isMobile ? "15px" : "20px", color: "#78350f" }} />
              <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', marginBottom: '12px', color: '#78350f' }}>Цифров дневник</h3>
              <p style={{ color: '#78350f', lineHeight: 1.6 }}>Водете цифров дневник за мислите и емоциите си</p>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #91c481 0%, #7fb570 100%)",
                padding: isMobile ? "25px" : "35px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: '2px solid #7fb570',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <UserGroupIcon style={{ width: isMobile ? "2.5rem" : "3.5rem", height: isMobile ? "2.5rem" : "3.5rem", marginBottom: isMobile ? "15px" : "20px", color: "#3d5a2f" }} />
              <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', marginBottom: '12px', color: '#3d5a2f' }}>Професионална грижа</h3>
              <p style={{ color: '#4a6b3a', lineHeight: 1.6 }}>Свържете се с лицензирани терапевти за подкрепа</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', padding: isMobile ? '30px 20px' : '50px 30px', borderRadius: '24px', marginTop: isMobile ? '30px' : '60px' }}>
          <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: isMobile ? '20px' : '30px', color: colors.text }}>👥 За нас</h2>
          <p style={{ fontSize: isMobile ? '1rem' : '1.1rem', color: colors.textSecondary, maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
            MindLink+ е създадена от екип от ученици на TUES с цел да направи психичното здраве по-достъпно за всеки. 
            Платформата предлага инструменти за самонаблюдение, професионална подкрепа и сигурно пространство за споделяне.
          </p>
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
          padding: isMobile ? "20px" : "40px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "2rem" : "3rem",
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
            fontSize: isMobile ? "1rem" : "1.2rem",
            color: colors.textSecondary,
            marginBottom: isMobile ? "30px" : "60px",
          }}
        >
          Изберете функция за да започнете
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "20px" : "30px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <Link to="/mood" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #91c481 0%, #7fb570 100%)",
                padding: isMobile ? "25px" : "35px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                border: "2px solid #7fb570",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
              }}
            >
              <FaceSmileIcon style={{ width: isMobile ? "2.5rem" : "3.5rem", height: isMobile ? "2.5rem" : "3.5rem", marginBottom: isMobile ? "12px" : "15px", color: "#3d5a2f", strokeWidth: 2 }} />
              <h3 style={{ fontSize: isMobile ? "1.2rem" : "1.4rem", color: "#3d5a2f", marginBottom: "8px", fontWeight: 700 }}>
                Емоции
              </h3>
              <p style={{ color: "#4a6b3a", fontSize: isMobile ? "0.9rem" : "1rem", lineHeight: 1.5, margin: 0 }}>
                Проследете и анализирайте емоциите си
              </p>
            </div>
          </Link>

          <Link to="/journal" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                padding: isMobile ? "25px" : "35px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                border: "2px solid #fcd34d",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
              }}
            >
              <BookOpenIcon style={{ width: isMobile ? "2.5rem" : "3.5rem", height: isMobile ? "2.5rem" : "3.5rem", marginBottom: isMobile ? "12px" : "15px", color: "#78350f", strokeWidth: 2 }} />
              <h3 style={{ fontSize: isMobile ? "1.2rem" : "1.4rem", color: "#78350f", marginBottom: "8px", fontWeight: 700 }}>
                Дневник
              </h3>
              <p style={{ color: "#78350f", fontSize: isMobile ? "0.9rem" : "1rem", lineHeight: 1.5, margin: 0 }}>
                Водете личен дневник за мислите и емоциите си
              </p>
            </div>
          </Link>

          <Link to="/patient-chat" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                padding: isMobile ? "25px" : "35px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                border: "2px solid #86efac",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
              }}
            >
              <ChatBubbleLeftRightIcon style={{ width: isMobile ? "2.5rem" : "3.5rem", height: isMobile ? "2.5rem" : "3.5rem", marginBottom: isMobile ? "12px" : "15px", color: "#14532d", strokeWidth: 2 }} />
              <h3 style={{ fontSize: isMobile ? "1.2rem" : "1.4rem", color: "#14532d", marginBottom: "8px", fontWeight: 700 }}>
                Чат с лекар
              </h3>
              <p style={{ color: "#166534", fontSize: isMobile ? "0.9rem" : "1rem", lineHeight: 1.5, margin: 0 }}>
                Свържете се с вашия терапевт за консултация
              </p>
            </div>
          </Link>

          <Link to="/therapists" style={{ textDecoration: "none", gridColumn: isMobile ? "auto" : "2 / 3" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                padding: isMobile ? "25px" : "35px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                border: "2px solid #a5b4fc",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
              }}
            >
              <UserGroupIcon style={{ width: isMobile ? "2.5rem" : "3.5rem", height: isMobile ? "2.5rem" : "3.5rem", marginBottom: isMobile ? "12px" : "15px", color: "#312e81", strokeWidth: 2 }} />
              <h3 style={{ fontSize: isMobile ? "1.2rem" : "1.4rem", color: "#312e81", marginBottom: "8px", fontWeight: 700 }}>
                Терапевти
              </h3>
              <p style={{ color: "#4338ca", fontSize: isMobile ? "0.9rem" : "1rem", lineHeight: 1.5, margin: 0 }}>
                Намерете и свържете се с лицензирани терапевти
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // For therapist
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isMobile ? "20px" : "40px 20px",
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '50px' }}>
        <h1
          style={{
            fontSize: isMobile ? "2rem" : "3rem",
            background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "15px",
            fontWeight: 800,
          }}
        >
          🩺 Терапевтски Панел
        </h1>
        <p style={{ fontSize: isMobile ? "1rem" : "1.2rem", color: colors.textSecondary }}>
          Добре дошли обратно! Изберете функция за да започнете.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: isMobile ? "20px" : "30px",
        }}
      >
        <Link to="/therapist-chat" style={{ textDecoration: "none" }}>
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
            <ChatBubbleLeftRightIcon style={{ width: "4rem", height: "4rem", marginBottom: "20px", color: "#7c3aed", strokeWidth: 2 }} />
            <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
              Моите пациенти
            </h3>
            <p style={{ color: "#718096", fontSize: "1rem" }}>
              Чат с пациенти и управление на консултации
            </p>
          </div>
        </Link>

        <Link to="/therapist-notes" style={{ textDecoration: "none" }}>
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
            <PencilSquareIcon style={{ width: "4rem", height: "4rem", marginBottom: "20px", color: "#7c3aed", strokeWidth: 2 }} />
            <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
              Бележки за пациенти
            </h3>
            <p style={{ color: "#718096", fontSize: "1rem" }}>
              Водете бележки и проследявайте прогреса
            </p>
          </div>
        </Link>

        <Link to="/therapist-dashboard" style={{ textDecoration: "none" }}>
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
            <UserGroupIcon style={{ width: "4rem", height: "4rem", marginBottom: "20px", color: "#7c3aed", strokeWidth: 2 }} />
            <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
              Моят профил
            </h3>
            <p style={{ color: "#718096", fontSize: "1rem" }}>
              Редактирайте профила и настройките си
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
