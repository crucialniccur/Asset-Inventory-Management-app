import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import StatsCard from './StatsCard';
import RequestsTable from '../Requests/RequestsTable';
import { fetchRequests } from '../../store/slices/requestsSlice';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  // Filter requests for current user
  const userRequests = requests.filter(req => req.user_id === user?.id);
  
  const stats = {
    totalRequests: userRequests.length,
    pendingRequests: userRequests.filter(req => req.status === 'pending').length,
    approvedRequests: userRequests.filter(req => req.status === 'approved').length,
    rejectedRequests: userRequests.filter(req => req.status === 'rejected').length,
  };

  const recentRequests = userRequests.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={FileText}
          color="primary"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingRequests}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Approved"
          value={stats.approvedRequests}
          icon={CheckCircle}
          color="success"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejectedRequests}
          icon={XCircle}
          color="error"
        />
      </div>

      {/* Recent Requests */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">My Recent Requests</h2>
          <button className="btn-primary">New Request</button>
        </div>
        <RequestsTable requests={recentRequests} showActions={false} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              Request New Asset
            </button>
            <button className="w-full btn-secondary text-left">
              Report Asset Issue
            </button>
            <button className="w-full btn-secondary text-left">
              View All My Requests
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Status Guide</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="status-badge status-pending">Pending</span>
              <span className="text-sm text-gray-600">Under review</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="status-badge status-approved">Approved</span>
              <span className="text-sm text-gray-600">Being processed</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="status-badge status-fulfilled">Fulfilled</span>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="status-badge status-rejected">Rejected</span>
              <span className="text-sm text-gray-600">Not approved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;