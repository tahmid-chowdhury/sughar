import React, { useState, KeyboardEvent, useRef, useEffect, useMemo } from 'react';
import { Document, Tenant, AppData, RentStatus, TenantRating, TenantProfile } from '../types';
import { Card } from './Card';
import { X, Check, Search, Filter, ChevronDown, Star, AlertCircle } from './icons';
import { useDocumentSharing } from '../hooks/useDocumentSharing';

interface SearchFilters {
    building: string;
    minRating: TenantRating | 0;
    hasInsurance: boolean;
}

interface ErrorState {
    message: string;
    isVisible: boolean;
    type?: 'error' | 'warning' | 'info';
}

interface SearchResults {
    tenants: Tenant[];
    noResults: boolean;
    totalResults: number;
    currentPage: number;
    pageCount: number;
    hasMore: boolean;
}

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
    // Refs for accessibility and focus management
    const modalRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const lastActiveElementRef = useRef<HTMLElement | null>(null);

    // Component state
    const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>(document.sharedWith || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilters, setSearchFilters] = useState<SearchFilters>({
        building: '',
        minRating: 0,
        hasInsurance: false
    });
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<ErrorState>({ message: '', isVisible: false });

    // Initialize sharing logic
    const sharing = useDocumentSharing({
        document,
        tenants: appData.tenants,
        initialSelection: document.sharedWith || [],
        pageSize: 10
    });

    // Get filtered list of eligible tenants
    const activeTenants = useMemo(() => appData.tenants.filter(tenant => {
        // Basic eligibility checks
        const hasBasicInfo = tenant.unit && tenant.name;
        if (!hasBasicInfo) return false;

        // Payment and lease status
        const hasGoodPaymentHistory = tenant.rentStatus === RentStatus.Paid;
        const isLeaseCurrent = tenant.leaseProgress < 90;

        // Additional qualifying criteria
        const hasGoodRating = tenant.rating >= 4;
        const hasNoRecentIncidents = !tenant.paymentIncidents?.some(
            incident => !incident.resolved && 
                new Date(incident.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        );

        // Insurance requirement
        const hasRequiredInsurance = tenant.hasInsurance !== false;

        return hasGoodPaymentHistory && 
            isLeaseCurrent && 
            hasGoodRating && 
            hasNoRecentIncidents && 
            hasRequiredInsurance;
    }), [appData.tenants]);

    // Filter tenants based on search and filters
    const filteredTenants = useMemo(() => {
        return activeTenants.filter(tenant => {
            const searchText = searchQuery.toLowerCase().trim();
            const matchesSearch = searchText === '' || [
                tenant.name,
                tenant.unit,
                tenant.building
            ].some(text => text?.toLowerCase().includes(searchText));

            const matchesFilters = 
                (!searchFilters.building || tenant.building === searchFilters.building) &&
                (tenant.rating >= searchFilters.minRating) &&
                (!searchFilters.hasInsurance || tenant.hasInsurance);

            return matchesSearch && matchesFilters;
        });
    }, [activeTenants, searchQuery, searchFilters]);

    // Group tenants by building
    const groupedTenants = useMemo(() => {
        return filteredTenants.reduce((acc, tenant) => {
            acc[tenant.building] = acc[tenant.building] || [];
            acc[tenant.building].push(tenant);
            return acc;
        }, {} as Record<string, Tenant[]>);
    }, [filteredTenants]);

    // Handle tenant selection
    const handleToggleTenant = (tenantId: string) => {
        setSelectedTenantIds(prev =>
            prev.includes(tenantId)
                ? prev.filter(id => id !== tenantId)
                : [...prev, tenantId]
        );
    };

    const handleSelectAll = () => {
        setSelectedTenantIds(filteredTenants.map(t => t.id));
    };

    const handleDeselectAll = () => {
        setSelectedTenantIds([]);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError({ message: '', isVisible: false });
            await onUpdateSharing(document.id, selectedTenantIds);
            onClose();
        } catch (error) {
            console.error('Error saving document sharing:', error);
            setError({
                message: 'Failed to save changes. Please try again.',
                isVisible: true,
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle keyboard events for accessibility
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLInputElement) return;

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
                
            case 'a':
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    handleSelectAll();
                }
                break;

            case 'Enter':
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    handleSave();
                }
                break;

            case '/':
                e.preventDefault();
                searchInputRef.current?.focus();
                break;

            case 'f':
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    setIsFilterVisible(v => !v);
                    filterButtonRef.current?.focus();
                }
                break;
        }
    };

    // Focus management
    // Store and restore focus
    useEffect(() => {
        const doc = window.document;
        if (!doc.body.contains(doc.activeElement)) {
            modalRef.current?.focus();
        }
        
        const previouslyFocused = doc.activeElement as HTMLElement;
        lastActiveElementRef.current = previouslyFocused;

        return () => {
            if (previouslyFocused && doc.body.contains(previouslyFocused)) {
                previouslyFocused.focus();
            }
        };
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (event: globalThis.KeyboardEvent): void => {
            if (event.key === 'Escape') onClose();
        };
        
        const doc = window.document;
        const handler = handleEscape as EventListener;
        doc.addEventListener('keydown', handler);
        return () => doc.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div 
            ref={modalRef}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-labelledby="sharing-modal-title"
            aria-modal="true"
            tabIndex={-1}
        >
            <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-start p-6 pb-4 border-b">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 id="sharing-modal-title" className="text-2xl font-bold text-gray-800">
                                Share Document
                            </h2>
                            {document.sharedWith?.length > 0 && (
                                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    Shared with {document.sharedWith.length} tenant{document.sharedWith.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <span>{document.name}</span>
                            {document.type && (
                                <span className="text-gray-400">• {document.type}</span>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                        aria-label="Close dialog"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Error message */}
                {error.isVisible && (
                    <div 
                        role="alert"
                        className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-700">{error.message}</p>
                    </div>
                )}

                {/* Search and filters */}
                <div className="p-6 pb-4 space-y-4">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tenants by name, unit, or building..."
                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                role="searchbox"
                                aria-label="Search tenants (press / to focus)"
                                aria-controls="tenant-list"
                            />
                        </div>
                        <button
                            ref={filterButtonRef}
                            onClick={() => setIsFilterVisible(v => !v)}
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                            aria-expanded={isFilterVisible}
                            aria-controls="filter-panel"
                        >
                            <Filter className="w-4 h-4" />
                            <span className="text-sm">Filters</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterVisible ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Filter panel */}
                    {isFilterVisible && (
                        <div id="filter-panel" className="p-4 border rounded-lg space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Building
                                </label>
                                <select
                                    value={searchFilters.building}
                                    onChange={(e) => setSearchFilters(f => ({ ...f, building: e.target.value }))}
                                    className="w-full border rounded-lg text-sm p-2"
                                >
                                    <option value="">All Buildings</option>
                                    {Array.from(new Set(activeTenants.map(t => t.building))).map(building => (
                                        <option key={building} value={building}>{building}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Minimum Rating
                                </label>
                                <div className="flex items-center gap-2">
                                    {[0, ...Array.from({ length: 5 }, (_, i) => i + 1)].map(rating => (
                                        <button
                                            key={rating}
                                            onClick={() => setSearchFilters(f => ({ ...f, minRating: rating as TenantRating | 0 }))}
                                            className={`p-2 rounded ${
                                                searchFilters.minRating === rating
                                                    ? 'bg-brand-pink text-white'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                            aria-pressed={searchFilters.minRating === rating}
                                        >
                                            {rating === 0 ? 'Any' : (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4" />
                                                    <span>{rating}+</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">
                                    Require Insurance
                                </label>
                                <button
                                    onClick={() => setSearchFilters(f => ({ ...f, hasInsurance: !f.hasInsurance }))}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${
                                        searchFilters.hasInsurance ? 'bg-brand-pink' : 'bg-gray-200'
                                    }`}
                                    role="switch"
                                    aria-checked={searchFilters.hasInsurance}
                                >
                                    <span 
                                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                            searchFilters.hasInsurance ? 'translate-x-5' : ''
                                        }`} 
                                    />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Quick actions and stats */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={handleSelectAll}
                                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                                aria-label={`Select all ${filteredTenants.length} tenants`}
                            >
                                Select All
                            </button>
                            <button
                                onClick={handleDeselectAll}
                                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                                aria-label="Deselect all tenants"
                            >
                                Deselect All
                            </button>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span>
                                {selectedTenantIds.length} of {filteredTenants.length} selected
                            </span>
                            {document.sharedWith && (
                                <div className="text-xs text-gray-500 mt-1">
                                    {selectedTenantIds.length > document.sharedWith.length
                                        ? `Adding ${selectedTenantIds.length - document.sharedWith.length} new tenants`
                                        : selectedTenantIds.length < document.sharedWith.length
                                            ? `Removing ${document.sharedWith.length - selectedTenantIds.length} tenants`
                                            : 'No changes'
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tenant list */}
                <div className="flex-1 overflow-y-auto px-6">
                    <div className="border rounded-lg divide-y">
                        {filteredTenants.length === 0 ? (
                            <div className="py-12 text-center" role="status">
                                <p className="text-gray-500">
                                    {searchQuery || Object.values(searchFilters).some(Boolean)
                                        ? 'No tenants match your search criteria'
                                        : 'No eligible tenants found'
                                    }
                                </p>
                                {(searchQuery || Object.values(searchFilters).some(Boolean)) && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSearchFilters({
                                                building: '',
                                                minRating: 0,
                                                hasInsurance: false
                                            });
                                        }}
                                        className="mt-2 text-sm text-brand-pink hover:text-pink-700"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            Object.entries(groupedTenants).map(([building, tenants]) => (
                                <div key={building}>
                                    <div className="bg-gray-50 px-4 py-2">
                                        <h3 className="font-medium text-sm text-gray-700">
                                            {building} ({tenants.length} tenant{tenants.length !== 1 ? 's' : ''})
                                        </h3>
                                    </div>
                                    <div className="divide-y">
                                        {tenants.map(tenant => {
                                            const isSelected = selectedTenantIds.includes(tenant.id);
                                            return (
                                                <button
                                                    key={tenant.id}
                                                    onClick={() => handleToggleTenant(tenant.id)}
                                                    className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 ${
                                                        isSelected ? 'bg-pink-50' : ''
                                                    }`}
                                                    role="checkbox"
                                                    aria-checked={isSelected}
                                                    aria-label={`Select ${tenant.name} from ${tenant.building} Unit ${tenant.unit}`}
                                                >
                                                    <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                                                        isSelected 
                                                            ? 'bg-brand-pink border-brand-pink' 
                                                            : 'border-gray-300'
                                                    }`}>
                                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                                    </div>

                                                    {(tenant as TenantProfile).avatar && (
                                                        <img 
                                                            src={(tenant as TenantProfile).avatar} 
                                                            alt=""
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    )}

                                                    <div className="flex-1 text-left min-w-0">
                                                        <div className="font-medium text-gray-900">{tenant.name}</div>
                                                        <div className="text-sm text-gray-500">Unit {tenant.unit}</div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-400" />
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {tenant.rating}
                                                            </span>
                                                        </div>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            tenant.rentStatus === RentStatus.Paid
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {tenant.rentStatus}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-4 py-2 bg-brand-pink text-white rounded-lg flex items-center gap-2
                            ${isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-pink-600'}`}
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle 
                                        className="opacity-25" 
                                        cx="12" 
                                        cy="12" 
                                        r="10" 
                                        stroke="currentColor" 
                                        strokeWidth="4" 
                                        fill="none"
                                    />
                                    <path 
                                        className="opacity-75" 
                                        fill="currentColor" 
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Saving...</span>
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

export default DocumentSharingModal;