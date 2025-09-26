import React from 'react';
import { Card } from './Card';
import { BUILDINGS_PAGE_DATA } from '../constants';
import { BuildingDetail, BuildingCategory } from '../types';
import { SlidersHorizontal, Plus } from './icons';

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

const ProgressCell = ({ value }: { value: number }) => (
    <div className="flex items-center">
        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
            <div className="bg-accent-primary h-2 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
    </div>
);

const StatusPill = ({ percentage }) => {
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
    return (
        <Card className="!p-0">
             <div className="flex justify-end p-4 gap-4">
                <button 
                    onClick={onAddNewBuilding}
                    className="flex items-center text-sm font-medium text-white bg-accent-secondary rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Building
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
                        {BUILDINGS_PAGE_DATA.map((building: BuildingDetail, index) => (
                            <tr key={`${building.id}-${index}`} className="hover:bg-gray-50">
                                <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    <button onClick={() => onBuildingClick(building.id)} className="text-blue-600 hover:underline">
                                        {building.id}
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