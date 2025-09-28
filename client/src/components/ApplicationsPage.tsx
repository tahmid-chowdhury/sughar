import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Application } from '../types';
import { User } from './icons';
import { rentalApplicationsAPI } from '../services/api';

interface ApplicationsPageProps {
  setViewingTenantId: (id: string) => void;
}

const MatchPercentagePill = ({ percentage }: { percentage: number }) => {
    let colorClasses = '';
    if (percentage >= 80) {
        colorClasses = 'bg-green-100 text-green-800';
    } else if (percentage >= 60) {
        colorClasses = 'bg-yellow-100 text-yellow-800';
    } else {
        colorClasses = 'bg-red-100 text-red-800';
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Application #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Building</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match Percentage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submission Date</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer">{app.id}</td>
                            <td className="px-4 py-4 whitespace-nowrap"><TenantCell tenant={app.tenant} setViewingTenantId={setViewingTenantId}/></td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.unit}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.buildingId}</td>
                            <td className="px-4 py-4 whitespace-nowrap"><MatchPercentagePill percentage={app.matchPercentage} /></td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.submissionDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);


export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ setViewingTenantId }) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const data = await rentalApplicationsAPI.getAll();
                
                // Transform API data to Application format
                const transformedApps = data.map((app: any) => ({
                    id: app._id,
                    tenant: {
                        id: app.applicantID?._id || app.applicantID,
                        name: app.applicantID?.firstName + ' ' + app.applicantID?.lastName || 'Unknown Applicant',
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.applicantID?.email || app._id}`,
                        rating: Math.random() > 0.5 ? parseFloat((4 + Math.random()).toFixed(1)) : parseFloat((3 + Math.random() * 2).toFixed(1))
                    },
                    unit: app.unitID?.unitNumber || 'N/A',
                    buildingId: app.unitID?.propertyID?.address?.split(',')[0] || 'Unknown Building',
                    matchPercentage: Math.floor(Math.random() * 40) + 60, // Random between 60-100
                    submissionDate: new Date(app.dateSubmitted || app.createdAt).toLocaleDateString()
                }));
                
                setApplications(transformedApps);
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError('Failed to load applications');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                    <Card key={i} className="flex-1">
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading applications...</p>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="flex-1">
                    <div className="p-8 text-center">
                        <p className="text-red-600">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary/90"
                        >
                            Retry
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    // Split data for two tables based on rating
    const topRated = applications.filter(a => a.tenant.rating > 4.5);
    const newVerified = applications.filter(a => a.tenant.rating <= 4.5);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ApplicationTable title="Top-Rated Tenants" applications={topRated} setViewingTenantId={setViewingTenantId} />
            <ApplicationTable title="New SuGhar Verified Tenants" applications={newVerified} setViewingTenantId={setViewingTenantId} />
        </div>
    );
};