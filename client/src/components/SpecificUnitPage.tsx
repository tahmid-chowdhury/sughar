import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { UNITS_PAGE_DATA, BUILDING_NAMES } from '../constants';
import { UnitDetail, BuildingCategory, UnitStatus, RentStatus, RequestStatus } from '../types';
import { ArrowLeft, HomeIcon, DollarSign, Calendar, Users, FileText, Wrench, Mail } from './icons';

interface SpecificUnitPageProps {
    unitId: string;
    onBack: () => void;
    setViewingTenantId?: (tenantId: string) => void;
}

const StatusPill = ({ status, type }: { status: UnitStatus | RentStatus; type: 'unit' | 'rent' }) => {
    const getStyles = () => {
        if (type === 'unit') {
            return {
                [UnitStatus.Rented]: 'bg-green-100 text-green-800',
                [UnitStatus.Vacant]: 'bg-red-100 text-red-800',
            };
        } else {
            return {
                [RentStatus.Paid]: 'bg-green-100 text-green-800',
                [RentStatus.Overdue]: 'bg-red-100 text-red-800',
                [RentStatus.Pending]: 'bg-yellow-100 text-yellow-800',
            };
        }
    };

    const styles = getStyles();
    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
            {status}
        </span>
    );
};

const CategoryPill = ({ category }: { category: BuildingCategory }) => {
    const styles = {
        [BuildingCategory.Luxury]: 'bg-yellow-100 text-yellow-800',
        [BuildingCategory.Standard]: 'bg-gray-200 text-gray-800',
        [BuildingCategory.MidRange]: 'bg-purple-100 text-purple-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[category]}`}>{category}</span>;
};

const DetailItem: React.FC<{ icon: React.ComponentType<any>; label: string; value: string | React.ReactNode; }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-500" />
        <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-medium text-gray-900">{value}</p>
        </div>
    </div>
);

export const SpecificUnitPage: React.FC<SpecificUnitPageProps> = ({ unitId, onBack, setViewingTenantId }) => {
    const [activeTab, setActiveTab] = useState('Overview');

    const unitData = useMemo(() => {
        return UNITS_PAGE_DATA.find(unit => unit.id === unitId);
    }, [unitId]);

    if (!unitData) {
        return (
            <div className="p-8">
                <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Units
                </button>
                <div className="text-center">
                    <p className="text-gray-500">Unit not found.</p>
                </div>
            </div>
        );
    }

    const buildingName = BUILDING_NAMES[unitData.buildingId] || 'Unknown Building';

    const tabs = ['Overview', 'Lease Details', 'Service Requests', 'Documents'];

    interface MockServiceRequest {
        id: string;
        title: string;
        building: string;
        unit: number;
        assignedContact: { name: string; avatar: string; };
        requestDate: string;
        status: RequestStatus;
        category: string;
        priority: string;
        urgencyScore: number;
    }

    const mockServiceRequests: MockServiceRequest[] = [
        {
            id: 'SR001',
            title: 'Leaking Faucet Repair',
            building: unitData.buildingId,
            unit: parseInt(unitData.unitNumber),
            assignedContact: unitData.tenant || { name: 'Unassigned', avatar: '' },
            requestDate: '2025-09-15',
            status: RequestStatus.Pending,
            category: 'Plumbing',
            priority: 'medium',
            urgencyScore: 5
        },
        {
            id: 'SR002',
            title: 'AC Maintenance',
            building: unitData.buildingId,
            unit: parseInt(unitData.unitNumber),
            assignedContact: unitData.tenant || { name: 'Unassigned', avatar: '' },
            requestDate: '2025-09-20',
            status: RequestStatus.Complete,
            category: 'HVAC',
            priority: 'low',
            urgencyScore: 2
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Unit Details</h3>
                            <div className="space-y-4">
                                <DetailItem icon={HomeIcon} label="Unit Number" value={unitData.unitNumber} />
                                <DetailItem icon={Users} label="Bedrooms" value={unitData.bedrooms.toString()} />
                                <DetailItem icon={FileText} label="Bathrooms" value={unitData.bathrooms.toString()} />
                                <DetailItem icon={FileText} label="Square Footage" value={`${unitData.sqft} sq ft`} />
                                <DetailItem icon={DollarSign} label="Monthly Rent" value={`৳${unitData.monthlyRent.toLocaleString()}`} />
                                <div className="flex items-center space-x-3">
                                    <HomeIcon className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                                        <CategoryPill category={unitData.category} />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                                        <StatusPill status={unitData.status} type="unit" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Tenant</h3>
                            {unitData.tenant && unitData.status === UnitStatus.Rented ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <img 
                                            src={unitData.tenant.avatar} 
                                            alt={unitData.tenant.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{unitData.tenant.name}</p>
                                            <p className="text-sm text-gray-500">Tenant ID: {unitData.tenant.id}</p>
                                        </div>
                                    </div>
                                    <DetailItem icon={Calendar} label="Lease Start" value={unitData.leaseStartDate || 'N/A'} />
                                    <DetailItem icon={Calendar} label="Lease End" value={unitData.leaseEndDate || 'N/A'} />
                                    {unitData.rentStatus && (
                                        <div className="flex items-center space-x-3">
                                            <DollarSign className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Rent Status</p>
                                                <StatusPill status={unitData.rentStatus} type="rent" />
                                            </div>
                                        </div>
                                    )}
                                    <DetailItem icon={Wrench} label="Service Requests" value={unitData.requests?.toString() || '0'} />
                                    {setViewingTenantId && (
                                        <button
                                            onClick={() => setViewingTenantId(unitData.tenant!.id)}
                                            className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            View Tenant Details
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <HomeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">This unit is currently vacant</p>
                                    <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                        List for Rent
                                    </button>
                                </div>
                            )}
                        </Card>
                    </div>
                );

            case 'Lease Details':
                return (
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Lease Information</h3>
                        {unitData.status === UnitStatus.Rented ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailItem icon={Calendar} label="Lease Start Date" value={unitData.leaseStartDate || 'N/A'} />
                                <DetailItem icon={Calendar} label="Lease End Date" value={unitData.leaseEndDate || 'N/A'} />
                                <DetailItem icon={DollarSign} label="Monthly Rent" value={`৳${unitData.monthlyRent.toLocaleString()}`} />
                                <DetailItem icon={DollarSign} label="Security Deposit" value={`৳${(unitData.monthlyRent * 2).toLocaleString()}`} />
                                <div className="col-span-full">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Lease Documents</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                            <span className="text-sm text-gray-700">Signed Lease Agreement</span>
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                            <span className="text-sm text-gray-700">Security Deposit Receipt</span>
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No active lease for this unit</p>
                            </div>
                        )}
                    </Card>
                );

            case 'Service Requests':
                return (
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Requests</h3>
                        {mockServiceRequests.length > 0 ? (
                            <div className="space-y-4">
                                {mockServiceRequests.map((request) => (
                                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-md font-medium text-gray-900">{request.title}</h4>
                                                <p className="text-sm text-gray-500 mt-1">Request ID: {request.id}</p>
                                                <p className="text-sm text-gray-500">Category: {request.category}</p>
                                                <p className="text-sm text-gray-500">Date: {request.requestDate}</p>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <StatusPill status={request.status as any} type="unit" />
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                    request.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                    request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {request.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No service requests for this unit</p>
                            </div>
                        )}
                    </Card>
                );

            case 'Documents':
                return (
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Unit Documents</h3>
                        <div className="space-y-3">
                            {[
                                'Unit Inspection Report',
                                'Lease Agreement',
                                'Security Deposit Receipt',
                                'Move-in Checklist',
                                'Utility Bills',
                            ].map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                        <span className="text-sm text-gray-700">{doc}</span>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                                </div>
                            ))}
                        </div>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-8">
            <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Units
            </button>

            <Header title={`Unit ${unitData.unitNumber}`} />
            <p className="text-lg text-gray-600 mb-6">{buildingName} • {unitData.category}</p>

            <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {renderTabContent()}
        </div>
    );
};