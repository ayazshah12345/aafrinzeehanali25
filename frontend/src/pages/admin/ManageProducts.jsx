import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, PackageOpen } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useShop } from '../../context/ShopContext';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';

export function ManageProducts() {
  const { products, deleteProduct, isLoadingProducts } = useShop();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from PostgreSQL database?`)) {
      await deleteProduct(id);
    }
  };

  return (
    <div>
      <AdminHeader title="Manage Products Inventory" />

      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '480px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search products by SKU or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

          <Link to="/admin/products/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add New Product
          </Link>
        </div>

        {/* Products Table */}
        <div className="admin-card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            {isLoadingProducts ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--sandel-700)' }}>
                Loading products from PostgreSQL database...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--sandel-700)' }}>
                <PackageOpen size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--sandel-900)', fontWeight: 800 }}>No Products in Database</h3>
                <p style={{ margin: '0.5rem 0 1.5rem', fontSize: '0.9rem', color: 'var(--sandel-700)' }}>
                  No products are currently in PostgreSQL. Click below to add your first store item!
                </p>
                <Link to="/admin/products/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={16} /> Add Product Now
                </Link>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <img
                            src={prod.image || prod.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                            alt={prod.name}
                            style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-md)', background: 'var(--sandel-100)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--sandel-900)' }}>{prod.name}</div>
                            {prod.description && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--sandel-700)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {prod.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--sandel-900)', fontWeight: 600 }}>{prod.category || 'General'}</td>
                      <td style={{ color: 'var(--sandel-700)', fontFamily: 'monospace' }}>{prod.sku || `ID-${prod.id}`}</td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(prod.price)}</td>
                      <td>
                        <Badge variant={prod.stock > 10 ? 'success' : prod.stock > 0 ? 'warning' : 'danger'}>
                          {prod.stock} units
                        </Badge>
                      </td>
                      <td>
                        <Badge variant="primary">Active in DB</Badge>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <Link to={`/admin/products/${prod.id}/edit`} className="btn btn-secondary btn-sm">
                            <Edit size={14} /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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

export default ManageProducts;
