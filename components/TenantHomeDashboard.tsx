import React from 'react';
import { Card } from './Card';
import { HomeIcon, DollarSign, FileText, Wrench, Clock, ChevronRight, Search, Plus, CreditCard } from './icons';
import { AppData, User, Document, ServiceRequest, UnitStatus } from '../types';

interface TenantHomeDashboardProps {
  currentUser: User;
  appData: AppData;
  onNavigate: (page: string, tab?: string) => void;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusColors: { [key: string]: string } = {
    'completed': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'default': 'bg-gray-100 text-gray-800'
  };

  const statusText: { [key: string]: string } = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'pending': 'Pending',
    'default': 'Unknown'
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[status] || statusColors['default']}`}>
      {statusText[status] || statusText['default']}
    </span>
  );
};

export const TenantHomeDashboard: React.FC<TenantHomeDashboardProps> = ({ currentUser, appData, onNavigate }) => {
  // Get tenant's current unit
  const tenantUnit = appData.units.find(unit => unit.currentTenantId === currentUser?.id);
  
  // Get the building for this unit
  const building = tenantUnit ? appData.buildings.find(b => b.id === tenantUnit.buildingId) : null;
  
  // Get building manager info (if available)
  const buildingManager = building?.contact || { name: 'Not assigned', avatar: 'https://i.pravatar.cc/40?u=unassigned' };

  // Filter service requests for this tenant
  const tenantServiceRequests = appData.serviceRequests.filter(req => req.tenantId === currentUser?.id);

  // Filter documents for this tenant
  const tenantDocuments = appData.documents
    .filter(doc => doc.uploadedBy === currentUser?.id || doc.sharedWith?.includes(currentUser?.id || ''))
    .slice(0, 3);

  // Get the most recent service request
  const latestRequest = tenantServiceRequests.length > 0 
    ? tenantServiceRequests[0] 
    : null;

  // Get next rent due date from lease or use a default
  const daysUntilRentDue = tenantUnit?.leaseEndDate 
    ? Math.ceil((new Date(tenantUnit.leaseEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 30; // Default to 30 days if no lease end date
    
  // Default lease status if not available
  const leaseStatus = tenantUnit?.status === UnitStatus.Rented ? 'Lease Active' : 'Month-to-Month';
    
  const nextRentDue = new Date();
  nextRentDue.setDate(nextRentDue.getDate() + daysUntilRentDue);
  const formattedDueDate = nextRentDue.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  // Get rent amount from unit
  const rentAmount = tenantUnit?.monthlyRent || 0;
  const formattedRent = rentAmount.toLocaleString('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Header with Rent Status */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.name?.split(' ')[0] || 'Tenant'}</h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your unit</p>
          </div>
          {tenantUnit && (
            <div className="bg-blue-50 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
              Unit {tenantUnit.unitNumber}
            </div>
          )}
        </div>
      </div>

      {/* Rent Status Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm mb-1">Rent Status</p>
            <div className="flex items-center">
              <h3 className="text-2xl font-bold mr-3">{formattedRent}</h3>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                {leaseStatus}
              </span>
            </div>
            <p className="text-blue-100 text-sm mt-2">
              {daysUntilRentDue > 0 
                ? `Next payment due ${formattedDueDate}`
                : 'Please contact property manager for lease renewal'}
            </p>
            {daysUntilRentDue <= 3 && daysUntilRentDue > 0 && (
              <p className="text-yellow-200 text-xs mt-2">
                {daysUntilRentDue === 0 
                  ? "Due today!" 
                  : `Due in ${daysUntilRentDue} day${daysUntilRentDue === 1 ? '' : 's'}`}
              </p>
            )}
          </div>
          <button 
            onClick={() => onNavigate('make-payment')}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
          >
            {daysUntilRentDue > 0 ? 'Pay Now' : 'Contact Manager'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('service-requests')}
          className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-all active:scale-95"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">Service Request</p>
              <p className="text-xs text-gray-500">Report an issue</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        
        <button 
          onClick={() => onNavigate('documents')}
          className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-all active:scale-95"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">Documents</p>
              <p className="text-xs text-gray-500">Lease & receipts</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Service Request Status */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Service Requests</h3>
          <div className="flex items-center">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
              {tenantServiceRequests.length} total
            </span>
            <button 
              onClick={() => onNavigate('service-requests')}
              className="text-sm text-blue-600 font-medium"
            >
              View All
            </button>
          </div>
        </div>
        
        {tenantServiceRequests.length > 0 ? (
          <div className="divide-y">
            {tenantServiceRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="p-4 hover:bg-gray-50 cursor-pointer" 
                   onClick={() => onNavigate('service-requests')}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {request.title || 'Service Request'}
                  </span>
                  <StatusBadge status={request.status.toLowerCase()} />
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {request.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>#{request.id.split('-')[0]}</span>
                  <span>Updated {new Date(request.requestDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            <div className="p-4 border-t">
              <div className="flex justify-between items-center">
                {tenantServiceRequests.length > 3 && (
                  <button 
                    onClick={() => onNavigate('service-requests')}
                    className="text-blue-600 text-sm font-medium"
                  >
                    View all {tenantServiceRequests.length} requests
                  </button>
                )}
                <button
                  onClick={() => onNavigate('service-requests', 'new')}
                  className="text-accent-secondary text-sm font-medium"
                >
                  + Submit New Request
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wrench className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-3">No active service requests</p>
            <button 
              onClick={() => onNavigate('service-requests', 'new')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              New Request
            </button>
          </div>
        )}
      </Card>

      {/* Recent Documents */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Recent Documents</h3>
          <button 
            onClick={() => onNavigate('documents')}
            className="text-sm text-blue-600 font-medium"
          >
            View All
          </button>
        </div>
        
        {tenantDocuments.length > 0 ? (
          <div className="divide-y">
            {tenantDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className="p-4 flex justify-between items-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => onNavigate('documents')}
              >
                <div className="flex items-center">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.uploadDate}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wrench className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-3">No service requests yet</p>
            <button
              onClick={() => onNavigate('service-requests', 'new')}
              className="text-accent-secondary text-sm font-medium"
            >
              + Submit Your First Request
            </button>
          </div>
        )}
      </Card>
      {/* Building Manager & Contact */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Need Help?</h3>
        <div className="space-y-4">
          {/* Emergency Contact */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Emergency Maintenance</p>
                <p className="text-xs text-gray-500">Available 24/7</p>
              </div>
              <a href="tel:+8801234567890" className="ml-auto bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 border border-red-200">
                Call Now
              </a>
            </div>
          </div>

          {/* Building Manager */}
          {buildingManager && (
            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
              <img 
                src={buildingManager.avatar} 
                alt={buildingManager.name} 
                className="w-12 h-12 rounded-xl mr-3" 
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{buildingManager.name}</p>
                <p className="text-xs text-gray-500">Building Manager</p>
                {'phone' in buildingManager && buildingManager.phone && (
                  <p className="text-xs text-blue-600 mt-1">{buildingManager.phone}</p>
                )}
              </div>
              <a 
                href={`tel:${'phone' in buildingManager ? buildingManager.phone : ''}`}
                className="p-2 bg-white rounded-lg border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
