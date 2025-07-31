import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Employee',
      department: 'IT',
      status: 'active',
      created_at: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Procurement',
      department: 'Procurement',
      status: 'active',
      created_at: '2024-01-14'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Finance',
      department: 'Finance',
      status: 'active',
      created_at: '2024-01-13'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'Employee',
      department: 'HR',
      status: 'inactive',
      created_at: '2024-01-12'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const canManageUsers = user?.role === 'Admin';

  if (!canManageUsers) {
    return (
      <div className="p-4">
        <div className="alert alert-warning" role="alert">
          You don't have permission to manage users.
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <span className="badge bg-success">Active</span>
      : <span className="badge bg-secondary">Inactive</span>;
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return <span className="badge bg-danger">Admin</span>;
      case 'Procurement':
        return <span className="badge bg-warning">Procurement</span>;
      case 'Finance':
        return <span className="badge bg-info">Finance</span>;
      case 'Employee':
        return <span className="badge bg-primary">Employee</span>;
      default:
        return <span className="badge bg-secondary">{role}</span>;
    }
  };

  const handleEditUser = (userId) => {
    alert(`Edit user ${userId} - This feature is not implemented yet.`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    }
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">User Management</h2>
          <p className="text-muted mb-0">Manage system users and their roles</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/users/add')}
        >
          <i className="bi bi-person-plus me-2"></i>
          Add User
        </button>
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Procurement">Procurement</option>
            <option value="Finance">Finance</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                          <span className="text-white small fw-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="fw-medium">{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{user.department}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>
                      <small>
                        {new Date(user.created_at).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEditUser(user.id)}
                          title="Edit User"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`bi ${user.status === 'active' ? 'bi-person-x' : 'bi-person-check'}`}></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted"></i>
              <h4 className="mt-3">No users found</h4>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-primary">{users.length}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success">{users.filter(u => u.status === 'active').length}</h3>
              <p className="text-muted mb-0">Active Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-warning">{users.filter(u => u.role === 'Admin').length}</h3>
              <p className="text-muted mb-0">Admins</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-info">{users.filter(u => u.role === 'Employee').length}</h3>
              <p className="text-muted mb-0">Employees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
