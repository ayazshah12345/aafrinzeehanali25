import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, Users, Shield, ArrowLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export function AdminSidebar() {
  const { pendingOrdersCount } = useShop();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Add Product', path: '/admin/products/new', icon: PlusCircle },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
  ];

  return (
    <aside className="admin-sidebar-aside">
      <div>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem 1.25rem 0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
            }}>
              <Shield size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>Afsoo Admin</h2>
              <span style={{ fontSize: '0.72rem', color: '#e0e7ff', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Control Panel</span>
            </div>
          </div>

          <NavLink
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#e0e7ff',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.1)',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <ArrowLeft size={14} /> Exit
          </NavLink>
        </div>

        {/* Nav Links */}
        <nav className="admin-nav-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '1.25rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isOrders = item.label === 'Orders';
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                  color: isActive ? '#ffffff' : '#c7d2fe',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  boxShadow: isActive ? '0 4px 14px rgba(79, 70, 229, 0.45)' : 'none',
                  whiteSpace: 'nowrap',
                })}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {isOrders && pendingOrdersCount > 0 && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.18rem 0.55rem',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                    }}
                    title={`${pendingOrdersCount} Pending Order(s)`}
                  >
                    {pendingOrdersCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Back to store link on desktop */}
      <div className="nav-desktop" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '1rem' }}>
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.625rem 1rem',
            borderRadius: 'var(--radius-md)',
            color: '#f5ede2',
            fontSize: '0.875rem',
            fontWeight: 700,
            transition: 'var(--transition)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Exit to Customer Store</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default AdminSidebar;
