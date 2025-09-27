import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { TOP_RATED_TENANTS_APPLICATIONS, NEW_SUGHAR_VERIFIED_TENANTS_APPLICATIONS } from '../constants';
import { TenantApplication, VerifiedTenantApplication } from '../types';
import { HomeIcon, ArrowDown, ArrowUp, Search, X, SlidersHorizontal } from './icons';

interface TenantApplicationsPageProps {
  setViewingTenantId: (id: string) => void;
  onBuildingClick?: (buildingId: string) => void;
  onUnitClick?: (buildingId: string, unitId: string) => void;
}

type SortField = 'tenant' | 'building' | 'unit' | 'matchPercentage' | 'submissionDate';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  building: string;
  searchTerm: string;
  matchPercentageRange: { min: number; max: number };
  dateRange: { start: string; end: string };
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

const TenantCell: React.FC<{ tenant: TenantApplication['tenant'], setViewingTenantId: (id: string) => void }> = ({ tenant, setViewingTenantId }) => (
    <button onClick={() => setViewingTenantId(tenant.id)} className="flex items-center text-left w-full p-1 rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary">
        <img className="h-8 w-8 rounded-full" src={tenant.avatar} alt={tenant.name} />
        <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
        </div>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{tenant.rating}</span>
    </button>
);

const MatchPercentagePill: React.FC<{ percentage: number }> = ({ percentage }) => {
    let colorClasses = '';
    if (percentage >= 80) {
        colorClasses = 'bg-green-100 text-green-800';
    } else if (percentage >= 50) {
        colorClasses = 'bg-yellow-100 text-yellow-800';
    } else {
        colorClasses = 'bg-red-100 text-red-800';
    }
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClasses}`}>
            {percentage}%
        </span>
    );
};

const FilterPanel: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose: () => void;
  dataSource: (TenantApplication | VerifiedTenantApplication)[];
}> = ({ filters, onFilterChange, onClose, dataSource }) => {
  const uniqueBuildings = [...new Set(dataSource.map(app => 'building' in app ? app.building : 'N/A'))].sort();

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search applications..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterUpdate('searchTerm', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Match %</label>
          <div className="flex space-x-2">
            <input 
              type="number"
              placeholder="Min"
              value={filters.matchPercentageRange.min || ''}
              onChange={(e) => handleFilterUpdate('matchPercentageRange', { ...filters.matchPercentageRange, min: Number(e.target.value) || 0 })}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
            />
            <input 
              type="number"
              placeholder="Max"
              value={filters.matchPercentageRange.max || ''}
              onChange={(e) => handleFilterUpdate('matchPercentageRange', { ...filters.matchPercentageRange, max: Number(e.target.value) || 100 })}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div className="flex space-x-2">
            <input 
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterUpdate('dateRange', { ...filters.dateRange, start: e.target.value })}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input 
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterUpdate('dateRange', { ...filters.dateRange, end: e.target.value })}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

const ApplicationTable: React.FC<{
  title: string;
  data: (TenantApplication | VerifiedTenantApplication)[];
  setViewingTenantId: (id: string) => void;
  onBuildingClick?: (buildingId: string) => void;
  onUnitClick?: (buildingId: string, unitId: string) => void;
  sortConfig: { field: SortField; direction: SortDirection };
  onSort: (field: SortField) => void;
  filteredData: (TenantApplication | VerifiedTenantApplication)[];
}> = ({ title, data, setViewingTenantId, onBuildingClick, onUnitClick, sortConfig, onSort, filteredData }) => (
    <Card className="!p-0">
        <div className="p-4 flex items-center border-b border-gray-200">
            <div className="p-2 bg-pink-100 rounded-lg mr-3">
                <HomeIcon className="w-5 h-5 text-brand-pink" />
            </div>
            <h3 className="font-atkinson text-lg font-bold text-text-main">{title}</h3>
            <span className="ml-auto text-sm text-gray-600">
                {filteredData.length} of {data.length} applications
            </span>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <SortableHeader field="tenant" currentSort={sortConfig} onSort={onSort}>
                            Tenant
                        </SortableHeader>
                        <SortableHeader field="building" currentSort={sortConfig} onSort={onSort}>
                            Building
                        </SortableHeader>
                        <SortableHeader field="unit" currentSort={sortConfig} onSort={onSort}>
                            Unit
                        </SortableHeader>
                        <SortableHeader field="matchPercentage" currentSort={sortConfig} onSort={onSort}>
                            Match Percentage
                        </SortableHeader>
                        <SortableHeader field="submissionDate" currentSort={sortConfig} onSort={onSort}>
                            Submission Date
                        </SortableHeader>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-5 py-4 whitespace-nowrap">
                                <TenantCell tenant={app.tenant} setViewingTenantId={setViewingTenantId} />
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                {'building' in app ? (
                                    onBuildingClick ? (
                                        <button 
                                            onClick={() => onBuildingClick(app.building)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {app.building}
                                        </button>
                                    ) : (
                                        app.building
                                    )
                                ) : (
                                    <span className="text-gray-400 italic">N/A</span>
                                )}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                {onUnitClick && 'building' in app ? (
                                    <button 
                                        onClick={() => onUnitClick(app.building, app.unit)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {app.unit}
                                    </button>
                                ) : (
                                    app.unit
                                )}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                                <MatchPercentagePill percentage={app.matchPercentage} />
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{app.submissionDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {filteredData.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500">
                        <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No applications found</h3>
                        <p>Try adjusting your filters or search terms</p>
                    </div>
                </div>
            )}
        </div>
    </Card>
);

export const TenantApplicationsPage: React.FC<TenantApplicationsPageProps> = ({ setViewingTenantId, onBuildingClick, onUnitClick }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({ 
        field: 'submissionDate', 
        direction: 'desc' 
    });
    const [filters, setFilters] = useState<FilterState>({
        building: '',
        searchTerm: '',
        matchPercentageRange: { min: 0, max: 100 },
        dateRange: { start: '', end: '' }
    });

    const handleSort = (field: SortField) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filterAndSortData = (data: (TenantApplication | VerifiedTenantApplication)[]) => {
        let filtered = data.filter(app => {
            // Building filter
            if (filters.building && 'building' in app && app.building !== filters.building) return false;
            
            // Match percentage filter
            if (app.matchPercentage < filters.matchPercentageRange.min || app.matchPercentage > filters.matchPercentageRange.max) return false;
            
            // Date filter
            if (filters.dateRange.start || filters.dateRange.end) {
                const appDate = new Date(app.submissionDate);
                const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : new Date('1900-01-01');
                const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : new Date('2100-12-31');
                if (appDate < startDate || appDate > endDate) return false;
            }
            
            // Search filter
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                const buildingMatch = 'building' in app ? app.building.toLowerCase().includes(term) : false;
                return app.tenant.name.toLowerCase().includes(term) ||
                       buildingMatch ||
                       app.unit.toLowerCase().includes(term);
            }
            
            return true;
        });

        // Sort the filtered data
        filtered.sort((a, b) => {
            const { field, direction } = sortConfig;
            let aValue: any;
            let bValue: any;
            
            switch (field) {
                case 'tenant':
                    aValue = a.tenant.name;
                    bValue = b.tenant.name;
                    break;
                case 'building':
                    aValue = 'building' in a ? a.building : '';
                    bValue = 'building' in b ? b.building : '';
                    break;
                case 'unit':
                    aValue = a.unit;
                    bValue = b.unit;
                    break;
                case 'matchPercentage':
                    aValue = a.matchPercentage;
                    bValue = b.matchPercentage;
                    break;
                case 'submissionDate':
                    aValue = new Date(a.submissionDate);
                    bValue = new Date(b.submissionDate);
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
    };

    const filteredTopRated = useMemo(() => 
        filterAndSortData(TOP_RATED_TENANTS_APPLICATIONS), 
        [sortConfig, filters]
    );
    
    const filteredVerified = useMemo(() => 
        filterAndSortData(NEW_SUGHAR_VERIFIED_TENANTS_APPLICATIONS), 
        [sortConfig, filters]
    );

    const allData = [...TOP_RATED_TENANTS_APPLICATIONS, ...NEW_SUGHAR_VERIFIED_TENANTS_APPLICATIONS];

    return (
        <>
            {showFilters && (
                <FilterPanel 
                    filters={filters}
                    onFilterChange={setFilters}
                    onClose={() => setShowFilters(false)}
                    dataSource={allData}
                />
            )}
            
            <div className="mb-4 flex justify-end">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <ApplicationTable 
                    title="Top-Rated Tenants" 
                    data={TOP_RATED_TENANTS_APPLICATIONS}
                    filteredData={filteredTopRated}
                    setViewingTenantId={setViewingTenantId}
                    onBuildingClick={onBuildingClick}
                    onUnitClick={onUnitClick}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                />
                <ApplicationTable 
                    title="New SuGhar Verified Tenants" 
                    data={NEW_SUGHAR_VERIFIED_TENANTS_APPLICATIONS}
                    filteredData={filteredVerified}
                    setViewingTenantId={setViewingTenantId}
                    onBuildingClick={onBuildingClick}
                    onUnitClick={onUnitClick}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                />
            </div>
        </>
    );
};