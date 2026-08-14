import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import Button from '../../components/common/Button';
import { useShop } from '../../context/ShopContext';

export function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useShop();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    sku: '',
    price: '',
    stock: '',
    description: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setImagePreview(dataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url.trim()) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const productData = {
      name: formData.name,
      category: formData.category,
      sku: formData.sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      price: parseFloat(formData.price || 0),
      stock: parseInt(formData.stock || 0, 10),
      description: formData.description,
      image: imagePreview || imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      image_url: imagePreview || imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    };

    const created = await addProduct(productData);
    setIsSubmitting(false);
    if (created) {
      navigate('/admin/products');
    } else {
      alert('Failed to save product to PostgreSQL database. Please check console for details.');
    }
  };

  return (
    <div>
      <AdminHeader title="Create New Product" />

      <div style={{ padding: '2rem', maxWidth: '800px' }}>
        <Link to="/admin/products" style={{ color: 'var(--sandel-700)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.5rem', fontWeight: 700 }}>
          <ArrowLeft size={16} /> Back to Products Management
        </Link>

        <div className="admin-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--sandel-900)' }}>Product Title / Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Aura Pro Soundbar"
                required
                style={{ background: '#ffffff', border: '1px solid var(--sandel-300)', color: 'var(--sandel-900)', fontWeight: 600 }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--sandel-900)' }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                  style={{ background: '#ffffff', border: '1px solid var(--sandel-300)', color: 'var(--sandel-900)', fontWeight: 600 }}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Sports & Fitness">Sports & Fitness</option>
                  <option value="Books & Stationery">Books & Stationery</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--sandel-900)' }}>Stock Keeping Unit (SKU)</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. ELEC-992-BLK"
                  style={{ background: '#ffffff', border: '1px solid var(--sandel-300)', color: 'var(--sandel-900)', fontWeight: 600 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--sandel-900)' }}>Price (₹ INR)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="1499.00"
                  required
                  style={{ background: '#ffffff', border: '1px solid var(--sandel-300)', color: 'var(--sandel-900)', fontWeight: 600 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--sandel-900)' }}>Stock Inventory Units</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="50"
                  required
                  style={{ background: '#ffffff', border: '1px solid var(--sandel-300)', color: 'var(--sandel-900)', fontWeight: 600 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--sandel-900)' }}>Product Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                rows={4}
                placeholder="Enter detailed product features, specifications, and highlights..."
                style={{ background: '#ffffff', border: '1px solid var(--sandel-300)', color: 'var(--sandel-900)', fontWeight: 600 }}
              />
            </div>

            {/* Product Image Upload Section */}
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label" style={{ color: 'var(--sandel-900)', marginBottom: '0.5rem', display: 'block' }}>Product Image</label>
              
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {imagePreview ? (
                <div style={{ position: 'relative', width: '220px', height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--sandel-300)', background: 'var(--sandel-100)' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center'
                    }}
                    title="Remove Image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* File Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--sandel-300)',
                      borderRadius: 'var(--radius-md)',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'var(--sandel-100)',
                      transition: 'var(--transition)'
                    }}
                  >
                    <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, color: 'var(--sandel-900)', fontSize: '0.95rem' }}>
                      Click to upload an image file from your device
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--sandel-700)', marginTop: '0.25rem' }}>
                      Supports PNG, JPG, JPEG, WEBP files
                    </div>
                  </div>

                  {/* Or Image URL Input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--sandel-700)', fontWeight: 700 }}>OR enter image URL:</span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={handleUrlChange}
                      style={{ background: '#ffffff', border: '1px solid var(--sandel-300)', color: 'var(--sandel-900)', flex: 1, fontWeight: 600 }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Button type="submit" variant="primary" icon={Save} disabled={isSubmitting}>
                {isSubmitting ? 'Saving to PostgreSQL...' : 'Save Product to DB'}
              </Button>
              <Link to="/admin/products" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
