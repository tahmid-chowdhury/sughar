

import React, { useMemo } from 'react';
import { Card } from './Card';
// FIX: Import tenant data and Tenant type to handle updated data structure
import { UnitDetail, BuildingCategory, UnitStatus, RentStatus, Tenant, AppData } from '../types';
import { SlidersHorizontal } from './icons';
import { useTable } from '../hooks/useTable';
import { SortableHeader } from './SortableHeader';

interface SpecificBuildingUnitsPageProps {
    buildingId: string;
    setViewingTenantId: (tenantId: string) => void;
    // FIX: Add appData to props to make component dynamic
    appData: AppData;
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

// FIX: Corrected tenant prop type
const TenantCell = ({ tenant, setViewingTenantId }: { tenant: Tenant | undefined, setViewingTenantId: (tenantId: string) => void }) => {
    if (!tenant) return <span className="text-gray-400">---</span>;
    return (
        <button
            onClick={() => setViewingTenantId(tenant.id)}
            className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary"
        >
            <img className="h-8 w-8 rounded-full object-cover" src={tenant.avatar} alt={tenant.name} />
            <span className="ml-3 font-medium text-gray-900">{tenant.name}</span>
        </button>
    );
};

// FIX: Removed incorrect local SortableHeader component definition. The shared component is now imported and used.
export const SpecificBuildingUnitsPage: React.FC<SpecificBuildingUnitsPageProps> = ({ buildingId, setViewingTenantId, appData }) => {
    // FIX: Use appData for units, as UNITS_PAGE_DATA constant is empty.
    const buildingUnits = useMemo(() => appData.units.filter(unit => unit.buildingId === buildingId), [appData.units, buildingId]);

    // FIX: Add data for sorting
    const unitsWithTenantData = useMemo(() => {
        return buildingUnits.map(unit => {
            const tenant = appData.tenants.find(t => t.id === unit.currentTenantId);
            return {
                ...unit,
                tenantName: tenant?.name || '',
            };
        });
    }, [buildingUnits, appData.tenants]);
    
    type UnitWithTenantName = UnitDetail & { tenantName: string };

    // FIX: Implement sorting with useTable hook and provide explicit generic to fix type errors.
    const { items, requestSort, sortConfig } = useTable<UnitWithTenantName>(unitsWithTenantData, ['unitNumber', 'tenantName', 'category']);

    return (
        <Card className="!p-0">
             <div className="flex justify-end p-4">
                <button className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Advanced filtering
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {/* FIX: Add sorting to table headers */}
                        <tr>
                            <SortableHeader<UnitWithTenantName> columnKey="unitNumber" sortConfig={sortConfig} requestSort={requestSort}>Unit</SortableHeader>
                            <SortableHeader<UnitWithTenantName> columnKey="category" sortConfig={sortConfig} requestSort={requestSort}>Category</SortableHeader>
                            <SortableHeader<UnitWithTenantName> columnKey="monthlyRent" sortConfig={sortConfig} requestSort={requestSort}>Monthly Rent</SortableHeader>
                            <SortableHeader<UnitWithTenantName> columnKey="status" sortConfig={sortConfig} requestSort={requestSort}>Status</SortableHeader>
                            <SortableHeader<UnitWithTenantName> columnKey="tenantName" sortConfig={sortConfig} requestSort={requestSort}>Tenant</SortableHeader>
                            <SortableHeader<UnitWithTenantName> columnKey="rentStatus" sortConfig={sortConfig} requestSort={requestSort}>Rent Status</SortableHeader>
                            <SortableHeader<UnitWithTenantName> columnKey="leaseStartDate" sortConfig={sortConfig} requestSort={requestSort}>Lease Start Date</SortableHeader>
                            <SortableHeader<UnitWithTenantName> columnKey="leaseEndDate" sortConfig={sortConfig} requestSort={requestSort}>Lease End Date</SortableHeader>
                            <SortableHeader<UnitWithTenantName> columnKey="requests" sortConfig={sortConfig} requestSort={requestSort}>Requests</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* FIX: Use sorted and filtered items from useTable */}
                        {items.map((unit) => {
                            // FIX: Look up tenant using currentTenantId from appData
                            const tenant = appData.tenants.find(t => t.id === unit.currentTenantId);
                            return (
                                // FIX: Use stable unit.id for key
                                <tr key={unit.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{unit.unitNumber}</td>
                                    <td className="px-5 py-4 whitespace-nowrap"><CategoryPill category={unit.category} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Intl.NumberFormat('en-US').format(unit.monthlyRent)}
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap"><StatusPill status={unit.status} /></td>
                                    {/* FIX: Pass looked-up tenant object to TenantCell */}
                                    <td className="px-5 py-4 whitespace-nowrap"><TenantCell tenant={tenant} setViewingTenantId={setViewingTenantId} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap"><StatusPill status={unit.rentStatus} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.leaseStartDate || '---'}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.leaseEndDate || '---'}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.requests}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};