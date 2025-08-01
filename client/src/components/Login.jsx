import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slices/authslice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div
  className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
  style={{
    background: "linear-gradient(to right, #f0f4f8, #d9e2ec)"
  }}
>
  <div
    className="bg-white rounded-4 shadow-sm p-4 p-md-5 w-100"
    style={{ maxWidth: "420px" }}
  >
    <div className="text-center mb-4">
      <img src="/logo.png" alt="Logo" width="160" className="mb-2" />
      <h5 className="fw-semibold text-dark mb-1">Welcome Back</h5>
      <p className="text-muted small">Sign in to continue</p>
    </div>

    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control form-control-lg"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="form-control form-control-lg"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="input-group-text bg-white border-start-0"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center small py-2 mb-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-dark w-100 btn-lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>
    </form>

    <p className="text-center text-muted mt-4 mb-0 small">
      &copy; {new Date().getFullYear()} AssetTracker
    </p>
  </div>
</div>
  );
};

export default Login;
