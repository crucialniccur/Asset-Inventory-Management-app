import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets } from '../redux/slices/assetslice';


export default function AssetsPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.assets);

  const fallbackAssets = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    sku: 'MBP-16-001',
    description: 'MacBook Pro 16-inch with M3 chip, 32GB RAM, 1TB SSD',
    category: 'Laptops',
    assigned_date: '2024-01-15',
    value: 3299,
    status: 'assigned',
    image: '/macbook.jpg',
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5',
    sku: 'HDH-SY-005',
    description: 'Wireless noise-canceling headphones',
    category: 'Audio Equipment',
    assigned_date: '2024-02-10',
    value: 399,
    status: 'assigned',
    image: '/sony.jpg',
  },
];

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [issue, setIssue] = useState('');
  const [urgency, setUrgency] = useState('Medium');

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  const openModal = (asset) => {
    setSelectedAsset(asset);
    setIssue('');
    setUrgency('Medium');
    const modal = new bootstrap.Modal(document.getElementById('repairModal'));
    modal.show();
  };

  const handleSubmitRepair = (e) => {
    e.preventDefault();
    // You can dispatch a repair request here or log it
    console.log({
      assetId: selectedAsset.id,
      issue,
      urgency,
    });
    alert(`Repair request submitted for ${selectedAsset.name}`);
    bootstrap.Modal.getInstance(document.getElementById('repairModal')).hide();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">My Assets</h2>
      <p className="text-muted mb-4">View and manage your assigned assets</p>

      {loading ? (
        <p>Loading assets...</p>
      ) : (
        <div className="row">
          {(list.length > 0 ? list : fallbackAssets).map((asset) => (
            <div className="col-md-6 mb-4" key={asset.id}>
              <div className="card h-100 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={asset.image || '/placeholder.png'}
                      alt={asset.name}
                      className="img-fluid rounded-start h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{asset.name}</h5>
                      <h6 className="card-subtitle text-muted mb-2">SKU: {asset.sku}</h6>
                      <p className="card-text">{asset.description}</p>

                      <div className="mb-2">
                        <strong>Category:</strong> {asset.category}<br />
                        <strong>Assigned:</strong> {new Date(asset.assigned_date).toLocaleDateString()}<br />
                        <strong>Value:</strong> ${asset.value}<br />
                        <strong>Status:</strong>{' '}
                        <span className="badge bg-info text-dark">{asset.status}</span>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal(asset)}
                      >
                        Request Repair
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔧 Repair Request Modal */}
      <div
        className="modal fade"
        id="repairModal"
        tabIndex="-1"
        aria-labelledby="repairModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <form onSubmit={handleSubmitRepair} className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="repairModalLabel">
                Request Repair
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p className="fw-semibold">
                Submit a repair request for <span className="text-primary">{selectedAsset?.name}</span>
              </p>
              <div className="mb-3">
                <label htmlFor="issue" className="form-label">Issue Description</label>
                <textarea
                  className="form-control"
                  id="issue"
                  rows="3"
                  placeholder="Describe the issue with this asset..."
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="urgency" className="form-label">Urgency Level</label>
                <select
                  id="urgency"
                  className="form-select"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  required
                >
                  <option value="Low">Low - Minor inconvenience</option>
                  <option value="Medium">Medium - Normal priority</option>
                  <option value="High">High - Critical issue</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-danger">Submit Repair Request</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
