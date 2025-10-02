
import React from 'react';
import { Card } from './Card';
import { APPLICATIONS_PAGE_DATA } from '../constants';
// FIX: Import Application type to resolve error.
import { Application } from '../types';
import { User } from './icons';

interface SpecificBuildingApplicationsPageProps {
    buildingId: string;
    setViewingTenantId: (id: string) => void;
}

const MatchPercentagePill = ({ percentage }: { percentage: number }) => {
    let colorClasses = '';
    if (percentage >= 80) {
        colorClasses = 'bg-green-100 text-green-800';
    } else if (percentage >= 30) {
        colorClasses = 'bg-yellow-100 text-yellow-800';
    } else {
        colorClasses = 'bg-red-100 text-red-800';
    }
    
    // Special case for 0%
    if (percentage === 0) {
        colorClasses = 'bg-red-100 text-red-800';
    }
    // Special case for 100%
    if (percentage === 100) {
        colorClasses = 'bg-green-100 text-green-800';
    }

    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClasses}`}>
            {percentage}%
        </span>
    );
};

const TenantCell: React.FC<{ tenant: Application['tenant'], setViewingTenantId: (id: string) => void }> = ({ tenant, setViewingTenantId }) => (
    <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary">
        <img className="h-8 w-8 rounded-full object-cover" src={tenant.avatar} alt={tenant.name} />
        <div className="ml-3">
            <p className="font-medium text-gray-900">{tenant.name}</p>
        </div>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{tenant.rating}</span>
    </button>
);


const ApplicationTable: React.FC<{ title: string; applications: Application[], setViewingTenantId: (id: string) => void }> = ({ title, applications, setViewingTenantId }) => (
    <Card className="flex-1">
        <div className="flex items-center mb-4">
            <div className="p-2 bg-pink-100 rounded-lg mr-3">
                <User className="w-5 h-5 text-brand-pink" />
            </div>
            <h3 className="font-atkinson text-xl font-bold text-text-main">{title}</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match Percentage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submission Date</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap"><TenantCell tenant={app.tenant} setViewingTenantId={setViewingTenantId} /></td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.unit}</td>
                            <td className="px-4 py-4 whitespace-nowrap"><MatchPercentagePill percentage={app.matchPercentage} /></td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.submissionDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

export const SpecificBuildingApplicationsPage: React.FC<SpecificBuildingApplicationsPageProps> = ({ buildingId, setViewingTenantId }) => {
    const buildingApplications = APPLICATIONS_PAGE_DATA.filter(app => app.buildingId === buildingId);
    
    // The design has two identical tables, so we'll just split the data for demonstration
    const half = Math.ceil(buildingApplications.length / 2);
    const topRated = buildingApplications.slice(0, half);
    const newVerified = buildingApplications.slice(half);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ApplicationTable title="Top-Rated Tenants" applications={topRated} setViewingTenantId={setViewingTenantId} />
            <ApplicationTable title="New SuGhar Verified Tenants" applications={newVerified} setViewingTenantId={setViewingTenantId} />
        </div>
    );
};