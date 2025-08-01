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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlQXV0aCIsIkNhcmQiLCJDYXJkQ29udGVudCIsIkNhcmRIZWFkZXIiLCJDYXJkVGl0bGUiLCJCdXR0b24iLCJJbnB1dCIsIkJhZGdlIiwiU2VsZWN0IiwiU2VsZWN0Q29udGVudCIsIlNlbGVjdEl0ZW0iLCJTZWxlY3RUcmlnZ2VyIiwiU2VsZWN0VmFsdWUiLCJUYWJsZSIsIlRhYmxlQm9keSIsIlRhYmxlQ2VsbCIsIlRhYmxlSGVhZCIsIlRhYmxlSGVhZGVyIiwiVGFibGVSb3ciLCJBdmF0YXIiLCJBdmF0YXJGYWxsYmFjayIsIkRpYWxvZyIsIkRpYWxvZ0NvbnRlbnQiLCJEaWFsb2dEZXNjcmlwdGlvbiIsIkRpYWxvZ0hlYWRlciIsIkRpYWxvZ1RpdGxlIiwiRGlhbG9nVHJpZ2dlciIsIlVzZXJDaGVjayIsIlBhY2thZ2UiLCJDYWxlbmRhciIsIlNlYXJjaCIsIkZpbHRlciIsIlVuZG8iLCJ1c2VUb2FzdCIsIkFzc2V0QWxsb2NhdGlvbiIsInVzZXIiLCJ0b2FzdCIsImFsbG9jYXRpb25zIiwic2V0QWxsb2NhdGlvbnMiLCJzZWFyY2hUZXJtIiwic2V0U2VhcmNoVGVybSIsInN0YXR1c0ZpbHRlciIsInNldFN0YXR1c0ZpbHRlciIsImlzTG9hZGluZyIsInNldElzTG9hZGluZyIsImlzQWxsb2NhdGluZyIsInNldElzQWxsb2NhdGluZyIsIm5ld0FsbG9jYXRpb24iLCJzZXROZXdBbGxvY2F0aW9uIiwiYXNzZXRJZCIsImVtcGxveWVlRW1haWwiLCJleHBlY3RlZFJldHVybiIsIm1vY2tBbGxvY2F0aW9ucyIsImlkIiwiYXNzZXRfbmFtZSIsImFzc2V0X2lkIiwiZW1wbG95ZWVfbmFtZSIsImVtcGxveWVlX2VtYWlsIiwiZGVwYXJ0bWVudCIsImFsbG9jYXRlZF9kYXRlIiwiZXhwZWN0ZWRfcmV0dXJuIiwic3RhdHVzIiwibG9jYXRpb24iLCJzZXRUaW1lb3V0IiwiZmlsdGVyZWRBbGxvY2F0aW9ucyIsImZpbHRlciIsImFsbG9jYXRpb24iLCJtYXRjaGVzU2VhcmNoIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsIm1hdGNoZXNTdGF0dXMiLCJnZXRTdGF0dXNCYWRnZSIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJ2YXJpYW50IiwiaGFuZGxlTmV3QWxsb2NhdGlvbiIsInRpdGxlIiwiZGVzY3JpcHRpb24iLCJsZW5ndGgiLCJwYXJzZUludCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInNwbGl0IiwiaGFuZGxlUmV0dXJuQXNzZXQiLCJhbGxvY2F0aW9uSWQiLCJtYXAiLCJjYW5NYW5hZ2VBbGxvY2F0aW9ucyIsInJvbGUiLCJBcnJheSIsIl8iLCJpIiwia2V5IiwiYXNDaGlsZCIsInZhbHVlIiwib25WYWx1ZUNoYW5nZSIsInBsYWNlaG9sZGVyIiwidHlwZSIsIm9uQ2hhbmdlIiwiZSIsInRhcmdldCIsIm9uQ2xpY2siLCJkaXNhYmxlZCIsImEiLCJuIiwiam9pbiIsInRvTG9jYWxlRGF0ZVN0cmluZyIsInNpemUiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9Bc3NldEFsbG9jYXRpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlQXV0aCB9IGZyb20gJ0AvY29udGV4dHMvQXV0aENvbnRleHQnO1xuaW1wb3J0IHsgQ2FyZCwgQ2FyZENvbnRlbnQsIENhcmREZXNjcmlwdGlvbiwgQ2FyZEhlYWRlciwgQ2FyZFRpdGxlIH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL2NhcmQnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL2J1dHRvbic7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gJ0AvY29tcG9uZW50cy91aS9pbnB1dCc7XG5pbXBvcnQgeyBCYWRnZSB9IGZyb20gJ0AvY29tcG9uZW50cy91aS9iYWRnZSc7XG5pbXBvcnQgeyBTZWxlY3QsIFNlbGVjdENvbnRlbnQsIFNlbGVjdEl0ZW0sIFNlbGVjdFRyaWdnZXIsIFNlbGVjdFZhbHVlIH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL3NlbGVjdCc7XG5pbXBvcnQgeyBUYWJsZSwgVGFibGVCb2R5LCBUYWJsZUNlbGwsIFRhYmxlSGVhZCwgVGFibGVIZWFkZXIsIFRhYmxlUm93IH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL3RhYmxlJztcbmltcG9ydCB7IEF2YXRhciwgQXZhdGFyRmFsbGJhY2ssIEF2YXRhckltYWdlIH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL2F2YXRhcic7XG5pbXBvcnQgeyBEaWFsb2csIERpYWxvZ0NvbnRlbnQsIERpYWxvZ0Rlc2NyaXB0aW9uLCBEaWFsb2dIZWFkZXIsIERpYWxvZ1RpdGxlLCBEaWFsb2dUcmlnZ2VyIH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL2RpYWxvZyc7XG5pbXBvcnQgeyBVc2VyQ2hlY2ssIFBhY2thZ2UsIFVzZXJzLCBDYWxlbmRhciwgTWFwUGluLCBTZWFyY2gsIEZpbHRlciwgQXJyb3dSaWdodCwgVW5kbyB9IGZyb20gJ2x1Y2lkZS1yZWFjdCc7XG5pbXBvcnQgeyB1c2VUb2FzdCB9IGZyb20gJ0AvaG9va3MvdXNlLXRvYXN0JztcblxuaW50ZXJmYWNlIEFsbG9jYXRpb24ge1xuICBpZDogbnVtYmVyO1xuICBhc3NldF9uYW1lOiBzdHJpbmc7XG4gIGFzc2V0X2lkOiBudW1iZXI7XG4gIGVtcGxveWVlX25hbWU6IHN0cmluZztcbiAgZW1wbG95ZWVfZW1haWw6IHN0cmluZztcbiAgZGVwYXJ0bWVudDogc3RyaW5nO1xuICBhbGxvY2F0ZWRfZGF0ZTogc3RyaW5nO1xuICBleHBlY3RlZF9yZXR1cm4/OiBzdHJpbmc7XG4gIHN0YXR1czogJ2FjdGl2ZScgfCAncmV0dXJuZWQnIHwgJ292ZXJkdWUnO1xuICBsb2NhdGlvbj86IHN0cmluZztcbn1cblxuY29uc3QgQXNzZXRBbGxvY2F0aW9uOiBSZWFjdC5GQyA9ICgpID0+IHtcbiAgY29uc3QgeyB1c2VyIH0gPSB1c2VBdXRoKCk7XG4gIGNvbnN0IHsgdG9hc3QgfSA9IHVzZVRvYXN0KCk7XG4gIGNvbnN0IFthbGxvY2F0aW9ucywgc2V0QWxsb2NhdGlvbnNdID0gdXNlU3RhdGU8QWxsb2NhdGlvbltdPihbXSk7XG4gIGNvbnN0IFtzZWFyY2hUZXJtLCBzZXRTZWFyY2hUZXJtXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW3N0YXR1c0ZpbHRlciwgc2V0U3RhdHVzRmlsdGVyXSA9IHVzZVN0YXRlKCdhbGwnKTtcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbaXNBbGxvY2F0aW5nLCBzZXRJc0FsbG9jYXRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbbmV3QWxsb2NhdGlvbiwgc2V0TmV3QWxsb2NhdGlvbl0gPSB1c2VTdGF0ZSh7XG4gICAgYXNzZXRJZDogJycsXG4gICAgZW1wbG95ZWVFbWFpbDogJycsXG4gICAgZXhwZWN0ZWRSZXR1cm46ICcnXG4gIH0pO1xuXG4gIC8vIE1vY2sgZGF0YSBmb3IgZGVtb25zdHJhdGlvblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tBbGxvY2F0aW9uczogQWxsb2NhdGlvbltdID0gW1xuICAgICAge1xuICAgICAgICBpZDogMSxcbiAgICAgICAgYXNzZXRfbmFtZTogJ0RlbGwgTGFwdG9wIFhQUyAxMycsXG4gICAgICAgIGFzc2V0X2lkOiAxLFxuICAgICAgICBlbXBsb3llZV9uYW1lOiAnSm9obiBEb2UnLFxuICAgICAgICBlbXBsb3llZV9lbWFpbDogJ2pvaG4uZG9lQGNvbXBhbnkuY29tJyxcbiAgICAgICAgZGVwYXJ0bWVudDogJ0VuZ2luZWVyaW5nJyxcbiAgICAgICAgYWxsb2NhdGVkX2RhdGU6ICcyMDI0LTAxLTEwJyxcbiAgICAgICAgZXhwZWN0ZWRfcmV0dXJuOiAnMjAyNC0wNy0xMCcsXG4gICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgICAgIGxvY2F0aW9uOiAnSG9tZSBPZmZpY2UnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogMixcbiAgICAgICAgYXNzZXRfbmFtZTogJ01hY0Jvb2sgUHJvIDE2XCInLFxuICAgICAgICBhc3NldF9pZDogNSxcbiAgICAgICAgZW1wbG95ZWVfbmFtZTogJ0phbmUgU21pdGgnLFxuICAgICAgICBlbXBsb3llZV9lbWFpbDogJ2phbmUuc21pdGhAY29tcGFueS5jb20nLFxuICAgICAgICBkZXBhcnRtZW50OiAnRGVzaWduJyxcbiAgICAgICAgYWxsb2NhdGVkX2RhdGU6ICcyMDI0LTAxLTA1JyxcbiAgICAgICAgZXhwZWN0ZWRfcmV0dXJuOiAnMjAyNC0wNi0wNScsXG4gICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgICAgIGxvY2F0aW9uOiAnT2ZmaWNlIC0gRmxvb3IgMidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAzLFxuICAgICAgICBhc3NldF9uYW1lOiAnT2ZmaWNlIENoYWlyIEVyZ29ub21pYycsXG4gICAgICAgIGFzc2V0X2lkOiAyLFxuICAgICAgICBlbXBsb3llZV9uYW1lOiAnTWlrZSBKb2huc29uJyxcbiAgICAgICAgZW1wbG95ZWVfZW1haWw6ICdtaWtlLmpvaG5zb25AY29tcGFueS5jb20nLFxuICAgICAgICBkZXBhcnRtZW50OiAnU2FsZXMnLFxuICAgICAgICBhbGxvY2F0ZWRfZGF0ZTogJzIwMjMtMTItMTUnLFxuICAgICAgICBleHBlY3RlZF9yZXR1cm46ICcyMDI0LTAxLTE1JyxcbiAgICAgICAgc3RhdHVzOiAnb3ZlcmR1ZScsXG4gICAgICAgIGxvY2F0aW9uOiAnT2ZmaWNlIC0gRmxvb3IgMSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiA0LFxuICAgICAgICBhc3NldF9uYW1lOiAnSFAgUHJpbnRlciBMYXNlckpldCcsXG4gICAgICAgIGFzc2V0X2lkOiAzLFxuICAgICAgICBlbXBsb3llZV9uYW1lOiAnU2FyYWggV2lsc29uJyxcbiAgICAgICAgZW1wbG95ZWVfZW1haWw6ICdzYXJhaC53aWxzb25AY29tcGFueS5jb20nLFxuICAgICAgICBkZXBhcnRtZW50OiAnSFInLFxuICAgICAgICBhbGxvY2F0ZWRfZGF0ZTogJzIwMjMtMTEtMjAnLFxuICAgICAgICBleHBlY3RlZF9yZXR1cm46ICcyMDI0LTAxLTAxJyxcbiAgICAgICAgc3RhdHVzOiAncmV0dXJuZWQnLFxuICAgICAgICBsb2NhdGlvbjogJ1JldHVybmVkIHRvIFN0b3JhZ2UnXG4gICAgICB9XG4gICAgXTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0QWxsb2NhdGlvbnMobW9ja0FsbG9jYXRpb25zKTtcbiAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgfSwgMTAwMCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBmaWx0ZXJlZEFsbG9jYXRpb25zID0gYWxsb2NhdGlvbnMuZmlsdGVyKGFsbG9jYXRpb24gPT4ge1xuICAgIGNvbnN0IG1hdGNoZXNTZWFyY2ggPSBhbGxvY2F0aW9uLmFzc2V0X25hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGlvbi5lbXBsb3llZV9uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRpb24uZGVwYXJ0bWVudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKSk7XG4gICAgY29uc3QgbWF0Y2hlc1N0YXR1cyA9IHN0YXR1c0ZpbHRlciA9PT0gJ2FsbCcgfHwgYWxsb2NhdGlvbi5zdGF0dXMgPT09IHN0YXR1c0ZpbHRlcjtcbiAgICByZXR1cm4gbWF0Y2hlc1NlYXJjaCAmJiBtYXRjaGVzU3RhdHVzO1xuICB9KTtcblxuICBjb25zdCBnZXRTdGF0dXNCYWRnZSA9IChzdGF0dXM6IEFsbG9jYXRpb25bJ3N0YXR1cyddKSA9PiB7XG4gICAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICAgIGNhc2UgJ2FjdGl2ZSc6XG4gICAgICAgIHJldHVybiA8QmFkZ2UgY2xhc3NOYW1lPVwiYmctZ3JlZW4tMTAwIHRleHQtZ3JlZW4tODAwIGRhcms6YmctZ3JlZW4tOTAwIGRhcms6dGV4dC1ncmVlbi0zMDBcIj5BY3RpdmU8L0JhZGdlPjtcbiAgICAgIGNhc2UgJ3JldHVybmVkJzpcbiAgICAgICAgcmV0dXJuIDxCYWRnZSBjbGFzc05hbWU9XCJiZy1ncmF5LTEwMCB0ZXh0LWdyYXktODAwIGRhcms6YmctZ3JheS05MDAgZGFyazp0ZXh0LWdyYXktMzAwXCI+UmV0dXJuZWQ8L0JhZGdlPjtcbiAgICAgIGNhc2UgJ292ZXJkdWUnOlxuICAgICAgICByZXR1cm4gPEJhZGdlIGNsYXNzTmFtZT1cImJnLXJlZC0xMDAgdGV4dC1yZWQtODAwIGRhcms6YmctcmVkLTkwMCBkYXJrOnRleHQtcmVkLTMwMFwiPk92ZXJkdWU8L0JhZGdlPjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiA8QmFkZ2UgdmFyaWFudD1cInNlY29uZGFyeVwiPlVua25vd248L0JhZGdlPjtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlTmV3QWxsb2NhdGlvbiA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoIW5ld0FsbG9jYXRpb24uYXNzZXRJZCB8fCAhbmV3QWxsb2NhdGlvbi5lbXBsb3llZUVtYWlsKSB7XG4gICAgICB0b2FzdCh7XG4gICAgICAgIHRpdGxlOiBcIkVycm9yXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlBsZWFzZSBzZWxlY3QgYm90aCBhbiBhc3NldCBhbmQgYW4gZW1wbG95ZWUuXCIsXG4gICAgICAgIHZhcmlhbnQ6IFwiZGVzdHJ1Y3RpdmVcIixcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldElzQWxsb2NhdGluZyh0cnVlKTtcblxuICAgIC8vIE1vY2sgQVBJIGNhbGxcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGFsbG9jYXRpb246IEFsbG9jYXRpb24gPSB7XG4gICAgICAgIGlkOiBhbGxvY2F0aW9ucy5sZW5ndGggKyAxLFxuICAgICAgICBhc3NldF9uYW1lOiAnTmV3IEFzc2V0JyxcbiAgICAgICAgYXNzZXRfaWQ6IHBhcnNlSW50KG5ld0FsbG9jYXRpb24uYXNzZXRJZCksXG4gICAgICAgIGVtcGxveWVlX25hbWU6ICdOZXcgRW1wbG95ZWUnLFxuICAgICAgICBlbXBsb3llZV9lbWFpbDogbmV3QWxsb2NhdGlvbi5lbXBsb3llZUVtYWlsLFxuICAgICAgICBkZXBhcnRtZW50OiAnVmFyaW91cycsXG4gICAgICAgIGFsbG9jYXRlZF9kYXRlOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXSxcbiAgICAgICAgZXhwZWN0ZWRfcmV0dXJuOiBuZXdBbGxvY2F0aW9uLmV4cGVjdGVkUmV0dXJuLFxuICAgICAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgICAgICBsb2NhdGlvbjogJ1RvIGJlIGRldGVybWluZWQnXG4gICAgICB9O1xuXG4gICAgICBzZXRBbGxvY2F0aW9ucyhbYWxsb2NhdGlvbiwgLi4uYWxsb2NhdGlvbnNdKTtcbiAgICAgIHNldE5ld0FsbG9jYXRpb24oeyBhc3NldElkOiAnJywgZW1wbG95ZWVFbWFpbDogJycsIGV4cGVjdGVkUmV0dXJuOiAnJyB9KTtcbiAgICAgIHNldElzQWxsb2NhdGluZyhmYWxzZSk7XG5cbiAgICAgIHRvYXN0KHtcbiAgICAgICAgdGl0bGU6IFwiQXNzZXQgQWxsb2NhdGVkXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkFzc2V0IGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBhbGxvY2F0ZWQgdG8gdGhlIGVtcGxveWVlLlwiLFxuICAgICAgfSk7XG4gICAgfSwgMTUwMCk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlUmV0dXJuQXNzZXQgPSAoYWxsb2NhdGlvbklkOiBudW1iZXIpID0+IHtcbiAgICBzZXRBbGxvY2F0aW9ucyhhbGxvY2F0aW9ucy5tYXAoYWxsb2NhdGlvbiA9PlxuICAgICAgYWxsb2NhdGlvbi5pZCA9PT0gYWxsb2NhdGlvbklkXG4gICAgICAgID8geyAuLi5hbGxvY2F0aW9uLCBzdGF0dXM6ICdyZXR1cm5lZCcgYXMgY29uc3QsIGxvY2F0aW9uOiAnUmV0dXJuZWQgdG8gU3RvcmFnZScgfVxuICAgICAgICA6IGFsbG9jYXRpb25cbiAgICApKTtcblxuICAgIHRvYXN0KHtcbiAgICAgIHRpdGxlOiBcIkFzc2V0IFJldHVybmVkXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJBc3NldCBoYXMgYmVlbiBtYXJrZWQgYXMgcmV0dXJuZWQuXCIsXG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgY2FuTWFuYWdlQWxsb2NhdGlvbnMgPSB1c2VyPy5yb2xlID09PSAnQWRtaW4nIHx8IHVzZXI/LnJvbGUgPT09ICdQcm9jdXJlbWVudCc7XG5cbiAgaWYgKCFjYW5NYW5hZ2VBbGxvY2F0aW9ucykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICA8VXNlckNoZWNrIGNsYXNzTmFtZT1cImgtMTIgdy0xMiB0ZXh0LW11dGVkLWZvcmVncm91bmQgbXgtYXV0byBtYi00XCIgLz5cbiAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1tZWRpdW0gbWItMlwiPkFjY2VzcyBSZXN0cmljdGVkPC9oMz5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+T25seSBhZG1pbmlzdHJhdG9ycyBhbmQgcHJvY3VyZW1lbnQgbWFuYWdlcnMgY2FuIG1hbmFnZSBhc3NldCBhbGxvY2F0aW9ucy48L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgaWYgKGlzTG9hZGluZykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNFwiPlxuICAgICAgICAgIHtbLi4uQXJyYXkoNSldLm1hcCgoXywgaSkgPT4gKFxuICAgICAgICAgICAgPENhcmQga2V5PXtpfSBjbGFzc05hbWU9XCJhbmltYXRlLXB1bHNlXCI+XG4gICAgICAgICAgICAgIDxDYXJkQ29udGVudCBjbGFzc05hbWU9XCJwLTZcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtNCBiZy1tdXRlZCByb3VuZGVkIHctMy80IG1iLTJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMyBiZy1tdXRlZCByb3VuZGVkIHctMS8yXCI+PC9kaXY+XG4gICAgICAgICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwLTYgc3BhY2UteS02XCI+XG4gICAgICB7LyogSGVhZGVyICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIHNwYWNlLXktNCBtZDpmbGV4LXJvdyBtZDppdGVtcy1jZW50ZXIgbWQ6anVzdGlmeS1iZXR3ZWVuIG1kOnNwYWNlLXktMFwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBmb250LWJvbGRcIj5Bc3NldCBBbGxvY2F0aW9uczwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+TWFuYWdlIGFzc2V0IGFzc2lnbm1lbnRzIHRvIGVtcGxveWVlczwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxEaWFsb2c+XG4gICAgICAgICAgPERpYWxvZ1RyaWdnZXIgYXNDaGlsZD5cbiAgICAgICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPVwiYmctZ3JhZGllbnQtcHJpbWFyeSBob3ZlcjpvcGFjaXR5LTkwXCI+XG4gICAgICAgICAgICAgIDxVc2VyQ2hlY2sgY2xhc3NOYW1lPVwiaC00IHctNCBtci0yXCIgLz5cbiAgICAgICAgICAgICAgTmV3IEFsbG9jYXRpb25cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvRGlhbG9nVHJpZ2dlcj5cbiAgICAgICAgICA8RGlhbG9nQ29udGVudD5cbiAgICAgICAgICAgIDxEaWFsb2dIZWFkZXI+XG4gICAgICAgICAgICAgIDxEaWFsb2dUaXRsZT5BbGxvY2F0ZSBBc3NldDwvRGlhbG9nVGl0bGU+XG4gICAgICAgICAgICAgIDxEaWFsb2dEZXNjcmlwdGlvbj5cbiAgICAgICAgICAgICAgICBBc3NpZ24gYW4gYXNzZXQgdG8gYW4gZW1wbG95ZWUgZm9yIHVzZS5cbiAgICAgICAgICAgICAgPC9EaWFsb2dEZXNjcmlwdGlvbj5cbiAgICAgICAgICAgIDwvRGlhbG9nSGVhZGVyPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LW1lZGl1bVwiPlNlbGVjdCBBc3NldDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPFNlbGVjdCB2YWx1ZT17bmV3QWxsb2NhdGlvbi5hc3NldElkfSBvblZhbHVlQ2hhbmdlPXsodmFsdWUpID0+IHNldE5ld0FsbG9jYXRpb24oeyAuLi5uZXdBbGxvY2F0aW9uLCBhc3NldElkOiB2YWx1ZSB9KX0+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0VHJpZ2dlcj5cbiAgICAgICAgICAgICAgICAgICAgPFNlbGVjdFZhbHVlIHBsYWNlaG9sZGVyPVwiQ2hvb3NlIGFuIGF2YWlsYWJsZSBhc3NldFwiIC8+XG4gICAgICAgICAgICAgICAgICA8L1NlbGVjdFRyaWdnZXI+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0Q29udGVudD5cbiAgICAgICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCIxXCI+RGVsbCBMYXB0b3AgWFBTIDEzIC0gQXZhaWxhYmxlPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cIjRcIj5TdGFuZGluZyBEZXNrIC0gQXZhaWxhYmxlPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cIjZcIj5pUGFkIFBybyAtIEF2YWlsYWJsZTwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICAgIDwvU2VsZWN0Q29udGVudD5cbiAgICAgICAgICAgICAgICA8L1NlbGVjdD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW1cIj5TZWxlY3QgRW1wbG95ZWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxTZWxlY3QgdmFsdWU9e25ld0FsbG9jYXRpb24uZW1wbG95ZWVFbWFpbH0gb25WYWx1ZUNoYW5nZT17KHZhbHVlKSA9PiBzZXROZXdBbGxvY2F0aW9uKHsgLi4ubmV3QWxsb2NhdGlvbiwgZW1wbG95ZWVFbWFpbDogdmFsdWUgfSl9PlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdFRyaWdnZXI+XG4gICAgICAgICAgICAgICAgICAgIDxTZWxlY3RWYWx1ZSBwbGFjZWhvbGRlcj1cIkNob29zZSBhbiBlbXBsb3llZVwiIC8+XG4gICAgICAgICAgICAgICAgICA8L1NlbGVjdFRyaWdnZXI+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0Q29udGVudD5cbiAgICAgICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJhbGljZS5icm93bkBjb21wYW55LmNvbVwiPkFsaWNlIEJyb3duIC0gTWFya2V0aW5nPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cImJvYi53aWxzb25AY29tcGFueS5jb21cIj5Cb2IgV2lsc29uIC0gRW5naW5lZXJpbmc8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgICAgIDxTZWxlY3RJdGVtIHZhbHVlPVwiY2Fyb2wuZGF2aXNAY29tcGFueS5jb21cIj5DYXJvbCBEYXZpcyAtIEZpbmFuY2U8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgICA8L1NlbGVjdENvbnRlbnQ+XG4gICAgICAgICAgICAgICAgPC9TZWxlY3Q+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtXCI+RXhwZWN0ZWQgUmV0dXJuIERhdGUgKE9wdGlvbmFsKTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgICAgICB0eXBlPVwiZGF0ZVwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17bmV3QWxsb2NhdGlvbi5leHBlY3RlZFJldHVybn1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TmV3QWxsb2NhdGlvbih7IC4uLm5ld0FsbG9jYXRpb24sIGV4cGVjdGVkUmV0dXJuOiBlLnRhcmdldC52YWx1ZSB9KX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVOZXdBbGxvY2F0aW9ufSBkaXNhYmxlZD17aXNBbGxvY2F0aW5nfSBjbGFzc05hbWU9XCJ3LWZ1bGxcIj5cbiAgICAgICAgICAgICAgICB7aXNBbGxvY2F0aW5nID8gJ0FsbG9jYXRpbmcuLi4nIDogJ0FsbG9jYXRlIEFzc2V0J31cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L0RpYWxvZ0NvbnRlbnQ+XG4gICAgICAgIDwvRGlhbG9nPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBTdW1tYXJ5IENhcmRzICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0zIGdhcC02XCI+XG4gICAgICAgIDxDYXJkPlxuICAgICAgICAgIDxDYXJkQ29udGVudCBjbGFzc05hbWU9XCJwLTZcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LW11dGVkLWZvcmVncm91bmRcIj5BY3RpdmUgQWxsb2NhdGlvbnM8L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ib2xkXCI+e2FsbG9jYXRpb25zLmZpbHRlcihhID0+IGEuc3RhdHVzID09PSAnYWN0aXZlJykubGVuZ3RofTwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxQYWNrYWdlIGNsYXNzTmFtZT1cImgtOCB3LTggdGV4dC1wcmltYXJ5XCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICAgIDwvQ2FyZD5cbiAgICAgICAgPENhcmQ+XG4gICAgICAgICAgPENhcmRDb250ZW50IGNsYXNzTmFtZT1cInAtNlwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiPk92ZXJkdWUgUmV0dXJuczwvcD5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LWJvbGQgdGV4dC1yZWQtNjAwXCI+e2FsbG9jYXRpb25zLmZpbHRlcihhID0+IGEuc3RhdHVzID09PSAnb3ZlcmR1ZScpLmxlbmd0aH08L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8Q2FsZW5kYXIgY2xhc3NOYW1lPVwiaC04IHctOCB0ZXh0LXJlZC01MDBcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgICAgPC9DYXJkPlxuICAgICAgICA8Q2FyZD5cbiAgICAgICAgICA8Q2FyZENvbnRlbnQgY2xhc3NOYW1lPVwicC02XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+VG90YWwgUmV0dXJuZWQ8L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ib2xkXCI+e2FsbG9jYXRpb25zLmZpbHRlcihhID0+IGEuc3RhdHVzID09PSAncmV0dXJuZWQnKS5sZW5ndGh9PC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPFVuZG8gY2xhc3NOYW1lPVwiaC04IHctOCB0ZXh0LWdyZWVuLTUwMFwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L0NhcmRDb250ZW50PlxuICAgICAgICA8L0NhcmQ+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIEZpbHRlcnMgKi99XG4gICAgICA8Q2FyZCBjbGFzc05hbWU9XCJzaGFkb3ctc29mdFwiPlxuICAgICAgICA8Q2FyZENvbnRlbnQgY2xhc3NOYW1lPVwicC02XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIHNwYWNlLXktNCBtZDpmbGV4LXJvdyBtZDppdGVtcy1jZW50ZXIgbWQ6c3BhY2UteS0wIG1kOnNwYWNlLXgtNFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4LTFcIj5cbiAgICAgICAgICAgICAgPFNlYXJjaCBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTMgdG9wLTMgaC00IHctNCB0ZXh0LW11dGVkLWZvcmVncm91bmRcIiAvPlxuICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBhbGxvY2F0aW9ucy4uLlwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFRlcm19XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWFyY2hUZXJtKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwbC0xMFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxTZWxlY3QgdmFsdWU9e3N0YXR1c0ZpbHRlcn0gb25WYWx1ZUNoYW5nZT17c2V0U3RhdHVzRmlsdGVyfT5cbiAgICAgICAgICAgICAgPFNlbGVjdFRyaWdnZXIgY2xhc3NOYW1lPVwidy1bMTgwcHhdXCI+XG4gICAgICAgICAgICAgICAgPEZpbHRlciBjbGFzc05hbWU9XCJoLTQgdy00IG1yLTJcIiAvPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RWYWx1ZSBwbGFjZWhvbGRlcj1cIkZpbHRlciBieSBzdGF0dXNcIiAvPlxuICAgICAgICAgICAgICA8L1NlbGVjdFRyaWdnZXI+XG4gICAgICAgICAgICAgIDxTZWxlY3RDb250ZW50PlxuICAgICAgICAgICAgICAgIDxTZWxlY3RJdGVtIHZhbHVlPVwiYWxsXCI+QWxsIFN0YXR1czwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cImFjdGl2ZVwiPkFjdGl2ZTwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cInJldHVybmVkXCI+UmV0dXJuZWQ8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJvdmVyZHVlXCI+T3ZlcmR1ZTwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgPC9TZWxlY3RDb250ZW50PlxuICAgICAgICAgICAgPC9TZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICA8L0NhcmQ+XG5cbiAgICAgIHsvKiBBbGxvY2F0aW9ucyBUYWJsZSAqL31cbiAgICAgIDxDYXJkIGNsYXNzTmFtZT1cInNoYWRvdy1zb2Z0XCI+XG4gICAgICAgIDxDYXJkSGVhZGVyPlxuICAgICAgICAgIDxDYXJkVGl0bGUgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgIDxVc2VyQ2hlY2sgY2xhc3NOYW1lPVwiaC01IHctNVwiIC8+XG4gICAgICAgICAgICBDdXJyZW50IEFsbG9jYXRpb25zICh7ZmlsdGVyZWRBbGxvY2F0aW9ucy5sZW5ndGh9KVxuICAgICAgICAgIDwvQ2FyZFRpdGxlPlxuICAgICAgICA8L0NhcmRIZWFkZXI+XG4gICAgICAgIDxDYXJkQ29udGVudD5cbiAgICAgICAgICA8VGFibGU+XG4gICAgICAgICAgICA8VGFibGVIZWFkZXI+XG4gICAgICAgICAgICAgIDxUYWJsZVJvdz5cbiAgICAgICAgICAgICAgICA8VGFibGVIZWFkPkFzc2V0PC9UYWJsZUhlYWQ+XG4gICAgICAgICAgICAgICAgPFRhYmxlSGVhZD5FbXBsb3llZTwvVGFibGVIZWFkPlxuICAgICAgICAgICAgICAgIDxUYWJsZUhlYWQ+RGVwYXJ0bWVudDwvVGFibGVIZWFkPlxuICAgICAgICAgICAgICAgIDxUYWJsZUhlYWQ+QWxsb2NhdGVkIERhdGU8L1RhYmxlSGVhZD5cbiAgICAgICAgICAgICAgICA8VGFibGVIZWFkPkV4cGVjdGVkIFJldHVybjwvVGFibGVIZWFkPlxuICAgICAgICAgICAgICAgIDxUYWJsZUhlYWQ+U3RhdHVzPC9UYWJsZUhlYWQ+XG4gICAgICAgICAgICAgICAgPFRhYmxlSGVhZD5BY3Rpb25zPC9UYWJsZUhlYWQ+XG4gICAgICAgICAgICAgIDwvVGFibGVSb3c+XG4gICAgICAgICAgICA8L1RhYmxlSGVhZGVyPlxuICAgICAgICAgICAgPFRhYmxlQm9keT5cbiAgICAgICAgICAgICAge2ZpbHRlcmVkQWxsb2NhdGlvbnMubWFwKChhbGxvY2F0aW9uKSA9PiAoXG4gICAgICAgICAgICAgICAgPFRhYmxlUm93IGtleT17YWxsb2NhdGlvbi5pZH0+XG4gICAgICAgICAgICAgICAgICA8VGFibGVDZWxsPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxQYWNrYWdlIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC1wcmltYXJ5XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb250LW1lZGl1bVwiPnthbGxvY2F0aW9uLmFzc2V0X25hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+SUQ6IHthbGxvY2F0aW9uLmFzc2V0X2lkfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvVGFibGVDZWxsPlxuICAgICAgICAgICAgICAgICAgPFRhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8QXZhdGFyIGNsYXNzTmFtZT1cImgtOCB3LThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxBdmF0YXJGYWxsYmFjaz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2FsbG9jYXRpb24uZW1wbG95ZWVfbmFtZS5zcGxpdCgnICcpLm1hcChuID0+IG5bMF0pLmpvaW4oJycpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9BdmF0YXJGYWxsYmFjaz5cbiAgICAgICAgICAgICAgICAgICAgICA8L0F2YXRhcj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb250LW1lZGl1bVwiPnthbGxvY2F0aW9uLmVtcGxveWVlX25hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+e2FsbG9jYXRpb24uZW1wbG95ZWVfZW1haWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9UYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICA8VGFibGVDZWxsPnthbGxvY2F0aW9uLmRlcGFydG1lbnR9PC9UYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICA8VGFibGVDZWxsPntuZXcgRGF0ZShhbGxvY2F0aW9uLmFsbG9jYXRlZF9kYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoKX08L1RhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgIDxUYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICAgIHthbGxvY2F0aW9uLmV4cGVjdGVkX3JldHVybiA/IG5ldyBEYXRlKGFsbG9jYXRpb24uZXhwZWN0ZWRfcmV0dXJuKS50b0xvY2FsZURhdGVTdHJpbmcoKSA6ICdOb3Qgc3BlY2lmaWVkJ31cbiAgICAgICAgICAgICAgICAgIDwvVGFibGVDZWxsPlxuICAgICAgICAgICAgICAgICAgPFRhYmxlQ2VsbD57Z2V0U3RhdHVzQmFkZ2UoYWxsb2NhdGlvbi5zdGF0dXMpfTwvVGFibGVDZWxsPlxuICAgICAgICAgICAgICAgICAgPFRhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICAge2FsbG9jYXRpb24uc3RhdHVzID09PSAnYWN0aXZlJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cIm91dGxpbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZT1cInNtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVJldHVybkFzc2V0KGFsbG9jYXRpb24uaWQpfVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVbmRvIGNsYXNzTmFtZT1cImgtMyB3LTMgbXItMVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvVGFibGVDZWxsPlxuICAgICAgICAgICAgICAgIDwvVGFibGVSb3c+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9UYWJsZUJvZHk+XG4gICAgICAgICAgPC9UYWJsZT5cbiAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgIDwvQ2FyZD5cblxuICAgICAge2ZpbHRlcmVkQWxsb2NhdGlvbnMubGVuZ3RoID09PSAwICYmIChcbiAgICAgICAgPENhcmQgY2xhc3NOYW1lPVwic2hhZG93LXNvZnRcIj5cbiAgICAgICAgICA8Q2FyZENvbnRlbnQgY2xhc3NOYW1lPVwicC0xMiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgPFVzZXJDaGVjayBjbGFzc05hbWU9XCJoLTEyIHctMTIgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIG14LWF1dG8gbWItNFwiIC8+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LW1lZGl1bSBtYi0yXCI+Tm8gYWxsb2NhdGlvbnMgZm91bmQ8L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+XG4gICAgICAgICAgICAgIHtzZWFyY2hUZXJtIHx8IHN0YXR1c0ZpbHRlciAhPT0gJ2FsbCcgXG4gICAgICAgICAgICAgICAgPyAnVHJ5IGFkanVzdGluZyB5b3VyIHNlYXJjaCBvciBmaWx0ZXIgY3JpdGVyaWEuJ1xuICAgICAgICAgICAgICAgIDogJ0dldCBzdGFydGVkIGJ5IG1ha2luZyB5b3VyIGZpcnN0IGFzc2V0IGFsbG9jYXRpb24uJ31cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L0NhcmRDb250ZW50PlxuICAgICAgICA8L0NhcmQ+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXNzZXRBbGxvY2F0aW9uOyJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsS0FBSyxJQUFJQyxRQUFRLEVBQUVDLFNBQVMsUUFBUSxPQUFPO0FBQ2xELFNBQVNDLE9BQU8sUUFBUSx3QkFBd0I7QUFDaEQsU0FBU0MsSUFBSSxFQUFFQyxXQUFXLEVBQW1CQyxVQUFVLEVBQUVDLFNBQVMsUUFBUSxzQkFBc0I7QUFDaEcsU0FBU0MsTUFBTSxRQUFRLHdCQUF3QjtBQUMvQyxTQUFTQyxLQUFLLFFBQVEsdUJBQXVCO0FBQzdDLFNBQVNDLEtBQUssUUFBUSx1QkFBdUI7QUFDN0MsU0FBU0MsTUFBTSxFQUFFQyxhQUFhLEVBQUVDLFVBQVUsRUFBRUMsYUFBYSxFQUFFQyxXQUFXLFFBQVEsd0JBQXdCO0FBQ3RHLFNBQVNDLEtBQUssRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRUMsV0FBVyxFQUFFQyxRQUFRLFFBQVEsdUJBQXVCO0FBQ3JHLFNBQVNDLE1BQU0sRUFBRUMsY0FBYyxRQUFxQix3QkFBd0I7QUFDNUUsU0FBU0MsTUFBTSxFQUFFQyxhQUFhLEVBQUVDLGlCQUFpQixFQUFFQyxZQUFZLEVBQUVDLFdBQVcsRUFBRUMsYUFBYSxRQUFRLHdCQUF3QjtBQUMzSCxTQUFTQyxTQUFTLEVBQUVDLE9BQU8sRUFBU0MsUUFBUSxFQUFVQyxNQUFNLEVBQUVDLE1BQU0sRUFBY0MsSUFBSSxRQUFRLGNBQWM7QUFDNUcsU0FBU0MsUUFBUSxRQUFRLG1CQUFtQjtBQWU1QyxNQUFNQyxlQUF5QixHQUFHQSxDQUFBLEtBQU07RUFDdEMsTUFBTTtJQUFFQztFQUFLLENBQUMsR0FBR25DLE9BQU8sQ0FBQyxDQUFDO0VBQzFCLE1BQU07SUFBRW9DO0VBQU0sQ0FBQyxHQUFHSCxRQUFRLENBQUMsQ0FBQztFQUM1QixNQUFNLENBQUNJLFdBQVcsRUFBRUMsY0FBYyxDQUFDLEdBQUd4QyxRQUFRLENBQWUsRUFBRSxDQUFDO0VBQ2hFLE1BQU0sQ0FBQ3lDLFVBQVUsRUFBRUMsYUFBYSxDQUFDLEdBQUcxQyxRQUFRLENBQUMsRUFBRSxDQUFDO0VBQ2hELE1BQU0sQ0FBQzJDLFlBQVksRUFBRUMsZUFBZSxDQUFDLEdBQUc1QyxRQUFRLENBQUMsS0FBSyxDQUFDO0VBQ3ZELE1BQU0sQ0FBQzZDLFNBQVMsRUFBRUMsWUFBWSxDQUFDLEdBQUc5QyxRQUFRLENBQUMsSUFBSSxDQUFDO0VBQ2hELE1BQU0sQ0FBQytDLFlBQVksRUFBRUMsZUFBZSxDQUFDLEdBQUdoRCxRQUFRLENBQUMsS0FBSyxDQUFDO0VBQ3ZELE1BQU0sQ0FBQ2lELGFBQWEsRUFBRUMsZ0JBQWdCLENBQUMsR0FBR2xELFFBQVEsQ0FBQztJQUNqRG1ELE9BQU8sRUFBRSxFQUFFO0lBQ1hDLGFBQWEsRUFBRSxFQUFFO0lBQ2pCQyxjQUFjLEVBQUU7RUFDbEIsQ0FBQyxDQUFDOztFQUVGO0VBQ0FwRCxTQUFTLENBQUMsTUFBTTtJQUNkLE1BQU1xRCxlQUE2QixHQUFHLENBQ3BDO01BQ0VDLEVBQUUsRUFBRSxDQUFDO01BQ0xDLFVBQVUsRUFBRSxvQkFBb0I7TUFDaENDLFFBQVEsRUFBRSxDQUFDO01BQ1hDLGFBQWEsRUFBRSxVQUFVO01BQ3pCQyxjQUFjLEVBQUUsc0JBQXNCO01BQ3RDQyxVQUFVLEVBQUUsYUFBYTtNQUN6QkMsY0FBYyxFQUFFLFlBQVk7TUFDNUJDLGVBQWUsRUFBRSxZQUFZO01BQzdCQyxNQUFNLEVBQUUsUUFBUTtNQUNoQkMsUUFBUSxFQUFFO0lBQ1osQ0FBQyxFQUNEO01BQ0VULEVBQUUsRUFBRSxDQUFDO01BQ0xDLFVBQVUsRUFBRSxpQkFBaUI7TUFDN0JDLFFBQVEsRUFBRSxDQUFDO01BQ1hDLGFBQWEsRUFBRSxZQUFZO01BQzNCQyxjQUFjLEVBQUUsd0JBQXdCO01BQ3hDQyxVQUFVLEVBQUUsUUFBUTtNQUNwQkMsY0FBYyxFQUFFLFlBQVk7TUFDNUJDLGVBQWUsRUFBRSxZQUFZO01BQzdCQyxNQUFNLEVBQUUsUUFBUTtNQUNoQkMsUUFBUSxFQUFFO0lBQ1osQ0FBQyxFQUNEO01BQ0VULEVBQUUsRUFBRSxDQUFDO01BQ0xDLFVBQVUsRUFBRSx3QkFBd0I7TUFDcENDLFFBQVEsRUFBRSxDQUFDO01BQ1hDLGFBQWEsRUFBRSxjQUFjO01BQzdCQyxjQUFjLEVBQUUsMEJBQTBCO01BQzFDQyxVQUFVLEVBQUUsT0FBTztNQUNuQkMsY0FBYyxFQUFFLFlBQVk7TUFDNUJDLGVBQWUsRUFBRSxZQUFZO01BQzdCQyxNQUFNLEVBQUUsU0FBUztNQUNqQkMsUUFBUSxFQUFFO0lBQ1osQ0FBQyxFQUNEO01BQ0VULEVBQUUsRUFBRSxDQUFDO01BQ0xDLFVBQVUsRUFBRSxxQkFBcUI7TUFDakNDLFFBQVEsRUFBRSxDQUFDO01BQ1hDLGFBQWEsRUFBRSxjQUFjO01BQzdCQyxjQUFjLEVBQUUsMEJBQTBCO01BQzFDQyxVQUFVLEVBQUUsSUFBSTtNQUNoQkMsY0FBYyxFQUFFLFlBQVk7TUFDNUJDLGVBQWUsRUFBRSxZQUFZO01BQzdCQyxNQUFNLEVBQUUsVUFBVTtNQUNsQkMsUUFBUSxFQUFFO0lBQ1osQ0FBQyxDQUNGO0lBRURDLFVBQVUsQ0FBQyxNQUFNO01BQ2Z6QixjQUFjLENBQUNjLGVBQWUsQ0FBQztNQUMvQlIsWUFBWSxDQUFDLEtBQUssQ0FBQztJQUNyQixDQUFDLEVBQUUsSUFBSSxDQUFDO0VBQ1YsQ0FBQyxFQUFFLEVBQUUsQ0FBQztFQUVOLE1BQU1vQixtQkFBbUIsR0FBRzNCLFdBQVcsQ0FBQzRCLE1BQU0sQ0FBQ0MsVUFBVSxJQUFJO0lBQzNELE1BQU1DLGFBQWEsR0FBR0QsVUFBVSxDQUFDWixVQUFVLENBQUNjLFdBQVcsQ0FBQyxDQUFDLENBQUNDLFFBQVEsQ0FBQzlCLFVBQVUsQ0FBQzZCLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFDdkVGLFVBQVUsQ0FBQ1YsYUFBYSxDQUFDWSxXQUFXLENBQUMsQ0FBQyxDQUFDQyxRQUFRLENBQUM5QixVQUFVLENBQUM2QixXQUFXLENBQUMsQ0FBQyxDQUFDLElBQ3pFRixVQUFVLENBQUNSLFVBQVUsQ0FBQ1UsV0FBVyxDQUFDLENBQUMsQ0FBQ0MsUUFBUSxDQUFDOUIsVUFBVSxDQUFDNkIsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUMzRixNQUFNRSxhQUFhLEdBQUc3QixZQUFZLEtBQUssS0FBSyxJQUFJeUIsVUFBVSxDQUFDTCxNQUFNLEtBQUtwQixZQUFZO0lBQ2xGLE9BQU8wQixhQUFhLElBQUlHLGFBQWE7RUFDdkMsQ0FBQyxDQUFDO0VBRUYsTUFBTUMsY0FBYyxHQUFJVixNQUE0QixJQUFLO0lBQ3ZELFFBQVFBLE1BQU07TUFDWixLQUFLLFFBQVE7UUFDWCxvQkFBT2hFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ2pFLEtBQUs7VUFBQ2tFLFNBQVMsRUFBQztRQUFtRSxHQUFDLFFBQWEsQ0FBQztNQUM1RyxLQUFLLFVBQVU7UUFDYixvQkFBTzVFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ2pFLEtBQUs7VUFBQ2tFLFNBQVMsRUFBQztRQUErRCxHQUFDLFVBQWUsQ0FBQztNQUMxRyxLQUFLLFNBQVM7UUFDWixvQkFBTzVFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ2pFLEtBQUs7VUFBQ2tFLFNBQVMsRUFBQztRQUEyRCxHQUFDLFNBQWMsQ0FBQztNQUNyRztRQUNFLG9CQUFPNUUsS0FBQSxDQUFBMkUsYUFBQSxDQUFDakUsS0FBSztVQUFDbUUsT0FBTyxFQUFDO1FBQVcsR0FBQyxTQUFjLENBQUM7SUFDckQ7RUFDRixDQUFDO0VBRUQsTUFBTUMsbUJBQW1CLEdBQUcsTUFBQUEsQ0FBQSxLQUFZO0lBQ3RDLElBQUksQ0FBQzVCLGFBQWEsQ0FBQ0UsT0FBTyxJQUFJLENBQUNGLGFBQWEsQ0FBQ0csYUFBYSxFQUFFO01BQzFEZCxLQUFLLENBQUM7UUFDSndDLEtBQUssRUFBRSxPQUFPO1FBQ2RDLFdBQVcsRUFBRSw4Q0FBOEM7UUFDM0RILE9BQU8sRUFBRTtNQUNYLENBQUMsQ0FBQztNQUNGO0lBQ0Y7SUFFQTVCLGVBQWUsQ0FBQyxJQUFJLENBQUM7O0lBRXJCO0lBQ0FpQixVQUFVLENBQUMsTUFBTTtNQUNmLE1BQU1HLFVBQXNCLEdBQUc7UUFDN0JiLEVBQUUsRUFBRWhCLFdBQVcsQ0FBQ3lDLE1BQU0sR0FBRyxDQUFDO1FBQzFCeEIsVUFBVSxFQUFFLFdBQVc7UUFDdkJDLFFBQVEsRUFBRXdCLFFBQVEsQ0FBQ2hDLGFBQWEsQ0FBQ0UsT0FBTyxDQUFDO1FBQ3pDTyxhQUFhLEVBQUUsY0FBYztRQUM3QkMsY0FBYyxFQUFFVixhQUFhLENBQUNHLGFBQWE7UUFDM0NRLFVBQVUsRUFBRSxTQUFTO1FBQ3JCQyxjQUFjLEVBQUUsSUFBSXFCLElBQUksQ0FBQyxDQUFDLENBQUNDLFdBQVcsQ0FBQyxDQUFDLENBQUNDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdER0QixlQUFlLEVBQUViLGFBQWEsQ0FBQ0ksY0FBYztRQUM3Q1UsTUFBTSxFQUFFLFFBQVE7UUFDaEJDLFFBQVEsRUFBRTtNQUNaLENBQUM7TUFFRHhCLGNBQWMsQ0FBQyxDQUFDNEIsVUFBVSxFQUFFLEdBQUc3QixXQUFXLENBQUMsQ0FBQztNQUM1Q1csZ0JBQWdCLENBQUM7UUFBRUMsT0FBTyxFQUFFLEVBQUU7UUFBRUMsYUFBYSxFQUFFLEVBQUU7UUFBRUMsY0FBYyxFQUFFO01BQUcsQ0FBQyxDQUFDO01BQ3hFTCxlQUFlLENBQUMsS0FBSyxDQUFDO01BRXRCVixLQUFLLENBQUM7UUFDSndDLEtBQUssRUFBRSxpQkFBaUI7UUFDeEJDLFdBQVcsRUFBRTtNQUNmLENBQUMsQ0FBQztJQUNKLENBQUMsRUFBRSxJQUFJLENBQUM7RUFDVixDQUFDO0VBRUQsTUFBTU0saUJBQWlCLEdBQUlDLFlBQW9CLElBQUs7SUFDbEQ5QyxjQUFjLENBQUNELFdBQVcsQ0FBQ2dELEdBQUcsQ0FBQ25CLFVBQVUsSUFDdkNBLFVBQVUsQ0FBQ2IsRUFBRSxLQUFLK0IsWUFBWSxHQUMxQjtNQUFFLEdBQUdsQixVQUFVO01BQUVMLE1BQU0sRUFBRSxVQUFtQjtNQUFFQyxRQUFRLEVBQUU7SUFBc0IsQ0FBQyxHQUMvRUksVUFDTixDQUFDLENBQUM7SUFFRjlCLEtBQUssQ0FBQztNQUNKd0MsS0FBSyxFQUFFLGdCQUFnQjtNQUN2QkMsV0FBVyxFQUFFO0lBQ2YsQ0FBQyxDQUFDO0VBQ0osQ0FBQztFQUVELE1BQU1TLG9CQUFvQixHQUFHbkQsSUFBSSxFQUFFb0QsSUFBSSxLQUFLLE9BQU8sSUFBSXBELElBQUksRUFBRW9ELElBQUksS0FBSyxhQUFhO0VBRW5GLElBQUksQ0FBQ0Qsb0JBQW9CLEVBQUU7SUFDekIsb0JBQ0V6RixLQUFBLENBQUEyRSxhQUFBO01BQUtDLFNBQVMsRUFBQztJQUFpQixnQkFDOUI1RSxLQUFBLENBQUEyRSxhQUFBLENBQUM3QyxTQUFTO01BQUM4QyxTQUFTLEVBQUM7SUFBOEMsQ0FBRSxDQUFDLGVBQ3RFNUUsS0FBQSxDQUFBMkUsYUFBQTtNQUFJQyxTQUFTLEVBQUM7SUFBMEIsR0FBQyxtQkFBcUIsQ0FBQyxlQUMvRDVFLEtBQUEsQ0FBQTJFLGFBQUE7TUFBR0MsU0FBUyxFQUFDO0lBQXVCLEdBQUMsNEVBQTZFLENBQy9HLENBQUM7RUFFVjtFQUVBLElBQUk5QixTQUFTLEVBQUU7SUFDYixvQkFDRTlDLEtBQUEsQ0FBQTJFLGFBQUE7TUFBS0MsU0FBUyxFQUFDO0lBQUssZ0JBQ2xCNUUsS0FBQSxDQUFBMkUsYUFBQTtNQUFLQyxTQUFTLEVBQUM7SUFBVyxHQUN2QixDQUFDLEdBQUdlLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDSCxHQUFHLENBQUMsQ0FBQ0ksQ0FBQyxFQUFFQyxDQUFDLGtCQUN0QjdGLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3ZFLElBQUk7TUFBQzBGLEdBQUcsRUFBRUQsQ0FBRTtNQUFDakIsU0FBUyxFQUFDO0lBQWUsZ0JBQ3JDNUUsS0FBQSxDQUFBMkUsYUFBQSxDQUFDdEUsV0FBVztNQUFDdUUsU0FBUyxFQUFDO0lBQUssZ0JBQzFCNUUsS0FBQSxDQUFBMkUsYUFBQTtNQUFLQyxTQUFTLEVBQUM7SUFBaUMsQ0FBTSxDQUFDLGVBQ3ZENUUsS0FBQSxDQUFBMkUsYUFBQTtNQUFLQyxTQUFTLEVBQUM7SUFBNEIsQ0FBTSxDQUN0QyxDQUNULENBQ1AsQ0FDRSxDQUNGLENBQUM7RUFFVjtFQUVBLG9CQUNFNUUsS0FBQSxDQUFBMkUsYUFBQTtJQUFLQyxTQUFTLEVBQUM7RUFBZSxnQkFFNUI1RSxLQUFBLENBQUEyRSxhQUFBO0lBQUtDLFNBQVMsRUFBQztFQUFxRixnQkFDbEc1RSxLQUFBLENBQUEyRSxhQUFBLDJCQUNFM0UsS0FBQSxDQUFBMkUsYUFBQTtJQUFJQyxTQUFTLEVBQUM7RUFBb0IsR0FBQyxtQkFBcUIsQ0FBQyxlQUN6RDVFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBR0MsU0FBUyxFQUFDO0VBQXVCLEdBQUMsdUNBQXdDLENBQzFFLENBQUMsZUFDTjVFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ25ELE1BQU0scUJBQ0x4QixLQUFBLENBQUEyRSxhQUFBLENBQUM5QyxhQUFhO0lBQUNrRSxPQUFPO0VBQUEsZ0JBQ3BCL0YsS0FBQSxDQUFBMkUsYUFBQSxDQUFDbkUsTUFBTTtJQUFDb0UsU0FBUyxFQUFDO0VBQXNDLGdCQUN0RDVFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQzdDLFNBQVM7SUFBQzhDLFNBQVMsRUFBQztFQUFjLENBQUUsQ0FBQyxrQkFFaEMsQ0FDSyxDQUFDLGVBQ2hCNUUsS0FBQSxDQUFBMkUsYUFBQSxDQUFDbEQsYUFBYSxxQkFDWnpCLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ2hELFlBQVkscUJBQ1gzQixLQUFBLENBQUEyRSxhQUFBLENBQUMvQyxXQUFXLFFBQUMsZ0JBQTJCLENBQUMsZUFDekM1QixLQUFBLENBQUEyRSxhQUFBLENBQUNqRCxpQkFBaUIsUUFBQyx5Q0FFQSxDQUNQLENBQUMsZUFDZjFCLEtBQUEsQ0FBQTJFLGFBQUE7SUFBS0MsU0FBUyxFQUFDO0VBQVcsZ0JBQ3hCNUUsS0FBQSxDQUFBMkUsYUFBQSwyQkFDRTNFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBT0MsU0FBUyxFQUFDO0VBQXFCLEdBQUMsY0FBbUIsQ0FBQyxlQUMzRDVFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ2hFLE1BQU07SUFBQ3FGLEtBQUssRUFBRTlDLGFBQWEsQ0FBQ0UsT0FBUTtJQUFDNkMsYUFBYSxFQUFHRCxLQUFLLElBQUs3QyxnQkFBZ0IsQ0FBQztNQUFFLEdBQUdELGFBQWE7TUFBRUUsT0FBTyxFQUFFNEM7SUFBTSxDQUFDO0VBQUUsZ0JBQ3JIaEcsS0FBQSxDQUFBMkUsYUFBQSxDQUFDN0QsYUFBYSxxQkFDWmQsS0FBQSxDQUFBMkUsYUFBQSxDQUFDNUQsV0FBVztJQUFDbUYsV0FBVyxFQUFDO0VBQTJCLENBQUUsQ0FDekMsQ0FBQyxlQUNoQmxHLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQy9ELGFBQWEscUJBQ1paLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQzlELFVBQVU7SUFBQ21GLEtBQUssRUFBQztFQUFHLEdBQUMsZ0NBQTBDLENBQUMsZUFDakVoRyxLQUFBLENBQUEyRSxhQUFBLENBQUM5RCxVQUFVO0lBQUNtRixLQUFLLEVBQUM7RUFBRyxHQUFDLDJCQUFxQyxDQUFDLGVBQzVEaEcsS0FBQSxDQUFBMkUsYUFBQSxDQUFDOUQsVUFBVTtJQUFDbUYsS0FBSyxFQUFDO0VBQUcsR0FBQyxzQkFBZ0MsQ0FDekMsQ0FDVCxDQUNMLENBQUMsZUFDTmhHLEtBQUEsQ0FBQTJFLGFBQUEsMkJBQ0UzRSxLQUFBLENBQUEyRSxhQUFBO0lBQU9DLFNBQVMsRUFBQztFQUFxQixHQUFDLGlCQUFzQixDQUFDLGVBQzlENUUsS0FBQSxDQUFBMkUsYUFBQSxDQUFDaEUsTUFBTTtJQUFDcUYsS0FBSyxFQUFFOUMsYUFBYSxDQUFDRyxhQUFjO0lBQUM0QyxhQUFhLEVBQUdELEtBQUssSUFBSzdDLGdCQUFnQixDQUFDO01BQUUsR0FBR0QsYUFBYTtNQUFFRyxhQUFhLEVBQUUyQztJQUFNLENBQUM7RUFBRSxnQkFDakloRyxLQUFBLENBQUEyRSxhQUFBLENBQUM3RCxhQUFhLHFCQUNaZCxLQUFBLENBQUEyRSxhQUFBLENBQUM1RCxXQUFXO0lBQUNtRixXQUFXLEVBQUM7RUFBb0IsQ0FBRSxDQUNsQyxDQUFDLGVBQ2hCbEcsS0FBQSxDQUFBMkUsYUFBQSxDQUFDL0QsYUFBYSxxQkFDWlosS0FBQSxDQUFBMkUsYUFBQSxDQUFDOUQsVUFBVTtJQUFDbUYsS0FBSyxFQUFDO0VBQXlCLEdBQUMseUJBQW1DLENBQUMsZUFDaEZoRyxLQUFBLENBQUEyRSxhQUFBLENBQUM5RCxVQUFVO0lBQUNtRixLQUFLLEVBQUM7RUFBd0IsR0FBQywwQkFBb0MsQ0FBQyxlQUNoRmhHLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQzlELFVBQVU7SUFBQ21GLEtBQUssRUFBQztFQUF5QixHQUFDLHVCQUFpQyxDQUNoRSxDQUNULENBQ0wsQ0FBQyxlQUNOaEcsS0FBQSxDQUFBMkUsYUFBQSwyQkFDRTNFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBT0MsU0FBUyxFQUFDO0VBQXFCLEdBQUMsaUNBQXNDLENBQUMsZUFDOUU1RSxLQUFBLENBQUEyRSxhQUFBLENBQUNsRSxLQUFLO0lBQ0owRixJQUFJLEVBQUMsTUFBTTtJQUNYSCxLQUFLLEVBQUU5QyxhQUFhLENBQUNJLGNBQWU7SUFDcEM4QyxRQUFRLEVBQUdDLENBQUMsSUFBS2xELGdCQUFnQixDQUFDO01BQUUsR0FBR0QsYUFBYTtNQUFFSSxjQUFjLEVBQUUrQyxDQUFDLENBQUNDLE1BQU0sQ0FBQ047SUFBTSxDQUFDO0VBQUUsQ0FDekYsQ0FDRSxDQUFDLGVBQ05oRyxLQUFBLENBQUEyRSxhQUFBLENBQUNuRSxNQUFNO0lBQUMrRixPQUFPLEVBQUV6QixtQkFBb0I7SUFBQzBCLFFBQVEsRUFBRXhELFlBQWE7SUFBQzRCLFNBQVMsRUFBQztFQUFRLEdBQzdFNUIsWUFBWSxHQUFHLGVBQWUsR0FBRyxnQkFDNUIsQ0FDTCxDQUNRLENBQ1QsQ0FDTCxDQUFDLGVBR05oRCxLQUFBLENBQUEyRSxhQUFBO0lBQUtDLFNBQVMsRUFBQztFQUF1QyxnQkFDcEQ1RSxLQUFBLENBQUEyRSxhQUFBLENBQUN2RSxJQUFJLHFCQUNISixLQUFBLENBQUEyRSxhQUFBLENBQUN0RSxXQUFXO0lBQUN1RSxTQUFTLEVBQUM7RUFBSyxnQkFDMUI1RSxLQUFBLENBQUEyRSxhQUFBO0lBQUtDLFNBQVMsRUFBQztFQUFtQyxnQkFDaEQ1RSxLQUFBLENBQUEyRSxhQUFBLDJCQUNFM0UsS0FBQSxDQUFBMkUsYUFBQTtJQUFHQyxTQUFTLEVBQUM7RUFBMkMsR0FBQyxvQkFBcUIsQ0FBQyxlQUMvRTVFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBR0MsU0FBUyxFQUFDO0VBQW9CLEdBQUVwQyxXQUFXLENBQUM0QixNQUFNLENBQUNxQyxDQUFDLElBQUlBLENBQUMsQ0FBQ3pDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQ2lCLE1BQVUsQ0FDekYsQ0FBQyxlQUNOakYsS0FBQSxDQUFBMkUsYUFBQSxDQUFDNUMsT0FBTztJQUFDNkMsU0FBUyxFQUFDO0VBQXNCLENBQUUsQ0FDeEMsQ0FDTSxDQUNULENBQUMsZUFDUDVFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3ZFLElBQUkscUJBQ0hKLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3RFLFdBQVc7SUFBQ3VFLFNBQVMsRUFBQztFQUFLLGdCQUMxQjVFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBS0MsU0FBUyxFQUFDO0VBQW1DLGdCQUNoRDVFLEtBQUEsQ0FBQTJFLGFBQUEsMkJBQ0UzRSxLQUFBLENBQUEyRSxhQUFBO0lBQUdDLFNBQVMsRUFBQztFQUEyQyxHQUFDLGlCQUFrQixDQUFDLGVBQzVFNUUsS0FBQSxDQUFBMkUsYUFBQTtJQUFHQyxTQUFTLEVBQUM7RUFBaUMsR0FBRXBDLFdBQVcsQ0FBQzRCLE1BQU0sQ0FBQ3FDLENBQUMsSUFBSUEsQ0FBQyxDQUFDekMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDaUIsTUFBVSxDQUN2RyxDQUFDLGVBQ05qRixLQUFBLENBQUEyRSxhQUFBLENBQUMzQyxRQUFRO0lBQUM0QyxTQUFTLEVBQUM7RUFBc0IsQ0FBRSxDQUN6QyxDQUNNLENBQ1QsQ0FBQyxlQUNQNUUsS0FBQSxDQUFBMkUsYUFBQSxDQUFDdkUsSUFBSSxxQkFDSEosS0FBQSxDQUFBMkUsYUFBQSxDQUFDdEUsV0FBVztJQUFDdUUsU0FBUyxFQUFDO0VBQUssZ0JBQzFCNUUsS0FBQSxDQUFBMkUsYUFBQTtJQUFLQyxTQUFTLEVBQUM7RUFBbUMsZ0JBQ2hENUUsS0FBQSxDQUFBMkUsYUFBQSwyQkFDRTNFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBR0MsU0FBUyxFQUFDO0VBQTJDLEdBQUMsZ0JBQWlCLENBQUMsZUFDM0U1RSxLQUFBLENBQUEyRSxhQUFBO0lBQUdDLFNBQVMsRUFBQztFQUFvQixHQUFFcEMsV0FBVyxDQUFDNEIsTUFBTSxDQUFDcUMsQ0FBQyxJQUFJQSxDQUFDLENBQUN6QyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUNpQixNQUFVLENBQzNGLENBQUMsZUFDTmpGLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3hDLElBQUk7SUFBQ3lDLFNBQVMsRUFBQztFQUF3QixDQUFFLENBQ3ZDLENBQ00sQ0FDVCxDQUNILENBQUMsZUFHTjVFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3ZFLElBQUk7SUFBQ3dFLFNBQVMsRUFBQztFQUFhLGdCQUMzQjVFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3RFLFdBQVc7SUFBQ3VFLFNBQVMsRUFBQztFQUFLLGdCQUMxQjVFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBS0MsU0FBUyxFQUFDO0VBQStFLGdCQUM1RjVFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBS0MsU0FBUyxFQUFDO0VBQWlCLGdCQUM5QjVFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQzFDLE1BQU07SUFBQzJDLFNBQVMsRUFBQztFQUFxRCxDQUFFLENBQUMsZUFDMUU1RSxLQUFBLENBQUEyRSxhQUFBLENBQUNsRSxLQUFLO0lBQ0p5RixXQUFXLEVBQUMsdUJBQXVCO0lBQ25DRixLQUFLLEVBQUV0RCxVQUFXO0lBQ2xCMEQsUUFBUSxFQUFHQyxDQUFDLElBQUsxRCxhQUFhLENBQUMwRCxDQUFDLENBQUNDLE1BQU0sQ0FBQ04sS0FBSyxDQUFFO0lBQy9DcEIsU0FBUyxFQUFDO0VBQU8sQ0FDbEIsQ0FDRSxDQUFDLGVBQ041RSxLQUFBLENBQUEyRSxhQUFBLENBQUNoRSxNQUFNO0lBQUNxRixLQUFLLEVBQUVwRCxZQUFhO0lBQUNxRCxhQUFhLEVBQUVwRDtFQUFnQixnQkFDMUQ3QyxLQUFBLENBQUEyRSxhQUFBLENBQUM3RCxhQUFhO0lBQUM4RCxTQUFTLEVBQUM7RUFBVyxnQkFDbEM1RSxLQUFBLENBQUEyRSxhQUFBLENBQUN6QyxNQUFNO0lBQUMwQyxTQUFTLEVBQUM7RUFBYyxDQUFFLENBQUMsZUFDbkM1RSxLQUFBLENBQUEyRSxhQUFBLENBQUM1RCxXQUFXO0lBQUNtRixXQUFXLEVBQUM7RUFBa0IsQ0FBRSxDQUNoQyxDQUFDLGVBQ2hCbEcsS0FBQSxDQUFBMkUsYUFBQSxDQUFDL0QsYUFBYSxxQkFDWlosS0FBQSxDQUFBMkUsYUFBQSxDQUFDOUQsVUFBVTtJQUFDbUYsS0FBSyxFQUFDO0VBQUssR0FBQyxZQUFzQixDQUFDLGVBQy9DaEcsS0FBQSxDQUFBMkUsYUFBQSxDQUFDOUQsVUFBVTtJQUFDbUYsS0FBSyxFQUFDO0VBQVEsR0FBQyxRQUFrQixDQUFDLGVBQzlDaEcsS0FBQSxDQUFBMkUsYUFBQSxDQUFDOUQsVUFBVTtJQUFDbUYsS0FBSyxFQUFDO0VBQVUsR0FBQyxVQUFvQixDQUFDLGVBQ2xEaEcsS0FBQSxDQUFBMkUsYUFBQSxDQUFDOUQsVUFBVTtJQUFDbUYsS0FBSyxFQUFDO0VBQVMsR0FBQyxTQUFtQixDQUNsQyxDQUNULENBQ0wsQ0FDTSxDQUNULENBQUMsZUFHUGhHLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3ZFLElBQUk7SUFBQ3dFLFNBQVMsRUFBQztFQUFhLGdCQUMzQjVFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3JFLFVBQVUscUJBQ1ROLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3BFLFNBQVM7SUFBQ3FFLFNBQVMsRUFBQztFQUF5QixnQkFDNUM1RSxLQUFBLENBQUEyRSxhQUFBLENBQUM3QyxTQUFTO0lBQUM4QyxTQUFTLEVBQUM7RUFBUyxDQUFFLENBQUMseUJBQ1osRUFBQ1QsbUJBQW1CLENBQUNjLE1BQU0sRUFBQyxHQUN4QyxDQUNELENBQUMsZUFDYmpGLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3RFLFdBQVcscUJBQ1ZMLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQzNELEtBQUsscUJBQ0poQixLQUFBLENBQUEyRSxhQUFBLENBQUN2RCxXQUFXLHFCQUNWcEIsS0FBQSxDQUFBMkUsYUFBQSxDQUFDdEQsUUFBUSxxQkFDUHJCLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3hELFNBQVMsUUFBQyxPQUFnQixDQUFDLGVBQzVCbkIsS0FBQSxDQUFBMkUsYUFBQSxDQUFDeEQsU0FBUyxRQUFDLFVBQW1CLENBQUMsZUFDL0JuQixLQUFBLENBQUEyRSxhQUFBLENBQUN4RCxTQUFTLFFBQUMsWUFBcUIsQ0FBQyxlQUNqQ25CLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3hELFNBQVMsUUFBQyxnQkFBeUIsQ0FBQyxlQUNyQ25CLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3hELFNBQVMsUUFBQyxpQkFBMEIsQ0FBQyxlQUN0Q25CLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3hELFNBQVMsUUFBQyxRQUFpQixDQUFDLGVBQzdCbkIsS0FBQSxDQUFBMkUsYUFBQSxDQUFDeEQsU0FBUyxRQUFDLFNBQWtCLENBQ3JCLENBQ0MsQ0FBQyxlQUNkbkIsS0FBQSxDQUFBMkUsYUFBQSxDQUFDMUQsU0FBUyxRQUNQa0QsbUJBQW1CLENBQUNxQixHQUFHLENBQUVuQixVQUFVLGlCQUNsQ3JFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3RELFFBQVE7SUFBQ3lFLEdBQUcsRUFBRXpCLFVBQVUsQ0FBQ2I7RUFBRyxnQkFDM0J4RCxLQUFBLENBQUEyRSxhQUFBLENBQUN6RCxTQUFTLHFCQUNSbEIsS0FBQSxDQUFBMkUsYUFBQTtJQUFLQyxTQUFTLEVBQUM7RUFBNkIsZ0JBQzFDNUUsS0FBQSxDQUFBMkUsYUFBQSxDQUFDNUMsT0FBTztJQUFDNkMsU0FBUyxFQUFDO0VBQXNCLENBQUUsQ0FBQyxlQUM1QzVFLEtBQUEsQ0FBQTJFLGFBQUEsMkJBQ0UzRSxLQUFBLENBQUEyRSxhQUFBO0lBQUtDLFNBQVMsRUFBQztFQUFhLEdBQUVQLFVBQVUsQ0FBQ1osVUFBZ0IsQ0FBQyxlQUMxRHpELEtBQUEsQ0FBQTJFLGFBQUE7SUFBS0MsU0FBUyxFQUFDO0VBQStCLEdBQUMsTUFBSSxFQUFDUCxVQUFVLENBQUNYLFFBQWMsQ0FDMUUsQ0FDRixDQUNJLENBQUMsZUFDWjFELEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3pELFNBQVMscUJBQ1JsQixLQUFBLENBQUEyRSxhQUFBO0lBQUtDLFNBQVMsRUFBQztFQUE2QixnQkFDMUM1RSxLQUFBLENBQUEyRSxhQUFBLENBQUNyRCxNQUFNO0lBQUNzRCxTQUFTLEVBQUM7RUFBUyxnQkFDekI1RSxLQUFBLENBQUEyRSxhQUFBLENBQUNwRCxjQUFjLFFBQ1o4QyxVQUFVLENBQUNWLGFBQWEsQ0FBQzBCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQ0csR0FBRyxDQUFDa0IsQ0FBQyxJQUFJQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsSUFBSSxDQUFDLEVBQUUsQ0FDN0MsQ0FDVixDQUFDLGVBQ1QzRyxLQUFBLENBQUEyRSxhQUFBLDJCQUNFM0UsS0FBQSxDQUFBMkUsYUFBQTtJQUFLQyxTQUFTLEVBQUM7RUFBYSxHQUFFUCxVQUFVLENBQUNWLGFBQW1CLENBQUMsZUFDN0QzRCxLQUFBLENBQUEyRSxhQUFBO0lBQUtDLFNBQVMsRUFBQztFQUErQixHQUFFUCxVQUFVLENBQUNULGNBQW9CLENBQzVFLENBQ0YsQ0FDSSxDQUFDLGVBQ1o1RCxLQUFBLENBQUEyRSxhQUFBLENBQUN6RCxTQUFTLFFBQUVtRCxVQUFVLENBQUNSLFVBQXNCLENBQUMsZUFDOUM3RCxLQUFBLENBQUEyRSxhQUFBLENBQUN6RCxTQUFTLFFBQUUsSUFBSWlFLElBQUksQ0FBQ2QsVUFBVSxDQUFDUCxjQUFjLENBQUMsQ0FBQzhDLGtCQUFrQixDQUFDLENBQWEsQ0FBQyxlQUNqRjVHLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3pELFNBQVMsUUFDUG1ELFVBQVUsQ0FBQ04sZUFBZSxHQUFHLElBQUlvQixJQUFJLENBQUNkLFVBQVUsQ0FBQ04sZUFBZSxDQUFDLENBQUM2QyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsZUFDakYsQ0FBQyxlQUNaNUcsS0FBQSxDQUFBMkUsYUFBQSxDQUFDekQsU0FBUyxRQUFFd0QsY0FBYyxDQUFDTCxVQUFVLENBQUNMLE1BQU0sQ0FBYSxDQUFDLGVBQzFEaEUsS0FBQSxDQUFBMkUsYUFBQSxDQUFDekQsU0FBUyxRQUNQbUQsVUFBVSxDQUFDTCxNQUFNLEtBQUssUUFBUSxpQkFDN0JoRSxLQUFBLENBQUEyRSxhQUFBLENBQUNuRSxNQUFNO0lBQ0xxRSxPQUFPLEVBQUMsU0FBUztJQUNqQmdDLElBQUksRUFBQyxJQUFJO0lBQ1ROLE9BQU8sRUFBRUEsQ0FBQSxLQUFNakIsaUJBQWlCLENBQUNqQixVQUFVLENBQUNiLEVBQUU7RUFBRSxnQkFFaER4RCxLQUFBLENBQUEyRSxhQUFBLENBQUN4QyxJQUFJO0lBQUN5QyxTQUFTLEVBQUM7RUFBYyxDQUFFLENBQUMsVUFFM0IsQ0FFRCxDQUNILENBQ1gsQ0FDUSxDQUNOLENBQ0ksQ0FDVCxDQUFDLEVBRU5ULG1CQUFtQixDQUFDYyxNQUFNLEtBQUssQ0FBQyxpQkFDL0JqRixLQUFBLENBQUEyRSxhQUFBLENBQUN2RSxJQUFJO0lBQUN3RSxTQUFTLEVBQUM7RUFBYSxnQkFDM0I1RSxLQUFBLENBQUEyRSxhQUFBLENBQUN0RSxXQUFXO0lBQUN1RSxTQUFTLEVBQUM7RUFBa0IsZ0JBQ3ZDNUUsS0FBQSxDQUFBMkUsYUFBQSxDQUFDN0MsU0FBUztJQUFDOEMsU0FBUyxFQUFDO0VBQThDLENBQUUsQ0FBQyxlQUN0RTVFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBSUMsU0FBUyxFQUFDO0VBQTBCLEdBQUMsc0JBQXdCLENBQUMsZUFDbEU1RSxLQUFBLENBQUEyRSxhQUFBO0lBQUdDLFNBQVMsRUFBQztFQUF1QixHQUNqQ2xDLFVBQVUsSUFBSUUsWUFBWSxLQUFLLEtBQUssR0FDakMsK0NBQStDLEdBQy9DLG9EQUNILENBQ1EsQ0FDVCxDQUVMLENBQUM7QUFFVixDQUFDO0FBRUQsZUFBZVAsZUFBZSIsImlnbm9yZUxpc3QiOltdfQ==