import React from 'react';

export function LoadingSpinner({ size = 24, label = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', padding: '1rem' }}>
      <div
        style={{
          width: size,
          height: size,
          border: '3px solid var(--slate-200)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      {label && <span style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>{label}</span>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
