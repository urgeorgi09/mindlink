import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const AdminVerifications = () => {
  const { colors } = useTheme();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/verifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVerifications(response.data.verifications);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (id, status, reason = null) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/admin/verify/${id}`,
        { status, rejectionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Верификацията е ${status === 'approved' ? 'одобрена' : 'отхвърлена'}`);
      fetchVerifications();
    } catch (error) {
      alert('❌ Грешка: ' + (error.response?.data?.message || 'Опитайте отново'));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Зареждане...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: colors.primary, marginBottom: '20px' }}>
        🔍 Заявки за верификация на терапевти
      </h2>

      {verifications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: colors.surface,
          borderRadius: '12px'
        }}>
          <p style={{ color: colors.textSecondary }}>Няма чакащи заявки</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {verifications.map((verification) => (
            <div
              key={verification.id}
              style={{
                background: colors.surface,
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: colors.text }}>
                    👨‍⚕️ {verification.name}
                  </h3>
                  <p style={{ margin: '0', color: colors.textSecondary, fontSize: '14px' }}>
                    📧 {verification.email}
                  </p>
                  <p style={{ margin: '5px 0 0 0', color: colors.textSecondary, fontSize: '14px' }}>
                    🆔 Лиценз: {verification.license_number}
                  </p>
                </div>
                <div style={{
                  padding: '8px 16px',
                  background: `${colors.warning}20`,
                  borderRadius: '8px',
                  height: 'fit-content'
                }}>
                  <span style={{ color: colors.warning, fontWeight: '600' }}>⏳ Чака одобрение</span>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <img
                  src={verification.document_url}
                  alt="Document"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '8px',
                    border: `2px solid ${colors.border}`
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleVerification(verification.id, 'approved')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Одобри
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Причина за отхвърляне:');
                    if (reason) handleVerification(verification.id, 'rejected', reason);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Отхвърли
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerifications;
