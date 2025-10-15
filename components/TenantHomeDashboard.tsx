
import React from 'react';
import { Card } from './Card';
import { User, AppData, RequestStatus, RentStatus } from '../types';
import { Search, Wrench, DollarSign, FileText, Calendar, Bell, ChevronRight } from './icons';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TenantHomeDashboardProps {
  currentUser: User;
  appData: AppData;
  onNavigate: (page: string, tab?: string) => void;
}

const StatCard: React.FC<{ 
  icon: React.ElementType; 
  iconBg: string;
  iconColor: string;
  label: string; 
  value: string;
  subtext?: string;
}> = ({ icon: Icon, iconBg, iconColor, label, value, subtext }) => {
    return (
        <Card className="h-full">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs text-text-secondary mb-2">{label}</p>
                    <p className="text-2xl font-bold text-text-main">{value}</p>
                    {subtext && <p className="text-xs text-text-secondary mt-1">{subtext}</p>}
                </div>
                <div className={`p-2.5 rounded-lg ${iconBg}`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
        </Card>
    );
};

export const TenantHomeDashboard: React.FC<TenantHomeDashboardProps> = ({ currentUser, appData, onNavigate }) => {
  const userName = currentUser.name.split(' ')[0];
  
  // Find the tenant profile for this user
  const tenantProfile = appData.tenants.find(t => t.name === currentUser.name);
  
  if (!tenantProfile) {
    return (
      <div className="container mx-auto text-center p-8">
        <h2 className="text-2xl text-text-secondary">Tenant profile not found.</h2>
      </div>
    );
  }

  // Get tenant's unit details
  const tenantUnit = appData.units.find(u => u.currentTenantId === tenantProfile.id);
  const tenantBuilding = tenantUnit ? appData.buildings.find(b => b.id === tenantUnit.buildingId) : undefined;

  // Calculate tenant-specific stats
  const myRequests = appData.serviceRequests.filter(sr => sr.tenantId === tenantProfile.id);
  const activeRequests = myRequests.filter(sr => sr.status !== RequestStatus.Complete).length;
  const completedRequests = myRequests.filter(sr => sr.status === RequestStatus.Complete).length;
  const inProgressRequests = myRequests.filter(sr => sr.status === RequestStatus.InProgress).length;
  const pendingRequests = myRequests.filter(sr => sr.status === RequestStatus.Pending).length;
  
  const monthlyRent = tenantUnit?.monthlyRent || 0;
  
  // Calculate lease dates
  const leaseEndDate = tenantUnit?.leaseEndDate ? new Date(tenantUnit.leaseEndDate) : null;
  const leaseStartDate = tenantUnit?.leaseStartDate ? new Date(tenantUnit.leaseStartDate) : null;
  const today = new Date();
  const daysUntilLeaseEnd = leaseEndDate ? Math.ceil((leaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // Rent payment history data (mock - would come from payment records in real app)
  const rentPaymentData = [
    { name: 'On Time', value: 85, color: '#F472B6' },
    { name: 'Late', value: 15, color: '#EBD4F8' },
  ];

  // Service request breakdown data
  const serviceRequestData = [
    { name: 'Completed', value: completedRequests, color: '#F472B6' },
    { name: 'In Progress', value: inProgressRequests, color: '#D8B4FE' },
    { name: 'Pending', value: pendingRequests, color: '#EBD4F8' },
  ].filter(item => item.value > 0);

  // Building manager info
  const buildingManager = tenantBuilding?.contact;

  // Important notices data
  const importantNotices = [
    { type: 'info', title: 'Monthly Building Meeting - Oct 20', description: 'All residents are invited to the monthly meeting in the lobby at 6:00 PM.', color: 'blue' },
    { type: 'warning', title: 'Water Maintenance - Oct 25', description: 'Water will be shut off from 9:00 AM to 3:00 PM for routine maintenance work.', color: 'yellow' },
    { type: 'success', title: 'New Recycling Program Launched', description: 'Separate bins for plastic and paper are now available on each floor.', color: 'green' },
    { type: 'alert', title: 'Package Delivery Hours Updated', description: 'Packages will now be accepted at the front desk from 8:00 AM to 8:00 PM daily.', color: 'purple' },
  ];

  const noticeColors = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-800' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800' },
    green: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-800' },
  };

  return (
    <div className="container mx-auto">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-atkinson text-text-main">
            Welcome Home, {userName}!
          </h1>
          <p className="text-text-secondary mt-1">Your apartment dashboard at a glance.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search..."
                className="w-full md:w-72 pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
            />
        </div>
      </header>
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={DollarSign}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          label="Upcoming Rent Due"
          value={`৳${monthlyRent.toLocaleString()}`}
        />
        <StatCard
          icon={Wrench}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          label="Active Service Requests"
          value={activeRequests.toString()}
        />
        <StatCard
          icon={Calendar}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          label="Days Remaining in Lease"
          value={`${daysUntilLeaseEnd} days`}
          subtext={leaseStartDate && leaseEndDate ? `${leaseStartDate.toLocaleDateString()} - ${leaseEndDate.toLocaleDateString()}` : undefined}
        />
        <StatCard
          icon={Bell}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          label="Unread Notices"
          value="3"
        />
      </div>

      {/* Important Notices */}
      <Card className="mb-8">
        <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Important Notices</h3>
        <div className="space-y-3">
          {importantNotices.map((notice, i) => {
            const colors = noticeColors[notice.color as keyof typeof noticeColors];
            return (
              <div key={i} className={`p-3 ${colors.bg} border-l-4 ${colors.border} rounded`}>
                <p className={`text-sm font-medium ${colors.text}`}>{notice.title}</p>
                <p className="text-xs text-text-secondary mt-1">{notice.description}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Rent Payment Record */}
        <div className="lg:col-span-2">
        <Card className="h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-atkinson text-lg font-bold text-text-main">Rent Payment Record</h3>
            <button className="text-xs text-brand-pink hover:underline">view all</button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rentPaymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {rentPaymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {rentPaymentData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-text-secondary">{item.name}:</span>
                </div>
                <span className="font-medium text-text-main">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
        </div>

        {/* My Service Requests */}
        <div className="lg:col-span-2">
        <Card className="h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-atkinson text-lg font-bold text-text-main">My Service Requests</h3>
            <button onClick={() => onNavigate('service-requests')} className="text-xs text-brand-pink hover:underline">view all</button>
          </div>
          <div className="h-64 flex items-center justify-center">
            {serviceRequestData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceRequestData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {serviceRequestData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-secondary text-sm">No service requests</p>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {serviceRequestData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-text-secondary">{item.name}:</span>
                </div>
                <span className="font-medium text-text-main">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
        </div>

        {/* Lease Snapshot & Action Center */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Lease Snapshot</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Start Date</span>
                <span className="text-text-main font-medium">{leaseStartDate?.toLocaleDateString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">End Date</span>
                <span className="text-text-main font-medium">{leaseEndDate?.toLocaleDateString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Monthly Rent</span>
                <span className="text-text-main font-medium">৳{monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Deposit</span>
                <span className="text-text-main font-medium">৳{(monthlyRent * 2).toLocaleString()}</span>
              </div>
              {buildingManager && (
                <div className="pt-3 border-t">
                  <p className="text-text-secondary text-xs mb-2">Building Manager</p>
                  <div className="flex items-center">
                    <img src={buildingManager.avatar} alt={buildingManager.name} className="w-8 h-8 rounded-full" />
                    <div className="ml-2">
                      <p className="text-sm font-medium text-text-main">{buildingManager.name}</p>
                      <p className="text-xs text-text-secondary">+880 1234-567890</p>
                      <p className="text-xs text-text-secondary">manager@sughar.com</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Action Center</h3>
            <div className="space-y-2">
              <button onClick={() => onNavigate('payments')} className="w-full flex items-center justify-between p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors text-left border border-pink-200">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-pink-600 mr-3" />
                  <span className="text-sm font-medium text-pink-600">Pay Rent Now</span>
                </div>
                <ChevronRight className="w-4 h-4 text-pink-600" />
              </button>
              <button onClick={() => onNavigate('service-requests')} className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="flex items-center">
                  <Wrench className="w-5 h-5 text-text-secondary mr-3" />
                  <span className="text-sm font-medium text-text-main">Submit New Request</span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </button>
              <button onClick={() => onNavigate('documents')} className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-text-secondary mr-3" />
                  <span className="text-sm font-medium text-text-main">View Documents</span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </button>
              <button onClick={() => onNavigate('settings')} className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-text-secondary mr-3" />
                  <span className="text-sm font-medium text-text-main">Help & Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
