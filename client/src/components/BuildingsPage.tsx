import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { BuildingDetail, BuildingCategory, DashboardStats } from '../types';
import { SlidersHorizontal, Plus } from './icons';
import { dashboardAPI, serviceRequestsAPI, paymentsAPI } from '../services/api';

interface BuildingsPageProps {
    onBuildingClick: (buildingId: string) => void;
    onAddNewBuilding: () => void;
}

const CategoryPill = ({ category }: { category: BuildingCategory }) => {
    const categoryStyles = {
        [BuildingCategory.Luxury]: 'bg-yellow-100 text-yellow-800',
        [BuildingCategory.MidRange]: 'bg-purple-100 text-purple-800',
        [BuildingCategory.Standard]: 'bg-blue-100 text-blue-800',
    };
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${categoryStyles[category]}`}>
            {category}
        </span>
    );
};

const ProgressCell = ({ value, label }: { value: number; label?: string }) => (
    <div className="flex items-center" title={label}>
        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
            <div className="bg-accent-primary h-2 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
    </div>
);

const StatusPill = ({ percentage }: { percentage: number }) => {
  let colorClasses = '';
  if (percentage >= 80) {
    colorClasses = 'bg-status-success text-status-success-text';
  } else if (percentage >= 60) {
    colorClasses = 'bg-status-warning text-status-warning-text';
  } else {
    colorClasses = 'bg-status-error text-status-error-text';
  }
  return <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClasses}`}>{percentage}%</span>;
};

const ContactCell = ({ contact }: { contact: { name: string; avatar: string; } }) => (
    <div className="flex items-center">
        <img className="h-8 w-8 rounded-full object-cover" src={contact.avatar} alt={contact.name} />
        <span className="ml-3 font-medium text-gray-900">{contact.name}</span>
    </div>
);

// FIX: Changed component definition to a more standard form to resolve type error.
const SortableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
        <div className="flex items-center">
            <span>{children}</span>
            {/* Add sort icon here if needed */}
        </div>
    </th>
);


export const BuildingsPage: React.FC<BuildingsPageProps> = ({ onBuildingClick, onAddNewBuilding }) => {
    const [buildings, setBuildings] = useState<BuildingDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBuildingsData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get comprehensive dashboard stats which includes all building data
            const [dashboardStats, serviceRequests] = await Promise.all([
                dashboardAPI.getStats(),
                serviceRequestsAPI.getAll().catch(() => []) // Fallback to empty array if service requests fail
            ]);

            console.log('Dashboard stats for buildings:', dashboardStats);
            console.log('Service requests:', serviceRequests);

            // Validate dashboard stats structure
            if (!dashboardStats || !dashboardStats.properties) {
                console.warn('Invalid dashboard stats structure:', dashboardStats);
                setBuildings([]);
                return;
            }

            // If no properties exist, set empty array
            if (!dashboardStats.properties.addresses || dashboardStats.properties.addresses.length === 0) {
                setBuildings([]);
                return;
            }

            // Transform API data to BuildingDetail format using dashboard stats
            const buildingsData: BuildingDetail[] = dashboardStats.properties?.addresses?.map((address: string, index: number) => {
                // Find all units for this property
                const propertyUnits = dashboardStats.units?.details?.filter((unit: any) => 
                    unit.property === address
                ) || [];
                
                const totalUnits = propertyUnits.length;
                const vacantUnits = propertyUnits.filter((unit: any) => unit.status === 'vacant').length;
                const occupiedUnits = totalUnits - vacantUnits;
                const occupationPercentage = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
                
                // Count service requests for this property
                const propertyServiceRequests = Array.isArray(serviceRequests) ? serviceRequests.filter((sr: any) => {
                    // Handle different possible data structures
                    const srProperty = sr.unitID?.propertyID?.address || sr.unitID?.property || sr.property;
                    return srProperty === address;
                }).length : 0;
                
                // Calculate rent collection percentage based on actual revenue vs potential
                const potentialRevenue = propertyUnits.reduce((sum: number, unit: any) => {
                    const rent = parseFloat(unit.monthlyRent?.toString() || '0') || 0;
                    return sum + rent;
                }, 0);
                
                const occupiedRevenue = propertyUnits
                    .filter((unit: any) => unit.status === 'occupied')
                    .reduce((sum: number, unit: any) => {
                        const rent = parseFloat(unit.monthlyRent?.toString() || '0') || 0;
                        return sum + rent;
                    }, 0);
                
                // Rent collection percentage represents potential income being collected from occupied units
                // For now, we assume 100% collection from occupied units (can be enhanced with payment data)
                const rentCollectionPercentage = totalUnits > 0 
                    ? Math.round((occupiedRevenue / Math.max(potentialRevenue, 1)) * 100)
                    : 100; // 100% if no units (no collection issues)
                
                // Determine building category based on average rent
                const avgRent = totalUnits > 0 
                    ? potentialRevenue / totalUnits
                    : 0;
                
                let category = BuildingCategory.Standard;
                if (avgRent > 3000) {
                    category = BuildingCategory.Luxury;
                } else if (avgRent > 1500) {
                    category = BuildingCategory.MidRange;
                }
                
                return {
                    id: `building-${index}-${address.replace(/[^a-zA-Z0-9]/g, '')}`, // More unique ID
                    name: address.split(',')[0]?.trim() || `Building ${index + 1}`,
                    address: address,
                    category,
                    totalUnits,
                    vacantUnits,
                    requests: propertyServiceRequests,
                    occupationPercentage,
                    rentCollectionPercentage,
                    assignedContact: {
                        name: 'Property Manager', // Could be enhanced with real contact data from user info
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(address)}`
                    }
                };
            }) || [];

            setBuildings(buildingsData);
        } catch (err) {
            console.error('Error fetching buildings data:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to load buildings data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuildingsData();
    }, []);

    if (loading) {
        return (
            <Card className="!p-0">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-text-main">Loading Buildings...</p>
                    <p className="text-sm text-text-secondary mt-2">Fetching property data and service requests</p>
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
                    <h3 className="text-xl font-semibold text-text-main mb-4">Failed to Load Buildings</h3>
                    <p className="text-text-secondary mb-6">{error}</p>
                    <button 
                        onClick={fetchBuildingsData}
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
                    <h2 className="text-xl font-bold text-text-main">Buildings Management</h2>
                    <p className="text-sm text-text-secondary">
                        {buildings.length} building{buildings.length !== 1 ? 's' : ''} • {buildings.reduce((sum, b) => sum + b.totalUnits, 0)} total units
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchBuildingsData}
                        disabled={loading}
                        className="flex items-center text-sm font-medium text-text-secondary bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                    <button 
                        onClick={onAddNewBuilding}
                        className="flex items-center text-sm font-medium text-white bg-accent-secondary rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Building
                    </button>
                    <button className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader>Building</SortableHeader>
                            <SortableHeader>Category</SortableHeader>
                            <SortableHeader>Total Units</SortableHeader>
                            <SortableHeader>Vacant Units</SortableHeader>
                            <SortableHeader>Requests</SortableHeader>
                            <SortableHeader>Occupation %</SortableHeader>
                            <SortableHeader>Rent Collection (%)</SortableHeader>
                            <SortableHeader>Assigned Contact</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {buildings.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-5 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h4" />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-text-main mb-2">No Buildings Found</h3>
                                        <p className="text-text-secondary mb-4">Start by adding your first building to manage units and tenants.</p>
                                        <button 
                                            onClick={onAddNewBuilding}
                                            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                                        >
                                            Add Your First Building
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            buildings.map((building: BuildingDetail, index) => (
                                <tr key={`${building.id}-${index}`} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        <button onClick={() => onBuildingClick(building.id)} className="text-blue-600 hover:underline">
                                            {building.name}
                                        </button>
                                        <div className="text-xs text-gray-500 mt-1">{building.address}</div>
                                    </td>
                                <td className="px-5 py-4 whitespace-nowrap"><CategoryPill category={building.category} /></td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{building.totalUnits}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{building.vacantUnits}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500" title={`${building.requests} ${building.requests === 1 ? 'active service request' : 'active service requests'}`}>
                                    {building.requests}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap"><StatusPill percentage={building.occupationPercentage} /></td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <ProgressCell 
                                        value={building.rentCollectionPercentage} 
                                        label={`Revenue efficiency: ${building.rentCollectionPercentage}% of potential monthly revenue being collected`}
                                    />
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap"><ContactCell contact={building.assignedContact} /></td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};