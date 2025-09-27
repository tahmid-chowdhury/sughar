import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { ALL_DOCUMENTS_DATA, BUILDING_NAMES } from '../constants';
import { Document, DocumentType } from '../types';
import { ArrowUp, ArrowDown, Search, Plus, Filter } from './icons';

interface FilterState {
  searchTerm: string;
  building: string;
  documentType: string;
  dateRange: string;
}

interface AllDocumentsPageProps {
  onAddNewDocument: () => void;
  onBuildingClick?: (buildingId: string) => void;
  onUnitClick?: (buildingId: string, unitId: string) => void;
  setViewingTenantId?: (tenantId: string) => void;
}

type SortConfig = {
  key: keyof Document;
  direction: 'asc' | 'desc';
} | null;

const FilterPanel: React.FC<{
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ filterState, setFilterState, isOpen, onToggle }) => {
  const documentTypes = Object.values(DocumentType);
  const dateRanges = ['All Time', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last Year'];

  return (
    <>
      <button
        onClick={onToggle}
        className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
      >
        <Filter className="w-4 h-4 mr-2" />
        Advanced filtering
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={filterState.searchTerm}
                  onChange={(e) => setFilterState(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
              <select
                value={filterState.building}
                onChange={(e) => setFilterState(prev => ({ ...prev, building: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Buildings</option>
                {Object.values(BUILDING_NAMES).map((building: string) => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <select
                value={filterState.documentType}
                onChange={(e) => setFilterState(prev => ({ ...prev, documentType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Types</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filterState.dateRange}
                onChange={(e) => setFilterState(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {dateRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SortableHeader: React.FC<{
  children: React.ReactNode;
  sortKey: keyof Document;
  sortConfig: SortConfig;
  onSort: (key: keyof Document) => void;
}> = ({ children, sortKey, sortConfig, onSort }) => (
  <th
    scope="col"
    className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
    onClick={() => onSort(sortKey)}
  >
    <div className="flex items-center">
      <span>{children}</span>
      {sortConfig?.key === sortKey ? (
        sortConfig.direction === 'asc' ? (
          <ArrowUp className="w-3 h-3 ml-1" />
        ) : (
          <ArrowDown className="w-3 h-3 ml-1" />
        )
      ) : (
        <ArrowDown className="w-3 h-3 ml-1 text-gray-300" />
      )}
    </div>
  </th>
);

const getDocumentTypeStyles = (type: DocumentType) => {
  switch (type) {
    case DocumentType.Lease: return 'bg-blue-100 text-blue-800';
    case DocumentType.Utilities: return 'bg-yellow-100 text-yellow-800';
    case DocumentType.Income: return 'bg-green-100 text-green-800';
    case DocumentType.Insurance: return 'bg-indigo-100 text-indigo-800';
    case DocumentType.Service: return 'bg-purple-100 text-purple-800';
    case DocumentType.Certifications: return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const AllDocumentsPage: React.FC<AllDocumentsPageProps> = ({
  onAddNewDocument,
  onBuildingClick,
  onUnitClick,
  setViewingTenantId
}) => {
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    building: '',
    documentType: '',
    dateRange: 'All Time'
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = ALL_DOCUMENTS_DATA;

    // Apply filters
    if (filterState.searchTerm) {
      const searchLower = filterState.searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchLower) ||
        doc.building.toLowerCase().includes(searchLower) ||
        doc.unit.toLowerCase().includes(searchLower) ||
        doc.type.toLowerCase().includes(searchLower)
      );
    }

    if (filterState.building) {
      filtered = filtered.filter(doc => doc.building === filterState.building);
    }

    if (filterState.documentType) {
      filtered = filtered.filter(doc => doc.type === filterState.documentType);
    }

    // Apply date range filter
    if (filterState.dateRange !== 'All Time') {
      const now = new Date();
      let cutoffDate = new Date();

      switch (filterState.dateRange) {
        case 'Last 7 Days':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'Last 30 Days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case 'Last 90 Days':
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case 'Last Year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(doc => {
        const docDate = new Date(doc.uploadDate);
        return docDate >= cutoffDate;
      });
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [filterState, sortConfig]);

  const handleSort = (key: keyof Document) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <Card className="!p-0 rounded-lg">
      <div className="flex justify-end p-4 gap-4 relative">
        <button
          onClick={onAddNewDocument}
          className="flex items-center text-sm font-medium text-white bg-accent-secondary rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </button>
        <FilterPanel
          filterState={filterState}
          setFilterState={setFilterState}
          isOpen={filterPanelOpen}
          onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader sortKey="name" sortConfig={sortConfig} onSort={handleSort}>
                Document Name
              </SortableHeader>
              <SortableHeader sortKey="building" sortConfig={sortConfig} onSort={handleSort}>
                Building
              </SortableHeader>
              <SortableHeader sortKey="unit" sortConfig={sortConfig} onSort={handleSort}>
                Unit
              </SortableHeader>
              <SortableHeader sortKey="type" sortConfig={sortConfig} onSort={handleSort}>
                Doc Type
              </SortableHeader>
              <SortableHeader sortKey="uploadDate" sortConfig={sortConfig} onSort={handleSort}>
                Date Uploaded
              </SortableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedDocuments.map((doc: Document) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {doc.name}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm">
                  {doc.building !== 'N/A' && onBuildingClick ? (
                    <button
                      onClick={() => onBuildingClick(doc.building)}
                      className="text-blue-600 hover:underline"
                    >
                      {doc.building}
                    </button>
                  ) : (
                    <span className={doc.building === 'N/A' ? 'text-gray-400 italic' : 'text-gray-500'}>
                      {doc.building}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm">
                  {doc.unit !== 'N/A' && onUnitClick ? (
                    <button
                      onClick={() => onUnitClick(doc.building, doc.unit)}
                      className="text-blue-600 hover:underline"
                    >
                      {doc.unit}
                    </button>
                  ) : (
                    <span className={doc.unit === 'N/A' ? 'text-gray-400 italic' : 'text-gray-500'}>
                      {doc.unit}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDocumentTypeStyles(doc.type)}`}>
                    {doc.type}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.uploadDate}
                </td>
              </tr>
            ))}
            {filteredAndSortedDocuments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                  No documents found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};