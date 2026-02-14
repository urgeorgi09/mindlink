// App.js - подобрена навигация и хамбургер меню

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./styles/App.css";
import "./styles/darkmode.css";
import "./styles/global-text-align.css";
import "./styles/mobile-responsive.css";
import { 
  HomeIcon, 
  KeyIcon, 
  PencilSquareIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  DevicePhoneMobileIcon,
  HeartIcon,
  UserIcon
} from './components/Icons';

import { AnonymousProvider, useAnonymous } from "./context/AnonymousContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { usePresence } from "./hooks/usePresence";
import './styles/presence.css';

import Home from "./pages/home";
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
import Users from "./pages/Users";
import Therapist from "./pages/Therapist";
import MoodTrackerPage from "./pages/MoodTracker";
import { EmotionsPage } from "./components/PlaceholderComponents";

function NavLink({ to, children, emoji, onClick, IconComponent }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        color: "white",
        textDecoration: "none",
        padding: isMobile ? "12px 16px" : "8px 14px",
        borderRadius: isMobile ? "10px" : "8px",
        fontSize: isMobile ? "15px" : "13.5px",
        fontWeight: 600,
        background: isActive 
          ? "rgba(255, 255, 255, 0.25)" 
          : "rgba(255, 255, 255, 0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "12px" : "8px",
        border: isActive 
          ? "1px solid rgba(255, 255, 255, 0.35)" 
          : "1px solid rgba(255, 255, 255, 0.12)",
        whiteSpace: "nowrap",
        width: isMobile ? "100%" : "auto",
        boxShadow: isActive 
          ? "0 2px 10px rgba(0, 0, 0, 0.15)" 
          : "none",
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.18)";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.background = isActive ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = isActive ? "0 2px 10px rgba(0, 0, 0, 0.15)" : "none";
        }
      }}
    >
      {IconComponent && <IconComponent style={{ width: isMobile ? "20px" : "18px", height: isMobile ? "20px" : "18px", strokeWidth: 2.5 }} />}
      <span>{children}</span>
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
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Icon = darkMode ? SunIcon : MoonIcon;

  return (
    <button
      onClick={toggleDarkMode}
      style={{
        color: "white",
        background: "rgba(255, 255, 255, 0.12)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        padding: isMobile ? "12px 16px" : "8px 14px",
        borderRadius: isMobile ? "10px" : "8px",
        fontSize: isMobile ? "15px" : "13px",
        fontWeight: 600,
        cursor: "pointer",
        width: isMobile ? "100%" : "auto",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? "12px" : "8px",
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <Icon style={{ width: isMobile ? "20px" : "18px", height: isMobile ? "20px" : "18px", strokeWidth: 2.5 }} />
      {isMobile && <span>{darkMode ? "Светъл режим" : "Тъмен режим"}</span>}
    </button>
  );
}

function LogoutButton({ onLogout }) {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <button
      onClick={onLogout}
      style={{
        color: "white",
        background: "rgba(239, 68, 68, 0.25)",
        border: "1px solid rgba(239, 68, 68, 0.35)",
        padding: isMobile ? "12px 16px" : "8px 14px",
        borderRadius: isMobile ? "10px" : "8px",
        fontSize: isMobile ? "15px" : "13px",
        fontWeight: 600,
        cursor: "pointer",
        width: isMobile ? "100%" : "auto",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? "12px" : "8px",
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.35)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <ArrowRightOnRectangleIcon style={{ width: isMobile ? "20px" : "18px", height: isMobile ? "20px" : "18px", strokeWidth: 2.5 }} />
      <span>Изход</span>
    </button>
  );
}

function HamburgerButton({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Menu"
      style={{
        background: isOpen ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.12)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "white",
        cursor: "pointer",
        padding: "6px",
        borderRadius: "8px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "38px",
        height: "38px",
        gap: "4px",
        zIndex: 1001,
        position: 'relative',
        boxShadow: isOpen ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
      }}
    >
      <span
        style={{
          width: "22px",
          height: "2.5px",
          background: "white",
          borderRadius: "2px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isOpen ? "rotate(45deg) translateY(7px)" : "rotate(0)",
        }}
      />
      <span
        style={{
          width: "22px",
          height: "2.5px",
          background: "white",
          borderRadius: "2px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? "translateX(10px)" : "translateX(0)",
        }}
      />
      <span
        style={{
          width: "22px",
          height: "2.5px",
          background: "white",
          borderRadius: "2px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isOpen ? "rotate(-45deg) translateY(-7px)" : "rotate(0)",
        }}
      />
    </button>
  );
}

function MobileMenu({ menuOpen, setMenuOpen }) {
  const { userRole, logout } = useAnonymous();
  const { darkMode, toggleDarkMode } = useTheme();
  const isLoggedIn = localStorage.getItem("token");

  // Блокиране на скролването когато менюто е отворено
  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    window.location.href = "/";
  };

  const closeMenu = () => setMenuOpen(false);

  const getRoleNavigation = () => {
    if (!isLoggedIn) {
      return (
        <>
          <NavLink to="/login" IconComponent={KeyIcon} onClick={closeMenu}>Влизане</NavLink>
          <NavLink to="/register" IconComponent={PencilSquareIcon} onClick={closeMenu}>Регистрация</NavLink>
        </>
      );
    }

    if (userRole === "therapist") {
      return (
        <>
          <NavLink to="/therapist-chat" IconComponent={ChatBubbleLeftRightIcon} onClick={closeMenu}>Пациенти</NavLink>
          <NavLink to="/therapist-notes" IconComponent={PencilSquareIcon} onClick={closeMenu}>Бележки</NavLink>
          <NavLink to="/therapist-dashboard" IconComponent={UserGroupIcon} onClick={closeMenu}>Акаунт</NavLink>
        </>
      );
    }

    return (
      <>
        <NavLink to="/journal" IconComponent={BookOpenIcon} onClick={closeMenu}>Дневник</NavLink>
        <NavLink to="/patient-chat" IconComponent={ChatBubbleLeftRightIcon} onClick={closeMenu}>Чат</NavLink>
        <NavLink to="/therapists" IconComponent={UserGroupIcon} onClick={closeMenu}>Терапевти</NavLink>
      </>
    );
  };

  return (
    <>
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            zIndex: 1001,
            animation: 'fadeIn 0.3s ease',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}
      
      <div
        style={{
          display: menuOpen ? "flex" : "none",
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(300px, 80vw)",
          background: darkMode 
            ? "linear-gradient(180deg, rgba(15, 20, 35, 0.98) 0%, rgba(10, 15, 25, 0.98) 100%)" 
            : "linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)",
          padding: "16px 12px",
          flexDirection: "column",
          gap: "6px",
          overflowY: "auto",
          boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(20px)",
          zIndex: 1002,
          animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderLeft: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.12)"}`,
        }}
      >
        {/* Хедър на менюто */}
        <div style={{ 
          marginBottom: "12px", 
          paddingBottom: "12px", 
          borderBottom: "1px solid rgba(255,255,255,0.1)" 
        }}>
          <h3 style={{ 
            margin: 0, 
            color: "white", 
            fontSize: "16px", 
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <DevicePhoneMobileIcon style={{ width: "18px", height: "18px", strokeWidth: 2.5 }} />
            <span>Меню</span>
          </h3>
        </div>

        {/* Навигационни линкове */}
        <NavLink to="/" IconComponent={HomeIcon} onClick={closeMenu}>Начало</NavLink>
        {getRoleNavigation()}
        
        {isLoggedIn && (
          <>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "8px 0" }} />
            
            {/* Бутони за действия */}
            <div style={{ display: "flex", gap: "6px", flexDirection: "column" }}>
              <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <LogoutButton onLogout={handleLogout} />
            </div>
          </>
        )}

        {/* Footer на менюто */}
        <div style={{ 
          marginTop: "auto", 
          paddingTop: "12px", 
          borderTop: "1px solid rgba(255,255,255,0.1)" 
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: "10px", 
            color: "rgba(255,255,255,0.5)", 
            textAlign: "center" 
          }}>
            MindLink+ © 2025
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
}

function Navigation() {
  const { userRole, logout } = useAnonymous();
  const { darkMode, toggleDarkMode } = useTheme();
  const isLoggedIn = localStorage.getItem("token");

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

    if (userRole === "therapist") {
      return (
        <>
          <NavLink to="/therapist-chat" IconComponent={ChatBubbleLeftRightIcon}>Пациенти</NavLink>
          <NavLink to="/therapist-notes" IconComponent={PencilSquareIcon}>Бележки</NavLink>
          <NavLink to="/therapist-dashboard" IconComponent={UserGroupIcon}>Акаунт</NavLink>
        </>
      );
    }

    return (
      <>
        <NavLink to="/journal" IconComponent={BookOpenIcon}>Дневник</NavLink>
        <NavLink to="/patient-chat" IconComponent={ChatBubbleLeftRightIcon}>Чат</NavLink>
        <NavLink to="/therapists" IconComponent={UserGroupIcon}>Терапевти</NavLink>
      </>
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' ,
  flexWrap: 'wrap',  // ДОБАВЕТЕ ТОВА
  maxWidth: '100%'}}>
      <NavLink to="/" IconComponent={HomeIcon}>Начало</NavLink>
      {getRoleNavigation()}
      {isLoggedIn && (
        <>
          <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <LogoutButton onLogout={handleLogout} />
        </>
      )}
    </div>
  );
}

function AppContent() {
  const { userRole } = useAnonymous();
  const { darkMode, colors } = useTheme();

  usePresence();

  const getRoleGradient = () => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) return "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)";
    switch (userRole) {
      case "therapist": return "linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%)";
      default: return "linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)";
    }
  };

  const getRoleLogo = () => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) return { icon: HomeIcon, title: "MindLink+" };
    switch (userRole) {
      case "therapist": return { icon: UserGroupIcon, title: "MindLink+ Pro" };
      default: return { icon: HeartIcon, title: "MindLink+ Care" };
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: colors.background, color: colors.text }}>
      <Router>
        <ScrollToTop />
        <nav
          className="responsive-nav"
          style={{
            background: getRoleGradient(),
            padding: isMobile ? "6px 12px" : "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            minHeight: isMobile ? "48px" : "64px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: isMobile ? "12px" : "0",
            flex: isMobile ? "1" : "auto"
          }}>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: isMobile ? "15px" : "22px", 
                fontWeight: 700, 
                letterSpacing: "0.3px", 
                display: "flex", 
                alignItems: "center", 
                gap: isMobile ? "6px" : "8px" 
              }}>
                {React.createElement(getRoleLogo().icon, { 
                  style: { width: isMobile ? "20px" : "28px", height: isMobile ? "20px" : "28px", strokeWidth: 2 } 
                })}
                {getRoleLogo().title}
              </h2>
            </Link>
            {isMobile && (
              <HamburgerButton isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
            )}
          </div>
          {!isMobile && (
            <div>
              <Navigation />
            </div>
          )}
        </nav>

        {isMobile && (
          <MobileMenu 
            menuOpen={mobileMenuOpen} 
            setMenuOpen={setMobileMenuOpen} 
          />
        )}

        <main
          className="page-transition"
          style={{ 
            minHeight: window.innerWidth < 768 ? "0" : "80vh", 
            padding: window.innerWidth < 768 ? "10px" : "20px", 
            backgroundColor: colors.background, 
            color: colors.text
          }}
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
            <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
            <Route path="/therapist-verification" element={<TherapistVerification />} />
            <Route path="/users" element={<Users />} />
            <Route path="/therapist" element={<Therapist />} />
          </Routes>
        </main>

        <footer
          style={{
            background: "linear-gradient(135deg, #569b5c 0%, #4a8751 100%)",
            padding: window.innerWidth < 768 ? "15px 10px" : "30px 20px",
            textAlign: "center",
            color: "white",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: "0 0 4px 0", fontSize: window.innerWidth < 768 ? "13px" : "16px", fontWeight: 500, opacity: 0.9 }}>
            © 2025 MindLink+ — Твоят спътник в света на психиката
          </p>
          <p style={{ margin: 0, fontSize: window.innerWidth < 768 ? "11px" : "14px", opacity: 0.6 }}>Всички права запазени.</p>
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