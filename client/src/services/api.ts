// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'development' ? 'http://localhost:5050' : '');

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
  console.log('Making API request to:', url);
  console.log('Auth token available:', !!authToken);
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('Fetch config:', config);
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData: any) => apiRequest('/api/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials: { email: string; password: string }) => apiRequest('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getProfile: () => apiRequest('/api/profile'),
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
  getStats: (): Promise<any> => apiRequest('/api/dashboard/stats'),

  // Get financial stats for dashboard
  getFinancialStats: (): Promise<any> => apiRequest('/api/dashboard/financial-stats'),

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

  // Get building overview stats for Buildings & Units Dashboard
  getBuildingsOverview: (): Promise<any> => apiRequest('/api/dashboard/stats'),
};

// Current Tenants API
export const currentTenantsAPI = {
  getAll: (): Promise<any> => apiRequest('/api/current-tenants'),
};

// Tenants API (all users with tenant role)
export const tenantsAPI = {
  getAll: (): Promise<any> => apiRequest('/api/tenants'),
};

// Helper functions to calculate dashboard stats
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
  currentTenantsAPI,
};