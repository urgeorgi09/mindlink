import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    specialty: "",
    experience: "",
    phone: "",
    education: "",
    sessionPrice: 80,
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProfile({
        name: data.user.name,
        email: data.user.email,
        specialty: data.user.specialty || "",
        experience: data.user.experience || "",
        phone: data.user.phone || "",
        education: data.user.education || "",
        sessionPrice: data.user.session_price || 80,
        profileImage: data.user.profile_image || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/therapist/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          experience: profile.experience,
          phone: profile.phone,
          education: profile.education,
          sessionPrice: profile.sessionPrice,
          profileImage: profile.profileImage,
        }),
      });

      if (response.ok) {
        setMessage("Профилът е обновен успешно!");
      } else {
        const data = await response.json();
        setMessage(data.message || `Грешка ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setMessage(`Грешка в мрежата: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Зареждане...</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
          padding: "40px",
          borderRadius: "20px 20px 0 0",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: profile.profileImage ? `url(${profile.profileImage})` : "#f0fdf4",
            backgroundSize: "cover",
            backgroundPosition: "center",
            margin: "0 auto 20px",
            border: "4px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "60px",
          }}
        >
          {!profile.profileImage && "🩺"}
        </div>
        <h1 style={{ margin: "0 0 10px 0", fontSize: "2rem" }}>{profile.name}</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>{profile.specialty}</p>
      </div>

      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "0 0 20px 20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4b5563" }}>Име</label>
            <input
              type="text"
              value={profile.name}
              disabled
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                background: "#f9fafb",
                boxSizing: "border-box",
                color: "#6b7280",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4b5563" }}>Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                background: "#f9fafb",
                boxSizing: "border-box",
                color: "#6b7280",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4b5563" }}>
            🖼️ Профилна снимка
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
              cursor: "pointer",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4b5563" }}>
              💼 Опит
            </label>
            <input
              type="text"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              placeholder="5 години опит"
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4b5563" }}>
              📞 Телефон
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+359..."
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4b5563" }}>
            🎓 Образование
          </label>
          <input
            type="text"
            value={profile.education}
            onChange={(e) => setProfile({ ...profile, education: e.target.value })}
            placeholder="Магистър по психология"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4b5563" }}>
            💰 Цена на сесия (лв)
          </label>
          <input
            type="number"
            value={profile.sessionPrice}
            onChange={(e) => setProfile({ ...profile, sessionPrice: parseInt(e.target.value) })}
            min="0"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {message && (
          <div
            style={{
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
              background: message.includes("успешно") ? "#d1fae5" : "#fee2e2",
              color: message.includes("успешно") ? "#065f46" : "#991b1b",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            padding: "16px",
            background: saving ? "#9ca3af" : "linear-gradient(135deg, #9333ea, #7c3aed)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3)",
          }}
        >
          {saving ? "⚙️ Запазване..." : "✅ Запази промените"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
