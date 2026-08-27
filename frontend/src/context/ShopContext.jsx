import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('afsoo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.product.id) === String(product.id));
      let updated;
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].quantity += quantity;
      } else {
        updated = [...prev, { product, quantity }];
      }
      try {
        localStorage.setItem('afsoo_cart', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (currentUser && product.id && !isNaN(parseInt(product.id, 10))) {
      api.addToCart(product.id, quantity);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const updated = prev.filter((item) => String(item.product.id) !== String(productId));
      try {
        localStorage.setItem('afsoo_cart', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (String(item.product.id) === String(productId)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
      try {
        localStorage.setItem('afsoo_cart', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('afsoo_cart');
    } catch (e) {}
    if (currentUser) {
      api.clearCart();
    }
  };
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const [sessionOrderIds, setSessionOrderIds] = useState(() => {
    try {
      const saved = sessionStorage.getItem('afsoo_session_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Format DB order row to match UI properties
  const formatOrder = (row) => ({
    id: row.order_ref || row.id || `AFS-${Math.floor(1000 + Math.random() * 9000)}`,
    db_id: row.id,
    user_id: row.user_id,
    customer: row.shipping_name || row.customer || 'Customer',
    email: row.email || `${(row.shipping_name || 'customer').toLowerCase().replace(/\s+/g, '.')}@customer.com`,
    phone: row.shipping_phone || row.phone || '9629217907',
    address: row.shipping_address || row.address || '',
    productName: row.product_name || row.productName || 'Afsoo Store Product',
    productImage: row.product_image || row.productImage || '',
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : (row.date || new Date().toISOString().split('T')[0]),
    total: parseFloat(row.total_amount || row.total || 0),
    status: row.status || 'Pending',
    paymentStatus: row.payment_status || row.paymentStatus || 'Paid via 9629217907',
    paymentNumber: '9629217907',
    isNew: row.isNew || false,
  });

  // Helper to load locally saved orders
  const getLocalOrders = () => {
    try {
      const saved = localStorage.getItem('afsoo_local_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  // Helper to save orders to localStorage
  const saveLocalOrders = (items) => {
    try {
      localStorage.setItem('afsoo_local_orders', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save orders to localStorage:', e);
    }
  };

  // Helper to load locally saved products
  const getLocalProducts = () => {
    try {
      const saved = localStorage.getItem('afsoo_local_products');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  // Helper to save products to localStorage
  const saveLocalProducts = (items) => {
    try {
      localStorage.setItem('afsoo_local_products', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save products to localStorage:', e);
    }
  };

  // Fetch products — merges PostgreSQL DB products & user-added local products
  const fetchProducts = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoadingProducts(true);
    try {
      const dbProducts = await api.getProducts();
      const localItems = getLocalProducts();

      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        const dbIds = new Set(dbProducts.map((p) => String(p.id)));
        const uniqueLocal = localItems.filter((p) => !dbIds.has(String(p.id)));
        const combined = [...dbProducts, ...uniqueLocal];
        setProducts((prev) => {
          const prevStr = JSON.stringify(prev);
          const nextStr = JSON.stringify(combined);
          if (prevStr !== nextStr) {
            saveLocalProducts(combined);
            return combined;
          }
          return prev;
        });
      } else if (localItems.length > 0) {
        setProducts((prev) => {
          const prevStr = JSON.stringify(prev);
          const nextStr = JSON.stringify(localItems);
          return prevStr !== nextStr ? localItems : prev;
        });
      }
    } catch (err) {
      console.warn('fetchProducts error:', err);
    } finally {
      if (!isSilent) setIsLoadingProducts(false);
    }
  }, []);

  // Fetch orders — displays user placed orders, merging DB & local orders
  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoadingOrders(true);
    try {
      const dbOrders = await api.getOrders();
      const localOrders = getLocalOrders();

      if (Array.isArray(dbOrders) && dbOrders.length > 0) {
        const formattedDb = dbOrders.map(formatOrder);
        const dbOrderRefs = new Set(formattedDb.map((o) => String(o.id)));
        
        // Deduplicate orders to prevent duplicate listings
        const seenKeys = new Set(formattedDb.map((o) => `${o.customer}_${o.total}_${o.phone}`));
        const uniqueLocal = localOrders.filter((o) => {
          if (dbOrderRefs.has(String(o.id))) return false;
          const key = `${o.customer}_${o.total}_${o.phone}`;
          if (seenKeys.has(key)) return false;
          return o.isLocalFallback;
        });

        const combined = [...formattedDb, ...uniqueLocal];
        
        setOrders((prev) => {
          const nextJson = JSON.stringify(combined);
          const prevJson = JSON.stringify(prev);
          if (nextJson !== prevJson) {
            saveLocalOrders(combined);
            return combined;
          }
          return prev;
        });
      } else if (localOrders.length > 0) {
        setOrders((prev) => {
          const nextJson = JSON.stringify(localOrders);
          const prevJson = JSON.stringify(prev);
          return nextJson !== prevJson ? localOrders : prev;
        });
      }
    } catch (err) {
      console.warn('fetchOrders error:', err);
    } finally {
      if (!isSilent) setIsLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(false);
    fetchOrders(false);

    // Fast live tracking polling from PostgreSQL silently every 3 seconds across all devices
    const interval = setInterval(() => {
      fetchOrders(true);
      fetchProducts(true);
    }, 3000);

    const handleSync = (e) => {
      if (!e || !e.key || e.key === 'afsoo_order_status_sync') {
        fetchOrders(true);
        fetchProducts(true);
      }
    };

    window.addEventListener('order_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener('order_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [fetchProducts, fetchOrders]);

  // Count of pending orders requiring fulfillment
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.isNew).length;

  // Admin function: Add product directly into persistent DB & fallback localStorage
  const addProduct = async (productData) => {
    const apiRes = await api.createProduct(productData);

    let createdProduct = null;
    let isPostgres = false;

    if (apiRes && apiRes.success && apiRes.product) {
      createdProduct = apiRes.product;
      isPostgres = true;
    } else {
      // Create local product fallback when PostgreSQL server is offline or fails
      createdProduct = {
        id: `prod_${Date.now()}`,
        name: productData.name,
        category: productData.category || 'General',
        sku: productData.sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
        price: parseFloat(productData.price || 0),
        stock: parseInt(productData.stock || 0, 10),
        description: productData.description || '',
        image: productData.image || productData.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        image_url: productData.image_url || productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        created_at: new Date().toISOString(),
        isLocal: true,
      };
    }

    setProducts((prev) => {
      const updated = [createdProduct, ...prev.filter((p) => String(p.id) !== String(createdProduct.id))];
      saveLocalProducts(updated);
      return updated;
    });

    await fetchProducts(true);

    return { product: createdProduct, isPostgres };
  };

  // Admin function: Edit product in persistent DB & fallback localStorage
  const editProduct = async (id, productData) => {
    const apiRes = await api.updateProduct(id, productData);

    let updatedProduct = null;
    let isPostgres = false;

    if (apiRes && apiRes.success && apiRes.product) {
      updatedProduct = apiRes.product;
      isPostgres = true;
    } else {
      // Fallback local edit
      updatedProduct = {
        id: String(id),
        name: productData.name,
        category: productData.category || 'General',
        sku: productData.sku,
        price: parseFloat(productData.price || 0),
        stock: parseInt(productData.stock || 0, 10),
        description: productData.description || '',
        image: productData.image || productData.image_url || '',
        image_url: productData.image_url || productData.image || '',
        updated_at: new Date().toISOString(),
        isLocal: true,
      };
    }

    setProducts((prev) => {
      const list = prev.map((p) => (String(p.id) === String(id) ? { ...p, ...updatedProduct } : p));
      saveLocalProducts(list);
      return list;
    });

    await fetchProducts(true);

    return { product: updatedProduct, isPostgres };
  };

  // Admin function: Delete product from persistent DB & fallback localStorage
  const deleteProduct = async (id) => {
    const isPostgres = await api.deleteProduct(id);

    setProducts((prev) => {
      const list = prev.filter((p) => String(p.id) !== String(id));
      saveLocalProducts(list);
      return list;
    });

    await fetchProducts(true);

    return { success: true, isPostgres };
  };

  // Customer function: Place direct order via "Get the Product" or Checkout flow
  const placeOrder = async ({ customerName, email, address, phone, product, quantity = 1, totalAmount, items }) => {
    const userEmail = email || (currentUser ? currentUser.email : '');
    const userId = currentUser ? currentUser.id : null;

    const orderId = `AFS-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderTotal = totalAmount || ((product ? product.price || 0 : 0) * quantity);

    const newOrder = {
      id: orderId,
      customer: customerName,
      email: userEmail,
      user_id: userId,
      phone: phone,
      address: address,
      date: new Date().toISOString().split('T')[0],
      total: orderTotal,
      status: 'Pending',
      paymentStatus: 'Paid via 9629217907',
      paymentNumber: '9629217907',
      itemsCount: quantity,
      productName: product ? product.name : (items && items[0] ? items[0].product.name : 'Store Item'),
      productImage: product ? (product.image || product.image_url) : (items && items[0] ? items[0].product.image : ''),
      isNew: true,
      isLocalFallback: true,
    };

    setOrders((prevOrders) => {
      const updated = [newOrder, ...prevOrders.filter((o) => String(o.id) !== String(newOrder.id))];
      saveLocalOrders(updated);
      return updated;
    });
    setSessionOrderIds((prev) => {
      const updated = [...prev, orderId];
      try {
        sessionStorage.setItem('afsoo_session_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setNewOrdersCount((prev) => prev + 1);

    // Call REST API and save into PostgreSQL database
    const safeProductId = product && product.id && !isNaN(parseInt(product.id, 10)) ? parseInt(product.id, 10) : null;
    const formattedItems = Array.isArray(items) && items.length > 0
      ? items.map((it) => ({
          product_id: it.product && it.product.id && !isNaN(parseInt(it.product.id, 10)) ? parseInt(it.product.id, 10) : null,
          quantity: it.quantity || 1,
          price: it.product ? it.product.price || 0 : 0,
        })).filter((it) => it.product_id !== null)
      : [];

    const res = await api.createOrder({
      order_ref: orderId,
      shipping_name: customerName,
      email: userEmail,
      user_id: userId && !isNaN(parseInt(userId, 10)) ? parseInt(userId, 10) : null,
      shipping_phone: phone,
      shipping_address: address,
      product_id: safeProductId,
      quantity,
      total_amount: orderTotal,
      items: formattedItems,
    });

    if (res) {
      await fetchOrders(true);
    }

    return newOrder;
  };

  // Admin function to update fulfillment status & reflect instantly for customers
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prevOrders) => {
      const updated = prevOrders.map((ord) =>
        ord.id === orderId || ord.db_id === orderId || String(ord.db_id) === String(orderId) || String(ord.id) === String(orderId)
          ? { ...ord, status: newStatus, isNew: false }
          : ord
      );
      saveLocalOrders(updated);
      return updated;
    });

    await api.updateOrderStatus(orderId, newStatus);
    await fetchOrders();

    // Trigger instant live update event across app & open tabs
    window.dispatchEvent(new CustomEvent('order_updated', { detail: { orderId, status: newStatus } }));
    try {
      localStorage.setItem('afsoo_order_status_sync', `${orderId}:${newStatus}:${Date.now()}`);
    } catch (e) {}
  };

  // Admin function to mark an order as seen
  const markOrderAsSeen = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) =>
        ord.id === orderId ? { ...ord, isNew: false } : ord
      )
    );
  };

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('afsoo_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const registerUser = async ({ name, email, password }) => {
    try {
      const cleanEmail = email ? email.trim().toLowerCase() : '';
      const res = await api.register({ name, email: cleanEmail, password });
      
      if (res && res.status === 'success' && res.data && res.data.user) {
        setCurrentUser(res.data.user);
        localStorage.setItem('afsoo_user', JSON.stringify(res.data.user));
        return { success: true, message: 'Account created successfully!' };
      }
      return { success: false, message: res?.message || res?.error || 'Registration failed' };
    } catch (err) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const loginUser = async ({ email, password }) => {
    // Purge any existing session before attempting verification
    logoutUser();

    try {
      const cleanEmail = email ? email.trim().toLowerCase() : '';
      const res = await api.login({ email: cleanEmail, password });
      
      if (res && res.status === 'success' && res.data && res.data.user) {
        setCurrentUser(res.data.user);
        localStorage.setItem('afsoo_user', JSON.stringify(res.data.user));
        return { success: true, message: 'Logged in successfully!' };
      }

      logoutUser();
      return { success: false, message: res?.message || res?.error || 'Invalid email or password' };
    } catch (err) {
      logoutUser();
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('afsoo_auth_token');
    localStorage.removeItem('afsoo_user');
    try {
      sessionStorage.removeItem('afsoo_session_orders');
    } catch (e) {}
    setSessionOrderIds([]);
    setCurrentUser(null);
  };

  const clearNotifications = () => {
    setNewOrdersCount(0);
    setOrders((prevOrders) => prevOrders.map((ord) => ({ ...ord, isNew: false })));
  };

  // Admin function: Reset all sales info and clear order history
  const clearSalesInfo = async () => {
    try {
      await api.clearAllSales();
    } catch (e) {
      console.warn('Backend clear sales API call failed:', e);
    }
    setOrders([]);
    setNewOrdersCount(0);
    setSessionOrderIds([]);
    try {
      localStorage.removeItem('afsoo_local_orders');
      sessionStorage.removeItem('afsoo_session_orders');
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('order_updated', { detail: { cleared: true } }));
    try {
      localStorage.setItem('afsoo_order_status_sync', `cleared:${Date.now()}`);
    } catch (e) {}
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        isLoadingProducts,
        orders,
        sessionOrderIds,
        isLoadingOrders,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        newOrdersCount,
        pendingOrdersCount,
        currentUser,
        registerUser,
        loginUser,
        logoutUser,
        fetchProducts,
        fetchOrders,
        addProduct,
        editProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
        markOrderAsSeen,
        clearNotifications,
        clearSalesInfo,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
