import React, { useState } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { BuildingsPage as BuildingsTable } from './BuildingsPage';
import { UnitsPage } from './UnitsPage';
import { ApplicationsPage } from './ApplicationsPage';
import { VacantUnitsChart } from './charts/VacantUnitsChart';
import { RentCollectionChart } from './charts/RentCollectionChart';
import { BUILDINGS_PAGE_DATA, UNITS_PAGE_DATA, APPLICATIONS_PAGE_DATA, VACANT_UNITS_BY_BUILDING_DATA, RENT_COLLECTION_DATA } from '../constants';
import { HomeIcon, Building, Users, Wrench } from './icons';

interface BuildingsUnitsDashboardProps {
    setViewingTenantId: (id: string) => void;
    onBuildingClick: (buildingId: string) => void;
    onAddNewBuilding: () => void;
    onAddNewUnit: () => void;
}

// Calculate overview stats from data
const calculateOverviewStats = () => {
    const totalBuildings = BUILDINGS_PAGE_DATA.length;
    const totalUnits = UNITS_PAGE_DATA.length;
    const occupiedUnits = UNITS_PAGE_DATA.filter(unit => unit.status === 'Rented').length;
    const vacantUnits = totalUnits - occupiedUnits;
    const serviceRequests = UNITS_PAGE_DATA.reduce((sum, unit) => sum + unit.requests, 0);
    
    return { totalBuildings, totalUnits, occupiedUnits, vacantUnits, serviceRequests };
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ComponentType<any>; color: string }> = ({ label, value, icon: Icon, color }) => (
    <Card className="flex items-center p-4">
        <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="ml-4">
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="text-2xl font-bold text-text-main">{value}</p>
        </div>
    </Card>
);

const OverviewTab: React.FC = () => {
    const stats = calculateOverviewStats();

    return (
        <>
            {/* Overview Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                <StatCard label="Total Buildings" value={stats.totalBuildings} icon={Building} color="text-blue-500" />
                <StatCard label="Total Units" value={stats.totalUnits} icon={HomeIcon} color="text-green-500" />
                <StatCard label="Occupied Units" value={stats.occupiedUnits} icon={Users} color="text-purple-500" />
                <StatCard label="Vacant Units" value={stats.vacantUnits} icon={HomeIcon} color="text-red-500" />
                <StatCard label="Service Requests" value={stats.serviceRequests} icon={Wrench} color="text-yellow-500" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Vacant Units by Building</h3>
                    <div className="h-64">
                        <VacantUnitsChart data={VACANT_UNITS_BY_BUILDING_DATA} />
                    </div>
                </Card>
                <Card>
                    <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Rent Collection</h3>
                    <div className="h-64">
                        <RentCollectionChart data={RENT_COLLECTION_DATA} />
                    </div>
                </Card>
            </div>
        </>
    );
};

export const BuildingsUnitsDashboard: React.FC<BuildingsUnitsDashboardProps> = ({ 
    setViewingTenantId, 
    onBuildingClick, 
    onAddNewBuilding, 
    onAddNewUnit 
}) => {
    const [activeTab, setActiveTab] = useState('Overview');

    const renderContent = () => {
        switch(activeTab) {
            case 'Overview':
                return <OverviewTab />;
            case 'Buildings':
                return (
                    <BuildingsTable 
                        onBuildingClick={onBuildingClick} 
                        onAddNewBuilding={onAddNewBuilding} 
                    />
                );
            case 'Units':
                return (
                    <UnitsPage 
                        setViewingTenantId={setViewingTenantId} 
                        onAddNewUnit={onAddNewUnit} 
                    />
                );
            case 'Applications':
                return <ApplicationsPage setViewingTenantId={setViewingTenantId} />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <div className="container mx-auto">
            <Header 
                title="Buildings & Units Dashboard"
                tabs={['Overview', 'Buildings', 'Units', 'Applications']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            {renderContent()}
        </div>
    );
};

// Export BuildingsPage for backward compatibility (it's the main dashboard now)
export { BuildingsUnitsDashboard as BuildingsPage };