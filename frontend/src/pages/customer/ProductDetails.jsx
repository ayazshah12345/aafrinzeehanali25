import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Zap, Truck, ShieldCheck, ArrowLeft, CheckCircle, PackageOpen } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';
import GetProductModal from '../../components/customer/GetProductModal';
import { useShop } from '../../context/ShopContext';

export function ProductDetails() {
  const { id } = useParams();
  const { products, isLoadingProducts } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product = products.find((p) => String(p.id) === String(id));

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoadingProducts) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', color: 'var(--slate-500)' }}>
        Loading product details from PostgreSQL database...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <PackageOpen size={48} style={{ color: 'var(--slate-400)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-800)' }}>Product Not Found</h2>
        <p style={{ color: 'var(--slate-500)', margin: '0.5rem 0 1.5rem' }}>
          The requested product could not be found in the database.
        </p>
        <Link to="/products">
          <Button icon={ArrowLeft}>Back to Products Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Products Catalog
      </Link>

      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', padding: '2rem' }} className="grid grid-cols-2 gap-8">
        {/* Product Image Gallery Preview */}
        <div>
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '420px', background: 'var(--slate-100)', marginBottom: '1rem' }}>
            <img src={product.image || product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>SKU: {product.sku || `ID-${product.id}`}</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {formatCurrency(product.price)}
              </span>
            </div>

            <p style={{ color: 'var(--slate-600)', lineHeight: '1.7', marginBottom: '2rem' }}>
              {product.description || 'No detailed description available for this product.'}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--slate-300)', borderRadius: 'var(--radius-md)' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.625rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 1rem', fontWeight: 700 }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '0.625rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                <Button
                  variant={added ? 'secondary' : 'primary'}
                  size="lg"
                  icon={added ? CheckCircle : ShoppingCart}
                  onClick={handleAddToCart}
                  style={{ flex: 1 }}
                >
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </Button>
              </div>

              {/* Get the Product Direct Payment Button */}
              <Button
                variant="primary"
                size="lg"
                icon={Zap}
                onClick={() => setIsModalOpen(true)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderColor: '#10b981',
                  fontWeight: 800,
                }}
              >
                Get the Product (Buy Now via 9629217907)
              </Button>
            </div>
          </div>

          {/* Value props */}
          <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '1.25rem', display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Truck size={18} style={{ color: 'var(--primary)' }} /> Free Express Shipping
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--primary)' }} /> 2-Year Official Warranty
            </div>
          </div>
        </div>
      </div>

      {/* Get Product Payment Modal */}
      <GetProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default ProductDetails;
