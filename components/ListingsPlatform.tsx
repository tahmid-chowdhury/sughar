// components/ListingsPlatform.tsx
import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal as Filter, 
  Plus, 
  Eye, 
  EyeOff, 
  Home as HomeIcon,
  MapPin,
  ChevronDown,
  Pencil
} from './icons';
import { PropertyListing } from '../types/listing';

interface ListingsPlatformProps {
  isInternal?: boolean;
  listings: PropertyListing[];
  onAddListing: () => void;
  onEditListing: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onBack?: () => void;
}

interface Filters {
  status: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
}

export const ListingsPlatform: React.FC<ListingsPlatformProps> = ({
  isInternal = false,
  listings = [],
  onAddListing,
  onEditListing,
  onToggleVisibility,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    status: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter listings based on search and filter criteria
  const filteredListings = listings.filter((listing) => {
    // Search term filter
    const matchesSearch = 
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status, price range, beds, and baths
    const matchesFilters = 
      (filters.status === '' || listing.status === filters.status) &&
      (!filters.minPrice || (listing.price || 0) >= Number(filters.minPrice)) &&
      (!filters.maxPrice || (listing.price || 0) <= Number(filters.maxPrice)) &&
      (!filters.beds || (listing.beds || 0) >= Number(filters.beds)) &&
      (!filters.baths || (listing.baths || 0) >= Number(filters.baths));

    return matchesSearch && matchesFilters;
  });

  // Render status badge with appropriate styling
  const renderStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      leased: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
    
    return (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {displayStatus}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Listings Management</h1>
          <p className="text-gray-600">Manage and track all your property listings in one place</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={onAddListing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-pink hover:bg-brand-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add New Listing
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="relative flex-1 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search listings by address, unit, or status"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="draft">Drafts</option>
                <option value="leased">Leased</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border rounded-lg flex items-center ${showFilters ? 'bg-gray-100 border-gray-300' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <Filter className="h-5 w-5 text-gray-500 mr-1" />
              <span className="text-sm">Filters</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  className="focus:ring-brand-pink focus:border-brand-pink block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  className="focus:ring-brand-pink focus:border-brand-pink block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Beds</label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm rounded-md"
                value={filters.beds}
                onChange={(e) => setFilters({...filters, beds: e.target.value})}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Baths</label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm rounded-md"
                value={filters.baths}
                onChange={(e) => setFilters({...filters, baths: e.target.value})}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="1.5">1.5+</option>
                <option value="2">2+</option>
                <option value="2.5">2.5+</option>
                <option value="3">3+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredListings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          {listing.images?.[0] ? (
                            <img 
                              className="h-full w-full object-cover" 
                              src={listing.images[0]} 
                              alt={listing.title} 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                              <HomeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                          <div className="text-sm text-gray-500">
                            {listing.beds || 0} beds • {listing.baths || 0} baths
                            {listing.sqft && ` • ${listing.sqft} sqft`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                        <div className="text-sm text-gray-900">
                          {listing.address || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${listing.price?.toLocaleString() || '0'}/mo
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(listing.status || 'draft')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onEditListing(listing.id)}
                          className="text-brand-pink hover:text-brand-pink/80"
                          title="Edit listing"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onToggleVisibility(listing.id)}
                          className="text-gray-500 hover:text-gray-700"
                          title={listing.status === 'active' ? 'Hide listing' : 'Show listing'}
                        >
                          {listing.status === 'active' ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by adding your first property listing.'}
            </p>
            <div className="mt-6">
              <button
                onClick={onAddListing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-pink hover:bg-brand-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add New Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};