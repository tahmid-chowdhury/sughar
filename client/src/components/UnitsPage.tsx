import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { UnitDetail, BuildingCategory, UnitStatus, RentStatus, DashboardStats } from '../types';
import { SlidersHorizontal, Plus } from './icons';
import { dashboardAPI, leaseAgreementsAPI, paymentsAPI, serviceRequestsAPI } from '../services/api';

interface UnitsPageProps {
    setViewingTenantId: (id: string) => void;
    onAddNewUnit: () => void;
}

const CategoryPill = ({ category }: { category: BuildingCategory }) => {
    const styles = {
        [BuildingCategory.Luxury]: 'bg-yellow-100 text-yellow-800',
        [BuildingCategory.Standard]: 'bg-gray-200 text-gray-800',
        [BuildingCategory.MidRange]: 'bg-purple-100 text-purple-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[category]}`}>{category}</span>;
};

const StatusPill = ({ status, tooltip }: { status: UnitStatus | RentStatus | null; tooltip?: string }) => {
    if (!status) return <span className="text-gray-400">---</span>;
    
    const styles = {
        [UnitStatus.Rented]: 'bg-green-100 text-green-800',
        [UnitStatus.Vacant]: 'bg-red-100 text-red-800',
        [RentStatus.Paid]: 'bg-green-100 text-green-800',
        [RentStatus.Overdue]: 'bg-red-100 text-red-800',
        [RentStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span 
            className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}
            title={tooltip}
        >
            {status}
        </span>
    );
};

const TenantCell: React.FC<{ tenant: UnitDetail['tenant'], setViewingTenantId: (id: string) => void }> = ({ tenant, setViewingTenantId }) => {
    if (!tenant) return <span className="text-gray-400">---</span>;
    return (
        <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary">
            <img className="h-8 w-8 rounded-full object-cover" src={tenant.avatar} alt={tenant.name} />
            <span className="ml-3 font-medium text-gray-900">{tenant.name}</span>
        </button>
    );
};

// FIX: Changed component definition to a more standard form to resolve type error.
const SortableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
        {children}
    </th>
);

export const UnitsPage: React.FC<UnitsPageProps> = ({ setViewingTenantId, onAddNewUnit }) => {
    const [units, setUnits] = useState<UnitDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUnits = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get comprehensive data from multiple APIs
            const [dashboardStats, leaseAgreements, serviceRequests, payments] = await Promise.all([
                dashboardAPI.getStats(),
                leaseAgreementsAPI.getAll().catch(() => []),
                serviceRequestsAPI.getAll().catch(() => []),
                paymentsAPI.getAll().catch(() => [])
            ]);

            console.log('Dashboard stats for units:', dashboardStats);
            console.log('Lease agreements:', leaseAgreements);
            console.log('Service requests:', serviceRequests);
            console.log('Payments:', payments);

            // Validate dashboard stats structure
            if (!dashboardStats?.units?.details) {
                setUnits([]);
                return;
            }

            // Transform API data to UnitDetail format
            const transformedUnits: UnitDetail[] = dashboardStats.units.details.map((unit: any) => {
                // Find lease agreement for this unit
                const activeLeases = Array.isArray(leaseAgreements) 
                    ? leaseAgreements.filter((lease: any) => {
                        const leaseUnitId = lease.unitID?._id || lease.unitID;
                        const unitId = unit._id || unit.id;
                        return leaseUnitId === unitId;
                    }) 
                    : [];

                // Get the most recent active lease
                const currentDate = new Date();
                const activeLease = activeLeases.find((lease: any) => {
                    const startDate = new Date(lease.startDate);
                    const endDate = new Date(lease.endDate);
                    return startDate <= currentDate && endDate >= currentDate;
                }) || activeLeases[activeLeases.length - 1]; // Fallback to most recent

                // Count service requests for this unit
                const unitServiceRequests = Array.isArray(serviceRequests) 
                    ? serviceRequests.filter((sr: any) => {
                        const srUnitId = sr.unitID?._id || sr.unitID;
                        const unitId = unit._id || unit.id;
                        return srUnitId === unitId;
                    }).length
                    : 0;

                // Determine rent status based on lease and actual payments
                let rentStatus: RentStatus | null = null;
                if (unit.status === 'occupied' && activeLease) {
                    // Get payments for this lease
                    const leasePayments = Array.isArray(payments) 
                        ? payments.filter((payment: any) => {
                            const paymentLeaseId = payment.leaseID?._id || payment.leaseID;
                            const currentLeaseId = activeLease._id || activeLease.id;
                            return paymentLeaseId === currentLeaseId;
                        })
                        : [];

                    // Check payment status for current month
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    
                    const currentMonthPayments = leasePayments.filter((payment: any) => {
                        const paymentDate = new Date(payment.paymentDate || payment.createdAt);
                        return paymentDate.getMonth() === currentMonth && 
                               paymentDate.getFullYear() === currentYear;
                    });

                    if (currentMonthPayments.length === 0) {
                        // Check if payment is overdue (more than 5 days past due)
                        const today = new Date();
                        const fifthOfMonth = new Date(currentYear, currentMonth, 5);
                        rentStatus = today > fifthOfMonth ? RentStatus.Overdue : RentStatus.Pending;
                    } else {
                        // Check if any payment is completed
                        const hasCompletedPayment = currentMonthPayments.some((payment: any) => 
                            payment.status === 'completed'
                        );
                        const hasPendingPayment = currentMonthPayments.some((payment: any) => 
                            payment.status === 'pending'
                        );

                        if (hasCompletedPayment) {
                            rentStatus = RentStatus.Paid;
                        } else if (hasPendingPayment) {
                            rentStatus = RentStatus.Pending;
                        } else {
                            rentStatus = RentStatus.Overdue;
                        }
                    }
                }

                // Determine building category based on rent amount
                const rentAmount = parseFloat(unit.monthlyRent?.toString() || '0') || 0;
                let category = BuildingCategory.Standard;
                if (rentAmount > 3000) {
                    category = BuildingCategory.Luxury;
                } else if (rentAmount > 1500) {
                    category = BuildingCategory.MidRange;
                }

                // Format lease dates with better error handling
                const leaseStartDate = activeLease?.startDate 
                    ? (() => {
                        try {
                            return new Date(activeLease.startDate).toLocaleDateString();
                        } catch {
                            return activeLease.startDate;
                        }
                    })()
                    : null;
                    
                const leaseEndDate = activeLease?.endDate 
                    ? (() => {
                        try {
                            return new Date(activeLease.endDate).toLocaleDateString();
                        } catch {
                            return activeLease.endDate;
                        }
                    })()
                    : null;

                // Get tenant information from lease
                const tenant = (unit.status === 'occupied' && activeLease?.userID) ? {
                    id: activeLease.userID._id || activeLease.userID,
                    name: activeLease.userID.firstName && activeLease.userID.lastName 
                        ? `${activeLease.userID.firstName} ${activeLease.userID.lastName}`
                        : activeLease.userID.email || 'Current Tenant',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeLease.userID.email || activeLease.userID._id}`
                } : null;

                return {
                    id: unit._id || unit.id || `unit-${Math.random()}`,
                    unitNumber: unit.unitNumber || 'N/A',
                    buildingId: unit.property || 'Unknown Building',
                    category,
                    bedrooms: unit.bedrooms || 1,
                    bathrooms: unit.bathrooms || 1,
                    sqft: unit.squareFootage || 800, // Default reasonable size
                    rent: rentAmount,
                    monthlyRent: rentAmount,
                    status: unit.status === 'occupied' ? UnitStatus.Rented : UnitStatus.Vacant,
                    rentStatus,
                    tenant,
                    leaseStartDate,
                    leaseEndDate,
                    requests: unitServiceRequests
                };
            });

            setUnits(transformedUnits);
        } catch (err) {
            console.error('Error fetching units:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to load units data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    if (loading) {
        return (
            <Card className="!p-0">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-text-main">Loading Units...</p>
                    <p className="text-sm text-text-secondary mt-2">Fetching unit data, leases, and service requests</p>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="!p-0">
                <div className="p-8 text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-text-main mb-4">Failed to Load Units</h3>
                    <p className="text-text-secondary mb-6">{error}</p>
                    <button 
                        onClick={fetchUnits}
                        className="px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="!p-0">
            <div className="flex items-center justify-between p-4">
                <div>
                    <h2 className="text-xl font-bold text-text-main">Units Management</h2>
                    <p className="text-sm text-text-secondary">
                        {units.length} unit{units.length !== 1 ? 's' : ''} • {units.filter(u => u.status === UnitStatus.Rented).length} occupied • {units.filter(u => u.status === UnitStatus.Vacant).length} vacant
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchUnits}
                        disabled={loading}
                        className="flex items-center text-sm font-medium text-text-secondary bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                    <button 
                        onClick={onAddNewUnit}
                        className="flex items-center text-sm font-medium text-white bg-accent-secondary rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Unit
                    </button>
                    <button className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>
            
            {/* Summary Statistics */}
            {units.length > 0 && (
                <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 px-4 py-3 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {units.filter(u => u.status === UnitStatus.Rented).length}
                            </div>
                            <div className="text-sm text-blue-600">Occupied Units</div>
                        </div>
                        <div className="bg-red-50 px-4 py-3 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                                {units.filter(u => u.status === UnitStatus.Vacant).length}
                            </div>
                            <div className="text-sm text-red-600">Vacant Units</div>
                        </div>
                        <div className="bg-green-50 px-4 py-3 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                ${units.reduce((sum, u) => sum + u.rent, 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-green-600">Total Potential Revenue</div>
                        </div>
                        <div className="bg-orange-50 px-4 py-3 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {units.reduce((sum, u) => sum + u.requests, 0)}
                            </div>
                            <div className="text-sm text-orange-600">Service Requests</div>
                        </div>
                    </div>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader>Unit</SortableHeader>
                            <SortableHeader>Building</SortableHeader>
                            <SortableHeader>Category</SortableHeader>
                            <SortableHeader>Monthly Rent</SortableHeader>
                            <SortableHeader>Status</SortableHeader>
                            <SortableHeader>Tenant</SortableHeader>
                            <SortableHeader>Rent Status</SortableHeader>
                            <SortableHeader>Lease Start Date</SortableHeader>
                            <SortableHeader>Lease End Date</SortableHeader>
                            <SortableHeader>Requests</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {units.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-5 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5v10a2 2 0 002 2h4a2 2 0 002-2V5" />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-text-main mb-2">No Units Found</h3>
                                        <p className="text-text-secondary mb-4">Start by adding your first unit to a building.</p>
                                        <button 
                                            onClick={onAddNewUnit}
                                            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                                        >
                                            Add Your First Unit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            units.map((unit: UnitDetail, index) => (
                                <tr key={`${unit.id}-${index}`} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{unit.unitNumber}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.buildingId}</td>
                                    <td className="px-5 py-4 whitespace-nowrap"><CategoryPill category={unit.category} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${unit.rent.toLocaleString()}/mo</td>
                                    <td className="px-5 py-4 whitespace-nowrap"><StatusPill status={unit.status} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap"><TenantCell tenant={unit.tenant} setViewingTenantId={setViewingTenantId} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <StatusPill 
                                            status={unit.rentStatus} 
                                            tooltip={unit.rentStatus ? `Rent payment status for current month` : undefined}
                                        />
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {unit.leaseStartDate || '---'}
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {unit.leaseEndDate ? (
                                            <span 
                                                className={`${
                                                    (() => {
                                                        const endDate = new Date(unit.leaseEndDate);
                                                        const today = new Date();
                                                        const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                                        
                                                        if (daysUntilExpiry < 0) return 'text-red-600 font-medium'; // Expired
                                                        if (daysUntilExpiry <= 30) return 'text-orange-600 font-medium'; // Expiring soon
                                                        if (daysUntilExpiry <= 90) return 'text-yellow-600'; // Expiring in 3 months
                                                        return 'text-gray-500'; // Normal
                                                    })()
                                                }`}
                                                title={`Lease ${(() => {
                                                    const endDate = new Date(unit.leaseEndDate);
                                                    const today = new Date();
                                                    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                                    
                                                    if (daysUntilExpiry < 0) return `expired ${Math.abs(daysUntilExpiry)} days ago`;
                                                    if (daysUntilExpiry <= 30) return `expires in ${daysUntilExpiry} days`;
                                                    if (daysUntilExpiry <= 90) return `expires in ${daysUntilExpiry} days`;
                                                    return `expires in ${daysUntilExpiry} days`;
                                                })()} `}
                                            >
                                                {unit.leaseEndDate}
                                            </span>
                                        ) : '---'}
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500" title={`${unit.requests} active service request${unit.requests !== 1 ? 's' : ''}`}>
                                        {unit.requests}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
