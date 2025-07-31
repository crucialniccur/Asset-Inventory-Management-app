import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRequests, approveRequest, rejectRequest } from '../redux/slices/requestsSlice';

const RequestsTable = () => {
  const { user } = useSelector((state) => state.auth);
  const { requests, loading, error } = useSelector((state) => state.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      req.asset_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || req.urgency === urgencyFilter;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning">Pending</span>;
      case 'approved':
        return <span className="badge bg-success">Approved</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      case 'fulfilled':
        return <span className="badge bg-info">Fulfilled</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'high':
        return <span className="badge bg-danger">High</span>;
      case 'medium':
        return <span className="badge bg-warning">Medium</span>;
      case 'low':
        return <span className="badge bg-success">Low</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const handleApprove = (id) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      dispatch(approveRequest(id));
    }
  };

  const handleReject = (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      dispatch(rejectRequest({ id, reason }));
    }
  };

  const canManageRequests = user?.role === 'Admin' || user?.role === 'Procurement';

  if (loading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Requests</h2>
          <p className="text-muted mb-0">Manage asset requests and approvals</p>
        </div>
        {user?.role === 'Employee' && (
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/requests/new')}
          >
            <i className="bi bi-plus-circle me-2"></i>
            New Request
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
          >
            <option value="all">All Urgency</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card">
        <div className="card-body">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-file-text display-1 text-muted"></i>
              <h4 className="mt-3">No requests found</h4>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>User</th>
                    <th>Asset</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Date</th>
                    {canManageRequests && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td>#{request.id}</td>
                      <td>
                        <div>
                          <div className="fw-medium">{request.user?.name}</div>
                          <small className="text-muted">{request.user?.email}</small>
                        </div>
                      </td>
                      <td>{request.asset_name}</td>
                      <td>{request.type}</td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '200px' }} title={request.reason}>
                          {request.reason}
                        </div>
                      </td>
                      <td>{getUrgencyBadge(request.urgency)}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>
                        <small>
                          {new Date(request.requested_at).toLocaleDateString()}
                        </small>
                      </td>
                      {canManageRequests && (
                        <td>
                          {request.status === 'pending' && (
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-success"
                                onClick={() => handleApprove(request.id)}
                                title="Approve"
                              >
                                <i className="bi bi-check-circle"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleReject(request.id)}
                                title="Reject"
                              >
                                <i className="bi bi-x-circle"></i>
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsTable;