import React, { useState } from 'react';
import { Card } from './Card';
import { Document, Tenant, AppData } from '../types';
import { X, Check } from './icons';

interface DocumentSharingModalProps {
    document: Document;
    appData: AppData;
    onClose: () => void;
    onUpdateSharing: (documentId: string, sharedWith: string[]) => void;
}

export const DocumentSharingModal: React.FC<DocumentSharingModalProps> = ({
    document,
    appData,
    onClose,
    onUpdateSharing,
}) => {
    const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>(document.sharedWith || []);

    // Get all tenants
    const allTenants = appData.tenants;

    const handleToggleTenant = (tenantId: string) => {
        setSelectedTenantIds(prev => 
            prev.includes(tenantId)
                ? prev.filter(id => id !== tenantId)
                : [...prev, tenantId]
        );
    };

    const handleSelectAll = () => {
        setSelectedTenantIds(allTenants.map(t => t.id));
    };

    const handleDeselectAll = () => {
        setSelectedTenantIds([]);
    };

    const handleSave = () => {
        onUpdateSharing(document.id, selectedTenantIds);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 pb-4 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Share Document</h2>
                        <p className="text-sm text-gray-600 mt-1">{document.name}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={handleSelectAll}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                        Select All
                    </button>
                    <button
                        onClick={handleDeselectAll}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Deselect All
                    </button>
                    <div className="flex-1"></div>
                    <span className="text-sm text-gray-600 py-1.5">
                        {selectedTenantIds.length} of {allTenants.length} selected
                    </span>
                </div>

                {/* Tenant List */}
                <div className="flex-1 overflow-y-auto mb-6 border rounded-lg">
                    <div className="divide-y">
                        {allTenants.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No tenants available
                            </div>
                        ) : (
                            allTenants.map(tenant => {
                                const isSelected = selectedTenantIds.includes(tenant.id);
                                
                                return (
                                    <button
                                        key={tenant.id}
                                        onClick={() => handleToggleTenant(tenant.id)}
                                        className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                                            isSelected ? 'bg-pink-50' : ''
                                        }`}
                                    >
                                        {/* Checkbox */}
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                            isSelected 
                                                ? 'bg-brand-pink border-brand-pink' 
                                                : 'border-gray-300'
                                        }`}>
                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                        </div>

                                        {/* Avatar */}
                                        <img 
                                            src={tenant.avatar} 
                                            alt={tenant.name} 
                                            className="w-12 h-12 rounded-full object-cover"
                                        />

                                        {/* Info */}
                                        <div className="flex-1 text-left">
                                            <h4 className="font-semibold text-gray-800">{tenant.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                {tenant.building} - Unit {tenant.unit}
                                            </p>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500">★</span>
                                            <span className="text-sm font-medium text-gray-700">{tenant.rating}</span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2.5 bg-brand-pink text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                    >
                        Save Changes
                    </button>
                </div>
            </Card>
        </div>
    );
};
