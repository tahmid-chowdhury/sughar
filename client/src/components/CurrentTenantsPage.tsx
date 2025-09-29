import React, { useState, useMemo, useEffect } from 'react';
import { Card } from './Card';
import { currentTenantsAPI } from '../services/api';
import { CurrentTenant, RentStatus } from '../types';
import { SlidersHorizontal, ArrowDown, ArrowUp, Search, X } from './icons';

interface CurrentTenantsPageProps {
  setViewingTenantId: (id: string) => void;
  onBuildingClick?: (buildingId: string) => void;
  onUnitClick?: (buildingId: string, unitId: string) => void;
  initialData?: CurrentTenant[];
  loading?: boolean;
  error?: string | null;
}

type SortField = 'name' | 'building' | 'unit' | 'leaseProgress' | 'rentStatus' | 'requests';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  building: string;
  rentStatus: RentStatus | 'all';
  searchTerm: string;
  leaseProgressRange: { min: number; max: number };
}

const SortableHeader: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  field: SortField;
  currentSort: { field: SortField; direction: SortDirection };
  onSort: (field: SortField) => void;
}> = ({ children, className, field, currentSort, onSort }) => {
  const isActive = currentSort.field === field;
  
  return (
    <th 
      scope="col" 
      className={`px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${className}`}
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

const TenantCell: React.FC<{ tenant: CurrentTenant, setViewingTenantId: (id: string) => void }> = ({ tenant, setViewingTenantId }) => (
    <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary">
        <img className="h-8 w-8 rounded-full" src={tenant.avatar} alt={tenant.name} />
        <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
        </div>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{tenant.rating}</span>
    </button>
);

const LeaseProgressCell: React.FC<{ progress: CurrentTenant['leaseProgress'] }> = ({ progress }) => {
    const bgColor = progress.variant === 'dark' ? 'bg-purple-400' : 'bg-purple-300';
    return (
        <div className="w-28 bg-gray-200 rounded-full h-4">
            <div className={`${bgColor} h-4 rounded-full`} style={{ width: `${progress.value}%` }}></div>
        </div>
    );
};

const RentStatusPill: React.FC<{ status: RentStatus }> = ({ status }) => {
    const styles = {
        [RentStatus.Paid]: 'bg-status-success text-status-success-text',
        [RentStatus.Overdue]: 'bg-status-error text-status-error-text',
        [RentStatus.Pending]: 'bg-status-warning text-status-warning-text',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

const FilterPanel: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose: () => void;
  tenants: CurrentTenant[];
}> = ({ filters, onFilterChange, onClose, tenants }) => {
  const uniqueBuildings = [...new Set(tenants.map((tenant: CurrentTenant) => tenant.building))].sort();

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Rent Status</label>
          <select 
            value={filters.rentStatus}
            onChange={(e) => handleFilterUpdate('rentStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value={RentStatus.Paid}>Paid</option>
            <option value={RentStatus.Pending}>Pending</option>
            <option value={RentStatus.Overdue}>Overdue</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search tenants..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterUpdate('searchTerm', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lease Progress</label>
          <div className="flex space-x-2">
            <input 
              type="number"
              placeholder="Min %"
              value={filters.leaseProgressRange.min || ''}
              onChange={(e) => handleFilterUpdate('leaseProgressRange', { ...filters.leaseProgressRange, min: Number(e.target.value) || 0 })}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
            />
            <input 
              type="number"
              placeholder="Max %"
              value={filters.leaseProgressRange.max || ''}
              onChange={(e) => handleFilterUpdate('leaseProgressRange', { ...filters.leaseProgressRange, max: Number(e.target.value) || 100 })}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export const CurrentTenantsPage: React.FC<CurrentTenantsPageProps> = ({ 
  setViewingTenantId, 
  onBuildingClick, 
  onUnitClick, 
  initialData, 
  loading: parentLoading, 
  error: parentError 
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
        field: 'name',
        direction: 'asc'
    });
    const [filters, setFilters] = useState<FilterState>({
        building: '',
        rentStatus: 'all',
        searchTerm: '',
        leaseProgressRange: { min: 0, max: 100 }
    });
    const [tenantsData, setTenantsData] = useState<CurrentTenant[]>(initialData || []);
    const [loading, setLoading] = useState(parentLoading !== undefined ? parentLoading : !initialData);
    const [error, setError] = useState<string | null>(parentError !== undefined ? parentError : null);

    // Fetch tenants data on component mount only if no initial data provided
    useEffect(() => {
        if (initialData) {
            // Use the passed initial data
            setTenantsData(initialData);
            setLoading(parentLoading || false);
            setError(parentError || null);
            return;
        }

        const fetchTenants = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await currentTenantsAPI.getAll();
                setTenantsData(data);
            } catch (err) {
                console.error('Error fetching tenants:', err);
                setError('Failed to load tenants data');
            } finally {
                setLoading(false);
            }
        };

        fetchTenants();
    }, [initialData, parentLoading, parentError]);

    const handleSort = (field: SortField) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedData = useMemo(() => {
        let filtered = tenantsData.filter((tenant: CurrentTenant) => {
            // Building filter
            if (filters.building && tenant.building !== filters.building) return false;
            
            // Rent status filter
            if (filters.rentStatus !== 'all' && tenant.rentStatus !== filters.rentStatus) return false;
            
            // Lease progress filter
            const progressValue = tenant.leaseProgress.value;
            if (progressValue < filters.leaseProgressRange.min || progressValue > filters.leaseProgressRange.max) return false;
            
            // Search filter
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                return tenant.name.toLowerCase().includes(term) ||
                       tenant.building.toLowerCase().includes(term) ||
                       String(tenant.unit).toLowerCase().includes(term);
            }
            
            return true;
        });

        // Sort the filtered data
        filtered.sort((a: CurrentTenant, b: CurrentTenant) => {
            const { field, direction } = sortConfig;
            let aValue: any;
            let bValue: any;
            
            switch (field) {
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'building':
                    aValue = a.building;
                    bValue = b.building;
                    break;
                case 'unit':
                    aValue = a.unit;
                    bValue = b.unit;
                    break;
                case 'leaseProgress':
                    aValue = a.leaseProgress.value;
                    bValue = b.leaseProgress.value;
                    break;
                case 'rentStatus':
                    aValue = a.rentStatus;
                    bValue = b.rentStatus;
                    break;
                case 'requests':
                    aValue = a.requests;
                    bValue = b.requests;
                    break;
                default:
                    aValue = a[field];
                    bValue = b[field];
            }
            
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [sortConfig, filters, tenantsData]);

    if (loading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading tenants data...</span>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-6">
                <div className="text-center text-red-600">
                    <div className="text-lg font-medium mb-2">Error Loading Data</div>
                    <div className="text-sm">{error}</div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <>
            {showFilters && (
                <FilterPanel
                    filters={filters}
                    onFilterChange={setFilters}
                    onClose={() => setShowFilters(false)}
                    tenants={tenantsData}
                />
            )}            <Card className="!p-0">
                <div className="flex justify-between items-center p-4">
                    <div className="text-sm text-gray-600">
                        Showing {filteredAndSortedData.length} of {tenantsData.length} tenants
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
                                <SortableHeader className="w-1/4" field="name" currentSort={sortConfig} onSort={handleSort}>
                                    Tenant
                                </SortableHeader>
                                <SortableHeader field="building" currentSort={sortConfig} onSort={handleSort}>
                                    Building
                                </SortableHeader>
                                <SortableHeader field="unit" currentSort={sortConfig} onSort={handleSort}>
                                    Unit
                                </SortableHeader>
                                <SortableHeader field="leaseProgress" currentSort={sortConfig} onSort={handleSort}>
                                    Lease Progress
                                </SortableHeader>
                                <SortableHeader field="rentStatus" currentSort={sortConfig} onSort={handleSort}>
                                    Rent Status
                                </SortableHeader>
                                <SortableHeader field="requests" currentSort={sortConfig} onSort={handleSort}>
                                    Requests
                                </SortableHeader>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedData.map((tenant: CurrentTenant) => (
                                <tr key={tenant.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <TenantCell tenant={tenant} setViewingTenantId={setViewingTenantId} />
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {onBuildingClick ? (
                                            <button 
                                                onClick={() => onBuildingClick(tenant.building)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {tenant.building}
                                            </button>
                                        ) : (
                                            tenant.building
                                        )}
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {onUnitClick ? (
                                            <button 
                                                onClick={() => onUnitClick(tenant.building, String(tenant.unit))}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {tenant.unit}
                                            </button>
                                        ) : (
                                            tenant.unit
                                        )}
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <LeaseProgressCell progress={tenant.leaseProgress} />
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <RentStatusPill status={tenant.rentStatus} />
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tenant.requests}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filteredAndSortedData.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500">
                            <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No tenants found</h3>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    </div>
                )}
            </Card>
        </>
    );
};