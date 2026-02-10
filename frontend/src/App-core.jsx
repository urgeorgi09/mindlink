import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnonymousProvider } from "./context/AnonymousContext";
import Navigation from "./components/Navigation";

// Core 5 Features
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MoodTracker from "./pages/MoodTracker";
import Journal from "./pages/Journal";
import TherapistSystem from "./pages/TherapistSystem";
import Analytics from "./pages/Analytics";
import Privacy from "./pages/Privacy";

function App() {
  return (
    <AnonymousProvider>
      <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navigation />

          <main style={{ flex: 1, padding: "20px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/therapist" element={<TherapistSystem />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>

          <footer
            style={{
              background: "#2d3748",
              padding: "15px",
              textAlign: "center",
              color: "white",
              fontSize: "14px",
            }}
          >
            © 2025 MindLink+ — Mental Health Platform
          </footer>
        </div>
      </Router>
    </AnonymousProvider>
  );
}

export default App;
