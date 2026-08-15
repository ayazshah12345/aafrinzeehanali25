import { useShop } from '../../context/ShopContext';

export function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useShop();

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 150.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="container section-padding">
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.5rem' }}>
        Shopping Cart ({cart.length} items)
      </h1>

      {cart.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <ShoppingBag size={48} style={{ color: 'var(--slate-300)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your Cart is Empty</h3>
          <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>Looks like you haven't added any products yet.</p>
          <Link to="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
          {/* Item List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.map((item, index) => (
              <Card key={item.product.id} style={{ padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{item.product.category}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>{item.product.name}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                    Unit Price: {formatCurrency(item.product.price)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--slate-300)', borderRadius: 'var(--radius-md)' }}>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, -1)}
                    style={{ padding: '0.375rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 0.5rem', fontWeight: 700, fontSize: '0.875rem' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, 1)}
                    style={{ padding: '0.375rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.1rem', width: '110px', textAlign: 'right' }}>
                  {formatCurrency((item.product?.price || 0) * item.quantity)}
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: '0.5rem' }}
                  title="Remove Item"
                >
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}
          </div>

          {/* Cart Order Summary Card */}
          <Card style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-600)' }}>Subtotal</span>
                <span style={{ fontWeight: 700 }}>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-600)' }}>Estimated Shipping</span>
                <span style={{ fontWeight: 700 }}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-600)' }}>Estimated Tax (8%)</span>
                <span style={{ fontWeight: 700 }}>{formatCurrency(tax)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--slate-200)', paddingTop: '1rem', marginTop: '0.5rem', fontSize: '1.15rem', fontWeight: 800 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            <Link to="/checkout">
              <Button variant="primary" fullWidth size="lg" icon={ArrowRight}>
                Proceed to Checkout
              </Button>
            </Link>

            <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
              <ShieldCheck size={14} /> Guaranteed Safe & Secure Checkout
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Cart;
