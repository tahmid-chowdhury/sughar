

import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { CurrentTenantsPage } from './CurrentTenantsPage';
import { TenantApplicationsPage } from './TenantApplicationsPage';
// FIX: Import RentStatusData to explicitly type rentStatusData array.
import { AppData, TenantDashboardStat, RentStatus, UnitStatus, RentStatusData } from '../types';
import { Users, UserPlus, FileWarning, HomeIcon, Wrench } from './icons';
import { RentStatusChart } from './charts/RentStatusChart';
import { QUICK_VIEW_ACTIONS, RENT_STATUS_CHART_DATA } from '../constants';

interface TenantsDashboardProps {
  setViewingTenantId: (id: string) => void;
  onSelectBuilding: (buildingId: string) => void;
  onSelectUnit: (unitId: string) => void;
  appData: AppData;
  initialTab?: string;
}

const StatCard: React.FC<{ stat: TenantDashboardStat }> = ({ stat }) => (
    <Card className="flex items-center p-4">
      <div className={`p-3 rounded-full ${stat.bgColor}`}>
        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
      </div>
      <div className="ml-4">
        <p className="text-2xl font-bold text-text-main">{stat.value}</p>
        <p className="text-sm text-text-secondary">{stat.label}</p>
      </div>
    </Card>
);

const OverviewContent: React.FC<{ appData: AppData }> = ({ appData }) => {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const stats: TenantDashboardStat[] = [
        { icon: Users, label: 'Total Tenants', value: appData.tenants.length.toString(), bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
        // FIX: Corrected property name from 'applications' to 'rentalApplications' to match AppData type.
        { icon: UserPlus, label: 'New Applicants', value: appData.rentalApplications.length.toString(), bgColor: 'bg-green-100', iconColor: 'text-green-600' },
        { icon: FileWarning, label: 'Leases Ending Soon', value: appData.units.filter(u => u.leaseEndDate && new Date(u.leaseEndDate) > today && new Date(u.leaseEndDate) <= next30Days).length.toString(), bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        { icon: HomeIcon, label: 'Vacant Units', value: appData.units.filter(u => u.status === UnitStatus.Vacant).length.toString(), bgColor: 'bg-red-100', iconColor: 'text-red-600' },
        { icon: Wrench, label: 'Open Requests', value: appData.serviceRequests.filter(sr => sr.status !== 'Complete').length.toString(), bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    ];
    
    const onTimeCount = appData.tenants.filter(t => t.rentStatus === RentStatus.Paid).length;
    const lateCount = appData.tenants.filter(t => t.rentStatus === RentStatus.Overdue).length;
    const totalWithStatus = onTimeCount + lateCount;
    // FIX: Explicitly type rentStatusData to match the RentStatusData[] type expected by RentStatusChart.
    const rentStatusData: RentStatusData[] = [
        { name: 'On Time', value: totalWithStatus > 0 ? Math.round((onTimeCount / totalWithStatus) * 100) : 100 },
        { name: 'Late', value: totalWithStatus > 0 ? Math.round((lateCount / totalWithStatus) * 100) : 0 },
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                {stats.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Quick View</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {QUICK_VIEW_ACTIONS.map((action) => (
                            action.isFullText ? (
                                <button key={action.label} className="col-span-2 md:col-span-4 bg-accent-secondary text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition-colors">
                                    {action.label}
                                </button>
                            ) : (
                                <Card key={action.label} className="text-center !shadow-none border hover:border-gray-300">
                                    <p className="text-3xl font-bold text-text-main">{action.value}</p>
                                    <p className="text-sm text-text-secondary mt-1">{action.label}</p>
                                </Card>
                            )
                        ))}
                    </div>
                </Card>
                <Card>
                    <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Overall Rent Status</h3>
                    <div className="h-64">
                        <RentStatusChart data={rentStatusData} />
                    </div>
                </Card>
            </div>
        </>
    );
};

export const TenantsDashboard: React.FC<TenantsDashboardProps> = ({ setViewingTenantId, onSelectBuilding, onSelectUnit, appData, initialTab }) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'Overview');
    
    useEffect(() => {
        if(initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);


    const renderContent = () => {
        switch (activeTab) {
            case 'Current Tenants':
                return <CurrentTenantsPage setViewingTenantId={setViewingTenantId} />;
            case 'Applications':
                return <TenantApplicationsPage onSelectBuilding={onSelectBuilding} onSelectUnit={onSelectUnit} appData={appData} />;
            case 'Overview':
            default:
                return <OverviewContent appData={appData} />;
        }
    };

    return (
        <div className="container mx-auto">
            <Header
                title="Tenants Dashboard"
                tabs={['Overview', 'Current Tenants', 'Applications']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            {renderContent()}
        </div>
    );
};
