import React from 'react';
import { Card } from './Card';
import { AppData, Tenant } from '../types';
import { useTable } from '../hooks/useTable';
import { SortableHeader } from './SortableHeader';
import { Search } from './icons';

interface LeasesEndingSoonPageProps {
  appData: AppData;
  setViewingTenantId: (id: string) => void;
  onSelectBuilding: (id: string) => void;
  onSelectUnit: (id: string) => void;
}

export const LeasesEndingSoonPage: React.FC<LeasesEndingSoonPageProps> = ({ appData, setViewingTenantId, onSelectBuilding, onSelectUnit }) => {
    
    const leasesEndingSoon = React.useMemo(() => {
        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);
        
        return appData.units
            .filter(unit => unit.leaseEndDate && new Date(unit.leaseEndDate) >= today && new Date(unit.leaseEndDate) <= next30Days && unit.currentTenantId)
            .map(unit => {
                const tenant = appData.tenants.find(t => t.id === unit.currentTenantId);
                const building = appData.buildings.find(b => b.id === unit.buildingId);
                return { 
                    ...tenant, 
                    leaseEndDate: unit.leaseEndDate, 
                    unitNumber: unit.unitNumber,
                    unitId: unit.id,
                    buildingId: unit.buildingId,
                    buildingName: building?.name || ''
                };
            })
            .filter((t): t is Tenant & { leaseEndDate: string, unitNumber: string, unitId: string, buildingId: string, buildingName: string } => !!t?.id);

    }, [appData]);

    type LeaseEndingSoonTenant = Tenant & { leaseEndDate: string, unitNumber: string, unitId: string, buildingId: string, buildingName: string };

    const { items, requestSort, sortConfig, searchQuery, setSearchQuery } = useTable<LeaseEndingSoonTenant>(leasesEndingSoon, ['name', 'buildingName', 'unitNumber']);

    return (
        <div className="container mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">Leases Ending Soon</h1>
                <p className="text-text-secondary mt-1">Tenants whose leases expire in the next 30 days.</p>
            </header>
            <Card className="!p-0">
                <div className="p-4 border-b">
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tenants..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <SortableHeader<LeaseEndingSoonTenant> columnKey="name" sortConfig={sortConfig} requestSort={requestSort}>Tenant</SortableHeader>
                                <SortableHeader<LeaseEndingSoonTenant> columnKey="buildingName" sortConfig={sortConfig} requestSort={requestSort}>Building</SortableHeader>
                                <SortableHeader<LeaseEndingSoonTenant> columnKey="unitNumber" sortConfig={sortConfig} requestSort={requestSort}>Unit</SortableHeader>
                                <SortableHeader<LeaseEndingSoonTenant> columnKey="leaseEndDate" sortConfig={sortConfig} requestSort={requestSort}>Lease End Date</SortableHeader>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((tenant) => (
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
                                    <td className="px-5 py-3 whitespace-nowrap text-sm">
                                        <button onClick={() => onSelectBuilding(tenant.buildingId)} className="text-blue-600 hover:underline">{tenant.buildingName}</button>
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap text-sm">
                                        <button onClick={() => onSelectUnit(tenant.unitId)} className="text-blue-600 hover:underline">{tenant.unitNumber}</button>
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">{tenant.leaseEndDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
