import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Upload, X, File } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
const CloudinaryUpload = ({
  onUpload,
  accept = "image/*",
  maxFiles = 5,
  folder = "assets"
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const {
    toast
  } = useToast();

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = 'dty0x7kcb';
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  const CLOUDINARY_API_KEY = 'YAygFMlr_SHjkdPMnwq_ro-b5mQ';
  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  const handleFileSelect = e => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };
  const handleFiles = async files => {
    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    for (const file of files) {
      try {
        await uploadToCloudinary(file);
      } catch (error) {
        console.error('Upload failed:', error);
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }
    setIsUploading(false);
  };
  const uploadToCloudinary = async file => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('folder', folder);
    formData.append('timestamp', Math.round(Date.now() / 1000).toString());
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    const data = await response.json();
    const uploadedFile = {
      url: data.secure_url,
      publicId: data.public_id,
      originalName: data.original_filename || file.name,
      size: data.bytes,
      type: data.resource_type === 'image' ? 'image' : 'file'
    };
    setUploadedFiles(prev => [...prev, uploadedFile]);
    onUpload?.(uploadedFile.url, uploadedFile.publicId);
    toast({
      title: "Upload successful",
      description: `${file.name} uploaded successfully`
    });
  };
  const removeFile = index => {
    const file = uploadedFiles[index];
    URL.revokeObjectURL(file.url); // Clean up blob URL
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}`,
    onDragEnter: handleDrag,
    onDragLeave: handleDrag,
    onDragOver: handleDrag,
    onDrop: handleDrop,
    onClick: () => fileInputRef.current?.click()
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Upload, {
    className: "h-6 w-6 text-muted-foreground"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-medium"
  }, "Drop files here or click to browse"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground"
  }, "Maximum ", maxFiles, " files \u2022 ", accept === "image/*" ? "Images only" : "All file types"))), /*#__PURE__*/React.createElement(Input, {
    ref: fileInputRef,
    type: "file",
    multiple: true,
    accept: accept,
    onChange: handleFileSelect,
    className: "hidden"
  })), isUploading && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "Uploading files...")))), uploadedFiles.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Uploaded Files (", uploadedFiles.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3"
  }, uploadedFiles.map((file, index) => /*#__PURE__*/React.createElement(Card, {
    key: index
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-shrink-0"
  }, file.type.startsWith('image/') ? /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded overflow-hidden bg-muted"
  }, /*#__PURE__*/React.createElement("img", {
    src: file.url,
    alt: file.originalName,
    className: "w-full h-full object-cover"
  })) : /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 bg-muted rounded flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(File, {
    className: "h-6 w-6 text-muted-foreground"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium truncate"
  }, file.originalName), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground"
  }, formatFileSize(file.size), " \u2022 ", file.type)), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => removeFile(index),
    className: "flex-shrink-0 h-8 w-8 p-0"
  }, /*#__PURE__*/React.createElement(X, {
    className: "h-4 w-4"
  })))))))), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-muted-foreground bg-muted/50 p-3 rounded"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Cloudinary Status:"), " Connected to cloud \"", CLOUDINARY_CLOUD_NAME, "\""), /*#__PURE__*/React.createElement("p", {
    className: "mt-1"
  }, "Files will be uploaded to the \"", folder, "\" folder in your Cloudinary account.")));
};
export default CloudinaryUpload;

