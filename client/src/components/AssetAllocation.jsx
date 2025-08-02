import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { UserCheck, Package, Calendar, Search, Filter, Undo } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
const AssetAllocation = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [allocations, setAllocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const [newAllocation, setNewAllocation] = useState({
    assetId: '',
    employeeEmail: '',
    expectedReturn: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockAllocations = [{
      id: 1,
      asset_name: 'Dell Laptop XPS 13',
      asset_id: 1,
      employee_name: 'John Doe',
      employee_email: 'john.doe@company.com',
      department: 'Engineering',
      allocated_date: '2024-01-10',
      expected_return: '2024-07-10',
      status: 'active',
      location: 'Home Office'
    }, {
      id: 2,
      asset_name: 'MacBook Pro 16"',
      asset_id: 5,
      employee_name: 'Jane Smith',
      employee_email: 'jane.smith@company.com',
      department: 'Design',
      allocated_date: '2024-01-05',
      expected_return: '2024-06-05',
      status: 'active',
      location: 'Office - Floor 2'
    }, {
      id: 3,
      asset_name: 'Office Chair Ergonomic',
      asset_id: 2,
      employee_name: 'Mike Johnson',
      employee_email: 'mike.johnson@company.com',
      department: 'Sales',
      allocated_date: '2023-12-15',
      expected_return: '2024-01-15',
      status: 'overdue',
      location: 'Office - Floor 1'
    }, {
      id: 4,
      asset_name: 'HP Printer LaserJet',
      asset_id: 3,
      employee_name: 'Sarah Wilson',
      employee_email: 'sarah.wilson@company.com',
      department: 'HR',
      allocated_date: '2023-11-20',
      expected_return: '2024-01-01',
      status: 'returned',
      location: 'Returned to Storage'
    }];
    setTimeout(() => {
      setAllocations(mockAllocations);
      setIsLoading(false);
    }, 1000);
  }, []);
  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = allocation.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) || allocation.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) || allocation.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || allocation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const getStatusBadge = status => {
    switch (status) {
      case 'active':
        return /*#__PURE__*/React.createElement(Badge, {
          className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        }, "Active");
      case 'returned':
        return /*#__PURE__*/React.createElement(Badge, {
          className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }, "Returned");
      case 'overdue':
        return /*#__PURE__*/React.createElement(Badge, {
          className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        }, "Overdue");
      default:
        return /*#__PURE__*/React.createElement(Badge, {
          variant: "secondary"
        }, "Unknown");
    }
  };
  const handleNewAllocation = async () => {
    if (!newAllocation.assetId || !newAllocation.employeeEmail) {
      toast({
        title: "Error",
        description: "Please select both an asset and an employee.",
        variant: "destructive"
      });
      return;
    }
    setIsAllocating(true);

    // Mock API call
    setTimeout(() => {
      const allocation = {
        id: allocations.length + 1,
        asset_name: 'New Asset',
        asset_id: parseInt(newAllocation.assetId),
        employee_name: 'New Employee',
        employee_email: newAllocation.employeeEmail,
        department: 'Various',
        allocated_date: new Date().toISOString().split('T')[0],
        expected_return: newAllocation.expectedReturn,
        status: 'active',
        location: 'To be determined'
      };
      setAllocations([allocation, ...allocations]);
      setNewAllocation({
        assetId: '',
        employeeEmail: '',
        expectedReturn: ''
      });
      setIsAllocating(false);
      toast({
        title: "Asset Allocated",
        description: "Asset has been successfully allocated to the employee."
      });
    }, 1500);
  };
  const handleReturnAsset = allocationId => {
    setAllocations(allocations.map(allocation => allocation.id === allocationId ? {
      ...allocation,
      status: 'returned',
      location: 'Returned to Storage'
    } : allocation));
    toast({
      title: "Asset Returned",
      description: "Asset has been marked as returned."
    });
  };
  const canManageAllocations = user?.role === 'Admin' || user?.role === 'Procurement';
  if (!canManageAllocations) {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-6 text-center"
    }, /*#__PURE__*/React.createElement(UserCheck, {
      className: "h-12 w-12 text-muted-foreground mx-auto mb-4"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-medium mb-2"
    }, "Access Restricted"), /*#__PURE__*/React.createElement("p", {
      className: "text-muted-foreground"
    }, "Only administrators and procurement managers can manage asset allocations."));
  }
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, [...Array(5)].map((_, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      className: "animate-pulse"
    }, /*#__PURE__*/React.createElement(CardContent, {
      className: "p-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-4 bg-muted rounded w-3/4 mb-2"
    }), /*#__PURE__*/React.createElement("div", {
      className: "h-3 bg-muted rounded w-1/2"
    }))))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold"
  }, "Asset Allocations"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, "Manage asset assignments to employees")), /*#__PURE__*/React.createElement(Dialog, null, /*#__PURE__*/React.createElement(DialogTrigger, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Button, {
    className: "bg-gradient-primary hover:opacity-90"
  }, /*#__PURE__*/React.createElement(UserCheck, {
    className: "h-4 w-4 mr-2"
  }), "New Allocation")), /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Allocate Asset"), /*#__PURE__*/React.createElement(DialogDescription, null, "Assign an asset to an employee for use.")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium"
  }, "Select Asset"), /*#__PURE__*/React.createElement(Select, {
    value: newAllocation.assetId,
    onValueChange: value => setNewAllocation({
      ...newAllocation,
      assetId: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Choose an available asset"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "1"
  }, "Dell Laptop XPS 13 - Available"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "4"
  }, "Standing Desk - Available"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "6"
  }, "iPad Pro - Available")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium"
  }, "Select Employee"), /*#__PURE__*/React.createElement(Select, {
    value: newAllocation.employeeEmail,
    onValueChange: value => setNewAllocation({
      ...newAllocation,
      employeeEmail: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Choose an employee"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "alice.brown@company.com"
  }, "Alice Brown - Marketing"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "bob.wilson@company.com"
  }, "Bob Wilson - Engineering"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "carol.davis@company.com"
  }, "Carol Davis - Finance")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium"
  }, "Expected Return Date (Optional)"), /*#__PURE__*/React.createElement(Input, {
    type: "date",
    value: newAllocation.expectedReturn,
    onChange: e => setNewAllocation({
      ...newAllocation,
      expectedReturn: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: handleNewAllocation,
    disabled: isAllocating,
    className: "w-full"
  }, isAllocating ? 'Allocating...' : 'Allocate Asset'))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium text-muted-foreground"
  }, "Active Allocations"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold"
  }, allocations.filter(a => a.status === 'active').length)), /*#__PURE__*/React.createElement(Package, {
    className: "h-8 w-8 text-primary"
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium text-muted-foreground"
  }, "Overdue Returns"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold text-red-600"
  }, allocations.filter(a => a.status === 'overdue').length)), /*#__PURE__*/React.createElement(Calendar, {
    className: "h-8 w-8 text-red-500"
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium text-muted-foreground"
  }, "Total Returned"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold"
  }, allocations.filter(a => a.status === 'returned').length)), /*#__PURE__*/React.createElement(Undo, {
    className: "h-8 w-8 text-green-500"
  }))))), /*#__PURE__*/React.createElement(Card, {
    className: "shadow-soft"
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1"
  }, /*#__PURE__*/React.createElement(Search, {
    className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search allocations...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    className: "pl-10"
  })), /*#__PURE__*/React.createElement(Select, {
    value: statusFilter,
    onValueChange: setStatusFilter
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "w-[180px]"
  }, /*#__PURE__*/React.createElement(Filter, {
    className: "h-4 w-4 mr-2"
  }), /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Filter by status"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "all"
  }, "All Status"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "active"
  }, "Active"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "returned"
  }, "Returned"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "overdue"
  }, "Overdue")))))), /*#__PURE__*/React.createElement(Card, {
    className: "shadow-soft"
  }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(UserCheck, {
    className: "h-5 w-5"
  }), "Current Allocations (", filteredAllocations.length, ")")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableHead, null, "Asset"), /*#__PURE__*/React.createElement(TableHead, null, "Employee"), /*#__PURE__*/React.createElement(TableHead, null, "Department"), /*#__PURE__*/React.createElement(TableHead, null, "Allocated Date"), /*#__PURE__*/React.createElement(TableHead, null, "Expected Return"), /*#__PURE__*/React.createElement(TableHead, null, "Status"), /*#__PURE__*/React.createElement(TableHead, null, "Actions"))), /*#__PURE__*/React.createElement(TableBody, null, filteredAllocations.map(allocation => /*#__PURE__*/React.createElement(TableRow, {
    key: allocation.id
  }, /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Package, {
    className: "h-4 w-4 text-primary"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, allocation.asset_name), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-muted-foreground"
  }, "ID: ", allocation.asset_id)))), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "h-8 w-8"
  }, /*#__PURE__*/React.createElement(AvatarFallback, null, allocation.employee_name.split(' ').map(n => n[0]).join(''))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, allocation.employee_name), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-muted-foreground"
  }, allocation.employee_email)))), /*#__PURE__*/React.createElement(TableCell, null, allocation.department), /*#__PURE__*/React.createElement(TableCell, null, new Date(allocation.allocated_date).toLocaleDateString()), /*#__PURE__*/React.createElement(TableCell, null, allocation.expected_return ? new Date(allocation.expected_return).toLocaleDateString() : 'Not specified'), /*#__PURE__*/React.createElement(TableCell, null, getStatusBadge(allocation.status)), /*#__PURE__*/React.createElement(TableCell, null, allocation.status === 'active' && /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => handleReturnAsset(allocation.id)
  }, /*#__PURE__*/React.createElement(Undo, {
    className: "h-3 w-3 mr-1"
  }), "Return")))))))), filteredAllocations.length === 0 && /*#__PURE__*/React.createElement(Card, {
    className: "shadow-soft"
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-12 text-center"
  }, /*#__PURE__*/React.createElement(UserCheck, {
    className: "h-12 w-12 text-muted-foreground mx-auto mb-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-medium mb-2"
  }, "No allocations found"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Get started by making your first asset allocation.'))));
};
export default AssetAllocation;
