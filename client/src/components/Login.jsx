import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, verify2FA, clearError, getUserProfile } from '../redux/slices/authslice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { AlertCircle, Building2, Lock, Mail, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [requires2FA, setRequires2FA] = useState(false); // Add local state
  const [userId, setUserId] = useState(null); // Add local state

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: authError, token } = useSelector((state) => state.auth);
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  useEffect(() => {
    if (requires2FA) {
      setError('');
    }
  }, [requires2FA]);

  const fetchLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      return data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await fetchLogin(email, password);
      console.log(result);
      if (result.requires2FA) { // Updated property name to match backend
        setRequires2FA(true);
        setUserId(result.user_id);
      } else {
        // Handle direct login success if 2FA is not required
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    dispatch(clearError());

    try {
      const result = await dispatch(verify2FA({ user_id: userId, code })).unwrap();
      console.log('2FA verification result:', result);

      // Fetch user profile after successful verification
      try {
        await dispatch(getUserProfile()).unwrap();
      } catch (profileError) {
        console.error('Failed to fetch user profile:', profileError);
        // Continue anyway as we have the token
      }

      toast({
        title: "Login successful",
        description: "Welcome to Asset Management System"
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('2FA verification error:', err);
      setError(err.message || err || '2FA verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    dispatch(clearError());
    setError('');
    setCode('');
    setRequires2FA(false);
    setUserId(null);
    // Reset the 2FA state in Redux if action exists
    if (dispatch({ type: 'auth/reset2FA' })) {
      dispatch({ type: 'auth/reset2FA' });
    }
  };

  // Handle input changes with validation
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setCode(value);
    }
  };


  // Show 2FA form if login was successful
  if (requires2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Two-Factor Authentication</h1>
            <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Verify Code</CardTitle>
              <CardDescription className="text-center">
                Check your email for the verification code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handle2FAVerification} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="code"
                      type="text"
                      placeholder="000000"
                      value={code}
                      onChange={handleCodeChange}
                      className="pl-10 text-center text-lg tracking-widest font-mono"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                      autoComplete="one-time-code"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Enter the 6-digit code from your email</p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={isLoading || loading || code.length !== 6}
                >
                  {isLoading || loading ? 'Verifying...' : 'Verify Code'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToLogin}
                  disabled={isLoading || loading}
                >
                  Back to Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show login form
  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <div className="w-100" style={{ maxWidth: '500px' }}>
      <div className="bg-white p-4 rounded shadow-sm border">
        <div className="text-center mb-4">
          <div className="mx-auto bg-primary rounded d-flex align-items-center justify-content-center mb-3" style={{ width: '56px', height: '56px' }}>
            <i className="bi bi-building text-white fs-4"></i>
        </div>
          <h5 className="mt-3 mb-1">Welcome back</h5>
          <p className="text-muted small">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading || loading}
          >
            {isLoading || loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  </div>

  );
};

export default Login;
