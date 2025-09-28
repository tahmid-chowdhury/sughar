import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Application, DashboardStats } from '../types';
import { FileText, User, Calendar, Plus, Search, CheckCircle2, X, Filter } from './icons';
import { dashboardAPI, rentalApplicationsAPI } from '../services/api';

interface ApplicationsPageProps {
  setViewingTenantId: (id: string) => void;
}

const StatusPill = ({ status }: { status: string }) => {
    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800', icon: Calendar, label: 'Pending Review' },
        approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Approved' },
        rejected: { color: 'bg-red-100 text-red-800', icon: X, label: 'Rejected' },
        withdrawn: { color: 'bg-gray-100 text-gray-800', icon: User, label: 'Withdrawn' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
        </span>
    );
};

const MatchPercentagePill = ({ percentage, criteria }: { percentage: number; criteria?: string }) => {
    let colorClasses = '';
    if (percentage >= 80) {
        colorClasses = 'bg-green-100 text-green-800';
    } else if (percentage >= 60) {
        colorClasses = 'bg-yellow-100 text-yellow-800';
    } else {
        colorClasses = 'bg-red-100 text-red-800';
    }
    return (
        <span 
            className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClasses}`}
            title={criteria ? `Based on: ${criteria}` : 'Match percentage based on income, employment, and references'}
        >
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


const ApplicationTable: React.FC<{ 
    title: string; 
    applications: (Application & { status?: string; monthlyIncome?: number; employmentStatus?: string })[], 
    setViewingTenantId: (id: string) => void;
    count: number;
}> = ({ title, applications, setViewingTenantId, count }) => (
    <Card className="flex-1">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <div className="p-2 bg-pink-100 rounded-lg mr-3">
                    <User className="w-5 h-5 text-brand-pink" />
                </div>
                <div>
                    <h3 className="font-atkinson text-xl font-bold text-text-main">{title}</h3>
                    <p className="text-sm text-text-secondary">{count} application{count !== 1 ? 's' : ''}</p>
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
            {applications.length === 0 ? (
                <div className="text-center py-8">
                    <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No {title.toLowerCase()} at the moment</p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Building</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match %</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Income</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap"><TenantCell tenant={app.tenant} setViewingTenantId={setViewingTenantId}/></td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{app.unit}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.buildingId}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{app.status && <StatusPill status={app.status} />}</td>
                                <td className="px-4 py-4 whitespace-nowrap"><MatchPercentagePill percentage={app.matchPercentage} /></td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {app.monthlyIncome ? `$${app.monthlyIncome.toLocaleString()}` : 'Not provided'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.submissionDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </Card>
);


export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ setViewingTenantId }) => {
    const [applications, setApplications] = useState<(Application & { status?: string; monthlyIncome?: number; employmentStatus?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const calculateMatchPercentage = (app: any, unitRent: number) => {
        let score = 50; // Base score
        let criteria: string[] = [];
        
        // Income criteria (40% weight)
        if (app.monthlyIncome) {
            const incomeRatio = app.monthlyIncome / unitRent;
            if (incomeRatio >= 3) {
                score += 30;
                criteria.push('Strong income (3x+ rent)');
            } else if (incomeRatio >= 2.5) {
                score += 20;
                criteria.push('Good income (2.5x+ rent)');
            } else if (incomeRatio >= 2) {
                score += 10;
                criteria.push('Adequate income (2x+ rent)');
            } else {
                criteria.push('Income below 2x rent');
            }
        }
        
        // Employment status (30% weight)
        if (app.employmentStatus) {
            const employment = app.employmentStatus.toLowerCase();
            if (employment.includes('full-time') || employment.includes('employed')) {
                score += 20;
                criteria.push('Stable employment');
            } else if (employment.includes('part-time')) {
                score += 10;
                criteria.push('Part-time employment');
            } else if (employment.includes('self-employed')) {
                score += 15;
                criteria.push('Self-employed');
            }
        }
        
        // References (30% weight)
        if (app.references && app.references.length > 0) {
            score += Math.min(app.references.length * 5, 20);
            criteria.push(`${app.references.length} reference${app.references.length > 1 ? 's' : ''}`);
        }
        
        return { score: Math.min(Math.max(score, 0), 100), criteria: criteria.join(', ') };
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get comprehensive data from both APIs
            const [dashboardStats, applicationsData] = await Promise.all([
                dashboardAPI.getStats(),
                rentalApplicationsAPI.getAll()
            ]);
            
            console.log('Dashboard stats for applications:', dashboardStats);
            console.log('Applications data:', applicationsData);
            
            if (!Array.isArray(applicationsData)) {
                setApplications([]);
                return;
            }
            
            // Transform API data to Application format with real calculations
            const transformedApps = applicationsData.map((app: any) => {
                // Find unit rent for match percentage calculation
                const unitDetails = dashboardStats?.units?.details?.find((unit: any) => {
                    const unitId = unit._id || unit.id;
                    const appUnitId = app.unitID?._id || app.unitID;
                    return unitId === appUnitId;
                });
                
                const unitRent = unitDetails ? parseFloat(unitDetails.monthlyRent?.toString() || '0') : 1500; // Default rent for calculation
                const matchData = calculateMatchPercentage(app, unitRent);
                
                // Calculate a rating based on application quality
                const rating = matchData.score >= 85 ? 5 : 
                              matchData.score >= 75 ? 4.5 : 
                              matchData.score >= 65 ? 4 : 
                              matchData.score >= 55 ? 3.5 : 3;
                
                return {
                    id: app._id || `app-${Math.random()}`,
                    tenant: {
                        id: app.userID?._id || app.userID || `tenant-${app._id}`,
                        name: app.userID?.firstName && app.userID?.lastName 
                            ? `${app.userID.firstName} ${app.userID.lastName}`
                            : app.userID?.email || 'Unknown Applicant',
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.userID?.email || app._id}`,
                        rating: rating
                    },
                    unit: app.unitID?.unitNumber || unitDetails?.unitNumber || 'N/A',
                    buildingId: app.unitID?.propertyID?.address?.split(',')[0] || 
                               unitDetails?.property?.split(',')[0] || 
                               'Unknown Building',
                    matchPercentage: Math.round(matchData.score),
                    submissionDate: new Date(app.submissionDate || app.createdAt).toLocaleDateString(),
                    status: app.status || 'pending',
                    monthlyIncome: app.monthlyIncome,
                    employmentStatus: app.employmentStatus,
                    matchCriteria: matchData.criteria
                };
            });
            
            setApplications(transformedApps);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Error fetching applications:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to load applications data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main">Rental Applications</h2>
                        <div className="animate-pulse bg-gray-200 h-4 w-48 rounded mt-2"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                        <Card key={i} className="flex-1">
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
                                <p className="text-lg font-medium text-text-main">Loading Applications...</p>
                                <p className="text-sm text-text-secondary mt-2">Fetching application data and calculating matches</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text-main">Rental Applications</h2>
                </div>
                <Card className="flex-1">
                    <div className="p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-text-main mb-4">Failed to Load Applications</h3>
                        <p className="text-text-secondary mb-6">{error}</p>
                        <button 
                            onClick={fetchApplications}
                            className="px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    // Organize applications by status and quality
    const pendingApplications = applications.filter(a => a.status === 'pending');
    const approvedApplications = applications.filter(a => a.status === 'approved');
    const rejectedApplications = applications.filter(a => a.status === 'rejected');
    const highQualityPending = pendingApplications.filter(a => a.matchPercentage >= 75);
    const regularPending = pendingApplications.filter(a => a.matchPercentage < 75);

    return (
        <div className="space-y-6">
            {/* Header with summary stats */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-main">Rental Applications</h2>
                    <p className="text-text-secondary">
                        {applications.length} total application{applications.length !== 1 ? 's' : ''} 
                        • {pendingApplications.length} pending
                        • {approvedApplications.length} approved
                        • {rejectedApplications.length} rejected
                        {lastUpdated && (
                            <span className="ml-2 text-xs">
                                • Updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                </div>
                <button 
                    onClick={fetchApplications}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors disabled:opacity-50"
                >
                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {/* Summary Statistics Cards */}
            {applications.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-yellow-50 px-4 py-3 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</div>
                        <div className="text-sm text-yellow-600">Pending Review</div>
                    </div>
                    <div className="bg-green-50 px-4 py-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{approvedApplications.length}</div>
                        <div className="text-sm text-green-600">Approved</div>
                    </div>
                    <div className="bg-purple-50 px-4 py-3 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{highQualityPending.length}</div>
                        <div className="text-sm text-purple-600">High-Quality Pending</div>
                    </div>
                    <div className="bg-blue-50 px-4 py-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {applications.length > 0 ? Math.round(applications.reduce((sum, app) => sum + app.matchPercentage, 0) / applications.length) : 0}%
                        </div>
                        <div className="text-sm text-blue-600">Avg Match Score</div>
                    </div>
                </div>
            )}

            {/* Application Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ApplicationTable 
                    title="High-Quality Applications" 
                    applications={highQualityPending} 
                    setViewingTenantId={setViewingTenantId}
                    count={highQualityPending.length}
                />
                <ApplicationTable 
                    title="Recent Applications" 
                    applications={regularPending} 
                    setViewingTenantId={setViewingTenantId}
                    count={regularPending.length}
                />
            </div>

            {/* Status-based tables if there are processed applications */}
            {(approvedApplications.length > 0 || rejectedApplications.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {approvedApplications.length > 0 && (
                        <ApplicationTable 
                            title="Approved Applications" 
                            applications={approvedApplications} 
                            setViewingTenantId={setViewingTenantId}
                            count={approvedApplications.length}
                        />
                    )}
                    {rejectedApplications.length > 0 && (
                        <ApplicationTable 
                            title="Rejected Applications" 
                            applications={rejectedApplications} 
                            setViewingTenantId={setViewingTenantId}
                            count={rejectedApplications.length}
                        />
                    )}
                </div>
            )}

            {/* Empty state */}
            {applications.length === 0 && !loading && (
                <Card className="text-center py-12">
                    <User className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                    <h3 className="text-xl font-semibold text-text-main mb-4">No Applications Yet</h3>
                    <p className="text-text-secondary mb-6 max-w-md mx-auto">
                        When tenants submit rental applications, they'll appear here for your review and approval.
                    </p>
                    <button 
                        onClick={fetchApplications}
                        className="px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                    >
                        Refresh Applications
                    </button>
                </Card>
            )}
        </div>
    );
};