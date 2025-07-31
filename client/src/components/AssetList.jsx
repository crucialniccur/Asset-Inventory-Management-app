import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAssets, deleteAsset } from '../redux/slices/assetsSlice';

const AssetList = () => {
  const { user } = useSelector((state) => state.auth);
  const { assets, loading, error } = useSelector((state) => state.assets);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="badge bg-success">Available</span>;
      case 'allocated':
        return <span className="badge bg-primary">Allocated</span>;
      case 'maintenance':
        return <span className="badge bg-warning">Maintenance</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      dispatch(deleteAsset(id));
    }
  };

  const canEditAssets = user?.role === 'Admin' || user?.role === 'Procurement';

  if (loading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Assets</h2>
          <p className="text-muted mb-0">Manage your asset inventory</p>
        </div>
        {canEditAssets && (
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/assets/add')}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Asset
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="allocated">Allocated</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="row">
        {filteredAssets.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-box display-1 text-muted"></i>
              <h4 className="mt-3">No assets found</h4>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div key={asset.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                {asset.image_url && (
                  <img 
                    src={asset.image_url} 
                    className="card-img-top" 
                    alt={asset.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{asset.name}</h5>
                    {getStatusBadge(asset.status)}
                  </div>
                  <p className="card-text text-muted small mb-2">
                    {asset.description || 'No description available'}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                      Quantity: {asset.quantity}
                    </span>
                    <small className="text-muted">
                      {new Date(asset.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/assets/${asset.id}`)}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View
                    </button>
                    {canEditAssets && (
                      <>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => navigate(`/assets/${asset.id}/edit`)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(asset.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssetList;
