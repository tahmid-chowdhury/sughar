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
import { TenantApplicationsPage } from './TenantApplicationsPage';

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

export const TenantsDashboard: React.FC<TenantsDashboardProps> = ({ setViewingTenantId, onBuildingClick, onUnitClick }) => {
  const [activeTab, setActiveTab] = useState('Overview');

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
                        tenants={TENANTS_DASHBOARD_TABLE_DATA} 
                        setViewingTenantId={setViewingTenantId}
                        onBuildingClick={onBuildingClick}
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