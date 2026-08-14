import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Shield, RefreshCw, Truck } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid var(--slate-200)', marginTop: '4rem' }}>
      {/* Features Bar */}
      <div style={{ borderBottom: '1px solid var(--slate-100)', padding: '2rem 0', background: 'var(--slate-50)' }}>
        <div className="container grid grid-cols-4 gap-6 text-center">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Truck style={{ color: 'var(--primary)' }} size={28} />
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Express Global Delivery</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>Free tracking on all orders over ₹999</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Shield style={{ color: 'var(--primary)' }} size={28} />
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Secure Checkout</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>256-bit SSL encrypted transactions</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw style={{ color: 'var(--primary)' }} size={28} />
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>30-Day Easy Returns</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>Hassle-free money back guarantee</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Heart style={{ color: 'var(--primary)' }} size={28} />
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Dedicated Support</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>24/7 customer service assistance</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container section-padding grid grid-cols-3 gap-8">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.35rem', borderRadius: 'var(--radius-md)', display: 'flex' }}>
              <ShoppingBag size={20} />
            </div>
            <span>AfsooCommerce</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', lineHeight: '1.6' }}>
            Curated e-commerce platform offering premium technology, lifestyle essentials, and modern electronics.
          </p>
        </div>

        <div>
          <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--slate-900)' }}>Shop Catalog</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            <li><Link to="/products">Browse All Products</Link></li>
            <li><Link to="/products">Featured Items</Link></li>
            <li><Link to="/cart">My Shopping Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--slate-900)' }}>Customer Service</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            <li><Link to="/orders">My Order History</Link></li>
            <li><Link to="/login">Account Login</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/admin/login" style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Shield size={13} /> Admin Portal Login</Link></li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--slate-200)', padding: '1.25rem 0', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
        © {new Date().getFullYear()} Afsoo Commerce Inc. Built with React + Vite & Node + Express.
      </div>
    </footer>
  );
}

export default Footer;
