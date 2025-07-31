import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/slices/authslice';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: 'bi-house', 
      path: '/dashboard',
      roles: ['Admin', 'Procurement', 'Finance', 'Employee'] 
    },
    { 
      id: 'assets', 
      label: 'Assets', 
      icon: 'bi-box', 
      path: '/assets',
      roles: ['Admin', 'Procurement', 'Finance', 'Employee'] 
    },
    { 
      id: 'requests', 
      label: 'Requests', 
      icon: 'bi-file-text', 
      path: '/requests',
      roles: ['Admin', 'Procurement', 'Finance', 'Employee'] 
    },
    { 
      id: 'allocation', 
      label: 'Allocations', 
      icon: 'bi-person-check', 
      path: '/allocation',
      roles: ['Admin', 'Procurement'] 
    },
    { 
      id: 'add-asset', 
      label: 'Add Asset', 
      icon: 'bi-plus-circle', 
      path: '/assets/add',
      roles: ['Admin', 'Procurement'] 
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: 'bi-people', 
      path: '/users',
      roles: ['Admin'] 
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role || 'Employee')
  );

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
      {/* Header */}
      <div className="p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center">
          <div className="bg-primary rounded p-2 me-2">
            <i className="bi bi-building text-white"></i>
          </div>
          <div>
            <h6 className="mb-0 text-white">Asset Manager</h6>
            <small className="text-muted">Inventory System</small>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-3 border-bottom border-secondary">
        <div className="bg-secondary rounded p-2">
          <p className="mb-1 fw-bold text-white">{user?.name}</p>
          <p className="mb-1 small text-light">{user?.role}</p>
          <p className="mb-0 small text-muted">{user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        {filteredMenuItems.map(item => (
          <button
            key={item.id}
            className={`btn w-100 text-start mb-1 ${
              isActive(item.path) 
                ? 'btn-primary' 
                : 'btn-outline-light'
            }`}
            onClick={() => navigate(item.path)}
          >
            <i className={`bi ${item.icon} me-2`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="p-3 border-top border-secondary mt-auto">
        <button
          className="btn btn-outline-light w-100 mb-2"
          onClick={() => navigate('/settings')}
        >
          <i className="bi bi-gear me-2"></i>
          Settings
        </button>
        <button
          className="btn btn-outline-danger w-100"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
