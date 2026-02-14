import React, { useState, useEffect } from "react";

const Analytics = () => {
  const [moodData, setMoodData] = useState([]);
  const [journalData, setJournalData] = useState([]);
  const [timeRange, setTimeRange] = useState("7"); // days

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const moodResponse = await fetch("/api/mood/entries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const moodData = await moodResponse.json();
      
      const journalResponse = await fetch("/api/journal/entries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const journalData = await journalResponse.json();

      const days = parseInt(timeRange);
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      setMoodData((moodData.entries || []).filter((entry) => new Date(entry.date) >= cutoff));
      setJournalData((journalData.entries || []).filter((entry) => new Date(entry.date) >= cutoff));
    } catch (error) {
      console.error("Error fetching data:", error);
      setMoodData([]);
      setJournalData([]);
    }
  };

  const calculateAverage = (data, field) => {
    if (data.length === 0) return 0;
    return (data.reduce((sum, entry) => sum + entry[field], 0) / data.length).toFixed(1);
  };

  const getMoodTrend = () => {
    if (moodData.length < 2) return "stable";
    const recent = moodData.slice(0, Math.ceil(moodData.length / 2));
    const older = moodData.slice(Math.ceil(moodData.length / 2));

    const recentAvg = calculateAverage(recent, "mood");
    const olderAvg = calculateAverage(older, "mood");

    if (recentAvg > olderAvg + 0.5) return "improving";
    if (recentAvg < olderAvg - 0.5) return "declining";
    return "stable";
  };

  const getJournalStats = () => {
    const categories = {};
    let totalWords = 0;

    journalData.forEach((entry) => {
      categories[entry.category] = (categories[entry.category] || 0) + 1;
      totalWords += entry.word_count || 0;
    });

    return {
      categories,
      totalWords,
      avgWords: journalData.length ? (totalWords / journalData.length).toFixed(0) : 0,
    };
  };

  const trend = getMoodTrend();
  const journalStats = getJournalStats();

  const getTrendEmoji = (trend) => {
    switch (trend) {
      case "improving":
        return "📈";
      case "declining":
        return "📉";
      default:
        return "➡️";
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "improving":
        return "#10b981";
      case "declining":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ color: "#2d3748", margin: 0 }}>📈 Анализи и статистики</h1>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: "8px 16px",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <option value="7">Последните 7 дни</option>
          <option value="30">Последните 30 дни</option>
          <option value="90">Последните 90 дни</option>
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Mood Analytics */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>😊 Настроение</h2>

          {moodData.length === 0 ? (
            <p style={{ textAlign: "center", color: "#718096" }}>
              Няма данни за настроението в този период
            </p>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "15px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
                    {calculateAverage(moodData, "mood")}
                  </div>
                  <div style={{ fontSize: "12px", color: "#718096" }}>Средно настроение</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                    {calculateAverage(moodData, "energy")}
                  </div>
                  <div style={{ fontSize: "12px", color: "#718096" }}>Средна енергия</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>
                    {calculateAverage(moodData, "anxiety")}
                  </div>
                  <div style={{ fontSize: "12px", color: "#718096" }}>Средна тревожност</div>
                </div>
              </div>

              <div
                style={{
                  padding: "15px",
                  background: "#f7fafc",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ fontSize: "24px" }}>{getTrendEmoji(trend)}</span>
                <div>
                  <div style={{ fontWeight: "600", color: getTrendColor(trend) }}>
                    {trend === "improving"
                      ? "Подобряване"
                      : trend === "declining"
                        ? "Влошаване"
                        : "Стабилно"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#718096" }}>Тенденция за периода</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Journal Analytics */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>📖 Дневник</h2>

          {journalData.length === 0 ? (
            <p style={{ textAlign: "center", color: "#718096" }}>
              Няма записи в дневника за този период
            </p>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8b5cf6" }}>
                    {journalData.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#718096" }}>Общо записи</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#06b6d4" }}>
                    {journalStats.avgWords}
                  </div>
                  <div style={{ fontSize: "12px", color: "#718096" }}>Средно думи</div>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: "10px", color: "#4a5568" }}>Категории:</h4>
                {Object.entries(journalStats.categories).map(([category, count]) => {
                  const categoryLabels = {
                    personal: "📝 Личен",
                    gratitude: "🙏 Благодарност",
                    goals: "🎯 Цели",
                    reflection: "🤔 Размисли",
                  };

                  return (
                    <div
                      key={category}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <span>{categoryLabels[category] || category}</span>
                      <span style={{ fontWeight: "600" }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Overall Stats */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>📊 Обща активност</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div
              style={{
                padding: "15px",
                background: "#eff6ff",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>📈 Записи за настроение</span>
              <span style={{ fontWeight: "bold", color: "#3b82f6" }}>{moodData.length}</span>
            </div>

            <div
              style={{
                padding: "15px",
                background: "#f0fdf4",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>📝 Записи в дневника</span>
              <span style={{ fontWeight: "bold", color: "#10b981" }}>{journalData.length}</span>
            </div>

            <div
              style={{
                padding: "15px",
                background: "#fefce8",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>📝 Общо думи</span>
              <span style={{ fontWeight: "bold", color: "#f59e0b" }}>
                {journalStats.totalWords}
              </span>
            </div>

            <div
              style={{
                padding: "15px",
                background: "#f5f3ff",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>🔥 Активни дни</span>
              <span style={{ fontWeight: "bold", color: "#8b5cf6" }}>
                {
                  new Set(
                    [...moodData, ...journalData].map((entry) =>
                      new Date(entry.date).toDateString()
                    )
                  ).size
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
