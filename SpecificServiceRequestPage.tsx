
import React, { useState } from 'react';
// FIX: Corrected import path
import { Card } from './components/Card';
// FIX: Corrected import path
import { RequestStatus, ChatMessage, AppData } from './types';
// FIX: Corrected import path
import { ArrowLeft, Paperclip, Image as ImageIcon } from './components/icons';
// FIX: Corrected import path
import { SpecificServiceRequestImagesPage } from './components/SpecificServiceRequestImagesPage';
// FIX: Corrected import path
import { SpecificServiceRequestActivityLogPage } from './components/SpecificServiceRequestActivityLogPage';
// FIX: Corrected import path
import { SpecificServiceRequestContactsPage } from './components/SpecificServiceRequestContactsPage';

const StatusPill: React.FC<{ status: RequestStatus; isLarge?: boolean }> = ({ status, isLarge = false }) => {
    const styles = {
        [RequestStatus.Complete]: 'bg-status-success text-status-success-text',
        [RequestStatus.InProgress]: 'bg-status-warning text-status-warning-text',
        [RequestStatus.Pending]: 'bg-status-error text-status-error-text',
    };
     const sizeClass = isLarge ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs';

    return (
        <span className={`font-medium rounded-full ${styles[status]} ${sizeClass} inline-flex items-center`}>
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'currentColor' }}></span>
            {status}
        </span>
    );
};

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isSelf = message.isSelf;
    return (
        <div className={`flex items-start gap-3 ${isSelf ? 'justify-end' : 'justify-start'}`}>
            {!isSelf && <img src={message.sender.avatar} alt={message.sender.name} className="w-8 h-8 rounded-full mt-1"/>}
            <div className={`max-w-xs md:max-w-md p-4 rounded-xl ${isSelf ? 'bg-gray-100 text-gray-800' : 'bg-white text-gray-800 shadow-sm'}`}>
                <p className="text-sm">{message.message}</p>
            </div>
            {isSelf && <img src={message.sender.avatar} alt={message.sender.name} className="w-8 h-8 rounded-full mt-1"/>}
        </div>
    );
};

const DetailItem: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div>
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="text-sm font-medium text-text-main">{value}</p>
    </div>
);

const ServiceRequestSummary: React.FC<{
    requestData: AppData['serviceRequests'][0]; 
    requester: AppData['tenants'][0]; 
    building: AppData['buildings'][0];
}> = ({requestData, requester, building}) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <div className="flex items-center mb-6">
                    <img src={requester.avatar} alt={requester.name} className="w-12 h-12 rounded-full" />
                    <div className="ml-4">
                        <span className="font-bold text-lg text-text-main">{requester.name}</span>
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{requester.rating}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 border-b pb-6">
                    <DetailItem label="Request Date" value={requestData.requestDate} />
                    <DetailItem label="Building Name/ID" value={building.name} />
                    <DetailItem label="Service Category" value="Plumbing" />
                    <DetailItem label="Priority" value={requestData.priority} />
                </div>
                <div>
                    <h4 className="font-bold text-text-main mb-2">Description:</h4>
                    <p className="text-text-secondary leading-relaxed">{requestData.description}</p>
                </div>
            </Card>
        </div>
        
        {/* Right Column */}
        <div className="lg:col-span-1">
            <Card className="flex flex-col h-full">
                <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Comments</h3>
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 bg-gray-50 p-4 rounded-lg">
                   {/* Mock comments */}
                </div>
                <div className="mt-4 pt-4 border-t">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Type a message..."
                            className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-20 text-sm focus:ring-brand-pink focus:border-brand-pink"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                            <button className="text-gray-400 hover:text-gray-600"><Paperclip className="w-5 h-5"/></button>
                            <button className="text-gray-400 hover:text-gray-600"><ImageIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
);

interface SpecificServiceRequestPageProps {
    serviceRequestId: string;
    appData: AppData;
    onBack: () => void;
}

export const SpecificServiceRequestPage: React.FC<SpecificServiceRequestPageProps> = ({ serviceRequestId, appData, onBack }) => {
    const [activeTab, setActiveTab] = useState('Summary');
    const requestData = appData.serviceRequests.find(sr => sr.id === serviceRequestId);
    const requester = requestData ? appData.tenants.find(t => t.id === requestData.tenantId) : undefined;
    const building = requestData ? appData.buildings.find(b => b.id === requestData.buildingId) : undefined;

    if (!requestData || !requester || !building) {
        return (
            <div className="container mx-auto text-center p-8">
                <h2 className="text-2xl text-text-secondary">Service Request not found.</h2>
                <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">Go Back</button>
            </div>
        );
    }
    
    const tabs = ['Summary', 'Images', 'Activity Log', 'Contacts'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Images':
                return <SpecificServiceRequestImagesPage media={[]} />;
            case 'Activity Log':
                return <div>Activity Log Content</div>;
            case 'Contacts':
                return <div>Contacts Content</div>;
            case 'Summary':
            default:
                return <ServiceRequestSummary requestData={requestData} requester={requester} building={building} />;
        }
    };

    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Service Requests
            </button>
            
            <header className="mb-2">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">{requestData.title} | {requestData.id}</h1>
                <div className="mt-4 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                             <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                ${
                                    activeTab === tab
                                        ? 'border-brand-pink text-brand-pink'
                                        : 'border-transparent text-inactive-tab hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <div className="flex justify-end my-4">
                <StatusPill status={requestData.status} isLarge />
            </div>

            {renderContent()}
        </div>
    );
}
