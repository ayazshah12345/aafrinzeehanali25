import React, { useState } from 'react';
import { Search, Eye, Filter, Phone, MapPin, Smartphone, BellRing, CheckCircle2 } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useShop } from '../../context/ShopContext';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';

export function ManageOrders() {
  const { orders, updateOrderStatus, markOrderAsSeen, newOrdersCount, clearNotifications } = useShop();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer.toLowerCase().includes(search.toLowerCase()) ||
      (ord.phone && ord.phone.includes(search));
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleReviewOrder = (ord) => {
    setSelectedOrder(ord);
    markOrderAsSeen(ord.id);
  };

  return (
    <div>
      <AdminHeader title="Manage Customer Orders" />

      <div style={{ padding: '2rem' }}>
        {/* New Order Alert Banner */}
        {newOrdersCount > 0 && (
          <div
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              padding: '0.875rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 700 }}>
              <BellRing size={20} className="animate-bounce" />
              <span>🔔 New Customer Order Alert: {newOrdersCount} new order(s) received & requiring fulfillment!</span>
            </div>
            <button
              onClick={clearNotifications}
              className="btn btn-sm"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
            >
              Acknowledge Alerts
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '380px' }}>
            <input
              type="text"
              placeholder="Search by order ID, customer, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--sandel-300)',
                borderRadius: 'var(--radius-md)',
                padding: '0.625rem 0.875rem 0.625rem 2.5rem',
                color: 'var(--sandel-900)',
                fontWeight: 600,
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sandel-700)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--sandel-900)', fontWeight: 700 }}>
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: '#ffffff', border: '1px solid var(--sandel-300)', color: 'var(--sandel-900)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 700 }}
            >
              <option value="All">All Order Statuses</option>
              <option value="Order Confirmed">Order Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer Name</th>
                  <th>Contact Info</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Fulfillment Status (Editable)</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: 'var(--sandel-700)', padding: '3rem' }}>
                      No customer orders recorded. Store is ready for new purchases.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                  <tr key={ord.id} style={ord.isNew ? { background: 'rgba(239, 68, 68, 0.08)' } : {}}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{ord.id}</span>
                        {ord.isNew && (
                          <span style={{ background: 'var(--danger)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)' }}>
                            NEW ORDER
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--sandel-900)' }}>{ord.customer}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--sandel-900)', fontWeight: 600 }}>
                        {ord.phone ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                            <Phone size={13} /> {ord.phone}
                          </div>
                        ) : (
                          ord.email
                        )}
                      </div>
                    </td>
                    <td style={{ color: 'var(--sandel-700)' }}>{ord.date}</td>
                    <td style={{ fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(ord.total)}</td>
                    <td>
                      <Badge variant="info" style={{ textTransform: 'none', fontSize: '0.72rem' }}>
                        <Smartphone size={12} style={{ marginRight: '4px' }} /> {ord.paymentStatus || 'Paid via 9629217907'}
                      </Badge>
                    </td>
                    <td>
                      {/* Interactive Status Selector */}
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        style={{
                          background:
                            ord.status === 'Completed' || ord.status === 'Delivered'
                              ? '#dcfce7'
                              : ord.status === 'Order Confirmed'
                              ? '#e0e7ff'
                              : ord.status === 'Shipped' || ord.status === 'Processing'
                              ? '#e0f2fe'
                              : ord.status === 'Cancelled'
                              ? '#fee2e2'
                              : '#fef3c7',
                          color:
                            ord.status === 'Completed' || ord.status === 'Delivered'
                              ? '#15803d'
                              : ord.status === 'Order Confirmed'
                              ? '#4338ca'
                              : ord.status === 'Shipped' || ord.status === 'Processing'
                              ? '#0369a1'
                              : ord.status === 'Cancelled'
                              ? '#b91c1c'
                              : '#b45309',
                          border: '1px solid var(--sandel-300)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.375rem 0.625rem',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Pending" style={{ background: '#ffffff', color: '#b45309', fontWeight: 800 }}>Pending</option>
                        <option value="Order Confirmed" style={{ background: '#ffffff', color: '#4338ca', fontWeight: 800 }}>Order Confirmed</option>
                        <option value="Processing" style={{ background: '#ffffff', color: '#0369a1', fontWeight: 800 }}>Processing</option>
                        <option value="Shipped" style={{ background: '#ffffff', color: '#0369a1', fontWeight: 800 }}>Shipped</option>
                        <option value="Delivered" style={{ background: '#ffffff', color: '#15803d', fontWeight: 800 }}>Delivered</option>
                        <option value="Completed" style={{ background: '#ffffff', color: '#15803d', fontWeight: 800 }}>Completed</option>
                        <option value="Cancelled" style={{ background: '#ffffff', color: '#b91c1c', fontWeight: 800 }}>Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          onClick={() => handleStatusChange(ord.id, 'Order Confirmed')}
                          style={{
                            background: ord.status === 'Order Confirmed' ? '#15803d' : '#f0fdf4',
                            color: ord.status === 'Order Confirmed' ? '#ffffff' : '#15803d',
                            border: '1px solid #16a34a',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.35rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                          title="Confirm the product order"
                        >
                          ✓ Confirm
                        </button>

                        <button
                          onClick={() => handleStatusChange(ord.id, 'Cancelled')}
                          style={{
                            background: ord.status === 'Cancelled' ? '#dc2626' : '#fee2e2',
                            color: ord.status === 'Cancelled' ? '#ffffff' : '#dc2626',
                            border: '1px solid #dc2626',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.35rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                          title="Cancel the product order"
                        >
                          ✕ Cancel
                        </button>

                        <button
                          onClick={() => handleReviewOrder(ord)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          <Eye size={14} /> Review
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '1.5rem',
          }}
        >
          <div className="admin-card" style={{ maxWidth: '560px', width: '100%', padding: '2rem', background: '#ffffff', border: '1px solid var(--sandel-300)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--sandel-900)' }}>
                Order Review: {selectedOrder.id}
              </h3>
              <Badge variant={selectedOrder.status === 'Completed' || selectedOrder.status === 'Delivered' ? 'success' : selectedOrder.status === 'Order Confirmed' ? 'primary' : 'warning'}>
                {selectedOrder.status}
              </Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.9rem', color: 'var(--sandel-900)', marginBottom: '1.5rem' }}>
              <div><strong style={{ color: 'var(--sandel-900)' }}>Customer Name:</strong> {selectedOrder.customer}</div>
              {selectedOrder.phone && <div><strong style={{ color: 'var(--sandel-900)' }}>Phone Number:</strong> {selectedOrder.phone}</div>}
              {selectedOrder.address && <div><strong style={{ color: 'var(--sandel-900)' }}>Delivery Address:</strong> {selectedOrder.address}</div>}
              {selectedOrder.productName && <div><strong style={{ color: 'var(--sandel-900)' }}>Product Ordered:</strong> {selectedOrder.productName}</div>}
              <div><strong style={{ color: 'var(--sandel-900)' }}>Order Date:</strong> {selectedOrder.date}</div>
              <div><strong style={{ color: 'var(--sandel-900)' }}>Total Amount:</strong> {formatCurrency(selectedOrder.total)}</div>
              <div><strong style={{ color: 'var(--sandel-900)' }}>Payment Number:</strong> 9629217907</div>
            </div>

            {/* Quick Action Buttons: Confirm or Cancel Product */}
            <div style={{ background: 'var(--sandel-100)', border: '1px solid var(--sandel-300)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: 'var(--sandel-900)', marginBottom: '0.75rem', display: 'block', fontWeight: 800 }}>
                Order Fulfillment Decision
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, 'Order Confirmed');
                    setSelectedOrder((prev) => ({ ...prev, status: 'Order Confirmed' }));
                  }}
                  style={{
                    flex: 1,
                    background: selectedOrder.status === 'Order Confirmed' ? '#15803d' : '#ffffff',
                    color: selectedOrder.status === 'Order Confirmed' ? '#ffffff' : '#15803d',
                    border: '1px solid #16a34a',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.625rem',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  ✓ Confirm the Product
                </button>

                <button
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, 'Cancelled');
                    setSelectedOrder((prev) => ({ ...prev, status: 'Cancelled' }));
                  }}
                  style={{
                    flex: 1,
                    background: selectedOrder.status === 'Cancelled' ? '#dc2626' : '#ffffff',
                    color: selectedOrder.status === 'Cancelled' ? '#ffffff' : '#dc2626',
                    border: '1px solid #dc2626',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.625rem',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  ✕ Cancel the Product
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--sandel-300)', paddingTop: '1rem' }}>
              <label className="form-label" style={{ color: 'var(--sandel-700)', marginBottom: '0.5rem', display: 'block', fontWeight: 700 }}>Update Status Stage</label>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {['Pending', 'Order Confirmed', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, st);
                      setSelectedOrder((prev) => ({ ...prev, status: st }));
                    }}
                    style={{
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--sandel-300)',
                      background: selectedOrder.status === st ? 'var(--primary)' : '#ffffff',
                      color: selectedOrder.status === st ? 'white' : 'var(--sandel-900)',
                      cursor: 'pointer',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageOrders;
