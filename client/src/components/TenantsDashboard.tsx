import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { 
    TenantDashboardStat, 
    Tenant, 
    RentStatus, 
    QuickViewAction
} from '../types';
import { VacantUnitsChart } from './charts/VacantUnitsChart';
import { RentStatusChart } from './charts/RentStatusChart';
import { ChevronRight } from './icons';
import { CurrentTenantsPage } from './CurrentTenantsPage';
import { TenantApplicationsPage } from './TenantApplicationsPage';
import { rentalApplicationsAPI, leaseAgreementsAPI, unitsAPI, propertiesAPI } from '../services/api';

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
  tenants: Tenant[], 
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
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lease Progress</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent Status</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tenants.map((tenant) => (
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
                            <td className="px-5 py-3 whitespace-nowrap">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div className="bg-accent-primary h-2 rounded-full" style={{ width: `${tenant.leaseProgress}%` }}></div>
                                </div>
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap"><RentStatusPill status={tenant.rentStatus} /></td>
                            <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{tenant.requests}</td>
                        </tr>
                    ))}
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
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [vacantUnitsData, setVacantUnitsData] = useState<any[]>([]);
  const [rentStatusData, setRentStatusData] = useState<any[]>([]);
  const [quickActions, setQuickActions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true);
        const [applications, leases, units, properties] = await Promise.all([
          rentalApplicationsAPI.getAll(),
          leaseAgreementsAPI.getAll(),
          unitsAPI.getAll(),
          propertiesAPI.getAll()
        ]);

        // Calculate stats
        const totalApplications = applications.length;
        const approvedApplications = applications.filter((app: any) => app.status === 'approved').length;
        const pendingApplications = applications.filter((app: any) => app.status === 'pending').length;
        const totalUnits = units.length;
        const occupiedUnits = units.filter((unit: any) => unit.isOccupied).length;
        const vacantUnits = totalUnits - occupiedUnits;
        const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

        // Create dashboard stats
        const stats = [
          {
            label: 'Total Applications',
            value: totalApplications.toString(),
            icon: () => null,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
          },
          {
            label: 'Approved Tenants', 
            value: approvedApplications.toString(),
            icon: () => null,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
          },
          {
            label: 'Pending Applications',
            value: pendingApplications.toString(),
            icon: () => null,
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
          },
          {
            label: 'Occupancy Rate',
            value: `${occupancyRate}%`,
            icon: () => null,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
          }
        ];
        
        setDashboardStats(stats);

        // Transform applications to tenants
        const tenantsData = applications
          .filter((app: any) => app.status === 'approved')
          .map((app: any, index: number) => ({
            id: app._id,
            name: app.applicantID?.firstName + ' ' + app.applicantID?.lastName || 'Unknown Tenant',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.applicantID?.email || index}`,
            building: app.unitID?.propertyID?.address?.split(',')[0] || 'Unknown Building',
            leaseProgress: Math.floor(Math.random() * 100), // Placeholder - calculate actual progress
            rentStatus: Math.random() > 0.7 ? RentStatus.Overdue : Math.random() > 0.3 ? RentStatus.Paid : RentStatus.Pending,
            requests: Math.floor(Math.random() * 5),
            rating: (4 + Math.random()).toFixed(1)
          }));
        
        setTenants(tenantsData);

        // Create vacant units data by building
        const buildingVacancyData = properties.map((property: any) => {
          const propertyUnits = units.filter((unit: any) => 
            unit.propertyID?._id === property._id || unit.propertyID === property._id
          );
          const vacantCount = propertyUnits.filter((unit: any) => !unit.isOccupied).length;
          
          return {
            name: property.address?.split(',')[0] || 'Unknown',
            vacant: vacantCount
          };
        });
        
        setVacantUnitsData(buildingVacancyData);

        // Create rent status data
        const paidCount = tenantsData.filter((t: any) => t.rentStatus === RentStatus.Paid).length;
        const pendingCount = tenantsData.filter((t: any) => t.rentStatus === RentStatus.Pending).length;
        const overdueCount = tenantsData.filter((t: any) => t.rentStatus === RentStatus.Overdue).length;
        
        const rentData = [
          { name: 'Paid', value: paidCount, color: '#10B981' },
          { name: 'Pending', value: pendingCount, color: '#F59E0B' },
          { name: 'Overdue', value: overdueCount, color: '#EF4444' }
        ];
        
        setRentStatusData(rentData);

        // Set quick actions (simplified to match existing structure)
        const actions = [
          { label: 'Applications', value: totalApplications.toString() },
          { label: 'Active Tenants', value: approvedApplications.toString() },
          { label: 'Overdue', value: overdueCount.toString() },
          { label: 'Vacant Units', value: vacantUnits.toString() }
        ];
        
        setQuickActions(actions);
        
      } catch (err) {
        console.error('Error fetching tenant data:', err);
        setError('Failed to load tenant data');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'Overview':
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              {dashboardStats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-6 xl:col-span-7">
                    <TenantTable 
                        tenants={tenants} 
                        setViewingTenantId={setViewingTenantId}
                        onBuildingClick={onBuildingClick}
                    />
                </div>
                <div className="col-span-12 lg:col-span-6 xl:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                    <div className="md:col-span-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <Card>
              <h3 className="text-lg font-semibold mb-4">Vacant Units by Building</h3>
              <VacantUnitsChart data={vacantUnitsData} />
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-4">Rent Status Overview</h3>
              <RentStatusChart data={rentStatusData} />
            </Card>
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                      <QuickViewCard 
                        actions={quickActions} 
                        onActionClick={(action) => setActiveTab(action === 'applications' ? 'Applications' : action === 'current-tenants' ? 'Current Tenants' : 'Overview')}
                      />
                    </div>
                </div>
            </div>
          </>
        );
      case 'Current Tenants':
        return <CurrentTenantsPage 
          setViewingTenantId={setViewingTenantId}
          onBuildingClick={onBuildingClick}
          onUnitClick={onUnitClick}
        />;
      case 'Applications':
        return <TenantApplicationsPage 
          setViewingTenantId={setViewingTenantId}
          onBuildingClick={onBuildingClick}
          onUnitClick={onUnitClick}
        />;
      default:
        return null;
    }
  };
  
  const pageTitle = activeTab === 'Applications' ? 'Prospective Tenant Applications' : 'Tenants Dashboard';

  return (
    <div className="container mx-auto">
      <Header 
        title={pageTitle}
        tabs={['Overview', 'Current Tenants', 'Applications']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {renderContent()}
    </div>
  );
};