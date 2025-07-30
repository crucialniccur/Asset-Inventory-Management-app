import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Edit, Trash2, Search, Filter, Shield, CreditCard, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const UserManagement = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Employee',
    department: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers = [{
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Admin',
      department: 'IT',
      status: 'active',
      created_at: '2024-01-01',
      last_login: '2024-01-20'
    }, {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Procurement',
      department: 'Operations',
      status: 'active',
      created_at: '2024-01-05',
      last_login: '2024-01-19'
    }, {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Finance',
      department: 'Finance',
      status: 'active',
      created_at: '2024-01-10',
      last_login: '2024-01-18'
    }, {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      role: 'Employee',
      department: 'HR',
      status: 'active',
      created_at: '2024-01-12',
      last_login: '2024-01-17'
    }, {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@company.com',
      role: 'Employee',
      department: 'Marketing',
      status: 'inactive',
      created_at: '2024-01-15'
    }];
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const getRoleIcon = role => {
    switch (role) {
      case 'Admin':
        return Shield;
      case 'Procurement':
        return Users;
      case 'Finance':
        return CreditCard;
      case 'Employee':
        return User;
    }
  };
  const getRoleBadge = role => {
    const colors = {
      Admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      Procurement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Finance: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Employee: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    const Icon = getRoleIcon(role);
    return /*#__PURE__*/React.createElement(Badge, {
      className: colors[role]
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "h-3 w-3 mr-1"
    }), role);
  };
  const getStatusBadge = status => {
    return status === 'active' ? /*#__PURE__*/React.createElement(Badge, {
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    }, "Active") : /*#__PURE__*/React.createElement(Badge, {
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }, "Inactive");
  };
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    setIsAddingUser(true);

    // Mock API call
    setTimeout(() => {
      const user = {
        id: users.length + 1,
        ...newUser,
        status: 'active',
        created_at: new Date().toISOString()
      };
      setUsers([...users, user]);
      setNewUser({
        name: '',
        email: '',
        role: 'Employee',
        department: ''
      });
      setIsAddingUser(false);
      toast({
        title: "User Added",
        description: `${user.name} has been added successfully.`
      });
    }, 1000);
  };
  const handleDeleteUser = userId => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been removed from the system."
    });
  };
  if (user?.role !== 'Admin') {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-6 text-center"
    }, /*#__PURE__*/React.createElement(Shield, {
      className: "h-12 w-12 text-muted-foreground mx-auto mb-4"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-medium mb-2"
    }, "Access Denied"), /*#__PURE__*/React.createElement("p", {
      className: "text-muted-foreground"
    }, "Only administrators can manage users."));
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
  }, "User Management"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, "Manage system users and their roles")), /*#__PURE__*/React.createElement(Dialog, null, /*#__PURE__*/React.createElement(DialogTrigger, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Button, {
    className: "bg-gradient-primary hover:opacity-90"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "h-4 w-4 mr-2"
  }), "Add User")), /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Add New User"), /*#__PURE__*/React.createElement(DialogDescription, null, "Create a new user account and assign their role and department.")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "name"
  }, "Full Name"), /*#__PURE__*/React.createElement(Input, {
    id: "name",
    value: newUser.name,
    onChange: e => setNewUser({
      ...newUser,
      name: e.target.value
    }),
    placeholder: "Enter full name"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "email"
  }, "Email Address"), /*#__PURE__*/React.createElement(Input, {
    id: "email",
    type: "email",
    value: newUser.email,
    onChange: e => setNewUser({
      ...newUser,
      email: e.target.value
    }),
    placeholder: "Enter email address"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "role"
  }, "Role"), /*#__PURE__*/React.createElement(Select, {
    value: newUser.role,
    onValueChange: value => setNewUser({
      ...newUser,
      role: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "Admin"
  }, "Admin"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "Procurement"
  }, "Procurement"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "Finance"
  }, "Finance"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "Employee"
  }, "Employee")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "department"
  }, "Department"), /*#__PURE__*/React.createElement(Input, {
    id: "department",
    value: newUser.department,
    onChange: e => setNewUser({
      ...newUser,
      department: e.target.value
    }),
    placeholder: "Enter department"
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: handleAddUser,
    disabled: isAddingUser,
    className: "w-full"
  }, isAddingUser ? 'Adding...' : 'Add User'))))), /*#__PURE__*/React.createElement(Card, {
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
    placeholder: "Search users...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    className: "pl-10"
  })), /*#__PURE__*/React.createElement(Select, {
    value: roleFilter,
    onValueChange: setRoleFilter
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "w-[180px]"
  }, /*#__PURE__*/React.createElement(Filter, {
    className: "h-4 w-4 mr-2"
  }), /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Filter by role"
  })), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "all"
  }, "All Roles"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "Admin"
  }, "Admin"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "Procurement"
  }, "Procurement"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "Finance"
  }, "Finance"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "Employee"
  }, "Employee")))))), /*#__PURE__*/React.createElement(Card, {
    className: "shadow-soft"
  }, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Users, {
    className: "h-5 w-5"
  }), "Users (", filteredUsers.length, ")")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHeader, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableHead, null, "User"), /*#__PURE__*/React.createElement(TableHead, null, "Role"), /*#__PURE__*/React.createElement(TableHead, null, "Department"), /*#__PURE__*/React.createElement(TableHead, null, "Status"), /*#__PURE__*/React.createElement(TableHead, null, "Last Login"), /*#__PURE__*/React.createElement(TableHead, null, "Actions"))), /*#__PURE__*/React.createElement(TableBody, null, filteredUsers.map(user => /*#__PURE__*/React.createElement(TableRow, {
    key: user.id
  }, /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "h-8 w-8"
  }, /*#__PURE__*/React.createElement(AvatarFallback, null, user.name.split(' ').map(n => n[0]).join(''))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, user.name), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-muted-foreground"
  }, user.email)))), /*#__PURE__*/React.createElement(TableCell, null, getRoleBadge(user.role)), /*#__PURE__*/React.createElement(TableCell, null, user.department), /*#__PURE__*/React.createElement(TableCell, null, getStatusBadge(user.status)), /*#__PURE__*/React.createElement(TableCell, {
    className: "text-sm text-muted-foreground"
  }, user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Edit, {
    className: "h-3 w-3"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => handleDeleteUser(user.id),
    className: "text-destructive hover:text-destructive"
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "h-3 w-3"
  })))))))))), filteredUsers.length === 0 && /*#__PURE__*/React.createElement(Card, {
    className: "shadow-soft"
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-12 text-center"
  }, /*#__PURE__*/React.createElement(Users, {
    className: "h-12 w-12 text-muted-foreground mx-auto mb-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-medium mb-2"
  }, "No users found"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, searchTerm || roleFilter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Get started by adding your first user.'))));
};
export default UserManagement;
