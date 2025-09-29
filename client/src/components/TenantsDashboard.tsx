import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { 
    TenantDashboardStat, 
    Tenant,
    CurrentTenant, 
    RentStatus, 
    QuickViewAction
} from '../types';
import { VacantUnitsChart } from './charts/VacantUnitsChart';
import { RentStatusChart } from './charts/RentStatusChart';
import { ChevronRight } from './icons';
import { CurrentTenantsPage } from './CurrentTenantsPage';
import TenantApplicationsPage from './TenantApplicationsPage';
import { BuildingOverviewPage } from './BuildingOverviewPage';
import AllTenantsPage from './AllTenantsPage';
import { rentalApplicationsAPI, currentTenantsAPI, unitsAPI, propertiesAPI, getAuthToken } from '../services/api';

interface TenantsDashboardProps {
  setViewingTenantId: (id: string) => void;
  onBuildingClick?: (buildingId: string) => void;
  onUnitClick?: (buildingId: string, unitId: string) => void;
}

const StatCard: React.FC<{ stat: TenantDashboardStat }> = ({ stat }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full ${stat.bgColor}`}>
      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
    </div>
    <div className="ml-4">
      <p className="text-2xl font-bold text-text-main">{stat.value}</p>
      <p className="text-sm text-text-secondary">{stat.label}</p>
    </div>
  </Card>
);

const RentStatusPill: React.FC<{ status: RentStatus }> = ({ status }) => {
    const styles = {
        [RentStatus.Paid]: 'bg-status-success text-status-success-text',
        [RentStatus.Overdue]: 'bg-status-error text-status-error-text',
        [RentStatus.Pending]: 'bg-status-warning text-status-warning-text',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

const TenantTable: React.FC<{ 
  tenants: (Tenant | CurrentTenant)[], 
  setViewingTenantId: (id: string) => void,
  onBuildingClick?: (buildingId: string) => void 
}> = ({ tenants, setViewingTenantId, onBuildingClick }) => (
    <Card className="!p-0 h-full rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Building</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lease Progress</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent Status</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tenants.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-5 py-12 text-center">
                                <div className="text-gray-500">
                                    <p className="text-lg mb-2">No current tenants found</p>
                                    <p className="text-sm">Current tenants with active leases will appear here</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        tenants.map((tenant) => (
                        <tr key={tenant.id} className="hover:bg-gray-50">
                            <td className="px-5 py-3 whitespace-nowrap">
                                <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left">
                                    <img className="h-8 w-8 rounded-full" src={tenant.avatar} alt={tenant.name} />
                                    <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                                    </div>
                                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{tenant.rating}</span>
                                </button>
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                                {onBuildingClick ? (
                                    <button 
                                        onClick={() => onBuildingClick(tenant.building)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {tenant.building}
                                    </button>
                                ) : (
                                    tenant.building
                                )}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                                {'unit' in tenant ? tenant.unit : 'N/A'}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap">
                                {(() => {
                                    // Handle both Tenant (number) and CurrentTenant (object) types
                                    const progressValue = typeof tenant.leaseProgress === 'number' 
                                        ? tenant.leaseProgress 
                                        : tenant.leaseProgress.value;
                                    const progressVariant = typeof tenant.leaseProgress === 'object' 
                                        ? tenant.leaseProgress.variant 
                                        : 'light';
                                    const bgColor = progressVariant === 'dark' ? 'bg-purple-400' : 'bg-purple-300';
                                    
                                    return (
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`${bgColor} h-2 rounded-full`} 
                                                style={{ width: `${progressValue}%` }}
                                            ></div>
                                        </div>
                                    );
                                })()
                            }</td>
                            <td className="px-5 py-3 whitespace-nowrap"><RentStatusPill status={tenant.rentStatus} /></td>
                            <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{tenant.requests}</td>
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </Card>
);

const QuickViewCard: React.FC<{ actions: any[], onActionClick: (action: string) => void }> = ({ actions, onActionClick }) => (
    <Card className="h-full flex flex-col">
        <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Quick View</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
            {actions.map((action, index) => (
                <div 
                    key={index} 
                    className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors flex flex-col justify-between h-24"
                    onClick={() => onActionClick(action.label?.toLowerCase())}
                >
                    <p className="text-sm font-semibold text-text-main">
                        <span className="text-2xl">{action.value}</span> {action.label}
                    </p>
                    <ChevronRight className="w-4 h-4 text-gray-400 self-end" />
                </div>
            ))}
        </div>
        <button className="w-full mt-auto bg-accent-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-500 transition-colors">
            View Smart Actions
        </button>
    </Card>
);

export const TenantsDashboard: React.FC<TenantsDashboardProps> = ({ 
  setViewingTenantId, 
  onBuildingClick, 
  onUnitClick 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [currentView, setCurrentView] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState<TenantDashboardStat[]>([]);
  const [tenants, setTenants] = useState<CurrentTenant[]>([]);
  const [vacantUnitsData, setVacantUnitsData] = useState<any[]>([]);
  const [rentStatusData, setRentStatusData] = useState<any[]>([]);
  const [quickActions, setQuickActions] = useState<any[]>([]);

  useEffect(() => {
    const loadHardcodedTenantData = () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('=== Loading Hardcoded Tenant Data ===');
        console.log('Auth token:', !!getAuthToken());
        
        // Hardcoded tenant data based on the provided information
        const currentTenants: CurrentTenant[] = [
          // Building 1 – Lalmatia Court
          { id: 'T001', name: 'Farzana Akhter', avatar: 'https://ui-avatars.com/api/?name=Farzana+Akhter&background=random', rating: 4.5, building: 'Lalmatia Court', unit: 101, leaseProgress: { value: 85, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T003', name: 'Shahriar Karim', avatar: 'https://ui-avatars.com/api/?name=Shahriar+Karim&background=random', rating: 4.2, building: 'Lalmatia Court', unit: 103, leaseProgress: { value: 30, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T004', name: 'Tania Akter', avatar: 'https://ui-avatars.com/api/?name=Tania+Akter&background=random', rating: 4.8, building: 'Lalmatia Court', unit: 104, leaseProgress: { value: 32, variant: 'light' }, rentStatus: RentStatus.Pending, requests: 1 },
          { id: 'T005', name: 'Imran Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Imran+Chowdhury&background=random', rating: 4.6, building: 'Lalmatia Court', unit: 201, leaseProgress: { value: 45, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T006', name: 'Sumi Akhter', avatar: 'https://ui-avatars.com/api/?name=Sumi+Akhter&background=random', rating: 4.3, building: 'Lalmatia Court', unit: 202, leaseProgress: { value: 42, variant: 'light' }, rentStatus: RentStatus.Overdue, requests: 1 },
          { id: 'T007', name: 'Hasan Mahmud', avatar: 'https://ui-avatars.com/api/?name=Hasan+Mahmud&background=random', rating: 4.7, building: 'Lalmatia Court', unit: 203, leaseProgress: { value: 52, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T008', name: 'Shuvo Islam', avatar: 'https://ui-avatars.com/api/?name=Shuvo+Islam&background=random', rating: 4.1, building: 'Lalmatia Court', unit: 204, leaseProgress: { value: 25, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T009', name: 'Maruf Khan', avatar: 'https://ui-avatars.com/api/?name=Maruf+Khan&background=random', rating: 4.4, building: 'Lalmatia Court', unit: 301, leaseProgress: { value: 95, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 1 },
          { id: 'T010', name: 'Mahin Alam', avatar: 'https://ui-avatars.com/api/?name=Mahin+Alam&background=random', rating: 4.9, building: 'Lalmatia Court', unit: 302, leaseProgress: { value: 68, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T011', name: 'Saima Binte Noor', avatar: 'https://ui-avatars.com/api/?name=Saima+Binte+Noor&background=random', rating: 4.6, building: 'Lalmatia Court', unit: 303, leaseProgress: { value: 60, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T012', name: 'Javed Rahman', avatar: 'https://ui-avatars.com/api/?name=Javed+Rahman&background=random', rating: 4.2, building: 'Lalmatia Court', unit: 304, leaseProgress: { value: 92, variant: 'dark' }, rentStatus: RentStatus.Pending, requests: 0 },
          
          // Building 2 – Banani Heights
          { id: 'T013', name: 'Sadia Hossain', avatar: 'https://ui-avatars.com/api/?name=Sadia+Hossain&background=random', rating: 4.8, building: 'Banani Heights', unit: 101, leaseProgress: { value: 78, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T014', name: 'Kamal Uddin', avatar: 'https://ui-avatars.com/api/?name=Kamal+Uddin&background=random', rating: 4.3, building: 'Banani Heights', unit: 102, leaseProgress: { value: 72, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 1 },
          { id: 'T015', name: 'Mehnaz Sultana', avatar: 'https://ui-avatars.com/api/?name=Mehnaz+Sultana&background=random', rating: 4.7, building: 'Banani Heights', unit: 103, leaseProgress: { value: 48, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T016', name: 'Tanvir Ahmed', avatar: 'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=random', rating: 4.1, building: 'Banani Heights', unit: 104, leaseProgress: { value: 38, variant: 'light' }, rentStatus: RentStatus.Overdue, requests: 1 },
          { id: 'T017', name: 'Nasrin Akter', avatar: 'https://ui-avatars.com/api/?name=Nasrin+Akter&background=random', rating: 4.5, building: 'Banani Heights', unit: 201, leaseProgress: { value: 35, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T018', name: 'Mithun Das', avatar: 'https://ui-avatars.com/api/?name=Mithun+Das&background=random', rating: 4.6, building: 'Banani Heights', unit: 202, leaseProgress: { value: 65, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T019', name: 'Zahid Hasan', avatar: 'https://ui-avatars.com/api/?name=Zahid+Hasan&background=random', rating: 4.4, building: 'Banani Heights', unit: 203, leaseProgress: { value: 55, variant: 'dark' }, rentStatus: RentStatus.Pending, requests: 1 },
          { id: 'T020', name: 'Roksana Begum', avatar: 'https://ui-avatars.com/api/?name=Roksana+Begum&background=random', rating: 4.0, building: 'Banani Heights', unit: 204, leaseProgress: { value: 88, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 },
          
          // Building 3 – Dhanmondi Residency (excluding vacant units)
          { id: 'T021', name: 'Shila Rahman', avatar: 'https://ui-avatars.com/api/?name=Shila+Rahman&background=random', rating: 4.7, building: 'Dhanmondi Residency', unit: 102, leaseProgress: { value: 28, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 1 },
          { id: 'T022', name: 'Arefin Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Arefin+Chowdhury&background=random', rating: 4.2, building: 'Dhanmondi Residency', unit: 103, leaseProgress: { value: 93, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T023', name: 'Rezaul Karim', avatar: 'https://ui-avatars.com/api/?name=Rezaul+Karim&background=random', rating: 4.5, building: 'Dhanmondi Residency', unit: 104, leaseProgress: { value: 82, variant: 'dark' }, rentStatus: RentStatus.Overdue, requests: 1 },
          { id: 'T024', name: 'Nadia Islam', avatar: 'https://ui-avatars.com/api/?name=Nadia+Islam&background=random', rating: 4.8, building: 'Dhanmondi Residency', unit: 105, leaseProgress: { value: 62, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 },
          
          // Building 4 – Uttara Gardens
          { id: 'T025', name: 'Selina Yasmin', avatar: 'https://ui-avatars.com/api/?name=Selina+Yasmin&background=random', rating: 4.6, building: 'Uttara Gardens', unit: 1, leaseProgress: { value: 80, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 1 },
          { id: 'T026', name: 'Abdul Malek', avatar: 'https://ui-avatars.com/api/?name=Abdul+Malek&background=random', rating: 4.3, building: 'Uttara Gardens', unit: 2, leaseProgress: { value: 98, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 },
          { id: 'T027', name: 'Rafsan Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Rafsan+Chowdhury&background=random', rating: 4.7, building: 'Uttara Gardens', unit: 3, leaseProgress: { value: 75, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 0 }
        ];
        
        // Calculate stats from hardcoded data
        const totalTenants = currentTenants.length;
        const paidCount = currentTenants.filter(t => t.rentStatus === 'Paid').length;
        const pendingCount = currentTenants.filter(t => t.rentStatus === 'Pending').length;
        const overdueCount = currentTenants.filter(t => t.rentStatus === 'Overdue').length;
        const totalRequests = currentTenants.reduce((sum, t) => sum + t.requests, 0);
        
        // Create dashboard stats
        const stats = [
          {
            label: 'Total Applications',
            value: '12',
            icon: () => null,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
          },
          {
            label: 'Active Tenants', 
            value: totalTenants.toString(),
            icon: () => null,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
          },
          {
            label: 'Pending Applications',
            value: '5',
            icon: () => null,
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
          },
          {
            label: 'Occupancy Rate',
            value: '93%', // 26 out of 28 total units occupied
            icon: () => null,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
          }
        ];
        
        setDashboardStats(stats);
        setTenants(currentTenants);

        // Create vacant units data by building
        const buildingVacancyData = [
          { name: 'Lalmatia Court', vacant: 1 }, // Unit 2A is vacant
          { name: 'Banani Heights', vacant: 0 },
          { name: 'Dhanmondi Residency', vacant: 1 }, // Unit 1A is vacant
          { name: 'Uttara Gardens', vacant: 0 }
        ];
        
        setVacantUnitsData(buildingVacancyData);

        // Create rent status data
        const rentData = [
          { name: 'Paid', value: paidCount, color: '#10B981' },
          { name: 'Pending', value: pendingCount, color: '#F59E0B' },
          { name: 'Overdue', value: overdueCount, color: '#EF4444' }
        ];
        
        setRentStatusData(rentData);

        // Set quick actions with real data
        const actions = [
          { label: 'Applications', value: '12' },
          { label: 'Active Tenants', value: totalTenants.toString() },
          { label: 'Overdue', value: overdueCount.toString() },
          { label: 'Vacant Units', value: '2' }
        ];
        
        setQuickActions(actions);
        
        console.log('✅ Hardcoded tenant data loaded successfully');
        console.log('Total tenants:', totalTenants);
        console.log('Rent status breakdown:', { paid: paidCount, pending: pendingCount, overdue: overdueCount });
        
      } catch (err) {
        console.error('Error loading hardcoded tenant data:', err);
        setError('Failed to load tenant data');
      } finally {
        setLoading(false);
      }
    };

    // Simulate a brief loading delay
    setTimeout(() => {
      loadHardcodedTenantData();
    }, 500);
  }, []);

  const renderContent = () => {
    // Show loading state for Overview tab
    if (loading && activeTab === 'Overview') {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading tenant dashboard...</div>
        </div>
      );
    }

    // Show error state for Overview tab
    if (error && activeTab === 'Overview') {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch(activeTab) {
      case 'Overview':
        return <BuildingOverviewPage 
          onBuildingClick={onBuildingClick}
          onUnitClick={onUnitClick}
        />;
      case 'Current Tenants':
        return <CurrentTenantsPage 
          setViewingTenantId={setViewingTenantId}
          onBuildingClick={onBuildingClick}
          onUnitClick={onUnitClick}
          initialData={tenants}
          loading={loading}
          error={error}
        />;
      case 'Applications':
        return <TenantApplicationsPage 
          setViewingTenantId={setViewingTenantId}
          onBuildingClick={onBuildingClick}
          onUnitClick={onUnitClick}
        />;
      case 'All Tenants':
        return <AllTenantsPage 
          setViewingTenantId={setViewingTenantId}
        />;
      default:
        return null;
    }
  };
  
  const getPageTitle = () => {
    switch (activeTab) {
      case 'Applications':
        return 'Prospective Tenant Applications';
      case 'All Tenants':
        return 'All Tenant Users';
      default:
        return 'Tenants Dashboard';
    }
  };

  return (
    <div className="container mx-auto">
      <Header 
        title={getPageTitle()}
        tabs={['Overview', 'Current Tenants', 'All Tenants', 'Applications']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {renderContent()}
    </div>
  );
};