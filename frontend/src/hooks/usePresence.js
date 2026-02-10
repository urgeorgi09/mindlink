// hooks/usePresence.js
// Custom hook - управлява heartbeat и онлайн статуси

import { useState, useEffect, useCallback, useRef } from "react";

const HEARTBEAT_INTERVAL_MS = 20 * 1000; // heartbeat на всеки 20 сек
const POLL_INTERVAL_MS = 15 * 1000;      // проверявай статусите на всеки 15 сек

// ──────────────────────────────────────────────
// useHeartbeat - пращай "аз съм онлайн" до сървъра
// Използвай го в App.js за логнатия потребител
// ──────────────────────────────────────────────
export function useHeartbeat() {
  const intervalRef = useRef(null);

  const sendHeartbeat = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch("/api/presence/heartbeat", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Silent fail - не прекъсвай UI при мрежова грешка
    }
  }, []);

  const sendOffline = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Използваме sendBeacon за да гарантираме изпращане при затваряне на таба
      navigator.sendBeacon(
        "/api/presence/offline",
        new Blob(
          [JSON.stringify({ token })],
          { type: "application/json" }
        )
      );
    } catch {
      // Fallback към fetch
      await fetch("/api/presence/offline", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Изпрати веднага при mount
    sendHeartbeat();

    // После на всеки 20 секунди
    intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    // При затваряне на таба/прозореца - изпрати offline
    window.addEventListener("beforeunload", sendOffline);

    // При смяна на visibility (tab switch)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        sendHeartbeat();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("beforeunload", sendOffline);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [sendHeartbeat, sendOffline]);

  return { sendOffline };
}

// ──────────────────────────────────────────────
// useUserStatus - проверявай статуса на един потребител
// Използвай в PatientChat.js и TherapistChat.js
// ──────────────────────────────────────────────
export function useUserStatus(userId) {
  const [status, setStatus] = useState({ online: false, lastSeen: null, loading: true });

  const fetchStatus = useCallback(async () => {
    if (!userId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/presence/status/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStatus({ online: data.online, lastSeen: data.lastSeen, loading: false });
    } catch {
      setStatus((s) => ({ ...s, loading: false }));
    }
  }, [userId]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return status;
}

// ──────────────────────────────────────────────
// useBatchStatus - проверявай статуса на много потребители
// Използвай в PatientChatHub.js и TherapistChat.js (списъци)
// ──────────────────────────────────────────────
export function useBatchStatus(userIds) {
  const [statuses, setStatuses] = useState({});

  const fetchStatuses = useCallback(async () => {
    if (!userIds || userIds.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/presence/status/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds }),
      });
      const data = await response.json();
      setStatuses(data.statuses || {});
    } catch {
      // Silent fail
    }
  }, [JSON.stringify(userIds)]);

  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(fetchStatuses, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchStatuses]);

  return statuses;
}
