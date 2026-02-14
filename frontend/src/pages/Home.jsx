import { useNavigate } from 'react-router-dom';
import { useAnonymous } from '../context/AnonymousContext';
import { HeartIcon, ChatBubbleLeftRightIcon, ChartBarIcon, ShieldCheckIcon, BookOpenIcon, UserGroupIcon, CalendarIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAnonymous();

  // Guest view
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', color: 'white', marginBottom: '20px', fontWeight: 'bold' }}>MindLink+</h1>
          <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.9)', marginBottom: '40px' }}>Платформа за психично здраве</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '60px' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <HeartIcon style={{ width: '48px', height: '48px', color: '#667eea', margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Проследяване на настроението</h3>
              <p style={{ color: '#666' }}>Ежедневно проследяване и визуализация на вашето емоционално състояние</p>
            </div>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <ChatBubbleLeftRightIcon style={{ width: '48px', height: '48px', color: '#667eea', margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Връзка с терапевт</h3>
              <p style={{ color: '#666' }}>Директна комуникация с професионални терапевти</p>
            </div>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <ChartBarIcon style={{ width: '48px', height: '48px', color: '#667eea', margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Аналитика</h3>
              <p style={{ color: '#666' }}>Детайлна статистика и тенденции на вашия прогрес</p>
            </div>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <ShieldCheckIcon style={{ width: '48px', height: '48px', color: '#667eea', margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Поверителност</h3>
              <p style={{ color: '#666' }}>Пълен контрол над вашите данни и поверителност</p>
            </div>
          </div>

          <div style={{ marginTop: '60px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/login')} style={{ padding: '15px 40px', fontSize: '18px', background: 'white', color: '#667eea', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Вход</button>
            <button onClick={() => navigate('/register')} style={{ padding: '15px 40px', fontSize: '18px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Регистрация</button>
          </div>
        </div>
      </div>
    );
  }

  // User view
  if (user.role === 'user') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', color: 'white', marginBottom: '10px' }}>Добре дошли, {user.name}!</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '40px' }}>Как се чувствате днес?</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div onClick={() => navigate('/mood-tracker')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <HeartIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Проследяване на настроението</h3>
              <p style={{ color: '#666' }}>Запишете как се чувствате днес</p>
            </div>
            <div onClick={() => navigate('/journal')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <BookOpenIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Дневник</h3>
              <p style={{ color: '#666' }}>Споделете вашите мисли и чувства</p>
            </div>
            <div onClick={() => navigate('/chat')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <ChatBubbleLeftRightIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Чат с терапевт</h3>
              <p style={{ color: '#666' }}>Свържете се с вашия терапевт</p>
            </div>
            <div onClick={() => navigate('/analytics')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <ChartBarIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Аналитика</h3>
              <p style={{ color: '#666' }}>Вижте вашия прогрес</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Therapist view
  if (user.role === 'therapist') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', color: 'white', marginBottom: '10px' }}>Добре дошли, д-р {user.name}!</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '40px' }}>Управлявайте вашите пациенти</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div onClick={() => navigate('/therapist-system')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <UserGroupIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Моите пациенти</h3>
              <p style={{ color: '#666' }}>Преглед и управление на пациенти</p>
            </div>
            <div onClick={() => navigate('/chat')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <ChatBubbleLeftRightIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Съобщения</h3>
              <p style={{ color: '#666' }}>Комуникация с пациенти</p>
            </div>
            <div onClick={() => navigate('/therapist-system')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <CalendarIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Бележки от сесии</h3>
              <p style={{ color: '#666' }}>Записвайте и преглеждайте бележки</p>
            </div>
            <div onClick={() => navigate('/analytics')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <ChartBarIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Статистика</h3>
              <p style={{ color: '#666' }}>Преглед на прогреса на пациентите</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin view
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', color: 'white', marginBottom: '10px' }}>Администраторски панел</h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '40px' }}>Управление на системата</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div onClick={() => navigate('/therapist-system')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <UserGroupIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Потребители</h3>
            <p style={{ color: '#666' }}>Управление на всички потребители</p>
          </div>
          <div onClick={() => navigate('/analytics')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <ChartBarIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Статистика</h3>
            <p style={{ color: '#666' }}>Обща статистика на платформата</p>
          </div>
          <div onClick={() => navigate('/privacy')} style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <ShieldCheckIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Сигурност</h3>
            <p style={{ color: '#666' }}>Настройки за сигурност и поверителност</p>
          </div>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <SparklesIcon style={{ width: '40px', height: '40px', color: '#667eea', marginBottom: '15px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>Системни настройки</h3>
            <p style={{ color: '#666' }}>Конфигурация на платформата</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
