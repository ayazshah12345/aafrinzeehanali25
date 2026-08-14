import React, { useState } from 'react';
import { Search, Mail, Calendar, Phone } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useShop } from '../../context/ShopContext';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';

export function ManageCustomers() {
  const { orders } = useShop();
  const [search, setSearch] = useState('');

  // Aggregate customer accounts dynamically from PostgreSQL orders
  const customerMap = {};
  orders.forEach((ord) => {
    const key = ord.phone || ord.customer;
    if (!customerMap[key]) {
      customerMap[key] = {
        id: key,
        name: ord.customer,
        phone: ord.phone,
        email: ord.email,
        joinedDate: ord.date,
        ordersCount: 1,
        totalSpent: parseFloat(ord.total || 0),
      };
    } else {
      customerMap[key].ordersCount += 1;
      customerMap[key].totalSpent += parseFloat(ord.total || 0);
    }
  });

  const customerList = Object.values(customerMap).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search)) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <AdminHeader title="Registered Customer Directory" />

      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '380px' }}>
            <input
              type="text"
              placeholder="Search by customer name, phone, or email..."
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
        </div>

        <div className="admin-card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            {customerList.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--sandel-700)' }}>
                No customer records found in database.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer User</th>
                    <th>Contact Info</th>
                    <th>Date Added</th>
                    <th>Total Orders</th>
                    <th>Total Lifetime Value</th>
                    <th>Account Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customerList.map((cust) => (
                    <tr key={cust.id}>
                      <td style={{ fontWeight: 800, color: 'var(--sandel-900)' }}>{cust.name}</td>
                      <td style={{ color: 'var(--sandel-700)' }}>
                        {cust.phone ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--primary)', fontWeight: 700 }}>
                            <Phone size={14} /> {cust.phone}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--sandel-900)', fontWeight: 600 }}>
                            <Mail size={14} /> {cust.email}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--sandel-700)' }}>
                          <Calendar size={14} /> {cust.joinedDate}
                        </div>
                      </td>
                      <td style={{ color: 'var(--sandel-900)', fontWeight: 600 }}>{cust.ordersCount} orders</td>
                      <td style={{ fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(cust.totalSpent)}</td>
                      <td>
                        <Badge variant="success">Active Buyer</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageCustomers;
