import React, { useState } from "react";

const Privacy = () => {
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const handleExportData = async () => {
    setExportLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const [moodRes, journalRes] = await Promise.all([
        fetch("/api/mood/entries", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/journal/entries", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const moodData = await moodRes.json();
      const journalData = await journalRes.json();

      const userData = {
        moodEntries: moodData.entries || [],
        journalEntries: journalData.entries || [],
        exportDate: new Date().toISOString(),
        version: "2.0"
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `mindlink-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Грешка при експортиране на данните");
    }

    setExportLoading(false);
  };

  const handleDeleteData = async () => {
    if (deleteConfirm !== "ИЗТРИЙ ДАННИТЕ") {
      alert('Моля, въведете точно "ИЗТРИЙ ДАННИТЕ" за потвърждение.');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      await Promise.all([
        fetch("/api/mood/delete-all", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/journal/delete-all", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      ]);

      alert("Всички данни са изтрити успешно.");
      setDeleteConfirm("");
      setShowDeleteForm(false);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Грешка при изтриване на данните");
    }
  };

  const [dataSize, setDataSize] = useState("0");

  const [moodCount, setMoodCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);

  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const [moodRes, journalRes] = await Promise.all([
          fetch("/api/mood/entries", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/journal/entries", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const moodData = await moodRes.json();
        const journalData = await journalRes.json();
        setMoodCount(moodData.entries?.length || 0);
        setJournalCount(journalData.entries?.length || 0);
        const size = JSON.stringify({ mood: moodData.entries, journal: journalData.entries }).length;
        setDataSize((size / 1024).toFixed(2));
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#2d3748", marginBottom: "30px" }}>
        🔒 Поверителност и данни
      </h1>

      {/* Data Overview */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>📊 Преглед на данните</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "15px",
              background: "#eff6ff",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
              {moodCount}
            </div>
            <div style={{ fontSize: "12px", color: "#4a5568" }}>Записи за настроение</div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "15px",
              background: "#f0fdf4",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
              {journalCount}
            </div>
            <div style={{ fontSize: "12px", color: "#4a5568" }}>Записи в дневника</div>
          </div>

          <div
            style={{
              textAlign: "center",
              padding: "15px",
              background: "#f5f3ff",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8b5cf6" }}>
              {dataSize}
            </div>
            <div style={{ fontSize: "12px", color: "#4a5568" }}>KB данни</div>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#2d3748" }}>📥 Експорт на данни</h2>
        <p style={{ marginBottom: "20px", color: "#4a5568", lineHeight: "1.6" }}>
          Можете да изтеглите всички ваши данни в JSON формат. Това включва записи за настроение,
          дневникови записи, терапевтични бележки и настройки.
        </p>

        <button
          onClick={handleExportData}
          disabled={exportLoading}
          style={{
            background: exportLoading ? "#94a3b8" : "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: exportLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {exportLoading ? "⏳ Подготвя се..." : "📥 Изтегли данните ми"}
        </button>
      </div>

      {/* Privacy Information */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#2d3748" }}>🛡️ Как пазим данните ви</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>🔐</span>
            <div>
              <h4 style={{ margin: "0 0 5px 0", color: "#2d3748" }}>Локално съхранение</h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#4a5568" }}>
                Всички данни се съхраняват локално в браузъра ви и не се изпращат на външни сървъри.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>🚫</span>
            <div>
              <h4 style={{ margin: "0 0 5px 0", color: "#2d3748" }}>Без проследяване</h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#4a5568" }}>
                Не използваме cookies за проследяване или аналитика от трети страни.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>🔒</span>
            <div>
              <h4 style={{ margin: "0 0 5px 0", color: "#2d3748" }}>Криптиране</h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#4a5568" }}>
                Чувствителните данни се криптират преди съхранение.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>👤</span>
            <div>
              <h4 style={{ margin: "0 0 5px 0", color: "#2d3748" }}>Пълен контрол</h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#4a5568" }}>
                Вие имате пълен контрол над данните си - можете да ги експортирате или изтриете по
                всяко време.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Deletion */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          border: "2px solid #fecaca",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#dc2626" }}>🗑️ Изтриване на данни</h2>
        <p style={{ marginBottom: "20px", color: "#4a5568", lineHeight: "1.6" }}>
          <strong>Внимание:</strong> Това действие ще изтрие завинаги всички ваши данни от това
          устройство. Препоръчваме първо да експортирате данните си.
        </p>

        {!showDeleteForm ? (
          <button
            onClick={() => setShowDeleteForm(true)}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🗑️ Изтрий всички данни
          </button>
        ) : (
          <div>
            <p style={{ marginBottom: "15px", fontWeight: "600", color: "#dc2626" }}>
              За потвърждение, въведете: <code>ИЗТРИЙ ДАННИТЕ</code>
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="ИЗТРИЙ ДАННИТЕ"
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #fecaca",
                borderRadius: "8px",
                fontSize: "16px",
                marginBottom: "15px",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleDeleteData}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ✅ Потвърди изтриването
              </button>
              <button
                onClick={() => {
                  setShowDeleteForm(false);
                  setDeleteConfirm("");
                }}
                style={{
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ❌ Отказ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Privacy;
