import React from 'react';
import { Card } from './Card';
import { BuildingDetail } from '../types';
import { HomeIcon, Check, X, Users, Phone, Mail } from './icons';

interface BuildingDetailsTabProps {
  building: BuildingDetail;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: string | number }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
        <Icon className="w-5 h-5 text-purple-500 mr-3" />
        <div>
            <p className="text-xs text-text-secondary">{label}</p>
            <p className="text-sm font-semibold text-text-main">{value}</p>
        </div>
    </div>
);

export const BuildingDetailsTab: React.FC<BuildingDetailsTabProps> = ({ building }) => {
    const occupancy = building.totalUnits > 0 ? ((building.totalUnits - building.vacantUnits) / building.totalUnits) * 100 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Building Information</h3>
                <div className="space-y-3">
                    <DetailItem icon={HomeIcon} label="Building Category" value={building.category} />
                    <DetailItem icon={Users} label="Total Units" value={building.totalUnits} />
                </div>
            </Card>
             <Card>
                <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Occupancy Details</h3>
                <div className="space-y-3">
                    <DetailItem icon={Check} label="Occupied Units" value={building.totalUnits - building.vacantUnits} />
                    <DetailItem icon={X} label="Vacant Units" value={building.vacantUnits} />
                    <DetailItem icon={Users} label="Occupancy Rate" value={`${occupancy.toFixed(0)}%`} />
                </div>
            </Card>
             <Card>
                <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Contact Information</h3>
                <div className="flex items-center">
                    <img src={building.contact.avatar} alt={building.contact.name} className="w-12 h-12 rounded-full" />
                    <div className="ml-4">
                        <p className="font-bold text-text-main">{building.contact.name}</p>
                        <p className="text-sm text-text-secondary">Assigned Contact</p>
                    </div>
                </div>
                 <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex items-center text-text-secondary">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>+880 1711-223344</span>
                    </div>
                     <div className="flex items-center text-text-secondary">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{building.contact.name.split(' ').join('.').toLowerCase()}@sughar.com</span>
                    </div>
                 </div>
            </Card>
        </div>
    );
};
