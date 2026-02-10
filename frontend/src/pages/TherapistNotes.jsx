import React, { useState, useEffect } from "react";

const TherapistNotes = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/therapist/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchNotes = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/notes/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          title: newNote.title,
          content: newNote.content,
        }),
      });

      if (response.ok) {
        setNewNote({ title: "", content: "" });
        setShowAddNote(false);
        fetchNotes(selectedPatient.id);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    fetchNotes(patient.id);
  };

  return (
    <div style={{ display: "flex", height: "80vh", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Списък с пациенти */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #e5e7eb",
          background: "#f9fafb",
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0, color: "#9333ea" }}>📝 Пациенти</h2>
        </div>

        <div style={{ overflowY: "auto", height: "calc(100% - 80px)" }}>
          {patients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => selectPatient(patient)}
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #e5e7eb",
                cursor: "pointer",
                background: selectedPatient?.id === patient.id ? "#ede9fe" : "transparent",
                transition: "background 0.2s",
              }}
            >
              <h4 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>{patient.name}</h4>
              <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>Кликни за бележки</p>
            </div>
          ))}

          {patients.length === 0 && (
            <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
              Няма пациенти
            </div>
          )}
        </div>
      </div>

      {/* Бележки */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedPatient ? (
          <>
            {/* Хедър */}
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #e5e7eb",
                background: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0, color: "#9333ea" }}>📋 Бележки за {selectedPatient.name}</h3>
              <button
                onClick={() => setShowAddNote(true)}
                style={{
                  padding: "8px 16px",
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ➕ Нова бележка
              </button>
            </div>

            {/* Списък с бележки */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                background: "#f9fafb",
              }}
            >
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    background: "white",
                    borderRadius: "8px",
                    padding: "15px",
                    marginBottom: "15px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
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
                    <h4 style={{ margin: 0, color: "#1f2937" }}>{note.title}</h4>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {new Date(note.date).toLocaleDateString("bg-BG")}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.5" }}>{note.content}</p>
                </div>
              ))}

              {notes.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#6b7280",
                  }}
                >
                  <h3>Няма бележки</h3>
                  <p>Добавете първата бележка за този пациент</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h3>Изберете пациент</h3>
              <p>Кликнете върху пациент от списъка, за да видите бележките</p>
            </div>
          </div>
        )}
      </div>

      {/* Модал за добавяне на бележка */}
      {showAddNote && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              zIndex: 9999,
            }}
            onClick={() => setShowAddNote(false)}
          />

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              zIndex: 10000,
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#9333ea" }}>
              ➕ Нова бележка за {selectedPatient?.name}
            </h3>

            <input
              type="text"
              placeholder="Заглавие на бележката"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "16px",
                marginBottom: "15px",
                boxSizing: "border-box",
              }}
            />

            <textarea
              placeholder="Съдържание на бележката"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              rows={6}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "16px",
                marginBottom: "20px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddNote(false)}
                style={{
                  padding: "10px 20px",
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Отказ
              </button>
              <button
                onClick={addNote}
                style={{
                  padding: "10px 20px",
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Запази
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TherapistNotes;
