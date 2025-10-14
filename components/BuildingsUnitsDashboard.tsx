

import React, { useState } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { VacantUnitsChart } from './charts/VacantUnitsChart';
import { OccupancyChart } from './charts/OccupancyChart';
import { RentCollectionChart } from './charts/RentCollectionChart';
import { BuildingsPage } from './BuildingsPage';
import { UnitsPage } from './UnitsPage';
import { ApplicationsPage } from './ApplicationsPage';
import { NewBuildingForm } from './NewBuildingForm';
import { NewUnitForm } from './NewUnitForm';
import { BuildingStat, AppData, BuildingDetail, UnitDetail, Occupancy, UnitStatus } from '../types';
import { Building, HomeIcon, Users, Wrench } from './icons';

interface BuildingsUnitsDashboardProps {
  setViewingTenantId: (id: string) => void;
  onSelectBuilding: (buildingId: string) => void;
  onSelectUnit: (unitId: string) => void;
  appData: AppData;
  onAddBuilding: (buildingData: Omit<BuildingDetail, 'id' | 'vacantUnits' | 'requests' | 'occupation' | 'rentCollection' | 'contact'> & { totalUnits: number }) => void;
  onAddUnit: (unitData: Omit<UnitDetail, 'id' | 'status' | 'currentTenantId' | 'previousTenantId' | 'rentStatus' | 'leaseStartDate' | 'leaseEndDate' | 'requests'>) => void;
}

const StatCard: React.FC<{ stat: BuildingStat }> = ({ stat }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full ${stat.iconBgColor}`}>
      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
    </div>
    <div className="ml-4">
      <p className="text-2xl font-bold text-text-main">{stat.value}</p>
      <p className="text-sm text-text-secondary">{stat.label}</p>
    </div>
  </Card>
);

const OverviewPage: React.FC<{ appData: AppData }> = ({ appData }) => {
    const totalUnits = appData.units.length;
    const vacantUnits = appData.units.filter(u => u.status === UnitStatus.Vacant).length;
    const occupiedUnits = totalUnits - vacantUnits;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
    const openRequests = appData.serviceRequests.filter(sr => sr.status !== 'Complete').length;

    const buildingStats: BuildingStat[] = [
        { value: appData.buildings.length.toString(), label: 'Total Buildings', icon: Building, iconBgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
        { value: totalUnits.toString(), label: 'Total Units', icon: HomeIcon, iconBgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
        { value: vacantUnits.toString(), label: 'Vacant Units', icon: HomeIcon, iconBgColor: 'bg-red-100', iconColor: 'text-red-600' },
        { value: `${occupancyRate}%`, label: 'Occupancy Rate', icon: Users, iconBgColor: 'bg-green-100', iconColor: 'text-green-600' },
        { value: openRequests.toString(), label: 'Open Requests', icon: Wrench, iconBgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    ];
    
    const vacantUnitsByBuilding = appData.buildings.map(b => ({
        name: b.name,
        vacant: appData.units.filter(u => u.buildingId === b.id && u.status === UnitStatus.Vacant).length
    }));
    
    const occupancyData: Occupancy[] = [
      { name: 'Occupied', value: occupancyRate },
      { name: 'Vacant', value: 100 - occupancyRate },
    ];
    
    const rentCollectionData = [
      { month: 'Mar', rent: 480000 }, { month: 'Apr', rent: 510000 },
      { month: 'May', rent: 500000 }, { month: 'Jun', rent: 520000 },
      { month: 'Jul', rent: 530000 }, { month: 'Aug', rent: 550000 },
    ];


    return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {buildingStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
            <Card>
                <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Vacant Units by Building</h3>
                <div className="h-80">
                   <VacantUnitsChart data={vacantUnitsByBuilding} />
                </div>
            </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8 flex flex-col">
          <Card className="flex flex-col h-[280px]">
             <OccupancyChart data={occupancyData} />
          </Card>
          <Card>
            <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Rent Collection</h3>
            <div className="h-64">
                <RentCollectionChart data={rentCollectionData} />
            </div>
          </Card>
        </div>
      </div>
    </>
)};

export const BuildingsUnitsDashboard: React.FC<BuildingsUnitsDashboardProps> = ({ setViewingTenantId, onSelectBuilding, onSelectUnit, appData, onAddBuilding, onAddUnit }) => {
  const [activeTab, setActiveTab] = useState('Buildings');
  const [isCreatingBuilding, setIsCreatingBuilding] = useState(false);
  const [isCreatingUnit, setIsCreatingUnit] = useState(false);

  const handleBackFromCreate = () => {
    setIsCreatingBuilding(false);
  };

  const handleBackFromCreateUnit = () => {
    setIsCreatingUnit(false);
  };
  
  if (isCreatingBuilding) {
    return <NewBuildingForm onBack={handleBackFromCreate} onAddBuilding={onAddBuilding} />;
  }
  
  if (isCreatingUnit) {
    return <NewUnitForm onBack={handleBackFromCreateUnit} onAddUnit={onAddUnit} buildings={appData.buildings} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewPage appData={appData} />;
      case 'Buildings':
        return <BuildingsPage onBuildingClick={onSelectBuilding} onAddNewBuilding={() => setIsCreatingBuilding(true)} buildings={appData.buildings} />;
      case 'Units':
        return <UnitsPage setViewingTenantId={setViewingTenantId} onAddNewUnit={() => setIsCreatingUnit(true)} units={appData.units} tenants={appData.tenants} buildings={appData.buildings} onSelectBuilding={onSelectBuilding} onSelectUnit={onSelectUnit} />;
      case 'Applications':
        return <ApplicationsPage onSelectBuilding={onSelectBuilding} onSelectUnit={onSelectUnit} appData={appData} />;
      default:
        return <OverviewPage appData={appData} />;
    }
  };

  return (
    <div className="container mx-auto">
      <Header 
        title={activeTab === 'Overview' ? "Buildings / Units Dashboard" : `Buildings / Units - ${activeTab}`}
        tabs={['Overview', 'Buildings', 'Units', 'Applications']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {renderContent()}
    </div>
  );
};
