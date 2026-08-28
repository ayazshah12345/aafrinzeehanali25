import React, { useState, useEffect } from 'react';
import { Search, Mail, Calendar, Phone, ShieldCheck } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useShop } from '../../context/ShopContext';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { api } from '../../services/api';

export function ManageCustomers() {
  const { orders } = useShop();
  const [search, setSearch] = useState('');
  const [dbUsers, setDbUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      const users = await api.getUsers();
      if (isMounted) {
        setDbUsers(users);
        setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  // Merge registered users from PostgreSQL database with order statistics
  const customerMap = {};

  // First populate registered accounts from DB
  dbUsers.forEach((usr) => {
    const key = (usr.email || usr.name || String(usr.id)).toLowerCase();
    customerMap[key] = {
      id: usr.id,
      name: usr.name,
      email: usr.email,
      role: usr.role,
      phone: '',
      joinedDate: usr.created_at ? new Date(usr.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      ordersCount: 0,
      totalSpent: 0,
      isRegistered: true,
    };
  });

  // Next aggregate order statistics
  orders.forEach((ord) => {
    const key = (ord.email || ord.customer || String(ord.phone)).toLowerCase();
    if (!customerMap[key]) {
      customerMap[key] = {
        id: key,
        name: ord.customer,
        email: ord.email,
        role: 'customer',
        phone: ord.phone || '',
        joinedDate: ord.date || new Date().toISOString().split('T')[0],
        ordersCount: 1,
        totalSpent: parseFloat(ord.total || 0),
        isRegistered: false,
      };
    } else {
      if (ord.phone && !customerMap[key].phone) {
        customerMap[key].phone = ord.phone;
      }
      customerMap[key].ordersCount += 1;
      customerMap[key].totalSpent += parseFloat(ord.total || 0);
    }
  });

  const customerList = Object.values(customerMap).filter((c) =>
    (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
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
                No customer records found.
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
                        {cust.role === 'admin' ? (
                          <Badge variant="primary"><ShieldCheck size={12} style={{ marginRight: '4px' }} /> Admin</Badge>
                        ) : cust.ordersCount > 0 ? (
                          <Badge variant="success">Active Buyer</Badge>
                        ) : (
                          <Badge variant="info">Registered User</Badge>
                        )}
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
