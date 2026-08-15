import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X, Shield, LogOut, Package } from 'lucide-react';
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
    }
  };

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--sandel-300)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Brand Logo & Avatar */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid var(--primary)',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
            flexShrink: 0,
          }}>
            <img
              src="/afsoopic.jpeg"
              alt="Afsoo Brand Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--sandel-900)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Afsoo<span style={{ color: 'var(--primary)' }}>Commerce</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '420px', position: 'relative', minWidth: '180px' }}>
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
              fontSize: '0.875rem',
            }}
          />
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sandel-600)' }} />
        </form>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ fontWeight: 700, color: 'var(--sandel-900)', fontSize: '0.9rem', transition: 'var(--transition)' }}>
            Home
          </Link>
          <Link to="/products" style={{ fontWeight: 700, color: 'var(--sandel-900)', fontSize: '0.9rem', transition: 'var(--transition)' }}>
            Products
          </Link>
          <Link to="/orders" style={{ fontWeight: 700, color: 'var(--sandel-900)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Package size={16} style={{ color: 'var(--primary)' }} /> My Orders
          </Link>
          
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--sandel-900)', padding: '0.35rem' }} title="Shopping Cart">
            <ShoppingCart size={21} />
          </Link>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', borderLeft: '1px solid var(--sandel-300)', paddingLeft: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                Hi, {currentUser.name || currentUser.email.split('@')[0]}
              </span>
              <button
                onClick={logoutUser}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                title="Sign Out"
              >
                <LogOut size={13} /> Exit
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid var(--sandel-300)', paddingLeft: '0.875rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem' }}>
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
            color: 'var(--sandel-900)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--sandel-200)',
            border: '1px solid var(--sandel-300)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-sm)',
          }} title="Admin Control Panel Access">
            <Shield size={14} style={{ color: 'var(--primary)' }} /> Admin Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
