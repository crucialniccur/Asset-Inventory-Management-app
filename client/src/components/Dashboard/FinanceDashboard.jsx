import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import StatsCard from './StatsCard';
import RequestsTable from '../Requests/RequestsTable';
import { fetchRequests } from '../../store/slices/requestsSlice';

const FinanceDashboard = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  // Mock financial data - in real app, this would come from API
  const stats = {
    monthlyBudget: 50000,
    spentThisMonth: 32500,
    pendingApprovals: requests.filter(req => req.status === 'pending').length,
    highValueRequests: requests.filter(req => req.urgency === 'high').length,
  };

  const budgetUtilization = (stats.spentThisMonth / stats.monthlyBudget) * 100;
  const highValueRequests = requests.filter(req => req.urgency === 'high');

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Monthly Budget"
          value={`$${stats.monthlyBudget.toLocaleString()}`}
          icon={DollarSign}
          color="primary"
        />
        <StatsCard
          title="Spent This Month"
          value={`$${stats.spentThisMonth.toLocaleString()}`}
          icon={TrendingUp}
          trend="up"
          trendValue="12"
          color="success"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={FileText}
          color="warning"
        />
        <StatsCard
          title="High Value Requests"
          value={stats.highValueRequests}
          icon={AlertCircle}
          color="error"
        />
      </div>

      {/* Budget Overview */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Budget Overview</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Budget Utilization</span>
            <span className="text-sm font-medium text-gray-900">
              {budgetUtilization.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                budgetUtilization > 80 ? 'bg-error-500' : 
                budgetUtilization > 60 ? 'bg-warning-500' : 'bg-success-500'
              }`}
              style={{ width: `${budgetUtilization}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Spent: ${stats.spentThisMonth.toLocaleString()}</span>
            <span>Remaining: ${(stats.monthlyBudget - stats.spentThisMonth).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* High Value Requests */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">High Value Requests</h2>
          <span className="status-badge bg-error-100 text-error-800">
            Requires Review
          </span>
        </div>
        <RequestsTable requests={highValueRequests} showActions={false} />
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hardware</span>
              <span className="font-medium">$15,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Software</span>
              <span className="font-medium">$8,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Repairs</span>
              <span className="font-medium">$5,200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Maintenance</span>
              <span className="font-medium">$3,800</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              Review Budget Requests
            </button>
            <button className="w-full btn-secondary text-left">
              Generate Financial Report
            </button>
            <button className="w-full btn-secondary text-left">
              Set Budget Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;