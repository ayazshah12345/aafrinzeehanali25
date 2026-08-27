import React from 'react';
import { ShoppingBag, Eye, Calendar, CreditCard, Truck, CheckCircle2, PackageCheck, AlertCircle, Clock, XCircle, PhoneCall } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';

export function MyOrders() {
  const { orders, isLoadingOrders, currentUser, sessionOrderIds = [] } = useShop();

  // Filter orders strictly so customer sees ONLY their placed product orders (no mixing with other emails)
  const myOrders = orders.filter((order) => {
    const userEmail = currentUser && currentUser.email ? currentUser.email.toLowerCase().trim() : '';
    const orderEmail = order.email ? order.email.toLowerCase().trim() : '';

    if (currentUser) {
      // Admin role can see all orders if visiting tracking
      if (currentUser.role === 'admin') return true;

      // Strict email & user ID isolation: Orders MUST match the logged-in email/user_id
      const matchEmail = Boolean(userEmail && orderEmail && userEmail === orderEmail);
      const matchUserId = Boolean(currentUser.id && String(order.user_id) === String(currentUser.id));

      return matchEmail || matchUserId;
    }

    // Guest user (not signed in) — only show orders placed during this current browsing session
    const isSessionOrder = sessionOrderIds.some(
      (sId) => String(sId) === String(order.id) || String(sId) === String(order.db_id)
    );
    return isSessionOrder;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'success';
      case 'Order Confirmed':
        return 'primary';
      case 'Shipped':
      case 'Processing':
        return 'info';
      case 'Cancelled':
        return 'danger';
      case 'Pending':
      default:
        return 'warning';
    }
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Order Confirmed':
        return 2;
      case 'Processing':
      case 'Shipped':
        return 3;
      case 'Delivered':
      case 'Completed':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  return (
    <div className="container section-padding">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>Order Tracking & History</h1>
        <p style={{ color: 'var(--slate-500)' }}>
          {currentUser
            ? `Viewing orders placed by ${currentUser.email}`
            : 'Viewing orders placed in your current browsing session.'}
        </p>
      </div>

      {isLoadingOrders ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
          Fetching latest order status from PostgreSQL database...
        </div>
      ) : myOrders.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <ShoppingBag size={48} style={{ color: 'var(--slate-300)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-800)' }}>No Product Orders Found</h3>
          <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>
            {currentUser
              ? `No orders found registered under ${currentUser.email}.`
              : 'You have not placed any orders in this session. Sign in to view past orders.'}
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {myOrders.map((order) => {
            const stepIndex = getStatusStepIndex(order.status);
            const isConfirmed = order.status === 'Order Confirmed';
            const isCancelled = order.status === 'Cancelled';

            return (
              <Card key={order.id} style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
                {/* Header Information */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      Order Reference ID
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0.2rem 0' }}>
                      {order.id}
                    </h3>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
                      Product Name: {order.productName || 'Afsoo Premium Store Product'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
                      <Calendar size={16} /> Date: <strong>{order.date}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
                      <CreditCard size={16} /> Total: <strong>{formatCurrency(order.total)}</strong>
                    </div>

                    <Badge variant={getStatusBadgeVariant(order.status)} style={{ fontSize: '0.875rem', padding: '0.4rem 0.85rem', fontWeight: 800 }}>
                      {isCancelled && <XCircle size={15} style={{ marginRight: '4px' }} />}
                      {isConfirmed && <PackageCheck size={15} style={{ marginRight: '4px' }} />}
                      {order.status === 'Shipped' && <Truck size={15} style={{ marginRight: '4px' }} />}
                      {order.status === 'Completed' && <CheckCircle2 size={15} style={{ marginRight: '4px' }} />}
                      Status: {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Primary Order Track Message Banner */}
                <div
                  style={{
                    background: isCancelled
                      ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
                      : isConfirmed
                      ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                      : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    border: `1.5px solid ${isCancelled ? '#ef4444' : isConfirmed ? '#10b981' : '#3b82f6'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    {isCancelled ? (
                      <XCircle size={22} style={{ color: '#dc2626', marginTop: '2px', flexShrink: 0 }} />
                    ) : isConfirmed ? (
                      <PackageCheck size={22} style={{ color: '#059669', marginTop: '2px', flexShrink: 0 }} />
                    ) : (
                      <Clock size={22} style={{ color: '#2563eb', marginTop: '2px', flexShrink: 0 }} />
                    )}
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isCancelled ? '#991b1b' : isConfirmed ? '#065f46' : '#1e3a8a', margin: 0, marginBottom: '0.25rem' }}>
                        📦 Live PostgreSQL Order Track Message
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: isCancelled ? '#7f1d1d' : isConfirmed ? '#047857' : '#1e40af', lineHeight: '1.5', fontWeight: 600 }}>
                        Product Name: <strong>{order.productName || 'Afsoo Product'}</strong> | Order ID: <strong>{order.id}</strong> | Current Status: <strong style={{ textDecoration: 'underline' }}>{order.status}</strong>
                      </p>
                      {isConfirmed && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <CheckCircle2 size={16} /> Admin has confirmed your product order! It is now being processed for delivery.
                        </div>
                      )}
                      {isCancelled && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <AlertCircle size={16} /> This product order was cancelled by the store administrator.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Real-time Order Progress Steps */}
                {!isCancelled && (
                  <div style={{ marginBottom: '1.25rem', padding: '0 0.5rem' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Fulfillment Progress Tracker
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative' }}>
                      {[
                        { label: 'Order Placed', step: 1 },
                        { label: 'Order Confirmed', step: 2 },
                        { label: 'Shipped / Processing', step: 3 },
                        { label: 'Delivered', step: 4 },
                      ].map((st) => {
                        const isActive = stepIndex >= st.step;
                        const isCurrent = stepIndex === st.step;

                        return (
                          <div
                            key={st.step}
                            style={{
                              textAlign: 'center',
                              background: isActive ? (isCurrent ? 'var(--primary)' : 'var(--slate-100)') : 'var(--slate-50)',
                              color: isActive ? (isCurrent ? 'white' : 'var(--slate-800)') : 'var(--slate-400)',
                              border: `1px solid ${isActive ? 'var(--primary)' : 'var(--slate-200)'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '0.625rem 0.5rem',
                              fontWeight: isCurrent ? 800 : 600,
                              fontSize: '0.8125rem',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.1rem' }}>Step {st.step}</div>
                            <div>{st.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Customer Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PhoneCall size={16} style={{ color: 'var(--primary)' }} /> Contact Helpline: <strong>9629217907</strong>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>
                    Synced live with PostgreSQL Database
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrders;

