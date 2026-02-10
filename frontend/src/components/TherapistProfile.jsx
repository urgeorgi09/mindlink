import React, { useState, useEffect } from "react";

const TherapistProfile = ({ therapistId, onClose }) => {
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (therapistId) {
      fetchTherapist();
    }
  }, [therapistId]);

  const fetchTherapist = async () => {
    try {
      const response = await fetch(`/api/therapist/profile/${therapistId}`);
      const data = await response.json();
      setTherapist(data.therapist);
    } catch (error) {
      console.error("Error fetching therapist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!therapistId) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h3>Зареждане...</h3>
            </div>
          ) : therapist ? (
            <>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <div
                  style={{ position: "relative", display: "inline-block", marginBottom: "15px" }}
                >
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background: therapist.profileImage
                        ? `url(${therapist.profileImage})`
                        : "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: therapist.profileImage ? "0" : "48px",
                      color: "white",
                      margin: "0 auto",
                    }}
                  >
                    {!therapist.profileImage && "🩺"}
                    {therapist.profileImage && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          color: "white",
                          border: "3px solid white",
                        }}
                      >
                        🩺
                      </div>
                    )}
                  </div>
                </div>

                <h2 style={{ margin: "0 0 5px 0", color: "#9333ea" }}>{therapist.name}</h2>
                <p style={{ margin: "0", color: "#22c55e", fontSize: "18px", fontWeight: 600 }}>
                  {therapist.specialty}
                </p>
              </div>

              {/* Info */}
              <div style={{ display: "grid", gap: "15px" }}>
                {therapist.experience && (
                  <div>
                    <h4 style={{ margin: "0 0 5px 0", color: "#374151" }}>📅 Опит</h4>
                    <p style={{ margin: 0, color: "#6b7280" }}>{therapist.experience}</p>
                  </div>
                )}

                {therapist.education && (
                  <div>
                    <h4 style={{ margin: "0 0 5px 0", color: "#374151" }}>🎓 Образование</h4>
                    <p style={{ margin: 0, color: "#6b7280" }}>{therapist.education}</p>
                  </div>
                )}

                {therapist.phone && (
                  <div>
                    <h4 style={{ margin: "0 0 5px 0", color: "#374151" }}>📞 Телефон</h4>
                    <p style={{ margin: 0, color: "#6b7280" }}>{therapist.phone}</p>
                  </div>
                )}

                {therapist.description && (
                  <div>
                    <h4 style={{ margin: "0 0 5px 0", color: "#374151" }}>📝 За мен</h4>
                    <p style={{ margin: 0, color: "#6b7280", lineHeight: "1.5" }}>
                      {therapist.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Close button */}
              <div style={{ textAlign: "center", marginTop: "25px" }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: "12px 24px",
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  Затвори
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h3>Терапевтът не е намерен</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TherapistProfile;
