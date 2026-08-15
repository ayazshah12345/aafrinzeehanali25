import React from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Package, Users, PlusCircle, ArrowUpRight } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import StatCard from '../../components/admin/StatCard';
import { useShop } from '../../context/ShopContext';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';

export function AdminDashboard() {
  const { products, orders, pendingOrdersCount } = useShop();

  const totalRevenue = orders.reduce((sum, ord) => sum + (parseFloat(ord.total) || 0), 0);
  const totalCustomersCount = new Set(orders.map((o) => o.phone || o.customer)).size;

  return (
    <div>
      <AdminHeader title="Executive Overview & Analytics" />

      <div style={{ padding: '2rem' }}>
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
              justify: 'space-between',
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
          <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={IndianRupee} />
          <StatCard title="Active Orders" value={orders.length} icon={ShoppingBag} />
          <StatCard title="Catalog Products" value={products.length} icon={Package} />
          <StatCard title="Total Customers" value={totalCustomersCount} icon={Users} />
        </div>

        {/* Quick Actions & Recent Orders Table */}
        <div className="admin-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          {/* Recent Orders Overview */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sandel-900)' }}>Recent Store Transactions</h3>
              <Link to="/admin/orders" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All Orders <ArrowUpRight size={14} />
              </Link>
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
                        No store transactions yet. Website is fresh and ready!
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
    </div>
  );
}

export default AdminDashboard;
