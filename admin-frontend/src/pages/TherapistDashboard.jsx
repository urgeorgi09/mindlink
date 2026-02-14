import React, { useState, useEffect } from "react";
import { CheckCircleIcon, PencilIcon, CameraIcon, ShieldCheckIcon } from '../components/Icons';

const TherapistDashboard = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    specialty: "",
    experience: "",
    description: "",
    phone: "",
    education: "",
    profileImage: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, profileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.user) {
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          specialty: data.user.specialty || "",
          experience: data.user.experience || "",
          description: data.user.description || "",
          phone: data.user.phone || "",
          education: data.user.education || "",
          profileImage: data.user.profileImage || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/therapist/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setEditing(false);
        alert("Профилът е обновен успешно!");
      } else {
        alert("Грешка при обновяване на профила");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Грешка при обновяване на профила");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Зареждане...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Хедър */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            paddingBottom: "20px",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: profile.profileImage
                    ? `url(${profile.profileImage})`
                    : "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: profile.profileImage ? "0" : "36px",
                  color: "white",
                  cursor: editing ? "pointer" : "default",
                  position: "relative",
                }}
                onClick={editing ? () => document.getElementById("imageUpload").click() : undefined}
              >
                {!profile.profileImage && <ShieldCheckIcon style={{ width: "36px", height: "36px", strokeWidth: 1.5 }} />}
                {profile.profileImage && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      right: "-2px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "white",
                      border: "2px solid white",
                    }}
                  >
                    <ShieldCheckIcon style={{ width: "12px", height: "12px", strokeWidth: 2 }} />
                  </div>
                )}
                {editing && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#22c55e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "white",
                      border: "2px solid white",
                      cursor: "pointer",
                    }}
                  >
                    <CameraIcon style={{ width: "12px", height: "12px", strokeWidth: 2 }} />
                  </div>
                )}
              </div>
              {editing && (
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              )}
            </div>
            <div>
              <h1 style={{ margin: "0 0 5px 0", color: "#9333ea" }}>Моят профил</h1>
              <p style={{ margin: 0, color: "#6b7280" }}>Управлявайте информацията си</p>
            </div>
          </div>

          <button
            onClick={() => (editing ? updateProfile() : setEditing(true))}
            style={{
              padding: "12px 24px",
              background: editing ? "#22c55e" : "#9333ea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {editing ? <><CheckCircleIcon style={{ width: "20px", height: "20px", strokeWidth: 2, display: "inline", marginRight: "6px" }} />Запази</> : <><PencilIcon style={{ width: "20px", height: "20px", strokeWidth: 2, display: "inline", marginRight: "6px" }} />Редактирай</>}
          </button>
        </div>

        {/* Форма */}
        <div style={{ display: "grid", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label
                style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#374151" }}
              >
                Име
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!editing}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "16px",
                  background: editing ? "white" : "#f9fafb",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#374151" }}
              >
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled={true}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "16px",
                  background: "#f9fafb",
                  color: "#6b7280",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label
                style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#374151" }}
              >
                Специалност
              </label>
              <select
                value={profile.specialty}
                onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                disabled={!editing}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "16px",
                  background: editing ? "white" : "#f9fafb",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Изберете специалност</option>
                <option value="Клиничен психолог">Клиничен психолог</option>
                <option value="Психотерапевт">Психотерапевт</option>
                <option value="Детски психолог">Детски психолог</option>
                <option value="Психиатър">Психиатър</option>
              </select>
            </div>

            <div>
              <label
                style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#374151" }}
              >
                Опит
              </label>
              <input
                type="text"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                disabled={!editing}
                placeholder="напр. 5+ години опит"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "16px",
                  background: editing ? "white" : "#f9fafb",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#374151" }}
            >
              Телефон
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!editing}
              placeholder="напр. +359 888 123 456"
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "16px",
                background: editing ? "white" : "#f9fafb",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#374151" }}
            >
              Образование
            </label>
            <input
              type="text"
              value={profile.education}
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
              disabled={!editing}
              placeholder="напр. Магистър по психология, СУ"
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "16px",
                background: editing ? "white" : "#f9fafb",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#374151" }}
            >
              Описание
            </label>
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              disabled={!editing}
              rows={4}
              placeholder="Разкажете за себе си и вашия подход..."
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "16px",
                background: editing ? "white" : "#f9fafb",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {editing && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
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
                Отказ
              </button>
              <button
                onClick={updateProfile}
                style={{
                  padding: "12px 24px",
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                <CheckCircleIcon style={{ width: "20px", height: "20px", strokeWidth: 2, display: "inline", marginRight: "6px" }} />
                Запази промените
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
