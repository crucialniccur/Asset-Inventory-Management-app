import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  PlusCircle,
  ClipboardList
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ];

    switch (user?.role) {
      case 'Admin':
        return [
          ...baseItems,
          { name: 'Assets', href: '/assets', icon: Package },
          { name: 'All Requests', href: '/requests', icon: FileText },
          { name: 'Users', href: '/users', icon: Users },
          { name: 'Settings', href: '/settings', icon: Settings },
        ];
      
      case 'Procurement':
        return [
          ...baseItems,
          { name: 'Assets', href: '/assets', icon: Package },
          { name: 'Requests', href: '/requests', icon: FileText },
          { name: 'Add Asset', href: '/assets/new', icon: PlusCircle },
        ];
      
      case 'Finance':
        return [
          ...baseItems,
          { name: 'Requests', href: '/requests', icon: FileText },
          { name: 'Budget Reports', href: '/reports', icon: ClipboardList },
        ];
      
      default: // Employee
        return [
          ...baseItems,
          { name: 'My Requests', href: '/my-requests', icon: FileText },
          { name: 'New Request', href: '/requests/new', icon: PlusCircle },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Package className="w-8 h-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">AssetTrack</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User info and logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;