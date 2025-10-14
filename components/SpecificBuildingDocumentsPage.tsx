

import React from 'react';
import { Card } from './Card';
import { SPECIFIC_BUILDING_DOCUMENTS_DATA } from '../constants';
import { CategorizedDocument, DocumentItem } from '../types';

interface SpecificBuildingDocumentsPageProps {
    buildingId: string;
}

const DocumentCategoryCard: React.FC<{ categoryData: CategorizedDocument }> = ({ categoryData }) => {
    const { category, icon: Icon, items } = categoryData;

    return (
        <Card>
            <div className="flex items-center mb-4">
                <div className="p-2 bg-pink-100 rounded-lg mr-3">
                    <Icon className="w-5 h-5 text-brand-pink" />
                </div>
                <h3 className="font-atkinson text-lg font-bold text-text-main">{category}</h3>
            </div>
            <div className="space-y-2">
                {items.map((item: DocumentItem, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-text-main font-medium">{item.name}</span>
                        <span className="text-sm text-text-secondary">{item.date}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const SpecificBuildingDocumentsPage: React.FC<SpecificBuildingDocumentsPageProps> = ({ buildingId }) => {
    const documents = SPECIFIC_BUILDING_DOCUMENTS_DATA[buildingId] || [];

    if (documents.length === 0) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl text-text-secondary">No documents found for this building.</h2>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {documents.map((categoryData) => (
                <DocumentCategoryCard key={categoryData.category} categoryData={categoryData} />
            ))}
        </div>
    );
};