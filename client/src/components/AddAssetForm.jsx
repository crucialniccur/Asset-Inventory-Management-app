import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAsset, fetchCategories } from '../redux/slices/assetsSlice';

const AddAssetForm = () => {
  const { user } = useSelector((state) => state.auth);
  const { categories, loading, error } = useSelector((state) => state.assets);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 1,
    category_id: '',
    image_url: ''
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category_id) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await dispatch(createAsset(formData)).unwrap();
      alert('Asset created successfully!');
      navigate('/assets');
    } catch (err) {
      alert(err || 'Failed to create asset');
    }
  };

  const canAddAssets = user?.role === 'Admin' || user?.role === 'Procurement';

  if (!canAddAssets) {
    return (
      <div className="p-4">
        <div className="alert alert-warning" role="alert">
          You don't have permission to add assets.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Add New Asset</h2>
          <p className="text-muted mb-0">Add a new asset to the inventory</p>
        </div>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/assets')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Assets
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">
                  Asset Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Dell Laptop XPS 13"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="category_id" className="form-label">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="image_url" className="form-label">
                  Image URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the asset..."
              ></textarea>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Asset
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/assets')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Section */}
      {formData.image_url && (
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="mb-0">Image Preview</h5>
          </div>
          <div className="card-body">
            <img 
              src={formData.image_url} 
              alt="Preview" 
              className="img-fluid rounded"
              style={{ maxHeight: '200px' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="text-muted mt-2" style={{ display: 'none' }}>
              <i className="bi bi-exclamation-triangle me-2"></i>
              Unable to load image preview
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAssetForm;