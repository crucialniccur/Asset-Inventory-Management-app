import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import ProcurementDashboard from '../components/Dashboard/ProcurementDashboard';
import FinanceDashboard from '../components/Dashboard/FinanceDashboard';
import EmployeeDashboard from '../components/Dashboard/EmployeeDashboard';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Procurement':
        return <ProcurementDashboard />;
      case 'Finance':
        return <FinanceDashboard />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return renderDashboard();
};

export default Dashboard;