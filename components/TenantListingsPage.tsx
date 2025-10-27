import React, { useState } from 'react';
import { Card } from './Card';
import { Search, Filter, MapPin, DollarSign, Home, Map, List } from './icons';
import { PropertyListing } from '../types/listing';

interface TenantListingsPageProps {
  listings: PropertyListing[];
  onSelectListing: (id: string) => void;
  onBack: () => void;
}

export const TenantListingsPage: React.FC<TenantListingsPageProps> = ({ 
  listings, 
  onSelectListing,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filter listings based on search and filters
  const filteredListings = listings.filter(listing => {
    // Search term filter
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range filter
    const price = listing.price || 0;
    const minPrice = filters.minPrice ? parseInt(filters.minPrice) : 0;
    const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
    const matchesPrice = price >= minPrice && price <= maxPrice;
    
    // Bedrooms filter (using 'beds' instead of 'bedrooms' to match PropertyListing type)
    const beds = listing.beds || 0;
    const matchesBedrooms = !filters.bedrooms || beds >= parseInt(filters.bedrooms);
    
    // Bathrooms filter (using 'baths' instead of 'bathrooms' to match PropertyListing type)
    const baths = listing.baths || 0;
    const matchesBathrooms = !filters.bathrooms || baths >= parseFloat(filters.bathrooms);
    
    // Property type filter
    const matchesType = !filters.propertyType || 
      (listing.propertyType && listing.propertyType.toLowerCase() === filters.propertyType.toLowerCase());
    
    return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms && matchesType;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Available Properties</h1>
          <p className="text-text-secondary">Find your perfect home today</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            aria-label="List view"
          >
            <List className="w-5 h-5 text-text-secondary" />
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            aria-label="Map view"
          >
            <Map className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location, property type, or amenities..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5 mr-2 text-text-secondary" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Min Price (৳)</label>
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Max Price (৳)</label>
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Bedrooms</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                value={filters.bedrooms}
                onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Bathrooms</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                value={filters.bathrooms}
                onChange={(e) => setFilters({...filters, bathrooms: e.target.value})}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="1.5">1.5+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Listings grid */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div 
                  className="relative h-48 bg-gray-100 cursor-pointer"
                  onClick={() => onSelectListing(listing.id)}
                >
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Home className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-medium">৳{listing.price?.toLocaleString()}<span className="text-sm font-normal">/month</span></p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-text-main mb-1">{listing.title}</h3>
                  <div className="flex items-center text-sm text-text-secondary mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{listing.address}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>{listing.beds || 'N/A'} beds</span>
                    <span>{listing.baths || 'N/A'} baths</span>
                    <span>{listing.sqft ? `${listing.sqft} sqft` : 'N/A'}</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary">No properties match your search criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    minPrice: '',
                    maxPrice: '',
                    bedrooms: '',
                    bathrooms: '',
                    propertyType: ''
                  });
                }}
                className="mt-2 text-brand-pink hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Map className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-text-secondary">Map view coming soon</p>
            <button 
              onClick={() => setViewMode('list')} 
              className="mt-2 text-sm text-brand-pink hover:underline"
            >
              Back to list view
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
