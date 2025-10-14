
import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { ServiceRequest, RequestStatus, AppData } from '../types';
import { SlidersHorizontal, Search, ChevronDown } from './icons';
import { useTable } from '../hooks/useTable';
import { SortableHeader } from './SortableHeader';

interface ServiceRequestsPageProps {
  onSelectBuilding: (id: string) => void;
  onSelectServiceRequest: (id: string) => void;
  appData: AppData;
}

const ContactCell = ({ contact }: { contact?: { name: string; avatar: string; } }) => {
    if (!contact) return <span className="text-gray-400">Unassigned</span>;
    return (
        <div className="flex items-center">
            <img className="h-8 w-8 rounded-full object-cover" src={contact.avatar} alt={contact.name} />
            <span className="ml-3 font-medium text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm">{contact.name}</span>
        </div>
    );
}

const StatusPill = ({ status }: { status: RequestStatus }) => {
    const styles = {
        [RequestStatus.Complete]: 'bg-status-success text-status-success-text',
        [RequestStatus.InProgress]: 'bg-status-warning text-status-warning-text',
        [RequestStatus.Pending]: 'bg-status-error text-status-error-text',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

export const ServiceRequestsPage: React.FC<ServiceRequestsPageProps> = ({ onSelectBuilding, onSelectServiceRequest, appData }) => {
    const [statusFilter, setStatusFilter] = useState<RequestStatus | 'All'>('All');

    const requestsWithDetails = React.useMemo(() => {
        return appData.serviceRequests.map(req => {
            const building = appData.buildings.find(b => b.id === req.buildingId);
            const unit = appData.units.find(u => u.id === req.unitId);
            return {
                ...req,
                buildingName: building?.name || req.buildingId,
                unitNumber: unit?.unitNumber || req.unitId,
                assignedContactName: req.assignedContact?.name || '',
            }
        });
    }, [appData]);

    type ServiceRequestWithDetails = ServiceRequest & { buildingName: string; unitNumber: string; assignedContactName: string; };

    const { items, requestSort, sortConfig, searchQuery, setSearchQuery } = useTable<ServiceRequestWithDetails>(
        requestsWithDetails,
        ['id', 'title', 'buildingName', 'unitNumber', 'assignedContactName']
    );

    const filteredByStatus = React.useMemo(() => {
        if (statusFilter === 'All') {
            return items;
        }
        return items.filter(item => item.status === statusFilter);
    }, [items, statusFilter]);

    return (
        <div className="container mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">Service Requests</h1>
            </header>
            <Card className="!p-0">
                 <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4 border-b">
                    <div className="relative w-full md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search requests..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
                        />
                    </div>
                    <div className="flex w-full md:w-auto items-center gap-4">
                        <div className="relative w-full md:w-auto">
                           <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'All')}
                                className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                           >
                                <option value="All">All Statuses</option>
                                <option value={RequestStatus.Pending}>Pending</option>
                                <option value={RequestStatus.InProgress}>In Progress</option>
                                <option value={RequestStatus.Complete}>Complete</option>
                           </select>
                           <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <button className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filters
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <SortableHeader<ServiceRequestWithDetails> columnKey="id" sortConfig={sortConfig} requestSort={requestSort}>Request ID</SortableHeader>
                                <SortableHeader<ServiceRequestWithDetails> columnKey="title" sortConfig={sortConfig} requestSort={requestSort}>Title</SortableHeader>
                                <SortableHeader<ServiceRequestWithDetails> columnKey="buildingName" sortConfig={sortConfig} requestSort={requestSort}>Building</SortableHeader>
                                <SortableHeader<ServiceRequestWithDetails> columnKey="unitNumber" sortConfig={sortConfig} requestSort={requestSort}>Unit</SortableHeader>
                                <SortableHeader<ServiceRequestWithDetails> columnKey="assignedContactName" sortConfig={sortConfig} requestSort={requestSort}>Assigned</SortableHeader>
                                <SortableHeader<ServiceRequestWithDetails> columnKey="requestDate" sortConfig={sortConfig} requestSort={requestSort}>Date</SortableHeader>
                                <SortableHeader<ServiceRequestWithDetails> columnKey="status" sortConfig={sortConfig} requestSort={requestSort}>Status</SortableHeader>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredByStatus.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        <button onClick={() => onSelectServiceRequest(request.id)} className="text-blue-600 hover:underline">
                                            {request.id}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{request.title}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => onSelectBuilding(request.buildingId)} className="text-blue-600 hover:underline">
                                            {request.buildingName}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{request.unitNumber}</td>
                                    <td className="px-5 py-4 whitespace-nowrap"><ContactCell contact={request.assignedContact} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{request.requestDate}</td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <StatusPill status={request.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};