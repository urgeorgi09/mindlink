import React, { useState, useEffect } from "react";

const XPNotification = ({ xp, source, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "linear-gradient(135deg, #ffd700, #ffed4e)",
        color: "#744210",
        padding: "12px 20px",
        borderRadius: "25px",
        fontWeight: "bold",
        fontSize: "16px",
        boxShadow: "0 4px 20px rgba(255, 215, 0, 0.3)",
        zIndex: 9999,
        animation: "slideInRight 0.3s ease, fadeOut 0.3s ease 1.7s forwards",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span style={{ fontSize: "20px" }}>⭐</span>+{xp} XP
      {source && (
        <span
          style={{
            fontSize: "12px",
            opacity: 0.8,
            marginLeft: "4px",
          }}
        >
          ({getSourceLabel(source)})
        </span>
      )}
    </div>
  );
};

const getSourceLabel = (source) => {
  const labels = {
    journal_entry: "Дневник",
    mood_tracking: "Настроение",
    chat_interaction: "AI Чат",
    breathing_exercise: "Дишане",
    meditation: "Медитация",
    mission_journal: "Мисия",
    mission_mood: "Мисия",
    mission_chat: "Мисия",
    mission_breathing: "Мисия",
    mission_meditation: "Мисия",
    daily_complete_bonus: "Дневен бонус",
  };
  return labels[source] || "Активност";
};

// Global XP notification manager
let notificationQueue = [];
let currentNotification = null;

export const showXPNotification = (xp, source) => {
  notificationQueue.push({ xp, source, id: Date.now() });
  processNotificationQueue();
};

const processNotificationQueue = () => {
  if (currentNotification || notificationQueue.length === 0) return;

  const notification = notificationQueue.shift();
  currentNotification = notification;

  // Create notification element
  const container = document.createElement("div");
  document.body.appendChild(container);

  const handleComplete = () => {
    document.body.removeChild(container);
    currentNotification = null;
    // Process next notification after a short delay
    setTimeout(processNotificationQueue, 500);
  };

  // Render notification
  import("react-dom/client").then(({ createRoot }) => {
    const root = createRoot(container);
    root.render(
      <XPNotification
        xp={notification.xp}
        source={notification.source}
        onComplete={handleComplete}
      />
    );
  });
};

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
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
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

export default XPNotification;
