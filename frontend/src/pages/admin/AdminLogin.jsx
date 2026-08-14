import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useShop } from '../../context/ShopContext';

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginUser } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both your admin email and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginUser({ email, password });
    setIsSubmitting(false);

    if (res && res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res?.message || 'Invalid admin credentials. Please try again.');
    }
  };

  return (
    <div style={{ background: 'var(--sandel-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Card style={{ padding: '2.5rem 2rem', background: '#ffffff', border: '1px solid var(--sandel-300)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' }}>
              <Shield size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--sandel-900)' }}>Admin Portal Access</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--sandel-700)', marginTop: '0.25rem' }}>Restricted System Control Panel</p>
          </div>

          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--danger)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleAdminAuth}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--sandel-900)' }}>Admin Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter admin email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ background: '#ffffff', border: '1px solid var(--sandel-300)', color: 'var(--sandel-900)', fontWeight: 600 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--sandel-900)' }}>Security Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ background: '#ffffff', border: '1px solid var(--sandel-300)', color: 'var(--sandel-900)', fontWeight: 600 }}
              />
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" icon={Lock} disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
              {isSubmitting ? 'Authenticating Admin Session...' : 'Authorize Admin Session'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/" style={{ fontSize: '0.8125rem', color: 'var(--sandel-700)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <ArrowLeft size={14} /> Back to Customer Storefront
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminLogin;
