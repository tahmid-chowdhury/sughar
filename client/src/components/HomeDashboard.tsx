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
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  totalServiceRequests: number;
  pendingServiceRequests: number;
  totalRevenue: number;
  vacantUnits: number;
  overdueRent: number;
  newApplications: number;
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

interface HighPriorityTenant {
  id: string;
  name: string;
  unit: string;
  daysOverdue: number;
  amount: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ setViewingTenantId, setCurrentPage }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    totalServiceRequests: 0,
    pendingServiceRequests: 0,
    totalRevenue: 0,
    vacantUnits: 0,
    overdueRent: 0,
    newApplications: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [actionItems, setActionItems] = useState<ActionCenterItem[]>([]);
  const [highPriorityTenants, setHighPriorityTenants] = useState<HighPriorityTenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch properties owned by the landlord
        const propertiesResponse = await api.propertiesAPI.getAll();
        // Filter properties by the authenticated user
        const userProperties = propertiesResponse.filter((property: any) => 
          property.userID?.toString() === user._id
        );
        setProperties(userProperties);

        // Fetch units for all user properties
        const allUnitsResponse = await api.unitsAPI.getAll();
        const userUnits = allUnitsResponse.filter((unit: any) =>
          userProperties.some((property: any) => property._id === unit.propertyID?.toString())
        );

        // Store units in state
        setUnits(userUnits);

        // Fetch service requests
        const serviceRequestsResponse = await api.serviceRequestsAPI.getAll();
        // Service requests are already filtered by the backend to include landlord's property requests
        const userServiceRequests = serviceRequestsResponse;

        // Calculate stats
        const occupiedUnits = userUnits.filter((unit: any) => unit.status === 'occupied').length;
        const pendingServiceRequests = userServiceRequests.filter((sr: any) => 
          sr.status === 'pending' || sr.status === 'in_progress'
        ).length;

        // Calculate total monthly revenue
        const totalRevenue = userUnits
          .filter((unit: any) => unit.status === 'occupied')
          .reduce((sum: number, unit: any) => sum + (unit.monthlyRent || 0), 0);

        setStats({
          totalProperties: userProperties.length,
          totalUnits: userUnits.length,
          occupiedUnits,
          totalServiceRequests: userServiceRequests.length,
          pendingServiceRequests,
          totalRevenue,
          vacantUnits: userUnits.length - occupiedUnits,
          overdueRent: Math.floor(Math.random() * 5), // Placeholder - replace with real calculation
          newApplications: Math.floor(Math.random() * 8) // Placeholder - replace with real data
        });

        // Generate recent activities
        const activities: RecentActivity[] = [
          ...userServiceRequests.slice(0, 2).map((sr: any) => ({
            type: 'service_request' as const,
            title: 'Service Request Submitted',
            description: sr.description || 'Maintenance request',
            timestamp: new Date(sr.createdAt || sr.requestDate).toLocaleDateString(),
            status: sr.status
          })),
          {
            type: 'maintenance' as const,
            title: 'Monthly Revenue Update',
            description: `Total collected: ৳${totalRevenue.toLocaleString()}`,
            timestamp: new Date().toLocaleDateString(),
            status: 'completed' as const
          }
        ];

        setRecentActivities(activities);

        // Generate action center items
        const actionCenterItems: ActionCenterItem[] = [
          {
            label: `${stats.pendingServiceRequests} New Service Requests`,
            icon: Bell,
            isAlert: stats.pendingServiceRequests > 0,
            onClick: () => setCurrentPage('service-requests')
          },
          {
            label: `${stats.vacantUnits} Vacant Units`,
            icon: HomeIcon,
            isAlert: stats.vacantUnits > 5,
            onClick: () => setCurrentPage('buildings')
          },
          {
            label: `${stats.overdueRent} Overdue Payments`,
            icon: FileWarning,
            isAlert: stats.overdueRent > 0,
            onClick: () => setCurrentPage('financials')
          },
          {
            label: `${stats.newApplications} New Applications`,
            icon: Users,
            isAlert: stats.newApplications > 0,
            onClick: () => setCurrentPage('tenants')
          }
        ];
        setActionItems(actionCenterItems);

        // Generate mock high priority tenants data
        const mockHighPriorityTenants: HighPriorityTenant[] = [
          {
            id: '1',
            name: 'Ahmed Rahman',
            unit: 'Unit 5A',
            daysOverdue: 15,
            amount: 45000
          },
          {
            id: '2',
            name: 'Fatima Khan',
            unit: 'Unit 3B',
            daysOverdue: 8,
            amount: 38000
          },
          {
            id: '3',
            name: 'Mohammad Ali',
            unit: 'Unit 2C',
            daysOverdue: 22,
            amount: 52000
          }
        ];
        setHighPriorityTenants(mockHighPriorityTenants);

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-atkinson text-text-main">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-text-secondary mt-2">
          Here's what's happening with your properties today.
        </p>
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
                <p className="text-sm text-text-secondary">Open Service Requests</p>
                <p className="text-3xl font-bold text-text-main mt-1">{stats.pendingServiceRequests}</p>
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
                <p className="text-3xl font-bold text-text-main mt-1">{stats.vacantUnits}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                <HomeIcon className="w-6 h-6" />
              </div>
            </div>
          </button>
        </Card>

        <Card>
          <button 
            onClick={() => setCurrentPage('financials')}
            className="w-full text-left transition-colors duration-200 rounded-lg p-1 -m-1 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary">Overdue Rent</p>
                <p className="text-3xl font-bold text-text-main mt-1">{stats.overdueRent}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200 transition-colors">
                <DollarSign className="w-6 h-6" />
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
                <p className="text-sm text-text-secondary">New Applications</p>
                <p className="text-3xl font-bold text-text-main mt-1">{stats.newApplications}</p>
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

        {/* Right Column - Action Center & High Priority */}
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

          {/* High Priority Tenants */}
          <Card>
            <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">High Priority Tenants</h3>
            <div className="space-y-3">
              {highPriorityTenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => setViewingTenantId(tenant.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-bold text-text-main">{tenant.name}</p>
                    <p className="text-xs text-text-secondary">{tenant.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-500">{tenant.daysOverdue} days</p>
                    <p className="text-xs text-text-secondary">৳{tenant.amount.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
