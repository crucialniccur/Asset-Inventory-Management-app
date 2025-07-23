import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Filter } from 'lucide-react';
import RequestsTable from '../components/Requests/RequestsTable';
import RequestForm from '../components/Requests/RequestForm';
import { fetchRequests, setFilters } from '../store/slices/requestsSlice';

const Requests = () => {
  const dispatch = useDispatch();
  const { requests, isLoading, filters } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const filteredRequests = requests.filter(request => {
    if (filters.status !== 'all' && request.status !== filters.status) return false;
    if (filters.urgency !== 'all' && request.urgency !== filters.urgency) return false;
    if (filters.type !== 'all' && request.type !== filters.type) return false;
    return true;
  });

  const canCreateRequest = user?.role === 'Employee';
  const canManageRequests = ['Admin', 'Procurement', 'Finance'].includes(user?.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'Employee' ? 'My Requests' : 'All Requests'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'Employee' 
              ? 'Track your asset requests and their status'
              : 'Manage and review asset requests from employees'
            }
          </p>
        </div>
        
        {canCreateRequest && (
          <button
            onClick={() => setShowRequestForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex space-x-4">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="fulfilled">Fulfilled</option>
            </select>

            <select
              value={filters.urgency}
              onChange={(e) => handleFilterChange('urgency', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Urgency</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="New Asset">New Asset</option>
              <option value="Repair">Repair</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <RequestsTable 
            requests={filteredRequests} 
            showActions={canManageRequests}
          />
        )}
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Request
            </h2>
            <RequestForm onClose={() => setShowRequestForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;