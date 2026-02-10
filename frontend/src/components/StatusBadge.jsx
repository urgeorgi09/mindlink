// frontend/src/components/StatusBadge.jsx
import React from 'react';

export const StatusBadge = ({ online, lastSeen, size = 'medium', showText = true }) => {
  // Определяме размера
  const sizeMap = {
    small: { dot: 8, text: '12px' },
    medium: { dot: 12, text: '13px' },
    large: { dot: 16, text: '14px' }
  };
  
  const dimensions = sizeMap[size] || sizeMap.medium;

  // Форматиране на "последно виждан"
  const formatLastSeen = (isoString) => {
    if (!isoString) return null;
    
    const diff = Date.now() - new Date(isoString);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (mins < 1) return 'току що';
    if (mins < 60) return `преди ${mins} мин`;
    if (hours < 24) return `преди ${hours} ч`;
    return `преди ${days} дни`;
  };

  if (!showText) {
    // Само точката
    return (
      <div
        style={{
          width: `${dimensions.dot}px`,
          height: `${dimensions.dot}px`,
          borderRadius: '50%',
          background: online ? '#22c55e' : '#9ca3af',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          animation: online ? 'pulse-green 2s infinite' : 'none'
        }}
        title={online ? 'Онлайн' : `Офлайн${lastSeen ? ` • ${formatLastSeen(lastSeen)}` : ''}`}
      />
    );
  }

  // С текст
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '12px',
        background: online ? 'rgba(34, 197, 94, 0.1)' : 'rgba(156, 163, 175, 0.1)',
        fontSize: dimensions.text,
      }}
    >
      <div
        style={{
          width: `${dimensions.dot}px`,
          height: `${dimensions.dot}px`,
          borderRadius: '50%',
          background: online ? '#22c55e' : '#9ca3af',
          animation: online ? 'pulse-green 2s infinite' : 'none'
        }}
      />
      <span style={{ color: online ? '#16a34a' : '#6b7280', fontWeight: 500 }}>
        {online ? 'онлайн' : lastSeen ? formatLastSeen(lastSeen) : 'офлайн'}
      </span>
    </div>
  );
};

// CSS анимация (добави в App.css или global styles)
const globalStyles = `
@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0);
  }
}
`;

// Експортваме и стиловете за вграждане в App
export const StatusBadgeStyles = globalStyles;
