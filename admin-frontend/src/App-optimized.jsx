import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnonymousProvider } from "./context/AnonymousContext";
import OptimizedNavigation from "./components/OptimizedNavigation";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleBasedDashboard from "./components/RoleBasedDashboard";
import JournalHub from "./pages/JournalHub";
import Chat from "./pages/Chat";
import TherapistDashboard from "./components/TherapistDashboard";
import TherapistConversations from "./pages/TherapistConversations";
import TherapistNotes from "./pages/TherapistNotes";
import AdminDashboard from "./components/AdminDashboard";
import TherapistsPage from "./pages/TherapistsPage";

function App() {
  return (
    <AnonymousProvider>
      <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <OptimizedNavigation />

          <main style={{ flex: 1, padding: "20px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<RoleBasedDashboard />} />
              <Route path="/journal-hub" element={<JournalHub />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/therapists" element={<TherapistsPage />} />
              <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
              <Route path="/therapist-conversations" element={<TherapistConversations />} />
              <Route path="/therapist-notes" element={<TherapistNotes />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>

          <footer
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              padding: "20px",
              textAlign: "center",
              color: "white",
            }}
          >
            <p style={{ margin: 0, fontSize: "14px" }}>
              © 2025 MindLink+ — Твоят спътник в света на психиката
            </p>
          </footer>
        </div>
      </Router>
    </AnonymousProvider>
  );
}

export default App;
