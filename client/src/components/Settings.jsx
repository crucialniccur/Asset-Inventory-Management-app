import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Shield, Database, Download, Trash2, Settings as SettingsIcon, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
const Settings = () => {
  const {
    user
  } = useAuth();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsInVzZVN0YXRlIiwidXNlQXV0aCIsIkJ1dHRvbiIsIklucHV0IiwiTGFiZWwiLCJDYXJkIiwiQ2FyZENvbnRlbnQiLCJDYXJkSGVhZGVyIiwiQ2FyZFRpdGxlIiwiU3dpdGNoIiwiU2VsZWN0IiwiU2VsZWN0Q29udGVudCIsIlNlbGVjdEl0ZW0iLCJTZWxlY3RUcmlnZ2VyIiwiU2VsZWN0VmFsdWUiLCJTZXBhcmF0b3IiLCJ1c2VUb2FzdCIsIlVzZXIiLCJCZWxsIiwiU2hpZWxkIiwiRGF0YWJhc2UiLCJEb3dubG9hZCIsIlRyYXNoMiIsIlNldHRpbmdzIiwiU2V0dGluZ3NJY29uIiwiTW9vbiIsIlN1biIsIk1vbml0b3IiLCJ1c2VUaGVtZSIsInVzZXIiLCJ0aGVtZSIsInNldFRoZW1lIiwidG9hc3QiLCJub3RpZmljYXRpb25zIiwic2V0Tm90aWZpY2F0aW9ucyIsImVtYWlsIiwicHVzaCIsImFzc2V0QWxlcnRzIiwibG93U3RvY2siLCJyZXF1ZXN0cyIsInByZWZlcmVuY2VzIiwic2V0UHJlZmVyZW5jZXMiLCJsYW5ndWFnZSIsInRpbWV6b25lIiwiY3VycmVuY3kiLCJkYXRlRm9ybWF0IiwiaGFuZGxlU2F2ZU5vdGlmaWNhdGlvbnMiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwiaGFuZGxlU2F2ZVByZWZlcmVuY2VzIiwiaGFuZGxlRXhwb3J0RGF0YSIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJodG1sRm9yIiwiaWQiLCJkZWZhdWx0VmFsdWUiLCJuYW1lIiwidHlwZSIsInJvbGUiLCJkaXNhYmxlZCIsInBsYWNlaG9sZGVyIiwidmFsdWUiLCJ2YXJpYW50Iiwic2l6ZSIsIm9uQ2xpY2siLCJjaGVja2VkIiwib25DaGVja2VkQ2hhbmdlIiwicHJldiIsIm9uVmFsdWVDaGFuZ2UiLCJEYXRlIiwidG9Mb2NhbGVEYXRlU3RyaW5nIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBvbmVudHMvU2V0dGluZ3MudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUF1dGggfSBmcm9tICdAL2NvbnRleHRzL0F1dGhDb250ZXh0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJ0AvY29tcG9uZW50cy91aS9idXR0b24nO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tICdAL2NvbXBvbmVudHMvdWkvaW5wdXQnO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICdAL2NvbXBvbmVudHMvdWkvbGFiZWwnO1xuaW1wb3J0IHsgQ2FyZCwgQ2FyZENvbnRlbnQsIENhcmRIZWFkZXIsIENhcmRUaXRsZSB9IGZyb20gJ0AvY29tcG9uZW50cy91aS9jYXJkJztcbmltcG9ydCB7IFN3aXRjaCB9IGZyb20gJ0AvY29tcG9uZW50cy91aS9zd2l0Y2gnO1xuaW1wb3J0IHsgU2VsZWN0LCBTZWxlY3RDb250ZW50LCBTZWxlY3RJdGVtLCBTZWxlY3RUcmlnZ2VyLCBTZWxlY3RWYWx1ZSB9IGZyb20gJ0AvY29tcG9uZW50cy91aS9zZWxlY3QnO1xuaW1wb3J0IHsgU2VwYXJhdG9yIH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL3NlcGFyYXRvcic7XG5pbXBvcnQgeyB1c2VUb2FzdCB9IGZyb20gJ0AvaG9va3MvdXNlLXRvYXN0JztcbmltcG9ydCB7IFxuICBVc2VyLCBcbiAgQmVsbCwgXG4gIFNoaWVsZCwgXG4gIERhdGFiYXNlLCBcbiAgRG93bmxvYWQsIFxuICBUcmFzaDIsIFxuICBTZXR0aW5ncyBhcyBTZXR0aW5nc0ljb24sXG4gIE1vb24sXG4gIFN1bixcbiAgTW9uaXRvclxufSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuaW1wb3J0IHsgdXNlVGhlbWUgfSBmcm9tICduZXh0LXRoZW1lcyc7XG5cbmNvbnN0IFNldHRpbmdzOiBSZWFjdC5GQyA9ICgpID0+IHtcbiAgY29uc3QgeyB1c2VyIH0gPSB1c2VBdXRoKCk7XG4gIGNvbnN0IHsgdGhlbWUsIHNldFRoZW1lIH0gPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7IHRvYXN0IH0gPSB1c2VUb2FzdCgpO1xuICBjb25zdCBbbm90aWZpY2F0aW9ucywgc2V0Tm90aWZpY2F0aW9uc10gPSB1c2VTdGF0ZSh7XG4gICAgZW1haWw6IHRydWUsXG4gICAgcHVzaDogZmFsc2UsXG4gICAgYXNzZXRBbGVydHM6IHRydWUsXG4gICAgbG93U3RvY2s6IHRydWUsXG4gICAgcmVxdWVzdHM6IHRydWVcbiAgfSk7XG5cbiAgY29uc3QgW3ByZWZlcmVuY2VzLCBzZXRQcmVmZXJlbmNlc10gPSB1c2VTdGF0ZSh7XG4gICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgdGltZXpvbmU6ICdVVEMnLFxuICAgIGN1cnJlbmN5OiAnVVNEJyxcbiAgICBkYXRlRm9ybWF0OiAnTU0vREQvWVlZWSdcbiAgfSk7XG5cbiAgY29uc3QgaGFuZGxlU2F2ZU5vdGlmaWNhdGlvbnMgPSAoKSA9PiB7XG4gICAgdG9hc3Qoe1xuICAgICAgdGl0bGU6IFwiU2V0dGluZ3Mgc2F2ZWRcIixcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk5vdGlmaWNhdGlvbiBwcmVmZXJlbmNlcyBoYXZlIGJlZW4gdXBkYXRlZC5cIixcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVTYXZlUHJlZmVyZW5jZXMgPSAoKSA9PiB7XG4gICAgdG9hc3Qoe1xuICAgICAgdGl0bGU6IFwiU2V0dGluZ3Mgc2F2ZWRcIiwgXG4gICAgICBkZXNjcmlwdGlvbjogXCJZb3VyIHByZWZlcmVuY2VzIGhhdmUgYmVlbiB1cGRhdGVkLlwiLFxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUV4cG9ydERhdGEgPSAoKSA9PiB7XG4gICAgdG9hc3Qoe1xuICAgICAgdGl0bGU6IFwiRXhwb3J0IHN0YXJ0ZWRcIixcbiAgICAgIGRlc2NyaXB0aW9uOiBcIllvdXIgZGF0YSBleHBvcnQgd2lsbCBiZSByZWFkeSBmb3IgZG93bmxvYWQgc2hvcnRseS5cIixcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS02XCI+XG4gICAgICB7LyogUHJvZmlsZSBTZXR0aW5ncyAqL31cbiAgICAgIDxDYXJkPlxuICAgICAgICA8Q2FyZEhlYWRlcj5cbiAgICAgICAgICA8Q2FyZFRpdGxlIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICA8VXNlciBjbGFzc05hbWU9XCJoLTUgdy01XCIgLz5cbiAgICAgICAgICAgIFByb2ZpbGUgU2V0dGluZ3NcbiAgICAgICAgICA8L0NhcmRUaXRsZT5cbiAgICAgICAgPC9DYXJkSGVhZGVyPlxuICAgICAgICA8Q2FyZENvbnRlbnQgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00XCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8TGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9MYWJlbD5cbiAgICAgICAgICAgICAgPElucHV0IGlkPVwibmFtZVwiIGRlZmF1bHRWYWx1ZT17dXNlcj8ubmFtZX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPExhYmVsIGh0bWxGb3I9XCJlbWFpbFwiPkVtYWlsPC9MYWJlbD5cbiAgICAgICAgICAgICAgPElucHV0IGlkPVwiZW1haWxcIiBkZWZhdWx0VmFsdWU9e3VzZXI/LmVtYWlsfSB0eXBlPVwiZW1haWxcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00XCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8TGFiZWwgaHRtbEZvcj1cInJvbGVcIj5Sb2xlPC9MYWJlbD5cbiAgICAgICAgICAgICAgPElucHV0IGlkPVwicm9sZVwiIGRlZmF1bHRWYWx1ZT17dXNlcj8ucm9sZX0gZGlzYWJsZWQgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPExhYmVsIGh0bWxGb3I9XCJkZXBhcnRtZW50XCI+RGVwYXJ0bWVudDwvTGFiZWw+XG4gICAgICAgICAgICAgIDxTZWxlY3QgZGVmYXVsdFZhbHVlPVwiaXRcIj5cbiAgICAgICAgICAgICAgICA8U2VsZWN0VHJpZ2dlcj5cbiAgICAgICAgICAgICAgICAgIDxTZWxlY3RWYWx1ZSBwbGFjZWhvbGRlcj1cIlNlbGVjdCBkZXBhcnRtZW50XCIgLz5cbiAgICAgICAgICAgICAgICA8L1NlbGVjdFRyaWdnZXI+XG4gICAgICAgICAgICAgICAgPFNlbGVjdENvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cIml0XCI+SW5mb3JtYXRpb24gVGVjaG5vbG9neTwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICAgIDxTZWxlY3RJdGVtIHZhbHVlPVwiZmluYW5jZVwiPkZpbmFuY2U8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cImhyXCI+SHVtYW4gUmVzb3VyY2VzPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJvcGVyYXRpb25zXCI+T3BlcmF0aW9uczwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICAgIDxTZWxlY3RJdGVtIHZhbHVlPVwicHJvY3VyZW1lbnRcIj5Qcm9jdXJlbWVudDwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICA8L1NlbGVjdENvbnRlbnQ+XG4gICAgICAgICAgICAgIDwvU2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEJ1dHRvbiBjbGFzc05hbWU9XCJiZy1ncmFkaWVudC1wcmltYXJ5IGhvdmVyOm9wYWNpdHktOTBcIj5cbiAgICAgICAgICAgIFVwZGF0ZSBQcm9maWxlXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICA8L0NhcmQ+XG5cbiAgICAgIHsvKiBUaGVtZSBTZXR0aW5ncyAqL31cbiAgICAgIDxDYXJkPlxuICAgICAgICA8Q2FyZEhlYWRlcj5cbiAgICAgICAgICA8Q2FyZFRpdGxlIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICA8TW9uaXRvciBjbGFzc05hbWU9XCJoLTUgdy01XCIgLz5cbiAgICAgICAgICAgIEFwcGVhcmFuY2VcbiAgICAgICAgICA8L0NhcmRUaXRsZT5cbiAgICAgICAgPC9DYXJkSGVhZGVyPlxuICAgICAgICA8Q2FyZENvbnRlbnQ+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxMYWJlbD5UaGVtZTwvTGFiZWw+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMiBtdC0yXCI+XG4gICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgdmFyaWFudD17dGhlbWUgPT09ICdsaWdodCcgPyAnZGVmYXVsdCcgOiAnb3V0bGluZSd9XG4gICAgICAgICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0VGhlbWUoJ2xpZ2h0Jyl9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPFN1biBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICAgICAgICAgIExpZ2h0XG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgdmFyaWFudD17dGhlbWUgPT09ICdkYXJrJyA/ICdkZWZhdWx0JyA6ICdvdXRsaW5lJ31cbiAgICAgICAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRUaGVtZSgnZGFyaycpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxNb29uIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICAgICAgRGFya1xuICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9e3RoZW1lID09PSAnc3lzdGVtJyA/ICdkZWZhdWx0JyA6ICdvdXRsaW5lJ31cbiAgICAgICAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRUaGVtZSgnc3lzdGVtJyl9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPE1vbml0b3IgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICAgICAgICBTeXN0ZW1cbiAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgIDwvQ2FyZD5cblxuICAgICAgey8qIE5vdGlmaWNhdGlvbiBTZXR0aW5ncyAqL31cbiAgICAgIDxDYXJkPlxuICAgICAgICA8Q2FyZEhlYWRlcj5cbiAgICAgICAgICA8Q2FyZFRpdGxlIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICA8QmVsbCBjbGFzc05hbWU9XCJoLTUgdy01XCIgLz5cbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnNcbiAgICAgICAgICA8L0NhcmRUaXRsZT5cbiAgICAgICAgPC9DYXJkSGVhZGVyPlxuICAgICAgICA8Q2FyZENvbnRlbnQgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxMYWJlbD5FbWFpbCBOb3RpZmljYXRpb25zPC9MYWJlbD5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LW11dGVkLWZvcmVncm91bmRcIj5SZWNlaXZlIG5vdGlmaWNhdGlvbnMgdmlhIGVtYWlsPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICAgIGNoZWNrZWQ9e25vdGlmaWNhdGlvbnMuZW1haWx9XG4gICAgICAgICAgICAgIG9uQ2hlY2tlZENoYW5nZT17KGNoZWNrZWQpID0+IFxuICAgICAgICAgICAgICAgIHNldE5vdGlmaWNhdGlvbnMocHJldiA9PiAoey4uLnByZXYsIGVtYWlsOiBjaGVja2VkfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFNlcGFyYXRvciAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8TGFiZWw+QXNzZXQgQWxlcnRzPC9MYWJlbD5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LW11dGVkLWZvcmVncm91bmRcIj5HZXQgbm90aWZpZWQgYWJvdXQgYXNzZXQgc3RhdHVzIGNoYW5nZXM8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgICAgY2hlY2tlZD17bm90aWZpY2F0aW9ucy5hc3NldEFsZXJ0c31cbiAgICAgICAgICAgICAgb25DaGVja2VkQ2hhbmdlPXsoY2hlY2tlZCkgPT4gXG4gICAgICAgICAgICAgICAgc2V0Tm90aWZpY2F0aW9ucyhwcmV2ID0+ICh7Li4ucHJldiwgYXNzZXRBbGVydHM6IGNoZWNrZWR9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U2VwYXJhdG9yIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxMYWJlbD5Mb3cgU3RvY2sgQWxlcnRzPC9MYWJlbD5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LW11dGVkLWZvcmVncm91bmRcIj5Ob3RpZnkgd2hlbiBhc3NldCBxdWFudGl0aWVzIGFyZSBsb3c8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgICAgY2hlY2tlZD17bm90aWZpY2F0aW9ucy5sb3dTdG9ja31cbiAgICAgICAgICAgICAgb25DaGVja2VkQ2hhbmdlPXsoY2hlY2tlZCkgPT4gXG4gICAgICAgICAgICAgICAgc2V0Tm90aWZpY2F0aW9ucyhwcmV2ID0+ICh7Li4ucHJldiwgbG93U3RvY2s6IGNoZWNrZWR9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U2VwYXJhdG9yIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxMYWJlbD5SZXF1ZXN0IE5vdGlmaWNhdGlvbnM8L0xhYmVsPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiPkdldCBub3RpZmllZCBhYm91dCBuZXcgcmVxdWVzdHM8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgICAgY2hlY2tlZD17bm90aWZpY2F0aW9ucy5yZXF1ZXN0c31cbiAgICAgICAgICAgICAgb25DaGVja2VkQ2hhbmdlPXsoY2hlY2tlZCkgPT4gXG4gICAgICAgICAgICAgICAgc2V0Tm90aWZpY2F0aW9ucyhwcmV2ID0+ICh7Li4ucHJldiwgcmVxdWVzdHM6IGNoZWNrZWR9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e2hhbmRsZVNhdmVOb3RpZmljYXRpb25zfSBjbGFzc05hbWU9XCJtdC00XCI+XG4gICAgICAgICAgICBTYXZlIE5vdGlmaWNhdGlvbiBTZXR0aW5nc1xuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0NhcmRDb250ZW50PlxuICAgICAgPC9DYXJkPlxuXG4gICAgICB7LyogU3lzdGVtIFByZWZlcmVuY2VzICovfVxuICAgICAgPENhcmQ+XG4gICAgICAgIDxDYXJkSGVhZGVyPlxuICAgICAgICAgIDxDYXJkVGl0bGUgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgIDxTZXR0aW5nc0ljb24gY2xhc3NOYW1lPVwiaC01IHctNVwiIC8+XG4gICAgICAgICAgICBTeXN0ZW0gUHJlZmVyZW5jZXNcbiAgICAgICAgICA8L0NhcmRUaXRsZT5cbiAgICAgICAgPC9DYXJkSGVhZGVyPlxuICAgICAgICA8Q2FyZENvbnRlbnQgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00XCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8TGFiZWw+TGFuZ3VhZ2U8L0xhYmVsPlxuICAgICAgICAgICAgICA8U2VsZWN0IHZhbHVlPXtwcmVmZXJlbmNlcy5sYW5ndWFnZX0gb25WYWx1ZUNoYW5nZT17KHZhbHVlKSA9PiBcbiAgICAgICAgICAgICAgICBzZXRQcmVmZXJlbmNlcyhwcmV2ID0+ICh7Li4ucHJldiwgbGFuZ3VhZ2U6IHZhbHVlfSkpXG4gICAgICAgICAgICAgIH0+XG4gICAgICAgICAgICAgICAgPFNlbGVjdFRyaWdnZXI+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0VmFsdWUgLz5cbiAgICAgICAgICAgICAgICA8L1NlbGVjdFRyaWdnZXI+XG4gICAgICAgICAgICAgICAgPFNlbGVjdENvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cImVuXCI+RW5nbGlzaDwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICAgIDxTZWxlY3RJdGVtIHZhbHVlPVwiZXNcIj5TcGFuaXNoPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJmclwiPkZyZW5jaDwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICAgIDxTZWxlY3RJdGVtIHZhbHVlPVwiZGVcIj5HZXJtYW48L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgPC9TZWxlY3RDb250ZW50PlxuICAgICAgICAgICAgICA8L1NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPExhYmVsPkN1cnJlbmN5PC9MYWJlbD5cbiAgICAgICAgICAgICAgPFNlbGVjdCB2YWx1ZT17cHJlZmVyZW5jZXMuY3VycmVuY3l9IG9uVmFsdWVDaGFuZ2U9eyh2YWx1ZSkgPT4gXG4gICAgICAgICAgICAgICAgc2V0UHJlZmVyZW5jZXMocHJldiA9PiAoey4uLnByZXYsIGN1cnJlbmN5OiB2YWx1ZX0pKVxuICAgICAgICAgICAgICB9PlxuICAgICAgICAgICAgICAgIDxTZWxlY3RUcmlnZ2VyPlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdFZhbHVlIC8+XG4gICAgICAgICAgICAgICAgPC9TZWxlY3RUcmlnZ2VyPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RDb250ZW50PlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJVU0RcIj5VU0QgKCQpPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJFVVJcIj5FVVIgKOKCrCk8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cIkdCUFwiPkdCUCAowqMpPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJKUFlcIj5KUFkgKMKlKTwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICA8L1NlbGVjdENvbnRlbnQ+XG4gICAgICAgICAgICAgIDwvU2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00XCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8TGFiZWw+VGltZXpvbmU8L0xhYmVsPlxuICAgICAgICAgICAgICA8U2VsZWN0IHZhbHVlPXtwcmVmZXJlbmNlcy50aW1lem9uZX0gb25WYWx1ZUNoYW5nZT17KHZhbHVlKSA9PiBcbiAgICAgICAgICAgICAgICBzZXRQcmVmZXJlbmNlcyhwcmV2ID0+ICh7Li4ucHJldiwgdGltZXpvbmU6IHZhbHVlfSkpXG4gICAgICAgICAgICAgIH0+XG4gICAgICAgICAgICAgICAgPFNlbGVjdFRyaWdnZXI+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0VmFsdWUgLz5cbiAgICAgICAgICAgICAgICA8L1NlbGVjdFRyaWdnZXI+XG4gICAgICAgICAgICAgICAgPFNlbGVjdENvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cIlVUQ1wiPlVUQzwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICAgIDxTZWxlY3RJdGVtIHZhbHVlPVwiUFNUXCI+UFNUPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJFU1RcIj5FU1Q8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cIkdNVFwiPkdNVDwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICA8L1NlbGVjdENvbnRlbnQ+XG4gICAgICAgICAgICAgIDwvU2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8TGFiZWw+RGF0ZSBGb3JtYXQ8L0xhYmVsPlxuICAgICAgICAgICAgICA8U2VsZWN0IHZhbHVlPXtwcmVmZXJlbmNlcy5kYXRlRm9ybWF0fSBvblZhbHVlQ2hhbmdlPXsodmFsdWUpID0+IFxuICAgICAgICAgICAgICAgIHNldFByZWZlcmVuY2VzKHByZXYgPT4gKHsuLi5wcmV2LCBkYXRlRm9ybWF0OiB2YWx1ZX0pKVxuICAgICAgICAgICAgICB9PlxuICAgICAgICAgICAgICAgIDxTZWxlY3RUcmlnZ2VyPlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdFZhbHVlIC8+XG4gICAgICAgICAgICAgICAgPC9TZWxlY3RUcmlnZ2VyPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RDb250ZW50PlxuICAgICAgICAgICAgICAgICAgPFNlbGVjdEl0ZW0gdmFsdWU9XCJNTS9ERC9ZWVlZXCI+TU0vREQvWVlZWTwvU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICAgIDxTZWxlY3RJdGVtIHZhbHVlPVwiREQvTU0vWVlZWVwiPkREL01NL1lZWVk8L1NlbGVjdEl0ZW0+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0SXRlbSB2YWx1ZT1cIllZWVktTU0tRERcIj5ZWVlZLU1NLUREPC9TZWxlY3RJdGVtPlxuICAgICAgICAgICAgICAgIDwvU2VsZWN0Q29udGVudD5cbiAgICAgICAgICAgICAgPC9TZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e2hhbmRsZVNhdmVQcmVmZXJlbmNlc30+XG4gICAgICAgICAgICBTYXZlIFByZWZlcmVuY2VzXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICA8L0NhcmQ+XG5cbiAgICAgIHsvKiBTZWN1cml0eSBTZXR0aW5ncyAqL31cbiAgICAgIHsodXNlcj8ucm9sZSA9PT0gJ0FkbWluJyB8fCB1c2VyPy5yb2xlID09PSAnRmluYW5jZScpICYmIChcbiAgICAgICAgPENhcmQ+XG4gICAgICAgICAgPENhcmRIZWFkZXI+XG4gICAgICAgICAgICA8Q2FyZFRpdGxlIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgIDxTaGllbGQgY2xhc3NOYW1lPVwiaC01IHctNVwiIC8+XG4gICAgICAgICAgICAgIFNlY3VyaXR5ICYgUHJpdmFjeVxuICAgICAgICAgICAgPC9DYXJkVGl0bGU+XG4gICAgICAgICAgPC9DYXJkSGVhZGVyPlxuICAgICAgICAgIDxDYXJkQ29udGVudCBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cIm91dGxpbmVcIiBjbGFzc05hbWU9XCJ3LWZ1bGwganVzdGlmeS1zdGFydFwiPlxuICAgICAgICAgICAgICBDaGFuZ2UgUGFzc3dvcmRcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwib3V0bGluZVwiIGNsYXNzTmFtZT1cInctZnVsbCBqdXN0aWZ5LXN0YXJ0XCI+XG4gICAgICAgICAgICAgIFR3by1GYWN0b3IgQXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwib3V0bGluZVwiIGNsYXNzTmFtZT1cInctZnVsbCBqdXN0aWZ5LXN0YXJ0XCI+XG4gICAgICAgICAgICAgIFNlc3Npb24gTWFuYWdlbWVudFxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8U2VwYXJhdG9yIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMlwiPlxuICAgICAgICAgICAgICA8TGFiZWw+RGF0YSAmIFByaXZhY3k8L0xhYmVsPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJvdXRsaW5lXCIgb25DbGljaz17aGFuZGxlRXhwb3J0RGF0YX0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgIDxEb3dubG9hZCBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICAgICAgICAgIEV4cG9ydCBEYXRhXG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiZGVzdHJ1Y3RpdmVcIiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgPFRyYXNoMiBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICAgICAgICAgIERlbGV0ZSBBY2NvdW50XG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgICAgPC9DYXJkPlxuICAgICAgKX1cblxuICAgICAgey8qIFN5c3RlbSBJbmZvICovfVxuICAgICAgPENhcmQ+XG4gICAgICAgIDxDYXJkSGVhZGVyPlxuICAgICAgICAgIDxDYXJkVGl0bGUgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgIDxEYXRhYmFzZSBjbGFzc05hbWU9XCJoLTUgdy01XCIgLz5cbiAgICAgICAgICAgIFN5c3RlbSBJbmZvcm1hdGlvblxuICAgICAgICAgIDwvQ2FyZFRpdGxlPlxuICAgICAgICA8L0NhcmRIZWFkZXI+XG4gICAgICAgIDxDYXJkQ29udGVudCBjbGFzc05hbWU9XCJzcGFjZS15LTJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQtc21cIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiPlZlcnNpb246PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+djEuMC4wPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gdGV4dC1zbVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+TGFzdCBVcGRhdGVkOjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuPntuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZygpfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQtc21cIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiPkRhdGFiYXNlIFN0YXR1czo8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXN1Y2Nlc3NcIj5Db25uZWN0ZWQ8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiB0ZXh0LXNtXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkLWZvcmVncm91bmRcIj5TZXJ2ZXIgU3RhdHVzOjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc3VjY2Vzc1wiPk9ubGluZTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgIDwvQ2FyZD5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzOyJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsS0FBSyxJQUFJQyxRQUFRLFFBQVEsT0FBTztBQUN2QyxTQUFTQyxPQUFPLFFBQVEsd0JBQXdCO0FBQ2hELFNBQVNDLE1BQU0sUUFBUSx3QkFBd0I7QUFDL0MsU0FBU0MsS0FBSyxRQUFRLHVCQUF1QjtBQUM3QyxTQUFTQyxLQUFLLFFBQVEsdUJBQXVCO0FBQzdDLFNBQVNDLElBQUksRUFBRUMsV0FBVyxFQUFFQyxVQUFVLEVBQUVDLFNBQVMsUUFBUSxzQkFBc0I7QUFDL0UsU0FBU0MsTUFBTSxRQUFRLHdCQUF3QjtBQUMvQyxTQUFTQyxNQUFNLEVBQUVDLGFBQWEsRUFBRUMsVUFBVSxFQUFFQyxhQUFhLEVBQUVDLFdBQVcsUUFBUSx3QkFBd0I7QUFDdEcsU0FBU0MsU0FBUyxRQUFRLDJCQUEyQjtBQUNyRCxTQUFTQyxRQUFRLFFBQVEsbUJBQW1CO0FBQzVDLFNBQ0VDLElBQUksRUFDSkMsSUFBSSxFQUNKQyxNQUFNLEVBQ05DLFFBQVEsRUFDUkMsUUFBUSxFQUNSQyxNQUFNLEVBQ05DLFFBQVEsSUFBSUMsWUFBWSxFQUN4QkMsSUFBSSxFQUNKQyxHQUFHLEVBQ0hDLE9BQU8sUUFDRixjQUFjO0FBQ3JCLFNBQVNDLFFBQVEsUUFBUSxhQUFhO0FBRXRDLE1B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