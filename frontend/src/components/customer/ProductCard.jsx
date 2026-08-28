import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Zap, Eye } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import GetProductModal from './GetProductModal';

export function ProductCard({ product }) {
  const { id, name, price, originalPrice, rating = 4.8, reviewsCount = 12, category, image, image_url, featured } = product;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const displayImage = image || image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  return (
    <>
      <Card
        className="card hover-lift"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: '#ffffff', border: '1px solid var(--sandel-300)' }}
      >
        {/* Product Image & Badges */}
        <div style={{ position: 'relative', height: '230px', overflow: 'hidden', background: '#ffffff', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={displayImage}
            alt={name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          
          {featured && (
            <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
              <Badge variant="primary">Featured</Badge>
            </div>
          )}

          {originalPrice && (
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
              <Badge variant="danger">
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sandel-700)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              {category || 'Store Item'}
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0.25rem 0 0.5rem', color: 'var(--sandel-900)', lineHeight: '1.35' }}>
              <Link to={`/products/${id}`} style={{ color: 'inherit' }}>
                {name}
              </Link>
            </h3>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                <Star size={14} fill="#f59e0b" />
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--sandel-900)' }}>{rating}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--sandel-700)' }}>({reviewsCount})</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatCurrency(price)}
              </div>
              {originalPrice && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--sandel-700)', textDecoration: 'line-through' }}>
                  {formatCurrency(originalPrice)}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Get the Product */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.875rem', borderTop: '1px solid var(--sandel-300)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', fontWeight: 700 }}
                onClick={() => alert(`Added ${name} to shopping cart!`)}
              >
                <ShoppingCart size={15} /> Add to Cart
              </button>
              <Link to={`/products/${id}`} className="btn btn-outline btn-sm" title="View Details" style={{ padding: '0.375rem 0.625rem' }}>
                <Eye size={16} />
              </Link>
            </div>

            <button
              className="btn btn-primary btn-sm"
              style={{
                width: '100%',
                fontWeight: 800,
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
              }}
              onClick={() => setIsModalOpen(true)}
            >
              <Zap size={15} /> Get the Product
            </button>
          </div>
        </div>
      </Card>

      {/* Get Product Payment Modal */}
      <GetProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default ProductCard;
