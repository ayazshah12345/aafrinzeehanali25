import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import { useShop } from '../../context/ShopContext';

export function Checkout() {
  const { cart, clearCart, placeOrder, currentUser } = useShop();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('9629217907');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 150.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !email || !address || !phone) {
      alert('Please fill in all shipping details.');
      return;
    }

    setIsSubmitting(true);
    const firstProduct = cart[0]?.product;
    const order = await placeOrder({
      customerName,
      email,
      address,
      phone,
      product: firstProduct,
      quantity: cart.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: total,
      items: cart,
    });

    clearCart();
    setIsSubmitting(false);
    setConfirmedOrder(order);
  };

  if (confirmedOrder) {
    return (
      <div className="container section-padding" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <Card style={{ padding: '3rem 2rem' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success)', marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed & Saved in Database!</h2>
          <p style={{ color: 'var(--slate-600)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Thank you, <strong>{confirmedOrder.customer}</strong>! Your order reference is{' '}
            <strong style={{ color: 'var(--primary)' }}>{confirmedOrder.id}</strong>. It has been sent directly to the Admin Control Panel and stored in PostgreSQL.
          </p>

          <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Order Reference:</span>
              <strong style={{ color: 'var(--primary)' }}>{confirmedOrder.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Total Amount:</span>
              <strong>{formatCurrency(confirmedOrder.total)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Fulfillment Status:</span>
              <span style={{ color: '#d97706', fontWeight: 700 }}>Pending</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/orders">
              <Button variant="primary">Track My Orders</Button>
            </Link>
            <Link to="/products">
              <Button variant="secondary">Continue Shopping</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container section-padding" style={{ maxWidth: '540px', textAlign: 'center' }}>
        <Card style={{ padding: '3rem 2rem' }}>
          <ShoppingBag size={48} style={{ color: 'var(--slate-300)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your Cart is Empty</h3>
          <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>Add some products to your cart before proceeding to checkout.</p>
          <Link to="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
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
            <Truck size={20} style={{ color: 'var(--primary)' }} /> Shipping & Delivery Details
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9629217907"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Complete Delivery Address</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter street, city, state and pincode..."
              required
            />
          </div>
        </Card>

        {/* Order Summary & Submit */}
        <div>
          <Card style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem' }}>
              Your Order Summary ({cart.length} items)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {cart.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.product.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 800 }}>{formatCurrency((item.product?.price || 0) * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, marginTop: '1rem' }}>
                <span>Total Due</span>
                <span style={{ color: 'var(--primary)' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth icon={ShieldCheck} disabled={isSubmitting}>
              {isSubmitting ? 'Saving Order to PostgreSQL DB...' : 'Place Order Now'}
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
