
import React from 'react';
import { Card } from './Card';
import { AppData, Tenant } from '../types';
import { ArrowLeft, Mail, Phone, HomeIcon, User, Star, FileText, Check, X, Zap } from './icons';
import { TrustVerificationChart } from './charts/TrustVerificationChart';

interface TenantDetailPageProps {
  tenantId: string;
  appData: AppData;
  onBack: () => void;
}

const TenantInfoCard: React.FC<{ tenant: Tenant }> = ({ tenant }) => (
    <Card className="flex flex-col items-center text-center">
        <img src={tenant.avatar} alt={tenant.name} className="w-24 h-24 rounded-full mb-4 ring-4 ring-purple-100" />
        <h2 className="text-2xl font-bold font-atkinson text-text-main">{tenant.name}</h2>
        <div className="flex items-center text-sm text-text-secondary mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span>{tenant.rating} Star Tenant</span>
        </div>
        <div className="w-full text-left mt-6 pt-6 border-t border-gray-100 space-y-3">
             <div className="flex items-center text-sm text-text-secondary">
                <HomeIcon className="w-4 h-4 mr-3" />
                <span>{tenant.building}, Unit {tenant.unit}</span>
            </div>
            <div className="flex items-center text-sm text-text-secondary">
                <Mail className="w-4 h-4 mr-3" />
                <span>{tenant.name.split(' ').join('.').toLowerCase()}@email.com</span>
            </div>
            <div className="flex items-center text-sm text-text-secondary">
                <Phone className="w-4 h-4 mr-3" />
                <span>+880 1234-567890</span>
            </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-2 mt-4">
            <button className="bg-accent-secondary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-purple-600 text-sm">Send Message</button>
            <button className="bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300 text-sm">Call</button>
        </div>
    </Card>
);

const TrustVerificationCard: React.FC = () => (
    <Card>
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-atkinson text-lg font-bold text-text-main">SuGhar Trust Verification</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600"/>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <TrustVerificationChart score={85} />
            <div className="space-y-2">
                <div className="flex items-center text-sm"><Check className="w-4 h-4 text-green-500 mr-2"/> Identity Verified</div>
                <div className="flex items-center text-sm"><Check className="w-4 h-4 text-green-500 mr-2"/> Credit Score Checked</div>
                <div className="flex items-center text-sm"><Check className="w-4 h-4 text-green-500 mr-2"/> Background Check Passed</div>
                <div className="flex items-center text-sm"><X className="w-4 h-4 text-red-500 mr-2"/> Income Not Verified</div>
            </div>
        </div>
        <button className="w-full mt-6 text-sm font-semibold text-accent-secondary hover:underline">View Full Verification Report</button>
    </Card>
);


export const TenantDetailPage: React.FC<TenantDetailPageProps> = ({ tenantId, appData, onBack }) => {
    const tenant = appData.tenants.find(t => t.id === tenantId);

    if (!tenant) {
        return (
            <div>
                <button onClick={onBack}>Back</button>
                <p>Tenant not found.</p>
            </div>
        );
    }
    
    // NOTE: This detail data is now part of the tenant object in data.ts
    // We are keeping it here for demonstration until all parts are fully dynamic
    // const detailData = TENANT_DETAIL_DATA; 

    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tenants
            </button>
             <header className="mb-8">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">{tenant.name}</h1>
                <p className="text-text-secondary mt-1">Tenant Profile & History</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                    <div className="space-y-8">
                        <TenantInfoCard tenant={tenant} />
                        <TrustVerificationCard />
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    {/* These cards will be filled with dynamic data in a future step */}
                    <Card>
                         <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Employment & Education</h3>
                    </Card>
                     <Card>
                         <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Financial Summary</h3>
                    </Card>
                     <Card>
                         <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Uploaded Documents</h3>
                    </Card>
                </div>
            </div>
        </div>
    );
};