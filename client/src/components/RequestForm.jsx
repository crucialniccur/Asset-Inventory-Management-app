import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createRequest } from '../redux/slices/requestsSlice';

const RequestForm = () => {
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    asset_name: '',
    type: 'New Asset',
    reason: '',
    urgency: 'medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.asset_name || !formData.reason) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await dispatch(createRequest(formData)).unwrap();
      alert('Request submitted successfully!');
      navigate('/requests');
    } catch (err) {
      alert(err || 'Failed to submit request');
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">New Request</h2>
          <p className="text-muted mb-0">Submit a new asset request</p>
        </div>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/requests')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Requests
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="asset_name" className="form-label">
                  Asset Name/Type <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="asset_name"
                  name="asset_name"
                  value={formData.asset_name}
                  onChange={handleChange}
                  placeholder="e.g., Dell Laptop, Office Chair, Printer"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="type" className="form-label">
                  Request Type <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="New Asset">New Asset</option>
                  <option value="Repair">Repair</option>
                  <option value="Replacement">Replacement</option>
                  <option value="Upgrade">Upgrade</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="reason" className="form-label">
                Reason/Justification <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="reason"
                name="reason"
                rows="4"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please provide a detailed explanation for your request..."
                required
              ></textarea>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="urgency" className="form-label">
                  Urgency Level <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                >
                  <option value="low">Low - Can wait a few weeks</option>
                  <option value="medium">Medium - Needed within a week</option>
                  <option value="high">High - Needed immediately</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="requested_by" className="form-label">
                  Requested By
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="requested_by"
                  value={user?.name || 'Current User'}
                  readOnly
                />
              </div>
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Submit Request
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/requests')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Help Section */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Request Guidelines
          </h5>
        </div>
        <div className="card-body">
          <ul className="list-unstyled mb-0">
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              <strong>New Asset:</strong> Request for equipment you don't currently have
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              <strong>Repair:</strong> Request to fix existing equipment
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              <strong>Replacement:</strong> Request to replace damaged/lost equipment
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              <strong>Upgrade:</strong> Request to upgrade existing equipment
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;