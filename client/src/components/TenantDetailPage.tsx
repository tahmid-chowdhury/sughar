import React, { useState } from 'react';
import { Card } from './Card';
import { TENANT_DETAIL_DATA } from '../constants';
import { TenantDetailData } from '../types';
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, MessageSquare } from './icons';
import { TrustVerificationChart } from './charts/TrustVerificationChart';

interface TenantDetailPageProps {
  tenantId: string;
  onBack: () => void;
}

const DetailSection: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({ title, children, className }) => (
    <div className={className}>
        <h3 className="text-xs text-text-secondary uppercase font-semibold tracking-wider mb-2">{title}</h3>
        {children}
    </div>
);

export const TenantDetailPage: React.FC<TenantDetailPageProps> = ({ tenantId, onBack }) => {
    // Always show Radhika Islam's data as a static placeholder.
    const [activeTab, setActiveTab] = useState('Buildings');
    const tenantData = TENANT_DETAIL_DATA['radhika-islam'];

    if (!tenantData) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h2 className="text-2xl text-text-secondary">Tenant data not available.</h2>
                <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">Go Back</button>
            </div>
        );
    }
    
    const { 
        name, buildingName, unitName, avatarUrl, education, employment, references, 
        documents, notes, trustAndVerification, timeline, financialSummary 
    } = tenantData;
    
    const depositPercentage = (financialSummary.deposit / financialSummary.monthlyRent) * 100;

    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </button>

            <header className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-atkinson text-text-main">{name} | Tenant | {buildingName} | Unit {unitName}</h1>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">Unit A-023</span>
                    <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">Sotchoio</span>
                    <button className="bg-accent-secondary text-white font-bold py-1.5 px-6 rounded-lg hover:bg-purple-600 transition-colors">Approve</button>
                    <button className="bg-gray-200 text-gray-800 font-bold py-1.5 px-6 rounded-lg hover:bg-gray-300 transition-colors">Reject</button>
                </div>
            </header>
            
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {['Overview', 'Buildings', 'Applications'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                ${activeTab === tab ? 'border-brand-pink text-brand-pink' : 'border-transparent text-inactive-tab hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                {/* Column 1 */}
                <div className="xl:col-span-1 space-y-6">
                    <Card className="text-center">
                        <img src={avatarUrl} alt={name} className="w-24 h-24 rounded-full mx-auto mb-4"/>
                        <h2 className="text-xl font-bold font-atkinson text-text-main">{name}</h2>
                        <div className="mt-4 pt-4 border-t border-gray-100 text-left space-y-4">
                           <DetailSection title="Education">
                                <p className="font-semibold text-text-main text-sm">{education.degree}</p>
                                <p className="text-sm text-text-secondary">{education.university} <span className="float-right">{education.years}</span></p>
                           </DetailSection>
                           <DetailSection title="Employment / Income">
                                <p className="font-semibold text-text-main text-sm">{employment.role}</p>
                                <p className="text-sm text-text-secondary">{employment.company} <span className="float-right">{employment.years}</span></p>
                                <p className="text-sm text-text-secondary mt-1">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(employment.income)}</p>
                           </DetailSection>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-md font-bold text-text-main mb-3">References</h3>
                        <div className="space-y-3">
                            {references.map(ref => (
                                <div key={ref.id} className="flex items-center">
                                    <img src={ref.avatar} alt={ref.name} className="w-8 h-8 rounded-full" />
                                    <p className="ml-3 font-medium text-sm text-text-main flex-grow">{ref.name}</p>
                                    <span className="px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{ref.rating}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Column 2 */}
                <div className="xl:col-span-1 space-y-6">
                    <Card>
                        <button className="flex justify-between items-center w-full">
                            <h3 className="text-md font-bold text-text-main">Documents</h3>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <div className="mt-4 flex items-center p-3 bg-gray-50 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-500 mr-3" />
                            <p className="text-sm font-medium text-text-main">{documents[0].name}</p>
                        </div>
                    </Card>
                     <Card>
                        <h3 className="text-md font-bold text-text-main mb-3">Notes & Messages</h3>
                         <div className="mt-4 flex items-start p-3 bg-gray-50 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="text-sm font-medium text-text-main">{notes[0].text}</p>
                                <p className="text-xs text-text-secondary text-right mt-1">{notes[0].date}</p>
                            </div>
                        </div>
                    </Card>
                </div>
                
                {/* Column 3 & 4 */}
                <div className="lg:col-span-2 xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-md font-bold text-text-main mb-4">Trust & Verification</h3>
                        <div className="flex items-center space-x-4">
                            <TrustVerificationChart score={trustAndVerification.score} />
                            <div className="space-y-2">
                                {trustAndVerification.checks.map(check => (
                                    <div key={check.item} className="flex items-center text-sm">
                                        <CheckCircle2 className={`w-5 h-5 mr-2 ${check.verified ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={`${check.verified ? 'text-text-main' : 'text-text-secondary'}`}>{check.item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                    <Card>
                         <h3 className="text-md font-bold text-text-main mb-4">Timeline</h3>
                         <div className="space-y-3">
                            {timeline.map(event => (
                                <div key={event.event} className="flex items-center">
                                    <event.icon className="w-5 h-5 text-purple-500 mr-3" />
                                    <p className="text-sm font-medium text-text-main flex-grow">{event.event}</p>
                                    <p className="text-sm text-text-secondary">{event.date}</p>
                                </div>
                            ))}
                         </div>
                    </Card>
                    <Card className="md:col-span-2">
                        <h3 className="text-md font-bold text-text-main mb-4">Financial Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <p className="text-text-secondary">Monthly Rent</p>
                                <p className="font-semibold text-text-main">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialSummary.monthlyRent)}</p>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <p className="text-text-secondary">Monthly Income</p>
                                <p className="font-semibold text-text-main">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialSummary.monthlyIncome)}</p>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <p className="text-text-secondary">Deposit</p>
                                <p className="font-semibold text-text-main">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialSummary.deposit)}</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div className="bg-purple-400 h-2.5 rounded-full" style={{width: `${depositPercentage}%`}}></div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};