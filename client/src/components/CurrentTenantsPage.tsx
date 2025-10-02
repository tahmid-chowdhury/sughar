

import React from 'react';
import { Card } from './Card';
import { CURRENT_TENANTS_DATA } from '../constants';
import { CurrentTenant, RentStatus, Tenant } from '../types';
import { SlidersHorizontal, Search } from './icons';
import { useTable } from '../hooks/useTable';
import { SortableHeader } from './SortableHeader';

interface CurrentTenantsPageProps {
  setViewingTenantId: (id: string) => void;
}

const TenantCell: React.FC<{ tenant: Tenant, setViewingTenantId: (id: string) => void }> = ({ tenant, setViewingTenantId }) => (
    <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary">
        <img className="h-8 w-8 rounded-full" src={tenant.avatar} alt={tenant.name} />
        <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
        </div>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{tenant.rating}</span>
    </button>
);

// FIX: Corrected the type for the `progress` prop to be an object with `value` and `variant` properties.
const LeaseProgressCell: React.FC<{ progress: { value: number; variant: string; } }> = ({ progress }) => {
    const bgColor = progress.variant === 'dark' ? 'bg-purple-400' : 'bg-purple-300';
    return (
        <div className="w-28 bg-gray-200 rounded-full h-4">
            <div className={`${bgColor} h-4 rounded-full`} style={{ width: `${progress.value}%` }}></div>
        </div>
    );
};

const RentStatusPill: React.FC<{ status: RentStatus }> = ({ status }) => {
    const styles = {
        [RentStatus.Paid]: 'bg-status-success text-status-success-text',
        [RentStatus.Overdue]: 'bg-status-error text-status-error-text',
        [RentStatus.Pending]: 'bg-status-warning text-status-warning-text',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

export const CurrentTenantsPage: React.FC<CurrentTenantsPageProps> = ({ setViewingTenantId }) => {
    // FIX: Provide explicit generic type to useTable to fix type inference issues.
    const { items, requestSort, sortConfig, searchQuery, setSearchQuery } = useTable<CurrentTenant>(CURRENT_TENANTS_DATA, ['name', 'building', 'unit']);

    return (
        <Card className="!p-0">
             <div className="flex justify-between items-center p-4 gap-4">
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
                <button className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Advanced filtering
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader<CurrentTenant> columnKey="name" sortConfig={sortConfig} requestSort={requestSort} className="w-1/4">Tenant</SortableHeader>
                            <SortableHeader<CurrentTenant> columnKey="building" sortConfig={sortConfig} requestSort={requestSort}>Building</SortableHeader>
                            <SortableHeader<CurrentTenant> columnKey="unit" sortConfig={sortConfig} requestSort={requestSort}>Unit</SortableHeader>
                            <SortableHeader<CurrentTenant> columnKey="leaseProgress" sortConfig={sortConfig} requestSort={requestSort}>Lease Progress</SortableHeader>
                            <SortableHeader<CurrentTenant> columnKey="rentStatus" sortConfig={sortConfig} requestSort={requestSort}>Rent Status</SortableHeader>
                            <SortableHeader<CurrentTenant> columnKey="requests" sortConfig={sortConfig} requestSort={requestSort}>Requests</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((tenant) => (
                            <tr key={tenant.id} className="hover:bg-gray-50">
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <TenantCell tenant={tenant} setViewingTenantId={setViewingTenantId} />
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.building}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.unit}</td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <LeaseProgressCell progress={{value: tenant.leaseProgress, variant: 'light'}} />
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <RentStatusPill status={tenant.rentStatus} />
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tenant.requests}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};