import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Smartphone, MapPin, User, Phone, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

export function GetProductModal({ product, isOpen, onClose }) {
  const { placeOrder, currentUser } = useShop();
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.email) setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);

  if (!isOpen || !product) return null;

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !address || !phone) {
      alert('Please fill in your name, email address, delivery address, and phone number.');
      return;
    }

    const order = placeOrder({
      customerName,
      email: customerEmail,
      address,
      phone,
      product,
      quantity: 1,
    });

    setConfirmedOrder(order);
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    setAddress('');
    setPhone('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          padding: '2rem',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--slate-100)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--slate-600)',
          }}
        >
          <X size={18} />
        </button>

        {confirmedOrder ? (
          /* Confirmation Success State */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <CheckCircle size={36} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              Order Placed Successfully!
            </h2>

            <p style={{ color: 'var(--slate-600)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
              Thank you, <strong>{confirmedOrder.customer}</strong>! Your order reference is{' '}
              <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{confirmedOrder.id}</span>.
            </p>

            <div
              style={{
                background: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'left',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--slate-500)' }}>Item Ordered:</span>
                <span style={{ fontWeight: 700 }}>{product.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--slate-500)' }}>Status:</span>
                <span style={{ fontWeight: 800, color: '#d97706' }}>Pending</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--slate-500)' }}>Amount Paid to 9629217907:</span>
                <span style={{ fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(confirmedOrder.total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-500)' }}>Delivery Address:</span>
                <span style={{ fontWeight: 600 }}>{confirmedOrder.address}</span>
              </div>
            </div>

            <div
              style={{
                background: 'var(--warning-bg)',
                color: 'var(--warning)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={18} /> Initial Status: Pending — Sent to Admin Control Panel
            </div>

            <Button variant="primary" fullWidth size="lg" onClick={handleClose}>
              Done & Close
            </Button>
          </div>
        ) : (
          /* Payment & Order Form State */
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
              Get The Product — Contact & Order Confirmation
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '1.25rem' }}>
              Follow the instructions below to complete your product order.
            </p>

            {/* Required Contact Instructions Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '2px solid #3b82f6',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem',
                color: '#1e3a8a',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <Phone size={24} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0, marginBottom: '0.25rem' }}>
                  Product Inquiry & Support Notice
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.45', fontWeight: 600 }}>
                  In order to get this product, contact the number <strong style={{ color: '#1d4ed8', fontSize: '1.05rem' }}>9629217907</strong> for further information and after that press <strong style={{ color: '#059669' }}>Confirm the Product</strong>.
                </p>
              </div>
            </div>

            {/* Product Summary Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'var(--slate-50)',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--slate-200)',
                marginBottom: '1.5rem',
              }}
            >
              <img
                src={product.image || product.image_url}
                alt={product.name}
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--slate-900)' }}>{product.name}</h4>
                <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>Category: {product.category}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>
                {formatCurrency(product.price)}
              </div>
            </div>

            <form onSubmit={handleConfirmOrder}>
              {/* Customer Details */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <User size={14} /> Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Mail size={14} /> Email Address (Order Confirmation)
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Phone size={14} /> Contact Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9629217907"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <MapPin size={14} /> Delivery Address
                </label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Enter complete shipping address with pincode..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* Payment Details Box - Specified Number 9629217907 */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  <Smartphone size={20} /> Pay / Contact Helpline
                </div>
                <div style={{ fontSize: '0.85rem', color: '#e0e7ff', marginBottom: '0.75rem' }}>
                  For further product details or payment confirmation, contact:
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '0.625rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textAlign: 'center',
                    border: '1px dashed rgba(255, 255, 255, 0.4)',
                  }}
                >
                  9629217907
                </div>
              </div>

              {/* Action Buttons: Confirm & Cancel */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  style={{ flex: 1, background: 'var(--success)', borderColor: 'var(--success)' }}
                >
                  Confirm the Product
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleClose}
                >
                  Cancel the Product
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetProductModal;
