

import React from 'react';
import { Card } from './Card';
import { UnitDetail, BuildingCategory, UnitStatus, RentStatus, Tenant, BuildingDetail as Building } from '../types';
import { SlidersHorizontal, Plus, Search } from './icons';
import { useTable } from '../hooks/useTable';
import { SortableHeader } from './SortableHeader';

interface UnitsPageProps {
    setViewingTenantId: (id: string) => void;
    onAddNewUnit: () => void;
    units: UnitDetail[];
    tenants: Tenant[];
    buildings: Building[];
    onSelectBuilding: (buildingId: string) => void;
    onSelectUnit: (unitId: string) => void;
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

const TenantCell: React.FC<{ tenant: Tenant | undefined, setViewingTenantId: (id: string) => void }> = ({ tenant, setViewingTenantId }) => {
    if (!tenant) return <span className="text-gray-400">---</span>;
    return (
        <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary">
            <img className="h-8 w-8 rounded-full object-cover" src={tenant.avatar} alt={tenant.name} />
            <span className="ml-3 font-medium text-gray-900">{tenant.name}</span>
        </button>
    );
};

export const UnitsPage: React.FC<UnitsPageProps> = ({ setViewingTenantId, onAddNewUnit, units, tenants, buildings, onSelectBuilding, onSelectUnit }) => {
    const unitsWithTenantAndBuilding = React.useMemo(() => {
        return units.map(unit => {
            const tenant = tenants.find(t => t.id === unit.currentTenantId);
            const building = buildings.find(b => b.id === unit.buildingId);
            return {
                ...unit,
                tenantName: tenant?.name || '',
                buildingName: building?.name || '',
            }
        });
    }, [units, tenants, buildings]);

    type UnitWithNames = UnitDetail & { tenantName: string; buildingName: string; };

    // FIX: Provide explicit generic type to useTable to fix type inference issues.
    const {
        items,
        requestSort,
        sortConfig,
        searchQuery,
        setSearchQuery
    } = useTable<UnitWithNames>(unitsWithTenantAndBuilding, ['unitNumber', 'buildingName', 'category', 'tenantName']);
    
    return (
        <Card className="!p-0">
            <div className="flex justify-between items-center p-4 gap-4">
                 <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search units, tenants..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
                    />
                </div>
                 <div className="flex gap-4">
                    <button 
                        onClick={onAddNewUnit}
                        className="flex items-center text-sm font-medium text-white bg-accent-secondary rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors flex-shrink-0"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Unit
                    </button>
                    <button className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader<UnitWithNames> columnKey="unitNumber" sortConfig={sortConfig} requestSort={requestSort}>Unit</SortableHeader>
                            <SortableHeader<UnitWithNames> columnKey="buildingName" sortConfig={sortConfig} requestSort={requestSort}>Building</SortableHeader>
                            <SortableHeader<UnitWithNames> columnKey="category" sortConfig={sortConfig} requestSort={requestSort}>Category</SortableHeader>
                            <SortableHeader<UnitWithNames> columnKey="monthlyRent" sortConfig={sortConfig} requestSort={requestSort}>Monthly Rent</SortableHeader>
                            <SortableHeader<UnitWithNames> columnKey="status" sortConfig={sortConfig} requestSort={requestSort}>Status</SortableHeader>
                            <SortableHeader<UnitWithNames> columnKey="tenantName" sortConfig={sortConfig} requestSort={requestSort}>Tenant</SortableHeader>
                            <SortableHeader<UnitWithNames> columnKey="rentStatus" sortConfig={sortConfig} requestSort={requestSort}>Rent Status</SortableHeader>
                            <SortableHeader<UnitWithNames> columnKey="leaseEndDate" sortConfig={sortConfig} requestSort={requestSort}>Lease End Date</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((unit) => {
                            const tenant = tenants.find(t => t.id === unit.currentTenantId);
                            return (
                                <tr key={unit.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        <button onClick={() => onSelectUnit(unit.id)} className="text-blue-600 hover:underline">
                                            {unit.unitNumber}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => onSelectBuilding(unit.buildingId)} className="text-blue-600 hover:underline">
                                            {unit.buildingName}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap"><CategoryPill category={unit.category} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Intl.NumberFormat('en-US').format(unit.monthlyRent)} BDT
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap"><StatusPill status={unit.status} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap"><TenantCell tenant={tenant} setViewingTenantId={setViewingTenantId} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap"><StatusPill status={unit.rentStatus} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.leaseEndDate || '---'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};