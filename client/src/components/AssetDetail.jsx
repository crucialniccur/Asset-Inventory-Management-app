import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAsset } from '../redux/slices/assetsSlice';

const AssetDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { currentAsset, loading, error } = useSelector((state) => state.assets);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchAsset(id));
    }
  }, [dispatch, id]);

  const canEditAsset = user?.role === 'Admin' || user?.role === 'Procurement';

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

  if (!currentAsset) {
    return (
      <div className="p-4">
        <div className="alert alert-warning" role="alert">
          Asset not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">{currentAsset.name}</h2>
          <p className="text-muted mb-0">Asset Details</p>
        </div>
        <div>
          {canEditAsset && (
            <button 
              className="btn btn-primary me-2"
              onClick={() => navigate(`/assets/${id}/edit`)}
            >
              <i className="bi bi-pencil me-2"></i>
              Edit Asset
            </button>
          )}
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/assets')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Assets
          </button>
        </div>
      </div>

      <div className="row">
        {/* Asset Image */}
        <div className="col-md-4 mb-4">
          <div className="card">
            {currentAsset.image_url ? (
              <img 
                src={currentAsset.image_url} 
                className="card-img-top" 
                alt={currentAsset.name}
                style={{ height: '300px', objectFit: 'cover' }}
              />
            ) : (
              <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                <i className="bi bi-image display-1 text-muted"></i>
              </div>
            )}
          </div>
        </div>

        {/* Asset Details */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Asset Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Name</label>
                  <p className="mb-0">{currentAsset.name}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Status</label>
                  <p className="mb-0">
                    <span className={`badge ${
                      currentAsset.status === 'available' ? 'bg-success' :
                      currentAsset.status === 'allocated' ? 'bg-primary' :
                      currentAsset.status === 'maintenance' ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      {currentAsset.status}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Quantity</label>
                  <p className="mb-0">{currentAsset.quantity}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Category ID</label>
                  <p className="mb-0">{currentAsset.category_id}</p>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Description</label>
                <p className="mb-0">{currentAsset.description || 'No description available'}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Created At</label>
                <p className="mb-0">
                  {currentAsset.created_at ? new Date(currentAsset.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Allocation History */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Allocation History</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">No allocation history available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
