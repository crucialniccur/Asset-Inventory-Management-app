import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Building2, Home, Package, Users,
  FileText, Settings, LogOut, UserCheck, PlusCircle
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['Admin', 'Procurement', 'Finance', 'Employee'] },
    { id: 'assets', label: 'Assets', icon: Package, roles: ['Admin', 'Procurement', 'Finance', 'Employee'] },
    { id: 'requests', label: 'Requests', icon: FileText, roles: ['Admin', 'Procurement', 'Finance', 'Employee'] },
    { id: 'allocations', label: 'Allocations', icon: UserCheck, roles: ['Admin', 'Procurement', 'Finance'] },
    { id: 'users', label: 'Users', icon: Users, roles: ['Admin'] },
    { id: 'add-asset', label: 'Add Asset', icon: PlusCircle, roles: ['Admin', 'Procurement'] }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role || 'Employee')
  );

  return (
    <div className="w-64 h-screen bg-[#1f2937] text-white border-r border-[#374151] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#374151]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Asset Manager</h1>
            <p className="text-xs text-gray-300">Inventory System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-[#374151]">
        <div className="bg-[#111827] rounded-lg p-3">
          <p className="font-medium text-gray-100 text-sm">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.role}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full justify-start space-x-3 h-10 rounded-md transition text-white",
                isActive
                  ? "bg-[#111827] border border-[#2563eb]"
                  : "hover:bg-[#111827] hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-[#374151] space-y-2">
        <Button
          variant="ghost"
          onClick={() => setActiveTab('settings')}
          className="w-full justify-start space-x-3 h-10 text-white hover:bg-[#111827]"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start space-x-3 h-10 text-white hover:bg-red-600 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
