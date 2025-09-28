import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { BuildingDetail, BuildingCategory } from '../types';
import { SlidersHorizontal, Plus } from './icons';
import { propertiesAPI, unitsAPI } from '../services/api';

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

    useEffect(() => {
        const fetchBuildingsData = async () => {
            try {
                setLoading(true);
                const [properties, allUnits] = await Promise.all([
                    propertiesAPI.getAll(),
                    unitsAPI.getAll()
                ]);

                // Transform API data to BuildingDetail format
                const buildingsData = properties.map((property: any) => {
                    const propertyUnits = allUnits.filter((unit: any) => 
                        unit.propertyID?._id === property._id || unit.propertyID === property._id
                    );
                    
                    const totalUnits = propertyUnits.length;
                    const vacantUnits = propertyUnits.filter((unit: any) => !unit.isOccupied).length;
                    const occupiedUnits = totalUnits - vacantUnits;
                    const occupationPercentage = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
                    
                    return {
                        id: property._id,
                        name: property.address.split(',')[0] || 'Unknown Building',
                        category: BuildingCategory.Standard, // Default category - you may want to add this to your Property model
                        totalUnits,
                        vacantUnits,
                        requests: Math.floor(Math.random() * 10), // Placeholder - replace with actual service request count
                        occupationPercentage,
                        rentCollectionPercentage: Math.floor(Math.random() * 30) + 70, // Placeholder - replace with actual rent collection data
                        assignedContact: {
                            name: property.userID?.firstName + ' ' + property.userID?.lastName || 'Unassigned',
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${property.userID?.email || 'default'}`
                        },
                        address: property.address
                    };
                });

                setBuildings(buildingsData);
            } catch (err) {
                console.error('Error fetching buildings data:', err);
                setError('Failed to load buildings data');
            } finally {
                setLoading(false);
            }
        };

        fetchBuildingsData();
    }, []);

    if (loading) {
        return (
            <Card className="!p-0">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading buildings...</p>
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
                        {buildings.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-5 py-8 text-center text-gray-500">
                                    No buildings found. Click "New Building" to add your first building.
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
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{building.requests}</td>
                                <td className="px-5 py-4 whitespace-nowrap"><StatusPill percentage={building.occupationPercentage} /></td>
                                <td className="px-5 py-4 whitespace-nowrap"><ProgressCell value={building.rentCollectionPercentage} /></td>
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