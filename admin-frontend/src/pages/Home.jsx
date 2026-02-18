import { useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CogIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const AdminHome = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const actions = [
    {
      icon: UserGroupIcon,
      title: 'Потребители',
      description: 'Управление на всички потребители в платформата',
      gradient: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
      path: '/therapist-system'
    },
    {
      icon: ChartBarIcon,
      title: 'Статистики',
      description: 'Системни метрики и анализи на данните',
      gradient: 'linear-gradient(135deg, #7fb570 0%, #6da65f 50%, #5b964e 100%)',
      path: '/analytics'
    },
    {
      icon: CogIcon,
      title: 'Настройки',
      description: 'Системни конфигурации и параметри',
      gradient: 'linear-gradient(135deg, #c4e3ba 0%, #a8d99c 50%, #91c481 100%)',
      path: '/privacy'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f8f4 0%, #e8f5ee 50%, #e0f2e9 100%)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(145, 196, 129, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(127, 181, 112, 0.05) 0%, transparent 50%)',
        animation: 'pulse 8s ease-in-out infinite'
      }} />

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: isMobile ? '40px 20px' : '80px 40px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Welcome Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '80px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease-out 0.2s'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(145, 196, 129, 0.15)',
            border: '1px solid rgba(145, 196, 129, 0.3)',
            borderRadius: '24px',
            marginBottom: '24px'
          }}>
            <span style={{ 
              color: '#6da65f', 
              fontSize: '14px', 
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              🔧 Админ панел
            </span>
          </div>

          <h1 style={{ 
            fontSize: isMobile ? '36px' : '72px', 
            color: '#1e293b', 
            marginBottom: '24px', 
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: isMobile ? '-1px' : '-2px',
            background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Системно управление
          </h1>
          
          <p style={{ 
            fontSize: isMobile ? '16px' : '22px', 
            color: '#64748b', 
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Пълен контрол над платформата
          </p>
        </div>

        {/* Admin Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
          gap: '24px',
          marginBottom: '80px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease-out 0.4s'
        }}>
          {actions.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              style={{
                background: '#ffffff',
                padding: '40px',
                borderRadius: '20px',
                border: activeFeature === index 
                  ? '2px solid #6da65f' 
                  : '1px solid #d4edda',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: activeFeature === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: activeFeature === index 
                  ? '0 20px 60px rgba(109, 166, 95, 0.2)' 
                  : '0 4px 16px rgba(109, 166, 95, 0.08)'
              }}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: feature.gradient,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 8px 24px rgba(109, 166, 95, 0.2)'
              }}>
                <feature.icon style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <h3 style={{ 
                fontSize: '22px', 
                marginBottom: '12px', 
                color: '#1e293b',
                fontWeight: '700'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                color: '#64748b', 
                lineHeight: '1.6',
                fontSize: '15px'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Card */}
        <div style={{
          background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
          borderRadius: '24px',
          padding: isMobile ? '40px 20px' : '60px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(109, 166, 95, 0.25)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease-out 0.6s'
        }}>
          <SparklesIcon style={{ 
            width: '48px', 
            height: '48px', 
            color: 'white',
            margin: '0 auto 16px'
          }} />
          <h3 style={{ 
            fontSize: isMobile ? '24px' : '32px', 
            color: 'white', 
            marginBottom: '16px',
            fontWeight: '800'
          }}>
            Административен контрол
          </h3>
          <p style={{ 
            fontSize: isMobile ? '16px' : '20px', 
            color: 'rgba(255,255,255,0.95)',
            fontStyle: 'italic',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            "Добре управляваната платформа е основата на качествената грижа за психичното здраве."
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default AdminHome;
