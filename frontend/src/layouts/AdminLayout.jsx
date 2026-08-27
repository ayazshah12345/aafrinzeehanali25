import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useShop } from '../context/ShopContext';

export function AdminLayout() {
  const { currentUser } = useShop();

  // Protect admin routes — redirect unauthenticated devices to /admin/login
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-body admin-layout-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
