const getApiBaseUrls = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return ['/api', 'http://localhost:5000/api'];
    }
  }
  return ['/api'];
};

const getHeaders = () => {
  const token = localStorage.getItem('afsoo_auth_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const fetchApi = async (endpoint, options = {}) => {
  let lastErr = null;
  const baseUrls = getApiBaseUrls();
  for (const baseUrl of baseUrls) {
    try {
      const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      const res = await fetch(url, {
        ...options,
        headers: {
          ...getHeaders(),
          ...(options.headers || {}),
        },
      });
      if (res.ok || res.status === 400 || res.status === 404 || res.status === 401) {
        return res;
      }
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error('Failed to connect to backend server');
};

export const api = {
  // Health & Database Connection Check
  checkHealth: async () => {
    try {
      const res = await fetchApi('/health');
      return await res.json();
    } catch (err) {
      return { status: 'error', message: err.message };
    }
  },

  // Authentication Endpoints
  register: async (userData) => {
    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return await res.json();
    } catch (err) {
      return { status: 'error', message: 'Failed to connect to server.' };
    }
  },

  login: async (credentials) => {
    try {
      const cleanEmail = credentials.email ? credentials.email.trim() : '';
      const cleanPassword = credentials.password ? credentials.password.trim() : '';

      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });
      const data = await res.json();
      if (res.ok && data && data.status === 'success' && data.data && data.data.token) {
        localStorage.setItem('afsoo_auth_token', data.data.token);
        return data;
      }

      return { status: 'error', message: data.message || data.error || 'Invalid email or password' };
    } catch (err) {
      return { status: 'error', message: 'Failed to connect to authentication server. Please check your credentials.' };
    }
  },

  getMe: async () => {
    try {
      const res = await fetchApi('/auth/me');
      return await res.json();
    } catch (err) {
      return { status: 'error', message: err.message };
    }
  },

  // User Management Endpoints
  getUsers: async () => {
    try {
      const res = await fetchApi('/admin/users');
      if (!res.ok) return [];
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.users)) {
        return data.data.users;
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch users from PostgreSQL:', err.message);
      return [];
    }
  },

  getUserById: async (id) => {
    try {
      const res = await fetchApi(`/users/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data?.data?.user || null;
    } catch (err) {
      return null;
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await fetchApi(`/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      return data.status === 'success';
    } catch (err) {
      return false;
    }
  },

  // ----------------------------------------------------
  // Cart Endpoints — DIRECT POSTGRESQL DATABASE
  // ----------------------------------------------------
  getCart: async () => {
    try {
      const res = await fetchApi('/cart');
      if (!res.ok) return [];
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.cart)) {
        return data.data.cart;
      }
      return [];
    } catch (err) {
      return [];
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await fetchApi('/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id: parseInt(productId, 10), quantity }),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      const res = await fetchApi(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  removeCartItem: async (itemId) => {
    try {
      const res = await fetchApi(`/cart/${itemId}`, { method: 'DELETE' });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  clearCart: async () => {
    try {
      const res = await fetchApi('/cart', { method: 'DELETE' });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // ----------------------------------------------------
  // Product CRUD — DIRECT POSTGRESQL DATABASE
  // ----------------------------------------------------
  getProducts: async () => {
    try {
      const res = await fetchApi('/products');
      if (!res.ok) return [];
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.products)) {
        return data.data.products;
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch products from PostgreSQL database:', err.message);
      return [];
    }
  },

  getProductById: async (id) => {
    try {
      const res = await fetchApi(`/products/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.data && data.data.product) {
        return data.data.product;
      }
      return null;
    } catch (err) {
      return null;
    }
  },

  createProduct: async (productData) => {
    try {
      const res = await fetchApi('/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          name: productData.name,
          description: productData.description || '',
          price: parseFloat(productData.price || 0),
          category: productData.category || 'General',
          stock: parseInt(productData.stock || 0, 10),
          sku: productData.sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
          image_url: productData.image_url || productData.image || '',
        }),
      });

      const data = await res.json();
      if (res.ok && data && data.data && data.data.product) {
        return { success: true, product: data.data.product, isPostgres: true };
      }
      console.warn('Backend createProduct error response:', data);
      return { success: false, error: data.message || data.error };
    } catch (err) {
      console.warn('PostgreSQL API createProduct Connection Error:', err.message);
      return { success: false, error: err.message };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const res = await fetchApi(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (res.ok && data && data.data && data.data.product) {
        return { success: true, product: data.data.product, isPostgres: true };
      }
      return { success: false, error: data.message || data.error };
    } catch (err) {
      console.warn('PostgreSQL API updateProduct Connection Error:', err.message);
      return { success: false, error: err.message };
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await fetchApi(`/admin/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      return data.status === 'success';
    } catch (err) {
      console.warn('PostgreSQL API deleteProduct Connection Error:', err.message);
      return false;
    }
  },

  // ----------------------------------------------------
  // Order CRUD — DIRECT POSTGRESQL DATABASE
  // ----------------------------------------------------
  getOrders: async () => {
    try {
      const res = await fetchApi('/orders');
      if (!res.ok) return [];
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.orders)) {
        return data.data.orders;
      }
      return [];
    } catch (err) {
      return [];
    }
  },

  createOrder: async (orderData) => {
    try {
      const res = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return await res.json();
    } catch (err) {
      console.warn('Failed to place order in PostgreSQL database:', err.message);
      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const res = await fetchApi(`/orders/admin/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  clearAllSales: async () => {
    try {
      const res = await fetchApi('/orders/admin/clear-sales', {
        method: 'DELETE',
      });
      return await res.json();
    } catch (err) {
      console.warn('Failed to clear sales in PostgreSQL database:', err.message);
      return null;
    }
  },
};

export default api;
