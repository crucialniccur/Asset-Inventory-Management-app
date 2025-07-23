import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import RequestFormModal from '../components/RequestFormModal';

const statusColor = {
  pending: 'warning',
  approved: 'success',
  completed: 'secondary',
};

const urgencyColor = {
  low: 'info',
  medium: 'primary',
  high: 'danger',
};

export default function RequestsPage() {
  const requests = useSelector((state) => state.requests.list || []);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My Requests</h2>
          <p className="text-muted">Track your asset and repair requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-1"></i> New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="text-muted">You have not made any requests yet.</p>
      ) : (
        <div className="row">
          {requests.map((req, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{req.title || 'New Request'}</h5>
                  <p className="text-muted mb-1">
                    Submitted on {new Date(req.date || Date.now()).toLocaleDateString()}
                  </p>
                  <p className="mb-2">{req.reason}</p>

                  {req.quantity && <p className="mb-1"><strong>Quantity:</strong> {req.quantity}</p>}

                  <div className="d-flex gap-2 mb-2">
                    <span className={`badge bg-${statusColor[req.status?.toLowerCase()] || 'info'}`}>
                      {req.status}
                    </span>
                    <span className={`badge bg-${urgencyColor[req.urgency?.toLowerCase()] || 'info'}`}>
                      {req.urgency}
                    </span>
                  </div>

                  {req.status === 'pending' && (
                    <p className="text-muted small">Waiting for review</p>
                  )}

                  {req.status === 'approved' && (
                    <p className="text-muted small">
                      Approved by: {req.approvedBy || 'Sarah Procurement'}<br />
                      Approved: {req.approvedDate || '7/9/2024'}<br />
                      Being processed
                    </p>
                  )}

                  {req.status === 'completed' && (
                    <p className="text-muted small">
                      Approved by: {req.approvedBy || 'Sarah Procurement'}<br />
                      Approved: {req.approvedDate || '7/2/2024'}<br />
                      Completed: {req.completedDate || '7/5/2024'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for new request */}
      <RequestFormModal show={showModal} handleClose={() => setShowModal(false)} />
    </div>
  );
}
