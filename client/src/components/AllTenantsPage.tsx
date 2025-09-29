import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './Card';
import { tenantsAPI } from '../services/api';
import { Search, User, Mail, Phone, Calendar, Filter } from './icons';

interface AllTenantsPageProps {
  setViewingTenantId: (id: string) => void;
}

interface TenantUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  joinDate: string;
  avatar: string;
}

interface FilterState {
  searchTerm: string;
  joinDateRange: 'all' | 'last-month' | 'last-3-months' | 'last-year';
}

const TenantCard: React.FC<{ tenant: TenantUser; onClick: () => void }> = React.memo(({ tenant, onClick }) => {
  console.log('Rendering TenantCard for:', tenant.name, 'ID:', tenant.id);
  
  return (
    <div
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <img 
            src={tenant.avatar} 
            alt={tenant.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{tenant.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span className="truncate">{tenant.email}</span>
              </div>
              {tenant.phoneNumber && (
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{tenant.phoneNumber}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-400 mt-2">
              <Calendar className="w-3 h-3" />
              <span>Joined {new Date(tenant.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

const AllTenantsPage: React.FC<AllTenantsPageProps> = ({ setViewingTenantId }) => {
  const [tenants, setTenants] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    joinDateRange: 'all'
  });

  // Fetch all tenants on component mount
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching tenants from API...');
        const data = await tenantsAPI.getAll();
        console.log('Received tenant data:', data);
        console.log('Number of tenants received:', data.length);
        
        // Check for duplicates in the received data
        const uniqueData = data.filter((tenant: TenantUser, index: number, self: TenantUser[]) => 
          index === self.findIndex(t => t.id === tenant.id)
        );
        console.log('Number of unique tenants:', uniqueData.length);
        
        if (data.length !== uniqueData.length) {
          console.warn('Duplicate tenants detected in API response!', {
            originalCount: data.length,
            uniqueCount: uniqueData.length
          });
        }
        
        setTenants(uniqueData);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load tenants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    let isCancelled = false;
    
    const runFetch = async () => {
      await fetchTenants();
      if (!isCancelled) {
        console.log('Tenant fetch completed successfully');
      }
    };

    runFetch();
    
    return () => {
      isCancelled = true;
      console.log('AllTenantsPage cleanup - cancelling any pending operations');
    };
  }, []);

  // Filter and search tenants
  const filteredTenants = useMemo(() => {
    return tenants.filter(tenant => {
      // Search filter
      const searchMatch = filters.searchTerm === '' || 
        tenant.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        tenant.phoneNumber.includes(filters.searchTerm);

      // Date filter
      let dateMatch = true;
      if (filters.joinDateRange !== 'all') {
        const joinDate = new Date(tenant.joinDate);
        const now = new Date();
        
        switch (filters.joinDateRange) {
          case 'last-month':
            dateMatch = (now.getTime() - joinDate.getTime()) <= (30 * 24 * 60 * 60 * 1000);
            break;
          case 'last-3-months':
            dateMatch = (now.getTime() - joinDate.getTime()) <= (90 * 24 * 60 * 60 * 1000);
            break;
          case 'last-year':
            dateMatch = (now.getTime() - joinDate.getTime()) <= (365 * 24 * 60 * 60 * 1000);
            break;
        }
      }

      return searchMatch && dateMatch;
    });
  }, [tenants, filters]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading all tenants...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Tenants</h1>
        <p className="text-gray-600">Manage all registered tenant users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {tenants.filter(t => {
                  const joinDate = new Date(t.joinDate);
                  const now = new Date();
                  return (now.getTime() - joinDate.getTime()) <= (30 * 24 * 60 * 60 * 1000);
                }).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Filtered Results</p>
              <p className="text-2xl font-bold text-gray-900">{filteredTenants.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={filters.joinDateRange}
              onChange={(e) => setFilters({ ...filters, joinDateRange: e.target.value as FilterState['joinDateRange'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="last-year">Last Year</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tenants Grid */}
      {filteredTenants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {
            console.log('About to render filtered tenants:', filteredTenants.length);
            console.log('Filtered tenant IDs:', filteredTenants.map(t => ({ id: t.id, name: t.name })));
            
            return filteredTenants.map(tenant => (
              <TenantCard 
                key={`tenant-${tenant.id}`}
                tenant={tenant}
                onClick={() => setViewingTenantId(tenant.id)}
              />
            ));
          })()}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tenants Found</h3>
          <p className="text-gray-500 mb-6">
            {filters.searchTerm || filters.joinDateRange !== 'all' 
              ? 'No tenants match your current filters. Try adjusting your search criteria.'
              : 'No tenant users have been registered yet.'
            }
          </p>
          {(filters.searchTerm || filters.joinDateRange !== 'all') && (
            <button
              onClick={() => setFilters({ searchTerm: '', joinDateRange: 'all' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </Card>
      )}
    </div>
  );
};

export default AllTenantsPage;