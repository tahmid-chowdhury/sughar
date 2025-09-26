import React from 'react';
import { Card } from './Card';
import { CURRENT_TENANTS_DATA } from '../constants';
import { CurrentTenant, RentStatus } from '../types';
import { SlidersHorizontal, ArrowDown } from './icons';

interface CurrentTenantsPageProps {
  setViewingTenantId: (id: string) => void;
}

const SortableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <th scope="col" className={`px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${className}`}>
       <div className="flex items-center">
            <span>{children}</span>
            <ArrowDown className="w-3 h-3 ml-1 text-gray-400" />
       </div>
    </th>
);

const TenantCell: React.FC<{ tenant: CurrentTenant, setViewingTenantId: (id: string) => void }> = ({ tenant, setViewingTenantId }) => (
    <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary">
        <img className="h-8 w-8 rounded-full" src={tenant.avatar} alt={tenant.name} />
        <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
        </div>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{tenant.rating}</span>
    </button>
);

const LeaseProgressCell: React.FC<{ progress: CurrentTenant['leaseProgress'] }> = ({ progress }) => {
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
    return (
        <Card className="!p-0">
            <div className="flex justify-end p-4">
                <button className="flex items-center text-sm font-medium text-gray-400 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-100">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Advanced filtering
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader className="w-1/4">Tenant</SortableHeader>
                            <SortableHeader>Building</SortableHeader>
                            <SortableHeader>Unit</SortableHeader>
                            <SortableHeader>Lease Progress</SortableHeader>
                            <SortableHeader>Rent Status</SortableHeader>
                            <SortableHeader>Requests</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {CURRENT_TENANTS_DATA.map((tenant) => (
                            <tr key={tenant.id} className="hover:bg-gray-50">
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <TenantCell tenant={tenant} setViewingTenantId={setViewingTenantId} />
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.building}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.unit}</td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <LeaseProgressCell progress={tenant.leaseProgress} />
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