import React from 'react';
import { Card } from './Card';
import { HomeIcon, DollarSign, FileText, Wrench, Clock, ChevronRight } from './icons';
import { AppData, User, Document, ServiceRequest } from '../types';

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
  // Get the current tenant's unit
  const tenantUnit = appData.units.find(unit => unit.currentTenantId === currentUser?.id);
  
  // Get the building for this unit
  const building = tenantUnit ? appData.buildings.find(b => b.id === tenantUnit.buildingId) : null;
  
  // Get building manager info (if available)
  const buildingManager = building?.contact || { name: 'Not assigned', avatar: 'https://i.pravatar.cc/40?u=unassigned' };

  // Filter documents for this tenant (showing only the 3 most recent)
  const tenantDocuments = appData.documents
    .filter(doc => doc.uploadedBy === currentUser?.id || doc.sharedWith?.includes(currentUser?.id || ''))
    .slice(0, 3);

  // Filter service requests for this tenant
  const tenantServiceRequests = appData.serviceRequests.filter(
    req => req.tenantId === currentUser?.id
  );

  // Get the most recent service request
  const latestRequest = tenantServiceRequests.length > 0 
    ? tenantServiceRequests[0] 
    : null;

  // Calculate days until next rent is due (example: 5 days from now)
  const daysUntilRentDue = 5;
  const nextRentDue = new Date();
  nextRentDue.setDate(nextRentDue.getDate() + daysUntilRentDue);
  const formattedDueDate = nextRentDue.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  // Calculate rent amount (example: get from unit or use default)
  const rentAmount = tenantUnit?.monthlyRent || 0;
  const formattedRent = rentAmount.toLocaleString('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return (
    <div className="space-y-6 pb-20"> {/* Added pb-20 to account for bottom navigation */}
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.name?.split(' ')[0] || 'Tenant'}</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your property today</p>
      </div>

      {/* Pay Rent Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm mb-1">Upcoming Payment</p>
            <h3 className="text-2xl font-bold">{formattedRent}</h3>
            <p className="text-blue-100 text-sm mt-1">Due {formattedDueDate}</p>
          </div>
          <button 
            onClick={() => onNavigate('make-payment')}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
          >
            Pay Rent
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('service-requests')}
          className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-medium">Service Request</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        
        <button 
          onClick={() => onNavigate('documents')}
          className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-medium">Documents</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Service Request Status */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Service Requests</h3>
          <button 
            onClick={() => onNavigate('service-requests')}
            className="text-sm text-blue-600 font-medium"
          >
            View All
          </button>
        </div>
        
        {latestRequest ? (
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">#{latestRequest.id.split('-')[1]}</span>
              <StatusBadge status={latestRequest.status.toLowerCase()} />
            </div>
            <p className="text-gray-800 text-sm mb-3">{latestRequest.description}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Updated {new Date(latestRequest.requestDate).toLocaleDateString()}</span>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wrench className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-3">No active service requests</p>
            <button 
              onClick={() => onNavigate('service-requests')}
              className="text-blue-600 text-sm font-medium"
            >
              Create a request
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
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-3">No documents available</p>
          </div>
        )}
      </Card>

      {/* Building Manager */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Building Manager</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={buildingManager.avatar} 
              alt={buildingManager.name} 
              className="w-12 h-12 rounded-xl mr-3" 
            />
            <div>
              <p className="font-medium">{buildingManager.name}</p>
              <p className="text-sm text-gray-500">Building Manager</p>
              {'phone' in buildingManager && buildingManager.phone && (
                <p className="text-sm text-gray-600 mt-1">{buildingManager.phone}</p>
              )}
              </div>
              {buildingManager && (
                <div className="pt-3 border-t">
                  <p className="text-text-secondary text-xs mb-2">Building Manager</p>
                  <div className="flex items-center">
                    <img src={buildingManager.avatar} alt={buildingManager.name} className="w-8 h-8 rounded-full" />
                    <div className="ml-2">
                      <p className="text-sm font-medium text-text-main">{buildingManager.name}</p>
                      <p className="text-xs text-text-secondary">+880 1234-567890</p>
                      <p className="text-xs text-text-secondary">manager@sughar.com</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Action Center</h3>
            <div className="space-y-2">
              <button onClick={() => onNavigate('payments')} className="w-full flex items-center justify-between p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors text-left border border-pink-200">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-pink-600 mr-3" />
                  <span className="text-sm font-medium text-pink-600">Pay Rent Now</span>
                </div>
                <ChevronRight className="w-4 h-4 text-pink-600" />
              </button>
              <button onClick={() => onNavigate('service-requests')} className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="flex items-center">
                  <Wrench className="w-5 h-5 text-text-secondary mr-3" />
                  <span className="text-sm font-medium text-text-main">Submit New Request</span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </button>
              <button onClick={() => onNavigate('documents')} className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-text-secondary mr-3" />
                  <span className="text-sm font-medium text-text-main">View Documents</span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </button>
              <button onClick={() => onNavigate('settings')} className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-text-secondary mr-3" />
                  <span className="text-sm font-medium text-text-main">Help & Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
