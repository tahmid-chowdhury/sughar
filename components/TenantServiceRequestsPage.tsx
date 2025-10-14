
import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { ServiceRequest, RequestStatus, AppData, User } from '../types';
import { SlidersHorizontal, Plus, X, Search } from './icons';
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

export const TenantServiceRequestsPage: React.FC<TenantServiceRequestsPageProps> = ({ currentUser, onSelectServiceRequest, appData, onAddServiceRequest }) => {
    const [activeTab, setActiveTab] = useState<TabType>('Current');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [showNewRequestModal, setShowNewRequestModal] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBuilding, setFilterBuilding] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    // Find tenant profile for current user
    const tenantProfile = appData.tenants.find(t => t.name === currentUser.name);
    
    if (!tenantProfile) {
        return (
            <div className="container mx-auto text-center p-8">
                <h2 className="text-2xl text-text-secondary">Tenant profile not found.</h2>
            </div>
        );
    }

    // Filter service requests to show only tenant's requests
    const tenantRequests = useMemo(() => {
        return appData.serviceRequests
            .filter(req => req.tenantId === tenantProfile.id)
            .map(req => {
                const building = appData.buildings.find(b => b.id === req.buildingId);
                const unit = appData.units.find(u => u.id === req.unitId);
                return {
                    ...req,
                    buildingId: building?.id || req.buildingId,
                    unitNumber: unit?.unitNumber || req.unitId,
                    requestCount: tenantProfile.requests || 0,
                }
            });
    }, [appData, tenantProfile.id, tenantProfile.requests]);

    // Filter by tab
    const filteredRequests = useMemo(() => {
        switch (activeTab) {
            case 'Current':
                return tenantRequests.filter(req => req.status === RequestStatus.Pending);
            case 'In progress':
                return tenantRequests.filter(req => req.status === RequestStatus.InProgress);
            case 'Completed':
                return tenantRequests.filter(req => req.status === RequestStatus.Complete);
            default:
                return tenantRequests;
        }
    }, [tenantRequests, activeTab]);

    // Sort function
    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Apply search and advanced filters
    const filteredBySearch = useMemo(() => {
        let results = filteredRequests;
        
        // Search filter
        if (searchQuery) {
            results = results.filter(req => 
                req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.buildingId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Building filter
        if (filterBuilding !== 'all') {
            results = results.filter(req => req.buildingId === filterBuilding);
        }
        
        // Priority filter
        if (filterPriority !== 'all') {
            results = results.filter(req => req.priority === filterPriority);
        }
        
        return results;
    }, [filteredRequests, searchQuery, filterBuilding, filterPriority]);
    
    // Apply sorting
    const sortedRequests = useMemo(() => {
        if (!sortConfig) return filteredBySearch;
        
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
        <div className="container mx-auto">
            <header className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold font-atkinson text-text-main">Service Requests</h1>
                <button 
                    onClick={() => setShowNewRequestModal(true)}
                    className="flex items-center bg-brand-pink text-white font-bold py-2.5 px-4 rounded-lg hover:bg-pink-600 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Request
                </button>
            </header>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                            ${
                                activeTab === tab
                                    ? 'border-brand-pink text-brand-pink'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <Card className="!p-0">
                <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b gap-4">
                    <div className="relative w-full md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search requests..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                        />
                    </div>
                    <button 
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
                    >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Advanced filtering
                    </button>
                </div>
                
                {/* Advanced Filters */}
                {showAdvancedFilters && (
                    <div className="px-4 py-4 bg-gray-50 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Building</label>
                                <select
                                    value={filterBuilding}
                                    onChange={(e) => setFilterBuilding(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                >
                                    <option value="all">All Buildings</option>
                                    {uniqueBuildings.map(building => (
                                        <option key={building} value={building}>{building}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilterBuilding('all');
                                        setFilterPriority('all');
                                    }}
                                    className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    {sortedRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-text-secondary">No service requests in this category</p>
                        </div>
                    ) : (
                        <table className="min-w-full">
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
