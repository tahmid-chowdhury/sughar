
import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { ServiceRequest, RequestStatus, AppData, User } from '../types';
import { SlidersHorizontal, Plus, X, Search, Wrench } from './icons';
import { SortableHeader } from './SortableHeader';

interface TenantServiceRequestsPageProps {
  currentUser: User;
  onSelectServiceRequest: (id: string) => void;
  appData: AppData;
  onAddServiceRequest: (requestData: Omit<ServiceRequest, 'id' | 'requestDate' | 'status' | 'assignedContact'>) => void;
}

type TabType = 'Current' | 'In progress' | 'Completed';

const ContactCell = ({ contact }: { contact?: { name: string; avatar: string; } }) => {
    if (!contact) return <span className="text-gray-400">Unassigned</span>;
    return (
        <div className="flex items-center">
            <img className="h-8 w-8 rounded-full object-cover" src={contact.avatar} alt={contact.name} />
            <span className="ml-3 font-medium text-text-main text-sm">{contact.name}</span>
        </div>
    );
}

const StatusPill = ({ status }: { status: RequestStatus }) => {
    const styles = {
        [RequestStatus.Complete]: 'bg-green-100 text-green-700',
        [RequestStatus.InProgress]: 'bg-yellow-100 text-yellow-700',
        [RequestStatus.Pending]: 'bg-red-100 text-red-700',
    };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

export const TenantServiceRequestsPage: React.FC<TenantServiceRequestsPageProps> = ({ 
    currentUser, 
    onSelectServiceRequest, 
    appData, 
    onAddServiceRequest 
}) => {
    // State management
    const [activeTab, setActiveTab] = useState<TabType>('Current');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [showNewRequestModal, setShowNewRequestModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [requestTypeFilter, setRequestTypeFilter] = useState<string>('all');

    // Find tenant profile for current user
    const tenantProfile = appData.tenants.find(t => t.id === currentUser.id || t.name === currentUser.name);
    
    if (!tenantProfile) {
        return (
            <div className="container mx-auto text-center p-8">
                <h2 className="text-2xl text-text-secondary">Tenant profile not found.</h2>
            </div>
        );
    }

    // Get tenant's unit and building
    const tenantUnit = useMemo(() => {
        return appData.units.find(u => u.currentTenantId === tenantProfile.id);
    }, [appData.units, tenantProfile.id]);
    
    if (!tenantUnit) {
        return (
            <div className="container mx-auto text-center p-8">
                <h2 className="text-2xl text-text-secondary mb-4">No unit assigned to your account.</h2>
                <p className="text-gray-600">Please contact your property manager to be assigned to a unit.</p>
            </div>
        );
    }

    // Get the tenant's building
    const tenantBuilding = useMemo(() => {
        return tenantUnit ? appData.buildings.find(b => b.id === tenantUnit.buildingId) : null;
    }, [appData.buildings, tenantUnit]);

    // Filter service requests to show only for the tenant's specific unit
    const tenantRequests = useMemo(() => {
        if (!tenantProfile || !tenantUnit) return [];
        
        return appData.serviceRequests
          .filter(req => {
            // Show requests that are:
            // 1. Created by this tenant, or
            // 2. For this tenant's unit, or
            // 3. For this tenant's building (common area issues)
            const isForThisTenant = req.tenantId === tenantProfile.id;
            const isForThisUnit = req.unitId === tenantUnit.id;
            const isForThisBuilding = req.buildingId === tenantUnit.buildingId && !req.unitId;
            
            return isForThisTenant || isForThisUnit || isForThisBuilding;
          })
          .map(req => {
            const building = appData.buildings.find(b => b.id === req.buildingId) || tenantBuilding;
            const unit = req.unitId ? appData.units.find(u => u.id === req.unitId) : null;
            const isFromThisTenant = req.tenantId === tenantProfile.id;
            const isForThisUnit = req.unitId === tenantUnit?.id;
            
            // Determine request location
            let location = 'Common Area';
            if (unit) {
              location = `Unit ${unit.unitNumber}`;
            } else if (building) {
              location = building.name;
            }
            
            // Determine priority
            const priority = req.priority || 'medium';
            const priorityColors = {
              high: 'bg-red-100 text-red-800',
              medium: 'bg-yellow-100 text-yellow-800',
              low: 'bg-blue-100 text-blue-800'
            };
            
            return {
              ...req,
              buildingId: building?.id,
              buildingName: building?.name || 'This Building',
              unitNumber: unit?.unitNumber,
              location,
              priority,
              priorityClass: priorityColors[priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800',
              isFromThisTenant,
              isForThisUnit,
              canEdit: isFromThisTenant, // Only allow editing requests created by this tenant
              status: isFromThisTenant || isForThisUnit ? 
                req.status : 
                req.status === RequestStatus.Complete ? RequestStatus.Complete : RequestStatus.InProgress
            };
          });
    }, [appData, tenantProfile.id, tenantProfile.requests, tenantUnit, tenantBuilding]);

    // Filter requests based on active tab
    const filteredRequests = useMemo(() => {
      let result = [...tenantRequests];
      
      // First filter by tab
      switch (activeTab) {
        case 'Current':
          result = result.filter(req => 
            req.status === RequestStatus.Pending || 
            req.status === RequestStatus.InProgress
          );
          break;
        case 'In progress':
          result = result.filter(req => req.status === RequestStatus.InProgress);
          break;
        case 'Completed':
          result = result.filter(req => req.status === RequestStatus.Complete);
          break;
        default:
          break;
      }
      
      // Sort by priority (high to low) and then by date (newest first)
      result.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      });
      
      return result;
    }, [activeTab, tenantRequests]);

    // Apply search and advanced filters
    const filteredBySearch = useMemo(() => {
      let results = filteredRequests;
    return [...filteredBySearch].sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredBySearch, sortConfig]);

  const tabs: TabType[] = ['Current', 'In progress', 'Completed'];

  // Get unique buildings for filter
  const uniqueBuildings = useMemo(() => {
    const buildings = new Set(tenantRequests.map(req => req.buildingId));
    return Array.from(buildings);
  }, [tenantRequests]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Requests</h1>
        {tenantBuilding && tenantUnit && (
          <p className="text-gray-600">
            For {tenantBuilding.name}, Unit {tenantUnit.unitNumber}
          </p>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-1/2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Service Request
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { id: 'Current', label: 'Current', count: tenantRequests.filter(req => req.status === RequestStatus.Pending).length },
            { id: 'In progress', label: 'In Progress', count: tenantRequests.filter(req => req.status === RequestStatus.InProgress).length },
            { id: 'Completed', label: 'Completed', count: tenantRequests.filter(req => req.status === RequestStatus.Complete).length }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center justify-center flex-1 transition-colors ${activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Request List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
                <Wrench className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {activeTab === 'Current'
                  ? 'No pending service requests'
                  : `No ${activeTab.toLowerCase()} service requests`}
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                {activeTab === 'Current'
                  ? 'You currently have no pending service requests. Click the button below to submit a new request.'
                  : `You have no ${activeTab.toLowerCase()} service requests at this time.`}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(true)}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Plus className="-ml-1 mr-2 h-4 w-4" />
                  New Service Request
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Wrench className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{request.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{request.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusPill status={request.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.requestDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => onSelectServiceRequest(request.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* New Service Request Modal */}
        {showNewRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-atkinson text-text-main">New Service Request</h2>
                <button onClick={() => setShowNewRequestModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                // Create new service request
                onAddServiceRequest({
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  priority: (formData.get('priority') as 'High' | 'Medium' | 'Low') || 'Medium',
                  tenantId: tenantProfile.id,
                  buildingId: tenantRequests[0]?.buildingId || 'BLDG-001',
                  unitId: tenantRequests[0]?.unitNumber || 'A1',
                });
                
                setShowNewRequestModal(false);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="E.g., Leaking faucet in kitchen"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent">
                      <option value="">Select a category</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="hvac">HVAC</option>
                      <option value="appliance">Appliance</option>
                      <option value="general">General Maintenance</option>
                      <option value="pest">Pest Control</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select name="priority" defaultValue="Medium" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent">
                      <option value="Low">Low - Can wait a few days</option>
                      <option value="Medium">Medium - Should be addressed soon</option>
                      <option value="High">High - Urgent attention needed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      placeholder="Please describe the issue in detail..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="E.g., Kitchen, Master Bathroom"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photos (Optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-pink transition-colors cursor-pointer">
                      <p className="text-sm text-gray-500">Click to upload photos or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                            <thead className="bg-white border-b border-gray-200">
                                <tr>
                                    <SortableHeader columnKey="id" sortConfig={sortConfig as any} requestSort={requestSort}>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">SERVICE REQUEST #</span>
                                    </SortableHeader>
                                    <SortableHeader columnKey="buildingId" sortConfig={sortConfig as any} requestSort={requestSort}>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">BUILDING #</span>
                                    </SortableHeader>
                                    <SortableHeader columnKey="unitNumber" sortConfig={sortConfig as any} requestSort={requestSort}>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT #</span>
                                    </SortableHeader>
                                    <SortableHeader columnKey="assignedContact" sortConfig={sortConfig as any} requestSort={requestSort}>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">ASSIGNED CONTACT</span>
                                    </SortableHeader>
                                    <SortableHeader columnKey="requestCount" sortConfig={sortConfig as any} requestSort={requestSort}>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">REQUESTS #</span>
                                    </SortableHeader>
                                    <SortableHeader columnKey="requestDate" sortConfig={sortConfig as any} requestSort={requestSort}>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">REQUEST DATE</span>
                                    </SortableHeader>
                                    <SortableHeader columnKey="status" sortConfig={sortConfig as any} requestSort={requestSort}>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">REQUEST STATUS</span>
                                    </SortableHeader>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => onSelectServiceRequest(request.id)} className="text-blue-600 hover:underline font-medium">
                                                {request.id}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.buildingId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.unitNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><ContactCell contact={request.assignedContact} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.requestCount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.requestDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusPill status={request.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            {/* New Service Request Modal */}
            {showNewRequestModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-atkinson text-text-main">New Service Request</h2>
                            <button onClick={() => setShowNewRequestModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            
                            // Create new service request
                            onAddServiceRequest({
                                title: formData.get('title') as string,
                                description: formData.get('description') as string,
                                priority: (formData.get('priority') as 'High' | 'Medium' | 'Low') || 'Medium',
                                tenantId: tenantProfile.id,
                                buildingId: tenantRequests[0]?.buildingId || 'BLDG-001',
                                unitId: tenantRequests[0]?.unitNumber || 'A1',
                            });
                            
                            setShowNewRequestModal(false);
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        placeholder="E.g., Leaking faucet in kitchen"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select name="category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent">
                                        <option value="">Select a category</option>
                                        <option value="plumbing">Plumbing</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="hvac">HVAC</option>
                                        <option value="appliance">Appliance</option>
                                        <option value="general">General Maintenance</option>
                                        <option value="pest">Pest Control</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select name="priority" defaultValue="Medium" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent">
                                        <option value="Low">Low - Can wait a few days</option>
                                        <option value="Medium">Medium - Should be addressed soon</option>
                                        <option value="High">High - Urgent attention needed</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={4}
                                        placeholder="Please describe the issue in detail..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="E.g., Kitchen, Master Bathroom"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Photos (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-pink transition-colors cursor-pointer">
                                        <p className="text-sm text-gray-500">Click to upload photos or drag and drop</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowNewRequestModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};
