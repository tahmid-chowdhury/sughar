import { TenantRating } from '../types';

/**
 * Filter preset types for document sharing
 */
export enum FilterPreset {
    AllTenants = 'all_tenants',
    GoodStanding = 'good_standing',
    RecentlyActive = 'recently_active',
    LongTermTenants = 'long_term_tenants',
    PerfectPayment = 'perfect_payment'
}

/**
 * Advanced search operators
 */
export enum SearchOperator {
    AND = 'AND',
    OR = 'OR',
    NOT = 'NOT'
}

/**
 * Base search filters
 */
export interface SearchFilters {
    building: string;
    minRating: TenantRating | 0;
    hasInsurance: boolean;
}

/**
 * Extended search configuration
 */
export interface AdvancedSearch {
    query: string;
    operator: SearchOperator;
    fields: string[];
    fuzzyMatch: boolean;
}

/**
 * Extended filter configuration
 */
export interface AdvancedFilters extends SearchFilters {
    leaseMinDuration: number;
    paymentHistoryMonths: number;
    activeServiceRequests: boolean;
    includeEndingSoon: boolean;
}

/**
 * Search results with metadata
 */
export interface SearchResults {
    tenants: string[]; // Tenant IDs
    totalResults: number;
    pageCount: number;
    currentPage: number;
    hasMore: boolean;
}

/**
 * Error state with enhanced context
 */
export interface ErrorState {
    message: string;
    isVisible: boolean;
    type: 'error' | 'warning' | 'info';
    context?: {
        code: string;
        action?: string;
        recoverable: boolean;
        suggestions?: string[];
    };
}

/**
 * Modal view state
 */
export interface ModalViewState {
    isFilterVisible: boolean;
    isSaving: boolean;
    currentPreset?: FilterPreset;
    lastSearch?: string;
    error?: ErrorState;
}

/**
 * Selection state with metadata
 */
export interface SelectionState {
    selectedIds: string[];
    previousSelection?: string[];
    lastModified: number;
    hasChanges: boolean;
}