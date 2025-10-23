// components/ListingsPlatform.tsx
import React from 'react';
import { Card } from './Card';
import { 
  Search, 
  SlidersHorizontal as Filter, 
  Plus, 
  Eye, 
  EyeOff, 
  HomeIcon as Home, 
  DollarSign, 
  Ruler,
  MapPin,
  ChevronDown,
  Pencil,
  Bed,
  Bath
} from './icons';

interface Listing {
  id: string;
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: 'active' | 'pending' | 'leased' | 'draft';
  isPublic: boolean;
  images: string[];
  description: string;
  amenities: string[];
  availableFrom: string;
  lastUpdated: string;
}

interface ListingsPlatformProps {
  isInternal: boolean;
  listings: Listing[];
  onAddListing: () => void;
  onEditListing: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export const ListingsPlatform: React.FC<ListingsPlatformProps> = ({
  isInternal,
  listings,
  onAddListing,
  onEditListing,
  onToggleVisibility,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    status: 'all',
    minPrice: '',
    maxPrice: '',
    beds: '',
  });

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (filters.status === 'all' || listing.status === filters.status) &&
      (!filters.minPrice || listing.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || listing.price <= Number(filters.maxPrice)) &&
      (!filters.beds || listing.beds >= Number(filters.beds));

    return matchesSearch && matchesFilters;
  });

  const statusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      leased: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
        statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {isInternal ? 'Property Listings' : 'Available Properties'}
          </h1>
          <p className="text-gray-600">
            {isInternal 
              ? 'Manage your property listings and their visibility'
              : 'Find your perfect home today'}
          </p>
        </div>
        
        {isInternal && (
          <button
            onClick={onAddListing}
            className="mt-4 md:mt-0 px-4 py-2 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Listing
          </button>
        )}
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="relative flex-1 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by address, neighborhood, or ZIP"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-accent-secondary"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                {isInternal && <option value="draft">Draft</option>}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {isInternal && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  className="focus:ring-accent-secondary focus:border-accent-secondary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent-secondary focus:border-accent-secondary sm:text-sm rounded-md"
                value={filters.beds}
                onChange={(e) => setFilters({...filters, beds: e.target.value})}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <div className="h-48 bg-gray-100 relative">
                {listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Home className="w-12 h-12" />
                  </div>
                )}
                
                {isInternal && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => onToggleVisibility(listing.id)}
                      className={`p-2 rounded-full ${
                        listing.isPublic ? 'bg-white/90 text-blue-600' : 'bg-white/90 text-gray-600'
                      } hover:bg-white transition-colors`}
                      title={listing.isPublic ? 'Make Private' : 'Make Public'}
                    >
                      {listing.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onEditListing(listing.id)}
                      className="p-2 rounded-full bg-white/90 text-gray-600 hover:bg-white transition-colors"
                      title="Edit Listing"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="absolute bottom-2 left-2">
                  {statusBadge(listing.status)}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                  <div className="text-lg font-bold text-accent-secondary">
                    ${listing.price.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500">/mo</span>
                  </div>
                </div>
                
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{listing.address}</span>
                </div>
                
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {listing.beds} {listing.beds === 1 ? 'bed' : 'beds'}
                  </span>
                  <span className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {listing.baths} {listing.baths === 1 ? 'bath' : 'baths'}
                  </span>
                  <span className="flex items-center">
                    <Ruler className="w-4 h-4 mr-1" />
                    {listing.sqft.toLocaleString()} sqft
                  </span>
                </div>
                
                {listing.amenities.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm text-gray-500 mb-1">Amenities:</div>
                    <div className="flex flex-wrap gap-1">
                      {listing.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {listing.amenities.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{listing.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Available: {new Date(listing.availableFrom).toLocaleDateString()}
                  </div>
                  {isInternal && (
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(listing.lastUpdated).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};