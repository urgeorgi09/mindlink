import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { ClockIcon, ShieldCheckIcon, MagnifyingGlassIcon, CheckCircleIcon, InformationCircleIcon } from '../components/Icons';

const AllTherapistsPage = () => {
  const [therapists, setTherapists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`);
      const data = await response.json();
      const therapistsList = (data.users || [])
        .filter(u => u.role === 'therapist' && u.verified)
        .sort((a, b) => a.name.localeCompare(b.name, 'bg'));
      setTherapists(therapistsList);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTherapists = therapists.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.specialty && t.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <ClockIcon style={{ width: "48px", height: "48px", strokeWidth: 1.5, color: "#9ca3af", margin: "0 auto 10px" }} />
        <p>Зареждане...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <ShieldCheckIcon style={{ width: "40px", height: "40px", strokeWidth: 2 }} />
        Всички терапевти
      </h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '40px', fontSize: '1.1rem' }}>
        Преглед на {therapists.length} верифицирани терапевти
      </p>

      <div style={{ marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
        <input
          type="text"
          placeholder="Търсене по име или специалност..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 24px',
            fontSize: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '16px',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#9333ea';
            e.target.style.boxShadow = '0 4px 20px rgba(147, 51, 234, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
          }}
        />
      </div>

      {filteredTherapists.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          <MagnifyingGlassIcon style={{ width: "64px", height: "64px", strokeWidth: 1.5, color: "#9ca3af", margin: "0 auto 20px" }} />
          <p style={{ fontSize: '1.2rem' }}>Няма намерени терапевти</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {filteredTherapists.map((therapist) => (
            <div
              key={therapist.id}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '2px solid #f3f4f6',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(147, 51, 234, 0.15)';
                e.currentTarget.style.borderColor = '#e9d5ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#f3f4f6';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                  }}
                >
                  <ShieldCheckIcon style={{ width: "28px", height: "28px", strokeWidth: 1.5, color: "#9333ea" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: '#1f2937' }}>
                    {therapist.name}
                  </h3>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: '#f3e8ff',
                      color: '#6b21a8',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    <CheckCircleIcon style={{ width: "14px", height: "14px", strokeWidth: 2, display: "inline", marginRight: "4px" }} />
                    Верифициран
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ShieldCheckIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                  <span style={{ color: '#4b5563', fontSize: '15px' }}>
                    {therapist.specialty || 'Обща психология'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <InformationCircleIcon style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>{therapist.email}</span>
                </div>
              </div>

              {therapist.education && (
                <div
                  style={{
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '10px',
                    marginTop: '15px',
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                    Образование
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>{therapist.education}</div>
                </div>
              )}

              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '15px',
                  borderTop: '1px solid #f3f4f6',
                  fontSize: '13px',
                  color: '#9ca3af',
                }}
              >
                Регистриран: {new Date(therapist.created_at).toLocaleDateString('bg-BG')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTherapistsPage;
