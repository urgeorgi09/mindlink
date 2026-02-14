import React, { useState, useEffect } from "react";
import { BookOpenIcon, PencilIcon, MagnifyingGlassIcon, CheckCircleIcon, HeartIcon, StarIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from '../components/Icons';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("personal");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { value: "personal", label: "Личен", icon: PencilIcon, color: "#91c481" },
    { value: "gratitude", label: "Благодарност", icon: HeartIcon, color: "#7fb570" },
    { value: "goals", label: "Цели", icon: StarIcon, color: "#6da65f" },
    { value: "reflection", label: "Размисли", icon: ChatBubbleLeftRightIcon, color: "#569b5c" },
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Decode JWT to see user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("🔑 Current user ID:", payload.id);
      
      console.log("📖 Fetching journal entries...");
      const response = await fetch("/api/journal/entries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📖 Response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("📖 Entries loaded:", data);
        console.log("📖 Entries array:", data.entries);
        console.log("📖 Entries length:", data.entries?.length);
        setEntries(data.entries || []);
      } else {
        console.error("📖 Failed to load entries:", response.statusText);
      }
    } catch (error) {
      console.error("📖 Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !currentEntry.trim()) return;

    try {
      const token = localStorage.getItem("token");
      console.log("✍️ Saving journal entry:", { title, category, contentLength: currentEntry.length });
      const response = await fetch("/api/journal/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: currentEntry.trim(),
          category,
        }),
      });

      console.log("✍️ Save response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("✍️ Save response:", data);
        setTitle("");
        setCurrentEntry("");
        fetchEntries();
      } else {
        const error = await response.json();
        console.error("✍️ Failed to save:", error);
      }
    } catch (error) {
      console.error("✍️ Error creating entry:", error);
    }
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryInfo = (cat) => categories.find((c) => c.value === cat);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#2d3748", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        <BookOpenIcon style={{ width: "32px", height: "32px", strokeWidth: 2 }} />
        Личен дневник
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
          <h2 style={{ marginBottom: "20px", color: "#2d3748", display: "flex", alignItems: "center", gap: "8px" }}>
            <PencilIcon style={{ width: "24px", height: "24px", strokeWidth: 2 }} />
            Нов запис
          </h2>

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
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  );
                })}
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
                background: "linear-gradient(135deg, #569b5c 0%, #4a8751 100%)",
                color: "white",
                border: "none",
                padding: "12px 30px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <CheckCircleIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />
              Запиши
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
            display: "flex",
            flexDirection: "column",
            maxHeight: "600px",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#2d3748", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <DocumentTextIcon style={{ width: "24px", height: "24px", strokeWidth: 2 }} />
            Мои записи
          </h2>

          <div style={{ marginBottom: "20px", flexShrink: 0 }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Търсене в записите..."
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
                backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%236b7280"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>')`,
                backgroundSize: "20px 20px",
                backgroundPosition: "12px center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>

          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
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
                        {new Date(entry.createdAt || entry.date).toLocaleDateString("bg-BG")}
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
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {React.createElement(catInfo.icon, { style: { width: "14px", height: "14px", strokeWidth: 2 } })}
                        {catInfo.label}
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
