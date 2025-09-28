import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { BuildingsPage as BuildingsTable } from './BuildingsPage';
import { UnitsPage } from './UnitsPage';
import { ApplicationsPage } from './ApplicationsPage';
import { VacantUnitsChart } from './charts/VacantUnitsChart';
import { RentCollectionChart } from './charts/RentCollectionChart';
import { HomeIcon, Building, Users, Wrench } from './icons';
import { propertiesAPI, unitsAPI, rentalApplicationsAPI } from '../services/api';

interface BuildingsUnitsDashboardProps {
    setViewingTenantId: (id: string) => void;
    onBuildingClick: (buildingId: string) => void;
    onAddNewBuilding: () => void;
    onAddNewUnit: () => void;
}

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

export const BuildingsUnitsDashboard: React.FC<BuildingsUnitsDashboardProps> = ({ 
    setViewingTenantId, 
    onBuildingClick, 
    onAddNewBuilding, 
    onAddNewUnit 
}) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [overviewStats, setOverviewStats] = useState({
        totalBuildings: 0,
        totalUnits: 0,
        occupiedUnits: 0,
        vacantUnits: 0,
        serviceRequests: 0
    });
    const [chartData, setChartData] = useState<{
        vacantUnits: any[];
        rentCollection: any[];
    }>({ vacantUnits: [], rentCollection: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                setLoading(true);
                const [properties, units] = await Promise.all([
                    propertiesAPI.getAll(),
                    unitsAPI.getAll()
                ]);

                // Calculate stats
                const totalBuildings = properties.length;
                const totalUnits = units.length;
                const occupiedUnits = units.filter((unit: any) => unit.isOccupied).length;
                const vacantUnits = totalUnits - occupiedUnits;
                const serviceRequests = Math.floor(Math.random() * 50) + 10; // Placeholder

                setOverviewStats({
                    totalBuildings,
                    totalUnits,
                    occupiedUnits,
                    vacantUnits,
                    serviceRequests
                });

                // Create chart data
                const vacantUnitsData = properties.map((property: any) => {
                    const propertyUnits = units.filter((unit: any) => 
                        unit.propertyID?._id === property._id || unit.propertyID === property._id
                    );
                    const vacantCount = propertyUnits.filter((unit: any) => !unit.isOccupied).length;
                    
                    return {
                        name: property.address?.split(',')[0]?.substring(0, 10) || 'Building',
                        vacant: vacantCount
                    };
                });

                const rentCollectionData = Array.from({ length: 12 }, (_, i) => ({
                    month: new Date(2025, i).toLocaleString('default', { month: 'short' }),
                    rent: Math.floor(Math.random() * 10000) + 20000
                }));

                setChartData({ 
                    vacantUnits: vacantUnitsData, 
                    rentCollection: rentCollectionData 
                });
            } catch (error) {
                console.error('Error fetching overview data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOverviewData();
    }, []);

    const OverviewTab: React.FC = () => {
        if (loading) {
            return (
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading overview...</p>
                </div>
            );
        }

        return (
            <>
                {/* Overview Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    <StatCard label="Total Buildings" value={overviewStats.totalBuildings} icon={Building} color="text-blue-500" />
                    <StatCard label="Total Units" value={overviewStats.totalUnits} icon={HomeIcon} color="text-green-500" />
                    <StatCard label="Occupied Units" value={overviewStats.occupiedUnits} icon={Users} color="text-purple-500" />
                    <StatCard label="Vacant Units" value={overviewStats.vacantUnits} icon={HomeIcon} color="text-red-500" />
                    <StatCard label="Service Requests" value={overviewStats.serviceRequests} icon={Wrench} color="text-orange-500" />
                </div>
                
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Vacant Units by Building</h3>
                        <VacantUnitsChart data={chartData.vacantUnits} />
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Rent Collection Trends</h3>
                        <RentCollectionChart data={chartData.rentCollection} />
                    </Card>
                </div>
            </>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewTab />;
            case 'Buildings':
                return <BuildingsTable onBuildingClick={onBuildingClick} onAddNewBuilding={onAddNewBuilding} />;
            case 'Units':
                return <UnitsPage setViewingTenantId={setViewingTenantId} onAddNewUnit={onAddNewUnit} />;
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

export { BuildingsUnitsDashboard as BuildingsPage };