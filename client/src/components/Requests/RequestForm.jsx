import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRequest } from '../../store/slices/requestsSlice';

const RequestForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.requests);
  
  const [formData, setFormData] = useState({
    asset_name: '',
    type: 'New Asset',
    reason: '',
    urgency: 'medium',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.asset_name.trim()) {
      newErrors.asset_name = 'Asset name is required';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await dispatch(createRequest(formData)).unwrap();
      onClose?.();
      // Reset form
      setFormData({
        asset_name: '',
        type: 'New Asset',
        reason: '',
        urgency: 'medium',
      });
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="asset_name" className="block text-sm font-medium text-gray-700 mb-2">
          Asset Name *
        </label>
        <input
          type="text"
          id="asset_name"
          name="asset_name"
          value={formData.asset_name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.asset_name ? 'border-error-300' : 'border-gray-300'
          }`}
          placeholder="e.g., MacBook Pro, Office Chair, Monitor"
        />
        {errors.asset_name && (
          <p className="mt-1 text-sm text-error-600">{errors.asset_name}</p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Request Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="New Asset">New Asset</option>
          <option value="Repair">Repair</option>
        </select>
      </div>

      <div>
        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
          Urgency Level
        </label>
        <select
          id="urgency"
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
          Reason/Justification *
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.reason ? 'border-error-300' : 'border-gray-300'
          }`}
          placeholder="Please explain why you need this asset or repair..."
        />
        {errors.reason && (
          <p className="mt-1 text-sm text-error-600">{errors.reason}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default RequestForm;