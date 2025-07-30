import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, Building2, Lock, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    login
  } = useAuth();
  const {
    toast
  } = useToast();
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const success = await login(email, password);
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome to Asset Management System"
      });
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-secondary-light p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-medium"
  }, /*#__PURE__*/React.createElement(Building2, {
    className: "h-8 w-8 text-primary-foreground"
  })), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold text-foreground"
  }, "Asset Manager"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground mt-2"
  }, "Sign in to your account")), /*#__PURE__*/React.createElement(Card, {
    className: "shadow-strong border-card-border"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-2xl text-center"
  }, "Welcome back"), /*#__PURE__*/React.createElement(CardDescription, {
    className: "text-center"
  }, "Enter your credentials to access the system")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, error && /*#__PURE__*/React.createElement(Alert, {
    variant: "destructive"
  }, /*#__PURE__*/React.createElement(AlertCircle, {
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement(AlertDescription, null, error)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "email"
  }, "Email"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Mail, {
    className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
  }), /*#__PURE__*/React.createElement(Input, {
    id: "email",
    type: "email",
    placeholder: "admin@example.com",
    value: email,
    onChange: e => setEmail(e.target.value),
    className: "pl-10",
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "password"
  }, "Password"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Lock, {
    className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
  }), /*#__PURE__*/React.createElement(Input, {
    id: "password",
    type: "password",
    placeholder: "Enter your password",
    value: password,
    onChange: e => setPassword(e.target.value),
    className: "pl-10",
    required: true
  }))), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    className: "w-full bg-gradient-primary hover:opacity-90",
    disabled: isLoading
  }, isLoading ? 'Signing in...' : 'Sign in')), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 p-4 bg-muted rounded-lg"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium text-foreground mb-2"
  }, "Demo Accounts:"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1 text-xs text-muted-foreground"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Admin:"), " admin@example.com / adminpass"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Finance:"), " finance@example.com / financepass"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Employee:"), " employee@example.com / employeepass")))))));
};
export default Login;
