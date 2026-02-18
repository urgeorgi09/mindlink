import React, { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { API_URL } from "../config";
import { Cog6ToothIcon, ArrowPathIcon, ShieldCheckIcon, ClockIcon, UserIcon, CheckCircleIcon, UserGroupIcon, ChartBarIcon, TrashIcon, InformationCircleIcon } from '../components/Icons';

const AdminDashboard = () => {
  const toast = useToast();
  const [therapists, setTherapists] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('therapists');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalTherapists: 0, pendingVerifications: 0, totalMoodEntries: 0, totalJournalEntries: 0, totalMessages: 0 });

  useEffect(() => {
    fetchTherapists();
    fetchAllUsers();
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTherapists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/therapists/unverified', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setTherapists(data.therapists || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setAllUsers(data.users || []);
      calculateStats(data.users || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const calculateStats = (users = allUsers) => {
    const totalUsers = users.filter(u => u.role === 'user').length;
    const totalTherapists = users.filter(u => u.role === 'therapist' && u.verified).length;
    const pendingVerifications = users.filter(u => u.role === 'therapist' && !u.verified).length;
    setStats(prev => ({ ...prev, totalUsers, totalTherapists, pendingVerifications }));
  };

  const deleteUser = async (userId, userName) => {
    toast.confirm(`Сигурни ли сте, че искате да изтриете акаунта на ${userName}?`, async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          toast.success("Акаунтът е изтрит успешно!");
          fetchAllUsers();
        } else {
          toast.error("Грешка при изтриване на акаунта");
        }
      } catch (error) {
        toast.error("Грешка при изтриване на акаунта");
      }
    });
  };

  const changeUserRole = async (userId, newRole, userName) => {
    toast.confirm(`Промяна на ролята на ${userName} на ${newRole}?`, async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/admin/users/${userId}/role`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        });

        if (response.ok) {
          toast.success("Ролята е променена успешно!");
          fetchAllUsers();
        } else {
          toast.error("Грешка при промяна на ролята");
        }
      } catch (error) {
        toast.error("Грешка при промяна на ролята");
      }
    });
  };

  const verifyTherapist = async (therapistId) => {
    try {
      const response = await fetch('/api/admin/therapists/verify', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ therapistId }),
      });

      if (response.ok) {
        toast.success("Терапевтът е верифициран успешно!");
        fetchTherapists();
        fetchAllUsers();
      } else {
        toast.error("Грешка при верификация");
      }
    } catch (error) {
      toast.error("Грешка при верификация");
    }
  };

  const getRoleBadge = (role, verified) => {
    if (role === 'admin') return { Icon: Cog6ToothIcon, text: 'Админ', color: '#ef4444' };
    if (role === 'therapist') {
      return verified 
        ? { Icon: CheckCircleIcon, text: 'Терапевт', color: '#10b981' }
        : { Icon: ClockIcon, text: 'Чака верификация', color: '#f59e0b' };
    }
    return { Icon: UserIcon, text: 'Потребител', color: '#3b82f6' };
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <ClockIcon style={{ width: "48px", height: "48px", strokeWidth: 1.5, color: "#9ca3af", margin: "0 auto 10px" }} />
        <p>Зареждане...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "15px" }}>
        <Cog6ToothIcon style={{ width: "32px", height: "32px", strokeWidth: 2 }} />
        Админ Панел
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "30px" }}>Управление на потребители и система</p>

      {/* Статистики */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '12px', padding: '20px', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalUsers || 0}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            <UserIcon style={{ width: "16px", height: "16px", strokeWidth: 2, display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
            Потребители
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '12px', padding: '20px', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalTherapists || 0}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            <ShieldCheckIcon style={{ width: "16px", height: "16px", strokeWidth: 2, display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
            Терапевти
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '12px', padding: '20px', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.pendingVerifications || 0}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            <ClockIcon style={{ width: "16px", height: "16px", strokeWidth: 2, display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
            Чакат верификация
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', borderRadius: '12px', padding: '20px', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalMoodEntries || 0}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            <ChartBarIcon style={{ width: "16px", height: "16px", strokeWidth: 2, display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
            Mood записи
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', borderRadius: '12px', padding: '20px', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalJournalEntries || 0}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            <ChartBarIcon style={{ width: "16px", height: "16px", strokeWidth: 2, display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
            Дневник записи
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', borderRadius: '12px', padding: '20px', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalMessages || 0}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            <ChartBarIcon style={{ width: "16px", height: "16px", strokeWidth: 2, display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
            Съобщения
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('therapists')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'therapists' ? '#ef4444' : '#e5e7eb',
            color: activeTab === 'therapists' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <ShieldCheckIcon style={{ width: "16px", height: "16px", strokeWidth: 2, display: "inline", marginRight: "4px" }} />
          Терапевти ({therapists.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'users' ? '#ef4444' : '#e5e7eb',
            color: activeTab === 'users' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <UserGroupIcon style={{ width: "16px", height: "16px", strokeWidth: 2, display: "inline", marginRight: "4px" }} />
          Всички акаунти ({allUsers.length})
        </button>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {activeTab === 'therapists' ? (
          <>
            <h2 style={{ fontSize: "24px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheckIcon style={{ width: "24px", height: "24px", strokeWidth: 2 }} />
              Терапевти за верификация
            </h2>

            {therapists.length === 0 ? (
              <p style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>
                Няма терапевти за верификация
              </p>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                {therapists.map((therapist) => (
                  <div
                    key={therapist.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                        {therapist.name}
                      </h3>
                      <p style={{ margin: "4px 0", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                        <InformationCircleIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                        {therapist.email}
                      </p>
                      <p style={{ margin: "4px 0", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                        <ShieldCheckIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                        {therapist.specialty || "Не е посочена специалност"}
                      </p>
                      {therapist.education && (
                        <p style={{ margin: "4px 0", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                          <InformationCircleIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                          {therapist.education}
                        </p>
                      )}
                      <p style={{ margin: "4px 0", fontSize: "12px", color: "#9ca3af" }}>
                        Регистриран: {new Date(therapist.created_at).toLocaleDateString("bg-BG")}
                      </p>
                    </div>
                    <button
                      onClick={() => verifyTherapist(therapist.id)}
                      style={{
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      <CheckCircleIcon style={{ width: "16px", height: "16px", strokeWidth: 2, display: "inline", marginRight: "4px" }} />
                      Верифицирай
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 style={{ fontSize: "24px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <UserGroupIcon style={{ width: "24px", height: "24px", strokeWidth: 2 }} />
              Всички акаунти
            </h2>
            <div style={{ display: "grid", gap: "15px" }}>
              {allUsers.map((user) => {
                const badge = getRoleBadge(user.role, user.verified);
                return (
                  <div
                    key={user.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "20px",
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                          {user.name}
                        </h3>
                        <p style={{ margin: "4px 0", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                          <InformationCircleIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                          {user.email}
                        </p>
                        {user.specialty && (
                          <p style={{ margin: "4px 0", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                            <ShieldCheckIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                            {user.specialty}
                          </p>
                        )}
                        {user.uin && (
                          <p style={{ margin: "4px 0", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                            <InformationCircleIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                            УИН: {user.uin}
                          </p>
                        )}
                        <p style={{ margin: "4px 0", fontSize: "12px", color: "#9ca3af" }}>
                          Регистриран: {new Date(user.created_at).toLocaleDateString("bg-BG")}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: badge.color + '20',
                          color: badge.color,
                          border: `1px solid ${badge.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {React.createElement(badge.Icon, { style: { width: "14px", height: "14px", strokeWidth: 2 } })}
                          {badge.text}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {user.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => changeUserRole(user.id, user.role === 'therapist' ? 'user' : 'therapist', user.name)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: '#3b82f6',
                                  color: 'white',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  fontWeight: '600'
                                }}
                              >
                                <ArrowPathIcon style={{ width: "14px", height: "14px", strokeWidth: 2, display: "inline", marginRight: "4px" }} />
                                Промени роля
                              </button>
                              <button
                                onClick={() => deleteUser(user.id, user.name)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: '#ef4444',
                                  color: 'white',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  fontWeight: '600'
                                }}
                              >
                                <TrashIcon style={{ width: "14px", height: "14px", strokeWidth: 2, display: "inline", marginRight: "4px" }} />
                                Изтрий
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
