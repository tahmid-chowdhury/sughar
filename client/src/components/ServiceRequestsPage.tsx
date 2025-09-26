import React, { useState } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { SERVICE_REQUESTS_DATA } from '../constants';
import { ServiceRequest, RequestStatus } from '../types';
import { SlidersHorizontal, ArrowDown } from './icons';
import { SpecificServiceRequestPage } from './SpecificServiceRequestPage';

const SortableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
       <div className="flex items-center">
            <span>{children}</span>
            <ArrowDown className="w-3 h-3 ml-1 text-gray-400" />
       </div>
    </th>
);

const ContactCell = ({ contact }: { contact: { name: string; avatar: string; } }) => (
    <div className="flex items-center">
        <img className="h-8 w-8 rounded-full object-cover" src={contact.avatar} alt={contact.name} />
        <span className="ml-3 font-medium text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm">{contact.name}</span>
    </div>
);

const StatusPill = ({ status }: { status: RequestStatus }) => {
    const styles = {
        [RequestStatus.Complete]: 'bg-status-success text-status-success-text',
        [RequestStatus.InProgress]: 'bg-status-warning text-status-warning-text',
        [RequestStatus.Pending]: 'bg-status-error text-status-error-text',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

export const ServiceRequestsPage = () => {
    const [activeTab, setActiveTab] = useState('Current');
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    // In a real app, you would filter data based on activeTab
    const requestsData = SERVICE_REQUESTS_DATA;

    const handleRequestClick = (id: string) => {
        // For now, we only have data for SR-001, so we always navigate to that.
        // In a real app, you'd use the clicked id.
        setSelectedRequestId('SR-001');
    };

    const handleBack = () => {
        setSelectedRequestId(null);
    };

    if (selectedRequestId) {
        return <SpecificServiceRequestPage serviceRequestId={selectedRequestId} onBack={handleBack} />;
    }


    return (
        <div className="container mx-auto">
            <Header
                title="Service Requests"
                tabs={['Current', 'In progress', 'Completed']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            <Card className="!p-0">
                <div className="flex justify-end p-4">
                    <button className="flex items-center text-sm font-medium text-gray-400 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-100">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Advanced filtering
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <SortableHeader>Service Request</SortableHeader>
                                <SortableHeader>Building</SortableHeader>
                                <SortableHeader>Unit</SortableHeader>
                                <SortableHeader>Assigned Contact</SortableHeader>
                                <SortableHeader>Requests</SortableHeader>
                                <SortableHeader>Request Date</SortableHeader>
                                <SortableHeader>Request Status</SortableHeader>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requestsData.map((request: ServiceRequest) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        <button onClick={() => handleRequestClick(request.id)} className="text-blue-600 hover:underline">
                                            {request.id}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{request.building}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{request.unit}</td>
                                    <td className="px-5 py-4 whitespace-nowrap"><ContactCell contact={request.assignedContact} /></td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{request.requests}</td>
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