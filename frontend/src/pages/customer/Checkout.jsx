import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, CreditCard, Truck } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';

export function Checkout() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container section-padding" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <Card style={{ padding: '3rem 2rem' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success)', marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Checkout Demo Complete!</h2>
          <p style={{ color: 'var(--slate-600)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            In this Step 1 architecture setup, payment processing and database connections are intentionally disabled.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/orders">
              <Button variant="primary">View Orders Layout</Button>
            </Link>
            <Link to="/products">
              <Button variant="secondary">Continue Browsing</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.5rem' }}>
        Checkout Overview
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
        {/* Billing & Shipping Form */}
        <Card style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={20} style={{ color: 'var(--primary)' }} /> Shipping Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" className="form-input" defaultValue="Sarah" required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-input" defaultValue="Jenkins" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" defaultValue="sarah.j@example.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input type="text" className="form-input" defaultValue="742 Evergreen Terrace" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" className="form-input" defaultValue="Springfield" required />
            </div>
            <div className="form-group">
              <label className="form-label">Postal / Zip Code</label>
              <input type="text" className="form-input" defaultValue="97477" required />
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} style={{ color: 'var(--primary)' }} /> Payment Details (Mock)
          </h3>

          <div className="form-group">
            <label className="form-label">Cardholder Name</label>
            <input type="text" className="form-input" defaultValue="Sarah Jenkins" required />
          </div>

          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input type="text" className="form-input" defaultValue="4242 •••• •••• 4242" required />
          </div>
        </Card>

        {/* Order Summary & Submit */}
        <div>
          <Card style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem' }}>
              Your Order Items
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Aura SoundPro Headphones</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>Qty: 1</div>
                </div>
                <div style={{ fontWeight: 800 }}>{formatCurrency(199.99)}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Minimalist Chronograph Watch</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>Qty: 2</div>
                </div>
                <div style={{ fontWeight: 800 }}>{formatCurrency(298.00)}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(497.99)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, marginTop: '1rem' }}>
                <span>Total Due</span>
                <span style={{ color: 'var(--primary)' }}>{formatCurrency(497.99)}</span>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth icon={ShieldCheck}>
              Place Mock Order
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
