import React from 'react';
import Card from '../common/Card';

export function StatCard({ title, value, change, icon: Icon, trend = 'up' }) {
  return (
    <Card className="admin-card" style={{ padding: '1.25rem', background: '#ffffff', border: '1px solid var(--sandel-300)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--sandel-700)' }}>{title}</span>
        {Icon && (
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '1.75rem', fontWeight: 800, color: 'var(--sandel-900)' }}>
        {value}
      </div>

      {change && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ color: trend === 'up' ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
            {trend === 'up' ? '+' : ''}{change}
          </span>
          <span style={{ color: 'var(--admin-muted)' }}>vs last month</span>
        </div>
      )}
    </Card>
  );
}

export default StatCard;
