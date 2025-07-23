import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { getCurrentUser } from './store/slices/authSlice';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// App Content Component
const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Try to get current user on app load
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes would go here */}
        <Route path="/login" element={<div>Login Page (to be implemented)</div>} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="requests" element={<Requests />} />
          <Route path="my-requests" element={<Requests />} />
          <Route path="assets" element={<div>Assets Page (to be implemented)</div>} />
          <Route path="users" element={<div>Users Page (to be implemented)</div>} />
          <Route path="settings" element={<div>Settings Page (to be implemented)</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
