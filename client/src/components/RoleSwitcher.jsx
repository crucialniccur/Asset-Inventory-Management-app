import React from 'react';
import { useSelector } from '../contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Users, Shield, CreditCard, User } from 'lucide-react';
const RoleSwitcher = () => {
  const {
    user,
    switchRole
  } = useAuth();
  const roles = [{
    value: 'Admin',
    label: 'Admin',
    icon: Shield,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }, {
    value: 'Procurement',
    label: 'Procurement',
    icon: Users,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }, {
    value: 'Finance',
    label: 'Finance',
    icon: CreditCard,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }, {
    value: 'Employee',
    label: 'Employee',
    icon: User,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }];
  const currentRole = roles.find(role => role.value === user?.role);
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(Badge, {
    className: currentRole?.color
  }, currentRole && /*#__PURE__*/React.createElement(currentRole.icon, {
    className: "h-3 w-3 mr-1"
  }), user?.role), /*#__PURE__*/React.createElement(Select, {
    value: user?.role,
    onValueChange: value => switchRole(value)
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "w-[140px]"
  }, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Switch Role"
  })), /*#__PURE__*/React.createElement(SelectContent, null, roles.map(role => /*#__PURE__*/React.createElement(SelectItem, {
    key: role.value,
    value: role.value
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(role.icon, {
    className: "h-4 w-4"
  }), role.label))))));
};
export default RoleSwitcher;