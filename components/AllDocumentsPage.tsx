
import React, { useState } from 'react';
import { Card } from './Card';
import { Document, DocumentType, AppData } from '../types';
import { SlidersHorizontal, Plus, Search, Users } from './icons';
import { useTable } from '../hooks/useTable';
import { SortableHeader } from './SortableHeader';
import { DocumentSharingModal } from './DocumentSharingModal';

interface AllDocumentsPageProps {
  onAddNewDocument: () => void;
  onSelectBuilding: (id: string) => void;
  onSelectUnit: (id: string) => void;
  appData: AppData;
  onUpdateDocumentSharing?: (documentId: string, sharedWith: string[]) => void;
}

const getDocumentTypeStyles = (type: DocumentType) => {
    switch (type) {
        case DocumentType.Lease: return 'bg-blue-100 text-blue-800';
        case DocumentType.Utilities: return 'bg-yellow-100 text-yellow-800';
        case DocumentType.Income: return 'bg-green-100 text-green-800';
        case DocumentType.Insurance: return 'bg-indigo-100 text-indigo-800';
        case DocumentType.Service: return 'bg-purple-100 text-purple-800';
        case DocumentType.Certifications: return 'bg-pink-100 text-pink-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const AllDocumentsPage: React.FC<AllDocumentsPageProps> = ({ onAddNewDocument, onSelectBuilding, onSelectUnit, appData, onUpdateDocumentSharing }) => {
    const [sharingDocument, setSharingDocument] = useState<Document | null>(null);
    const documentsWithBuildingName = React.useMemo(() => {
        return appData.documents.map(doc => ({
            ...doc,
            buildingName: appData.buildings.find(b => b.id === doc.building)?.name || doc.building
        }));
    }, [appData.documents, appData.buildings]);

    type DocumentWithBuildingName = Document & { buildingName: string };

    // FIX: Provide explicit generic type to useTable to fix type inference issues.
    const { items, requestSort, sortConfig, searchQuery, setSearchQuery } = useTable<DocumentWithBuildingName>(
        documentsWithBuildingName,
        ['name', 'buildingName', 'unit', 'type']
    );

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
        if (buildingId === 'N/A') return false;
        return appData.buildings.some(b => b.id === buildingId);
    };
    
    return (
        <Card className="!p-0">
            <div className="flex justify-between items-center p-4 gap-4">
                 <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search documents..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onAddNewDocument}
                        className="flex items-center text-sm font-medium text-white bg-accent-secondary rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Document
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
                            <SortableHeader<DocumentWithBuildingName> columnKey="name" sortConfig={sortConfig} requestSort={requestSort}>Document Name</SortableHeader>
                            <SortableHeader<DocumentWithBuildingName> columnKey="buildingName" sortConfig={sortConfig} requestSort={requestSort}>Building</SortableHeader>
                            <SortableHeader<DocumentWithBuildingName> columnKey="unit" sortConfig={sortConfig} requestSort={requestSort}>Unit</SortableHeader>
                            <SortableHeader<DocumentWithBuildingName> columnKey="type" sortConfig={sortConfig} requestSort={requestSort}>Doc Type</SortableHeader>
                            <SortableHeader<DocumentWithBuildingName> columnKey="uploadDate" sortConfig={sortConfig} requestSort={requestSort}>Date Uploaded</SortableHeader>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shared With</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((doc: Document & { buildingName: string }) => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                                <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{doc.name}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm">
                                    <button 
                                        onClick={() => onSelectBuilding(doc.building)} 
                                        className="text-blue-600 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-default"
                                        disabled={!isBuildingLinkable(doc.building)}
                                    >
                                        {doc.buildingName}
                                    </button>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm">
                                     <button 
                                        onClick={() => findAndSelectUnit(doc.building, doc.unit)} 
                                        className="text-blue-600 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-default"
                                        disabled={!isUnitLinkable(doc.building, doc.unit)}
                                    >
                                        {doc.unit}
                                    </button>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDocumentTypeStyles(doc.type)}`}>
                                        {doc.type}
                                    </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadDate}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {doc.sharedWith && doc.sharedWith.length > 0 ? (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            {doc.sharedWith.length} tenant{doc.sharedWith.length !== 1 ? 's' : ''}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">Not shared</span>
                                    )}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => setSharingDocument(doc)}
                                        className="flex items-center gap-1 text-brand-pink hover:text-pink-700 font-medium"
                                    >
                                        <Users className="w-4 h-4" />
                                        Share
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Document Sharing Modal */}
            {sharingDocument && onUpdateDocumentSharing && (
                <DocumentSharingModal
                    document={sharingDocument}
                    appData={appData}
                    onClose={() => setSharingDocument(null)}
                    onUpdateSharing={onUpdateDocumentSharing}
                />
            )}
        </Card>
    );
};
