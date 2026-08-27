import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Package, Users, PlusCircle, ArrowUpRight, Trash2, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import StatCard from '../../components/admin/StatCard';
import { useShop } from '../../context/ShopContext';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';

export function AdminDashboard() {
  const { products, orders, pendingOrdersCount, clearSalesInfo } = useShop();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  // Calculate total revenue ONLY for orders accepted / confirmed by Admin
  const acceptedStatuses = ['Order Confirmed', 'Completed', 'Delivered', 'Processing', 'Shipped'];
  const acceptedOrders = orders.filter((ord) => acceptedStatuses.includes(ord.status));
  const totalRevenue = acceptedOrders.reduce((sum, ord) => sum + (parseFloat(ord.total) || 0), 0);
  const totalCustomersCount = new Set(orders.map((o) => o.phone || o.customer)).size;

  const handleClearSales = async () => {
    setIsClearing(true);
    await clearSalesInfo();
    setIsClearing(false);
    setShowClearConfirm(false);
    setClearSuccess(true);
    setTimeout(() => setClearSuccess(false), 4000);
  };

  return (
    <div>
      <AdminHeader title="Executive Overview & Analytics" />

      <div className="admin-page-content" style={{ padding: '1.5rem 2rem' }}>
        {/* Clear Success Banner */}
        {clearSuccess && (
          <div
            style={{
              background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
              color: 'white',
              padding: '0.875rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(21, 128, 61, 0.3)',
            }}
          >
            <Check size={20} />
            <span>All sales info and order records cleared successfully! Total sales amount has been reset to ₹0.00.</span>
          </div>
        )}

        {/* Pending Order Alert Callout */}
        {pendingOrdersCount > 0 && (
          <div
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              padding: '0.875rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 700 }}>
              <span style={{ background: 'white', color: '#ef4444', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {pendingOrdersCount}
              </span>
              <span>Pending Customer Order Alert: {pendingOrdersCount} order(s) pending fulfillment!</span>
            </div>
            <Link to="/admin/orders" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
              View Pending Orders
            </Link>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
          <StatCard title="Total Revenue (Accepted)" value={formatCurrency(totalRevenue)} icon={IndianRupee} change={`${acceptedOrders.length} accepted order(s)`} trend="up" />
          <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} />
          <StatCard title="Catalog Products" value={products.length} icon={Package} />
          <StatCard title="Total Customers" value={totalCustomersCount} icon={Users} />
        </div>

        {/* Quick Actions & Recent Orders Table */}
        <div className="admin-dashboard-grid" style={{ gap: '2rem' }}>
          {/* Recent Orders Overview */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sandel-900)' }}>Recent Store Transactions</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {orders.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="btn btn-sm"
                    style={{
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                    title="Clear every sales info and reset calculations"
                  >
                    <Trash2 size={14} /> Clear Sales Info
                  </button>
                )}
                <Link to="/admin/orders" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  View All Orders <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--sandel-700)', padding: '2rem' }}>
                        No store transactions yet. Sales amounts are reset & website is fresh!
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id}>
                        <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{ord.id}</td>
                        <td style={{ color: 'var(--sandel-900)', fontWeight: 700 }}>{ord.customer}</td>
                        <td style={{ color: 'var(--sandel-700)' }}>{ord.date}</td>
                        <td style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(ord.total)}</td>
                        <td>
                          <Badge variant={ord.status === 'Completed' || ord.status === 'Delivered' ? 'success' : ord.status === 'Processing' ? 'info' : 'warning'}>
                            {ord.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sandel-900)', marginBottom: '1rem' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/admin/products/new" className="btn btn-primary btn-block" style={{ justifyContent: 'flex-start' }}>
                  <PlusCircle size={18} /> Add New Catalog Product
                </Link>
                <Link to="/admin/products" className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }}>
                  <Package size={18} /> Manage Inventory
                </Link>
                <Link to="/admin/customers" className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }}>
                  <Users size={18} /> Customer Directory
                </Link>
                
                {/* Clear Sales Info Prominent Action */}
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="btn btn-block"
                  style={{
                    justify: 'flex-start',
                    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                    marginTop: '0.25rem',
                  }}
                >
                  <Trash2 size={18} /> Clear Every Sales Info
                </button>
              </div>
            </div>

            {/* Inventory Status Widget */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sandel-900)', marginBottom: '0.75rem' }}>Inventory Status</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--sandel-700)', marginBottom: '1rem' }}>Low stock item alerts</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {products.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--sandel-700)', fontStyle: 'italic' }}>
                    No products in inventory yet.
                  </div>
                ) : (
                  products.slice(0, 2).map((p) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--sandel-100)', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--sandel-300)' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--sandel-900)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--sandel-700)' }}>SKU: {p.sku || 'N/A'}</div>
                      </div>
                      <Badge variant={(p.stock || 0) < 15 ? 'warning' : 'success'}>
                        {p.stock || 0} left
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Clear Sales Info */}
      {showClearConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '480px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-xl)',
              border: '2px solid var(--primary)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <AlertTriangle size={32} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--sandel-900)', textAlign: 'center', marginBottom: '0.75rem' }}>
              Clear Every Sales Info?
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--sandel-700)', textAlign: 'center', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Are you sure you want to clear all sales information? Doing this will reset the calculated <strong>Total Revenue</strong> back to <strong>₹0.00</strong> and clear all order transactions from the first record.
            </p>

            <div style={{ background: 'var(--sandel-100)', border: '1px solid var(--sandel-300)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--sandel-800)', fontWeight: 700, marginBottom: '1.5rem' }}>
              ⚠️ Note: This action purges calculated revenue metrics and clears all active order lists in the system.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowClearConfirm(false)}
                disabled={isClearing}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, background: '#dc2626', borderColor: '#b91c1c' }}
                onClick={handleClearSales}
                disabled={isClearing}
              >
                {isClearing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} /> Yes, Clear Sales Info
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
