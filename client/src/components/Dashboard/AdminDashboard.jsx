import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, FileText, Users, TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';
import RequestsTable from '../Requests/RequestsTable';
import { fetchRequests } from '../../store/slices/requestsSlice';
import { fetchAssets } from '../../store/slices/assetsSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.requests);
  const { assets } = useSelector((state) => state.assets);

  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchAssets());
  }, [dispatch]);

  const stats = {
    totalAssets: assets.length,
    totalRequests: requests.length,
    pendingRequests: requests.filter(req => req.status === 'pending').length,
    totalUsers: 45, // This would come from a users API
  };

  const recentRequests = requests.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Assets"
          value={stats.totalAssets}
          icon={Package}
          trend="up"
          trendValue="12"
          color="primary"
        />
        <StatsCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={FileText}
          trend="up"
          trendValue="8"
          color="success"
        />
        <StatsCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={TrendingUp}
          color="warning"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend="up"
          trendValue="5"
          color="error"
        />
      </div>

      {/* Recent Requests */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
          <button className="btn-primary">View All</button>
        </div>
        <RequestsTable requests={recentRequests} showActions={true} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Assets</h3>
              <p className="text-sm text-gray-500">Add, edit, or remove assets</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-success-50 rounded-lg">
              <Users className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">User Management</h3>
              <p className="text-sm text-gray-500">Manage user accounts and roles</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-warning-50 rounded-lg">
              <FileText className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Generate Reports</h3>
              <p className="text-sm text-gray-500">View detailed analytics and reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;