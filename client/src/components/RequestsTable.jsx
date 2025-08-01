import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  } = useAuth();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlQXV0aCIsIkJ1dHRvbiIsIkJhZGdlIiwiSW5wdXQiLCJTZWxlY3QiLCJTZWxlY3RDb250ZW50IiwiU2VsZWN0SXRlbSIsIlNlbGVjdFRyaWdnZXIiLCJTZWxlY3RWYWx1ZSIsIlRhYmxlIiwiVGFibGVCb2R5IiwiVGFibGVDZWxsIiwiVGFibGVIZWFkIiwiVGFibGVIZWFkZXIiLCJUYWJsZVJvdyIsIkNhcmQiLCJDYXJkQ29udGVudCIsIkNhcmREZXNjcmlwdGlvbiIsIkNhcmRIZWFkZXIiLCJDYXJkVGl0bGUiLCJTZWFyY2giLCJGaWx0ZXIiLCJDaGVja0NpcmNsZSIsIlhDaXJjbGUiLCJDbG9jayIsIkFsZXJ0VHJpYW5nbGUiLCJ1c2VUb2FzdCIsIlJlcXVlc3RzVGFibGUiLCJ1c2VyIiwidG9hc3QiLCJyZXF1ZXN0cyIsInNldFJlcXVlc3RzIiwiZmlsdGVyZWRSZXF1ZXN0cyIsInNldEZpbHRlcmVkUmVxdWVzdHMiLCJzZWFyY2hUZXJtIiwic2V0U2VhcmNoVGVybSIsInN0YXR1c0ZpbHRlciIsInNldFN0YXR1c0ZpbHRlciIsInVyZ2VuY3lGaWx0ZXIiLCJzZXRVcmdlbmN5RmlsdGVyIiwiaXNMb2FkaW5nIiwic2V0SXNMb2FkaW5nIiwibW9ja1JlcXVlc3RzIiwiaWQiLCJ1c2VyX2lkIiwiYXNzZXRfbmFtZSIsInR5cGUiLCJyZWFzb24iLCJ1cmdlbmN5Iiwic3RhdHVzIiwicmVxdWVzdGVkX2F0IiwibmFtZSIsImVtYWlsIiwic2V0VGltZW91dCIsImZpbHRlcmVkIiwiZmlsdGVyIiwicmVxIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImdldFN0YXR1c0JhZGdlIiwic3RhdHVzQ29uZmlnIiwicGVuZGluZyIsInZhcmlhbnQiLCJpY29uIiwiY29sb3IiLCJhcHByb3ZlZCIsInJlamVjdGVkIiwiZnVsZmlsbGVkIiwiY29uZmlnIiwiSWNvbiIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJnZXRVcmdlbmN5QmFkZ2UiLCJ1cmdlbmN5Q29uZmlnIiwibG93IiwibWVkaXVtIiwiaGlnaCIsImhhbmRsZVN0YXR1c1VwZGF0ZSIsInJlcXVlc3RJZCIsIm5ld1N0YXR1cyIsInByZXYiLCJtYXAiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwiY2FuTW9kaWZ5UmVxdWVzdHMiLCJyb2xlIiwibGVuZ3RoIiwicGxhY2Vob2xkZXIiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwiZSIsInRhcmdldCIsIm9uVmFsdWVDaGFuZ2UiLCJjb2xTcGFuIiwicmVxdWVzdCIsImtleSIsIkRhdGUiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJGcmFnbWVudCIsInNpemUiLCJvbkNsaWNrIiwiZGlzYWJsZWQiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9SZXF1ZXN0c1RhYmxlLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUF1dGggfSBmcm9tICdAL2NvbnRleHRzL0F1dGhDb250ZXh0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJ0AvY29tcG9uZW50cy91aS9idXR0b24nO1xuaW1wb3J0IHsgQmFkZ2UgfSBmcm9tICdAL2NvbXBvbmVudHMvdWkvYmFkZ2UnO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tICdAL2NvbXBvbmVudHMvdWkvaW5wdXQnO1xuaW1wb3J0IHsgU2VsZWN0LCBTZWxlY3RDb250ZW50LCBTZWxlY3RJdGVtLCBTZWxlY3RUcmlnZ2VyLCBTZWxlY3RWYWx1ZSB9IGZyb20gJ0AvY29tcG9uZW50cy91aS9zZWxlY3QnO1xuaW1wb3J0IHsgVGFibGUsIFRhYmxlQm9keSwgVGFibGVDZWxsLCBUYWJsZUhlYWQsIFRhYmxlSGVhZGVyLCBUYWJsZVJvdyB9IGZyb20gJ0AvY29tcG9uZW50cy91aS90YWJsZSc7XG5pbXBvcnQgeyBDYXJkLCBDYXJkQ29udGVudCwgQ2FyZERlc2NyaXB0aW9uLCBDYXJkSGVhZGVyLCBDYXJkVGl0bGUgfSBmcm9tICdAL2NvbXBvbmVudHMvdWkvY2FyZCc7XG5pbXBvcnQgeyBTZWFyY2gsIEZpbHRlciwgQ2hlY2tDaXJjbGUsIFhDaXJjbGUsIENsb2NrLCBBbGVydFRyaWFuZ2xlIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcbmltcG9ydCB7IHVzZVRvYXN0IH0gZnJvbSAnQC9ob29rcy91c2UtdG9hc3QnO1xuXG5pbnRlcmZhY2UgUmVxdWVzdCB7XG4gIGlkOiBudW1iZXI7XG4gIHVzZXJfaWQ6IG51bWJlcjtcbiAgYXNzZXRfbmFtZTogc3RyaW5nO1xuICB0eXBlOiAnTmV3IEFzc2V0JyB8ICdSZXBhaXInO1xuICByZWFzb246IHN0cmluZztcbiAgdXJnZW5jeTogJ2xvdycgfCAnbWVkaXVtJyB8ICdoaWdoJztcbiAgc3RhdHVzOiAncGVuZGluZycgfCAnYXBwcm92ZWQnIHwgJ3JlamVjdGVkJyB8ICdmdWxmaWxsZWQnO1xuICByZXF1ZXN0ZWRfYXQ6IHN0cmluZztcbiAgdXNlcj86IHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZW1haWw6IHN0cmluZztcbiAgfTtcbn1cblxuY29uc3QgUmVxdWVzdHNUYWJsZTogUmVhY3QuRkMgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdXNlciB9ID0gdXNlQXV0aCgpO1xuICBjb25zdCB7IHRvYXN0IH0gPSB1c2VUb2FzdCgpO1xuICBjb25zdCBbcmVxdWVzdHMsIHNldFJlcXVlc3RzXSA9IHVzZVN0YXRlPFJlcXVlc3RbXT4oW10pO1xuICBjb25zdCBbZmlsdGVyZWRSZXF1ZXN0cywgc2V0RmlsdGVyZWRSZXF1ZXN0c10gPSB1c2VTdGF0ZTxSZXF1ZXN0W10+KFtdKTtcbiAgY29uc3QgW3NlYXJjaFRlcm0sIHNldFNlYXJjaFRlcm1dID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbc3RhdHVzRmlsdGVyLCBzZXRTdGF0dXNGaWx0ZXJdID0gdXNlU3RhdGU8c3RyaW5nPignYWxsJyk7XG4gIGNvbnN0IFt1cmdlbmN5RmlsdGVyLCBzZXRVcmdlbmN5RmlsdGVyXSA9IHVzZVN0YXRlPHN0cmluZz4oJ2FsbCcpO1xuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIC8vIE1vY2sgZGF0YSBmb3IgZGVtb1xuICBjb25zdCBtb2NrUmVxdWVzdHM6IFJlcXVlc3RbXSA9IFtcbiAgICB7XG4gICAgICBpZDogMSxcbiAgICAgIHVzZXJfaWQ6IDMsXG4gICAgICBhc3NldF9uYW1lOiAnTWFjQm9vayBQcm8gTTMnLFxuICAgICAgdHlwZTogJ05ldyBBc3NldCcsXG4gICAgICByZWFzb246ICdOZWVkIGZvciBkZXZlbG9wbWVudCB3b3JrJyxcbiAgICAgIHVyZ2VuY3k6ICdoaWdoJyxcbiAgICAgIHN0YXR1czogJ3BlbmRpbmcnLFxuICAgICAgcmVxdWVzdGVkX2F0OiAnMjAyNC0wMS0xNVQxMDozMDowMFonLFxuICAgICAgdXNlcjogeyBuYW1lOiAnSm9obiBEb2UnLCBlbWFpbDogJ2pvaG5AZXhhbXBsZS5jb20nIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAyLFxuICAgICAgdXNlcl9pZDogNCxcbiAgICAgIGFzc2V0X25hbWU6ICdPZmZpY2UgQ2hhaXInLFxuICAgICAgdHlwZTogJ1JlcGFpcicsXG4gICAgICByZWFzb246ICdIeWRyYXVsaWMgc3lzdGVtIG5vdCB3b3JraW5nJyxcbiAgICAgIHVyZ2VuY3k6ICdtZWRpdW0nLFxuICAgICAgc3RhdHVzOiAnYXBwcm92ZWQnLFxuICAgICAgcmVxdWVzdGVkX2F0OiAnMjAyNC0wMS0xNFQwOToxNTowMFonLFxuICAgICAgdXNlcjogeyBuYW1lOiAnSmFuZSBTbWl0aCcsIGVtYWlsOiAnamFuZUBleGFtcGxlLmNvbScgfVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDMsXG4gICAgICB1c2VyX2lkOiA1LFxuICAgICAgYXNzZXRfbmFtZTogJ0Rlc2t0b3AgTW9uaXRvciA0SycsXG4gICAgICB0eXBlOiAnTmV3IEFzc2V0JyxcbiAgICAgIHJlYXNvbjogJ0N1cnJlbnQgbW9uaXRvciByZXNvbHV0aW9uIHRvbyBsb3cnLFxuICAgICAgdXJnZW5jeTogJ2xvdycsXG4gICAgICBzdGF0dXM6ICdmdWxmaWxsZWQnLFxuICAgICAgcmVxdWVzdGVkX2F0OiAnMjAyNC0wMS0xM1QxNDoyMDowMFonLFxuICAgICAgdXNlcjogeyBuYW1lOiAnTWlrZSBKb2huc29uJywgZW1haWw6ICdtaWtlQGV4YW1wbGUuY29tJyB9XG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogNCxcbiAgICAgIHVzZXJfaWQ6IDYsXG4gICAgICBhc3NldF9uYW1lOiAnUHJpbnRlciBIUCBMYXNlckpldCcsXG4gICAgICB0eXBlOiAnUmVwYWlyJyxcbiAgICAgIHJlYXNvbjogJ1BhcGVyIGphbSBpc3N1ZSByZWN1cnJpbmcnLFxuICAgICAgdXJnZW5jeTogJ21lZGl1bScsXG4gICAgICBzdGF0dXM6ICdyZWplY3RlZCcsXG4gICAgICByZXF1ZXN0ZWRfYXQ6ICcyMDI0LTAxLTEyVDExOjQ1OjAwWicsXG4gICAgICB1c2VyOiB7IG5hbWU6ICdTYXJhaCBXaWxzb24nLCBlbWFpbDogJ3NhcmFoQGV4YW1wbGUuY29tJyB9XG4gICAgfVxuICBdO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gU2ltdWxhdGUgQVBJIGNhbGxcbiAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRSZXF1ZXN0cyhtb2NrUmVxdWVzdHMpO1xuICAgICAgc2V0RmlsdGVyZWRSZXF1ZXN0cyhtb2NrUmVxdWVzdHMpO1xuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICB9LCAxMDAwKTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGZpbHRlcmVkID0gcmVxdWVzdHM7XG5cbiAgICBpZiAoc2VhcmNoVGVybSkge1xuICAgICAgZmlsdGVyZWQgPSBmaWx0ZXJlZC5maWx0ZXIoXG4gICAgICAgIHJlcSA9PiBcbiAgICAgICAgICByZXEuYXNzZXRfbmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgICByZXEudXNlcj8ubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgICByZXEucmVhc29uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdHVzRmlsdGVyICE9PSAnYWxsJykge1xuICAgICAgZmlsdGVyZWQgPSBmaWx0ZXJlZC5maWx0ZXIocmVxID0+IHJlcS5zdGF0dXMgPT09IHN0YXR1c0ZpbHRlcik7XG4gICAgfVxuXG4gICAgaWYgKHVyZ2VuY3lGaWx0ZXIgIT09ICdhbGwnKSB7XG4gICAgICBmaWx0ZXJlZCA9IGZpbHRlcmVkLmZpbHRlcihyZXEgPT4gcmVxLnVyZ2VuY3kgPT09IHVyZ2VuY3lGaWx0ZXIpO1xuICAgIH1cblxuICAgIHNldEZpbHRlcmVkUmVxdWVzdHMoZmlsdGVyZWQpO1xuICB9LCBbc2VhcmNoVGVybSwgc3RhdHVzRmlsdGVyLCB1cmdlbmN5RmlsdGVyLCByZXF1ZXN0c10pO1xuXG4gIGNvbnN0IGdldFN0YXR1c0JhZGdlID0gKHN0YXR1czogc3RyaW5nKSA9PiB7XG4gICAgY29uc3Qgc3RhdHVzQ29uZmlnID0ge1xuICAgICAgcGVuZGluZzogeyB2YXJpYW50OiAnb3V0bGluZScgYXMgY29uc3QsIGljb246IENsb2NrLCBjb2xvcjogJ3RleHQteWVsbG93LTYwMCcgfSxcbiAgICAgIGFwcHJvdmVkOiB7IHZhcmlhbnQ6ICdkZWZhdWx0JyBhcyBjb25zdCwgaWNvbjogQ2hlY2tDaXJjbGUsIGNvbG9yOiAndGV4dC1ncmVlbi02MDAnIH0sXG4gICAgICByZWplY3RlZDogeyB2YXJpYW50OiAnZGVzdHJ1Y3RpdmUnIGFzIGNvbnN0LCBpY29uOiBYQ2lyY2xlLCBjb2xvcjogJ3RleHQtcmVkLTYwMCcgfSxcbiAgICAgIGZ1bGZpbGxlZDogeyB2YXJpYW50OiAnc2Vjb25kYXJ5JyBhcyBjb25zdCwgaWNvbjogQ2hlY2tDaXJjbGUsIGNvbG9yOiAndGV4dC1ibHVlLTYwMCcgfVxuICAgIH07XG4gICAgXG4gICAgY29uc3QgY29uZmlnID0gc3RhdHVzQ29uZmlnW3N0YXR1cyBhcyBrZXlvZiB0eXBlb2Ygc3RhdHVzQ29uZmlnXTtcbiAgICBjb25zdCBJY29uID0gY29uZmlnLmljb247XG4gICAgXG4gICAgcmV0dXJuIChcbiAgICAgIDxCYWRnZSB2YXJpYW50PXtjb25maWcudmFyaWFudH0gY2xhc3NOYW1lPVwiZ2FwLTFcIj5cbiAgICAgICAgPEljb24gY2xhc3NOYW1lPVwiaC0zIHctM1wiIC8+XG4gICAgICAgIHtzdGF0dXN9XG4gICAgICA8L0JhZGdlPlxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZ2V0VXJnZW5jeUJhZGdlID0gKHVyZ2VuY3k6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHVyZ2VuY3lDb25maWcgPSB7XG4gICAgICBsb3c6ICdiZy1ncmVlbi0xMDAgdGV4dC1ncmVlbi04MDAgZGFyazpiZy1ncmVlbi05MDAgZGFyazp0ZXh0LWdyZWVuLTMwMCcsXG4gICAgICBtZWRpdW06ICdiZy15ZWxsb3ctMTAwIHRleHQteWVsbG93LTgwMCBkYXJrOmJnLXllbGxvdy05MDAgZGFyazp0ZXh0LXllbGxvdy0zMDAnLFxuICAgICAgaGlnaDogJ2JnLXJlZC0xMDAgdGV4dC1yZWQtODAwIGRhcms6YmctcmVkLTkwMCBkYXJrOnRleHQtcmVkLTMwMCdcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiAoXG4gICAgICA8QmFkZ2UgY2xhc3NOYW1lPXt1cmdlbmN5Q29uZmlnW3VyZ2VuY3kgYXMga2V5b2YgdHlwZW9mIHVyZ2VuY3lDb25maWddfT5cbiAgICAgICAge3VyZ2VuY3kgPT09ICdoaWdoJyAmJiA8QWxlcnRUcmlhbmdsZSBjbGFzc05hbWU9XCJoLTMgdy0zIG1yLTFcIiAvPn1cbiAgICAgICAge3VyZ2VuY3l9XG4gICAgICA8L0JhZGdlPlxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlU3RhdHVzVXBkYXRlID0gYXN5bmMgKHJlcXVlc3RJZDogbnVtYmVyLCBuZXdTdGF0dXM6IHN0cmluZykgPT4ge1xuICAgIC8vIFNpbXVsYXRlIEFQSSBjYWxsXG4gICAgc2V0SXNMb2FkaW5nKHRydWUpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0UmVxdWVzdHMocHJldiA9PiBcbiAgICAgICAgcHJldi5tYXAocmVxID0+IFxuICAgICAgICAgIHJlcS5pZCA9PT0gcmVxdWVzdElkID8geyAuLi5yZXEsIHN0YXR1czogbmV3U3RhdHVzIGFzIGFueSB9IDogcmVxXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgdG9hc3Qoe1xuICAgICAgICB0aXRsZTogXCJTdGF0dXMgdXBkYXRlZFwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogYFJlcXVlc3QgaGFzIGJlZW4gJHtuZXdTdGF0dXN9YCxcbiAgICAgIH0pO1xuICAgIH0sIDUwMCk7XG4gIH07XG5cbiAgY29uc3QgY2FuTW9kaWZ5UmVxdWVzdHMgPSB1c2VyPy5yb2xlID09PSAnQWRtaW4nIHx8IHVzZXI/LnJvbGUgPT09ICdQcm9jdXJlbWVudCc7XG5cbiAgaWYgKGlzTG9hZGluZyAmJiByZXF1ZXN0cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENhcmQ+XG4gICAgICAgIDxDYXJkQ29udGVudCBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBoLTY0XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTggaC04IGJvcmRlci00IGJvcmRlci1wcmltYXJ5IGJvcmRlci10LXRyYW5zcGFyZW50IHJvdW5kZWQtZnVsbCBhbmltYXRlLXNwaW4gbXgtYXV0byBtYi00XCI+PC9kaXY+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkLWZvcmVncm91bmRcIj5Mb2FkaW5nIHJlcXVlc3RzLi4uPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0NhcmRDb250ZW50PlxuICAgICAgPC9DYXJkPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS02XCI+XG4gICAgICA8Q2FyZD5cbiAgICAgICAgPENhcmRIZWFkZXI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIHNtOmZsZXgtcm93IHNtOml0ZW1zLWNlbnRlciBzbTpqdXN0aWZ5LWJldHdlZW4gZ2FwLTRcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxDYXJkVGl0bGUgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICA8RmlsdGVyIGNsYXNzTmFtZT1cImgtNSB3LTVcIiAvPlxuICAgICAgICAgICAgICAgIEFzc2V0IFJlcXVlc3RzXG4gICAgICAgICAgICAgIDwvQ2FyZFRpdGxlPlxuICAgICAgICAgICAgICA8Q2FyZERlc2NyaXB0aW9uPlxuICAgICAgICAgICAgICAgIE1hbmFnZSBhbmQgdHJhY2sgYXNzZXQgcmVxdWVzdHMgYWNyb3NzIHRoZSBvcmdhbml6YXRpb25cbiAgICAgICAgICAgICAgPC9DYXJkRGVzY3JpcHRpb24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LW11dGVkLWZvcmVncm91bmRcIj5cbiAgICAgICAgICAgICAgVG90YWw6IHtmaWx0ZXJlZFJlcXVlc3RzLmxlbmd0aH0gcmVxdWVzdHNcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0NhcmRIZWFkZXI+XG4gICAgICAgIDxDYXJkQ29udGVudD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgc206ZmxleC1yb3cgZ2FwLTQgbWItNlwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4LTFcIj5cbiAgICAgICAgICAgICAgPFNlYXJjaCBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTMgdG9wLTMgaC00IHctNCB0ZXh0LW11dGVkLWZvcmVncm91bmRcIiAvPlxuICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBieSBhc3NldCBuYW1lLCB1c2VyLCBvciByZWFzb24uLi5cIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtzZWFyY2hUZXJtfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2VhcmNoVGVybShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicGwtMTBcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8U2VsZWN0IHZhbHVlPXtzdGF0dXNGaWx0ZXJ9IG9uVmFsdWVDaGFuZ2U9e3NldFN0YXR1c0ZpbHRlcn0+XG4gICAgICAgICAgICAgIDxTZWxlY3RUcmlnZ2VyIGNsYXNzTmFtZT1cInctZnVsbCBzbTp3LTQwXCI+XG4gICAgICAgICAgICAgICAgPFNlbGVjdFZhbHVlIHBsYWNlaG9sZGVyPVwiU3RhdHVzXCIgLz5cbiAgICAgICAgICAgICAgPC9TZWxlY3RUcmlnZ2VyPlxuICAgICAgICAgICAgICA8U2VsZWN0Q29udGVudD5cbiAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cImFsbFwiPkFsbCBTdGF0dXNlczwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cInBlbmRpbmdcIj5QZW5kaW5nPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RJdGVtIHZhbHVlPVwiYXBwcm92ZWRcIj5BcHByb3ZlZDwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cInJlamVjdGVkXCI+UmVqZWN0ZWQ8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJmdWxmaWxsZWRcIj5GdWxmaWxsZWQ8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgIDwvU2VsZWN0Q29udGVudD5cbiAgICAgICAgICAgIDwvU2VsZWN0PlxuICAgICAgICAgICAgPFNlbGVjdCB2YWx1ZT17dXJnZW5jeUZpbHRlcn0gb25WYWx1ZUNoYW5nZT17c2V0VXJnZW5jeUZpbHRlcn0+XG4gICAgICAgICAgICAgIDxTZWxlY3RUcmlnZ2VyIGNsYXNzTmFtZT1cInctZnVsbCBzbTp3LTQwXCI+XG4gICAgICAgICAgICAgICAgPFNlbGVjdFZhbHVlIHBsYWNlaG9sZGVyPVwiVXJnZW5jeVwiIC8+XG4gICAgICAgICAgICAgIDwvU2VsZWN0VHJpZ2dlcj5cbiAgICAgICAgICAgICAgPFNlbGVjdENvbnRlbnQ+XG4gICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJhbGxcIj5BbGwgVXJnZW5jaWVzPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RJdGVtIHZhbHVlPVwiaGlnaFwiPkhpZ2g8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJtZWRpdW1cIj5NZWRpdW08L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJsb3dcIj5Mb3c8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgIDwvU2VsZWN0Q29udGVudD5cbiAgICAgICAgICAgIDwvU2VsZWN0PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXIgcm91bmRlZC1sZ1wiPlxuICAgICAgICAgICAgPFRhYmxlPlxuICAgICAgICAgICAgICA8VGFibGVIZWFkZXI+XG4gICAgICAgICAgICAgICAgPFRhYmxlUm93PlxuICAgICAgICAgICAgICAgICAgPFRhYmxlSGVhZD5Bc3NldCBOYW1lPC9UYWJsZUhlYWQ+XG4gICAgICAgICAgICAgICAgICA8VGFibGVIZWFkPlR5cGU8L1RhYmxlSGVhZD5cbiAgICAgICAgICAgICAgICAgIDxUYWJsZUhlYWQ+UmVxdWVzdGVkIEJ5PC9UYWJsZUhlYWQ+XG4gICAgICAgICAgICAgICAgICA8VGFibGVIZWFkPlVyZ2VuY3k8L1RhYmxlSGVhZD5cbiAgICAgICAgICAgICAgICAgIDxUYWJsZUhlYWQ+U3RhdHVzPC9UYWJsZUhlYWQ+XG4gICAgICAgICAgICAgICAgICA8VGFibGVIZWFkPkRhdGU8L1RhYmxlSGVhZD5cbiAgICAgICAgICAgICAgICAgIHtjYW5Nb2RpZnlSZXF1ZXN0cyAmJiA8VGFibGVIZWFkPkFjdGlvbnM8L1RhYmxlSGVhZD59XG4gICAgICAgICAgICAgICAgPC9UYWJsZVJvdz5cbiAgICAgICAgICAgICAgPC9UYWJsZUhlYWRlcj5cbiAgICAgICAgICAgICAgPFRhYmxlQm9keT5cbiAgICAgICAgICAgICAgICB7ZmlsdGVyZWRSZXF1ZXN0cy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgICAgICA8VGFibGVSb3c+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZUNlbGwgY29sU3Bhbj17Y2FuTW9kaWZ5UmVxdWVzdHMgPyA3IDogNn0gY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgcHktOFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8RmlsdGVyIGNsYXNzTmFtZT1cImgtOCB3LTggbXgtYXV0byBtYi0yIG9wYWNpdHktNTBcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgTm8gcmVxdWVzdHMgZm91bmQgbWF0Y2hpbmcgeW91ciBjcml0ZXJpYVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L1RhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgIDwvVGFibGVSb3c+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIGZpbHRlcmVkUmVxdWVzdHMubWFwKChyZXF1ZXN0KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvdyBrZXk9e3JlcXVlc3QuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgIDxUYWJsZUNlbGwgY2xhc3NOYW1lPVwiZm9udC1tZWRpdW1cIj57cmVxdWVzdC5hc3NldF9uYW1lfTwvVGFibGVDZWxsPlxuICAgICAgICAgICAgICAgICAgICAgIDxUYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8QmFkZ2UgdmFyaWFudD1cIm91dGxpbmVcIj57cmVxdWVzdC50eXBlfTwvQmFkZ2U+XG4gICAgICAgICAgICAgICAgICAgICAgPC9UYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICAgICAgPFRhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9udC1tZWRpdW1cIj57cmVxdWVzdC51c2VyPy5uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+e3JlcXVlc3QudXNlcj8uZW1haWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L1RhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICAgICA8VGFibGVDZWxsPntnZXRVcmdlbmN5QmFkZ2UocmVxdWVzdC51cmdlbmN5KX08L1RhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICAgICA8VGFibGVDZWxsPntnZXRTdGF0dXNCYWRnZShyZXF1ZXN0LnN0YXR1cyl9PC9UYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICAgICAgPFRhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShyZXF1ZXN0LnJlcXVlc3RlZF9hdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICAgICAge2Nhbk1vZGlmeVJlcXVlc3RzICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyZXF1ZXN0LnN0YXR1cyA9PT0gJ3BlbmRpbmcnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJvdXRsaW5lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVTdGF0dXNVcGRhdGUocmVxdWVzdC5pZCwgJ2FwcHJvdmVkJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzTG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcHJvdmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJvdXRsaW5lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVTdGF0dXNVcGRhdGUocmVxdWVzdC5pZCwgJ3JlamVjdGVkJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzTG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3JlcXVlc3Quc3RhdHVzID09PSAnYXBwcm92ZWQnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZT1cInNtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cIm91dGxpbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVTdGF0dXNVcGRhdGUocmVxdWVzdC5pZCwgJ2Z1bGZpbGxlZCcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17aXNMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXJrIEZ1bGZpbGxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L1RhYmxlQm9keT5cbiAgICAgICAgICAgIDwvVGFibGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICA8L0NhcmQ+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZXF1ZXN0c1RhYmxlOyJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsS0FBSyxJQUFJQyxRQUFRLEVBQUVDLFNBQVMsUUFBUSxPQUFPO0FBQ2xELFNBQVNDLE9BQU8sUUFBUSx3QkFBd0I7QUFDaEQsU0FBU0MsTUFBTSxRQUFRLHdCQUF3QjtBQUMvQyxTQUFTQyxLQUFLLFFBQVEsdUJBQXVCO0FBQzdDLFNBQVNDLEtBQUssUUFBUSx1QkFBdUI7QUFDN0MsU0FBU0MsTUFBTSxFQUFFQyxhQUFhLEVBQUVDLFVBQVUsRUFBRUMsYUFBYSxFQUFFQyxXQUFXLFFBQVEsd0JBQXdCO0FBQ3RHLFNBQVNDLEtBQUssRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRUMsV0FBVyxFQUFFQyxRQUFRLFFBQVEsdUJBQXVCO0FBQ3JHLFNBQVNDLElBQUksRUFBRUMsV0FBVyxFQUFFQyxlQUFlLEVBQUVDLFVBQVUsRUFBRUMsU0FBUyxRQUFRLHNCQUFzQjtBQUNoRyxTQUFTQyxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsV0FBVyxFQUFFQyxPQUFPLEVBQUVDLEtBQUssRUFBRUMsYUFB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