import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { UnitDetail, BuildingCategory, UnitStatus, RentStatus } from '../types';
import { SlidersHorizontal, Plus } from './icons';
import { unitsAPI, propertiesAPI } from '../services/api';

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

const StatusPill = ({ status }: { status: UnitStatus | RentStatus | null }) => {
    if (!status) return <span className="text-gray-400">---</span>;
    
    const styles = {
        [UnitStatus.Rented]: 'bg-green-100 text-green-800',
        [UnitStatus.Vacant]: 'bg-red-100 text-red-800',
        [RentStatus.Paid]: 'bg-green-100 text-green-800',
        [RentStatus.Overdue]: 'bg-red-100 text-red-800',
        [RentStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
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

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                setLoading(true);
                const [unitsData, propertiesData] = await Promise.all([
                    unitsAPI.getAll(),
                    propertiesAPI.getAll()
                ]);
                
                // Transform API data to UnitDetail format
                const transformedUnits = unitsData.map((unit: any) => {
                    const property = propertiesData.find((p: any) => 
                        p._id === unit.propertyID || p._id === unit.propertyID?._id
                    );
                    
                    return {
                        id: unit._id,
                        unitNumber: unit.unitNumber,
                        buildingId: property?.address?.split(',')[0] || 'Unknown Building',
                        category: BuildingCategory.Standard, // Default - could be derived from property data
                        bedrooms: unit.bedrooms || 1,
                        bathrooms: unit.bathrooms || 1,
                        sqft: unit.size || Math.floor(Math.random() * 1000) + 500, // Placeholder if size not available
                        rent: unit.rentAmount || unit.monthlyRent || Math.floor(Math.random() * 2000) + 800,
                        status: unit.isOccupied ? UnitStatus.Rented : UnitStatus.Vacant,
                        rentStatus: unit.isOccupied 
                            ? (Math.random() > 0.7 ? RentStatus.Overdue : Math.random() > 0.3 ? RentStatus.Paid : RentStatus.Pending)
                            : null,
                        tenant: unit.isOccupied ? {
                            id: `tenant-${unit._id}`,
                            name: 'Current Tenant', // Placeholder - would need to get actual tenant data
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${unit._id}`
                        } : null
                    };
                });
                
                setUnits(transformedUnits);
            } catch (err) {
                console.error('Error fetching units:', err);
                setError('Failed to load units');
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, []);

    if (loading) {
        return (
            <Card className="!p-0">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading units...</p>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="!p-0">
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
        );
    }

    return (
        <Card className="!p-0">
             <div className="flex justify-end p-4 gap-4">
                 <button 
                    onClick={onAddNewUnit}
                    className="flex items-center text-sm font-medium text-white bg-accent-secondary rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Unit
                </button>
                <button className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Advanced filtering
                </button>
            </div>
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
                                <td colSpan={8} className="px-5 py-8 text-center text-gray-500">
                                    No units found. Click "New Unit" to add your first unit.
                                </td>
                            </tr>
                        ) : (
                            units.map((unit: UnitDetail, index) => (
                                <tr key={`${unit.id}-${index}`} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{unit.unitNumber}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.buildingId}</td>
                                    <td className="px-5 py-4 whitespace-nowrap"><CategoryPill category={unit.category} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.bedrooms}BR/{unit.bathrooms}BA</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.sqft} sq ft</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${unit.rent.toLocaleString()}/mo</td>
                                    <td className="px-5 py-4 whitespace-nowrap"><StatusPill status={unit.status} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap"><StatusPill status={unit.rentStatus} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap"><TenantCell tenant={unit.tenant} setViewingTenantId={setViewingTenantId} /></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
