import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Package, Users, FileText, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    allocatedAssets: 0,
    pendingRequests: 0,
    totalUsers: 0,
    recentActivity: [],
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      title: 'Total Assets',
      value: stats.totalAssets,
      icon: Package,
      description: 'All assets in inventory',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Available',
      value: stats.availableAssets,
      icon: TrendingUp,
      description: 'Ready for allocation',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Allocated',
      value: stats.allocatedAssets,
      icon: Users,
      description: 'Currently in use',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: AlertTriangle,
      description: 'Awaiting approval',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'allocation':
        return <Users className="h-4 w-4 text-primary" />;
      case 'request':
        return <FileText className="h-4 w-4 text-yellow-600" />;
      case 'asset':
        return <Package className="h-4 w-4 text-green-600" />;
      case 'return':
        return <TrendingUp className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {user?.name || 'Demo Admin'}!
        </h1>
        <p className="text-white/80">
          Here's what's happening with your asset inventory today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest updates and changes in your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded bg-muted">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(user?.role === 'Admin' || user?.role === 'Procurement') && (
              <>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/assets/add')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Add New Asset
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/allocations')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Allocate Asset
                </Button>
              </>
            )}
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate('/requests')}
            >
              <FileText className="h-4 w-4 mr-2" />
              {user?.role === 'Employee' ? 'Submit New Request' : 'View All Requests'}
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate('/assets')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Asset Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
