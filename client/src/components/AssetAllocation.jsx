import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAssets } from '../redux/slices/assetsSlice';

const AssetAllocation = () => {
  const { user } = useSelector((state) => state.auth);
  const { assets, loading, error } = useSelector((state) => state.assets);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allocations, setAllocations] = useState([
    {
      id: 1,
      asset_name: 'Dell Laptop XPS 13',
      allocated_to: 'John Doe',
      allocated_by: 'Admin User',
      allocation_date: '2024-01-15',
      return_date: null,
      status: 'active'
    },
    {
      id: 2,
      asset_name: 'Office Chair',
      allocated_to: 'Jane Smith',
      allocated_by: 'Procurement Manager',
      allocation_date: '2024-01-14',
      return_date: null,
      status: 'active'
    },
    {
      id: 3,
      asset_name: 'HP Printer',
      allocated_to: 'Mike Johnson',
      allocated_by: 'Admin User',
      allocation_date: '2024-01-10',
      return_date: '2024-01-20',
      status: 'returned'
    }
  ]);

  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [allocationDate, setAllocationDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  const canAllocateAssets = user?.role === 'Admin' || user?.role === 'Procurement';

  if (!canAllocateAssets) {
    return (
      <div className="p-4">
        <div className="alert alert-warning" role="alert">
          You don't have permission to allocate assets.
        </div>
      </div>
    );
  }

  const handleAllocateAsset = (e) => {
    e.preventDefault();
    
    if (!selectedAsset || !selectedEmployee || !allocationDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newAllocation = {
      id: allocations.length + 1,
      asset_name: selectedAsset,
      allocated_to: selectedEmployee,
      allocated_by: user?.name || 'Current User',
      allocation_date: allocationDate,
      return_date: returnDate || null,
      status: 'active'
    };

    setAllocations([...allocations, newAllocation]);
    
    // Reset form
    setSelectedAsset('');
    setSelectedEmployee('');
    setAllocationDate('');
    setReturnDate('');
    
    alert('Asset allocated successfully!');
  };

  const handleReturnAsset = (allocationId) => {
    if (window.confirm('Are you sure you want to return this asset?')) {
      setAllocations(allocations.map(allocation => 
        allocation.id === allocationId 
          ? { ...allocation, status: 'returned', return_date: new Date().toISOString().split('T')[0] }
          : allocation
      ));
      alert('Asset returned successfully!');
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <span className="badge bg-success">Active</span>
      : <span className="badge bg-secondary">Returned</span>;
  };

  const availableAssets = assets.filter(asset => asset.status === 'available');

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Asset Allocation</h2>
          <p className="text-muted mb-0">Manage asset allocations to employees</p>
        </div>
      </div>

      <div className="row">
        {/* Allocation Form */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-person-check me-2"></i>
                Allocate Asset
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAllocateAsset}>
                <div className="mb-3">
                  <label htmlFor="asset" className="form-label">
                    Asset <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="asset"
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    required
                  >
                    <option value="">Select an asset</option>
                    {availableAssets.map(asset => (
                      <option key={asset.id} value={asset.name}>
                        {asset.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="employee" className="form-label">
                    Employee <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="employee"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    required
                  >
                    <option value="">Select an employee</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Sarah Wilson">Sarah Wilson</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="allocationDate" className="form-label">
                    Allocation Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="allocationDate"
                    value={allocationDate}
                    onChange={(e) => setAllocationDate(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="returnDate" className="form-label">
                    Expected Return Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="returnDate"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-check-circle me-2"></i>
                  Allocate Asset
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Allocations List */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Current Allocations
              </h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Allocated To</th>
                        <th>Allocated By</th>
                        <th>Allocation Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocations.map((allocation) => (
                        <tr key={allocation.id}>
                          <td>
                            <div className="fw-medium">{allocation.asset_name}</div>
                          </td>
                          <td>{allocation.allocated_to}</td>
                          <td>{allocation.allocated_by}</td>
                          <td>
                            <small>
                              {new Date(allocation.allocation_date).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            {allocation.return_date ? (
                              <small>
                                {new Date(allocation.return_date).toLocaleDateString()}
                              </small>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>{getStatusBadge(allocation.status)}</td>
                          <td>
                            {allocation.status === 'active' && (
                              <button
                                className="btn btn-outline-warning btn-sm"
                                onClick={() => handleReturnAsset(allocation.id)}
                                title="Return Asset"
                              >
                                <i className="bi bi-arrow-return-left"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {allocations.length === 0 && !loading && (
                <div className="text-center py-5">
                  <i className="bi bi-person-check display-1 text-muted"></i>
                  <h4 className="mt-3">No allocations found</h4>
                  <p className="text-muted">Start by allocating assets to employees</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-primary">{allocations.length}</h3>
              <p className="text-muted mb-0">Total Allocations</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success">{allocations.filter(a => a.status === 'active').length}</h3>
              <p className="text-muted mb-0">Active Allocations</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-secondary">{allocations.filter(a => a.status === 'returned').length}</h3>
              <p className="text-muted mb-0">Returned Assets</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-info">{availableAssets.length}</h3>
              <p className="text-muted mb-0">Available Assets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;