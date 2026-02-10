// components/StatusBadge.js
// Компонент за показване на онлайн/офлайн статус

import React from "react";

// ──────────────────────────────────────────────
// Помощна функция - форматира "последно виждан"
// ──────────────────────────────────────────────
function formatLastSeen(isoString) {
  if (!isoString) return null;

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "току що";
  if (diffMins < 60) return `преди ${diffMins} мин`;
  if (diffHours < 24) return `преди ${diffHours} ч`;
  if (diffDays === 1) return "вчера";
  return `преди ${diffDays} дни`;
}

// ──────────────────────────────────────────────
// StatusDot - малка цветна точка (за chat header-и)
// ──────────────────────────────────────────────
export function StatusDot({ online, size = 10 }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: online ? "#22c55e" : "#9ca3af",
        boxShadow: online ? "0 0 0 2px rgba(34,197,94,0.3)" : "none",
        flexShrink: 0,
        // Пулсираща анимация само когато е онлайн
        animation: online ? "pulse-green 2s infinite" : "none",
      }}
    />
  );
}

// ──────────────────────────────────────────────
// StatusBadge - текст + точка (за списъци с терапевти)
// ──────────────────────────────────────────────
export function StatusBadge({ online, lastSeen, loading = false }) {
  if (loading) {
    return (
      <span style={{ fontSize: "13px", color: "#9ca3af" }}>
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#d1d5db",
            marginRight: 5,
          }}
        />
        Зарежда...
      </span>
    );
  }

  if (online) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: "13px",
          color: "#16a34a",
          fontWeight: 600,
        }}
      >
        <StatusDot online={true} size={8} />
        Онлайн
      </span>
    );
  }

  const lastSeenText = formatLastSeen(lastSeen);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: "13px",
        color: "#6b7280",
      }}
    >
      <StatusDot online={false} size={8} />
      {lastSeenText ? `Последно: ${lastSeenText}` : "Офлайн"}
    </span>
  );
}

// ──────────────────────────────────────────────
// CSS анимация за пулсиране - добави в App.css или index.css
// ──────────────────────────────────────────────
const pulseStyle = `
  @keyframes pulse-green {
    0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
    70%  { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  }
`;

// Inject стиловете автоматично
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = pulseStyle;
  document.head.appendChild(styleEl);
}

export default StatusBadge;