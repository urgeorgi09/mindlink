import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnonymous } from '../context/AnonymousContext';
import {
  ChartBarIcon,
  HeartIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAnonymous();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Зареждане...</h2>
      </div>
    );
  }

  // User Analytics
  if (user.role === 'user') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f8f4 0%, #e8f5ee 50%, #e0f2e9 100%)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'white',
              border: '2px solid #d4edda',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              color: '#6da65f'
            }}
          >
            <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
            Назад
          </button>

          <h1 style={{
            fontSize: '48px',
            color: '#1e293b',
            marginBottom: '40px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Вашата аналитика
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {[
              {
                icon: HeartIcon,
                title: 'Записи за настроение',
                value: stats.moodEntries || 0,
                color: '#91c481',
                gradient: 'linear-gradient(135deg, #91c481 0%, #7fb570 100%)'
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: 'Дневникови записи',
                value: stats.journalEntries || 0,
                color: '#a8d99c',
                gradient: 'linear-gradient(135deg, #a8d99c 0%, #91c481 100%)'
              },
              {
                icon: ArrowTrendingUpIcon,
                title: 'Средно настроение',
                value: (stats.averageMood || 0).toFixed(1) + '/10',
                color: '#7fb570',
                gradient: 'linear-gradient(135deg, #7fb570 0%, #6da65f 100%)'
              }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '20px',
                  border: '1px solid #d4edda',
                  boxShadow: '0 4px 16px rgba(109, 166, 95, 0.08)'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: stat.gradient,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <stat.icon style={{ width: '28px', height: '28px', color: 'white' }} />
                </div>
                <h3 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </h3>
                <p style={{ color: '#64748b', fontSize: '15px' }}>
                  {stat.title}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid #d4edda',
            boxShadow: '0 4px 16px rgba(109, 166, 95, 0.08)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#1e293b' }}>
              Вашият прогрес
            </h2>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Продължавайте да записвате вашето настроение и мисли. Редовното проследяване помага за по-добро разбиране на емоционалното ви състояние.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Therapist Analytics
  if (user.role === 'therapist') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f8f4 0%, #e8f5ee 50%, #e0f2e9 100%)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'white',
              border: '2px solid #d4edda',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              color: '#6da65f'
            }}
          >
            <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
            Назад
          </button>

          <h1 style={{
            fontSize: '48px',
            color: '#1e293b',
            marginBottom: '40px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Статистика на пациенти
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {[
              {
                icon: UserGroupIcon,
                title: 'Общо пациенти',
                value: stats.totalPatients || 0,
                color: '#91c481',
                gradient: 'linear-gradient(135deg, #91c481 0%, #7fb570 100%)'
              },
              {
                icon: CalendarIcon,
                title: 'Сесии този месец',
                value: stats.sessionsThisMonth || 0,
                color: '#a8d99c',
                gradient: 'linear-gradient(135deg, #a8d99c 0%, #91c481 100%)'
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: 'Активни чатове',
                value: stats.activeChats || 0,
                color: '#7fb570',
                gradient: 'linear-gradient(135deg, #7fb570 0%, #6da65f 100%)'
              }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '20px',
                  border: '1px solid #d4edda',
                  boxShadow: '0 4px 16px rgba(109, 166, 95, 0.08)'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: stat.gradient,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <stat.icon style={{ width: '28px', height: '28px', color: 'white' }} />
                </div>
                <h3 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </h3>
                <p style={{ color: '#64748b', fontSize: '15px' }}>
                  {stat.title}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid #d4edda',
            boxShadow: '0 4px 16px rgba(109, 166, 95, 0.08)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#1e293b' }}>
              Преглед на активността
            </h2>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Вашите пациенти показват отличен прогрес. Продължавайте с професионалната подкрепа.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin Analytics - All platform statistics
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8f4 0%, #e8f5ee 50%, #e0f2e9 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'white',
            border: '2px solid #d4edda',
            padding: '12px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            color: '#6da65f'
          }}
        >
          <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
          Назад
        </button>

        <h1 style={{
          fontSize: '48px',
          color: '#1e293b',
          marginBottom: '40px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Платформена аналитика
        </h1>

        {/* Platform Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {[
            {
              icon: UserGroupIcon,
              title: 'Общо потребители',
              value: stats.totalUsers || 0,
              color: '#91c481',
              gradient: 'linear-gradient(135deg, #91c481 0%, #7fb570 100%)'
            },
            {
              icon: UserGroupIcon,
              title: 'Активни потребители',
              value: stats.activeUsers || 0,
              color: '#a8d99c',
              gradient: 'linear-gradient(135deg, #a8d99c 0%, #91c481 100%)'
            },
            {
              icon: UserGroupIcon,
              title: 'Терапевти',
              value: stats.totalTherapists || 0,
              color: '#7fb570',
              gradient: 'linear-gradient(135deg, #7fb570 0%, #6da65f 100%)'
            },
            {
              icon: HeartIcon,
              title: 'Записи за настроение',
              value: stats.moodEntries || 0,
              color: '#c4e3ba',
              gradient: 'linear-gradient(135deg, #c4e3ba 0%, #a8d99c 100%)'
            }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid #d4edda',
                boxShadow: '0 4px 16px rgba(109, 166, 95, 0.08)'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                background: stat.gradient,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <stat.icon style={{ width: '28px', height: '28px', color: 'white' }} />
              </div>
              <h3 style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                {stat.value}
              </h3>
              <p style={{ color: '#64748b', fontSize: '15px' }}>
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid #d4edda',
            boxShadow: '0 4px 16px rgba(109, 166, 95, 0.08)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#1e293b' }}>
              Потребителска активност
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Дневникови записи</span>
                <span style={{ fontWeight: '700', color: '#1e293b' }}>{stats.journalEntries || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Записи за настроение</span>
                <span style={{ fontWeight: '700', color: '#1e293b' }}>{stats.moodEntries || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Средно настроение</span>
                <span style={{ fontWeight: '700', color: '#1e293b' }}>{(stats.averageMood || 0).toFixed(1)}/10</span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid #d4edda',
            boxShadow: '0 4px 16px rgba(109, 166, 95, 0.08)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#1e293b' }}>
              Терапевтска активност
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Общо пациенти</span>
                <span style={{ fontWeight: '700', color: '#1e293b' }}>{stats.totalPatients || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Активни сесии</span>
                <span style={{ fontWeight: '700', color: '#1e293b' }}>{stats.sessionsThisMonth || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
