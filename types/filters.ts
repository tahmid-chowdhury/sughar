import { User } from '../types';

/**
 * Tenant rating score (1-5)
 * - 5: Excellent tenant
 * - 4: Good tenant
 * - 3: Average tenant
 * - 2: Below average
 * - 1: Poor tenant
 */
export type TenantRating = 1 | 2 | 3 | 4 | 5;

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
 * Search filters for document sharing
 */
export interface SearchFilters {
    /** Building ID to filter by */
    building: string;
    /** Minimum tenant rating (1-5) */
    minRating: TenantRating | 0;
    /** Whether to only show tenants with insurance */
    hasInsurance: boolean;
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
 * Search results from document sharing search
 */
export interface SearchResults {
    tenants: User[];
    noResults: boolean;
    totalResults: number;
    currentPage: number;
    pageCount: number;
    hasMore: boolean;
}
