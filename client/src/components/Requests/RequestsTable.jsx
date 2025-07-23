import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Eye, Check, X, Clock } from 'lucide-react';
import { updateRequestStatus } from '../../store/slices/requestsSlice';

const RequestsTable = ({ requests, showActions = false }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleStatusUpdate = (requestId, status) => {
    dispatch(updateRequestStatus({ requestId, status }));
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-badge status-pending',
      approved: 'status-badge status-approved',
      rejected: 'status-badge status-rejected',
      fulfilled: 'status-badge status-fulfilled',
    };

    return (
      <span className={statusClasses[status] || 'status-badge'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyClasses = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-warning-100 text-warning-800',
      high: 'bg-error-100 text-error-800',
    };

    return (
      <span className={`status-badge ${urgencyClasses[urgency]}`}>
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
      </span>
    );
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No requests found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Urgency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requested
            </th>
            {showActions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {request.asset_name}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {request.reason}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getUrgencyBadge(request.urgency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(request.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(request.requested_at).toLocaleDateString()}
              </td>
              {showActions && user?.role === 'Procurement' && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'approve')}
                          className="text-success-600 hover:text-success-900"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'reject')}
                          className="text-error-600 hover:text-error-900"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      className="text-primary-600 hover:text-primary-900"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;