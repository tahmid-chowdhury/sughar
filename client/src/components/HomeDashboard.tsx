import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, HomeIcon, Wrench, Users, TrendingUp, Bell, FileWarning, Settings, ChevronDown } from './icons';
import api from '../services/api';
import { FinancialOverviewChart } from './charts/FinancialOverviewChart';
import { ServiceRequestVolumeChart } from './charts/ServiceRequestVolumeChart';
import { MonthlyProfitData, ServiceRequestVolume } from '../types';

interface HomeDashboardProps {
  setViewingTenantId: (id: string) => void;
  setCurrentPage: (page: string) => void;
}

interface DashboardStats {
  properties: {
    total: number;
    addresses: string[];
  };
  units: {
    total: number;
    occupied: number;
    vacant: number;
    occupancyRate: number;
    totalRevenue: number;
    details: any[];
  };
  serviceRequests: {
    total: number;
    active: number;
    completed: number;
    completedToday: number;
    recent: any[];
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  leases: {
    total: number;
    endingSoon: number;
    endingToday: number;
    endingSoonDetails: any[];
    endingTodayDetails: any[];
  };
}

interface RecentActivity {
  type: 'application' | 'service_request' | 'payment' | 'maintenance';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'in_progress';
}

interface ActionCenterItem {
  label: string;
  icon: React.ComponentType<any>;
  isAlert: boolean;
  onClick?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ setViewingTenantId, setCurrentPage }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [actionItems, setActionItems] = useState<ActionCenterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Dashboard useEffect - User state:', {
        user: user,
        email: user?.email,
        hasToken: !!localStorage.getItem('authToken')
      });
      
      if (!user) {
        console.log('No user logged in, skipping dashboard fetch');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching dashboard stats for user:', user.email);
        // Fetch comprehensive dashboard statistics
        const dashboardStats = await api.dashboardAPI.getStats();
        console.log('Dashboard stats loaded successfully');
        setStats(dashboardStats);

        // Generate recent activities from service requests
        const activities: RecentActivity[] = [
          ...dashboardStats.serviceRequests.recent.slice(0, 3).map((sr: any) => ({
            type: 'service_request' as const,
            title: 'Service Request Submitted',
            description: sr.description.split('|')[0] || 'Maintenance request',
            timestamp: new Date(sr.requestDate).toLocaleDateString(),
            status: sr.status === 'new' ? 'pending' as const : sr.status as any
          })),
          {
            type: 'maintenance' as const,
            title: 'Monthly Revenue Update',
            description: `Total potential revenue: ৳${dashboardStats.units.totalRevenue.toLocaleString()}`,
            timestamp: new Date().toLocaleDateString(),
            status: 'completed' as const
          }
        ];

        setRecentActivities(activities);

        // Generate action center items based on real data
        const actionCenterItems: ActionCenterItem[] = [
          {
            label: `${dashboardStats.serviceRequests.active} Active Service Requests`,
            icon: Bell,
            isAlert: dashboardStats.serviceRequests.active > 0,
            onClick: () => setCurrentPage('service-requests')
          },
          {
            label: `${dashboardStats.units.vacant} Vacant Units`,
            icon: HomeIcon,
            isAlert: dashboardStats.units.vacant > 2,
            onClick: () => setCurrentPage('buildings')
          },
          {
            label: `${dashboardStats.leases.endingSoon} Leases Ending Soon`,
            icon: FileWarning,
            isAlert: dashboardStats.leases.endingSoon > 0,
            onClick: () => setCurrentPage('tenants')
          },
          {
            label: `${dashboardStats.applications.pending} Pending Applications`,
            icon: Users,
            isAlert: dashboardStats.applications.pending > 0,
            onClick: () => setCurrentPage('applications')
          }
        ];
        setActionItems(actionCenterItems);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Mock data for charts
  const mockFinancialData: MonthlyProfitData[] = [
    { month: 'Jan', profit: 200000 },
    { month: 'Feb', profit: 240000 },
    { month: 'Mar', profit: 220000 },
    { month: 'Apr', profit: 290000 },
    { month: 'May', profit: 260000 },
    { month: 'Jun', profit: 320000 },
  ];

  const mockServiceRequestData: ServiceRequestVolume[] = [
    { month: 'Jan', new: 8, completed: 12 },
    { month: 'Feb', new: 12, completed: 19 },
    { month: 'Mar', new: 10, completed: 15 },
    { month: 'Apr', new: 15, completed: 25 },
    { month: 'May', new: 11, completed: 18 },
    { month: 'Jun', new: 14, completed: 22 },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-atkinson text-text-main">
            Welcome back!
          </h1>
          <p className="text-text-secondary mt-2">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-atkinson text-text-main">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-text-secondary mt-2">
            {!user ? 'Please log in to view dashboard data.' : 'Unable to load dashboard data.'}
          </p>
          {!user && (
            <button 
              onClick={() => window.location.href = '/login'} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-atkinson text-text-main">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-text-secondary mt-2">
          Here's what's happening with your properties today.
        </p>
        
        {/* Asha Properties Summary */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Asha Properties Portfolio Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-blue-600 font-medium">Properties</p>
              <p className="text-blue-900 text-lg font-bold">{stats.properties.total}</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Units</p>
              <p className="text-blue-900 text-lg font-bold">{stats.units.total} total</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Occupancy</p>
              <p className="text-blue-900 text-lg font-bold">{stats.units.occupied}/{stats.units.total} = {stats.units.occupancyRate}%</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Vacancies</p>
              <p className="text-blue-900 text-lg font-bold">{stats.units.vacant}</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Rental Applications</p>
              <p className="text-blue-900 text-lg font-bold">{stats.applications.pending} pending</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3 pt-3 border-t border-blue-200">
            <div>
              <p className="text-blue-600 font-medium">Active SRs</p>
              <p className="text-blue-900 text-lg font-bold">{stats.serviceRequests.active} 
                {stats.serviceRequests.completedToday > 0 && (
                  <span className="text-xs text-green-600 ml-1">({stats.serviceRequests.completedToday} completed today)</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Leases Ending Soon</p>
              <p className="text-blue-900 text-lg font-bold">{stats.leases.endingSoon}
                {stats.leases.endingToday > 0 && (
                  <span className="text-xs text-red-600 ml-1">({stats.leases.endingToday} today!)</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Monthly Revenue Potential</p>
              <p className="text-blue-900 text-lg font-bold">৳{stats.units.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <button 
            onClick={() => setCurrentPage('service-requests')}
            className="w-full text-left transition-colors duration-200 rounded-lg p-1 -m-1 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary">Active Service Requests</p>
                <p className="text-3xl font-bold text-text-main mt-1">{stats.serviceRequests.active}</p>
                {stats.serviceRequests.completedToday > 0 && (
                  <p className="text-xs text-green-600 mt-1">{stats.serviceRequests.completedToday} completed today</p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition-colors">
                <Wrench className="w-6 h-6" />
              </div>
            </div>
          </button>
        </Card>

        <Card>
          <button 
            onClick={() => setCurrentPage('buildings')}
            className="w-full text-left transition-colors duration-200 rounded-lg p-1 -m-1 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary">Vacant Units</p>
                <p className="text-3xl font-bold text-text-main mt-1">{stats.units.vacant}</p>
                <p className="text-xs text-gray-500 mt-1">out of {stats.units.total} total</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                <HomeIcon className="w-6 h-6" />
              </div>
            </div>
          </button>
        </Card>

        <Card>
          <button 
            onClick={() => setCurrentPage('tenants')}
            className="w-full text-left transition-colors duration-200 rounded-lg p-1 -m-1 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary">Leases Ending Soon</p>
                <p className="text-3xl font-bold text-text-main mt-1">{stats.leases.endingSoon}</p>
                {stats.leases.endingToday > 0 && (
                  <p className="text-xs text-red-600 mt-1">{stats.leases.endingToday} ending today!</p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200 transition-colors">
                <FileWarning className="w-6 h-6" />
              </div>
            </div>
          </button>
        </Card>

        <Card>
          <button 
            onClick={() => setCurrentPage('applications')}
            className="w-full text-left transition-colors duration-200 rounded-lg p-1 -m-1 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary">Pending Applications</p>
                <p className="text-3xl font-bold text-text-main mt-1">{stats.applications.pending}</p>
                <p className="text-xs text-gray-500 mt-1">out of {stats.applications.total} total</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </button>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-3 space-y-6">
          {/* Financial Overview */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-atkinson text-xl font-bold text-text-main">Financial Overview</h3>
              <button className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50">
                Quarterly
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="h-72">
              <FinancialOverviewChart data={mockFinancialData} />
            </div>
          </Card>

          {/* Service Request Volume */}
          <Card>
            <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Service Request Volume</h3>
            <div className="h-72">
              <ServiceRequestVolumeChart data={mockServiceRequestData} />
            </div>
          </Card>
        </div>

        {/* Right Column - Action Center & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Center */}
          <Card>
            <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Action Center</h3>
            <div className="space-y-3">
              {actionItems.map((item, index) => (
                <button 
                  key={index} 
                  onClick={item.onClick}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
                    item.isAlert ? 'bg-red-50 hover:bg-red-100 border border-red-200' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${
                    item.isAlert ? 'text-red-600' : 'text-text-secondary'
                  }`} />
                  <span className={`font-semibold text-sm ${
                    item.isAlert ? 'text-red-700' : 'text-text-main'
                  }`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'in_progress' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-main truncate">{activity.title}</p>
                    <p className="text-xs text-text-secondary truncate">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Leases Ending Soon Details */}
          {stats.leases.endingSoon > 0 && (
            <Card>
              <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Leases Ending Soon</h3>
              <div className="space-y-3">
                {stats.leases.endingSoonDetails.slice(0, 3).map((lease: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-text-main">{lease.tenant}</p>
                      <p className="text-xs text-text-secondary">Unit {lease.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        stats.leases.endingTodayDetails.some((todayLease: any) => todayLease._id === lease._id) 
                          ? 'text-red-500' : 'text-yellow-600'
                      }`}>
                        {new Date(lease.endDate).toLocaleDateString()}
                      </p>
                      {stats.leases.endingTodayDetails.some((todayLease: any) => todayLease._id === lease._id) && (
                        <p className="text-xs text-red-600">Ending today!</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};