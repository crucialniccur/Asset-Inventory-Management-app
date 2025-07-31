import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    assetAlerts: true,
    lowStock: true,
    requests: true
  });
  
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY'
  });

  const handleSaveNotifications = () => {
    alert('Notification preferences have been updated.');
  };

  const handleSavePreferences = () => {
    alert('Your preferences have been updated.');
  };

  const handleExportData = () => {
    alert('Your data export will be ready for download shortly.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion request submitted.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Settings</h2>
      
      {/* Profile Settings */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-person me-2"></i>
            Profile Settings
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                defaultValue={user?.name}
                readOnly
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                defaultValue={user?.email}
                readOnly
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                id="role"
                defaultValue={user?.role}
                readOnly
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="department" className="form-label">Department</label>
              <select className="form-select" id="department" defaultValue="it">
                <option value="it">Information Technology</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
                <option value="operations">Operations</option>
                <option value="procurement">Procurement</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary">
            <i className="bi bi-check-circle me-2"></i>
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-bell me-2"></i>
            Notification Settings
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="emailNotifications"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                />
                <label className="form-check-label" htmlFor="emailNotifications">
                  Email Notifications
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="pushNotifications"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                />
                <label className="form-check-label" htmlFor="pushNotifications">
                  Push Notifications
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="assetAlerts"
                  checked={notifications.assetAlerts}
                  onChange={(e) => setNotifications({...notifications, assetAlerts: e.target.checked})}
                />
                <label className="form-check-label" htmlFor="assetAlerts">
                  Asset Alerts
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="lowStock"
                  checked={notifications.lowStock}
                  onChange={(e) => setNotifications({...notifications, lowStock: e.target.checked})}
                />
                <label className="form-check-label" htmlFor="lowStock">
                  Low Stock Alerts
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="requestUpdates"
                  checked={notifications.requests}
                  onChange={(e) => setNotifications({...notifications, requests: e.target.checked})}
                />
                <label className="form-check-label" htmlFor="requestUpdates">
                  Request Updates
                </label>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSaveNotifications}>
            <i className="bi bi-check-circle me-2"></i>
            Save Notifications
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-gear me-2"></i>
            Preferences
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="language" className="form-label">Language</label>
              <select 
                className="form-select" 
                id="language"
                value={preferences.language}
                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="timezone" className="form-label">Timezone</label>
              <select 
                className="form-select" 
                id="timezone"
                value={preferences.timezone}
                onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">GMT</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="currency" className="form-label">Currency</label>
              <select 
                className="form-select" 
                id="currency"
                value={preferences.currency}
                onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="dateFormat" className="form-label">Date Format</label>
              <select 
                className="form-select" 
                id="dateFormat"
                value={preferences.dateFormat}
                onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSavePreferences}>
            <i className="bi bi-check-circle me-2"></i>
            Save Preferences
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-database me-2"></i>
            Data Management
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <button className="btn btn-outline-primary w-100" onClick={handleExportData}>
                <i className="bi bi-download me-2"></i>
                Export Data
              </button>
            </div>
            <div className="col-md-6 mb-3">
              <button className="btn btn-outline-danger w-100" onClick={handleDeleteAccount}>
                <i className="bi bi-trash me-2"></i>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;