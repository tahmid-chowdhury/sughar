import React from 'react';
import { Card } from './Card';

interface UnitInfo {
  unitNumber: string;
  isOccupied: boolean;
  tenant?: string;
  leaseEnding?: string;
  status?: string;
  hasServiceRequest?: boolean;
  serviceRequestId?: string;
}

interface BuildingInfo {
  name: string;
  totalUnits: number;
  units: UnitInfo[];
}

const buildingsData: BuildingInfo[] = [
  {
    name: 'Building 1 – Lalmatia Court',
    totalUnits: 12,
    units: [
      { unitNumber: '1A', isOccupied: true, tenant: 'Farzana Akhter', leaseEnding: '1/14/2026' },
      { unitNumber: '2A', isOccupied: false, tenant: 'Amrul Hoque', leaseEnding: 'TODAY***', status: 'RATE TENANT' },
      { unitNumber: '3A', isOccupied: true, tenant: 'Shahriar Karim', leaseEnding: '3/02/2026' },
      { unitNumber: '4A', isOccupied: true, tenant: 'Tania Akter', leaseEnding: '3/03/2026', hasServiceRequest: true, serviceRequestId: 'SR-0001' },
      { unitNumber: '1B', isOccupied: true, tenant: 'Imran Chowdhury', leaseEnding: '5/11/2026' },
      { unitNumber: '2B', isOccupied: true, tenant: 'Sumi Akhter', leaseEnding: '4/28/2026', hasServiceRequest: true, serviceRequestId: 'SR-0002' },
      { unitNumber: '3B', isOccupied: true, tenant: 'Hasan Mahmud', leaseEnding: '6/17/2026' },
      { unitNumber: '4B', isOccupied: true, tenant: 'Shuvo Islam', leaseEnding: '2/09/2026' },
      { unitNumber: '1C', isOccupied: true, tenant: 'Maruf Khan', leaseEnding: '11/22/2025', hasServiceRequest: true, serviceRequestId: 'SR-0003' },
      { unitNumber: '2C', isOccupied: true, tenant: 'Mahin Alam', leaseEnding: '8/15/2026' },
      { unitNumber: '3C', isOccupied: true, tenant: 'Saima Binte Noor', leaseEnding: '7/05/2026' },
      { unitNumber: '4C', isOccupied: true, tenant: 'Javed Rahman', leaseEnding: '12/19/2025' }
    ]
  },
  {
    name: 'Building 2 – Banani Heights',
    totalUnits: 8,
    units: [
      { unitNumber: '1A', isOccupied: true, tenant: 'Sadia Hossain', leaseEnding: '10/03/2026' },
      { unitNumber: '2A', isOccupied: true, tenant: 'Kamal Uddin', leaseEnding: '9/02/2026', hasServiceRequest: true, serviceRequestId: 'SR-0004' },
      { unitNumber: '3A', isOccupied: true, tenant: 'Mehnaz Sultana', leaseEnding: '5/23/2026' },
      { unitNumber: '4A', isOccupied: true, tenant: 'Tanvir Ahmed', leaseEnding: '4/11/2026', hasServiceRequest: true, serviceRequestId: 'SR-0005' },
      { unitNumber: '1B', isOccupied: true, tenant: 'Nasrin Akter', leaseEnding: '3/29/2026' },
      { unitNumber: '2B', isOccupied: true, tenant: 'Mithun Das', leaseEnding: '8/20/2026' },
      { unitNumber: '3B', isOccupied: true, tenant: 'Zahid Hasan', leaseEnding: '6/08/2026', hasServiceRequest: true, serviceRequestId: 'SR-0006' },
      { unitNumber: '4B', isOccupied: true, tenant: 'Roksana Begum', leaseEnding: '12/30/2025' }
    ]
  },
  {
    name: 'Building 3 – Dhanmondi Residency',
    totalUnits: 5,
    units: [
      { unitNumber: '1A', isOccupied: false },
      { unitNumber: '2A', isOccupied: true, tenant: 'Shila Rahman', leaseEnding: '2/13/2026', hasServiceRequest: true, serviceRequestId: 'SR-0007' },
      { unitNumber: '3A', isOccupied: true, tenant: 'Arefin Chowdhury', leaseEnding: '11/09/2025' },
      { unitNumber: '4A', isOccupied: true, tenant: 'Rezaul Karim', leaseEnding: '1/18/2026', hasServiceRequest: true, serviceRequestId: 'SR-0008' },
      { unitNumber: '5A', isOccupied: true, tenant: 'Nadia Islam', leaseEnding: '7/27/2026' }
    ]
  },
  {
    name: 'Building 4 – Uttara Gardens',
    totalUnits: 3,
    units: [
      { unitNumber: '1', isOccupied: true, tenant: 'Selina Yasmin', leaseEnding: '1/12/2026', hasServiceRequest: true, serviceRequestId: 'SR-0009' },
      { unitNumber: '2', isOccupied: true, tenant: 'Abdul Malek', leaseEnding: '10/30/2025', status: 'next month' },
      { unitNumber: '3', isOccupied: true, tenant: 'Rafsan Chowdhury', leaseEnding: '9/19/2026' }
    ]
  }
];

const UnitCard: React.FC<{ unit: UnitInfo; onUnitClick?: () => void }> = ({ unit, onUnitClick }) => {
  const getUnitColor = () => {
    if (!unit.isOccupied) return 'bg-gray-200 border-gray-300';
    if (unit.status === 'RATE TENANT') return 'bg-red-100 border-red-400 ring-2 ring-red-400';
    if (unit.hasServiceRequest) return 'bg-yellow-100 border-yellow-400';
    return 'bg-green-100 border-green-400';
  };

  const getTextColor = () => {
    if (!unit.isOccupied) return 'text-gray-600';
    if (unit.status === 'RATE TENANT') return 'text-red-700';
    if (unit.hasServiceRequest) return 'text-yellow-800';
    return 'text-green-800';
  };

  const isLeaseEndingSoon = () => {
    if (!unit.leaseEnding) return false;
    if (unit.leaseEnding === 'TODAY***') return true;
    if (unit.status === 'next month') return true;
    
    // Check if lease ends within 60 days
    const endDate = new Date(unit.leaseEnding);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60;
  };

  return (
    <div
      className={`p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${getUnitColor()} ${
        isLeaseEndingSoon() ? 'ring-2 ring-orange-400' : ''
      }`}
      onClick={onUnitClick}
    >
      <div className={`font-bold text-sm ${getTextColor()}`}>
        Unit {unit.unitNumber}
      </div>
      
      {unit.isOccupied && unit.tenant ? (
        <div className={`text-xs mt-1 ${getTextColor()}`}>
          <div className="font-medium">{unit.tenant}</div>
          {unit.leaseEnding && (
            <div className={`${isLeaseEndingSoon() ? 'font-bold text-orange-700' : ''}`}>
              Lease ends: {unit.leaseEnding}
              {unit.leaseEnding === 'TODAY***' && <span className="text-red-600 font-bold"> ⚠️</span>}
            </div>
          )}
          {unit.hasServiceRequest && (
            <div className="text-yellow-700 font-medium text-xs mt-1">
              🔧 {unit.serviceRequestId}
            </div>
          )}
          {unit.status && (
            <div className="text-red-700 font-bold text-xs mt-1">
              {unit.status}
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs mt-1 text-gray-500">
          <div className="font-medium">Vacant</div>
          {unit.status && (
            <div className="text-red-700 font-bold text-xs mt-1">
              👤 {unit.tenant} - {unit.status}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BuildingCard: React.FC<{ building: BuildingInfo; onBuildingClick?: (name: string) => void; onUnitClick?: (buildingName: string, unitNumber: string) => void }> = ({ 
  building, 
  onBuildingClick, 
  onUnitClick 
}) => {
  const occupiedUnits = building.units.filter(u => u.isOccupied).length;
  const vacantUnits = building.totalUnits - occupiedUnits;
  const serviceRequests = building.units.filter(u => u.hasServiceRequest).length;
  const occupancyRate = Math.round((occupiedUnits / building.totalUnits) * 100);

  return (
    <Card className="p-6">
      <div 
        className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg -m-2 mb-4"
        onClick={() => onBuildingClick?.(building.name)}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">{building.name}</h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <span>📊 {occupancyRate}% occupied</span>
          <span>🏠 {occupiedUnits}/{building.totalUnits} units</span>
          {vacantUnits > 0 && <span className="text-red-600">🚫 {vacantUnits} vacant</span>}
          {serviceRequests > 0 && <span className="text-yellow-600">🔧 {serviceRequests} service requests</span>}
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {building.units.map((unit) => (
          <UnitCard
            key={unit.unitNumber}
            unit={unit}
            onUnitClick={() => onUnitClick?.(building.name, unit.unitNumber)}
          />
        ))}
      </div>
    </Card>
  );
};

interface BuildingOverviewPageProps {
  onBuildingClick?: (buildingName: string) => void;
  onUnitClick?: (buildingName: string, unitNumber: string) => void;
}

export const BuildingOverviewPage: React.FC<BuildingOverviewPageProps> = ({
  onBuildingClick,
  onUnitClick
}) => {
  const totalUnits = buildingsData.reduce((sum, building) => sum + building.totalUnits, 0);
  const totalOccupied = buildingsData.reduce((sum, building) => sum + building.units.filter(u => u.isOccupied).length, 0);
  const totalVacant = totalUnits - totalOccupied;
  const totalServiceRequests = buildingsData.reduce((sum, building) => sum + building.units.filter(u => u.hasServiceRequest).length, 0);
  const overallOccupancy = Math.round((totalOccupied / totalUnits) * 100);

  const handleUnitClick = (buildingName: string, unitNumber: string) => {
    const building = buildingsData.find(b => b.name === buildingName);
    const unit = building?.units.find(u => u.unitNumber === unitNumber);
    
    if (unit?.status === 'RATE TENANT' || (unit && !unit.isOccupied && unit.tenant)) {
      // Show rating dialog for previous tenant
      alert(`Rate tenant: ${unit.tenant}\n\nThis tenant's lease has ended. Please provide a rating before proceeding.`);
    } else if (unit?.hasServiceRequest) {
      // Navigate to service request
      alert(`Service Request ${unit.serviceRequestId}\n\nBuilding: ${buildingName}\nUnit: ${unitNumber}\nTenant: ${unit.tenant}`);
    } else if (unit && unit.isOccupied && unit.tenant) {
      // Show tenant details
      alert(`Tenant Details\n\nName: ${unit.tenant}\nBuilding: ${buildingName}\nUnit: ${unitNumber}\nLease Ending: ${unit.leaseEnding}`);
    } else {
      // Vacant unit
      alert(`Unit ${unitNumber} in ${buildingName} is vacant.\n\nWould you like to:\n- List for rent\n- Schedule showing\n- View maintenance history`);
    }
    
    onUnitClick?.(buildingName, unitNumber);
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{buildingsData.length}</div>
            <div className="text-sm text-gray-600">Buildings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalUnits}</div>
            <div className="text-sm text-gray-600">Total Units</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{totalOccupied}</div>
            <div className="text-sm text-gray-600">Occupied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalVacant}</div>
            <div className="text-sm text-gray-600">Vacant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{overallOccupancy}%</div>
            <div className="text-sm text-gray-600">Occupancy</div>
          </div>
        </div>
        
        {totalServiceRequests > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              🔧 <strong>{totalServiceRequests}</strong> active service requests across all buildings
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            💡 <strong>Legend:</strong> 
            <span className="ml-2">🟢 Occupied</span>
            <span className="ml-2">🔴 Vacant</span>
            <span className="ml-2">🟡 Service Request</span>
            <span className="ml-2">🔴⚠️ Rate Previous Tenant</span>
            <span className="ml-2">🟠 Lease Ending Soon</span>
          </div>
        </div>
      </Card>

      {/* Buildings */}
      {buildingsData.map((building) => (
        <BuildingCard
          key={building.name}
          building={building}
          onBuildingClick={onBuildingClick}
          onUnitClick={handleUnitClick}
        />
      ))}
    </div>
  );
};