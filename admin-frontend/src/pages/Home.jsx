import { useNavigate } from 'react-router-dom';
import { useAnonymous } from '../context/AnonymousContext';
import { 
  HeartIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  BookOpenIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  LockClosedIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAnonymous();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Guest view - Modern landing page
  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f8f4 0%, #e8f5ee 50%, #e0f2e9 100%)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Animated background particles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 20% 50%, rgba(145, 196, 129, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(127, 181, 112, 0.05) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite'
        }} />

        {/* Hero Section */}
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: isMobile ? '40px 20px 40px' : '80px 40px 60px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Navigation */}
          <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '80px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.8s ease-out',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: isMobile ? '40px' : '48px',
                height: isMobile ? '40px' : '48px',
                background: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(109, 166, 95, 0.4)',
                padding: '6px'
              }}>
                <img 
                  src="/vite-removebg-preview.png" 
                  alt="MindLink+ Logo" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                  }} 
                />
              </div>
              <span style={{ 
                fontSize: isMobile ? '20px' : '28px', 
                color: '#1e293b', 
                fontWeight: 'bold',
                letterSpacing: '-0.5px'
              }}>MindLink+</span>
            </div>
            <div style={{ display: 'flex', gap: isMobile ? '8px' : '20px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/login')} 
                style={{ 
                  padding: isMobile ? '10px 24px' : '12px 32px', 
                  fontSize: isMobile ? '14px' : '16px', 
                  background: 'white', 
                  color: '#6da65f', 
                  border: '2px solid #d4edda', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(109, 166, 95, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f0f9f4';
                  e.target.style.borderColor = '#6da65f';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#d4edda';
                }}
              >
                Вход
              </button>
              <button 
                onClick={() => navigate('/register')} 
                style={{ 
                  padding: isMobile ? '10px 24px' : '12px 32px', 
                  fontSize: isMobile ? '14px' : '16px', 
                  background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  boxShadow: '0 8px 24px rgba(109, 166, 95, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(109, 166, 95, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(109, 166, 95, 0.4)';
                }}
              >
                Започнете безплатно
                <ArrowRightIcon style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </nav>

          {/* Hero Content */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '100px',
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
                ✨ Вашето психично здраве е важно
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
              Модерна платформа<br />за психично здраве
            </h1>
            
            <p style={{ 
              fontSize: isMobile ? '16px' : '22px', 
              color: '#64748b', 
              marginBottom: '48px',
              maxWidth: '700px',
              margin: '0 auto 48px',
              lineHeight: '1.6',
              padding: isMobile ? '0 20px' : '0'
            }}>
              Професионална терапия, проследяване на настроението и персонализирана подкрепа — всичко на едно място
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: isMobile ? 'column' : 'row',
              padding: isMobile ? '0 20px' : '0',
              width: isMobile ? '100%' : 'auto'
            }}>
              <button 
                onClick={() => navigate('/register')} 
                style={{ 
                  padding: isMobile ? '16px 40px' : '18px 48px', 
                  fontSize: isMobile ? '16px' : '18px', 
                  background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '14px', 
                  cursor: 'pointer', 
                  fontWeight: '700',
                  boxShadow: '0 12px 40px rgba(109, 166, 95, 0.5)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: isMobile ? '100%' : 'auto',
                  maxWidth: isMobile ? '400px' : 'none',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 16px 48px rgba(109, 166, 95, 0.7)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 12px 40px rgba(109, 166, 95, 0.5)';
                  }
                }}
              >
                Регистрирайте се сега
                <ArrowRightIcon style={{ width: '20px', height: '20px' }} />
              </button>
              
              <button 
                onClick={() => navigate('/login')} 
                style={{ 
                  padding: isMobile ? '16px 40px' : '18px 48px', 
                  fontSize: isMobile ? '16px' : '18px', 
                  background: 'white', 
                  color: '#6da65f', 
                  border: '2px solid #d4edda', 
                  borderRadius: '14px', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  boxShadow: '0 4px 16px rgba(109, 166, 95, 0.1)',
                  transition: 'all 0.3s ease',
                  width: isMobile ? '100%' : 'auto',
                  maxWidth: isMobile ? '400px' : 'none',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.target.style.background = '#f0f9f4';
                    e.target.style.borderColor = '#6da65f';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#d4edda';
                  }
                }}
              >
                Вече имате акаунт?
              </button>
            </div>

            {/* Trust indicators */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: isMobile ? '20px' : '40px', 
              marginTop: '60px',
              color: '#64748b',
              fontSize: isMobile ? '12px' : '14px',
              flexWrap: 'wrap',
              padding: isMobile ? '0 20px' : '0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#6da65f' }} />
                <span>100% поверително</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LockClosedIcon style={{ width: '20px', height: '20px', color: '#6da65f' }} />
                <span>Криптирани данни</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StarIcon style={{ width: '20px', height: '20px', color: '#6da65f' }} />
                <span>Лицензирани терапевти</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
            gap: '24px',
            marginBottom: '100px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 0.4s',
            padding: isMobile ? '0 20px' : '0',
            maxWidth: '1000px',
            margin: isMobile ? '0 20px 100px' : '0 auto 100px'
          }}>
            {[
              {
                icon: HeartIcon,
                title: 'Проследяване на настроението',
                description: 'Ежедневно проследяване и визуализация на вашето емоционално състояние с AI анализ',
                gradient: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)'
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: 'Връзка с терапевт',
                description: 'Директна комуникация с професионални лицензирани терапевти 24/7',
                gradient: 'linear-gradient(135deg, #a8d99c 0%, #91c481 50%, #7fb570 100%)'
              },
              {
                icon: ChartBarIcon,
                title: 'Детайлна аналитика',
                description: 'Визуализация на прогреса, тенденции и персонализирани препоръки',
                gradient: 'linear-gradient(135deg, #7fb570 0%, #6da65f 50%, #5b964e 100%)'
              },
              {
                icon: ShieldCheckIcon,
                title: 'Пълна поверителност',
                description: 'End-to-end криптиране и пълен контрол над вашите лични данни',
                gradient: 'linear-gradient(135deg, #c4e3ba 0%, #a8d99c 50%, #91c481 100%)'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: activeFeature === index 
                    ? 'white' 
                    : '#ffffff',
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

          {/* Social Proof */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: isMobile ? '40px 20px' : '60px 40px',
            border: '1px solid #d4edda',
            textAlign: 'center',
            marginBottom: '60px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 0.6s',
            boxShadow: '0 8px 32px rgba(109, 166, 95, 0.1)',
            margin: isMobile ? '0 20px 60px' : '0 0 60px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: isMobile ? '30px' : '40px',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              <div>
                <div style={{ 
                  fontSize: isMobile ? '36px' : '48px', 
                  fontWeight: '800', 
                  color: '#1e293b',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  10,000+
                </div>
                <div style={{ color: '#64748b', fontSize: isMobile ? '14px' : '16px' }}>
                  Активни потребители
                </div>
              </div>
              <div>
                <div style={{ 
                  fontSize: isMobile ? '36px' : '48px', 
                  fontWeight: '800', 
                  color: '#1e293b',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  500+
                </div>
                <div style={{ color: '#64748b', fontSize: isMobile ? '14px' : '16px' }}>
                  Лицензирани терапевти
                </div>
              </div>
              <div>
                <div style={{ 
                  fontSize: isMobile ? '36px' : '48px', 
                  fontWeight: '800', 
                  color: '#1e293b',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  98%
                </div>
                <div style={{ color: '#64748b', fontSize: isMobile ? '14px' : '16px' }}>
                  Удовлетвореност
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            background: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
            borderRadius: '24px',
            padding: isMobile ? '40px 20px' : '60px 40px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(109, 166, 95, 0.25)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 0.8s',
            margin: isMobile ? '0 20px' : '0'
          }}>
            <h2 style={{ 
              fontSize: isMobile ? '32px' : '42px', 
              color: 'white', 
              marginBottom: '20px',
              fontWeight: '800',
              lineHeight: '1.2'
            }}>
              Готови ли сте да започнете?
            </h2>
            <p style={{ 
              fontSize: isMobile ? '16px' : '18px', 
              color: 'rgba(255,255,255,0.95)', 
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>
              Присъединете се към хиляди хора, които вече подобряват психичното си здраве
            </p>
            <button 
              onClick={() => navigate('/register')} 
              style={{ 
                padding: isMobile ? '16px 40px' : '18px 48px', 
                fontSize: isMobile ? '16px' : '18px', 
                background: 'white', 
                color: '#6da65f', 
                border: 'none', 
                borderRadius: '14px', 
                cursor: 'pointer', 
                fontWeight: '700',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                width: isMobile ? '100%' : 'auto',
                maxWidth: isMobile ? '300px' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                }
              }}
            >
              Създайте безплатен акаунт
            </button>
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
  }

  // User view - Modern landing style
  if (user.role === 'user') {
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
                {new Date().toLocaleDateString('bg-BG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
              Здравейте, {user.name}! 👋
            </h1>
            
            <p style={{ 
              fontSize: isMobile ? '16px' : '22px', 
              color: '#64748b', 
              marginBottom: '48px',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Как се чувствате днес?
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
            gap: '24px',
            marginBottom: '80px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 0.4s'
          }}>
            {[
              {
                icon: HeartIcon,
                title: 'Проследяване на настроението',
                description: 'Запишете как се чувствате днес',
                gradient: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
                path: '/mood'
              },
              {
                icon: BookOpenIcon,
                title: 'Личен дневник',
                description: 'Споделете вашите мисли и чувства',
                gradient: 'linear-gradient(135deg, #a8d99c 0%, #91c481 50%, #7fb570 100%)',
                path: '/journal'
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: 'Чат с терапевт',
                description: 'Свържете се с вашия терапевт',
                gradient: 'linear-gradient(135deg, #7fb570 0%, #6da65f 50%, #5b964e 100%)',
                path: '/patient-chat'
              },
              {
                icon: ChartBarIcon,
                title: 'Вашата аналитика',
                description: 'Вижте вашия прогрес и тенденции',
                gradient: 'linear-gradient(135deg, #c4e3ba 0%, #a8d99c 50%, #91c481 100%)',
                path: '/analytics'
              }
            ].map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
                style={{
                  background: activeFeature === index 
                    ? 'white' 
                    : '#ffffff',
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

          {/* Motivation Card */}
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
              Днешна мисъл
            </h3>
            <p style={{ 
              fontSize: isMobile ? '16px' : '20px', 
              color: 'rgba(255,255,255,0.95)',
              fontStyle: 'italic',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              "Грижата за психичното здраве не е признак на слабост, а проява на мъдрост и сила."
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
  }

  // Therapist view - Modern landing style
  if (user.role === 'therapist') {
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
                👨‍⚕️ Терапевтски панел
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
              Добре дошли, д-р {user.name}!
            </h1>
            
            <p style={{ 
              fontSize: isMobile ? '16px' : '22px', 
              color: '#64748b', 
              marginBottom: '48px',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Управлявайте вашите пациенти и сесии
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
            gap: '24px',
            marginBottom: '80px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 0.4s'
          }}>
            {[
              {
                icon: UserGroupIcon,
                title: 'Моите пациенти',
                description: 'Преглед и управление на всички пациенти',
                gradient: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
                path: '/therapist-system'
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: 'Съобщения',
                description: 'Комуникация с пациенти',
                gradient: 'linear-gradient(135deg, #a8d99c 0%, #91c481 50%, #7fb570 100%)',
                path: '/chat'
              },
              {
                icon: CalendarIcon,
                title: 'Бележки от сесии',
                description: 'Записвайте и преглеждайте бележки',
                gradient: 'linear-gradient(135deg, #7fb570 0%, #6da65f 50%, #5b964e 100%)',
                path: '/therapist-notes'
              },
              {
                icon: ChartBarIcon,
                title: 'Статистика',
                description: 'Преглед на прогреса на пациентите',
                gradient: 'linear-gradient(135deg, #c4e3ba 0%, #a8d99c 50%, #91c481 100%)',
                path: '/analytics'
              }
            ].map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
                style={{
                  background: activeFeature === index 
                    ? 'white' 
                    : '#ffffff',
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

          {/* Motivation Card */}
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
              Професионална подкрепа
            </h3>
            <p style={{ 
              fontSize: isMobile ? '16px' : '20px', 
              color: 'rgba(255,255,255,0.95)',
              fontStyle: 'italic',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              "Вашата работа променя животи. Благодарим ви за посвещението към психичното здраве."
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
  }

  // Admin view - System dashboard
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
            marginBottom: '16px'
          }}>
            <span style={{ color: '#fb923c', fontSize: '13px', fontWeight: '600' }}>
              🔐 Администраторски достъп
            </span>
          </div>
          <h1 style={{ 
            fontSize: '48px', 
            color: 'white', 
            marginBottom: '12px',
            fontWeight: '800'
          }}>
            Системен панел
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.7)'
          }}>
            Управление и мониторинг на платформата
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px'
        }}>
          {[
            {
              icon: UserGroupIcon,
              title: 'Управление на потребители',
              description: 'Преглед и администрация на всички потребители',
              gradient: 'linear-gradient(135deg, #91c481 0%, #7fb570 50%, #6da65f 100%)',
              path: '/therapist-system'
            },
            {
              icon: ChartBarIcon,
              title: 'Платформена статистика',
              description: 'Обща статистика и KPI-та',
              gradient: 'linear-gradient(135deg, #a8d99c 0%, #91c481 50%, #7fb570 100%)',
              path: '/analytics'
            },
            {
              icon: ShieldCheckIcon,
              title: 'Сигурност и поверителност',
              description: 'Настройки за защита на данните',
              gradient: 'linear-gradient(135deg, #7fb570 0%, #6da65f 50%, #5b964e 100%)',
              path: '/privacy'
            },
            {
              icon: SparklesIcon,
              title: 'Системни настройки',
              description: 'Конфигурация и оптимизация',
              gradient: 'linear-gradient(135deg, #c4e3ba 0%, #a8d99c 50%, #91c481 100%)',
              path: '#'
            }
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(109, 166, 95, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                background: item.gradient,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <item.icon style={{ width: '28px', height: '28px', color: 'white' }} />
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: '700'
              }}>
                {item.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
