import React, { useState, KeyboardEvent, useRef, useEffect, useMemo } from 'react';
import { Card } from './Card';
import { Document, Tenant, AppData, RentStatus, TenantRating } from '../types';
import { X, Check, Search, Filter, ChevronDown, Star } from './icons';

interface DocumentSharingModalProps {
    document: Document;
    appData: AppData;
    onClose: () => void;
    onUpdateSharing: (documentId: string, sharedWith: string[]) => void;
}

// Filter options type
interface SearchFilters {
    building: string;
    minRating: TenantRating | 0;
    hasInsurance: boolean;
}

// Error state type
interface ErrorState {
    message: string;
    isVisible: boolean;
}

export const DocumentSharingModal: React.FC<DocumentSharingModalProps> = ({
    document,
    appData,
    onClose,
    onUpdateSharing,
}) => {
    // Component state
    const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>(document.sharedWith || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilters, setSearchFilters] = useState({
        building: '',
        minRating: 0,
        hasInsurance: false
    });
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Refs for accessibility
    const searchInputRef = useRef<HTMLInputElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    // Enhanced search function
    const getFilteredTenants = (tenants: typeof activeTenants) => {
        return tenants.filter(tenant => {
            // Basic text search
            const searchText = searchQuery.toLowerCase();
            const matchesSearch = 
                tenant.name.toLowerCase().includes(searchText) ||
                tenant.unit.toLowerCase().includes(searchText) ||
                tenant.building.toLowerCase().includes(searchText);
            
            // Additional filters
            const matchesBuilding = !searchFilters.building || tenant.building === searchFilters.building;
            const matchesRating = tenant.rating >= searchFilters.minRating;
            const matchesInsurance = !searchFilters.hasInsurance || tenant.hasInsurance;
            
            return matchesSearch && matchesBuilding && matchesRating && matchesInsurance;
        });
    };

    // Update search results when query or filters change
    useEffect(() => {
        const filteredResults = getFilteredTenants(activeTenants);
        setSearchResults({
            query: searchQuery,
            results: filteredResults,
            noResults: filteredResults.length === 0
        });
    }, [searchQuery, searchFilters, activeTenants]);

    const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>(document.sharedWith || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilters, setSearchFilters] = useState({
        building: '',
        minRating: 0,
        hasInsurance: false
    });
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Enhanced tenant filtering with comprehensive criteria
    const activeTenants = useMemo(() => appData.tenants.filter(tenant => {
        // Basic eligibility checks
        const hasBasicInfo = tenant.unit && tenant.name;
        if (!hasBasicInfo) return false;

        // Payment and lease status
        const hasGoodPaymentHistory = tenant.rentStatus === RentStatus.Paid;
        const isLeaseCurrent = tenant.leaseProgress < 90;
        
        // Additional qualifying criteria
        const hasGoodRating = tenant.rating >= 4; // Only include tenants with good ratings (4 or 5)
        const hasNoRecentIncidents = !tenant.paymentIncidents?.some(
            incident => !incident.resolved && 
            new Date(incident.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
        );
        
        // Insurance requirement
        const hasRequiredInsurance = tenant.hasInsurance !== false; // Undefined or true is acceptable
        
        // Overall standing calculation
        const hasGoodStanding = 
            hasGoodPaymentHistory && 
            isLeaseCurrent && 
            hasGoodRating && 
            hasNoRecentIncidents && 
            hasRequiredInsurance;
        
        return hasGoodStanding;
    }), [appData.tenants]);

    // Enhanced search function with filters
    const filteredTenants = useMemo(() => {
        return activeTenants.filter(tenant => {
            // Basic text search
            const searchText = searchQuery.toLowerCase();
            const matchesSearch = 
                tenant.name.toLowerCase().includes(searchText) ||
                tenant.unit.toLowerCase().includes(searchText) ||
                tenant.building.toLowerCase().includes(searchText);
            
            // Additional filters
            const matchesBuilding = !searchFilters.building || tenant.building === searchFilters.building;
            const matchesRating = tenant.rating >= searchFilters.minRating;
            const matchesInsurance = !searchFilters.hasInsurance || tenant.hasInsurance;
            
            return matchesSearch && matchesBuilding && matchesRating && matchesInsurance;
        });
    }, [activeTenants, searchQuery, searchFilters]);

    const handleToggleTenant = (tenantId: string) => {
        setSelectedTenantIds(prev => 
            prev.includes(tenantId)
                ? prev.filter(id => id !== tenantId)
                : [...prev, tenantId]
        );
    };

    const handleSelectAll = () => {
        setSelectedTenantIds(activeTenants.map(t => t.id));
    };

    const handleDeselectAll = () => {
        setSelectedTenantIds([]);
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await onUpdateSharing(document.id, selectedTenantIds);
            onClose();
        } catch (error) {
            console.error('Error saving document sharing:', error);
            // Reset saving state on error
            setIsSaving(false);
        }
    };

    // Handle keyboard events for accessibility
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        // Block keyboard events when the search input is focused
        if (e.target instanceof HTMLInputElement) {
            return;
        }

        // Handle global keyboard shortcuts
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
            e.preventDefault();
            handleSelectAll();
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === '/') {
            // Quick access to search
            e.preventDefault();
            searchInputRef.current?.focus();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-labelledby="sharing-modal-title"
            aria-modal="true"
            tabIndex={-1}
        >
            <Card 
                className="w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col bg-white rounded-lg shadow-xl"
                aria-describedby="sharing-modal-description">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 pb-4 border-b">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 id="sharing-modal-title" className="text-2xl font-bold text-gray-800">Share Document</h2>
                            {document.sharedWith && document.sharedWith.length > 0 && (
                                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full" role="status">
                                    Shared with {document.sharedWith.length} tenant{document.sharedWith.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        <div id="sharing-modal-description" className="flex items-center gap-2 mt-2">
                            <p className="text-sm text-gray-600">{document.name}</p>
                            <span className="text-xs text-gray-400">
                                {document.type && `• ${document.type}`}
                            </span>
                        </div>
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
                        aria-label={`Select all ${activeTenants.length} tenants`}
                        title={`Select all ${activeTenants.length} tenants (Ctrl+A)`}
                    >
                        Select All
                    </button>
                    <button
                        onClick={handleDeselectAll}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                        aria-label="Deselect all tenants"
                        title="Clear all selections"
                    >
                        Deselect All
                    </button>
                    {/* Only show Unshare when document is currently shared */}
                    {document.sharedWith && document.sharedWith.length > 0 && (
                        <button
                            onClick={() => {
                                onUpdateSharing(document.id, []); // Remove all sharing
                                onClose();
                            }}
                            className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                        >
                            Unshare Document
                        </button>
                    )}
                    <div className="flex-1"></div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600">
                                {selectedTenantIds.length} of {activeTenants.length} selected
                            </div>
                            {document.sharedWith && (
                                <div className="text-xs text-gray-500 mt-1">
                                    {selectedTenantIds.length > (document.sharedWith?.length || 0)
                                        ? `Adding ${selectedTenantIds.length - (document.sharedWith?.length || 0)} new tenants`
                                        : selectedTenantIds.length < (document.sharedWith?.length || 0)
                                            ? `Removing ${(document.sharedWith?.length || 0) - selectedTenantIds.length} tenants`
                                            : 'No changes'
                                    }
                                </div>
                            )}
                        </div>
                    </div>                {/* Tenant List */}
                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tenants by name..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
                        role="searchbox"
                        aria-label="Search tenants (press / to focus)"
                        aria-controls="tenant-list"
                    />
                </div>

                <div id="tenant-list" className="flex-1 overflow-y-auto mb-6 border rounded-lg" role="region" aria-label="Tenant list">
                    <div className="divide-y">
                        {activeTenants.length === 0 ? (
                            <div className="text-center py-12 space-y-2" role="status">
                                <p className="text-gray-500">
                                    {searchQuery 
                                        ? `No tenants found matching "${searchQuery}"`
                                        : 'No tenants available'
                                    }
                                </p>
                                {searchQuery && (
                                    <button 
                                        onClick={() => {
                                            setSearchQuery('');
                                            searchInputRef.current?.focus();
                                        }}
                                        className="text-sm text-brand-pink hover:text-pink-700"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        ) : (
                            // Group tenants by building
                            <>
                                {Object.entries(activeTenants.reduce((acc, tenant) => {
                                    acc[tenant.building] = acc[tenant.building] || [];
                                    // Normalize search terms for better matching
                                    const searchTerm = searchQuery.toLowerCase().trim();
                                    const searchTargets = [
                                        tenant.name.toLowerCase(),
                                        tenant.unit.toLowerCase(),
                                        tenant.building.toLowerCase()
                                    ];
                                    if (searchTerm === '' || searchTargets.some(target => target.includes(searchTerm))) {
                                        acc[tenant.building].push(tenant);
                                    }
                                    return acc;
                                }, {} as Record<string, typeof activeTenants>))
                                .map(([building, buildingTenants]) => buildingTenants.length > 0 ? (
                                    <div key={building} className="divide-y">
                                        <div 
                                            className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700"
                                            role="region"
                                            aria-labelledby={`building-${building.replace(/\s+/g, '-')}-header`}
                                        >
                                            <h3 id={`building-${building.replace(/\s+/g, '-')}-header`}>
                                                {building} ({buildingTenants.length} tenants)
                                            </h3>
                                        </div>
                                        <div className="divide-y">
                                            {buildingTenants.map(tenant => {
                                                const isSelected = selectedTenantIds.includes(tenant.id);
                                                
                                                return (
                                                    <button
                                                        key={tenant.id}
                                                        onClick={() => handleToggleTenant(tenant.id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === ' ') {
                                                                e.preventDefault();
                                                                handleToggleTenant(tenant.id);
                                                            }
                                                        }}
                                                        className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                                                            isSelected ? 'bg-pink-50' : ''
                                                        }`}
                                                        role="checkbox"
                                                        aria-checked={isSelected}
                                                        aria-label={`Select ${tenant.name} from ${tenant.building} Unit ${tenant.unit}`}
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
                                                                Unit {tenant.unit}
                                                            </p>
                                                            <div className="text-xs text-gray-500">
                                                                {tenant.rentStatus === RentStatus.Paid ? '✓ ' : ''}Rent Status: {tenant.rentStatus}
                                                            </div>
                                                        </div>

                                                        {/* Rating */}
                                                        <div className="flex items-center gap-1" title={`Tenant Rating: ${tenant.rating} out of 5`}>
                                                            <span className="text-yellow-500" aria-hidden="true">★</span>
                                                            <span className="text-sm font-medium text-gray-700" role="text" aria-label={`Rating: ${tenant.rating} out of 5`}>
                                                                {tenant.rating}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : null)}
                            </>
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
                        disabled={isSaving}
                        className={`flex-1 px-4 py-2.5 bg-brand-pink text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2
                            ${isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-pink-600'}`}
                        aria-label={`Save changes to document sharing for ${document.name}`}
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </Card>
        </div>
    );
};
