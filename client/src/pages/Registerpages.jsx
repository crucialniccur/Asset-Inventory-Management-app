import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authslice';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
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
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Password required'),
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
            <input
              name="name"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.name}
              placeholder="Enter your name"
            />
            {formik.errors.name && <div className="text-danger small">{formik.errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Enter your email"
            />
            {formik.errors.email && <div className="text-danger small">{formik.errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.password}
              placeholder="Enter your password"
            />
            {formik.errors.password && <div className="text-danger small">{formik.errors.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              onChange={formik.handleChange}
              value={formik.values.role}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="procurement_manager">Procurement Manager</option>
            </select>
            {formik.errors.role && <div className="text-danger small">{formik.errors.role}</div>}
          </div>

          {error && <div className="text-danger text-center small">{error}</div>}

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
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
