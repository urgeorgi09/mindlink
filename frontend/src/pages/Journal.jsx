import React, { useState, useEffect } from "react";

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("personal");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { value: "personal", label: "Личен", emoji: "📝", color: "#3b82f6" },
    { value: "gratitude", label: "Благодарност", emoji: "🙏", color: "#10b981" },
    { value: "goals", label: "Цели", emoji: "🎯", color: "#8b5cf6" },
    { value: "reflection", label: "Размисли", emoji: "🤔", color: "#f59e0b" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("journalEntries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !currentEntry.trim()) return;

    const entry = {
      id: Date.now(),
      title: title.trim(),
      content: currentEntry.trim(),
      category,
      date: new Date().toISOString(),
      wordCount: currentEntry.trim().split(/\s+/).length,
    };

    const newEntries = [entry, ...entries];
    setEntries(newEntries);
    localStorage.setItem("journalEntries", JSON.stringify(newEntries));

    setTitle("");
    setCurrentEntry("");
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryInfo = (cat) => categories.find((c) => c.value === cat);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#2d3748", marginBottom: "30px" }}>
        📖 Личен дневник
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Write Entry */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>✍️ Нов запис</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Заглавие на записа..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <textarea
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                placeholder="Започнете да пишете тук..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  minHeight: "200px",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
                required
              />
              <div style={{ fontSize: "12px", color: "#718096", marginTop: "5px" }}>
                Думи: {currentEntry.trim() ? currentEntry.trim().split(/\s+/).length : 0}
              </div>
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
              💾 Запази запис
            </button>
          </form>
        </div>

        {/* View Entries */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>📚 Мои записи</h2>

          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Търсене в записите..."
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {filteredEntries.length === 0 ? (
              <p style={{ textAlign: "center", color: "#718096" }}>
                {searchTerm ? "Няма намерени записи." : "Все още няма записи. Напишете първия си!"}
              </p>
            ) : (
              filteredEntries.map((entry) => {
                const catInfo = getCategoryInfo(entry.category);
                return (
                  <div
                    key={entry.id}
                    style={{
                      padding: "15px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      marginBottom: "15px",
                      borderLeft: `4px solid ${catInfo.color}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <h3 style={{ margin: "0", fontSize: "16px", fontWeight: "600" }}>
                        {entry.title}
                      </h3>
                      <span style={{ fontSize: "12px", color: "#718096" }}>
                        {new Date(entry.date).toLocaleDateString("bg-BG")}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          background: `${catInfo.color}20`,
                          color: catInfo.color,
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {catInfo.emoji} {catInfo.label}
                      </span>
                      <span style={{ fontSize: "12px", color: "#718096" }}>
                        {entry.wordCount} думи
                      </span>
                    </div>

                    <p
                      style={{
                        margin: "0",
                        fontSize: "14px",
                        color: "#4a5568",
                        lineHeight: "1.5",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {entry.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
