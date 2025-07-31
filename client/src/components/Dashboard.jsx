import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    allocatedAssets: 0,
    pendingRequests: 0,
    totalUsers: 0,
    recentActivity: [],
  });

  useEffect(() => {
    // You will replace this with a real fetch later
    setStats({
      totalAssets: 156,
      availableAssets: 98,
      allocatedAssets: 58,
      pendingRequests: 12,
      totalUsers: 24,
      recentActivity: [
        { id: 1, type: 'allocation', description: 'Laptop allocated to John Doe', time: '2 minutes ago' },
        { id: 2, type: 'request', description: 'New asset request for printer', time: '1 hour ago' },
        { id: 3, type: 'asset', description: 'New desktop computer added', time: '3 hours ago' },
        { id: 4, type: 'return', description: 'Monitor returned by Jane Smith', time: '5 hours ago' },
      ],
    });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      title: 'Total Assets',
      value: stats.totalAssets,
      icon: 'bi-box',
      description: 'All assets in inventory',
      color: 'text-primary',
      bgColor: 'bg-primary',
    },
    {
      title: 'Available',
      value: stats.availableAssets,
      icon: 'bi-check-circle',
      description: 'Ready for allocation',
      color: 'text-success',
      bgColor: 'bg-success',
    },
    {
      title: 'Allocated',
      value: stats.allocatedAssets,
      icon: 'bi-person-check',
      description: 'Currently in use',
      color: 'text-warning',
      bgColor: 'bg-warning',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: 'bi-exclamation-triangle',
      description: 'Awaiting approval',
      color: 'text-danger',
      bgColor: 'bg-danger',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'allocation':
        return <i className="bi bi-person-check text-primary"></i>;
      case 'request':
        return <i className="bi bi-file-text text-warning"></i>;
      case 'asset':
        return <i className="bi bi-box text-success"></i>;
      case 'return':
        return <i className="bi bi-arrow-return-left text-info"></i>;
      default:
        return <i className="bi bi-clock text-muted"></i>;
    }
  };

  return (
    <div className="p-4">
      {/* Greeting Banner */}
      <div className="bg-primary text-white rounded p-4 mb-4">
        <h1 className="h3 mb-2">
          {getGreeting()}, {user?.name || 'User'}!
        </h1>
        <p className="mb-0 opacity-75">
          Here's what's happening with your asset inventory today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="row mb-4">
        {statCards.map((stat, index) => (
          <div key={index} className="col-md-6 col-lg-3 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title text-muted">{stat.title}</h6>
                    <h2 className="mb-1">{stat.value}</h2>
                    <small className="text-muted">{stat.description}</small>
                  </div>
                  <div className={`${stat.bgColor} text-white rounded p-2`}>
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity + Quick Actions */}
      <div className="row">
        {/* Activity */}
        <div className="col-lg-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-clock me-2"></i>
                Recent Activity
              </h5>
              <small className="text-muted">Latest updates and changes in your inventory</small>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="list-group-item d-flex align-items-center">
                    <div className="me-3">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-medium">{activity.description}</p>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
              <small className="text-muted">Common tasks and shortcuts</small>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {(user?.role === 'Admin' || user?.role === 'Procurement') && (
                  <>
                    <button 
                      className="btn btn-outline-primary text-start"
                      onClick={() => navigate('/assets/add')}
                    >
                      <i className="bi bi-box me-2"></i>
                      Add New Asset
                    </button>
                    <button 
                      className="btn btn-outline-primary text-start"
                      onClick={() => navigate('/allocation')}
                    >
                      <i className="bi bi-person-check me-2"></i>
                      Allocate Asset
                    </button>
                  </>
                )}
                <button 
                  className="btn btn-outline-primary text-start"
                  onClick={() => navigate('/requests')}
                >
                  <i className="bi bi-file-text me-2"></i>
                  {user?.role === 'Employee' ? 'Submit New Request' : 'View All Requests'}
                </button>
                <button 
                  className="btn btn-outline-primary text-start"
                  onClick={() => navigate('/assets')}
                >
                  <i className="bi bi-graph-up me-2"></i>
                  View Asset Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
