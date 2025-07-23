import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, FileText, CheckCircle, Clock } from 'lucide-react';
import StatsCard from './StatsCard';
import RequestsTable from '../Requests/RequestsTable';
import { fetchRequests } from '../../store/slices/requestsSlice';
import { fetchAssets } from '../../store/slices/assetsSlice';

const ProcurementDashboard = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.requests);
  const { assets } = useSelector((state) => state.assets);

  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchAssets());
  }, [dispatch]);

  const stats = {
    totalAssets: assets.length,
    pendingRequests: requests.filter(req => req.status === 'pending').length,
    approvedRequests: requests.filter(req => req.status === 'approved').length,
    urgentRequests: requests.filter(req => req.urgency === 'high' && req.status === 'pending').length,
  };

  const urgentRequests = requests.filter(req => req.urgency === 'high' && req.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Assets"
          value={stats.totalAssets}
          icon={Package}
          color="primary"
        />
        <StatsCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Approved Today"
          value={stats.approvedRequests}
          icon={CheckCircle}
          trend="up"
          trendValue="15"
          color="success"
        />
        <StatsCard
          title="Urgent Requests"
          value={stats.urgentRequests}
          icon={FileText}
          color="error"
        />
      </div>

      {/* Urgent Requests */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Urgent Requests</h2>
          <span className="status-badge bg-error-100 text-error-800">
            {stats.urgentRequests} urgent
          </span>
        </div>
        <RequestsTable requests={urgentRequests} showActions={true} />
      </div>

      {/* Asset Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Available</span>
              <span className="font-medium text-success-600">
                {assets.filter(asset => asset.status === 'available').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Use</span>
              <span className="font-medium text-primary-600">
                {assets.filter(asset => asset.status === 'in_use').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Under Repair</span>
              <span className="font-medium text-warning-600">
                {assets.filter(asset => asset.status === 'repair').length}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              Review Pending Requests
            </button>
            <button className="w-full btn-secondary text-left">
              Add New Asset
            </button>
            <button className="w-full btn-secondary text-left">
              Generate Asset Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementDashboard;