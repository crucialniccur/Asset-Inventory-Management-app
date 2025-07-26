import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authslice';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(form)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      alert(err || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(to right, #4e54c8, #8f94fb)' }}>
      <div className="bg-white p-4 rounded-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <img src="/logo.png" alt="Logo" width={200} className="mb-2" />
          <h4 className="fw-bold">Welcome to AssetTracker</h4>
          <p className="text-muted">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </span>
            </div>
          </div>

          {error && <div className="text-danger mb-2 text-center">{error}</div>}

          <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <a href="/register" className="d-block text-center mt-3">Don't have an account? Register</a>
        </form>

        <div className="text-center mt-4 small text-muted">
          &copy; 2024 AssetTracker. All rights reserved.
        </div>
      </div>
    </div>
  );
}
