import React from 'react';
import { Card } from './Card';
import { TOP_RATED_TENANTS_APPLICATIONS, NEW_SUGHAR_VERIFIED_TENANTS_APPLICATIONS } from '../constants';
import { TenantApplication, VerifiedTenantApplication } from '../types';
import { HomeIcon, ArrowDown } from './icons';

interface TenantApplicationsPageProps {
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

const TenantCell: React.FC<{ tenant: TenantApplication['tenant'], setViewingTenantId: (id: string) => void }> = ({ tenant, setViewingTenantId }) => (
    <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary">
        <img className="h-8 w-8 rounded-full" src={tenant.avatar} alt={tenant.name} />
        <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
        </div>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{tenant.rating}</span>
    </button>
);

const MatchPercentagePill: React.FC<{ percentage: number }> = ({ percentage }) => {
    let colorClasses = '';
    if (percentage >= 50) {
        colorClasses = 'bg-green-100 text-green-800';
    } else {
        colorClasses = 'bg-red-100 text-red-800';
    }
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClasses}`}>
            {percentage}%
        </span>
    );
};

const ApplicationTable: React.FC<{
  title: string;
  data: TenantApplication[] | VerifiedTenantApplication[];
  showBuilding?: boolean;
  setViewingTenantId: (id: string) => void;
}> = ({ title, data, showBuilding = true, setViewingTenantId }) => (
    <Card className="!p-0">
        <div className="p-4 flex items-center border-b border-gray-200">
            <div className="p-2 bg-pink-100 rounded-lg mr-3">
                <HomeIcon className="w-5 h-5 text-brand-pink" />
            </div>
            <h3 className="font-atkinson text-lg font-bold text-text-main">{title}</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <SortableHeader>Tenant</SortableHeader>
                        {showBuilding && <SortableHeader>Building</SortableHeader>}
                        <SortableHeader>Unit</SortableHeader>
                        <SortableHeader>Match Percentage</SortableHeader>
                        <SortableHeader>Submission Date</SortableHeader>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-5 py-4 whitespace-nowrap"><TenantCell tenant={app.tenant} setViewingTenantId={setViewingTenantId} /></td>
                            {showBuilding && <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{(app as TenantApplication).building}</td>}
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{app.unit}</td>
                            <td className="px-5 py-4 whitespace-nowrap"><MatchPercentagePill percentage={app.matchPercentage} /></td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{app.submissionDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

export const TenantApplicationsPage: React.FC<TenantApplicationsPageProps> = ({ setViewingTenantId }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ApplicationTable title="Top-Rated Tenants" data={TOP_RATED_TENANTS_APPLICATIONS} showBuilding={true} setViewingTenantId={setViewingTenantId} />
            <ApplicationTable title="New SuGhar Verified Tenants" data={NEW_SUGHAR_VERIFIED_TENANTS_APPLICATIONS} showBuilding={false} setViewingTenantId={setViewingTenantId} />
        </div>
    );
};