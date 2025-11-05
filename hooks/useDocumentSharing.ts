import { useCallback, useMemo, useState } from 'react';
import { Document, Tenant, RentStatus } from '../types';
import {
    AdvancedFilters,
    SearchResults,
    FilterPreset,
    SearchOperator,
    ErrorState,
    SelectionState
} from '../types/documentSharing';

// Default filters for presets
const PRESET_FILTERS: Record<FilterPreset, Partial<AdvancedFilters>> = {
    [FilterPreset.AllTenants]: {},
    [FilterPreset.GoodStanding]: {
        minRating: 4,
        hasInsurance: true,
        paymentHistoryMonths: 6
    },
    [FilterPreset.RecentlyActive]: {
        activeServiceRequests: true,
        includeEndingSoon: false
    },
    [FilterPreset.LongTermTenants]: {
        leaseMinDuration: 12,
        minRating: 3
    },
    [FilterPreset.PerfectPayment]: {
        minRating: 5,
        paymentHistoryMonths: 12
    }
};

interface UseDocumentSharingProps {
    document: Document;
    tenants: Tenant[];
    initialSelection?: string[];
    pageSize?: number;
}

export const useDocumentSharing = ({
    document,
    tenants,
    initialSelection = [],
    pageSize = 10
}: UseDocumentSharingProps) => {
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPreset, setCurrentPreset] = useState<FilterPreset>();
    const [filters, setFilters] = useState<AdvancedFilters>({
        building: '',
        minRating: 0,
        hasInsurance: false,
        leaseMinDuration: 0,
        paymentHistoryMonths: 0,
        activeServiceRequests: false,
        includeEndingSoon: true
    });
    const [error, setError] = useState<ErrorState>({
        message: '',
        isVisible: false,
        type: 'info'
    });
    const [selection, setSelection] = useState<SelectionState>({
        selectedIds: initialSelection,
        previousSelection: initialSelection,
        lastModified: Date.now(),
        hasChanges: false
    });
    const [page, setPage] = useState(1);

    // Filter tenants based on current criteria
    const filteredTenants = useMemo(() => {
        const filtered = tenants.filter(tenant => {
            // Basic eligibility
            if (!tenant.unit || !tenant.name) return false;

            // Apply current filters
            const matchesFilters = 
                (!filters.building || tenant.building === filters.building) &&
                (tenant.rating >= filters.minRating) &&
                (!filters.hasInsurance || tenant.hasInsurance) &&
                (!filters.leaseMinDuration || tenant.leaseProgress <= (100 - (filters.leaseMinDuration * 100 / 12))) &&
                (!filters.activeServiceRequests || tenant.requests > 0);

            // Apply search
            if (!searchQuery) return matchesFilters;

            const searchText = searchQuery.toLowerCase();
            return matchesFilters && (
                tenant.name.toLowerCase().includes(searchText) ||
                tenant.unit.toLowerCase().includes(searchText) ||
                tenant.building.toLowerCase().includes(searchText)
            );
        });

        // Sort by relevance if searching
        if (searchQuery) {
            filtered.sort((a, b) => {
                const aMatch = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
                const bMatch = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
                return 0;
            });
        }

        return filtered;
    }, [tenants, filters, searchQuery]);

    // Calculate pagination
    const paginatedResults = useMemo<SearchResults>(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const pageResults = filteredTenants.slice(start, end);

        return {
            tenants: pageResults.map(t => t.id),
            totalResults: filteredTenants.length,
            pageCount: Math.ceil(filteredTenants.length / pageSize),
            currentPage: page,
            hasMore: end < filteredTenants.length
        };
    }, [filteredTenants, page, pageSize]);

    // Selection handlers
    const handleSelect = useCallback((tenantId: string) => {
        setSelection(prev => {
            const newSelected = prev.selectedIds.includes(tenantId)
                ? prev.selectedIds.filter(id => id !== tenantId)
                : [...prev.selectedIds, tenantId];

            return {
                selectedIds: newSelected,
                previousSelection: prev.selectedIds,
                lastModified: Date.now(),
                hasChanges: JSON.stringify(newSelected) !== JSON.stringify(prev.previousSelection)
            };
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        setSelection(prev => ({
            selectedIds: filteredTenants.map(t => t.id),
            previousSelection: prev.selectedIds,
            lastModified: Date.now(),
            hasChanges: true
        }));
    }, [filteredTenants]);

    const handleDeselectAll = useCallback(() => {
        setSelection(prev => ({
            selectedIds: [],
            previousSelection: prev.selectedIds,
            lastModified: Date.now(),
            hasChanges: prev.selectedIds.length > 0
        }));
    }, []);

    // Filter handlers
    const applyPreset = useCallback((preset: FilterPreset) => {
        setCurrentPreset(preset);
        setFilters(prev => ({
            ...prev,
            ...PRESET_FILTERS[preset]
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setCurrentPreset(undefined);
        setFilters({
            building: '',
            minRating: 0,
            hasInsurance: false,
            leaseMinDuration: 0,
            paymentHistoryMonths: 0,
            activeServiceRequests: false,
            includeEndingSoon: true
        });
    }, []);

    return {
        // State
        searchQuery,
        filters,
        error,
        selection,
        results: paginatedResults,
        currentPreset,

        // Setters
        setSearchQuery,
        setFilters,
        setError,
        setPage,

        // Handlers
        handleSelect,
        handleSelectAll,
        handleDeselectAll,
        applyPreset,
        resetFilters
    };
};