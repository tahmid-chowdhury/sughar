import React from 'react';
import { Card } from './Card';
import { UNITS_PAGE_DATA } from '../constants';
import { UnitDetail, BuildingCategory, UnitStatus, RentStatus } from '../types';
import { SlidersHorizontal } from './icons';

interface SpecificBuildingUnitsPageProps {
    buildingId: string;
    setViewingTenantId: (tenantId: string) => void;
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

const TenantCell = ({ tenant, setViewingTenantId }: { tenant: UnitDetail['tenant'], setViewingTenantId: (tenantId: string) => void }) => {
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

// FIX: Changed component definition to a more standard form to resolve type error.
const SortableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group">
       <div className="flex items-center">
            <span>{children}</span>
            <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            </span>
       </div>
    </th>
);

export const SpecificBuildingUnitsPage: React.FC<SpecificBuildingUnitsPageProps> = ({ buildingId, setViewingTenantId }) => {
    const buildingUnits = UNITS_PAGE_DATA.filter(unit => unit.buildingId === buildingId);

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
                        <tr>
                            <SortableHeader>Unit</SortableHeader>
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
                        {buildingUnits.map((unit: UnitDetail, index) => (
                            <tr key={`${unit.unitNumber}-${index}`} className="hover:bg-gray-50">
                                <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{unit.unitNumber}</td>
                                <td className="px-5 py-4 whitespace-nowrap"><CategoryPill category={unit.category} /></td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Intl.NumberFormat('en-US').format(unit.monthlyRent)}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap"><StatusPill status={unit.status} /></td>
                                <td className="px-5 py-4 whitespace-nowrap"><TenantCell tenant={unit.tenant} setViewingTenantId={setViewingTenantId} /></td>
                                <td className="px-5 py-4 whitespace-nowrap"><StatusPill status={unit.rentStatus} /></td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.leaseStartDate || '---'}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.leaseEndDate || '---'}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.requests}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};