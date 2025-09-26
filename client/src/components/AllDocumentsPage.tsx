import React from 'react';
import { Card } from './Card';
import { ALL_DOCUMENTS_DATA } from '../constants';
import { Document, DocumentType } from '../types';
import { SlidersHorizontal, ArrowDown, Plus } from './icons';

interface AllDocumentsPageProps {
  onAddNewDocument: () => void;
}

const SortableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <th scope="col" className={`px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${className}`}>
       <div className="flex items-center">
            <span>{children}</span>
            <ArrowDown className="w-3 h-3 ml-1 text-gray-400" />
       </div>
    </th>
);

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

export const AllDocumentsPage: React.FC<AllDocumentsPageProps> = ({ onAddNewDocument }) => {
    return (
        <Card className="!p-0">
            <div className="flex justify-end p-4 gap-4">
                 <button
                    onClick={onAddNewDocument}
                    className="flex items-center text-sm font-medium text-white bg-accent-secondary rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Document
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
                            <SortableHeader>Document Name</SortableHeader>
                            <SortableHeader>Building</SortableHeader>
                            <SortableHeader>Unit</SortableHeader>
                            <SortableHeader>Doc Type</SortableHeader>
                            <SortableHeader>Date Uploaded</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ALL_DOCUMENTS_DATA.map((doc: Document) => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                                <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{doc.name}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{doc.building}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{doc.unit}</td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDocumentTypeStyles(doc.type)}`}>
                                        {doc.type}
                                    </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};