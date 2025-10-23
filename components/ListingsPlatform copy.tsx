import React, { useState } from 'react';
import { Card } from './Card';
import { AppData, PropertyListing, UnitDetail } from '../types';
import { Plus, Building, HomeIcon, DollarSign, X } from './icons';

interface ListingsPlatformProps {
    appData: AppData;
    onCreateListing: (listing: PropertyListing) => void;
    onSelectUnit: (unitId: string) => void;
}

export const ListingsPlatform: React.FC<ListingsPlatformProps> = ({
    appData,
    onCreateListing,
    onSelectUnit,
}) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<UnitDetail | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'rented'>('active');

    const handleUnitSelect = (unit: UnitDetail) => {
        setSelectedUnit(unit);
        setShowCreateModal(true);
    };

    const handleCreateListing = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUnit) return;

        const formData = new FormData(e.currentTarget);
        const building = appData.buildings.find(b => b.id === selectedUnit.buildingId);
        const currentUser = appData.users.find(u => u.role === 'Landlord'); // In real app, get from context

        const newListing: PropertyListing = {
            id: `PL-${Date.now()}`,
            unitId: selectedUnit.id,
            buildingId: selectedUnit.buildingId,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            rent: parseInt(formData.get('rent') as string) || selectedUnit.monthlyRent,
            listingType: (formData.get('listingType') as 'rent' | 'sale') || 'rent',
            photos: [], // In real app, handle file uploads
            amenities: (formData.get('amenities') as string).split(',').map(a => a.trim()).filter(Boolean),
            contactInfo: {
                name: currentUser?.name || 'Property Manager',
                phone: currentUser?.phone || '+880-1711-000000',
                email: currentUser?.email || 'contact@sughar.com',
            },
            status: 'active',
            createdAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
        };

        onCreateListing(newListing);
        setShowCreateModal(false);
        setSelectedUnit(null);
    };

    // Get vacant units for creating new listings
    const vacantUnits = appData.units.filter(u => u.status === 'Vacant');

    // Filter listings by status
    const filteredListings = appData.propertyListings.filter(l => l.status === activeTab);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Property Listings</h1>
                <p className="text-gray-600">Manage your internal property listings for applicants and tenants</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Listings</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {appData.propertyListings.filter(l => l.status === 'active').length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <HomeIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {appData.propertyListings.filter(l => l.status === 'pending').length}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Building className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Rented</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {appData.propertyListings.filter(l => l.status === 'rented').length}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Vacant Units</p>
                            <p className="text-3xl font-bold text-gray-800">{vacantUnits.length}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Plus className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Create New Listing Section */}
            {vacantUnits.length > 0 && (
                <Card className="mb-8 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Listing from Vacant Unit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {vacantUnits.slice(0, 4).map(unit => {
                            const building = appData.buildings.find(b => b.id === unit.buildingId);
                            return (
                                <button
                                    key={unit.id}
                                    onClick={() => handleUnitSelect(unit)}
                                    className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-brand-pink hover:bg-pink-50 transition-all"
                                >
                                    <p className="text-sm text-gray-600 mb-1">{building?.name}</p>
                                    <p className="font-bold text-gray-800 mb-2">Unit {unit.unitNumber}</p>
                                    <p className="text-sm text-gray-600">{unit.bedrooms} BR • {unit.bathrooms} BA</p>
                                    <p className="text-brand-pink font-semibold mt-2">৳{unit.monthlyRent.toLocaleString()}/mo</p>
                                </button>
                            );
                        })}
                    </div>
                    {vacantUnits.length > 4 && (
                        <button className="mt-4 text-sm text-brand-pink hover:text-pink-700 font-medium">
                            View all {vacantUnits.length} vacant units →
                        </button>
                    )}
                </Card>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                    {['active', 'pending', 'rented'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 px-2 font-medium transition-colors capitalize ${
                                activeTab === tab
                                    ? 'text-brand-pink border-b-2 border-brand-pink'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab} ({appData.propertyListings.filter(l => l.status === tab).length})
                        </button>
                    ))}
                </nav>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No {activeTab} listings</p>
                    </div>
                ) : (
                    filteredListings.map(listing => {
                        const building = appData.buildings.find(b => b.id === listing.buildingId);
                        const unit = appData.units.find(u => u.id === listing.unitId);

                        return (
                            <Card key={listing.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                                {/* Image */}
                                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                                    {listing.photos.length > 0 ? (
                                        <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <HomeIcon className="w-16 h-16 text-gray-300" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{listing.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{listing.description}</p>

                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                        <Building className="w-4 h-4" />
                                        <span>{building?.name} • Unit {unit?.unitNumber}</span>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-sm text-gray-600">{unit?.bedrooms} BR</span>
                                        <span className="text-sm text-gray-600">•</span>
                                        <span className="text-sm text-gray-600">{unit?.bathrooms} BA</span>
                                        <span className="text-sm text-gray-600">•</span>
                                        <span className="text-sm text-gray-600">{unit?.sqft} sqft</span>
                                    </div>

                                    {listing.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {listing.amenities.slice(0, 3).map((amenity, idx) => (
                                                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                                    {amenity}
                                                </span>
                                            ))}
                                            {listing.amenities.length > 3 && (
                                                <span className="text-xs text-gray-500">+{listing.amenities.length - 3} more</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div>
                                            <p className="text-2xl font-bold text-brand-pink">৳{listing.rent.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">per month</p>
                                        </div>
                                        <button
                                            onClick={() => unit && onSelectUnit(unit.id)}
                                            className="px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
                                        >
                                            View Unit
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Create Listing Modal */}
            {showCreateModal && selectedUnit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Create Listing</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateListing}>
                            <div className="space-y-4">
                                {/* Unit Info */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Selected Unit</p>
                                    <p className="font-bold text-gray-800">
                                        {appData.buildings.find(b => b.id === selectedUnit.buildingId)?.name} - Unit {selectedUnit.unitNumber}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {selectedUnit.bedrooms} BR • {selectedUnit.bathrooms} BA • {selectedUnit.sqft} sqft
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        defaultValue={`${selectedUnit.bedrooms}BR Apartment in ${appData.buildings.find(b => b.id === selectedUnit.buildingId)?.address.split(',')[0]}`}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={4}
                                        defaultValue="Beautiful, well-maintained apartment with modern amenities. Great location with easy access to transportation and local markets."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (৳) *</label>
                                        <input
                                            type="number"
                                            name="rent"
                                            required
                                            defaultValue={selectedUnit.monthlyRent}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type *</label>
                                        <select
                                            name="listingType"
                                            defaultValue="rent"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                        >
                                            <option value="rent">For Rent</option>
                                            <option value="sale">For Sale</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma-separated)</label>
                                    <input
                                        type="text"
                                        name="amenities"
                                        placeholder="Parking, Security, Elevator, Backup Generator"
                                        defaultValue="Parking, Security, Elevator"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-brand-pink text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                                >
                                    Create Listing
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};
