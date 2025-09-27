import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { SERVICE_REQUESTS_DATA } from '../constants';
import { ServiceRequest, RequestStatus } from '../types';
import { SlidersHorizontal, ArrowDown, ArrowUp, Search, X } from './icons';
import { SpecificServiceRequestPage } from './SpecificServiceRequestPage';

interface ServiceRequestsPageProps {
    onBuildingClick?: (buildingId: string) => void;
    onUnitClick?: (buildingId: string, unitId: number) => void;
    setViewingTenantId?: (tenantId: string) => void;
}

type SortField = 'id' | 'building' | 'unit' | 'assignedContact' | 'requestDate' | 'status';
type SortDirection = 'asc' | 'desc';

interface FilterState {
    status: RequestStatus | 'all';
    building: string;
    assignedContact: string;
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
}> = ({ contact, setViewingTenantId }) => (
    <div className="flex items-center">
        <img className="h-8 w-8 rounded-full object-cover" src={contact.avatar} alt={contact.name} />
        {setViewingTenantId ? (
            <button 
                onClick={() => setViewingTenantId(contact.name.toLowerCase().replace(/\s+/g, '-'))}
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
        [RequestStatus.Complete]: 'bg-status-success text-status-success-text',
        [RequestStatus.InProgress]: 'bg-status-warning text-status-warning-text',
        [RequestStatus.Pending]: 'bg-status-error text-status-error-text',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

const FilterPanel: React.FC<{
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    onClose: () => void;
}> = ({ filters, onFilterChange, onClose }) => {
    const uniqueBuildings = [...new Set(SERVICE_REQUESTS_DATA.map(req => req.building))].sort();
    const uniqueContacts = [...new Set(SERVICE_REQUESTS_DATA.map(req => req.assignedContact.name))].sort();

    const handleFilterUpdate = (field: keyof FilterState, value: any) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <Card className="mb-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Advanced Filters</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                    <select 
                        value={filters.building}
                        onChange={(e) => handleFilterUpdate('building', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Buildings</option>
                        {uniqueBuildings.map(building => (
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
                        {uniqueContacts.map(contact => (
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

export const ServiceRequestsPage: React.FC<ServiceRequestsPageProps> = ({ 
    onBuildingClick, 
    onUnitClick, 
    setViewingTenantId 
}) => {
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({ 
        field: 'requestDate', 
        direction: 'desc' 
    });
    const [filters, setFilters] = useState<FilterState>({
        status: 'all',
        building: '',
        assignedContact: '',
        dateRange: { start: '', end: '' },
        searchTerm: ''
    });

    const handleSort = (field: SortField) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedData = useMemo(() => {
        let filtered = SERVICE_REQUESTS_DATA.filter(request => {
            // Status filter
            if (filters.status !== 'all' && request.status !== filters.status) return false;
            
            // Building filter
            if (filters.building && request.building !== filters.building) return false;
            
            // Contact filter
            if (filters.assignedContact && request.assignedContact.name !== filters.assignedContact) return false;
            
            // Search filter
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                return request.id.toLowerCase().includes(term) ||
                       request.building.toLowerCase().includes(term) ||
                       request.assignedContact.name.toLowerCase().includes(term);
            }
            
            return true;
        });

        // Sort the filtered data
        filtered.sort((a, b) => {
            const { field, direction } = sortConfig;
            let aValue: any = a[field];
            let bValue: any = b[field];
            
            // Handle special cases
            if (field === 'assignedContact') {
                aValue = a.assignedContact.name;
                bValue = b.assignedContact.name;
            }
            
            if (field === 'requestDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [sortConfig, filters]);

    const handleRequestClick = (id: string) => {
        setSelectedRequestId(id);
    };

    const handleBack = () => {
        setSelectedRequestId(null);
    };

    if (selectedRequestId) {
        return <SpecificServiceRequestPage serviceRequestId={selectedRequestId} onBack={handleBack} />;
    }

    return (
        <div className="container mx-auto">
            <Header title="Service Requests" />
            
            {showFilters && (
                <FilterPanel 
                    filters={filters}
                    onFilterChange={setFilters}
                    onClose={() => setShowFilters(false)}
                />
            )}
            
            <Card className="!p-0">
                <div className="flex justify-between items-center p-4">
                    <div className="text-sm text-gray-600">
                        Showing {filteredAndSortedData.length} of {SERVICE_REQUESTS_DATA.length} requests
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
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
                                <SortableHeader field="assignedContact" currentSort={sortConfig} onSort={handleSort}>
                                    Assigned Contact
                                </SortableHeader>
                                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Requests
                                </th>
                                <SortableHeader field="requestDate" currentSort={sortConfig} onSort={handleSort}>
                                    Request Date
                                </SortableHeader>
                                <SortableHeader field="status" currentSort={sortConfig} onSort={handleSort}>
                                    Request Status
                                </SortableHeader>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedData.map((request: ServiceRequest) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        <button 
                                            onClick={() => handleRequestClick(request.id)} 
                                            className="text-blue-600 hover:underline"
                                        >
                                            {request.id}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {onBuildingClick ? (
                                            <button 
                                                onClick={() => onBuildingClick(request.building)}
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
                                                onClick={() => onUnitClick(request.building, request.unit)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {request.unit}
                                            </button>
                                        ) : (
                                            request.unit
                                        )}
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <ContactCell 
                                            contact={request.assignedContact} 
                                            setViewingTenantId={setViewingTenantId}
                                        />
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        {request.requests}
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
                
                {filteredAndSortedData.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500">
                            <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No requests found</h3>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};