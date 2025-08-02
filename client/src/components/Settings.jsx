import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';
import { User, Bell, Shield, Database, Download, Trash2, Settings as SettingsIcon, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
const Settings = () => {
  const {
    user
  } = useSelector((state) => state.auth);
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    toast
  } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    assetAlerts: true,
    lowStock: true,
    requests: true
  });
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY'
  });
  const handleSaveNotifications = () => {
    toast({
      title: "Settings saved",
      description: "Notification preferences have been updated."
    });
  };
  const handleSavePreferences = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };
  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your data export will be ready for download shortly."
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(User, {
    className: "h-5 w-5"
  }), "Profile Settings")), /*#__PURE__*/React.createElement(CardContent, {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "name"
  }, "Name"), /*#__PURE__*/React.createElement(Input, {
    id: "name",
    defaultValue: user?.name
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "email"
  }, "Email"), /*#__PURE__*/React.createElement(Input, {
    id: "email",
    defaultValue: user?.email,
    type: "email"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "role"
  }, "Role"), /*#__PURE__*/React.createElement(Input, {
    id: "role",
    defaultValue: user?.role,
    disabled: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "department"
  }, "Department"), /*#__PURE__*/React.createElement(Select, {
    defaultValue: "it"
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select department"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "it"
  }, "Information Technology"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "finance"
  }, "Finance"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "hr"
  }, "Human Resources"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "operations"
  }, "Operations"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "procurement"
  }, "Procurement"))))), /*#__PURE__*/React.createElement(Button, {
    className: "bg-gradient-primary hover:opacity-90"
  }, "Update Profile"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Monitor, {
    className: "h-5 w-5"
  }), "Appearance")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Theme"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-2"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: theme === 'light' ? 'default' : 'outline',
    size: "sm",
    onClick: () => setTheme('light'),
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Sun, {
    className: "h-4 w-4"
  }), "Light"), /*#__PURE__*/React.createElement(Button, {
    variant: theme === 'dark' ? 'default' : 'outline',
    size: "sm",
    onClick: () => setTheme('dark'),
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Moon, {
    className: "h-4 w-4"
  }), "Dark"), /*#__PURE__*/React.createElement(Button, {
    variant: theme === 'system' ? 'default' : 'outline',
    size: "sm",
    onClick: () => setTheme('system'),
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Monitor, {
    className: "h-4 w-4"
  }), "System")))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Bell, {
    className: "h-5 w-5"
  }), "Notifications")), /*#__PURE__*/React.createElement(CardContent, {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Email Notifications"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground"
  }, "Receive notifications via email")), /*#__PURE__*/React.createElement(Switch, {
    checked: notifications.email,
    onCheckedChange: checked => setNotifications(prev => ({
      ...prev,
      email: checked
    }))
  })), /*#__PURE__*/React.createElement(Separator, null), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Asset Alerts"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground"
  }, "Get notified about asset status changes")), /*#__PURE__*/React.createElement(Switch, {
    checked: notifications.assetAlerts,
    onCheckedChange: checked => setNotifications(prev => ({
      ...prev,
      assetAlerts: checked
    }))
  })), /*#__PURE__*/React.createElement(Separator, null), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Low Stock Alerts"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground"
  }, "Notify when asset quantities are low")), /*#__PURE__*/React.createElement(Switch, {
    checked: notifications.lowStock,
    onCheckedChange: checked => setNotifications(prev => ({
      ...prev,
      lowStock: checked
    }))
  })), /*#__PURE__*/React.createElement(Separator, null), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Request Notifications"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground"
  }, "Get notified about new requests")), /*#__PURE__*/React.createElement(Switch, {
    checked: notifications.requests,
    onCheckedChange: checked => setNotifications(prev => ({
      ...prev,
      requests: checked
    }))
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: handleSaveNotifications,
    className: "mt-4"
  }, "Save Notification Settings"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SettingsIcon, {
    className: "h-5 w-5"
  }), "System Preferences")), /*#__PURE__*/React.createElement(CardContent, {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Language"), /*#__PURE__*/React.createElement(Select, {
    value: preferences.language,
    onValueChange: value => setPreferences(prev => ({
      ...prev,
      language: value
    }))
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "en"
  }, "English"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "es"
  }, "Spanish"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "fr"
  }, "French"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "de"
  }, "German")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Currency"), /*#__PURE__*/React.createElement(Select, {
    value: preferences.currency,
    onValueChange: value => setPreferences(prev => ({
      ...prev,
      currency: value
    }))
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "USD"
  }, "USD ($)"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "EUR"
  }, "EUR (\u20AC)"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "GBP"
  }, "GBP (\xA3)"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "JPY"
  }, "JPY (\xA5)"))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Timezone"), /*#__PURE__*/React.createElement(Select, {
    value: preferences.timezone,
    onValueChange: value => setPreferences(prev => ({
      ...prev,
      timezone: value
    }))
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "UTC"
  }, "UTC"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "PST"
  }, "PST"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "EST"
  }, "EST"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "GMT"
  }, "GMT")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Date Format"), /*#__PURE__*/React.createElement(Select, {
    value: preferences.dateFormat,
    onValueChange: value => setPreferences(prev => ({
      ...prev,
      dateFormat: value
    }))
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "MM/DD/YYYY"
  }, "MM/DD/YYYY"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "DD/MM/YYYY"
  }, "DD/MM/YYYY"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "YYYY-MM-DD"
  }, "YYYY-MM-DD"))))), /*#__PURE__*/React.createElement(Button, {
    onClick: handleSavePreferences
  }, "Save Preferences"))), (user?.role === 'Admin' || user?.role === 'Finance') && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Shield, {
    className: "h-5 w-5"
  }), "Security & Privacy")), /*#__PURE__*/React.createElement(CardContent, {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    className: "w-full justify-start"
  }, "Change Password"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    className: "w-full justify-start"
  }, "Two-Factor Authentication"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    className: "w-full justify-start"
  }, "Session Management"), /*#__PURE__*/React.createElement(Separator, null), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, null, "Data & Privacy"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: handleExportData,
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "h-4 w-4"
  }), "Export Data"), /*#__PURE__*/React.createElement(Button, {
    variant: "destructive",
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "h-4 w-4"
  }), "Delete Account"))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Database, {
    className: "h-5 w-5"
  }), "System Information")), /*#__PURE__*/React.createElement(CardContent, {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted-foreground"
  }, "Version:"), /*#__PURE__*/React.createElement("span", null, "v1.0.0")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted-foreground"
  }, "Last Updated:"), /*#__PURE__*/React.createElement("span", null, new Date().toLocaleDateString())), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted-foreground"
  }, "Database Status:"), /*#__PURE__*/React.createElement("span", {
    className: "text-success"
  }, "Connected")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted-foreground"
  }, "Server Status:"), /*#__PURE__*/React.createElement("span", {
    className: "text-success"
  }, "Online")))));
};
export default Settings;
