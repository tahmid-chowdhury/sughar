import React, { useState } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { 
    TENANT_DASHBOARD_STATS, 
    TENANTS_DASHBOARD_TABLE_DATA, 
    VACANT_UNITS_BY_BUILDING_DATA,
    RENT_STATUS_CHART_DATA,
    QUICK_VIEW_ACTIONS
} from '../constants';
import { TenantDashboardStat, Tenant, RentStatus, QuickViewAction } from '../types';
import { VacantUnitsChart } from './charts/VacantUnitsChart';
import { RentStatusChart } from './charts/RentStatusChart';
import { ChevronRight } from './icons';
import { CurrentTenantsPage } from './CurrentTenantsPage';
import TenantApplicationsPage from './TenantApplicationsPage';

interface TenantsDashboardProps {
  setViewingTenantId: (id: string) => void;
  initialTab?: string;
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

const TenantTable: React.FC<{ tenants: Tenant[], setViewingTenantId: (id: string) => void, onViewAll?: () => void }> = ({ tenants, setViewingTenantId, onViewAll }) => {
    const displayTenants = tenants.slice(0, 13); // Show only first 13 tenants
    
    return (
        <Card className="!p-0 h-full flex flex-col">
            <div className="overflow-x-auto flex-1">
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
                        {displayTenants.map((tenant) => (
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
                                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">{tenant.building}</td>
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
            {tenants.length > 13 && onViewAll && (
                <div className="border-t border-gray-200 px-5 py-4">
                    <button 
                        onClick={onViewAll}
                        className="w-full text-center text-sm text-accent-primary hover:text-accent-primary-dark font-medium flex items-center justify-center gap-2 py-2"
                    >
                        View all {tenants.length} tenants
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </Card>
    );
};

const QuickViewCard: React.FC = () => (
    <Card className="h-full flex flex-col">
        <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Quick View</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
            {QUICK_VIEW_ACTIONS.map((action, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors flex flex-col justify-between h-24">
                    <p className={`text-sm font-semibold text-text-main ${action.isFullText ? 'text-center' : ''}`}>
                      {action.isFullText ? action.label : <><span className="text-2xl">{action.value}</span> {action.label}</>}
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

export const TenantsDashboard: React.FC<TenantsDashboardProps> = ({ setViewingTenantId, initialTab = 'Overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Hardcoded tenant data for Overview tab
  const hardcodedTenants = [
    // Building 1 – Lalmatia Court
    { id: 'T001', name: 'Farzana Akhter', avatar: 'https://ui-avatars.com/api/?name=Farzana+Akhter&background=random', rating: 4.5, building: 'Lalmatia Court', leaseProgress: 85, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T003', name: 'Shahriar Karim', avatar: 'https://ui-avatars.com/api/?name=Shahriar+Karim&background=random', rating: 4.2, building: 'Lalmatia Court', leaseProgress: 30, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T004', name: 'Tania Akter', avatar: 'https://ui-avatars.com/api/?name=Tania+Akter&background=random', rating: 4.8, building: 'Lalmatia Court', leaseProgress: 32, rentStatus: RentStatus.Pending, requests: 1 },
    { id: 'T005', name: 'Imran Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Imran+Chowdhury&background=random', rating: 4.6, building: 'Lalmatia Court', leaseProgress: 45, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T006', name: 'Sumi Akhter', avatar: 'https://ui-avatars.com/api/?name=Sumi+Akhter&background=random', rating: 4.3, building: 'Lalmatia Court', leaseProgress: 42, rentStatus: RentStatus.Overdue, requests: 1 },
    { id: 'T007', name: 'Hasan Mahmud', avatar: 'https://ui-avatars.com/api/?name=Hasan+Mahmud&background=random', rating: 4.7, building: 'Lalmatia Court', leaseProgress: 52, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T008', name: 'Shuvo Islam', avatar: 'https://ui-avatars.com/api/?name=Shuvo+Islam&background=random', rating: 4.1, building: 'Lalmatia Court', leaseProgress: 25, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T009', name: 'Maruf Khan', avatar: 'https://ui-avatars.com/api/?name=Maruf+Khan&background=random', rating: 4.4, building: 'Lalmatia Court', leaseProgress: 95, rentStatus: RentStatus.Paid, requests: 1 },
    { id: 'T010', name: 'Mahin Alam', avatar: 'https://ui-avatars.com/api/?name=Mahin+Alam&background=random', rating: 4.9, building: 'Lalmatia Court', leaseProgress: 68, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T011', name: 'Saima Binte Noor', avatar: 'https://ui-avatars.com/api/?name=Saima+Binte+Noor&background=random', rating: 4.6, building: 'Lalmatia Court', leaseProgress: 60, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T012', name: 'Javed Rahman', avatar: 'https://ui-avatars.com/api/?name=Javed+Rahman&background=random', rating: 4.2, building: 'Lalmatia Court', leaseProgress: 92, rentStatus: RentStatus.Pending, requests: 0 },
    
    // Building 2 – Banani Heights
    { id: 'T013', name: 'Sadia Hossain', avatar: 'https://ui-avatars.com/api/?name=Sadia+Hossain&background=random', rating: 4.8, building: 'Banani Heights', leaseProgress: 78, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T014', name: 'Kamal Uddin', avatar: 'https://ui-avatars.com/api/?name=Kamal+Uddin&background=random', rating: 4.3, building: 'Banani Heights', leaseProgress: 72, rentStatus: RentStatus.Paid, requests: 1 },
    { id: 'T015', name: 'Mehnaz Sultana', avatar: 'https://ui-avatars.com/api/?name=Mehnaz+Sultana&background=random', rating: 4.7, building: 'Banani Heights', leaseProgress: 48, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T016', name: 'Tanvir Ahmed', avatar: 'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=random', rating: 4.1, building: 'Banani Heights', leaseProgress: 38, rentStatus: RentStatus.Overdue, requests: 1 },
    { id: 'T017', name: 'Nasrin Akter', avatar: 'https://ui-avatars.com/api/?name=Nasrin+Akter&background=random', rating: 4.5, building: 'Banani Heights', leaseProgress: 35, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T018', name: 'Mithun Das', avatar: 'https://ui-avatars.com/api/?name=Mithun+Das&background=random', rating: 4.6, building: 'Banani Heights', leaseProgress: 65, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T019', name: 'Zahid Hasan', avatar: 'https://ui-avatars.com/api/?name=Zahid+Hasan&background=random', rating: 4.4, building: 'Banani Heights', leaseProgress: 55, rentStatus: RentStatus.Pending, requests: 1 },
    { id: 'T020', name: 'Roksana Begum', avatar: 'https://ui-avatars.com/api/?name=Roksana+Begum&background=random', rating: 4.0, building: 'Banani Heights', leaseProgress: 88, rentStatus: RentStatus.Paid, requests: 0 },
    
    // Building 3 – Dhanmondi Residency
    { id: 'T021', name: 'Shila Rahman', avatar: 'https://ui-avatars.com/api/?name=Shila+Rahman&background=random', rating: 4.7, building: 'Dhanmondi Residency', leaseProgress: 28, rentStatus: RentStatus.Paid, requests: 1 },
    { id: 'T022', name: 'Arefin Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Arefin+Chowdhury&background=random', rating: 4.2, building: 'Dhanmondi Residency', leaseProgress: 93, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T023', name: 'Rezaul Karim', avatar: 'https://ui-avatars.com/api/?name=Rezaul+Karim&background=random', rating: 4.5, building: 'Dhanmondi Residency', leaseProgress: 82, rentStatus: RentStatus.Overdue, requests: 1 },
    { id: 'T024', name: 'Nadia Islam', avatar: 'https://ui-avatars.com/api/?name=Nadia+Islam&background=random', rating: 4.8, building: 'Dhanmondi Residency', leaseProgress: 62, rentStatus: RentStatus.Paid, requests: 0 },
    
    // Building 4 – Uttara Gardens
    { id: 'T025', name: 'Selina Yasmin', avatar: 'https://ui-avatars.com/api/?name=Selina+Yasmin&background=random', rating: 4.6, building: 'Uttara Gardens', leaseProgress: 80, rentStatus: RentStatus.Paid, requests: 1 },
    { id: 'T026', name: 'Abdul Malek', avatar: 'https://ui-avatars.com/api/?name=Abdul+Malek&background=random', rating: 4.3, building: 'Uttara Gardens', leaseProgress: 98, rentStatus: RentStatus.Paid, requests: 0 },
    { id: 'T027', name: 'Rafsan Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Rafsan+Chowdhury&background=random', rating: 4.7, building: 'Uttara Gardens', leaseProgress: 75, rentStatus: RentStatus.Paid, requests: 0 }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'Overview':
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              {TENANT_DASHBOARD_STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-6 xl:col-span-7">
                    <TenantTable 
                        tenants={hardcodedTenants} 
                        setViewingTenantId={setViewingTenantId}
                        onViewAll={() => setActiveTab('Current Tenants')}
                    />
                </div>
                <div className="col-span-12 lg:col-span-6 xl:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                    <div className="md:col-span-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card>
                          <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Vacant Units by Building</h3>
                          <div className="h-64">
                              <VacantUnitsChart data={VACANT_UNITS_BY_BUILDING_DATA} />
                          </div>
                      </Card>
                      <Card>
                          <div className="h-full">
                              <RentStatusChart data={RENT_STATUS_CHART_DATA} />
                          </div>
                      </Card>
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                      <QuickViewCard />
                    </div>
                </div>
            </div>
          </>
        );
      case 'Current Tenants':
        return <CurrentTenantsPage setViewingTenantId={setViewingTenantId} />;
      case 'Applications':
        return <TenantApplicationsPage setViewingTenantId={setViewingTenantId} />;
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