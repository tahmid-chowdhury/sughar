
import React from 'react';
import { Card } from './Card';
import { Document, AppData } from '../types';
import { MoreHorizontal, Star } from './icons';
import { useTable } from '../hooks/useTable';
import { SortableHeader } from './SortableHeader';

interface DocumentTableProps {
    title: string;
    documents: Document[];
    onSelectBuilding: (id: string) => void;
    onSelectUnit: (id: string) => void;
    appData: AppData;
    showStar?: boolean;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({ title, documents, onSelectBuilding, onSelectUnit, appData, showStar = false }) => {
    const documentsWithBuildingName = React.useMemo(() => {
        return documents.map(doc => ({
            ...doc,
            buildingName: appData.buildings.find(b => b.id === doc.building)?.name || doc.building
        }));
    }, [documents, appData.buildings]);

    type DocumentWithBuildingName = Document & { buildingName: string };

    // FIX: Provide explicit generic type to useTable to fix type inference issues.
    const { items, requestSort, sortConfig } = useTable<DocumentWithBuildingName>(documentsWithBuildingName, ['name', 'buildingName', 'unit', 'type']);


    const findAndSelectUnit = (buildingId: string, unitNumber: string) => {
        if (unitNumber === '---' || unitNumber === 'N/A') return;
        const unit = appData.units.find(u => u.buildingId === buildingId && u.unitNumber === unitNumber);
        if (unit) onSelectUnit(unit.id);
    };
    
    const isUnitLinkable = (buildingId: string, unitNumber: string) => {
        if (unitNumber === '---' || unitNumber === 'N/A') return false;
        return appData.units.some(u => u.buildingId === buildingId && u.unitNumber === unitNumber);
    };
    
    const isBuildingLinkable = (buildingId: string) => {
        return appData.buildings.some(b => b.id === buildingId);
    };

    return (
        <Card className="flex-1">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-atkinson text-xl font-bold text-text-main">{title}</h3>
                <button className="text-text-secondary hover:text-text-main">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            {showStar && <th scope="col" className="px-4 py-3"></th>}
                            <SortableHeader<DocumentWithBuildingName> columnKey="name" sortConfig={sortConfig} requestSort={requestSort}>Document Name</SortableHeader>
                            <SortableHeader<DocumentWithBuildingName> columnKey="buildingName" sortConfig={sortConfig} requestSort={requestSort}>Building</SortableHeader>
                            <SortableHeader<DocumentWithBuildingName> columnKey="unit" sortConfig={sortConfig} requestSort={requestSort}>Unit</SortableHeader>
                            <SortableHeader<DocumentWithBuildingName> columnKey="type" sortConfig={sortConfig} requestSort={requestSort}>Doc Type</SortableHeader>
                            <SortableHeader<DocumentWithBuildingName> columnKey="uploadDate" sortConfig={sortConfig} requestSort={requestSort}>Date Uploaded</SortableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((doc, index) => (
                            <tr key={doc.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                {showStar && <td className="px-4 py-3"><Star className="w-5 h-5 text-yellow-400 fill-current" /></td>}
                                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{doc.name}</td>
                                <td className="px-4 py-3">
                                    <button 
                                        onClick={() => onSelectBuilding(doc.building)} 
                                        className="text-blue-600 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-default"
                                        disabled={!isBuildingLinkable(doc.building)}
                                    >
                                        {doc.buildingName}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <button 
                                        onClick={() => findAndSelectUnit(doc.building, doc.unit)} 
                                        className="text-blue-600 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-default"
                                        disabled={!isUnitLinkable(doc.building, doc.unit)}
                                    >
                                        {doc.unit}
                                    </button>
                                </td>
                                <td className="px-4 py-3">{doc.type}</td>
                                <td className="px-4 py-3">{doc.uploadDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
