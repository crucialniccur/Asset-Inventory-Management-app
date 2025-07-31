import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddUser = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/auth/register', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert('User created successfully!');
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const canAddUsers = user?.role === 'Admin';

  if (!canAddUsers) {
    return (
      <div className="p-4">
        <div className="alert alert-warning" role="alert">
          You don't have permission to add users.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Add New User</h2>
          <p className="text-muted mb-0">Create a new user account</p>
        </div>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/users')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Users
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password (min 6 characters)"
                  required
                  minLength="6"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="role" className="form-label">
                  Role <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="employee">Employee</option>
                  <option value="procurement">Procurement Manager</option>
                  <option value="finance">Finance Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <input
                type="text"
                className="form-control"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department (optional)"
              />
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
                    Creating User...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Create User
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/users')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Role Information */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Role Permissions
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6 className="text-primary">Employee</h6>
              <ul className="list-unstyled small">
                <li>• View assets and requests</li>
                <li>• Submit new requests</li>
                <li>• View own data</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6 className="text-warning">Procurement Manager</h6>
              <ul className="list-unstyled small">
                <li>• Add/edit assets</li>
                <li>• Allocate assets</li>
                <li>• Approve/reject requests</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6 className="text-info">Finance Manager</h6>
              <ul className="list-unstyled small">
                <li>• View all requests (read-only)</li>
                <li>• View assets (read-only)</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6 className="text-danger">Admin</h6>
              <ul className="list-unstyled small">
                <li>• Full system access</li>
                <li>• Manage users and roles</li>
                <li>• All operations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser; 