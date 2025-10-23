// Example usage in a page component
import { PropertyGroupSelector } from '../components/PropertyGroupSelector';
import { ListingsPlatform } from '../components/listings/ListingsPlatform';
import { useState } from 'react';

const PropertiesPage = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isInternalView, setIsInternalView] = useState(true);
  const [listings, setListings] = useState<PropertyListing[]>([]);

  // Mock data - replace with actual data fetching
  const userGroups = [
    {
      id: 'group1',
      name: 'Downtown Portfolio',
      role: 'manager' as const,
      buildings: [
        { id: 'b1', name: 'Harbor View', address: '123 Main St', units: 24, occupied: 18 },
        { id: 'b2', name: 'Riverside', address: '456 Oak Ave', units: 12, occupied: 10 },
      ],
    },
    {
      id: 'group2',
      name: 'Uptown Living',
      role: 'tenant' as const,
      buildings: [
        { id: 'b3', name: 'Parkside', address: '789 Park Blvd', units: 36, occupied: 35 },
      ],
    },
  ];

  const handleSelectGroup = (groupId: string, buildingId?: string) => {
    setSelectedGroup(groupId);
    // Load listings for the selected group/building
    // fetchListings(groupId, buildingId);
  };

  const handleAddListing = () => {
    // Navigate to add listing form
    // router.push('/listings/new');
  };

  const handleEditListing = (id: string) => {
    // Navigate to edit listing form
    // router.push(`/listings/${id}/edit`);
  };

  const handleToggleVisibility = (id: string) => {
    // Update listing visibility
    setListings(listings.map(listing => 
      listing.id === id 
        ? { ...listing, isPublic: !listing.isPublic } 
        : listing
    ));
  };

  return (
    <div>
      {!selectedGroup ? (
        <PropertyGroupSelector 
          userGroups={userGroups} 
          onSelectGroup={handleSelectGroup} 
        />
      ) : (
        <ListingsPlatform
          isInternal={isInternalView}
          listings={listings}
          onAddListing={handleAddListing}
          onEditListing={handleEditListing}
          onToggleVisibility={handleToggleVisibility}
        />
      )}
    </div>
  );
};

export default PropertiesPage;