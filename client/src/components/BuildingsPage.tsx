

import React from 'react';
import { Card } from './Card';
import { BuildingDetail, BuildingCategory } from '../types';
import { Plus, Search } from './icons';
import { useTable } from '../hooks/useTable';
import { SortableHeader } from './SortableHeader';

interface BuildingsPageProps {
    onBuildingClick: (buildingId: string) => void;
    onAddNewBuilding: () => void;
    buildings: BuildingDetail[];
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

const ProgressCell = ({ value }: { value: number }) => (
    <div className="flex items-center">
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

export const BuildingsPage: React.FC<BuildingsPageProps> = ({ onBuildingClick, onAddNewBuilding, buildings }) => {
    // FIX: Provide explicit generic type to useTable to fix type inference issues.
    const { 
        items, 
        requestSort, 
        sortConfig,
        searchQuery,
        setSearchQuery
    } = useTable<BuildingDetail>(buildings, ['name', 'category']);
    
    return (
        <Card className="!p-0">
             <div className="flex justify-between items-center p-4 gap-4 border-b">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search buildings..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
                    />
                </div>
                <button 
                    onClick={onAddNewBuilding}
                    className="flex items-center text-sm font-medium text-white bg-accent-secondary rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors flex-shrink-0"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Building
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader<BuildingDetail> columnKey="name" sortConfig={sortConfig} requestSort={requestSort}>Building</SortableHeader>
                            <SortableHeader<BuildingDetail> columnKey="category" sortConfig={sortConfig} requestSort={requestSort}>Category</SortableHeader>
                            <SortableHeader<BuildingDetail> columnKey="totalUnits" sortConfig={sortConfig} requestSort={requestSort}>Total Units</SortableHeader>
                            <SortableHeader<BuildingDetail> columnKey="vacantUnits" sortConfig={sortConfig} requestSort={requestSort}>Vacant Units</SortableHeader>
                            <SortableHeader<BuildingDetail> columnKey="requests" sortConfig={sortConfig} requestSort={requestSort}>Requests</SortableHeader>
                            <SortableHeader<BuildingDetail> columnKey="occupation" sortConfig={sortConfig} requestSort={requestSort}>Occupation %</SortableHeader>
                            <SortableHeader<BuildingDetail> columnKey="rentCollection" sortConfig={sortConfig} requestSort={requestSort}>Rent Collection (%)</SortableHeader>
                            <SortableHeader<BuildingDetail> columnKey="contact" sortConfig={sortConfig} requestSort={requestSort}>Assigned Contact</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((building: BuildingDetail) => (
                            <tr key={building.id} className="hover:bg-gray-50">
                                <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    <button onClick={() => onBuildingClick(building.id)} className="text-blue-600 hover:underline">
                                        {building.name}
                                    </button>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap"><CategoryPill category={building.category} /></td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{building.totalUnits}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{building.vacantUnits}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{building.requests}</td>
                                <td className="px-5 py-4 whitespace-nowrap"><ProgressCell value={building.occupation} /></td>
                                <td className="px-5 py-4 whitespace-nowrap"><StatusPill percentage={building.rentCollection} /></td>
                                <td className="px-5 py-4 whitespace-nowrap"><ContactCell contact={building.contact} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};