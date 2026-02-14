import React, { useState, useEffect } from "react";
import { PencilSquareIcon, DocumentTextIcon, PlusIcon, ArrowLeftIcon } from '../components/Icons';

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
    <div style={{ display: "flex", flexDirection: window.innerWidth < 768 ? "column" : "row", height: "80vh", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Списък с пациенти */}
      <div
        style={{
          width: window.innerWidth < 768 ? "100%" : "320px",
          minWidth: window.innerWidth < 768 ? "auto" : "320px",
          height: window.innerWidth < 768 ? (selectedPatient ? "0" : "100%") : "100%",
          overflow: window.innerWidth < 768 && selectedPatient ? "hidden" : "visible",
          borderRight: window.innerWidth < 768 ? "none" : "1px solid #e5e7eb",
          borderBottom: window.innerWidth < 768 ? "1px solid #e5e7eb" : "none",
          background: "#f9fafb",
          display: window.innerWidth < 768 && selectedPatient ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0, color: "#9333ea", display: "flex", alignItems: "center", gap: "8px" }}>
            <PencilSquareIcon style={{ width: "24px", height: "24px", strokeWidth: 2 }} />
            Пациенти
          </h2>
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {selectedPatient ? (
          <>
            {/* Хедър */}
            <div
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #e5e7eb",
                background: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {window.innerWidth < 768 && (
                  <button
                    onClick={() => setSelectedPatient(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "24px",
                      cursor: "pointer",
                      padding: "0",
                    }}
                  >
                  <ArrowLeftIcon style={{ width: "20px", height: "20px", strokeWidth: 2.5 }} />
                  </button>
                )}
                <h3 style={{ margin: 0, color: "#9333ea", fontSize: "clamp(16px, 4vw, 20px)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <DocumentTextIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />
                  Бележки за {selectedPatient.name}
                </h3>
              </div>
              <button
                onClick={() => setShowAddNote(true)}
                style={{
                  padding: window.innerWidth < 768 ? "8px 12px" : "8px 16px",
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: window.innerWidth < 768 ? "13px" : "14px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                {window.innerWidth < 768 ? (
                  <PlusIcon style={{ width: "18px", height: "18px", strokeWidth: 2.5 }} />
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <PlusIcon style={{ width: "16px", height: "16px", strokeWidth: 2.5 }} />
                    Нова бележка
                  </span>
                )}
              </button>
            </div>

            {/* Списък с бележки */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: window.innerWidth < 768 ? "12px" : "20px",
                background: "#f9fafb",
              }}
            >
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: window.innerWidth < 768 ? "12px" : "15px",
                    marginBottom: "15px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <h4 style={{ margin: 0, color: "#1f2937", fontSize: "clamp(15px, 3vw, 17px)", flex: 1 }}>{note.title}</h4>
                    <span style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>
                      {new Date(note.date).toLocaleDateString("bg-BG")}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.6", fontSize: "clamp(13px, 2.5vw, 15px)" }}>{note.content}</p>
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
              padding: window.innerWidth < 768 ? "20px" : "30px",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              zIndex: 10000,
              width: "90%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#9333ea", fontSize: "clamp(16px, 4vw, 20px)", display: "flex", alignItems: "center", gap: "8px" }}>
              <PlusIcon style={{ width: "20px", height: "20px", strokeWidth: 2.5 }} />
              Нова бележка за {selectedPatient?.name}
            </h3>

            <input
              type="text"
              placeholder="Заглавие на бележката"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              style={{
                width: "100%",
                padding: window.innerWidth < 768 ? "10px" : "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: window.innerWidth < 768 ? "14px" : "16px",
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
                padding: window.innerWidth < 768 ? "10px" : "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: window.innerWidth < 768 ? "14px" : "16px",
                marginBottom: "20px",
                boxSizing: "border-box",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowAddNote(false)}
                style={{
                  padding: window.innerWidth < 768 ? "8px 16px" : "10px 20px",
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: window.innerWidth < 768 ? "14px" : "15px",
                  fontWeight: "600",
                }}
              >
                Отказ
              </button>
              <button
                onClick={addNote}
                style={{
                  padding: window.innerWidth < 768 ? "8px 16px" : "10px 20px",
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: window.innerWidth < 768 ? "14px" : "15px",
                  fontWeight: "600",
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
