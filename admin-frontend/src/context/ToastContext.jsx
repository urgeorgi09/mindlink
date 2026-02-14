import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, fadeOut: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 500);
    }, 5000);
  };

  const showConfirm = (message, onConfirm) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type: 'confirm', onConfirm }]);
  };

  const hideToast = (id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, fadeOut: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 500);
  };

  const success = (message) => showToast(message, 'success');
  const error = (message) => showToast(message, 'error');
  const info = (message) => showToast(message, 'info');
  const warning = (message) => showToast(message, 'warning');
  const confirm = (message, onConfirm) => showConfirm(message, onConfirm);

  return (
    <ToastContext.Provider value={{ success, error, info, warning, confirm }}>
      {children}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ toast, onClose }) => {
  const getStyle = () => {
    const base = {
      padding: '18px 24px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      minWidth: '320px',
      maxWidth: '450px',
      animation: toast.fadeOut ? 'slideOut 0.5s ease forwards' : 'slideIn 0.5s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      fontSize: '15px',
      fontWeight: '500',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
    };

    if (toast.type === 'confirm') {
      return { ...base, background: 'rgba(255,255,255,0.98)', border: '2px solid #3b82f6', flexDirection: 'column', alignItems: 'stretch' };
    }

    const styles = {
      success: { ...base, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' },
      error: { ...base, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' },
      warning: { ...base, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' },
      info: { ...base, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' },
    };

    return styles[toast.type] || styles.info;
  };

  const getIcon = () => {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
      confirm: '❓',
    };
    return icons[toast.type] || icons.info;
  };

  if (toast.type === 'confirm') {
    return (
      <div style={getStyle()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{ fontSize: '28px', color: '#3b82f6' }}>{getIcon()}</div>
          <div style={{ flex: 1, color: '#1f2937', fontSize: '16px' }}>{toast.message}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => { toast.onConfirm(); onClose(); }}
            style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Да
          </button>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '12px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Не
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={getStyle()}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>{toast.message}</div>
      <button
        onClick={onClose}
        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '22px', opacity: 0.9, borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
        onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.3)'; e.target.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.2)'; e.target.style.opacity = '0.9'; }}
      >
        ×
      </button>
    </div>
  );
};

// CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
