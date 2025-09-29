import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { ServiceRequest, RequestStatus, DashboardStats } from '../types';
import { SlidersHorizontal, ArrowDown, ArrowUp, Search, X, Calendar, Users, Wrench, CheckCircle2, Bell } from './icons';
import { SpecificServiceRequestPage } from './SpecificServiceRequestPage';
import { serviceRequestsAPI, dashboardAPI } from '../services/api';

interface ServiceRequestsPageProps {
    onBuildingClick?: (buildingId: string) => void;
    onUnitClick?: (buildingId: string, unitId: number) => void;
    setViewingTenantId?: (tenantId: string) => void;
}

type SortField = 'id' | 'building' | 'unit' | 'assignedContact' | 'requestDate' | 'status' | 'priority' | 'category' | 'urgencyScore';
type SortDirection = 'asc' | 'desc';

interface FilterState {
    status: RequestStatus | 'all';
    building: string;
    assignedContact: string;
    priority: string;
    category: string;
    dateRange: { start: string; end: string };
    searchTerm: string;
}

const SortableHeader: React.FC<{ 
    children: React.ReactNode; 
    field: SortField;
    currentSort: { field: SortField; direction: SortDirection };
    onSort: (field: SortField) => void;
}> = ({ children, field, currentSort, onSort }) => {
    const isActive = currentSort.field === field;
    
    return (
        <th 
            scope="col" 
            className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => onSort(field)}
        >
            <div className="flex items-center">
                <span>{children}</span>
                {isActive && (
                    currentSort.direction === 'asc' ? 
                    <ArrowUp className="w-3 h-3 ml-1 text-gray-600" /> :
                    <ArrowDown className="w-3 h-3 ml-1 text-gray-600" />
                )}
                {!isActive && <ArrowDown className="w-3 h-3 ml-1 text-gray-400 opacity-50" />}
            </div>
        </th>
    );
};

const ContactCell: React.FC<{ 
    contact: { name: string; avatar: string; };
    setViewingTenantId?: (tenantId: string) => void;
    onContactClick?: (contactName: string) => void;
}> = ({ contact, setViewingTenantId, onContactClick }) => (
    <div className="flex items-center">
        <img className="h-8 w-8 rounded-full object-cover" src={contact.avatar} alt={contact.name} />
        {setViewingTenantId ? (
            <button 
                onClick={() => onContactClick?.(contact.name)}
                className="ml-3 font-medium text-blue-600 hover:underline bg-gray-100 rounded-full px-3 py-1 text-sm"
            >
                {contact.name}
            </button>
        ) : (
            <span className="ml-3 font-medium text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm">{contact.name}</span>
        )}
    </div>
);

const StatusPill = ({ status }: { status: RequestStatus }) => {
    const styles = {
        [RequestStatus.Complete]: 'bg-green-100 text-green-800',
        [RequestStatus.InProgress]: 'bg-yellow-100 text-yellow-800', 
        [RequestStatus.Pending]: 'bg-red-100 text-red-800',
    };
    const icons = {
        [RequestStatus.Complete]: CheckCircle2,
        [RequestStatus.InProgress]: Calendar,
        [RequestStatus.Pending]: Bell,
    };
    const Icon = icons[status];
    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
            <Icon className="w-3 h-3 mr-1" />
            {status}
        </span>
    );
};

const PriorityPill = ({ priority }: { priority: string }) => {
    const styles = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800',
    };
    const priorityLevel = priority?.toLowerCase() || 'medium';
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priorityLevel as keyof typeof styles] || styles.medium}`}>
            {priority || 'Medium'}
        </span>
    );
};

const CategoryPill = ({ category }: { category: string }) => {
    const categoryColors = {
        'plumbing': 'bg-blue-100 text-blue-800',
        'electrical': 'bg-purple-100 text-purple-800',
        'hvac': 'bg-orange-100 text-orange-800',
        'appliance': 'bg-green-100 text-green-800',
        'maintenance': 'bg-gray-100 text-gray-800',
        'general': 'bg-indigo-100 text-indigo-800',
    };
    const categoryKey = category?.toLowerCase() || 'general';
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[categoryKey as keyof typeof categoryColors] || categoryColors.general}`}>
            {category || 'General'}
        </span>
    );
};

const FilterPanel: React.FC<{
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    onClose: () => void;
    serviceRequests: ServiceRequest[];
}> = ({ filters, onFilterChange, onClose, serviceRequests }) => {
    const uniqueBuildings = useMemo(() => 
        [...new Set(serviceRequests.map((req: any) => req.building))].sort(), 
        [serviceRequests]
    );
    const uniqueContacts = useMemo(() => 
        [...new Set(serviceRequests.map((req: any) => req.assignedContact.name))].sort(), 
        [serviceRequests]
    );
    const uniquePriorities = useMemo(() => 
        [...new Set(serviceRequests.map((req: any) => req.priority).filter(Boolean))].sort(), 
        [serviceRequests]
    );
    const uniqueCategories = useMemo(() => 
        [...new Set(serviceRequests.map((req: any) => req.category).filter(Boolean))].sort(), 
        [serviceRequests]
    );

    const handleFilterUpdate = useCallback((field: keyof FilterState, value: any) => {
        onFilterChange({ ...filters, [field]: value });
    }, [filters, onFilterChange]);

    return (
        <Card className="mb-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Advanced Filters</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        value={filters.status}
                        onChange={(e) => handleFilterUpdate('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value={RequestStatus.Pending}>Pending</option>
                        <option value={RequestStatus.InProgress}>In Progress</option>
                        <option value={RequestStatus.Complete}>Complete</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select 
                        value={filters.priority}
                        onChange={(e) => handleFilterUpdate('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Priorities</option>
                        {uniquePriorities.map((priority: string) => (
                            <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                        value={filters.category}
                        onChange={(e) => handleFilterUpdate('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map((category: string) => (
                            <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                    <select 
                        value={filters.building}
                        onChange={(e) => handleFilterUpdate('building', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Buildings</option>
                        {uniqueBuildings.map((building: string) => (
                            <option key={building} value={building}>{building}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Contact</label>
                    <select 
                        value={filters.assignedContact}
                        onChange={(e) => handleFilterUpdate('assignedContact', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Contacts</option>
                        {uniqueContacts.map((contact: string) => (
                            <option key={contact} value={contact}>{contact}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search requests..."
                            value={filters.searchTerm}
                            onChange={(e) => handleFilterUpdate('searchTerm', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

// Helper function to calculate urgency score for prioritization (moved outside component to prevent hoisting issues)
const calculateUrgencyScore = (request: any) => {
    let score = 0;
    
    // Priority weight (40%)
    const priority = request.priority?.toLowerCase() || 'medium';
    if (priority === 'high') score += 40;
    else if (priority === 'medium') score += 20;
    else score += 10;
    
    // Age of request (30%)
    const daysSinceCreated = Math.floor((Date.now() - new Date(request.dateCreated || request.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCreated >= 7) score += 30;
    else if (daysSinceCreated >= 3) score += 20;
    else score += 10;
    
    // Category urgency (20%)
    const category = request.category?.toLowerCase() || 'general';
    if (category === 'electrical' || category === 'plumbing') score += 20;
    else if (category === 'hvac' || category === 'appliance') score += 15;
    else score += 10;
    
    // Status urgency (10%)
    if (request.status === 'pending') score += 10;
    else if (request.status === 'in-progress') score += 5;
    
    return Math.min(score, 100);
};

// Helper function to map API status to RequestStatus enum (moved outside component to prevent hoisting issues)
const mapApiStatusToRequestStatus = (apiStatus: string): RequestStatus => {
    switch (apiStatus?.toLowerCase()) {
        case 'completed':
        case 'complete':
            return RequestStatus.Complete;
        case 'in-progress':
        case 'in_progress':
        case 'assigned':
            return RequestStatus.InProgress;
        case 'pending':
        case 'open':
        default:
            return RequestStatus.Pending;
    }
};

export const ServiceRequestsPage: React.FC<ServiceRequestsPageProps> = ({ 
    onBuildingClick, 
    onUnitClick, 
    setViewingTenantId 
}) => {
    const [rawServiceRequestsData, setRawServiceRequestsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({ 
        field: 'requestDate', 
        direction: 'desc' 
    });
    const [filters, setFilters] = useState<FilterState>({
        status: 'all',
        building: '',
        assignedContact: '',
        priority: '',
        category: '',
        dateRange: { start: '', end: '' },
        searchTerm: ''
    });

    const fetchServiceRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Hardcoded service requests data based on provided information
            const hardcodedServiceRequests = [
                {
                    _id: 'SR-0001',
                    building: 'Lalmatia Court',
                    unit: '4A',
                    tenant: 'Tania Akter',
                    description: 'Leak under kitchen sink - Tenant reports water pooling under sink; cabinet getting damaged.',
                    category: 'plumbing',
                    priority: 'high',
                    status: 'pending',
                    requestDate: '2025-09-20',
                    title: 'Leak under kitchen sink',
                    urgencyScore: 85,
                    dateCreated: '2025-09-20'
                },
                {
                    _id: 'SR-0002',
                    building: 'Lalmatia Court',
                    unit: '2B',
                    tenant: 'Sumi Akhter',
                    description: 'Bathroom faucet dripping - Constant dripping, wasting water and raising bill.',
                    category: 'plumbing',
                    priority: 'medium',
                    status: 'pending',
                    requestDate: '2025-09-22',
                    title: 'Bathroom faucet dripping',
                    urgencyScore: 70,
                    dateCreated: '2025-09-22'
                },
                {
                    _id: 'SR-0003',
                    building: 'Lalmatia Court',
                    unit: '1C',
                    tenant: 'Maruf Khan',
                    description: 'AC not cooling properly - AC blows warm air even after filter cleaning.',
                    category: 'hvac',
                    priority: 'high',
                    status: 'pending',
                    requestDate: '2025-09-19',
                    title: 'AC not cooling properly',
                    urgencyScore: 90,
                    dateCreated: '2025-09-19'
                },
                {
                    _id: 'SR-0004',
                    building: 'Banani Heights',
                    unit: '2A',
                    tenant: 'Kamal Uddin',
                    description: 'Electrical outage in living room - Circuit breaker keeps tripping, no power in living room.',
                    category: 'electrical',
                    priority: 'high',
                    status: 'in-progress',
                    requestDate: '2025-09-18',
                    title: 'Electrical outage in living room',
                    urgencyScore: 95,
                    dateCreated: '2025-09-18'
                },
                {
                    _id: 'SR-0005',
                    building: 'Banani Heights',
                    unit: '4A',
                    tenant: 'Tanvir Ahmed',
                    description: 'Window glass cracked - Small crack in bedroom window, risk of shattering.',
                    category: 'maintenance',
                    priority: 'medium',
                    status: 'pending',
                    requestDate: '2025-09-23',
                    title: 'Window glass cracked',
                    urgencyScore: 60,
                    dateCreated: '2025-09-23'
                },
                {
                    _id: 'SR-0006',
                    building: 'Banani Heights',
                    unit: '3B',
                    tenant: 'Zahid Hasan',
                    description: 'Clogged kitchen drain - Water not draining; possible grease buildup.',
                    category: 'plumbing',
                    priority: 'medium',
                    status: 'pending',
                    requestDate: '2025-09-24',
                    title: 'Clogged kitchen drain',
                    urgencyScore: 65,
                    dateCreated: '2025-09-24'
                },
                {
                    _id: 'SR-0007',
                    building: 'Dhanmondi Residency',
                    unit: '2A',
                    tenant: 'Shila Rahman',
                    description: 'Bedroom light fixture sparking - Sparks seen when switching light on/off.',
                    category: 'electrical',
                    priority: 'high',
                    status: 'pending',
                    requestDate: '2025-09-21',
                    title: 'Bedroom light fixture sparking',
                    urgencyScore: 100,
                    dateCreated: '2025-09-21'
                },
                {
                    _id: 'SR-0008',
                    building: 'Dhanmondi Residency',
                    unit: '4A',
                    tenant: 'Rezaul Karim',
                    description: 'Pest infestation (cockroaches) - Cockroaches in kitchen; needs pest control service.',
                    category: 'maintenance',
                    priority: 'high',
                    status: 'pending',
                    requestDate: '2025-09-15',
                    title: 'Pest infestation (cockroaches)',
                    urgencyScore: 80,
                    dateCreated: '2025-09-15'
                },
                {
                    _id: 'SR-0009',
                    building: 'Uttara Gardens',
                    unit: '1',
                    tenant: 'Selina Yasmin',
                    description: 'Water heater not working - Tenant reports no hot water for past two days.',
                    category: 'appliance',
                    priority: 'high',
                    status: 'pending',
                    requestDate: '2025-09-25',
                    title: 'Water heater not working',
                    urgencyScore: 75,
                    dateCreated: '2025-09-25'
                }
            ];
            
            console.log('Hardcoded service requests loaded:', hardcodedServiceRequests);
            
            // Set minimal dashboard stats for service requests functionality
            setDashboardStats({
                serviceRequests: {
                    total: hardcodedServiceRequests.length,
                    pending: hardcodedServiceRequests.filter(sr => sr.status === 'pending').length,
                    inProgress: hardcodedServiceRequests.filter(sr => sr.status === 'in-progress').length,
                    completed: hardcodedServiceRequests.filter(sr => sr.status === 'completed').length,
                    recent: hardcodedServiceRequests
                }
            } as any);
            setRawServiceRequestsData(hardcodedServiceRequests);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Error loading hardcoded service requests:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to load service requests data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleFilterChange = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
    }, []);

    const handleCloseFilters = useCallback(() => {
        setShowFilters(false);
    }, []);

    useEffect(() => {
        fetchServiceRequests();
    }, [fetchServiceRequests]);

    // Memoized data transformation to prevent unnecessary re-renders
    const transformedServiceRequests = useMemo(() => {
        if (!Array.isArray(rawServiceRequestsData) || rawServiceRequestsData.length === 0) {
            return [];
        }

        const transformedData = rawServiceRequestsData.map((sr: any, index: number) => {
            // Use the hardcoded data structure directly
            const building = sr.building || 'Unknown Building';
            const unit = sr.unit || 'Unknown Unit';
            const tenantName = sr.tenant || 'Unassigned';
            
            // Map the status to RequestStatus enum
            const mapStatus = (status: string): RequestStatus => {
                switch (status) {
                    case 'completed':
                    case 'complete':
                        return RequestStatus.Complete;
                    case 'in-progress':
                    case 'assigned':
                        return RequestStatus.InProgress;
                    case 'pending':
                    default:
                        return RequestStatus.Pending;
                }
            };
            
            return {
                id: sr._id || `sr-stable-${index}`,
                building,
                unit,
                requestDate: sr.requestDate || new Date().toLocaleDateString(),
                assignedContact: {
                    name: tenantName,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tenantName}`
                },
                status: mapStatus(sr.status),
                description: sr.description || 'No description provided',
                title: sr.title || 'Service Request',
                category: sr.category || 'General',
                priority: sr.priority || 'medium',
                urgencyScore: sr.urgencyScore || 50,
                dateCreated: sr.dateCreated || sr.requestDate,
                requests: 1
            };
        });
        
        return transformedData.sort((a, b) => b.urgencyScore - a.urgencyScore);
    }, [rawServiceRequestsData]);

    const handleSort = useCallback((field: SortField) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const filteredAndSortedData = transformedServiceRequests; // Temporarily disable filtering/sorting

    const handleRequestClick = useCallback((id: string) => {
        setSelectedRequestId(id);
    }, []);

    const handleBack = useCallback(() => {
        setSelectedRequestId(null);
    }, []);

    const handleToggleFilters = useCallback(() => {
        setShowFilters(!showFilters);
    }, [showFilters]);

    const handleResetFilters = useCallback(() => {
        setFilters({
            status: 'all',
            building: '',
            assignedContact: '',
            priority: '',
            category: '',
            dateRange: { start: '', end: '' },
            searchTerm: ''
        });
    }, []);

    const handleBuildingClick = useCallback((buildingId: string) => {
        onBuildingClick?.(buildingId);
    }, [onBuildingClick]);

    const handleUnitClick = useCallback((buildingId: string, unitId: string) => {
        onUnitClick?.(buildingId, unitId as any);
    }, [onUnitClick]);

    const handleViewingTenant = useCallback((tenantName: string) => {
        setViewingTenantId?.(tenantName.toLowerCase().replace(/\s+/g, '-'));
    }, [setViewingTenantId]);

    if (selectedRequestId) {
        return <SpecificServiceRequestPage serviceRequestId={selectedRequestId} onBack={handleBack} />;
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main">Service Requests</h2>
                        <div className="animate-pulse bg-gray-200 h-4 w-48 rounded mt-2"></div>
                    </div>
                </div>
                
                {/* Loading stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="p-4">
                            <div className="animate-pulse">
                                <div className="bg-gray-200 h-8 w-16 rounded mb-2"></div>
                                <div className="bg-gray-200 h-4 w-20 rounded"></div>
                            </div>
                        </Card>
                    ))}
                </div>
                
                {/* Loading table */}
                <Card className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-text-main">Loading Service Requests...</p>
                    <p className="text-sm text-text-secondary mt-2">Fetching request data and calculating priorities</p>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text-main">Service Requests</h2>
                </div>
                <Card className="flex-1">
                    <div className="p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-text-main mb-4">Failed to Load Service Requests</h3>
                        <p className="text-text-secondary mb-6">{error}</p>
                        <button 
                            onClick={fetchServiceRequests}
                            className="px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    // Calculate summary statistics based on hardcoded service requests data
    const summaryStats = {
        total: 9,
        pending: 8,
        inProgress: 1,
        completed: 0,
        highPriority: 6, // SR-0001, SR-0003, SR-0004, SR-0007, SR-0008, SR-0009
        urgent: 3, // Urgency score >= 90: SR-0003(90), SR-0004(95), SR-0007(100)
        averageUrgencyScore: 80, // (85+70+90+95+60+65+100+80+75)/9 = 80
        categoryBreakdown: {
            plumbing: 3, // SR-0001, SR-0002, SR-0006
            electrical: 2, // SR-0004, SR-0007
            hvac: 1, // SR-0003
            maintenance: 2, // SR-0005, SR-0008
            appliance: 1 // SR-0009
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with summary and refresh */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-main">Service Requests</h2>
                    <p className="text-text-secondary">
                        {summaryStats.total} total request{summaryStats.total !== 1 ? 's' : ''} 
                        • {summaryStats.pending} pending
                        • {summaryStats.inProgress} in progress
                        • {summaryStats.completed} completed
                        {lastUpdated && (
                            <span className="ml-2 text-xs">
                                • Updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                </div>
                <button 
                    onClick={fetchServiceRequests}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors disabled:opacity-50"
                >
                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {/* Summary Statistics Cards */}
            {transformedServiceRequests.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="bg-red-50 px-4 py-3 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{summaryStats.pending}</div>
                        <div className="text-sm text-red-600">Pending</div>
                    </div>
                    <div className="bg-yellow-50 px-4 py-3 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{summaryStats.inProgress}</div>
                        <div className="text-sm text-yellow-600">In Progress</div>
                    </div>
                    <div className="bg-green-50 px-4 py-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{summaryStats.completed}</div>
                        <div className="text-sm text-green-600">Completed</div>
                    </div>
                    <div className="bg-purple-50 px-4 py-3 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{summaryStats.urgent}</div>
                        <div className="text-sm text-purple-600">Urgent</div>
                    </div>
                    <div className="bg-orange-50 px-4 py-3 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{summaryStats.highPriority}</div>
                        <div className="text-sm text-orange-600">High Priority</div>
                    </div>
                    <div className="bg-blue-50 px-4 py-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{summaryStats.averageUrgencyScore}%</div>
                        <div className="text-sm text-blue-600">Avg Urgency</div>
                    </div>
                </div>
            )}

            {/* Filters Panel */}
            {showFilters && (
                <FilterPanel 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClose={handleCloseFilters}
                    serviceRequests={transformedServiceRequests}
                />
            )}
            
            {/* Enhanced Service Requests Table */}
            <Card className="!p-0">
                <div className="flex justify-between items-center p-4">
                    <div className="text-sm text-gray-600">
                        Showing {filteredAndSortedData.length} of {transformedServiceRequests.length} requests
                        {filteredAndSortedData.length > 0 && (
                            <span className="ml-2 text-xs text-gray-500">
                                • Top priority: {Math.max(...filteredAndSortedData.map(req => req.urgencyScore || 0))}% urgency
                            </span>
                        )}
                    </div>
                    <button 
                        onClick={handleToggleFilters}
                        className={`flex items-center text-sm font-medium rounded-lg px-4 py-2 transition-colors ${
                            showFilters 
                                ? 'text-white bg-blue-600 hover:bg-blue-700' 
                                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Advanced Filtering'}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <SortableHeader field="id" currentSort={sortConfig} onSort={handleSort}>
                                    Service Request
                                </SortableHeader>
                                <SortableHeader field="building" currentSort={sortConfig} onSort={handleSort}>
                                    Building
                                </SortableHeader>
                                <SortableHeader field="unit" currentSort={sortConfig} onSort={handleSort}>
                                    Unit
                                </SortableHeader>
                                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Urgency
                                </th>
                                <SortableHeader field="assignedContact" currentSort={sortConfig} onSort={handleSort}>
                                    Assigned Contact
                                </SortableHeader>
                                <SortableHeader field="requestDate" currentSort={sortConfig} onSort={handleSort}>
                                    Request Date
                                </SortableHeader>
                                <SortableHeader field="status" currentSort={sortConfig} onSort={handleSort}>
                                    Status
                                </SortableHeader>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedData.map((request: any) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => handleRequestClick(request.id)} 
                                            className="text-blue-600 hover:underline font-medium"
                                            title={request.description}
                                        >
                                            #{request.id.slice(-6).toUpperCase()}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {onBuildingClick ? (
                                            <button 
                                                onClick={() => handleBuildingClick(request.building)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {request.building}
                                            </button>
                                        ) : (
                                            request.building
                                        )}
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {onUnitClick ? (
                                            <button 
                                                onClick={() => handleUnitClick(request.building, request.unit)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Unit {request.unit}
                                            </button>
                                        ) : (
                                            `Unit ${request.unit}`
                                        )}
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <CategoryPill category={request.category} />
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <PriorityPill priority={request.priority} />
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                                (request.urgencyScore || 0) >= 80 ? 'bg-red-500' :
                                                (request.urgencyScore || 0) >= 60 ? 'bg-yellow-500' :
                                                'bg-green-500'
                                            }`}></div>
                                            <span className="text-sm font-medium">
                                                {request.urgencyScore || 0}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <ContactCell 
                                            contact={request.assignedContact} 
                                            setViewingTenantId={setViewingTenantId}
                                            onContactClick={handleViewingTenant}
                                        />
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {request.requestDate}
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <StatusPill status={request.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Enhanced empty state */}
                {filteredAndSortedData.length === 0 && transformedServiceRequests.length > 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500">
                            <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No requests found</h3>
                            <p>Try adjusting your filters or search terms</p>
                            <button
                                onClick={handleResetFilters}
                                className="mt-4 px-4 py-2 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Complete empty state */}
                {transformedServiceRequests.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Wrench className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                        <h3 className="text-xl font-semibold text-text-main mb-4">No Service Requests</h3>
                        <p className="text-text-secondary mb-6 max-w-md mx-auto">
                            When tenants submit service requests, they'll appear here for tracking and management.
                        </p>
                        <button 
                            onClick={fetchServiceRequests}
                            className="px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                        >
                            Refresh Requests
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};