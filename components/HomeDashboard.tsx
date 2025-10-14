

import React from 'react';
import { Card } from './Card';
import { ACTION_CENTER_ITEMS } from '../constants';
import { HomeStat, ActionCenterItem, HighPriorityTenant, User, AppData, UnitStatus, RequestStatus, RentStatus, DocumentType } from '../types';
import { Search, ChevronDown, ChevronRight, HomeIcon as DefaultHomeIcon, Wrench, FileWarning, Users, DollarSign } from './icons';
import { FinancialOverviewChart } from './charts/FinancialOverviewChart';
import { ServiceRequestVolumeChart } from './charts/ServiceRequestVolumeChart';

interface HomeDashboardProps {
  setViewingTenantId: (id: string) => void;
  currentUser: User | null;
  appData: AppData;
  onNavigate: (page: string, tab?: string) => void;
}

const StatCard: React.FC<{ stat: HomeStat, onNavigate: (page: string, tab?: string) => void }> = ({ stat, onNavigate }) => {
    const colorVariants: {[key: string]: string} = {
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        green: 'bg-green-100 text-green-600',
        blue: 'bg-blue-100 text-blue-600',
    };
    const Icon = stat.icon;

    return (
        <button
            onClick={() => stat.targetPage && onNavigate(stat.targetPage, stat.targetTab)}
            disabled={!stat.targetPage}
            className="w-full text-left disabled:cursor-not-allowed group"
        >
            <Card className="group-hover:shadow-md group-hover:border-gray-300 border border-transparent transition-all h-full">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-text-secondary">{stat.label}</p>
                        <p className="text-3xl font-bold text-text-main mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${colorVariants[stat.color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
            </Card>
        </button>
    );
};

const ActionCenter: React.FC<{ onNavigate: (page: string, tab?: string) => void }> = ({ onNavigate }) => (
    <Card className="h-full">
        <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Action Center</h3>
        <div className="space-y-3">
            {ACTION_CENTER_ITEMS.map((item, index) => (
                <button 
                    key={index}
                    onClick={() => item.targetPage && onNavigate(item.targetPage, item.targetTab)}
                    disabled={!item.targetPage}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${item.isAlert ? 'bg-pink-50 hover:bg-pink-100' : 'hover:bg-gray-50'} ${!item.targetPage ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                    <item.icon className={`w-5 h-5 mr-3 ${item.isAlert ? 'text-brand-pink' : 'text-text-secondary'}`} />
                    <span className={`font-semibold text-sm ${item.isAlert ? 'text-brand-pink' : 'text-text-main'}`}>{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </button>
            ))}
        </div>
    </Card>
);

const HighPriorityTenants: React.FC<{ tenants: HighPriorityTenant[], setViewingTenantId: (id: string) => void }> = ({ tenants, setViewingTenantId }) => (
    <Card>
        <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">High-Priority Tenants</h3>
        <div className="space-y-2">
            {tenants.map((tenant) => (
                <button key={tenant.id} onClick={() => setViewingTenantId(tenant.id)} className="w-full flex items-center p-2 rounded-lg hover:bg-gray-50 text-left">
                    <img src={tenant.avatar} alt={tenant.name} className="w-9 h-9 rounded-full"/>
                    <div className="ml-3 flex-grow">
                        <p className="text-sm font-bold text-text-main">{tenant.name}</p>
                        <p className="text-xs text-text-secondary">{tenant.unit}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-sm font-bold text-red-500">{tenant.daysOverdue} days</p>
                         <p className="text-xs text-text-secondary">Overdue</p>
                    </div>
                </button>
            ))}
        </div>
    </Card>
);

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ setViewingTenantId, currentUser, appData, onNavigate }) => {
  
    const userName = currentUser ? currentUser.name.split(' ')[0] : 'User';
    
    // Dynamically calculate stats from appData
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const openRequests = appData.serviceRequests.filter(sr => sr.status !== RequestStatus.Complete).length;
    const vacantUnits = appData.units.filter(u => u.status === UnitStatus.Vacant).length;
    const leasesExpired = appData.units.filter(u => u.leaseEndDate && new Date(u.leaseEndDate) < today).length;
    const leasesEndingSoon = appData.units.filter(u => u.leaseEndDate && new Date(u.leaseEndDate) >= today && new Date(u.leaseEndDate) <= next30Days).length;
    
    const revenueThisMonth = appData.documents
        .filter(doc => {
            if (!doc.uploadDate || !doc.amount || doc.category !== 'Income') return false;
            const docDate = new Date(doc.uploadDate);
            return docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear;
        })
        .reduce((sum, doc) => sum + (doc.amount || 0), 0);

    const highPriorityTenants: HighPriorityTenant[] = appData.tenants
        .filter(t => t.rentStatus === RentStatus.Overdue)
        .map(t => ({
            id: t.id,
            name: t.name,
            avatar: t.avatar,
            unit: `${t.building}, ${t.unit}`,
            daysOverdue: Math.floor(Math.random() * 10) + 1, // Mock overdue days
        }));

    const stats: HomeStat[] = [
        { label: 'Revenue This Month', value: `BDT ${revenueThisMonth.toLocaleString()}`, icon: DollarSign, color: 'blue', targetPage: 'financials' },
        { label: 'Open Service Requests', value: openRequests.toString(), icon: Wrench, color: 'orange', targetPage: 'service-requests' },
        { label: 'Vacant Units', value: vacantUnits.toString(), icon: DefaultHomeIcon, color: 'red', targetPage: 'buildings', targetTab: 'Units' },
        { label: 'Leases Expired', value: leasesExpired.toString(), icon: FileWarning, color: 'yellow', targetPage: 'leases-expired' },
        { label: 'Leases Ending Soon', value: leasesEndingSoon.toString(), icon: Users, color: 'green', targetPage: 'leases-ending-soon' },
    ];

    const financialOverview = appData.documents
        .filter(d => d.category === 'Income' && d.amount)
        .reduce((acc, doc) => {
            const month = new Date(doc.uploadDate).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + doc.amount!;
            return acc;
        }, {} as { [key: string]: number });
        
    const financialOverviewData = Object.entries(financialOverview).map(([month, profit]) => ({ month, profit }));


    // FIX: Correctly type the initial value for the reduce function to resolve spread operator error.
    const serviceRequestVolume = appData.serviceRequests.reduce((acc: { [key: string]: { new: number, completed: number } }, sr) => {
        const month = new Date(sr.requestDate).toLocaleString('default', { month: 'short' });
        if (!acc[month]) acc[month] = { new: 0, completed: 0 };
        acc[month].new++;
        if (sr.status === RequestStatus.Complete && sr.completionDate) {
            const completionMonth = new Date(sr.completionDate).toLocaleString('default', { month: 'short' });
            if (completionMonth === month) {
                 acc[month].completed++;
            }
        }
        return acc;
    }, {});

    const serviceRequestVolumeData = Object.entries(serviceRequestVolume).map(([month, data]) => ({ month, ...data }));


  return (
    <div className="container mx-auto">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-atkinson text-text-main">
            Hello {userName} 👋
          </h1>
          <p className="text-text-secondary mt-1">Here's all your metrics at a glance!</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search anything..."
                className="w-full md:w-72 pl-10 pr-4 py-2 border border-gray-200 bg-card-bg rounded-lg text-sm focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
            />
        </div>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map(stat => (
            <StatCard key={stat.label} stat={stat} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 flex flex-col space-y-8">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-atkinson text-xl font-bold text-text-main">Financial Overview</h3>
                    <button className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50">
                        Quarterly
                        <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                </div>
                <div className="h-72">
                    <FinancialOverviewChart data={financialOverviewData} />
                </div>
            </Card>
             <Card>
                <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Service Request Volume</h3>
                <div className="h-72">
                    <ServiceRequestVolumeChart data={serviceRequestVolumeData} />
                </div>
            </Card>
        </div>
        <div className="lg:col-span-2 flex flex-col space-y-8">
            <ActionCenter onNavigate={onNavigate} />
            <HighPriorityTenants tenants={highPriorityTenants} setViewingTenantId={setViewingTenantId} />
        </div>
      </div>
    </div>
  );
};
