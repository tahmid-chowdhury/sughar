// types/listing.ts
export interface PropertyListing {
  id: string;
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: 'active' | 'pending' | 'leased' | 'draft';
  isPublic: boolean;
  images: string[];
  description: string;
  amenities: string[];
  availableFrom: string;
  lastUpdated: string;
  // Additional fields
  propertyType?: string;
  yearBuilt?: number;
  deposit?: number;
  leaseTerm?: string;
  petsAllowed?: boolean;
  parkingSpots?: number;
  // Location details
  location?: {
    lat: number;
    lng: number;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  // Virtual tour
  virtualTourUrl?: string;
  // Contact information
  contactInfo?: {
    name: string;
    phone: string;
    email: string;
  };
  // Internal use
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // Unit details (if part of a larger property)
  unitNumber?: string;
  floorPlanUrl?: string;
  // Documents
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
  // Viewing schedule
  openHouses?: Array<{
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }>;
  // Application information
  applicationFee?: number;
  applicationRequirements?: string[];
  // Utilities
  utilitiesIncluded?: string[];
  // Features
  features?: {
    airConditioning?: boolean;
    heating?: boolean;
    washerDryer?: boolean;
    dishwasher?: boolean;
    refrigerator?: boolean;
    microwave?: boolean;
    floorType?: string;
    // Add more features as needed
  };
  // Accessibility
  accessibilityFeatures?: string[];
  // Restrictions
  restrictions?: string[];
  // Commission (for agents)
  commission?: {
    type: 'percentage' | 'fixed';
    value: number;
    notes?: string;
  };
  // Custom fields
  customFields?: Record<string, any>;
}