

import React from 'react';
import { Card } from './Card';
// FIX: Import Application type to resolve error.
import { AppData, Application, Tenant } from '../types';
import { useTable } from '../hooks/useTable';
import { SortableHeader } from './SortableHeader';
import { Search } from './icons';

interface ApplicationsPageProps {
  onSelectBuilding: (buildingId: string) => void;
  onSelectUnit: (unitId: string) => void;
  appData: AppData;
}

const MatchPercentagePill: React.FC<{ percentage: number }> = ({ percentage }) => {
    let colorClasses = 'bg-yellow-100 text-yellow-800';
    if (percentage >= 80) colorClasses = 'bg-green-100 text-green-800';
    if (percentage < 50) colorClasses = 'bg-red-100 text-red-800';
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClasses}`}>
            {percentage}%
        </span>
    );
};

const TenantCell: React.FC<{ tenant: Application['tenant'] }> = ({ tenant }) => (
    <div className="flex items-center text-left w-full p-1 rounded-md">
        <img className="h-8 w-8 rounded-full object-cover" src={tenant.avatar} alt={tenant.name} />
        <div className="ml-3">
            <p className="font-medium text-gray-900">{tenant.name}</p>
        </div>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{tenant.rating}</span>
    </div>
);

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ onSelectBuilding, onSelectUnit, appData }) => {

    const applicationsWithDetails = React.useMemo(() => {
        // FIX: Use appData.rentalApplications instead of appData.applications
        return appData.rentalApplications.map(app => {
            const applicant = appData.users.find(u => u.id === app.userId);
            // This part is mocked due to data structure limitations
            const building = appData.buildings[2]; // Dhanmondi Residency
            const unitNumber = '1A';

            return {
                id: app.id,
                buildingId: building.id,
                tenant: {
                    id: applicant!.id,
                    name: applicant!.name,
                    avatar: applicant!.avatarUrl,
                    rating: 4.5, // Mocked
                },
                unit: unitNumber,
                matchPercentage: Math.floor(Math.random() * (98 - 75 + 1) + 75), // Mocked
                submissionDate: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 10))).toISOString().split('T')[0], // Mocked
                buildingName: building.name,
                tenantName: applicant!.name
            };
        });
    }, [appData.rentalApplications, appData.users, appData.buildings]);

    type ApplicationWithDetails = (typeof applicationsWithDetails)[0];

    const { items, requestSort, sortConfig, searchQuery, setSearchQuery } = useTable<ApplicationWithDetails>(
        applicationsWithDetails,
        ['tenantName', 'buildingName', 'unit']
    );

    const findAndSelectUnit = (buildingId: string, unitNumber: string) => {
        const unit = appData.units.find(u => u.buildingId === buildingId && u.unitNumber === unitNumber);
        if (unit) onSelectUnit(unit.id);
    };

    return (
        <Card className="!p-0">
            <div className="flex justify-between items-center p-4 gap-4 border-b">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search applications..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader<ApplicationWithDetails> columnKey="tenantName" sortConfig={sortConfig} requestSort={requestSort}>Tenant</SortableHeader>
                            <SortableHeader<ApplicationWithDetails> columnKey="buildingName" sortConfig={sortConfig} requestSort={requestSort}>Building</SortableHeader>
                            <SortableHeader<ApplicationWithDetails> columnKey="unit" sortConfig={sortConfig} requestSort={requestSort}>Unit</SortableHeader>
                            <SortableHeader<ApplicationWithDetails> columnKey="matchPercentage" sortConfig={sortConfig} requestSort={requestSort}>Match %</SortableHeader>
                            <SortableHeader<ApplicationWithDetails> columnKey="submissionDate" sortConfig={sortConfig} requestSort={requestSort}>Submitted On</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                                <td className="px-5 py-3 whitespace-nowrap"><TenantCell tenant={app.tenant} /></td>
                                <td className="px-5 py-3 whitespace-nowrap text-sm"><button onClick={() => onSelectBuilding(app.buildingId)} className="text-blue-600 hover:underline">{app.buildingName}</button></td>
                                <td className="px-5 py-3 whitespace-nowrap text-sm"><button onClick={() => findAndSelectUnit(app.buildingId, app.unit)} className="text-blue-600 hover:underline">{app.unit}</button></td>
                                <td className="px-5 py-3 whitespace-nowrap"><MatchPercentagePill percentage={app.matchPercentage} /></td>
                                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">{app.submissionDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
