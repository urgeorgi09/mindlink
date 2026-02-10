import React from "react";
import { useAnonymous } from "../context/AnonymousContext";
import UserDashboard from "../pages/UserDashboard";
import TherapistDashboard from "./TherapistDashboard";
import AdminDashboard from "./AdminDashboard";

const RoleBasedDashboard = () => {
  const { userRole } = useAnonymous();
  const isLoggedIn = localStorage.getItem("token");

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2 style={{ color: "#ef4444" }}>🔑 Моля влезте в системата</h2>
        <p>За да видите вашето табло, моля влезте в акаунта си.</p>
        <button
          onClick={() => (window.location.href = "/login")}
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Влизане
        </button>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (userRole) {
    case "admin":
      return <AdminDashboard />;
    case "therapist":
      return <TherapistDashboard />;
    case "user":
    default:
      return <UserDashboard />;
  }
};

export default RoleBasedDashboard;
