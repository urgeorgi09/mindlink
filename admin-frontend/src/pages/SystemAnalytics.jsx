import React, { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { API_URL } from "../config";
import { ClockIcon, ArrowPathIcon, CheckCircleIcon, UserGroupIcon, ShieldCheckIcon, FaceSmileIcon, BookOpenIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from '../components/Icons';

const SystemAnalytics = () => {
  const toast = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTherapists: 0,
    verifiedTherapists: 0,
    totalMoodEntries: 0,
    totalJournalEntries: 0,
    totalMessages: 0
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/overview`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Общо потребители", value: stats.totalUsers || 0, Icon: UserGroupIcon, color: "#3b82f6" },
    { title: "Терапевти", value: stats.totalTherapists || 0, Icon: ShieldCheckIcon, color: "#8b5cf6" },
    { title: "Верифицирани терапевти", value: stats.verifiedTherapists || 0, Icon: CheckCircleIcon, color: "#10b981" },
    { title: "Записи за настроение", value: stats.totalMoodEntries || 0, Icon: FaceSmileIcon, color: "#f59e0b" },
    { title: "Дневникови записи", value: stats.totalJournalEntries || 0, Icon: BookOpenIcon, color: "#ec4899" },
    { title: "Съобщения", value: stats.totalMessages || 0, Icon: ChatBubbleLeftRightIcon, color: "#06b6d4" },
    { title: "Общо акаунти", value: stats.totalAccounts || 0, Icon: ChartBarIcon, color: "#6366f1" },
    { title: "Активни потребители", value: `${stats.activeUsers || 0} (${stats.activePercentage || 0}%)`, Icon: CheckCircleIcon, color: "#22c55e" },
    { title: "Средна сесия", value: `${stats.avgSessionMinutes || 0} мин`, Icon: ClockIcon, color: "#f97316" },
    { title: "Дневни посещения", value: stats.dailyVisits || 0, Icon: ChartBarIcon, color: "#a855f7" },
    { title: "Ангажираност", value: `${stats.engagementScore || 0}%`, Icon: ChartBarIcon, color: "#14b8a6" },
    { title: "Растеж", value: `${stats.growthPercentage || 0}%`, Icon: ChartBarIcon, color: "#84cc16" }
  ];

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", margin: 0 }}>
          📈 Системни анализи
        </h1>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        {statCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: `2px solid ${card.color}20`
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              {React.createElement(card.Icon, { style: { width: "40px", height: "40px", strokeWidth: 1.5, color: card.color } })}
            </div>
            <h3 style={{ margin: "0 0 8px 0", color: "#6b7280", fontSize: "14px" }}>
              {card.title}
            </h3>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAnalytics;
