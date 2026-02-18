import { useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CogIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const AdminHome = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const actions = [
    {
      icon: UserGroupIcon,
      title: 'Потребители',
      description: 'Управление на всички потребители',
      gradient: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
      path: '/therapist-system'
    },
    {
      icon: ChartBarIcon,
      title: 'Статистики',
      description: 'Системни метрики и анализи',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
      path: '/analytics'
    },
    {
      icon: CogIcon,
      title: 'Настройки',
      description: 'Системни конфигурации',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      path: '/privacy'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '6px 16px',
            background: 'rgba(234, 88, 12, 0.2)',
            border: '1px solid rgba(234, 88, 12, 0.3)',
            borderRadius: '20px',
            marginBottom: '24px'
          }}>
            <span style={{ 
              color: '#ea580c', 
              fontSize: '14px', 
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              🔧 Админ панел
            </span>
          </div>

          <h1 style={{ 
            fontSize: isMobile ? '36px' : '72px', 
            color: 'white', 
            marginBottom: '24px', 
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: isMobile ? '-1px' : '-2px'
          }}>
            Системно управление
          </h1>
          
          <p style={{ 
            fontSize: isMobile ? '16px' : '22px', 
            color: 'rgba(255,255,255,0.8)', 
            marginBottom: '48px',
            maxWidth: '700px',
            lineHeight: '1.6'
          }}>
            Пълен контрол над платформата
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
          gap: '24px'
        }}>
          {actions.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '32px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                background: feature.gradient,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <feature.icon style={{ width: '28px', height: '28px', color: 'white' }} />
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: '600'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                lineHeight: '1.5',
                fontSize: '14px'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
