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

            // Hardcoded units data based on provided information
            const hardcodedUnits: UnitDetail[] = [
                // Building 1 – Lalmatia Court
                { id: 'U001', unitNumber: '1A', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T001', name: 'Farzana Akhter', avatar: 'https://ui-avatars.com/api/?name=Farzana+Akhter&background=random' }, leaseStartDate: '7/14/2025', leaseEndDate: '1/14/2026', requests: 0 },
                { id: 'U002', unitNumber: '2A', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Vacant, rentStatus: null, tenant: null, leaseStartDate: '3/1/2025', leaseEndDate: '9/28/2025', requests: 0 },
                { id: 'U003', unitNumber: '3A', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T003', name: 'Shahriar Karim', avatar: 'https://ui-avatars.com/api/?name=Shahriar+Karim&background=random' }, leaseStartDate: '9/2/2025', leaseEndDate: '3/2/2026', requests: 0 },
                { id: 'U004', unitNumber: '4A', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Pending, tenant: { id: 'T004', name: 'Tania Akter', avatar: 'https://ui-avatars.com/api/?name=Tania+Akter&background=random' }, leaseStartDate: '9/3/2025', leaseEndDate: '3/3/2026', requests: 1 },
                { id: 'U005', unitNumber: '1B', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T005', name: 'Imran Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Imran+Chowdhury&background=random' }, leaseStartDate: '11/11/2025', leaseEndDate: '5/11/2026', requests: 0 },
                { id: 'U006', unitNumber: '2B', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Overdue, tenant: { id: 'T006', name: 'Sumi Akhter', avatar: 'https://ui-avatars.com/api/?name=Sumi+Akhter&background=random' }, leaseStartDate: '10/28/2025', leaseEndDate: '4/28/2026', requests: 1 },
                { id: 'U007', unitNumber: '3B', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T007', name: 'Hasan Mahmud', avatar: 'https://ui-avatars.com/api/?name=Hasan+Mahmud&background=random' }, leaseStartDate: '12/17/2025', leaseEndDate: '6/17/2026', requests: 0 },
                { id: 'U008', unitNumber: '4B', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T008', name: 'Shuvo Islam', avatar: 'https://ui-avatars.com/api/?name=Shuvo+Islam&background=random' }, leaseStartDate: '8/9/2025', leaseEndDate: '2/9/2026', requests: 0 },
                { id: 'U009', unitNumber: '1C', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T009', name: 'Maruf Khan', avatar: 'https://ui-avatars.com/api/?name=Maruf+Khan&background=random' }, leaseStartDate: '5/22/2025', leaseEndDate: '11/22/2025', requests: 1 },
                { id: 'U010', unitNumber: '2C', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T010', name: 'Mahin Alam', avatar: 'https://ui-avatars.com/api/?name=Mahin+Alam&background=random' }, leaseStartDate: '2/15/2025', leaseEndDate: '8/15/2026', requests: 0 },
                { id: 'U011', unitNumber: '3C', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T011', name: 'Saima Binte Noor', avatar: 'https://ui-avatars.com/api/?name=Saima+Binte+Noor&background=random' }, leaseStartDate: '1/5/2025', leaseEndDate: '7/5/2026', requests: 0 },
                { id: 'U012', unitNumber: '4C', buildingId: 'Lalmatia Court', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, rentStatus: RentStatus.Pending, tenant: { id: 'T012', name: 'Javed Rahman', avatar: 'https://ui-avatars.com/api/?name=Javed+Rahman&background=random' }, leaseStartDate: '6/19/2025', leaseEndDate: '12/19/2025', requests: 0 },
                
                // Building 2 – Banani Heights
                { id: 'U013', unitNumber: '1A', buildingId: 'Banani Heights', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T013', name: 'Sadia Hossain', avatar: 'https://ui-avatars.com/api/?name=Sadia+Hossain&background=random' }, leaseStartDate: '4/3/2025', leaseEndDate: '10/3/2026', requests: 0 },
                { id: 'U014', unitNumber: '2A', buildingId: 'Banani Heights', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T014', name: 'Kamal Uddin', avatar: 'https://ui-avatars.com/api/?name=Kamal+Uddin&background=random' }, leaseStartDate: '3/2/2025', leaseEndDate: '9/2/2026', requests: 1 },
                { id: 'U015', unitNumber: '3A', buildingId: 'Banani Heights', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T015', name: 'Mehnaz Sultana', avatar: 'https://ui-avatars.com/api/?name=Mehnaz+Sultana&background=random' }, leaseStartDate: '11/23/2025', leaseEndDate: '5/23/2026', requests: 0 },
                { id: 'U016', unitNumber: '4A', buildingId: 'Banani Heights', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, rentStatus: RentStatus.Overdue, tenant: { id: 'T016', name: 'Tanvir Ahmed', avatar: 'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=random' }, leaseStartDate: '10/11/2025', leaseEndDate: '4/11/2026', requests: 1 },
                { id: 'U017', unitNumber: '1B', buildingId: 'Banani Heights', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T017', name: 'Nasrin Akter', avatar: 'https://ui-avatars.com/api/?name=Nasrin+Akter&background=random' }, leaseStartDate: '9/29/2025', leaseEndDate: '3/29/2026', requests: 0 },
                { id: 'U018', unitNumber: '2B', buildingId: 'Banani Heights', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T018', name: 'Mithun Das', avatar: 'https://ui-avatars.com/api/?name=Mithun+Das&background=random' }, leaseStartDate: '2/20/2025', leaseEndDate: '8/20/2026', requests: 0 },
                { id: 'U019', unitNumber: '3B', buildingId: 'Banani Heights', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, rentStatus: RentStatus.Pending, tenant: { id: 'T019', name: 'Zahid Hasan', avatar: 'https://ui-avatars.com/api/?name=Zahid+Hasan&background=random' }, leaseStartDate: '12/8/2025', leaseEndDate: '6/8/2026', requests: 1 },
                { id: 'U020', unitNumber: '4B', buildingId: 'Banani Heights', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T020', name: 'Roksana Begum', avatar: 'https://ui-avatars.com/api/?name=Roksana+Begum&background=random' }, leaseStartDate: '6/30/2025', leaseEndDate: '12/30/2025', requests: 0 },
                
                // Building 3 – Dhanmondi Residency
                { id: 'U021', unitNumber: '1A', buildingId: 'Dhanmondi Residency', category: BuildingCategory.Luxury, bedrooms: 4, bathrooms: 3, sqft: 1400, rent: 45000, monthlyRent: 45000, status: UnitStatus.Vacant, rentStatus: null, tenant: null, leaseStartDate: null, leaseEndDate: null, requests: 0 },
                { id: 'U022', unitNumber: '2A', buildingId: 'Dhanmondi Residency', category: BuildingCategory.Luxury, bedrooms: 4, bathrooms: 3, sqft: 1400, rent: 45000, monthlyRent: 45000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T021', name: 'Shila Rahman', avatar: 'https://ui-avatars.com/api/?name=Shila+Rahman&background=random' }, leaseStartDate: '8/13/2025', leaseEndDate: '2/13/2026', requests: 1 },
                { id: 'U023', unitNumber: '3A', buildingId: 'Dhanmondi Residency', category: BuildingCategory.Luxury, bedrooms: 4, bathrooms: 3, sqft: 1400, rent: 45000, monthlyRent: 45000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T022', name: 'Arefin Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Arefin+Chowdhury&background=random' }, leaseStartDate: '5/9/2025', leaseEndDate: '11/9/2025', requests: 0 },
                { id: 'U024', unitNumber: '4A', buildingId: 'Dhanmondi Residency', category: BuildingCategory.Luxury, bedrooms: 4, bathrooms: 3, sqft: 1400, rent: 45000, monthlyRent: 45000, status: UnitStatus.Rented, rentStatus: RentStatus.Overdue, tenant: { id: 'T023', name: 'Rezaul Karim', avatar: 'https://ui-avatars.com/api/?name=Rezaul+Karim&background=random' }, leaseStartDate: '7/18/2025', leaseEndDate: '1/18/2026', requests: 1 },
                { id: 'U025', unitNumber: '5A', buildingId: 'Dhanmondi Residency', category: BuildingCategory.Luxury, bedrooms: 4, bathrooms: 3, sqft: 1400, rent: 45000, monthlyRent: 45000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T024', name: 'Nadia Islam', avatar: 'https://ui-avatars.com/api/?name=Nadia+Islam&background=random' }, leaseStartDate: '1/27/2025', leaseEndDate: '7/27/2026', requests: 0 },
                
                // Building 4 – Uttara Gardens
                { id: 'U026', unitNumber: '1', buildingId: 'Uttara Gardens', category: BuildingCategory.Luxury, bedrooms: 5, bathrooms: 4, sqft: 1800, rent: 60000, monthlyRent: 60000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T025', name: 'Selina Yasmin', avatar: 'https://ui-avatars.com/api/?name=Selina+Yasmin&background=random' }, leaseStartDate: '7/12/2025', leaseEndDate: '1/12/2026', requests: 1 },
                { id: 'U027', unitNumber: '2', buildingId: 'Uttara Gardens', category: BuildingCategory.Luxury, bedrooms: 5, bathrooms: 4, sqft: 1800, rent: 60000, monthlyRent: 60000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T026', name: 'Abdul Malek', avatar: 'https://ui-avatars.com/api/?name=Abdul+Malek&background=random' }, leaseStartDate: '4/30/2025', leaseEndDate: '10/30/2025', requests: 0 },
                { id: 'U028', unitNumber: '3', buildingId: 'Uttara Gardens', category: BuildingCategory.Luxury, bedrooms: 5, bathrooms: 4, sqft: 1800, rent: 60000, monthlyRent: 60000, status: UnitStatus.Rented, rentStatus: RentStatus.Paid, tenant: { id: 'T027', name: 'Rafsan Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Rafsan+Chowdhury&background=random' }, leaseStartDate: '3/19/2025', leaseEndDate: '9/19/2026', requests: 0 }
            ];

            console.log('Hardcoded units loaded:', hardcodedUnits.length, 'units');
            setUnits(hardcodedUnits);
        } catch (err) {
            console.error('Error loading hardcoded units:', err);
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
