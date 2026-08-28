import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, ShieldCheck, PackageOpen, Truck, PhoneCall, Zap, Award } from 'lucide-react';
import ProductCard from '../../components/customer/ProductCard';
import Button from '../../components/common/Button';
import { useShop } from '../../context/ShopContext';

export function Home() {
  const { products, isLoadingProducts } = useShop();

  const features = [
    { icon: Truck, title: 'Express Dispatch', desc: 'Fast processing & doorstep shipment' },
    { icon: PhoneCall, title: 'Direct Hotline 9629217907', desc: '24/7 Order & Product Inquiry Support' },
    { icon: ShieldCheck, title: 'Verified Authenticity', desc: '100% genuine quality guaranteed' },
    { icon: Award, title: 'Premium Collection', desc: 'Handcrafted quality & sleek aesthetics' },
  ];

  return (
    <div>
      {/* Creative Hero Section */}
      <section style={{
        background: 'var(--grad-hero)',
        color: '#ffffff',
        padding: '5rem 0 6rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle Ambient Red Glow Orbs */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}></div>

        <div className="container hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div>
            {/* Glassmorphic Badge Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(245, 237, 226, 0.3)',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#f5ede2',
              marginBottom: '1.75rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}>
              <Sparkles size={18} style={{ color: '#fca5a5' }} /> High Precision E-Commerce Store
            </div>

            {/* Giant Luxury Heading */}
            <h1 className="hero-title">
              Experience <br />
              <span style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))'
              }}>
                Afsoo Shopping.
              </span>
            </h1>

            {/* Feature Pills under Heading */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.25)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.15)' }}>
                <Zap size={14} style={{ color: '#38bdf8' }} /> Express Dispatch
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.25)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.15)' }}>
                <ShieldCheck size={14} style={{ color: '#38bdf8' }} /> 100% Authentic
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.25)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.15)' }}>
                <Award size={14} style={{ color: '#38bdf8' }} /> Premium Quality
              </div>
            </div>
          </div>

          {/* Hero Showcase Image */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute',
              inset: '-15px',
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.45) 0%, rgba(0, 0, 0, 0) 75%)',
              filter: 'blur(25px)',
              zIndex: 1
            }}></div>
            <div style={{
              position: 'relative',
              zIndex: 2,
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(228, 213, 193, 0.4)',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(12px)',
              padding: '10px',
              animation: 'float 6s ease-in-out infinite',
            }}>
              <img
                src="/afsoopic.jpeg"
                alt="Afsoo Brand Showcase"
                style={{
                  width: '100%',
                  maxHeight: '380px',
                  objectFit: 'cover',
                  borderRadius: '18px',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Highlights Bar */}
      <section style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="grid grid-cols-4 gap-4">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="card hover-lift" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff', borderColor: 'var(--sandel-300)' }}>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--sandel-900)' }}>{feat.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--sandel-700)', marginTop: '0.15rem' }}>{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container section-padding">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '6px', height: '32px', background: 'var(--primary)', borderRadius: 'var(--radius-full)' }}></div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--sandel-900)', letterSpacing: '-0.02em' }}>
              Featured Collections
            </h2>
          </div>

          <Link to="/products" className="btn btn-outline btn-sm" style={{ fontWeight: 700 }}>
            View All Products
          </Link>
        </div>

        {isLoadingProducts ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--sandel-700)', fontWeight: 600 }}>
            Loading store products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4.5rem 2rem', background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--sandel-300)', boxShadow: 'var(--shadow-sm)' }}>
            <PackageOpen size={52} style={{ color: 'var(--primary)', marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--sandel-900)' }}>Store Catalog is Fresh & Ready</h3>
            <p style={{ color: 'var(--sandel-700)', margin: '0.625rem 0 1.75rem', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto', fontWeight: 600 }}>
              No products added yet. Log in to your Admin Portal to add products dynamically to your catalog!
            </p>
            <Link to="/admin/login" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Open Admin Portal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
