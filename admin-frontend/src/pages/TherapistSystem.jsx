import React, { useState, useEffect } from "react";
import { useAnonymous } from "../context/AnonymousContext";

const TherapistSystem = () => {
  const { userRole, canAccess } = useAnonymous();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notes, setNotes] = useState("");
  const [sessionNotes, setSessionNotes] = useState([]);

  useEffect(() => {
    // Load mock patients data
    const mockPatients = [
      {
        id: 1,
        name: "Пациент А",
        email: "patient.a@example.com",
        joinDate: "2024-01-15",
        lastSession: "2024-12-20",
        status: "active",
        moodAvg: 6.2,
        sessionsCount: 8,
      },
      {
        id: 2,
        name: "Пациент Б",
        email: "patient.b@example.com",
        joinDate: "2024-02-10",
        lastSession: "2024-12-18",
        status: "active",
        moodAvg: 7.1,
        sessionsCount: 12,
      },
      {
        id: 3,
        name: "Пациент В",
        email: "patient.c@example.com",
        joinDate: "2024-03-05",
        lastSession: "2024-12-15",
        status: "inactive",
        moodAvg: 5.8,
        sessionsCount: 5,
      },
    ];
    setPatients(mockPatients);

    // Load session notes
    const saved = localStorage.getItem("therapistNotes");
    if (saved) setSessionNotes(JSON.parse(saved));
  }, []);

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!selectedPatient || !notes.trim()) return;

    const newNote = {
      id: Date.now(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      content: notes.trim(),
      date: new Date().toISOString(),
      therapist: "Текущ терапевт",
    };

    const updatedNotes = [newNote, ...sessionNotes];
    setSessionNotes(updatedNotes);
    localStorage.setItem("therapistNotes", JSON.stringify(updatedNotes));
    setNotes("");
  };

  const getPatientNotes = (patientId) => {
    return sessionNotes.filter((note) => note.patientId === patientId);
  };

  if (!canAccess("therapist")) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2 style={{ color: "#ef4444" }}>🚫 Достъп отказан</h2>
        <p>Нямате права за достъп до терапевтичната система.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#2d3748", marginBottom: "30px" }}>
        🩺 Терапевтична система
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Patients List */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>👥 Мои пациенти</h2>

          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {patients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                style={{
                  padding: "15px",
                  border:
                    selectedPatient?.id === patient.id ? "2px solid #667eea" : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  background: selectedPatient?.id === patient.id ? "#f0f4ff" : "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>{patient.name}</h3>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: patient.status === "active" ? "#dcfce7" : "#fef3c7",
                      color: patient.status === "active" ? "#166534" : "#92400e",
                    }}
                  >
                    {patient.status === "active" ? "Активен" : "Неактивен"}
                  </span>
                </div>

                <div style={{ fontSize: "14px", color: "#4a5568", marginBottom: "8px" }}>
                  📧 {patient.email}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#718096",
                  }}
                >
                  <span>Сесии: {patient.sessionsCount}</span>
                  <span>Средно настроение: {patient.moodAvg}/10</span>
                </div>

                <div style={{ fontSize: "12px", color: "#718096", marginTop: "5px" }}>
                  Последна сесия: {new Date(patient.lastSession).toLocaleDateString("bg-BG")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Details & Notes */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {!selectedPatient ? (
            <div style={{ textAlign: "center", color: "#718096", padding: "50px" }}>
              <h3>Изберете пациент</h3>
              <p>Кликнете върху пациент от списъка, за да видите детайли и да добавите бележки.</p>
            </div>
          ) : (
            <>
              <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>📋 {selectedPatient.name}</h2>

              {/* Patient Info */}
              <div
                style={{
                  padding: "15px",
                  background: "#f7fafc",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    fontSize: "14px",
                  }}
                >
                  <div>
                    <strong>Имейл:</strong> {selectedPatient.email}
                  </div>
                  <div>
                    <strong>Статус:</strong>{" "}
                    {selectedPatient.status === "active" ? "Активен" : "Неактивен"}
                  </div>
                  <div>
                    <strong>Започнал:</strong>{" "}
                    {new Date(selectedPatient.joinDate).toLocaleDateString("bg-BG")}
                  </div>
                  <div>
                    <strong>Сесии:</strong> {selectedPatient.sessionsCount}
                  </div>
                </div>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleSaveNote} style={{ marginBottom: "20px" }}>
                <h3 style={{ marginBottom: "10px", color: "#4a5568" }}>✍️ Добави бележка</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Бележки от сесията, наблюдения, препоръки..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    minHeight: "100px",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  💾 Запази бележка
                </button>
              </form>

              {/* Previous Notes */}
              <div>
                <h3 style={{ marginBottom: "15px", color: "#4a5568" }}>📝 История на бележките</h3>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {getPatientNotes(selectedPatient.id).length === 0 ? (
                    <p style={{ textAlign: "center", color: "#718096", fontStyle: "italic" }}>
                      Все още няма бележки за този пациент.
                    </p>
                  ) : (
                    getPatientNotes(selectedPatient.id).map((note) => (
                      <div
                        key={note.id}
                        style={{
                          padding: "12px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          marginBottom: "10px",
                          background: "#fafafa",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={{ fontSize: "12px", fontWeight: "600", color: "#4a5568" }}>
                            {note.therapist}
                          </span>
                          <span style={{ fontSize: "12px", color: "#718096" }}>
                            {new Date(note.date).toLocaleDateString("bg-BG")}{" "}
                            {new Date(note.date).toLocaleTimeString("bg-BG", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5" }}>
                          {note.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistSystem;
