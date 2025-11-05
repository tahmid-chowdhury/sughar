import React, { useEffect, useRef } from 'react';import React, { useState, KeyboardEvent, useRef, useEffect, useMemo } from 'react';

import { Document, AppData } from '../types';import { Card } from './Card';

import { useDocumentSharing } from '../hooks/useDocumentSharing';import { Document, Tenant, AppData, RentStatus, TenantRating } from '../types';

import { Card } from './Card';import { X, Check, Search, Filter, ChevronDown, Star, AlertCircle } from './icons';

import { FilterPreset } from '../types/documentSharing';

import { interface DocumentSharingModalProps {

    X,     document: Document;

    Check,     appData: AppData;

    Search,     onClose: () => void;

    Filter,     onUpdateSharing: (documentId: string, sharedWith: string[]) => void;

    ChevronDown, }

    Star, 

    AlertCircle,// Interface for search filters

    ChevronLeft,interface SearchFilters {

    ChevronRight    building: string;

} from './icons';    minRating: TenantRating | 0;

    hasInsurance: boolean;

interface DocumentSharingModalProps {}

    document: Document;

    appData: AppData;// Interface for error state

    onClose: () => void;interface ErrorState {

    onUpdateSharing: (documentId: string, sharedWith: string[]) => void;    message: string;

}    isVisible: boolean;

    type?: 'error' | 'warning' | 'info';

export const DocumentSharingModal: React.FC<DocumentSharingModalProps> = ({}

    document,

    appData,// Interface for search results

    onClose,interface SearchResults {

    onUpdateSharing,    tenants: Tenant[];

}) => {    noResults: boolean;

    // Refs for accessibility and focus management    totalResults: number;

    const modalRef = useRef<HTMLDivElement>(null);}

    const searchInputRef = useRef<HTMLInputElement>(null);

    const filterButtonRef = useRef<HTMLButtonElement>(null);export const DocumentSharingModal: React.FC<DocumentSharingModalProps> = ({

    const lastActiveElementRef = useRef<HTMLElement | null>(null);    document,

    appData,

    // Initialize sharing logic    onClose,

    const sharing = useDocumentSharing({    onUpdateSharing,

        document,}) => {

        tenants: appData.tenants,    // Component state

        initialSelection: document.sharedWith || [],    const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>(document.sharedWith || []);

        pageSize: 10    const [searchQuery, setSearchQuery] = useState('');

    });    const [searchFilters, setSearchFilters] = useState<SearchFilters>({

        building: '',

    // Focus trap effect        minRating: 0,

    useEffect(() => {        hasInsurance: false

        lastActiveElementRef.current = document.activeElement as HTMLElement;    });

        modalRef.current?.focus();    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

        const handleKeyDown = (e: KeyboardEvent) => {    const [error, setError] = useState<ErrorState>({ message: '', isVisible: false });

            if (!modalRef.current || e.key !== 'Tab') return;    

    // Refs for accessibility

            const focusableElements = modalRef.current.querySelectorAll(    const searchInputRef = useRef<HTMLInputElement>(null);

                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'    const filterButtonRef = useRef<HTMLButtonElement>(null);

            );    const modalRef = useRef<HTMLDivElement>(null);

            const firstFocusable = focusableElements[0] as HTMLElement;

            const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;    // Get filtered list of eligible tenants

    const activeTenants = useMemo(() => appData.tenants.filter(tenant => {

            if (e.shiftKey) {        // Basic eligibility checks

                if (document.activeElement === firstFocusable) {        const hasBasicInfo = tenant.unit && tenant.name;

                    e.preventDefault();        if (!hasBasicInfo) return false;

                    lastFocusable.focus();

                }        // Payment and lease status

            } else {        const hasGoodPaymentHistory = tenant.rentStatus === RentStatus.Paid;

                if (document.activeElement === lastFocusable) {        const isLeaseCurrent = tenant.leaseProgress < 90;

                    e.preventDefault();        

                    firstFocusable.focus();        // Additional qualifying criteria

                }        const hasGoodRating = tenant.rating >= 4;

            }        const hasNoRecentIncidents = !tenant.paymentIncidents?.some(

        };            incident => !incident.resolved && 

            new Date(incident.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

        document.addEventListener('keydown', handleKeyDown);        );

        return () => {        

            document.removeEventListener('keydown', handleKeyDown);        // Insurance requirement

            lastActiveElementRef.current?.focus();        const hasRequiredInsurance = tenant.hasInsurance !== false;

        };        

    }, []);        return hasGoodPaymentHistory && 

            isLeaseCurrent && 

    // Handle save action            hasGoodRating && 

    const handleSave = async () => {            hasNoRecentIncidents && 

        try {            hasRequiredInsurance;

            sharing.setError({    }), [appData.tenants]);

                message: '',

                isVisible: false,    // Filter tenants based on search and filters

                type: 'info'    const filteredTenants = useMemo(() => {

            });        return activeTenants.filter(tenant => {

            const searchText = searchQuery.toLowerCase().trim();

            await onUpdateSharing(document.id, sharing.selection.selectedIds);            const matchesSearch = searchText === '' || [

            onClose();                tenant.name,

        } catch (error) {                tenant.unit,

            console.error('Error saving document sharing:', error);                tenant.building

            sharing.setError({            ].some(text => text.toLowerCase().includes(searchText));

                message: 'Failed to save changes. Please try again.',

                isVisible: true,            const matchesFilters = 

                type: 'error',                (!searchFilters.building || tenant.building === searchFilters.building) &&

                context: {                (tenant.rating >= searchFilters.minRating) &&

                    code: 'SAVE_ERROR',                (!searchFilters.hasInsurance || tenant.hasInsurance);

                    action: 'update_sharing',

                    recoverable: true,            return matchesSearch && matchesFilters;

                    suggestions: [        });

                        'Check your network connection',    }, [activeTenants, searchQuery, searchFilters]);

                        'Try again in a few moments',

                        'If the problem persists, contact support'    // Group tenants by building

                    ]    const groupedTenants = useMemo(() => {

                }        return filteredTenants.reduce((acc, tenant) => {

            });            acc[tenant.building] = acc[tenant.building] || [];

        }            acc[tenant.building].push(tenant);

    };            return acc;

        }, {} as Record<string, Tenant[]>);

    return (    }, [filteredTenants]);

        <div 

            ref={modalRef}    // Handlers

            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"    const handleToggleTenant = (tenantId: string) => {

            role="dialog"        setSelectedTenantIds(prev => 

            aria-labelledby="sharing-modal-title"            prev.includes(tenantId)

            aria-modal="true"                ? prev.filter(id => id !== tenantId)

            tabIndex={-1}                : [...prev, tenantId]

        >        );

            <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-xl">    };

                {/* Header */}

                <header className="p-6 pb-4 border-b">    const handleSelectAll = () => {

                    <div className="flex justify-between items-start">        setSelectedTenantIds(filteredTenants.map(t => t.id));

                        <div>    };

                            <h2 

                                id="sharing-modal-title"     const handleDeselectAll = () => {

                                className="text-2xl font-bold text-gray-900 flex items-center gap-3"        setSelectedTenantIds([]);

                            >    };

                                Share Document

                                {document.sharedWith?.length > 0 && (    const handleSave = async () => {

                                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">        try {

                                        Shared with {document.sharedWith.length} tenant{document.sharedWith.length !== 1 ? 's' : ''}            setIsSaving(true);

                                    </span>            setError({ message: '', isVisible: false });

                                )}            await onUpdateSharing(document.id, selectedTenantIds);

                            </h2>            onClose();

                            <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">        } catch (error) {

                                <span className="font-medium">{document.name}</span>            console.error('Error saving document sharing:', error);

                                {document.type && (            setError({

                                    <span className="text-gray-400">• {document.type}</span>                message: 'Failed to save changes. Please try again.',

                                )}                isVisible: true,

                            </div>                type: 'error'

                        </div>            });

                        <button             setIsSaving(false);

                            onClick={onClose}        }

                            className="text-gray-400 hover:text-gray-600 transition p-2 rounded-lg hover:bg-gray-100"    };

                            aria-label="Close dialog"

                        >    // Handle keyboard events for accessibility

                            <X className="w-6 h-6" />    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {

                        </button>        if (e.target instanceof HTMLInputElement) return;

                    </div>

        switch (e.key) {

                    {/* Error message */}            case 'Escape':

                    {sharing.error.isVisible && (                e.preventDefault();

                        <div                 onClose();

                            role="alert"                break;

                            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"            case 'a':

                        >                if (e.metaKey || e.ctrlKey) {

                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />                    e.preventDefault();

                            <div>                    handleSelectAll();

                                <p className="font-medium text-red-800">{sharing.error.message}</p>                }

                                {sharing.error.context?.suggestions && (                break;

                                    <ul className="mt-2 text-sm text-red-700 space-y-1">            case 'Enter':

                                        {sharing.error.context.suggestions.map((suggestion, i) => (                if (e.metaKey || e.ctrlKey) {

                                            <li key={i}>{suggestion}</li>                    e.preventDefault();

                                        ))}                    handleSave();

                                    </ul>                }

                                )}                break;

                            </div>            case '/':

                        </div>                e.preventDefault();

                    )}                searchInputRef.current?.focus();

                </header>                break;

            case 'f':

                {/* Search and Filters */}                if (e.metaKey || e.ctrlKey) {

                <div className="p-6 pb-4 space-y-4">                    e.preventDefault();

                    <div className="flex gap-4">                    setIsFilterVisible(v => !v);

                        <div className="relative flex-1">                    filterButtonRef.current?.focus();

                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />                }

                            <input                break;

                                ref={searchInputRef}        }

                                type="text"    };

                                value={sharing.searchQuery}

                                onChange={e => sharing.setSearchQuery(e.target.value)}    // Focus management

                                placeholder="Search tenants by name, unit, or building..."    useEffect(() => {

                                className="w-full pl-9 pr-4 py-2.5 text-gray-900 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"        if (modalRef.current) {

                                role="searchbox"            modalRef.current.focus();

                                aria-label="Search tenants"        }

                            />        

                            {sharing.searchQuery && (        const handleEscape = (e: KeyboardEvent) => {

                                <button            if (e.key === 'Escape') onClose();

                                    onClick={() => sharing.setSearchQuery('')}        };

                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"        

                                    aria-label="Clear search"        document.addEventListener('keydown', handleEscape);

                                >        return () => document.removeEventListener('keydown', handleEscape);

                                    <X className="w-4 h-4" />    }, [onClose]);

                                </button>

                            )}    return (

                        </div>        <div 

                        <button            ref={modalRef}

                            ref={filterButtonRef}            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"

                            type="button"            onKeyDown={handleKeyDown}

                            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 border rounded-lg hover:bg-gray-50 font-medium"            role="dialog"

                        >            aria-labelledby="sharing-modal-title"

                            <Filter className="w-4 h-4" />            aria-modal="true"

                            <span>Filters</span>            tabIndex={-1}

                            <ChevronDown className="w-4 h-4" />        >

                        </button>            <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col bg-white rounded-lg shadow-xl">

                    </div>                {/* Header */}

                <div className="flex justify-between items-start p-6 pb-4 border-b">

                    {/* Filter presets */}                    <div>

                    <div className="flex gap-2 overflow-x-auto pb-2">                        <div className="flex items-center gap-2">

                        {Object.entries(FilterPreset).map(([key, value]) => (                            <h2 id="sharing-modal-title" className="text-2xl font-bold text-gray-800">

                            <button                                Share Document

                                key={key}                            </h2>

                                onClick={() => sharing.applyPreset(value)}                            {document.sharedWith?.length > 0 && (

                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap                                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">

                                    ${sharing.currentPreset === value                                    Shared with {document.sharedWith.length} tenant{document.sharedWith.length !== 1 ? 's' : ''}

                                        ? 'bg-brand-pink text-white'                                </span>

                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'                            )}

                                    }`}                        </div>

                            >                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">

                                {key.replace(/([A-Z])/g, ' $1').trim()}                            <span>{document.name}</span>

                            </button>                            {document.type && (

                        ))}                                <span className="text-gray-400">• {document.type}</span>

                    </div>                            )}

                        </div>

                    {/* Selection summary */}                    </div>

                    <div className="flex items-center justify-between">                    <button 

                        <div className="flex gap-2">                        onClick={onClose}

                            <button                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"

                                onClick={sharing.handleSelectAll}                        aria-label="Close dialog"

                                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 font-medium"                    >

                            >                        <X className="w-6 h-6" />

                                Select All                    </button>

                            </button>                </div>

                            <button

                                onClick={sharing.handleDeselectAll}                {/* Error message */}

                                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 font-medium"                {error.isVisible && (

                            >                    <div 

                                Clear                        role="alert"

                            </button>                        className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"

                        </div>                    >

                        <div className="text-sm text-gray-600">                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />

                            {sharing.selection.selectedIds.length} of {sharing.results.totalResults} selected                        <p className="text-sm text-red-700">{error.message}</p>

                            {sharing.selection.hasChanges && (                    </div>

                                <span className="ml-2 text-brand-pink">                )}

                                    • Changes not saved

                                </span>                {/* Search and filters */}

                            )}                <div className="p-6 pb-4 space-y-4">

                        </div>                    <div className="flex gap-4">

                    </div>                        <div className="relative flex-1">

                </div>                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                            <input

                {/* Tenant List */}                                ref={searchInputRef}

                <div className="flex-1 px-6 overflow-y-auto">                                type="text"

                    {sharing.results.totalResults === 0 ? (                                value={searchQuery}

                        <div className="text-center py-12">                                onChange={(e) => setSearchQuery(e.target.value)}

                            <p className="text-gray-500">                                placeholder="Search tenants by name, unit, or building..."

                                {sharing.searchQuery                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-pink focus:border-transparent"

                                    ? 'No tenants match your search'                                role="searchbox"

                                    : 'No eligible tenants found'                                aria-label="Search tenants (press / to focus)"

                                }                                aria-controls="tenant-list"

                            </p>                            />

                            {(sharing.searchQuery || sharing.currentPreset) && (                        </div>

                                <button                        <button

                                    onClick={() => {                            ref={filterButtonRef}

                                        sharing.setSearchQuery('');                            onClick={() => setIsFilterVisible(v => !v)}

                                        sharing.resetFilters();                            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"

                                    }}                            aria-expanded={isFilterVisible}

                                    className="mt-2 text-sm text-brand-pink hover:text-pink-700"                            aria-controls="filter-panel"

                                >                        >

                                    Clear all filters                            <Filter className="w-4 h-4" />

                                </button>                            <span className="text-sm">Filters</span>

                            )}                            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterVisible ? 'rotate-180' : ''}`} />

                        </div>                        </button>

                    ) : (                    </div>

                        <div className="border rounded-lg divide-y">

                            {sharing.results.tenants.map(tenantId => {                    {/* Filter panel */}

                                const tenant = appData.tenants.find(t => t.id === tenantId)!;                    {isFilterVisible && (

                                const isSelected = sharing.selection.selectedIds.includes(tenantId);                        <div id="filter-panel" className="p-4 border rounded-lg space-y-4">

                            <div>

                                return (                                <label className="block text-sm font-medium text-gray-700 mb-1">

                                    <button                                    Building

                                        key={tenant.id}                                </label>

                                        onClick={() => sharing.handleSelect(tenant.id)}                                <select

                                        className={`w-full flex items-center gap-4 p-4 text-left transition-colors                                    value={searchFilters.building}

                                            ${isSelected ? 'bg-pink-50' : 'hover:bg-gray-50'}`}                                    onChange={(e) => setSearchFilters(f => ({ ...f, building: e.target.value }))}

                                        role="checkbox"                                    className="w-full border rounded-lg text-sm p-2"

                                        aria-checked={isSelected}                                >

                                    >                                    <option value="">All Buildings</option>

                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center                                    {Array.from(new Set(activeTenants.map(t => t.building))).map(building => (

                                            ${isSelected ? 'bg-brand-pink border-brand-pink' : 'border-gray-300'}`}                                        <option key={building} value={building}>{building}</option>

                                        >                                    ))}

                                            {isSelected && <Check className="w-3 h-3 text-white" />}                                </select>

                                        </div>                            </div>

                            <div>

                                        <img                                 <label className="block text-sm font-medium text-gray-700 mb-1">

                                            src={tenant.avatarUrl}                                     Minimum Rating

                                            alt=""                                </label>

                                            className="w-10 h-10 rounded-full object-cover"                                <div className="flex items-center gap-2">

                                            loading="lazy"                                    {[0, ...Array.from({ length: 5 }, (_, i) => i + 1)].map(rating => (

                                        />                                        <button

                                            key={rating}

                                        <div className="flex-1 min-w-0">                                            onClick={() => setSearchFilters(f => ({ ...f, minRating: rating as TenantRating | 0 }))}

                                            <div className="font-medium text-gray-900">{tenant.name}</div>                                            className={`p-2 rounded ${

                                            <div className="text-sm text-gray-500">                                                searchFilters.minRating === rating

                                                {tenant.building} • Unit {tenant.unit}                                                    ? 'bg-brand-pink text-white'

                                            </div>                                                    : 'hover:bg-gray-100'

                                        </div>                                            }`}

                                            aria-pressed={searchFilters.minRating === rating}

                                        <div className="flex items-center gap-4">                                        >

                                            <div className="flex items-center gap-1" title={`${tenant.rating} out of 5`}>                                            {rating === 0 ? 'Any' : (

                                                <Star className="w-4 h-4 text-yellow-400" />                                                <div className="flex items-center gap-1">

                                                <span className="text-sm font-medium text-gray-700">                                                    <Star className="w-4 h-4" />

                                                    {tenant.rating}                                                    <span>{rating}+</span>

                                                </span>                                                </div>

                                            </div>                                            )}

                                        </div>                                        </button>

                                    </button>                                    ))}

                                );                                </div>

                            })}                            </div>

                        </div>                            <div className="flex items-center justify-between">

                    )}                                <label className="text-sm font-medium text-gray-700">

                </div>                                    Require Insurance

                                </label>

                {/* Footer */}                                <button

                <footer className="p-6 pt-4 border-t flex items-center justify-between">                                    onClick={() => setSearchFilters(f => ({ ...f, hasInsurance: !f.hasInsurance }))}

                    {/* Pagination */}                                    className={`w-11 h-6 rounded-full transition-colors relative ${

                    <div className="flex items-center gap-2">                                        searchFilters.hasInsurance ? 'bg-brand-pink' : 'bg-gray-200'

                        <button                                    }`}

                            onClick={() => sharing.setPage(p => Math.max(1, p - 1))}                                    role="switch"

                            disabled={sharing.results.currentPage === 1}                                    aria-checked={searchFilters.hasInsurance}

                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"                                >

                            aria-label="Previous page"                                    <span 

                        >                                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${

                            <ChevronLeft className="w-5 h-5" />                                            searchFilters.hasInsurance ? 'translate-x-5' : ''

                        </button>                                        }`} 

                        <span className="text-sm text-gray-600">                                    />

                            Page {sharing.results.currentPage} of {sharing.results.pageCount}                                </button>

                        </span>                            </div>

                        <button                        </div>

                            onClick={() => sharing.setPage(p => p + 1)}                    )}

                            disabled={!sharing.results.hasMore}

                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"                    {/* Quick actions and stats */}

                            aria-label="Next page"                    <div className="flex items-center justify-between">

                        >                        <div className="flex gap-2">

                            <ChevronRight className="w-5 h-5" />                            <button

                        </button>                                onClick={handleSelectAll}

                    </div>                                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"

                                aria-label={`Select all ${filteredTenants.length} tenants`}

                    {/* Action buttons */}                            >

                    <div className="flex gap-3">                                Select All

                        <button                            </button>

                            onClick={onClose}                            <button

                            className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 font-medium"                                onClick={handleDeselectAll}

                        >                                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"

                            Cancel                                aria-label="Deselect all tenants"

                        </button>                            >

                        <button                                Deselect All

                            onClick={handleSave}                            </button>

                            disabled={!sharing.selection.hasChanges}                        </div>

                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2                        <div className="text-sm text-gray-600">

                                ${sharing.selection.hasChanges                            <span>

                                    ? 'bg-brand-pink text-white hover:bg-pink-600'                                {selectedTenantIds.length} of {filteredTenants.length} selected

                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'                            </span>

                                }`}                            {document.sharedWith && (

                        >                                <div className="text-xs text-gray-500 mt-1">

                            Save Changes                                    {selectedTenantIds.length > document.sharedWith.length

                        </button>                                        ? `Adding ${selectedTenantIds.length - document.sharedWith.length} new tenants`

                    </div>                                        : selectedTenantIds.length < document.sharedWith.length

                </footer>                                            ? `Removing ${document.sharedWith.length - selectedTenantIds.length} tenants`

            </Card>                                            : 'No changes'

        </div>                                    }

    );                                </div>

};                            )}
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

                                                    <img 
                                                        src={tenant.avatar} 
                                                        alt=""
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />

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