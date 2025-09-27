// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'development' ? 'http://localhost:5050' : '/api');

// Auth token management
let authToken = localStorage.getItem('authToken') || null;

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

export const getAuthToken = () => authToken;

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData: any) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials: { email: string; password: string }) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getProfile: () => apiRequest('/auth/profile'),
};

// Properties API
export const propertiesAPI = {
  getAll: () => apiRequest('/api/properties'),
  
  create: (propertyData: any) => apiRequest('/api/properties', {
    method: 'POST',
    body: JSON.stringify(propertyData),
  }),

  getById: (id: string) => apiRequest(`/api/properties/${id}`),

  update: (id: string, propertyData: any) => apiRequest(`/api/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(propertyData),
  }),

  delete: (id: string) => apiRequest(`/api/properties/${id}`, {
    method: 'DELETE',
  }),
};

// Units API
export const unitsAPI = {
  getAll: () => apiRequest('/api/units'),
  
  getByProperty: (propertyId: string) => apiRequest(`/api/properties/${propertyId}/units`),
  
  create: (propertyId: string, unitData: any) => apiRequest(`/api/properties/${propertyId}/units`, {
    method: 'POST',
    body: JSON.stringify(unitData),
  }),

  update: (id: string, unitData: any) => apiRequest(`/api/units/${id}`, {
    method: 'PUT',
    body: JSON.stringify(unitData),
  }),
};

// Service Requests API
export const serviceRequestsAPI = {
  getAll: () => apiRequest('/api/service-requests'),
  
  create: (requestData: any) => apiRequest('/api/service-requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  }),

  update: (id: string, updateData: any) => apiRequest(`/api/service-requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),
};

// Rental Applications API
export const rentalApplicationsAPI = {
  getAll: () => apiRequest('/api/rental-applications'),
  
  create: (applicationData: any) => apiRequest('/api/rental-applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),

  update: (id: string, updateData: any) => apiRequest(`/api/rental-applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),
};

// Lease Agreements API
export const leaseAgreementsAPI = {
  getAll: () => apiRequest('/api/lease-agreements'),
};

// Payments API
export const paymentsAPI = {
  getAll: () => apiRequest('/api/payments'),
};

// Dashboard API - custom endpoints for dashboard data
export const dashboardAPI = {
  // Get comprehensive dashboard statistics
  getStats: () => apiRequest('/api/dashboard/stats'),

  // Get financial stats for dashboard
  getFinancialStats: async () => {
    try {
      // This will aggregate data from multiple endpoints
      const [properties, serviceRequests] = await Promise.all([
        propertiesAPI.getAll(),
        serviceRequestsAPI.getAll(),
      ]);

      // Calculate stats from the data
      return calculateFinancialStats(properties, serviceRequests);
    } catch (error) {
      console.error('Error fetching financial stats:', error);
      throw error;
    }
  },

  // Get building stats
  getBuildingStats: async () => {
    const properties = await propertiesAPI.getAll();
    return calculateBuildingStats(properties);
  },

  // Get tenant stats
  getTenantStats: async () => {
    const applications = await rentalApplicationsAPI.getAll();
    return calculateTenantStats(applications);
  },
};

// Helper functions to calculate dashboard stats
const calculateFinancialStats = (properties: any[], serviceRequests: any[]) => {
  // Mock calculation - you can implement real logic here
  return [
    { label: 'Revenue This Month', value: '$715,000', icon: 'DollarSign', color: 'text-green-500' },
    { label: 'Incoming Rent', value: '$63,000', icon: 'ArrowUp', color: 'text-blue-500' },
    { label: 'Overdue Rent', value: '$85,000', icon: 'ArrowDown', color: 'text-red-500' },
    { label: 'Utilities/Misc Expenses', value: '$16,000', icon: 'Settings', color: 'text-yellow-500' },
    { label: 'Service Costs', value: '$21,000', icon: 'Wrench', color: 'text-purple-500' },
  ];
};

const calculateBuildingStats = (properties: any[]) => {
  return properties.map((property, index) => ({
    id: property._id,
    name: property.address.split(',')[0],
    address: property.address,
    units: Math.floor(Math.random() * 30) + 10, // This should come from actual unit count
    occupied: Math.floor(Math.random() * 25) + 5,
    revenue: `$${(Math.floor(Math.random() * 50000) + 20000).toLocaleString()}`,
    status: Math.random() > 0.2 ? 'Good' : 'Needs Attention',
  }));
};

const calculateTenantStats = (applications: any[]) => {
  return {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };
};

export default {
  authAPI,
  propertiesAPI,
  unitsAPI,
  serviceRequestsAPI,
  rentalApplicationsAPI,
  leaseAgreementsAPI,
  paymentsAPI,
  dashboardAPI,
};