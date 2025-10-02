import React, { useState } from 'react';
import { Card } from './Card';
import { AppData, UnitStatus } from '../types';
import { ArrowLeft, Calendar, DollarSign, HomeIcon, User, Star } from './icons';
import { TenantReviewForm } from './TenantReviewForm';
import { UnitDetailsTab } from './UnitDetailsTab';

interface SpecificUnitPageProps {
  unitId: string;
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  onBack: () => void;
  setViewingTenantId: (tenantId: string) => void;
}

const StatCard: React.FC<{label: string, value: string, icon: React.ElementType}> = ({ label, value, icon: Icon }) => (
    <Card>
        <div className="flex items-center">
            <Icon className="w-6 h-6 text-purple-500 mr-4" />
            <div>
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="text-2xl font-bold text-text-main">{value}</p>
            </div>
        </div>
    </Card>
);

const calculateDaysUntil = (dateString: string | null): number | null => {
    if (!dateString) return null;
    const endDate = new Date(dateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const SpecificUnitPage: React.FC<SpecificUnitPageProps> = ({ unitId, appData, setAppData, onBack, setViewingTenantId }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const unit = appData.units.find(u => u.id === unitId);
    const building = unit ? appData.buildings.find(b => b.id === unit.buildingId) : undefined;
    const currentTenant = unit ? appData.tenants.find(t => t.id === unit.currentTenantId) : undefined;
    const previousTenant = unit ? appData.tenants.find(t => t.id === unit.previousTenantId) : undefined;

    if (!unit || !building) {
        return <div>Unit or Building not found. <button onClick={onBack}>Back</button></div>;
    }

    const handleReviewSubmit = (reviewData: { ratings: { [key: string]: number }, comment: string }) => {
        if (!previousTenant) return;

        const totalRating = Object.values(reviewData.ratings).reduce((sum, val) => sum + val, 0);
        const newRating = totalRating / Object.values(reviewData.ratings).length;

        setAppData(prevData => {
            const updatedTenants = prevData.tenants.map(tenant => {
                if (tenant.id === previousTenant.id) {
                    const allRatings = [...tenant.reviewHistory.map(r => (r.ratings.payment + r.ratings.propertyCare + r.ratings.communication + r.ratings.cleanliness + r.ratings.ruleAdherence) / 5), newRating];
                    const avgRating = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
                    
                    return {
                        ...tenant,
                        rating: parseFloat(avgRating.toFixed(1)),
                        reviewHistory: [
                            ...tenant.reviewHistory,
                            {
                                date: new Date().toLocaleDateString(),
                                ratings: {
                                    payment: reviewData.ratings.payment,
                                    propertyCare: reviewData.ratings.propertyCare,
                                    communication: reviewData.ratings.communication,
                                    cleanliness: reviewData.ratings.cleanliness,
                                    ruleAdherence: reviewData.ratings.ruleAdherence,
                                },
                                comment: reviewData.comment,
                            }
                        ]
                    };
                }
                return tenant;
            });
             // Mark review as complete by clearing previous tenant id
            const updatedUnits = prevData.units.map(u => u.id === unit.id ? { ...u, previousTenantId: null } : u);

            return { ...prevData, tenants: updatedTenants, units: updatedUnits };
        });
        setReviewSubmitted(true);
    };

    const daysUntilLeaseEnd = calculateDaysUntil(unit.leaseEndDate);

    const renderOverviewContent = () => (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rented View */}
            {unit.status === UnitStatus.Rented && currentTenant && (
                <>
                    <StatCard label="Status" value={unit.status} icon={HomeIcon} />
                    <StatCard label="Monthly Rent" value={`${unit.monthlyRent.toLocaleString()} BDT`} icon={DollarSign} />
                    <StatCard label="Lease Ends In" value={`${daysUntilLeaseEnd ?? 'N/A'} days`} icon={Calendar} />
                    
                    <div className="lg:col-span-3">
                         <Card>
                            <h3 className="text-lg font-bold text-text-main mb-4">Current Tenant</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={currentTenant.avatar} alt={currentTenant.name} className="w-12 h-12 rounded-full"/>
                                    <div className="ml-4">
                                        <p className="font-bold text-text-main">{currentTenant.name}</p>
                                        <div className="flex items-center text-sm text-text-secondary">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                            <span>{currentTenant.rating} Star Tenant</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setViewingTenantId(currentTenant.id)} className="px-4 py-2 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700">
                                    View Tenant Profile
                                </button>
                            </div>
                        </Card>
                    </div>
                </>
            )}

            {/* Vacant View */}
            {unit.status === UnitStatus.Vacant && (
                <div className="lg:col-span-3">
                    {previousTenant && !reviewSubmitted && (
                         <Card>
                             <div className="text-center mb-6">
                                 <h2 className="text-2xl font-bold font-atkinson text-text-main">Review Previous Tenant</h2>
                                 <p className="text-text-secondary">Rate {previousTenant.name}'s tenancy for Unit {unit.unitNumber}.</p>
                             </div>
                            <TenantReviewForm tenant={previousTenant} onSubmit={handleReviewSubmit} />
                        </Card>
                    )}
                     {reviewSubmitted && (
                        <Card className="text-center p-8">
                            <h2 className="text-2xl font-bold font-atkinson text-green-600">Thank You!</h2>
                            <p className="text-text-secondary mt-2">Your review has been submitted and {previousTenant?.name}'s score has been updated.</p>
                            <p className="mt-4 text-lg">New Tenant Rating: <span className="font-bold text-xl">{appData.tenants.find(t=>t.id === previousTenant?.id)?.rating}</span></p>
                        </Card>
                     )}
                    {!previousTenant && (
                        <Card className="text-center p-8">
                            <h2 className="text-2xl font-bold font-atkinson text-text-main">Unit is Vacant</h2>
                            <p className="text-text-secondary mt-2">This unit is available and ready for a new tenant.</p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
    
    const renderContent = () => {
        switch (activeTab) {
            case 'Unit Details':
                return <UnitDetailsTab unit={unit} />;
            case 'Overview':
            default:
                return renderOverviewContent();
        }
    };

    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {building.name}
            </button>
            <header className="mb-2">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">Unit {unit.unitNumber}</h1>
                <p className="text-text-secondary mt-1">{building.name}</p>
                 <div className="mt-4 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {['Overview', 'Unit Details'].map((tab) => (
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
            
           <div className="mt-8">
             {renderContent()}
           </div>
        </div>
    );
};