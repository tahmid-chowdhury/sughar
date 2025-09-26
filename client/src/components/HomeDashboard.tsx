import React from 'react';
import { Card } from './Card';
import { 
    HOME_STATS,
    FINANCIAL_OVERVIEW_DATA,
    SERVICE_REQUEST_VOLUME_DATA,
    ACTION_CENTER_ITEMS,
    HIGH_PRIORITY_TENANTS_DATA,
} from '../constants';
import { HomeStat, ActionCenterItem, HighPriorityTenant } from '../types';
import { Search, ChevronDown, ChevronRight } from './icons';
import { FinancialOverviewChart } from './charts/FinancialOverviewChart';
import { ServiceRequestVolumeChart } from './charts/ServiceRequestVolumeChart';

interface HomeDashboardProps {
  setViewingTenantId: (id: string) => void;
}

const StatCard: React.FC<{ stat: HomeStat }> = ({ stat }) => {
    const colorVariants = {
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        green: 'bg-green-100 text-green-600',
    };
    return (
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                    <p className="text-3xl font-bold text-text-main mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorVariants[stat.color]}`}>
                    <stat.icon className="w-6 h-6" />
                </div>
            </div>
        </Card>
    );
};

const ActionCenter: React.FC = () => (
    <Card className="h-full">
        <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Action Center</h3>
        <div className="space-y-3">
            {ACTION_CENTER_ITEMS.map((item, index) => (
                <button key={index} className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${item.isAlert ? 'bg-pink-50 hover:bg-pink-100' : 'hover:bg-gray-50'}`}>
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


export const HomeDashboard: React.FC<HomeDashboardProps> = ({ setViewingTenantId }) => {
  return (
    <div className="container mx-auto">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-atkinson text-text-main">
            Hello Famu 👋
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {HOME_STATS.map(stat => (
            <StatCard key={stat.label} stat={stat} />
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
                    <FinancialOverviewChart data={FINANCIAL_OVERVIEW_DATA} />
                </div>
            </Card>
             <Card>
                <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Service Request Volume</h3>
                <div className="h-72">
                    <ServiceRequestVolumeChart data={SERVICE_REQUEST_VOLUME_DATA} />
                </div>
            </Card>
        </div>
        <div className="lg:col-span-2 flex flex-col space-y-8">
            <ActionCenter />
            <HighPriorityTenants tenants={HIGH_PRIORITY_TENANTS_DATA} setViewingTenantId={setViewingTenantId} />
        </div>
      </div>
    </div>
  );
};