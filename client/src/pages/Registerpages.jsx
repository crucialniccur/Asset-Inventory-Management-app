import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authslice';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'employee',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
      role: Yup.string().oneOf(['employee', 'admin', 'procurement_manager'], 'Invalid role'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await dispatch(registerUser(values)).unwrap();
        localStorage.setItem('token', res.token);
        navigate('/dashboard');
      } catch (err) {
        alert(err || 'Registration failed.');
      }
    },
  });

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(to right, #4e54c8, #8f94fb)' }}>
      <div className="bg-white rounded-4 shadow p-4 w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <img src="/logo.png" alt="Logo" width={200} className="mb-2" />
          <h4 className="fw-bold">AssetTracker</h4>
          <p className="text-muted">Create an account to get started</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.name && <div className="text-danger small">{formik.errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.email && <div className="text-danger small">{formik.errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <span
                className="input-group-text"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </span>
            </div>
            {formik.errors.password && <div className="text-danger small">{formik.errors.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-briefcase"></i></span>
              <select
                name="role"
                className="form-select"
                value={formik.values.role}
                onChange={formik.handleChange}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
                <option value="procurement_manager">Procurement Manager</option>
              </select>
            </div>
            {formik.errors.role && <div className="text-danger small">{formik.errors.role}</div>}
          </div>

          {error && <div className="text-danger text-center small">{error}</div>}

          <button type="submit" className="btn btn-primary w-100 mt-2" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <a href="/login" className="d-block text-center mt-3">Already have an account? Log in</a>
        </form>

        <div className="text-center mt-4 small text-muted">
          &copy; 2024 AssetTracker. All rights reserved.
        </div>
      </div>
    </div>
  );
}
