import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
const RequestsTable = () => {
  const {
    user
  } = useSelector((state) => state.auth);
  const {
    toast
  } = useToast();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Fetch requests from API
  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken') || user?.token;

      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        } else if (response.status === 403) {
          throw new Error('Forbidden: You do not have permission to view requests');
        } else if (response.status === 404) {
          throw new Error('Requests endpoint not found');
        } else {
          throw new Error(`Failed to fetch requests: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();

      // Validate response structure
      if (!Array.isArray(data.requests) && !Array.isArray(data)) {
        throw new Error('Invalid response format: Expected array of requests');
      }

      const requestsArray = data.requests || data;
      setRequests(requestsArray);
      setFilteredRequests(requestsArray);

    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update request status via API
  const handleStatusUpdate = async (requestId, newStatus) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken') || user?.token;

      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        } else if (response.status === 403) {
          throw new Error('Forbidden: You do not have permission to update requests');
        } else if (response.status === 404) {
          throw new Error('Request not found');
        } else {
          throw new Error(`Failed to update request: ${response.status} ${response.statusText}`);
        }
      }

      const updatedRequest = await response.json();

      // Update local state
      setRequests(prev => prev.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      ));

      toast({
        title: "Status updated",
        description: `Request has been ${newStatus}`,
        variant: "default"
      });

    } catch (err) {
      console.error('Error updating request status:', err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, []);

  // Filter requests based on search and filter criteria
  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.asset_name?.toLowerCase().includes(searchLower) ||
        req.user?.name?.toLowerCase().includes(searchLower) ||
        req.user?.email?.toLowerCase().includes(searchLower) ||
        req.reason?.toLowerCase().includes(searchLower) ||
        req.type?.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(req => req.urgency === urgencyFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, urgencyFilter, requests]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        variant: 'outline',
        icon: Clock,
        color: 'text-yellow-600'
      },
      approved: {
        variant: 'default',
        icon: CheckCircle,
        color: 'text-green-600'
      },
      rejected: {
        variant: 'destructive',
        icon: XCircle,
        color: 'text-red-600'
      },
      fulfilled: {
        variant: 'secondary',
        icon: CheckCircle,
        color: 'text-blue-600'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
      <Badge className={urgencyConfig[urgency] || urgencyConfig.medium}>
        {urgency === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
        {urgency?.charAt(0).toUpperCase() + urgency?.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const canModifyRequests = user?.role === 'Admin' || user?.role === 'Procurement';
  if (isLoading && requests.length === 0) {
    return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
      className: "flex items-center justify-center h-64"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-muted-foreground"
    }, "Loading requests..."))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Filter, {
    className: "h-5 w-5"
  }), "Asset Requests"), /*#__PURE__*/React.createElement(CardDescription, null, "Manage and track asset requests across the organization")), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-muted-foreground"
  }, "Total: ", filteredRequests.length, " requests"))), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-4 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1"
  }, /*#__PURE__*/React.createElement(Search, {
    className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search by asset name, user, or reason...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    className: "pl-10"
  })), /*#__PURE__*/React.createElement(Select, {
    value: statusFilter,
    onValueChange: setStatusFilter
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "w-full sm:w-40"
  }, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Status"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "all"
  }, "All Statuses"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "pending"
  }, "Pending"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "approved"
  }, "Approved"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "rejected"
  }, "Rejected"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "fulfilled"
  }, "Fulfilled"))), /*#__PURE__*/React.createElement(Select, {
    value: urgencyFilter,
    onValueChange: setUrgencyFilter
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "w-full sm:w-40"
  }, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Urgency"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "all"
  }, "All Urgencies"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "high"
  }, "High"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "medium"
  }, "Medium"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "low"
  }, "Low")))), /*#__PURE__*/React.createElement("div", {
    className: "border rounded-lg"
  }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableHead, null, "Asset Name"), /*#__PURE__*/React.createElement(TableHead, null, "Type"), /*#__PURE__*/React.createElement(TableHead, null, "Requested By"), /*#__PURE__*/React.createElement(TableHead, null, "Urgency"), /*#__PURE__*/React.createElement(TableHead, null, "Status"), /*#__PURE__*/React.createElement(TableHead, null, "Date"), canModifyRequests && /*#__PURE__*/React.createElement(TableHead, null, "Actions"))), /*#__PURE__*/React.createElement(TableBody, null, filteredRequests.length === 0 ? /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    colSpan: canModifyRequests ? 7 : 6,
    className: "text-center py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted-foreground"
  }, /*#__PURE__*/React.createElement(Filter, {
    className: "h-8 w-8 mx-auto mb-2 opacity-50"
  }), "No requests found matching your criteria"))) : filteredRequests.map(request => /*#__PURE__*/React.createElement(TableRow, {
    key: request.id
  }, /*#__PURE__*/React.createElement(TableCell, {
    className: "font-medium"
  }, request.asset_name), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, request.type)), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, request.user?.name), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-muted-foreground"
  }, request.user?.email))), /*#__PURE__*/React.createElement(TableCell, null, getUrgencyBadge(request.urgency)), /*#__PURE__*/React.createElement(TableCell, null, getStatusBadge(request.status)), /*#__PURE__*/React.createElement(TableCell, null, new Date(request.requested_at).toLocaleDateString()), canModifyRequests && /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, request.status === 'pending' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => handleStatusUpdate(request.id, 'approved'),
    disabled: isLoading
  }, "Approve"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => handleStatusUpdate(request.id, 'rejected'),
    disabled: isLoading
  }, "Reject")), request.status === 'approved' && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => handleStatusUpdate(request.id, 'fulfilled'),
    disabled: isLoading
  }, "Mark Fulfilled")))))))))));
};
export default RequestsTable;
