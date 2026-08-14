import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useShop } from '../../context/ShopContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginUser } = useShop();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginUser({ email, password });
    setIsSubmitting(false);

    if (res.success) {
      setSuccess('Login successful! Redirecting to orders...');
      setTimeout(() => {
        navigate('/orders');
      }, 1200);
    } else {
      setError(res.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="container section-padding" style={{ maxWidth: '440px' }}>
      <Card style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--primary)', color: 'white', padding: '0.625rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
            <ShoppingBag size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>Customer Sign In</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>Access your account, track orders & manage cart</p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--danger)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--success)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <CheckCircle size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" icon={LogIn} disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
            {isSubmitting ? 'Verifying Account...' : 'Sign In to Customer Account'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Register Now</Link>
        </div>
      </Card>
    </div>
  );
}

export default Login;
