import React, { useState } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { OccupancyChart } from './charts/OccupancyChart';
import { RentCollectionChart } from './charts/RentCollectionChart';
import { 
    SPECIFIC_BUILDING_STATS, 
    LEASES_ENDING_SOON_DATA, 
    OVERDUE_RENT_DATA, 
    OCCUPANCY_DATA, 
    RENT_COLLECTION_DATA,
    BUILDING_NAMES
} from '../constants';
import { LeaseEndingSoon, OverdueRent, SpecificBuildingStat } from '../types';
import { ArrowLeft, MoreHorizontal } from './icons';
import { SpecificBuildingUnitsPage } from './SpecificBuildingUnitsPage';
import { SpecificBuildingDocumentsPage } from './SpecificBuildingDocumentsPage';

interface SpecificBuildingPageProps {
  buildingId: string;
  onBack: () => void;
  setViewingTenantId: (tenantId: string) => void;
  onUnitClick?: (unitId: string) => void;
}

// FIX: Changed component to use React.FC to properly type props and resolve key assignment error.
const StatCard: React.FC<{ stat: SpecificBuildingStat }> = ({ stat }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full ${stat.bgColor}`}>
      <stat.icon className={`w-6 h-6 ${stat.color}`} />
    </div>
    <div className="ml-4">
      <p className="text-2xl font-bold text-text-main">{stat.value}</p>
      <p className="text-sm text-text-secondary">{stat.label}</p>
    </div>
  </Card>
);

const TenantCell: React.FC<{ tenant: { id: string, name: string, avatar: string, rating: number }, setViewingTenantId: (id: string) => void }> = ({ tenant, setViewingTenantId }) => (
    <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary">
        <img className="h-8 w-8 rounded-full object-cover" src={tenant.avatar} alt={tenant.name} />
        <div className="ml-3">
            <p className="font-medium text-gray-900 text-sm">{tenant.name}</p>
        </div>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{tenant.rating}</span>
    </button>
);

const LeasesEndingSoonTable: React.FC<{ data: LeaseEndingSoon[], setViewingTenantId: (id: string) => void }> = ({ data, setViewingTenantId }) => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-atkinson text-xl font-bold text-text-main">Leases Ending Soon</h3>
            <button className="text-text-secondary hover:text-text-main">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                    <tr>
                        <th className="py-2 font-medium">Tenant</th>
                        <th className="py-2 font-medium">Unit</th>
                        <th className="py-2 font-medium">Lease Start Date</th>
                        <th className="py-2 font-medium">Lease End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((lease) => (
                        <tr key={lease.tenant.id} className="border-b border-gray-200 last:border-b-0">
                            <td className="py-3"><TenantCell tenant={lease.tenant} setViewingTenantId={setViewingTenantId} /></td>
                            <td className="py-3 text-gray-700">{lease.unit}</td>
                            <td className="py-3 text-gray-700">{lease.leaseStartDate}</td>
                            <td className="py-3 text-gray-700">{lease.leaseEndDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const OverdueRentTable: React.FC<{ data: OverdueRent[], setViewingTenantId: (id: string) => void }> = ({ data, setViewingTenantId }) => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-atkinson text-xl font-bold text-text-main">Overdue Rent</h3>
            <button className="text-text-secondary hover:text-text-main">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                    <tr>
                        <th className="py-2 font-medium">Tenant</th>
                        <th className="py-2 font-medium">Unit</th>
                        <th className="py-2 font-medium">Amount Due</th>
                        <th className="py-2 font-medium">Days Overdue</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((rent) => (
                        <tr key={rent.tenant.id} className="border-b border-gray-200 last:border-b-0">
                            <td className="py-3"><TenantCell tenant={rent.tenant} setViewingTenantId={setViewingTenantId}/></td>
                            <td className="py-3 text-gray-700">{rent.unit}</td>
                            <td className="py-3 text-gray-700">{new Intl.NumberFormat('en-US').format(rent.amountDue)}</td>
                            <td className="py-3 text-red-600 font-semibold">{rent.daysOverdue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const BuildingOverview: React.FC<{setViewingTenantId: (id: string) => void}> = ({ setViewingTenantId }) => (
    <>
         {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {SPECIFIC_BUILDING_STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
            ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8 flex flex-col">
                <LeasesEndingSoonTable data={LEASES_ENDING_SOON_DATA} setViewingTenantId={setViewingTenantId} />
                <OverdueRentTable data={OVERDUE_RENT_DATA} setViewingTenantId={setViewingTenantId} />
            </div>
            
            {/* Right Column */}
            <div className="space-y-8 flex flex-col">
            <Card className="flex flex-col h-[280px]">
                <OccupancyChart data={OCCUPANCY_DATA} />
            </Card>
            <Card>
                <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Rent Collection</h3>
                <div className="h-64">
                    <RentCollectionChart data={RENT_COLLECTION_DATA} />
                </div>
            </Card>
            </div>
        </div>
    </>
);

export const SpecificBuildingPage: React.FC<SpecificBuildingPageProps> = ({ buildingId, onBack, setViewingTenantId, onUnitClick }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const buildingName = BUILDING_NAMES[buildingId] || "Building Details";

  const renderContent = () => {
    switch(activeTab) {
        case 'Overview':
            return <BuildingOverview setViewingTenantId={setViewingTenantId} />;
        case 'Units':
            return <SpecificBuildingUnitsPage buildingId={buildingId} setViewingTenantId={setViewingTenantId} onUnitClick={onUnitClick} />;
        case 'Documents':
            return <SpecificBuildingDocumentsPage buildingId={buildingId} />;
        default:
            return <BuildingOverview setViewingTenantId={setViewingTenantId} />;
    }
  }

  return (
    <div className="container mx-auto">
      <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <Header 
        title={buildingName}
        tabs={['Overview', 'Units', 'Documents']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderContent()}
    </div>
  );
};