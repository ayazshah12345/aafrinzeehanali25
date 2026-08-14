import React from 'react';
import { Bell, Search, UserCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export function AdminHeader({ title }) {
  const { newOrdersCount, clearNotifications } = useShop();

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--sandel-300)',
      padding: '1.25rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between'
    }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--sandel-900)' }}>{title}</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--sandel-700)' }}>Afsoo Commerce — Store Administration Panel</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '220px' }}>
          <input
            type="text"
            placeholder="Search dashboard..."
            style={{
              width: '100%',
              background: 'var(--sandel-100)',
              border: '1px solid var(--sandel-300)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.75rem 0.45rem 2.2rem',
              color: 'var(--sandel-900)',
              fontSize: '0.85rem'
            }}
          />
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sandel-600)' }} />
        </div>

        {/* Notifications Icon with Badge */}
        <div
          onClick={clearNotifications}
          style={{ position: 'relative', padding: '0.5rem', cursor: 'pointer', color: 'var(--sandel-700)' }}
          title={newOrdersCount > 0 ? `${newOrdersCount} New Orders Received!` : 'Notifications'}
        >
          <Bell size={20} />
          {newOrdersCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: 'var(--primary)',
              color: 'white',
              fontSize: '0.68rem',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              {newOrdersCount}
            </span>
          )}
        </div>

        {/* Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', borderLeft: '1px solid var(--sandel-300)', paddingLeft: '1.25rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: 'white'
          }}>
            <UserCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--sandel-900)' }}>Afsoo Admin</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--sandel-700)' }}>Store Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
