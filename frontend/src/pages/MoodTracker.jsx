import React, { useState, useEffect } from "react";
import { ChartBarIcon, BoltIcon, ExclamationCircleIcon, CheckCircleIcon, FaceSmileIcon, FaceFrownIcon } from '../components/Icons';

/**
 * MoodTracker Component
 * 
 * Позволява на потребителите да проследяват ежедневното си настроение, енергия и тревожност.
 * Данните се съхраняват в базата данни и се визуализират в история.
 * 
 * Функционалност:
 * - Проследяване на настроение (1-10)
 * - Проследяване на енергия (1-10)
 * - Проследяване на тревожност (1-10)
 * - Добавяне на бележки
 * - Преглед на история на записите
 */
const MoodTracker = () => {
  // State за текущите стойности на формата
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [note, setNote] = useState("");
  
  // State за историята на записите
  const [entries, setEntries] = useState([]);

  // Зареждане на записите при първоначално рендериране
  useEffect(() => {
    fetchEntries();
  }, []);

  /**
   * Fetch mood entries from API
   * Извлича всички mood записи на текущия потребител от базата данни
   */
  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/mood/entries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.entries) setEntries(data.entries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  /**
   * Handle form submission
   * Запазва нов mood entry в базата данни
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Извличане на JWT token за автентификация
      const token = localStorage.getItem('token');
      
      // POST request към API за запазване на mood entry
      const response = await fetch('/api/mood/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mood, energy, anxiety, notes: note })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Успешно запазване - изчистване на формата и обновяване на историята
        setNote("");
        fetchEntries();
      } else {
        alert(`❌ Грешка: ${data.message || 'Неизвестна грешка'}`);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('❌ Грешка при свързване със сървъра');
    }
  };

  /**
   * Get appropriate mood icon based on value
   * Връща усмихната или тъжна икона в зависимост от стойността на настроението
   * 
   * @param {number} value - Mood value (1-10)
   * @returns {Component} - Icon component
   */
  const getMoodIcon = (value) => {
    if (value <= 5) return FaceFrownIcon; // Тъжна икона за ниско настроение
    return FaceSmileIcon; // Усмихната икона за високо настроение
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#2d3748", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        <ChartBarIcon style={{ width: "32px", height: "32px", strokeWidth: 2 }} />
        Проследяване на настроението
      </h1>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontWeight: "600" }}>
              Настроение:
              {React.createElement(getMoodIcon(mood), { style: { width: "20px", height: "20px", strokeWidth: 2, color: mood <= 5 ? "#ef4444" : "#22c55e" } })}
              ({mood}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              style={{ width: "100%", height: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontWeight: "600" }}>
              Енергия:
              <BoltIcon style={{ width: "18px", height: "18px", strokeWidth: 2, color: "#f59e0b" }} />
              ({energy}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              style={{ width: "100%", height: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontWeight: "600" }}>
              Тревожност:
              <ExclamationCircleIcon style={{ width: "18px", height: "18px", strokeWidth: 2, color: "#ef4444" }} />
              ({anxiety}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={anxiety}
              onChange={(e) => setAnxiety(Number(e.target.value))}
              style={{ width: "100%", height: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
              Бележка (по избор):
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Как се чувствам днес..."
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                minHeight: "80px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              padding: "12px 30px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <CheckCircleIcon style={{ width: "20px", height: "20px", strokeWidth: 2, marginRight: "6px", display: "inline" }} />
            Запази запис
          </button>
        </form>
      </div>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#2d3748", display: "flex", alignItems: "center", gap: "8px" }}>
          <ChartBarIcon style={{ width: "24px", height: "24px", strokeWidth: 2 }} />
          История
        </h2>
        {entries.length === 0 ? (
          <p style={{ textAlign: "center", color: "#718096" }}>
            Все още няма записи. Добавете първия си запис!
          </p>
        ) : (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {entries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: "15px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}
                >
                  <span style={{ fontWeight: "600" }}>
                    {new Date(entry.date).toLocaleDateString("bg-BG")}
                  </span>
                  <span>
                    {React.createElement(getMoodIcon(entry.mood), { style: { width: "20px", height: "20px", strokeWidth: 2, color: entry.mood <= 5 ? "#ef4444" : "#22c55e" } })}
                  </span>
                </div>
                <div
                  style={{ display: "flex", gap: "20px", marginBottom: "10px", fontSize: "14px" }}
                >
                  <span>Настроение: {entry.mood}/10</span>
                  <span>Енергия: {entry.energy}/10</span>
                  <span>Тревожност: {entry.anxiety}/10</span>
                </div>
                {entry.note && (
                  <p style={{ margin: "0", fontSize: "14px", color: "#4a5568" }}>"{entry.note}"</p>
                )}
                {entry.notes && (
                  <p style={{ margin: "0", fontSize: "14px", color: "#4a5568" }}>"{entry.notes}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
