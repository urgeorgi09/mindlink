import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PatientEmotions = () => {
  const { patientId } = useParams();
  const [emotions, setEmotions] = useState([]);
  const [filteredEmotions, setFilteredEmotions] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchPatientEmotions();
    const interval = setInterval(fetchPatientEmotions, 2000);
    return () => clearInterval(interval);
  }, [patientId]);

  useEffect(() => {
    filterEmotions();
  }, [emotions, dateFilter, startDate, endDate]);

  const filterEmotions = () => {
    let filtered = [...emotions];
    
    if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(e => new Date(e.date) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(e => new Date(e.date) >= monthAgo);
    } else if (dateFilter === 'custom' && startDate && endDate) {
      filtered = filtered.filter(e => {
        const date = new Date(e.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }
    
    setFilteredEmotions(filtered);
  };

  const fetchPatientEmotions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/therapist/patient-emotions/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setEmotions(data.emotions || []);
        setPatientName(data.patientName || 'Пациент');
      } else {
        alert(`Грешка: ${data.message || 'Не може да се заредят емоциите'}`);
        setEmotions([]);
        setPatientName('Пациент');
      }
    } catch (error) {
      console.error('Error fetching emotions:', error);
      alert('Грешка при свързване със сървъра');
      setEmotions([]);
      setPatientName('Пациент');
    } finally {
      setLoading(false);
    }
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      'Щастие': '#22c55e',
      'Тъга': '#3b82f6',
      'Гняв': '#ef4444',
      'Страх': '#a855f7',
      'Тревожност': '#f59e0b',
      'Спокойствие': '#10b981'
    };
    return colors[emotion] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Зареждане...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>📊 Емоционален анализ - {patientName}</h1>

      {/* Date Filter */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '600' }}>Филтър:</span>
          <button
            onClick={() => setDateFilter('all')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: dateFilter === 'all' ? '#667eea' : '#e5e7eb',
              color: dateFilter === 'all' ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Всички
          </button>
          <button
            onClick={() => setDateFilter('week')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: dateFilter === 'week' ? '#667eea' : '#e5e7eb',
              color: dateFilter === 'week' ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Последна седмица
          </button>
          <button
            onClick={() => setDateFilter('month')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: dateFilter === 'month' ? '#667eea' : '#e5e7eb',
              color: dateFilter === 'month' ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Последен месец
          </button>
          <button
            onClick={() => setDateFilter('custom')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: dateFilter === 'custom' ? '#667eea' : '#e5e7eb',
              color: dateFilter === 'custom' ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Персонализиран
          </button>
          
          {dateFilter === 'custom' && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              />
              <span>до</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              />
            </>
          )}
        </div>
      </div>

      {filteredEmotions.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '100px 50px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
          <h2 style={{ color: '#6b7280', marginBottom: '15px' }}>
            Няма записани емоции
          </h2>
          <p style={{ color: '#9ca3af' }}>
            Този пациент все още не е добавил емоционални записи.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredEmotions.map((entry) => (
            <div
              key={entry.id}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {new Date(entry.date).toLocaleDateString('bg-BG')}
                </span>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: getEmotionColor(entry.emotion),
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {entry.emotion}
                </span>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Интензитет:</strong>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#e5e7eb', 
                  borderRadius: '4px',
                  marginTop: '5px'
                }}>
                  <div style={{
                    width: `${entry.intensity}%`,
                    height: '100%',
                    background: getEmotionColor(entry.emotion),
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              {entry.notes && (
                <div style={{ marginTop: '10px', color: '#374151' }}>
                  <strong>Бележки:</strong> {entry.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientEmotions;
