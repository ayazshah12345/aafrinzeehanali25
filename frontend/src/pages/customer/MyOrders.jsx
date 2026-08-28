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
          Fetching latest order status...
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
                      ? 'rgba(248, 113, 113, 0.15)'
                      : isConfirmed
                      ? 'rgba(52, 211, 153, 0.15)'
                      : 'rgba(56, 189, 248, 0.15)',
                    border: `1.5px solid ${isCancelled ? '#f87171' : isConfirmed ? '#34d399' : '#00f2fe'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem 1.25rem',
                    marginBottom: '1.5rem',
                    boxShadow: isConfirmed ? '0 0 15px rgba(52, 211, 153, 0.2)' : '0 0 15px rgba(0, 242, 254, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    {isCancelled ? (
                      <XCircle size={24} style={{ color: '#f87171', marginTop: '2px', flexShrink: 0 }} />
                    ) : isConfirmed ? (
                      <PackageCheck size={24} style={{ color: '#34d399', marginTop: '2px', flexShrink: 0 }} />
                    ) : (
                      <Clock size={24} style={{ color: '#00f2fe', marginTop: '2px', flexShrink: 0 }} />
                    )}
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: isCancelled ? '#f87171' : isConfirmed ? '#34d399' : '#00f2fe', margin: 0, marginBottom: '0.35rem', textShadow: '0 0 8px currentColor' }}>
                        📦 Live Order Tracking Update
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', lineHeight: '1.6', fontWeight: 600 }}>
                        Product Name: <strong style={{ color: '#00f2fe' }}>{order.productName || 'Afsoo Product'}</strong> | Order ID: <strong style={{ color: '#c084fc' }}>{order.id}</strong> | Status: <strong style={{ textDecoration: 'underline', color: isCancelled ? '#f87171' : isConfirmed ? '#34d399' : '#38bdf8' }}>
                          {order.status === 'Delivered' || order.status === 'Completed' ? '🎉 Delivered' : order.status === 'Shipped' ? '🚚 Shipped' : order.status === 'Processing' ? '⚙️ Processing' : order.status === 'Order Confirmed' ? '✅ Order Confirmed' : order.status === 'Cancelled' ? '❌ Cancelled' : '⏳ Pending'}
                        </strong>
                      </p>
                      {isConfirmed && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <CheckCircle2 size={16} /> ✅ Admin has confirmed your order! It is now being processed for delivery.
                        </div>
                      )}
                      {isCancelled && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <AlertCircle size={16} /> ❌ Order was cancelled by store administrator.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Real-time Order Progress Steps with Emojis */}
                {!isCancelled && (
                  <div style={{ marginBottom: '1.5rem', padding: '0 0.25rem' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#00f2fe', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', textShadow: '0 0 8px rgba(0, 242, 254, 0.4)' }}>
                      ⚡ Real-Time Fulfillment Tracker
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', position: 'relative' }}>
                      {[
                        { label: 'Order Placed', emoji: '📝', step: 1 },
                        { label: 'Order Confirmed', emoji: '✅', step: 2 },
                        { label: 'Shipped / Processing', emoji: '🚚⚙️', step: 3 },
                        { label: 'Delivered', emoji: '🎉', step: 4 },
                      ].map((st) => {
                        const isActive = stepIndex >= st.step;
                        const isCurrent = stepIndex === st.step;

                        return (
                          <div
                            key={st.step}
                            style={{
                              textAlign: 'center',
                              background: isCurrent ? 'var(--grad-primary)' : isActive ? '#1e2942' : '#0d1322',
                              color: isCurrent ? '#05070e' : isActive ? '#ffffff' : '#64748b',
                              border: `1px solid ${isCurrent ? '#00f2fe' : isActive ? '#38bdf8' : '#1e2942'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '0.75rem 0.5rem',
                              fontWeight: isCurrent ? 800 : 700,
                              fontSize: '0.85rem',
                              boxShadow: isCurrent ? '0 0 15px rgba(0, 242, 254, 0.5)' : 'none',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <div style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{st.emoji}</div>
                            <div style={{ fontSize: '0.72rem', opacity: 0.85, textTransform: 'uppercase', fontWeight: 800 }}>Step {st.step}</div>
                            <div style={{ fontSize: '0.8125rem' }}>{st.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Customer Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #1e2942' }}>
                  <div style={{ fontSize: '0.875rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PhoneCall size={16} style={{ color: '#00f2fe' }} /> Helpline: <strong style={{ color: '#ffffff' }}>9629217907</strong>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: '#00f2fe', fontWeight: 700, textShadow: '0 0 6px rgba(0, 242, 254, 0.4)' }}>
                    ⚡ Synced Live in Real Time
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

