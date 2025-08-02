import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { FileText, Package, Wrench, CheckCircle, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const RequestForm = ({ onSubmit }) => {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [assetsError, setAssetsError] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    title: '',
    description: '',
    quantity: 1,
    urgency: 'medium',
    justification: '',
    estimatedCost: '',
    assetId: '' // For repair requests
  });

  // API configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || user?.token;
  };

  // Fetch available assets for repair requests
  const fetchAvailableAssets = async () => {
    setIsLoadingAssets(true);
    setAssetsError(null);

    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/assets/available`, {
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
          throw new Error('Forbidden: You do not have permission to view assets');
        } else if (response.status === 404) {
          throw new Error('Assets endpoint not found');
        } else {
          throw new Error(`Failed to fetch assets: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();

      // Validate response structure
      if (!Array.isArray(data.assets) && !Array.isArray(data)) {
        throw new Error('Invalid response format: Expected array of assets');
      }

      const assetsArray = data.assets || data;
      setAvailableAssets(assetsArray);

    } catch (err) {
      console.error('Error fetching assets:', err);
      setAssetsError(err.message);
      toast({
        title: "Warning",
        description: `Could not load assets: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoadingAssets(false);
    }
  };

  // Load assets when repair type is selected
  useEffect(() => {
    if (formData.type === 'repair' && availableAssets.length === 0) {
      fetchAvailableAssets();
    }
  }, [formData.type]);

  // Form validation
  const validateForm = () => {
    const errors = [];

    // Required fields
    if (!formData.type) errors.push('Request type is required');
    if (!formData.title?.trim()) errors.push('Request title is required');
    if (!formData.description?.trim()) errors.push('Description is required');

    // Type-specific validation
    if (formData.type === 'new_asset') {
      if (!formData.category) errors.push('Asset category is required');
      if (formData.quantity < 1) errors.push('Quantity must be at least 1');
      if (formData.estimatedCost && isNaN(parseFloat(formData.estimatedCost))) {
        errors.push('Estimated cost must be a valid number');
      }
    }

    if (formData.type === 'repair') {
      if (!formData.assetId) errors.push('Asset to repair is required');
    }

    // Email validation for user
    if (user?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.push('User email is invalid');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors[0],
        variant: "destructive",
      });
      return;
    }

    // Check user authentication
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAuthToken();

      // Prepare request payload
      const requestPayload = {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        urgency: formData.urgency,
        justification: formData.justification?.trim() || '',
        userId: user.id,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Add type-specific fields
      if (formData.type === 'new_asset') {
        requestPayload.category = formData.category;
        requestPayload.quantity = parseInt(formData.quantity) || 1;
        if (formData.estimatedCost) {
          requestPayload.estimatedCost = parseFloat(formData.estimatedCost);
        }
      } else if (formData.type === 'repair') {
        requestPayload.assetId = formData.assetId;
      }

      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid request data');
        } else if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        } else if (response.status === 403) {
          throw new Error('Forbidden: You do not have permission to submit requests');
        } else if (response.status === 422) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Validation failed');
        } else if (response.status === 429) {
          throw new Error('Too many requests: Please wait before submitting again');
        } else {
          throw new Error(`Request submission failed: ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json();

      toast({
        title: "Request Submitted Successfully",
        description: `Your ${formData.type === 'new_asset' ? 'asset request' : 'repair request'} has been submitted and is pending review.`,
        variant: "default"
      });

      // Reset form
      setFormData({
        type: '',
        category: '',
        title: '',
        description: '',
        quantity: 1,
        urgency: 'medium',
        justification: '',
        estimatedCost: '',
        assetId: ''
      });

      // Call parent callback if provided
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit(result.request || result);
      }

    } catch (error) {
      console.error('Request submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Reset dependent fields when type changes
      if (field === 'type') {
        if (value === 'new_asset') {
          newData.assetId = '';
        } else if (value === 'repair') {
          newData.category = '';
          newData.quantity = 1;
          newData.estimatedCost = '';
        }
      }

      return newData;
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatAssetOption = (asset) => {
    return `${asset.name} - ${asset.assetTag || asset.id}`;
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
              <p className="text-muted-foreground">You must be logged in to submit requests.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Submit Request</h1>
        <p className="text-muted-foreground">Request new assets or repairs for existing ones</p>
        {user && (
          <p className="text-sm text-muted-foreground mt-2">
            Submitting as: <span className="font-medium">{user.name}</span> ({user.email})
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Request Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Request Type
            </CardTitle>
            <CardDescription>What type of request are you making?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleFormChange('type', value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="new_asset" id="new_asset" />
                <Label htmlFor="new_asset" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-medium">New Asset</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Request a new asset for your department</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="repair" id="repair" />
                <Label htmlFor="repair" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" />
                    <span className="font-medium">Repair Request</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Request repair for an existing asset</p>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Basic Information */}
        {formData.type && (
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
              <CardDescription>
                Provide detailed information about your {formData.type === 'new_asset' ? 'asset' : 'repair'} request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.type === 'new_asset' && (
                <div>
                  <Label htmlFor="category">Asset Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleFormChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="supplies">Office Supplies</SelectItem>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                      <SelectItem value="tools">Tools</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.type === 'repair' && (
                <div>
                  <Label htmlFor="assetId">Asset to Repair *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.assetId}
                      onValueChange={(value) => handleFormChange('assetId', value)}
                      disabled={isLoadingAssets}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={
                          isLoadingAssets ? "Loading assets..." :
                          assetsError ? "Error loading assets" :
                          availableAssets.length === 0 ? "No assets available" :
                          "Select asset to repair"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAssets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id.toString()}>
                            {formatAssetOption(asset)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={fetchAvailableAssets}
                      disabled={isLoadingAssets}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingAssets ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  {assetsError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                      <XCircle className="h-4 w-4" />
                      {assetsError}
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="title">Request Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder={formData.type === 'new_asset' ?
                    "e.g., New laptop for development team" :
                    "e.g., Fix printer paper jam issue"
                  }
                  maxLength={100}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder={formData.type === 'new_asset' ?
                    "Describe the asset you need, specifications, intended use, etc." :
                    "Describe the problem with the asset, error messages, when it started, etc."
                  }
                  rows={4}
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {formData.type === 'new_asset' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.quantity}
                      onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedCost">Estimated Cost (Optional)</Label>
                    <Input
                      id="estimatedCost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.estimatedCost}
                      onChange={(e) => handleFormChange('estimatedCost', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Priority and Justification */}
        {formData.type && (
          <Card>
            <CardHeader>
              <CardTitle>Priority & Justification</CardTitle>
              <CardDescription>Help us understand the urgency and business need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Urgency Level *</Label>
                <RadioGroup
                  value={formData.urgency}
                  onValueChange={(value) => handleFormChange('urgency', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div>
                        <span className="font-medium">Low Priority</span>
                        <p className="text-xs text-muted-foreground">Can wait weeks or months</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div>
                        <span className="font-medium">Medium Priority</span>
                        <p className="text-xs text-muted-foreground">Needed within days or weeks</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div>
                        <span className="font-medium">High Priority</span>
                        <p className="text-xs text-muted-foreground">Urgent, blocks work or critical business function</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="justification">Business Justification</Label>
                <Textarea
                  id="justification"
                  value={formData.justification}
                  onChange={(e) => handleFormChange('justification', e.target.value)}
                  placeholder="Explain how this request supports business objectives, impacts productivity, or addresses compliance requirements..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.justification.length}/500 characters (optional but recommended)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            <p>Request will be reviewed by the procurement team</p>
            <p className="text-xs mt-1">You will receive email notifications about status updates</p>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.type || !formData.title?.trim() || !formData.description?.trim()}
            className="bg-gradient-primary hover:opacity-90 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
