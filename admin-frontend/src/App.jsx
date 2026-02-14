import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./styles/App.css";
import "./styles/darkmode.css";
import "./styles/mobile-responsive.css";
import "./styles/global-text-align.css";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon, KeyIcon, PencilSquareIcon, Cog6ToothIcon, ChartBarIcon, ChatBubbleLeftRightIcon, PencilIcon, UserIcon, BookOpenIcon, HomeIcon, ArrowRightOnRectangleIcon, ShieldCheckIcon, HeartIcon } from './components/Icons';

import { AnonymousProvider, useAnonymous } from "./context/AnonymousContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Journal from "./pages/Journal";
import TherapistChat from "./pages/TherapistChat";
import PatientChat from "./pages/PatientChat";
import PatientChatHub from "./pages/PatientChatHub";
import PatientEmotions from "./pages/PatientEmotions";
import TherapistsPage from "./pages/TherapistsPage";
import TherapistNotes from "./pages/TherapistNotes";
import TherapistDashboard from "./pages/TherapistDashboard";
import TherapistVerification from "./pages/TherapistVerification";
import AdminDashboard from "./pages/AdminDashboard";
import SystemAnalytics from "./pages/SystemAnalytics";
import AllTherapistsPage from "./pages/AllTherapistsPage";
import Users from "./pages/Users";
import Therapist from "./pages/Therapist";
import MoodTrackerPage from "./pages/MoodTracker";
import { EmotionsPage } from "./components/PlaceholderComponents";

function NavLink({ to, children, IconComponent }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        color: "white",
        textDecoration: "none",
        padding: "8px 12px",
        borderRadius: "12px",
        fontSize: "clamp(14px, 3vw, 16px)",
        fontWeight: 600,
        background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        backdropFilter: isActive ? "blur(10px)" : "none",
        border: isActive ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid transparent",
        whiteSpace: "nowrap",
      }}
    >
      {IconComponent && <IconComponent style={{ width: "18px", height: "18px", strokeWidth: 2 }} />}
      {children}
    </Link>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function DarkModeButton({ darkMode, toggleDarkMode }) {
  const isMobile = window.innerWidth < 768;
  return (
    <button
      onClick={toggleDarkMode}
      style={{
        color: "white",
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        marginRight: isMobile ? "0" : "8px",
        width: isMobile ? "100%" : "auto",
      }}
    >
      {darkMode ? <SunIcon style={{ width: "18px", height: "18px", strokeWidth: 2 }} /> : <MoonIcon style={{ width: "18px", height: "18px", strokeWidth: 2 }} />}
    </button>
  );
}

function LogoutButton({ onLogout }) {
  const isMobile = window.innerWidth < 768;
  return (
    <button
      onClick={onLogout}
      style={{
        color: "white",
        background: "rgba(239, 68, 68, 0.2)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        width: isMobile ? "100%" : "auto",
      }}
    >
      <ArrowRightOnRectangleIcon style={{ width: "18px", height: "18px", strokeWidth: 2, marginRight: "4px", display: "inline" }} />
      Изход
    </button>
  );
}

function Navigation() {
  const { userRole, logout } = useAnonymous();
  const { darkMode, toggleDarkMode } = useTheme();
  const isLoggedIn = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isMobile = window.innerWidth < 768;

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const getRoleNavigation = () => {
    if (!isLoggedIn) {
      return (
        <>
          <NavLink to="/login" IconComponent={KeyIcon}>Влизане</NavLink>
          <NavLink to="/register" IconComponent={PencilSquareIcon}>Регистрация</NavLink>
        </>
      );
    }

    if (userRole === "admin") {
      return (
        <>
          <NavLink to="/admin-dashboard" IconComponent={Cog6ToothIcon}>Админ Панел</NavLink>
          <NavLink to="/system-analytics" IconComponent={ChartBarIcon}>Аналитика</NavLink>
        </>
      );
    }

    if (userRole === "therapist") {
      return (
        <>
          <NavLink to="/therapist-chat" IconComponent={ChatBubbleLeftRightIcon}>Пациенти</NavLink>
          <NavLink to="/therapist-notes" IconComponent={PencilIcon}>Бележки</NavLink>
          <NavLink to="/therapist-dashboard" IconComponent={UserIcon}>Моят акаунт</NavLink>
        </>
      );
    }

    return (
      <>
        <NavLink to="/journal" IconComponent={BookOpenIcon}>Дневник</NavLink>
        <NavLink to="/patient-chat" IconComponent={ChatBubbleLeftRightIcon}>Чат с лекар</NavLink>
        <NavLink to="/therapists" IconComponent={ShieldCheckIcon}>Терапевти</NavLink>
      </>
    );
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
          }}
        >
          {menuOpen ? <XMarkIcon style={{ width: "20px", height: "20px", strokeWidth: 2.5 }} /> : <Bars3Icon style={{ width: "20px", height: "20px", strokeWidth: 2.5 }} />}
        </button>
      )}
      <div
        className="nav-links responsive-nav-links"
        style={{
          display: isMobile ? (menuOpen ? "flex" : "none") : "flex",
          gap: isMobile ? "12px" : "8px",
          alignItems: isMobile ? "stretch" : "center",
          flexWrap: "wrap",
          position: isMobile ? "absolute" : "relative",
          top: isMobile ? "calc(100% + 10px)" : "auto",
          left: isMobile ? "0" : "auto",
          right: isMobile ? "0" : "auto",
          background: isMobile ? (darkMode ? "linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(20, 20, 20, 0.98))" : "linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))") : "transparent",
          padding: isMobile ? "20px" : "0",
          borderRadius: isMobile ? "12px" : "0",
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "calc(100% - 40px)" : "auto",
          margin: isMobile ? "0 20px" : "0",
          boxShadow: isMobile ? "0 10px 40px rgba(0, 0, 0, 0.5)" : "none",
          border: isMobile ? `1px solid ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.1)"}` : "none",
        }}
      >
      <NavLink to="/" IconComponent={HomeIcon}>Начало</NavLink>
      {getRoleNavigation()}

      {isLoggedIn && (
        <>
          <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <LogoutButton onLogout={handleLogout} />
          <div
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              background:
                userRole === "admin"
                  ? "rgba(239, 68, 68, 0.2)"
                  : userRole === "therapist"
                    ? "rgba(147, 51, 234, 0.2)"
                    : "rgba(59, 130, 246, 0.2)",
              border: `1px solid ${
                userRole === "admin"
                  ? "rgba(239, 68, 68, 0.3)"
                  : userRole === "therapist"
                    ? "rgba(147, 51, 234, 0.3)"
                    : "rgba(59, 130, 246, 0.3)"
              }`,
            }}
          >
            {userRole === "admin" ? (
              <><Cog6ToothIcon style={{ width: "14px", height: "14px", strokeWidth: 2, display: "inline", marginRight: "4px" }} />Админ</>
            ) : userRole === "therapist" ? (
              <><ShieldCheckIcon style={{ width: "14px", height: "14px", strokeWidth: 2, display: "inline", marginRight: "4px" }} />Терапевт</>
            ) : (
              <><UserIcon style={{ width: "14px", height: "14px", strokeWidth: 2, display: "inline", marginRight: "4px" }} />Потребител</>
            )}
          </div>
        </>
      )}
      </div>
    </>
  );
}

function AppContent() {
  const { userRole } = useAnonymous();
  const { darkMode, colors } = useTheme();

  const getRoleGradient = () => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) return "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)";
    switch (userRole) {
      case "admin": return "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)";
      case "therapist": return "linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%)";
      default: return "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)";
    }
  };

  const getRoleLogo = () => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) return { Icon: HeartIcon, title: "MindLink+" };
    switch (userRole) {
      case "admin": return { Icon: Cog6ToothIcon, title: "MindLink+ Admin" };
      case "therapist": return { Icon: ShieldCheckIcon, title: "MindLink+ Pro" };
      default: return { Icon: HeartIcon, title: "MindLink+ Care" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: colors.background, color: colors.text }}>
      <Router>
        <ScrollToTop />
        <nav
          className="responsive-nav"
          style={{
            background: getRoleGradient(),
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <h2 style={{ margin: 0, fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 800, letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "8px" }}>
              {React.createElement(getRoleLogo().Icon, { style: { width: "24px", height: "24px", strokeWidth: 2.5 } })}
              {getRoleLogo().title}
            </h2>
          </Link>
          <Navigation />
        </nav>

        <main
          className="page-transition"
          style={{ minHeight: "80vh", padding: "20px", backgroundColor: colors.background, color: colors.text, transition: "all 0.3s ease" }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/mood" element={<MoodTrackerPage />} />
            <Route path="/emotions" element={<EmotionsPage />} />
            <Route path="/therapists" element={<TherapistsPage />} />
            <Route path="/therapist-notes" element={<TherapistNotes />} />
            <Route path="/therapist-chat" element={<TherapistChat />} />
            <Route path="/patient-emotions/:patientId" element={<PatientEmotions />} />
            <Route path="/patient-chat" element={<PatientChatHub />} />
            <Route path="/patient-chat/:therapistId" element={<PatientChat />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
            <Route path="/therapist-verification" element={<TherapistVerification />} />
            <Route path="/system-analytics" element={<SystemAnalytics />} />
            <Route path="/all-therapists" element={<AllTherapistsPage />} />
            <Route path="/analytics" element={<SystemAnalytics />} />
            <Route path="/users" element={<Users />} />
            <Route path="/therapist" element={<Therapist />} />
          </Routes>
        </main>

        <footer
          style={{
            background: darkMode
              ? "linear-gradient(135deg, #0f172a 0%, #020617 100%)"
              : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            padding: "30px 20px",
            textAlign: "center",
            color: "white",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 500, opacity: 0.9 }}>
            © 2025 MindLink+ — Твоят спътник в света на психиката
          </p>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.6 }}>Всички права запазени.</p>
        </footer>
      </Router>
    </div>
  );
}

export default function App() {
  return (
    <AnonymousProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </AnonymousProvider>
  );
}