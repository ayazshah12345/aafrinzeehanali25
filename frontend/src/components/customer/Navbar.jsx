import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X, Shield, LogOut, Package, Home as HomeIcon } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, logoutUser } = useShop();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', position: 'relative' }}>
        {/* Brand Logo & Avatar */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            position: 'relative',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid #38bdf8',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
            flexShrink: 0,
          }}>
            <img
              src="/afsoopic.jpeg"
              alt="Afsoo Brand Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Afsoo<span style={{ color: '#38bdf8' }}>Commerce</span>
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearch} className="nav-desktop" style={{ flex: 1, maxWidth: '380px', margin: '0 1.5rem', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search items, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '2.4rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '0.85rem',
            }}
          />
          <Search size={15} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
        </form>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
            Home
          </Link>
          <Link to="/products" style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
            Products
          </Link>
          <Link to="/orders" style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Package size={16} style={{ color: '#38bdf8' }} /> My Orders
          </Link>
          
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: '#ffffff', padding: '0.35rem' }} title="Shopping Cart">
            <ShoppingCart size={21} />
          </Link>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
                Hi, {currentUser.name || currentUser.email.split('@')[0]}
              </span>
              <button
                onClick={logoutUser}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                title="Sign Out"
              >
                <LogOut size={13} /> Exit
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '0.875rem' }}>
              <Link to="/login" className="btn btn-primary btn-sm" style={{ fontWeight: 800, padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <User size={14} /> Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ fontWeight: 800, padding: '0.35rem 0.75rem' }}>
                Register
              </Link>
            </div>
          )}

          <Link to="/admin/login" style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <Shield size={14} style={{ color: '#38bdf8' }} /> Admin Portal
          </Link>
        </nav>

        {/* Mobile Header Actions (Cart + Hamburger Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="nav-mobile-toggle">
          <Link to="/cart" style={{ color: 'var(--sandel-900)', padding: '0.35rem' }} onClick={() => setMobileMenuOpen(false)}>
            <ShoppingCart size={22} />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'var(--sandel-200)',
              border: '1px solid var(--sandel-300)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem',
              color: 'var(--sandel-900)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Vertical Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid var(--sandel-300)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideUpFade 0.25s ease',
        }}>
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search catalog items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: '2.5rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--sandel-50)',
                border: '1px solid var(--sandel-300)',
                fontSize: '0.9rem',
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sandel-600)' }} />
          </form>

          {/* Mobile Vertical Stacked Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--sandel-100)', borderRadius: 'var(--radius-md)', fontWeight: 800, color: 'var(--sandel-900)' }}
            >
              <HomeIcon size={18} style={{ color: 'var(--primary)' }} /> Home Page
            </Link>

            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--sandel-100)', borderRadius: 'var(--radius-md)', fontWeight: 800, color: 'var(--sandel-900)' }}
            >
              <Package size={18} style={{ color: 'var(--primary)' }} /> All Products Catalog
            </Link>

            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--sandel-100)', borderRadius: 'var(--radius-md)', fontWeight: 800, color: 'var(--sandel-900)' }}
            >
              <Package size={18} style={{ color: 'var(--primary)' }} /> My Customer Orders
            </Link>

            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--primary-light)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: 'var(--radius-md)', fontWeight: 800, color: 'var(--primary-dark)' }}
            >
              <Shield size={18} style={{ color: 'var(--primary)' }} /> Admin Portal Login
            </Link>

            {currentUser ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--sandel-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--sandel-300)', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>
                  Logged in as {currentUser.name || currentUser.email}
                </span>
                <button
                  onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                  className="btn btn-outline btn-sm"
                >
                  <LogOut size={14} /> Exit
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline btn-block"
                >
                  <User size={16} /> Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary btn-block"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
