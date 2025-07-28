import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Package, Calendar, User, MapPin, Edit, UserPlus, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const AssetDetail = ({
  assetId,
  onClose
}) => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockAsset = {
      id: assetId,
      name: 'Dell Laptop XPS 13',
      category: 'Electronics',
      description: 'High-performance laptop for development work with Intel i7 processor, 16GB RAM, and 512GB SSD',
      quantity: 5,
      status: 'available',
      created_at: '2024-01-15',
      serial_number: 'DLL-XPS13-2024-001',
      purchase_date: '2024-01-15',
      purchase_cost: 1299.99,
      location: 'IT Storage Room',
      image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
    };
    setTimeout(() => {
      setAsset(mockAsset);
      setIsLoading(false);
    }, 500);
  }, [assetId]);
  const getStatusBadge = status => {
    switch (status) {
      case 'available':
        return /*#__PURE__*/React.createElement(Badge, {
          className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        }, /*#__PURE__*/React.createElement(CheckCircle, {
          className: "h-3 w-3 mr-1"
        }), "Available");
      case 'allocated':
        return /*#__PURE__*/React.createElement(Badge, {
          className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        }, /*#__PURE__*/React.createElement(User, {
          className: "h-3 w-3 mr-1"
        }), "Allocated");
      case 'maintenance':
        return /*#__PURE__*/React.createElement(Badge, {
          className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
        }, /*#__PURE__*/React.createElement(AlertTriangle, {
          className: "h-3 w-3 mr-1"
        }), "Maintenance");
      default:
        return /*#__PURE__*/React.createElement(Badge, {
          variant: "secondary"
        }, "Unknown");
    }
  };
  const handleAllocateAsset = async () => {
    if (!selectedEmployee) {
      toast({
        title: "Error",
        description: "Please select an employee to allocate the asset to.",
        variant: "destructive"
      });
      return;
    }
    setIsAllocating(true);
    // Mock API call
    setTimeout(() => {
      if (asset) {
        setAsset({
          ...asset,
          status: 'allocated',
          allocated_to: selectedEmployee
        });
        toast({
          title: "Asset Allocated",
          description: `Asset has been allocated to ${selectedEmployee}.`
        });
      }
      setIsAllocating(false);
      setSelectedEmployee('');
    }, 1000);
  };
  const canEdit = user?.role === 'Admin' || user?.role === 'Procurement';
  const canAllocate = (user?.role === 'Admin' || user?.role === 'Procurement') && asset?.status === 'available';
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-6 space-y-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "animate-pulse"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-8 bg-muted rounded w-1/3 mb-4"
    }), /*#__PURE__*/React.createElement("div", {
      className: "h-64 bg-muted rounded mb-6"
    }), /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-4 bg-muted rounded w-full"
    }), /*#__PURE__*/React.createElement("div", {
      className: "h-4 bg-muted rounded w-2/3"
    }), /*#__PURE__*/React.createElement("div", {
      className: "h-4 bg-muted rounded w-1/2"
    }))));
  }
  if (!asset) {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-6 text-center"
    }, /*#__PURE__*/React.createElement(Package, {
      className: "h-12 w-12 text-muted-foreground mx-auto mb-4"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-medium mb-2"
    }, "Asset not found"), /*#__PURE__*/React.createElement("p", {
      className: "text-muted-foreground"
    }, "The requested asset could not be found."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 space-y-6 max-w-4xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, asset.name), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, getStatusBadge(asset.status), /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-muted-foreground"
  }, "ID: ", asset.id))), canEdit && /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Edit, {
    className: "h-4 w-4 mr-2"
  }), "Edit Asset")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-6"
  }, asset.image_url ? /*#__PURE__*/React.createElement("img", {
    src: asset.image_url,
    alt: asset.name,
    className: "w-full h-64 object-cover rounded-lg"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "w-full h-64 bg-muted rounded-lg flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Package, {
    className: "h-16 w-16 text-muted-foreground"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-6"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Asset Information")), /*#__PURE__*/React.createElement(CardContent, {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium text-muted-foreground"
  }, "Category"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm"
  }, asset.category)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium text-muted-foreground"
  }, "Quantity"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm"
  }, asset.quantity)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium text-muted-foreground"
  }, "Serial Number"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm"
  }, asset.serial_number || 'N/A')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium text-muted-foreground"
  }, "Location"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm flex items-center"
  }, /*#__PURE__*/React.createElement(MapPin, {
    className: "h-3 w-3 mr-1"
  }), asset.location || 'Not specified'))), /*#__PURE__*/React.createElement(Separator, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium text-muted-foreground"
  }, "Description"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm mt-1"
  }, asset.description)))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Purchase Information")), /*#__PURE__*/React.createElement(CardContent, {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium text-muted-foreground"
  }, "Purchase Date"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm flex items-center"
  }, /*#__PURE__*/React.createElement(Calendar, {
    className: "h-3 w-3 mr-1"
  }), asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : 'N/A')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium text-muted-foreground"
  }, "Purchase Cost"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm"
  }, asset.purchase_cost ? `$${asset.purchase_cost.toFixed(2)}` : 'N/A'))))), canAllocate && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Asset Allocation"), /*#__PURE__*/React.createElement(CardDescription, null, "Allocate this asset to an employee")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4"
  }, /*#__PURE__*/React.createElement(Select, {
    value: selectedEmployee,
    onValueChange: setSelectedEmployee
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select employee"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "john.doe@company.com"
  }, "John Doe - Engineering"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "jane.smith@company.com"
  }, "Jane Smith - Marketing"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "mike.johnson@company.com"
  }, "Mike Johnson - Sales"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "sarah.wilson@company.com"
  }, "Sarah Wilson - HR"))), /*#__PURE__*/React.createElement(Button, {
    onClick: handleAllocateAsset,
    disabled: isAllocating || !selectedEmployee
  }, /*#__PURE__*/React.createElement(UserPlus, {
    className: "h-4 w-4 mr-2"
  }), isAllocating ? 'Allocating...' : 'Allocate')))), asset.allocated_to && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Currently Allocated To")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(User, {
    className: "h-4 w-4 text-primary"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, asset.allocated_to)))))));
};
export default AssetDetail;
