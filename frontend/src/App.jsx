import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Chat from "./pages/Chat";
import MoodTrackerPage from "./pages/MoodTracker";
import EmotionsPage from "./pages/Emotions";

import BreathingExercise from "./components/BreathingExercise";
import CrisisResources from "./components/CrisisResources";
import BadgesAchievements from "./components/BadgesAchievements";

import TherapistsPage from "./pages/TherapistsPage";

export default function App() {
    return (
        <Router>

            {/* ===== NAVBAR ===== */}
            <nav style={{
                background: "#4f46e5",
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "white"
            }}>
                <h2>MindLink+</h2>
                <div style={{ display: "flex", gap: "15px" }}>
                    <Link to="/" style={{ color: "white" }}>Home</Link>
                    <Link to="/dashboard" style={{ color: "white" }}>Тъбло</Link>
                    <Link to="/journal" style={{ color: "white" }}>Дневник</Link>

                    {/* NEW LINKS */}
                    <Link to="/chat" style={{ color: "white" }}>AI чат</Link>
                    <Link to="/emotions" style={{ color: "white" }}>Публикуване на емоция</Link>
                    <Link to="/mood" style={{ color: "white" }}>Емоционален трекер</Link>
                </div>  
            </nav>

            {/* ===== CONTENT ===== */}
            <main style={{ minHeight: "80vh", padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/journal" element={<Journal />} />

                    {/* NEW pages */}
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/mood" element={<MoodTrackerPage />} />
                    <Route path="/emotions" element={<EmotionsPage />} />

                    <Route path="/therapists" element={<TherapistsPage />} />

                    {/* Dashboard card pages */}
                    <Route path="/breathing" element={<BreathingExercise />} />
                    <Route path="/badges" element={<BadgesAchievements badges={["First Entry"]} />} />
                    <Route path="/crisis" element={<CrisisResources />} />
                </Routes>
            </main>

            {/* ===== FOOTER ===== */}
            <footer style={{
                background: "#1B1F3B",
                padding: "20px",
                textAlign: "center",
                color: "white"
            }}>
                <p>© 2025 MindLink — Твоят спътник в света на психиката - Всички права запазени.</p>
            </footer>

        </Router>
    );
}
