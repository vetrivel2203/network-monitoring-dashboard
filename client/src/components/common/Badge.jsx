import React from 'react';

export default function Badge({ status, text, size = 'md' }) {
  const normStatus = (status || '').toUpperCase();
  
  let bg = 'rgba(100, 116, 139, 0.2)';
  let color = '#94a3b8';
  let border = 'rgba(100, 116, 139, 0.3)';
  let dotColor = '#94a3b8';

  if (normStatus === 'ONLINE' || normStatus === 'SUCCESS' || normStatus === 'ACCEPT') {
    bg = 'rgba(16, 185, 129, 0.15)';
    color = '#10b981';
    border = 'rgba(16, 185, 129, 0.4)';
    dotColor = '#10b981';
  } else if (normStatus === 'DEGRADED' || normStatus === 'WARNING') {
    bg = 'rgba(245, 158, 11, 0.15)';
    color = '#f59e0b';
    border = 'rgba(245, 158, 11, 0.4)';
    dotColor = '#f59e0b';
  } else if (normStatus === 'OFFLINE' || normStatus === 'CRITICAL' || normStatus === 'REJECT') {
    bg = 'rgba(239, 68, 68, 0.15)';
    color = '#ef4444';
    border = 'rgba(239, 68, 68, 0.4)';
    dotColor = '#ef4444';
  } else if (normStatus === 'DEMO' || normStatus === 'DEMO MODE') {
    bg = 'rgba(0, 210, 255, 0.15)';
    color = '#00d2ff';
    border = 'rgba(0, 210, 255, 0.4)';
    dotColor = '#00d2ff';
  } else if (normStatus === 'INFO') {
    bg = 'rgba(59, 130, 246, 0.15)';
    color = '#3b82f6';
    border = 'rgba(59, 130, 246, 0.4)';
    dotColor = '#3b82f6';
  }

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSmall ? '2px 8px' : '4px 12px',
        borderRadius: '9999px',
        fontSize: isSmall ? '0.75rem' : '0.8125rem',
        fontWeight: 600,
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        letterSpacing: '0.025em',
        textTransform: 'uppercase'
      }}
    >
      <span
        style={{
          width: isSmall ? '5px' : '6px',
          height: isSmall ? '5px' : '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: `0 0 6px ${dotColor}`
        }}
      />
      {text || normStatus}
    </span>
  );
}