import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Search, PackageOpen } from 'lucide-react';
import ProductCard from '../../components/customer/ProductCard';
import { useShop } from '../../context/ShopContext';

export function Products() {
  const { products, isLoadingProducts } = useShop();
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container section-padding">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--sandel-900)' }}>Products Catalog</h1>
      </div>

      <div className="products-page-layout">
        {/* Sidebar Filters */}
        <aside style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            <Filter size={18} /> Filters
          </div>

          {/* Search Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Keywords</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.2rem' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#ffffff', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.9375rem', color: 'var(--slate-600)' }}>
              Showing <strong>{filteredProducts.length}</strong> products
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={16} />
              <select className="form-select" style={{ width: 'auto', padding: '0.375rem 0.75rem' }}>
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          {isLoadingProducts ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
              Loading products from PostgreSQL database...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)' }}>
              <PackageOpen size={48} style={{ color: 'var(--slate-400)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-800)' }}>No Products Found</h3>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                There are no products matching your search criteria in the database.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
