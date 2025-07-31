// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';

import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import AssetList from './components/AssetList';
import AssetDetail from './components/AssetDetail';
import AddAssetForm from './components/AddAssetForm';
import AssetAllocation from './components/AssetAllocation';
import RequestForm from './components/RequestForm';
import RequestsTable from './components/RequestsTable';
import UserManagement from './components/UserManagement';
import AddUser from './components/AddUser';
import Settings from './components/Settings';
import Login from './components/Login';

function PrivateRoute({ children, allowedRoles = [] }) {
  const { token, user } = useSelector((state) => state.auth);
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {children}
      </main>
    </div>
  );
}

function App() {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />

          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          } />
          
          {/* Asset management routes */}
          <Route path="/assets" element={
            <PrivateRoute>
              <AppLayout>
                <AssetList />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/assets/:id" element={
            <PrivateRoute>
              <AppLayout>
                <AssetDetail />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/assets/add" element={
            <PrivateRoute allowedRoles={['Admin', 'Procurement']}>
              <AppLayout>
                <AddAssetForm />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/allocation" element={
            <PrivateRoute allowedRoles={['Admin', 'Procurement']}>
              <AppLayout>
                <AssetAllocation />
              </AppLayout>
            </PrivateRoute>
          } />
          
          {/* Request routes */}
          <Route path="/requests" element={
            <PrivateRoute>
              <AppLayout>
                <RequestsTable />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/requests/new" element={
            <PrivateRoute allowedRoles={['Employee']}>
              <AppLayout>
                <RequestForm />
              </AppLayout>
            </PrivateRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/users" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AppLayout>
                <UserManagement />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/users/add" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AppLayout>
                <AddUser />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/settings" element={
            <PrivateRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </PrivateRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
