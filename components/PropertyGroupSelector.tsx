// components/PropertyGroupSelector.tsx
import React from 'react';
import { Card } from './Card';
import { Building, Home, Key, Users } from './icons';

interface PropertyGroup {
  id: string;
  name: string;
  role: 'manager' | 'tenant' | 'contractor' | 'admin';
  buildings: Array<{
    id: string;
    name: string;
    address: string;
    units: number;
    occupied: number;
  }>;
}

interface PropertyGroupSelectorProps {
  userGroups: PropertyGroup[];
  onSelectGroup: (groupId: string, buildingId?: string) => void;
  currentGroupId?: string;
}

export const PropertyGroupSelector: React.FC<PropertyGroupSelectorProps> = ({
  userGroups,
  onSelectGroup,
  currentGroupId,
}) => {
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(null);

  const toggleGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const getRoleBadge = (role: string) => {
    const roleStyles = {
      manager: 'bg-blue-100 text-blue-800',
      tenant: 'bg-green-100 text-green-800',
      contractor: 'bg-yellow-100 text-yellow-800',
      admin: 'bg-purple-100 text-purple-800',
    };
    
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${roleStyles[role as keyof typeof roleStyles] || 'bg-gray-100'}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Select a Property Group</h1>
      <div className="space-y-4">
        {userGroups.map((group) => (
          <Card key={group.id} className="overflow-hidden">
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-accent-secondary/10 text-accent-secondary mr-4">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <p className="text-sm text-gray-500">
                    {group.buildings.length} buildings • {group.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {getRoleBadge(group.role)}
                <ChevronDown
                  className={`w-5 h-5 ml-4 text-gray-400 transition-transform ${
                    expandedGroup === group.id ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {expandedGroup === group.id && (
              <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-3">BUILDINGS IN THIS GROUP</h4>
                <div className="space-y-3">
                  {group.buildings.map((building) => (
                    <div
                      key={building.id}
                      onClick={() => onSelectGroup(group.id, building.id)}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                        <Building className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{building.name}</div>
                        <div className="text-sm text-gray-500">
                          {building.occupied}/{building.units} units occupied
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {building.address}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};