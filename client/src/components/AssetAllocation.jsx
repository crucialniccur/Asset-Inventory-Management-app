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
import { UserCheck, Package, Calendar, Search, Filter, Undo, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

// API service functions
const apiService = {
  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  },

  // Fetch all allocations
  async getAllocations() {
    const response = await fetch('/api/allocations', {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch allocations: ${response.status}`);
    }
    
    return await response.json();
  },

  // Fetch available assets (status = 'available')
  async getAvailableAssets() {
    const response = await fetch('/api/assets', {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.status}`);
    }
    
    const assets = await response.json();
    // Filter only available assets
    return assets.filter(asset => asset.status === 'available');
  },

  // Fetch all users (for employee selection)
  async getUsers() {
    const response = await fetch('/api/users', {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    return await response.json();
  },

  // Create new allocation
  async createAllocation(allocationData) {
    const response = await fetch('/api/allocations', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(allocationData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create allocation: ${response.status}`);
    }
    
    return await response.json();
  },

  // Return asset (update allocation status)
  async returnAsset(allocationId) {
    const response = await fetch(`/api/allocations/${allocationId}/return`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to return asset: ${response.status}`);
    }
    
    return await response.json();
  }
};

const AssetAllocation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [allocations, setAllocations] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const [isReturning, setIsReturning] = useState({});
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newAllocation, setNewAllocation] = useState({
    assetId: '',
    employeeEmail: '',
    expectedReturn: ''
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [allocationsData, assetsData, usersData] = await Promise.all([
          apiService.getAllocations(),
          apiService.getAvailableAssets(),
          apiService.getUsers()
        ]);
        
        setAllocations(allocationsData);
        setAvailableAssets(assetsData);
        // Filter out current user and only show employees who can receive allocations
        setUsers(usersData.filter(u => u.id !== user?.id));
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchInitialData();
    }
  }, [user, toast]);

  // Filter allocations based on search and status
  const filteredAllocations = allocations.filter(allocation => {
    const assetName = allocation.asset?.name || allocation.asset_name || '';
    const employeeName = allocation.user?.name || allocation.employee_name || '';
    const employeeEmail = allocation.user?.email || allocation.employee_email || '';
    const department = allocation.user?.department || allocation.department || '';
    
    const matchesSearch = assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employeeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || allocation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get status badge component
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Active
          </Badge>
        );
      case 'returned':
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Returned
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Calculate if allocation is overdue
  const isAllocationOverdue = (allocation) => {
    if (!allocation.expected_return && !allocation.expected_return_date) return false;
    const returnDate = new Date(allocation.expected_return || allocation.expected_return_date);
    const today = new Date();
    return today > returnDate && allocation.status === 'active';
  };

  // Handle new allocation
  const handleNewAllocation = async () => {
    if (!newAllocation.assetId || !newAllocation.employeeEmail) {
      toast({
        title: "Validation Error",
        description: "Please select both an asset and an employee.",
        variant: "destructive"
      });
      return;
    }

    setIsAllocating(true);

    try {
      // Find user by email
      const selectedUser = users.find(user => user.email === newAllocation.employeeEmail);
      if (!selectedUser) {
        throw new Error('Selected user not found');
      }

      const allocationData = {
        asset_id: parseInt(newAllocation.assetId),
        user_id: selectedUser.id,
        expected_return_date: newAllocation.expectedReturn || null
      };

      await apiService.createAllocation(allocationData);
      
      // Refresh data after successful allocation
      const [updatedAllocations, updatedAssets] = await Promise.all([
        apiService.getAllocations(),
        apiService.getAvailableAssets()
      ]);
      
      setAllocations(updatedAllocations);
      setAvailableAssets(updatedAssets);
      
      // Reset form
      setNewAllocation({
        assetId: '',
        employeeEmail: '',
        expectedReturn: ''
      });
      
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Asset has been successfully allocated."
      });
      
    } catch (error) {
      console.error('Error creating allocation:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsAllocating(false);
    }
  };

  // Handle asset return
  const handleReturnAsset = async (allocationId) => {
    setIsReturning(prev => ({ ...prev, [allocationId]: true }));

    try {
      await apiService.returnAsset(allocationId);
      
      // Refresh allocations data
      const updatedAllocations = await apiService.getAllocations();
      setAllocations(updatedAllocations);
      
      // Refresh available assets
      const updatedAssets = await apiService.getAvailableAssets();
      setAvailableAssets(updatedAssets);
      
      toast({
        title: "Success",
        description: "Asset has been successfully returned."
      });
      
    } catch (error) {
      console.error('Error returning asset:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsReturning(prev => ({ ...prev, [allocationId]: false }));
    }
  };

  // Check user permissions
  const canManageAllocations = user?.role === 'Admin' || user?.role === 'Procurement';

  // Access restriction component
  if (!canManageAllocations) {
    return (
      <div className="p-6 text-center">
        <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
        <p className="text-muted-foreground">
          Only administrators and procurement managers can manage asset allocations.
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading asset allocations...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Calculate statistics with overdue detection
  const activeAllocations = allocations.filter(a => a.status === 'active');
  const overdueAllocations = allocations.filter(a => a.status === 'active' && isAllocationOverdue(a));
  const returnedAllocations = allocations.filter(a => a.status === 'returned');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Asset Allocations</h1>
          <p className="text-muted-foreground">Manage asset assignments to employees</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <UserCheck className="h-4 w-4 mr-2" />
              New Allocation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Allocate Asset</DialogTitle>
              <DialogDescription>
                Assign an asset to an employee for use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Asset</label>
                <Select
                  value={newAllocation.assetId}
                  onValueChange={(value) => setNewAllocation({ ...newAllocation, assetId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an available asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAssets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id.toString()}>
                        {asset.name} {asset.brand && `- ${asset.brand}`} {asset.model_number && `(${asset.model_number})`}
                      </SelectItem>
                    ))}
                    {availableAssets.length === 0 && (
                      <SelectItem disabled value="none">No assets available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Select Employee</label>
                <Select
                  value={newAllocation.employeeEmail}
                  onValueChange={(value) => setNewAllocation({ ...newAllocation, employeeEmail: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.email}>
                        {user.name || user.email} - {user.role}
                      </SelectItem>
                    ))}
                    {users.length === 0 && (
                      <SelectItem disabled value="none">No employees available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Expected Return Date (Optional)</label>
                <Input
                  type="date"
                  value={newAllocation.expectedReturn}
                  onChange={(e) => setNewAllocation({ ...newAllocation, expectedReturn: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <Button
                onClick={handleNewAllocation}
                disabled={isAllocating}
                className="w-full"
              >
                {isAllocating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAllocating ? 'Allocating...' : 'Allocate Asset'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Allocations</p>
                <p className="text-2xl font-bold">{activeAllocations.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Returns</p>
                <p className="text-2xl font-bold text-red-600">{overdueAllocations.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Returned</p>
                <p className="text-2xl font-bold">{returnedAllocations.length}</p>
              </div>
              <Undo className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search allocations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Allocations Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Current Allocations ({filteredAllocations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Allocated Date</TableHead>
                <TableHead>Expected Return</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAllocations.map((allocation) => {
                const isOverdue = isAllocationOverdue(allocation);
                const status = isOverdue ? 'overdue' : allocation.status;
                
                // Handle both API response formats (with relationships and flat structure)
                const assetName = allocation.asset?.name || allocation.asset_name || 'Unknown Asset';
                const assetId = allocation.asset?.id || allocation.asset_id || 'N/A';
                const employeeName = allocation.user?.name || allocation.employee_name || 'Unknown Employee';
                const employeeEmail = allocation.user?.email || allocation.employee_email || '';
                const department = allocation.user?.department || allocation.department || 'Unknown';
                const allocatedDate = allocation.allocated_date || allocation.created_at || '';
                const expectedReturn = allocation.expected_return || allocation.expected_return_date || '';
                
                return (
                  <TableRow key={allocation.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium">{assetName}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {assetId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {employeeName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employeeName}</div>
                          <div className="text-sm text-muted-foreground">{employeeEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{department}</TableCell>
                    <TableCell>
                      {allocatedDate ? new Date(allocatedDate).toLocaleDateString() : 'Not specified'}
                    </TableCell>
                    <TableCell>
                      {expectedReturn ? new Date(expectedReturn).toLocaleDateString() : 'Not specified'}
                    </TableCell>
                    <TableCell>{getStatusBadge(status)}</TableCell>
                    <TableCell>
                      {allocation.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReturnAsset(allocation.id)}
                          disabled={isReturning[allocation.id]}
                        >
                          {isReturning[allocation.id] ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Undo className="h-3 w-3 mr-1" />
                          )}
                          Return
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredAllocations.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No allocations found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by making your first asset allocation.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssetAllocation;
