import React from 'react';
import { Card } from './Card';
import { UnitDetail } from '../types';
import { HomeIcon, Users, DollarSign, Calendar } from './icons';

interface UnitDetailsTabProps {
  unit: UnitDetail;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: string | number | null }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
        <Icon className="w-5 h-5 text-purple-500 mr-3" />
        <div>
            <p className="text-xs text-text-secondary">{label}</p>
            <p className="text-sm font-semibold text-text-main">{value || 'N/A'}</p>
        </div>
    </div>
);

export const UnitDetailsTab: React.FC<UnitDetailsTabProps> = ({ unit }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Unit Specifications</h3>
                <div className="space-y-3">
                    <DetailItem icon={HomeIcon} label="Category" value={unit.category} />
                    <DetailItem icon={Users} label="Bedrooms" value={unit.bedrooms} />
                    <DetailItem icon={Users} label="Bathrooms" value={unit.bathrooms} />
                    <DetailItem icon={HomeIcon} label="Square Footage" value={`${unit.sqft} sq ft`} />
                </div>
            </Card>
             <Card>
                <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Rental Information</h3>
                <div className="space-y-3">
                    <DetailItem icon={DollarSign} label="Monthly Rent" value={`${unit.monthlyRent.toLocaleString()} BDT`} />
                    <DetailItem icon={Calendar} label="Lease Start Date" value={unit.leaseStartDate} />
                    <DetailItem icon={Calendar} label="Lease End Date" value={unit.leaseEndDate} />
                    <DetailItem icon={HomeIcon} label="Rent Status" value={unit.rentStatus} />
                </div>
            </Card>
        </div>
    );
};
