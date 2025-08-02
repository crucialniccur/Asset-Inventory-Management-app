function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import CloudinaryUpload from './CloudinaryUpload';
import { useToast } from '../hooks/use-toast';
import { Package, Upload } from 'lucide-react';
const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  cost: z.string().min(1, 'Cost is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  warrantyExpiry: z.string().optional(),
  location: z.string().min(1, 'Location is required')
});
const AddAssetForm = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const {
    toast
  } = useToast();
  const form = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      quantity: '',
      cost: '',
      supplier: '',
      purchaseDate: '',
      warrantyExpiry: '',
      location: ''
    }
  });
  const handleFileUpload = (files) => {
  setUploadedFiles(files);
  };
  const onSubmit = async (data) => {
  if (uploadedFiles.length === 0) {
    toast({
      title: "Image required",
      description: "Please upload at least one image",
      variant: "destructive"
    });
    return;
  }

  const assetData = {
    ...data,
    image_url: uploadedFiles[0].url || uploadedFiles[0]
  };

  try {
    const res = await fetch('/api/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${yourJwtToken}`
      },
      body: JSON.stringify(assetData)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Asset creation failed");
    }

    const response = await res.json();
    toast({
      title: "Success",
      description: `${response.asset.name} added successfully!`
    });

    form.reset();
    setUploadedFiles([]);
  } catch (err) {
    toast({
      title: "Error",
      description: err.message,
      variant: "destructive"
    });
  }
};

  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Package, {
    className: "h-5 w-5"
  }), "Asset Details")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Form, form, /*#__PURE__*/React.createElement("form", {
    onSubmit: form.handleSubmit(onSubmit),
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement(FormField, {
    control: form.control,
    name: "name",
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(FormItem, null, /*#__PURE__*/React.createElement(FormLabel, null, "Asset Name"), /*#__PURE__*/React.createElement(FormControl, null, /*#__PURE__*/React.createElement(Input, _extends({
      placeholder: "Enter asset name"
    }, field))), /*#__PURE__*/React.createElement(FormMessage, null))
  }), /*#__PURE__*/React.createElement(FormField, {
    control: form.control,
    name: "description",
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(FormItem, null, /*#__PURE__*/React.createElement(FormLabel, null, "Description"), /*#__PURE__*/React.createElement(FormControl, null, /*#__PURE__*/React.createElement(Textarea, _extends({
      placeholder: "Enter asset description",
      className: "resize-none",
      rows: 3
    }, field))), /*#__PURE__*/React.createElement(FormMessage, null))
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(FormField, {
    control: form.control,
    name: "category",
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(FormItem, null, /*#__PURE__*/React.createElement(FormLabel, null, "Category"), /*#__PURE__*/React.createElement(Select, {
      onValueChange: field.onChange,
      defaultValue: field.value
    }, /*#__PURE__*/React.createElement(FormControl, null, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
      placeholder: "Select category"
    }))), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
      value: "laptop"
    }, "Laptop"), /*#__PURE__*/React.createElement(SelectItem, {
      value: "desktop"
    }, "Desktop"), /*#__PURE__*/React.createElement(SelectItem, {
      value: "monitor"
    }, "Monitor"), /*#__PURE__*/React.createElement(SelectItem, {
      value: "printer"
    }, "Printer"), /*#__PURE__*/React.createElement(SelectItem, {
      value: "phone"
    }, "Phone"), /*#__PURE__*/React.createElement(SelectItem, {
      value: "furniture"
    }, "Furniture"), /*#__PURE__*/React.createElement(SelectItem, {
      value: "other"
    }, "Other"))), /*#__PURE__*/React.createElement(FormMessage, null))
  }), /*#__PURE__*/React.createElement(FormField, {
    control: form.control,
    name: "quantity",
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(FormItem, null, /*#__PURE__*/React.createElement(FormLabel, null, "Quantity"), /*#__PURE__*/React.createElement(FormControl, null, /*#__PURE__*/React.createElement(Input, _extends({
      type: "number",
      placeholder: "Enter quantity",
      min: "1"
    }, field))), /*#__PURE__*/React.createElement(FormMessage, null))
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(FormField, {
    control: form.control,
    name: "cost",
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(FormItem, null, /*#__PURE__*/React.createElement(FormLabel, null, "Cost ($)"), /*#__PURE__*/React.createElement(FormControl, null, /*#__PURE__*/React.createElement(Input, _extends({
      type: "number",
      placeholder: "Enter cost",
      min: "0",
      step: "0.01"
    }, field))), /*#__PURE__*/React.createElement(FormMessage, null))
  }), /*#__PURE__*/React.createElement(FormField, {
    control: form.control,
    name: "supplier",
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(FormItem, null, /*#__PURE__*/React.createElement(FormLabel, null, "Supplier"), /*#__PURE__*/React.createElement(FormControl, null, /*#__PURE__*/React.createElement(Input, _extends({
      placeholder: "Enter supplier name"
    }, field))), /*#__PURE__*/React.createElement(FormMessage, null))
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(FormField, {
    control: form.control,
    name: "purchaseDate",
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(FormItem, null, /*#__PURE__*/React.createElement(FormLabel, null, "Purchase Date"), /*#__PURE__*/React.createElement(FormControl, null, /*#__PURE__*/React.createElement(Input, _extends({
      type: "date"
    }, field))), /*#__PURE__*/React.createElement(FormMessage, null))
  }), /*#__PURE__*/React.createElement(FormField, {
    control: form.control,
    name: "warrantyExpiry",
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(FormItem, null, /*#__PURE__*/React.createElement(FormLabel, null, "Warranty Expiry (Optional)"), /*#__PURE__*/React.createElement(FormControl, null, /*#__PURE__*/React.createElement(Input, _extends({
      type: "date"
    }, field))), /*#__PURE__*/React.createElement(FormMessage, null))
  })), /*#__PURE__*/React.createElement(FormField, {
    control: form.control,
    name: "location",
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(FormItem, null, /*#__PURE__*/React.createElement(FormLabel, null, "Location"), /*#__PURE__*/React.createElement(FormControl, null, /*#__PURE__*/React.createElement(Input, _extends({
      placeholder: "Enter asset location"
    }, field))), /*#__PURE__*/React.createElement(FormMessage, null))
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    className: "w-full bg-gradient-primary hover:opacity-90"
  }, "Add Asset"))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Upload, {
    className: "h-5 w-5"
  }), "Asset Images & Documents")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(CloudinaryUpload, {
    onUpload: handleFileUpload,
    accept: "image/*,.pdf,.doc,.docx",
    maxFiles: 10,
    folder: "assets"
  })))));
};
export default AddAssetForm;