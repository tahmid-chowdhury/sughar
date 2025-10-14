

import React, { useState } from 'react';
import { Card } from './Card';
import { AppData, UnitDetail, UnitStatus, RentStatus, Tenant, BuildingCategory } from '../types';
import { ArrowLeft, SlidersHorizontal, Plus, Search } from './icons';
import { BuildingDetailsTab } from './BuildingDetailsTab';
import { useTable } from '../hooks/useTable';
import { SortableHeader } from './SortableHeader';

interface SpecificBuildingPageProps {
  buildingId: string;
  appData: AppData;
  onBack: () => void;
  onSelectUnit: (unitId: string) => void;
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

const TenantCell: React.FC<{ tenant: Tenant | undefined, setViewingTenantId: (id: string) => void }> = ({ tenant, setViewingTenantId }) => {
    if (!tenant) return <span className="text-gray-400">---</span>;
    return (
        <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary">
            <img className="h-8 w-8 rounded-full object-cover" src={tenant.avatar} alt={tenant.name} />
            <span className="ml-3 font-medium text-gray-900">{tenant.name}</span>
        </button>
    );
};

const UnitsList: React.FC<{
    buildingUnits: UnitDetail[];
    appData: AppData;
    onSelectUnit: (unitId: string) => void;
    setViewingTenantId: (tenantId: string) => void;
}> = ({ buildingUnits, appData, onSelectUnit, setViewingTenantId }) => {
    const unitsWithTenant = React.useMemo(() => {
        return buildingUnits.map(unit => ({
            ...unit,
            tenantName: appData.tenants.find(t => t.id === unit.currentTenantId)?.name || ''
        }));
    }, [buildingUnits, appData.tenants]);
    
    type UnitWithTenant = UnitDetail & { tenantName: string };
    // FIX: Provide explicit generic type to useTable to fix type inference issues.
    const { items, requestSort, sortConfig, searchQuery, setSearchQuery } = useTable<UnitWithTenant>(unitsWithTenant, ['unitNumber', 'category', 'tenantName']);

    return (
    <Card className="!p-0">
        <div className="flex justify-between items-center p-4 gap-4">
            <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search units..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
                />
            </div>
            <div className="flex gap-4">
                <button className="flex items-center text-sm font-medium text-white bg-accent-secondary rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors">
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
                        <SortableHeader<UnitWithTenant> columnKey="unitNumber" sortConfig={sortConfig} requestSort={requestSort}>Unit</SortableHeader>
                        <SortableHeader<UnitWithTenant> columnKey="category" sortConfig={sortConfig} requestSort={requestSort}>Category</SortableHeader>
                        <SortableHeader<UnitWithTenant> columnKey="monthlyRent" sortConfig={sortConfig} requestSort={requestSort}>Monthly Rent</SortableHeader>
                        <SortableHeader<UnitWithTenant> columnKey="status" sortConfig={sortConfig} requestSort={requestSort}>Status</SortableHeader>
                        <SortableHeader<UnitWithTenant> columnKey="tenantName" sortConfig={sortConfig} requestSort={requestSort}>Tenant</SortableHeader>
                        <SortableHeader<UnitWithTenant> columnKey="leaseEndDate" sortConfig={sortConfig} requestSort={requestSort}>Lease End Date</SortableHeader>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((unit) => {
                        const tenant = appData.tenants.find(t => t.id === unit.currentTenantId);
                        return (
                        <tr key={unit.id} className="hover:bg-gray-50">
                            <td className="px-5 py-4 whitespace-nowrap text-sm font-bold">
                                <button onClick={() => onSelectUnit(unit.id)} className="text-blue-600 hover:underline">
                                   {unit.unitNumber}
                                </button>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap"><CategoryPill category={unit.category} /></td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{new Intl.NumberFormat().format(unit.monthlyRent)} BDT</td>
                            <td className="px-5 py-4 whitespace-nowrap"><StatusPill status={unit.status} /></td>
                            <td className="px-5 py-4 whitespace-nowrap"><TenantCell tenant={tenant} setViewingTenantId={setViewingTenantId} /></td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{unit.leaseEndDate || '---'}</td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </Card>
)};


export const SpecificBuildingPage: React.FC<SpecificBuildingPageProps> = ({ buildingId, appData, onBack, onSelectUnit, setViewingTenantId }) => {
    const [activeTab, setActiveTab] = useState('Units');
    const building = appData.buildings.find(b => b.id === buildingId);
    const buildingUnits = appData.units.filter(u => u.buildingId === buildingId);

    if (!building) {
        return (
            <div>
                <button onClick={onBack}>Back</button>
                <p>Building not found.</p>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Building Details':
                return <BuildingDetailsTab building={building} />;
            case 'Units':
            default:
                return <UnitsList buildingUnits={buildingUnits} appData={appData} onSelectUnit={onSelectUnit} setViewingTenantId={setViewingTenantId} />;
        }
    };
    
    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Buildings Dashboard
            </button>
            <header className="mb-2">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">Building: {building.name}</h1>
                <p className="text-text-secondary mt-1">ID: {building.id}</p>
                 <div className="mt-4 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {['Units', 'Building Details'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                ${
                                    activeTab === tab
                                        ? 'border-brand-pink text-brand-pink'
                                        : 'border-transparent text-inactive-tab hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>
            
            <div className="mt-8">
                {renderContent()}
            </div>
        </div>
    );
};