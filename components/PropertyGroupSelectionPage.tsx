import React from 'react';
import { User, PropertyGroup, UserRole, AppData } from '../types';
import { Building, Users, HomeIcon } from './icons';

interface PropertyGroupSelectionPageProps {
    currentUser: User;
    appData: AppData;
    onSelectGroup: (groupId: string, role: UserRole) => void;
}

export const PropertyGroupSelectionPage: React.FC<PropertyGroupSelectionPageProps> = ({ 
    currentUser, 
    appData,
    onSelectGroup 
}) => {
    const userRoles = currentUser.propertyGroupRoles || [];

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case UserRole.Landlord:
                return Building;
            case UserRole.BuildingManager:
                return Users;
            case UserRole.Tenant:
                return HomeIcon;
            default:
                return Building;
        }
    };

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case UserRole.Landlord:
                return 'from-purple-500 to-purple-600';
            case UserRole.BuildingManager:
                return 'from-blue-500 to-blue-600';
            case UserRole.Tenant:
                return 'from-green-500 to-green-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getRoleDescription = (role: UserRole) => {
        switch (role) {
            case UserRole.Landlord:
                return 'Full access to property management';
            case UserRole.BuildingManager:
                return 'Manage buildings and tenants';
            case UserRole.Tenant:
                return 'View your tenancy information';
            default:
                return 'Access the system';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="mb-6">
                        <img 
                            src={currentUser.avatarUrl} 
                            alt={currentUser.name} 
                            className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Welcome back, {currentUser.name}!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Select a property group to continue
                    </p>
                </div>

                {/* Property Group Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userRoles.map((userRole) => {
                        const group = appData.propertyGroups.find(g => g.id === userRole.groupId);
                        if (!group) return null;

                        const Icon = getRoleIcon(userRole.role);
                        const buildings = appData.buildings.filter(b => group.buildingIds.includes(b.id));
                        const totalUnits = buildings.reduce((sum, b) => sum + b.totalUnits, 0);

                        return (
                            <button
                                key={`${group.id}-${userRole.role}`}
                                onClick={() => onSelectGroup(group.id, userRole.role)}
                                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left overflow-hidden"
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${getRoleColor(userRole.role)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getRoleColor(userRole.role)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Group Name */}
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                                        {group.name}
                                    </h3>

                                    {/* Role Badge */}
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-3">
                                        {userRole.role}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 mb-4">
                                        {getRoleDescription(userRole.role)}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <span className="text-gray-500">Buildings:</span>
                                            <span className="ml-1 font-bold text-gray-800">{buildings.length}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Units:</span>
                                            <span className="ml-1 font-bold text-gray-800">{totalUnits}</span>
                                        </div>
                                    </div>

                                    {/* Arrow indicator */}
                                    <div className="absolute top-6 right-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        Need to switch groups? You can change your selection anytime from settings.
                    </p>
                </div>
            </div>
        </div>
    );
};
