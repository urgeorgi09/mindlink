import React from "react";
import { Link } from "react-router-dom";
import { useAnonymous } from "../context/AnonymousContext";
import { useTheme } from "../context/ThemeContext";
import '../styles/cards.css';
import { HeartIcon, KeyIcon, PencilSquareIcon, ChartBarIcon, BookOpenIcon, ShieldCheckIcon, UserGroupIcon, FaceSmileIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, PencilIcon, UserIcon } from '../components/Icons';

const Home = () => {
  const { userRole } = useAnonymous();
  const { colors } = useTheme();
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
        <div style={{ marginBottom: '60px' }}>
          <h1
            style={{
              fontSize: "3.5rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "20px",
              fontWeight: 800,
            }}
          >
            <HeartIcon style={{ width: "48px", height: "48px", strokeWidth: 1.5, display: "inline", marginRight: "8px" }} />
            MindLink+
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              color: colors.textSecondary,
              marginBottom: "15px",
              maxWidth: "700px",
              margin: "0 auto 15px auto",
              lineHeight: 1.6,
            }}
          >
            Вашата платформа за психично здраве с професионални инструменти
          </p>
          <p style={{ fontSize: '1rem', color: colors.textSecondary, marginBottom: '40px' }}>
            🏆 Първо място на Hack TUES X - 2025
          </p>
        </div>

        <div
          style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "80px" }}
        >
          <Link
            to="/login"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              padding: "16px 40px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
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
            <KeyIcon style={{ width: "20px", height: "20px", strokeWidth: 2, display: "inline", marginRight: "6px" }} />
            Влизане
          </Link>
          <Link
            to="/register"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              padding: "16px 40px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.4)';
            }}
          >
            <PencilSquareIcon style={{ width: "20px", height: "20px", strokeWidth: 2, display: "inline", marginRight: "6px" }} />
            Регистрация
          </Link>
        </div>

        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '40px', color: colors.text }}>
            <ChartBarIcon style={{ width: "28px", height: "28px", strokeWidth: 2, display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
            Основни функции
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                padding: "35px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: '2px solid #bae6fd',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <ChartBarIcon style={{ width: "56px", height: "56px", strokeWidth: 1.5, color: "#0c4a6e", margin: "0 auto 20px" }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: '#0c4a6e' }}>Проследяване на емоции</h3>
              <p style={{ color: '#475569', lineHeight: 1.6 }}>Проследявайте настроението си ежедневно и анализирайте тенденциите</p>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                padding: "35px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: '2px solid #fcd34d',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <BookOpenIcon style={{ width: "56px", height: "56px", strokeWidth: 1.5, color: "#78350f", margin: "0 auto 20px" }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: '#78350f' }}>Цифров дневник</h3>
              <p style={{ color: '#78350f', lineHeight: 1.6 }}>Водете цифров дневник за мислите и емоциите си</p>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                padding: "35px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: '2px solid #86efac',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <ShieldCheckIcon style={{ width: "56px", height: "56px", strokeWidth: 1.5, color: "#14532d", margin: "0 auto 20px" }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: '#14532d' }}>Професионална грижа</h3>
              <p style={{ color: '#166534', lineHeight: 1.6 }}>Свържете се с лицензирани терапевти за подкрепа</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', padding: '50px 30px', borderRadius: '24px', marginTop: '60px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: colors.text }}>
            <UserGroupIcon style={{ width: "28px", height: "28px", strokeWidth: 2, display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
            За нас
          </h2>
          <p style={{ fontSize: '1.1rem', color: colors.textSecondary, maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
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
          Добре дошли в MindLink+
          <HeartIcon style={{ width: "32px", height: "32px", strokeWidth: 2, display: "inline", marginLeft: "8px", verticalAlign: "middle" }} />
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: colors.textSecondary,
            marginBottom: "60px",
          }}
        >
          Изберете функция за да започнете
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px",
            maxWidth: "1000px",
            margin: "0 auto",
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
              <FaceSmileIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#667eea", margin: "0 auto 20px" }} />
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
              <BookOpenIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#667eea", margin: "0 auto 20px" }} />
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
              <ChatBubbleLeftRightIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#667eea", margin: "0 auto 20px" }} />
              <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
                Чат с лекар
              </h3>
              <p style={{ color: "#718096", fontSize: "1rem" }}>
                Свържете се с вашия терапевт за консултация
              </p>
            </div>
          </Link>

          <Link to="/therapists" style={{ textDecoration: "none", gridColumn: "2 / 3" }}>
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
              <ShieldCheckIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#667eea", margin: "0 auto 20px" }} />
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

  // For admin/therapist
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1
          style={{
            fontSize: "3rem",
            background: userRole === 'admin' 
              ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
              : "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "15px",
            fontWeight: 800,
          }}
        >
          {userRole === 'admin' ? (
            <><Cog6ToothIcon style={{ width: "32px", height: "32px", strokeWidth: 2, display: "inline", marginRight: "8px", verticalAlign: "middle" }} />Админ Панел</>
          ) : (
            <><ShieldCheckIcon style={{ width: "32px", height: "32px", strokeWidth: 2, display: "inline", marginRight: "8px", verticalAlign: "middle" }} />Терапевтски Панел</>
          )}
        </h1>
        <p style={{ fontSize: "1.2rem", color: colors.textSecondary }}>
          Добре дошли обратно! Изберете функция за да започнете.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
        }}
      >
        {userRole === 'admin' ? (
          <>
            <Link to="/admin-dashboard" style={{ textDecoration: "none" }}>
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
                <Cog6ToothIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#ef4444", margin: "0 auto 20px" }} />
                <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
                  Управление на потребители
                </h3>
                <p style={{ color: "#718096", fontSize: "1rem" }}>
                  Верификация на терапевти, управление на акаунти и роли
                </p>
              </div>
            </Link>

            <Link to="/system-analytics" style={{ textDecoration: "none" }}>
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
                <ChartBarIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#667eea", margin: "0 auto 20px" }} />
                <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
                  Системна аналитика
                </h3>
                <p style={{ color: "#718096", fontSize: "1rem" }}>
                  Статистики, графики и общ преглед на платформата
                </p>
              </div>
            </Link>

            <Link to="/all-therapists" style={{ textDecoration: "none" }}>
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
                <ShieldCheckIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#22c55e", margin: "0 auto 20px" }} />
                <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
                  Терапевти
                </h3>
                <p style={{ color: "#718096", fontSize: "1rem" }}>
                  Преглед на всички терапевти и техните пациенти
                </p>
              </div>
            </Link>
          </>
        ) : (
          <>
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
                <ChatBubbleLeftRightIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#9333ea", margin: "0 auto 20px" }} />
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
                <PencilIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#9333ea", margin: "0 auto 20px" }} />
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
                <UserIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#9333ea", margin: "0 auto 20px" }} />
                <h3 style={{ fontSize: "1.5rem", color: "#2d3748", marginBottom: "10px" }}>
                  Моят профил
                </h3>
                <p style={{ color: "#718096", fontSize: "1rem" }}>
                  Редактирайте профила и настройките си
                </p>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
