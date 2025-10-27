/**
 * Type definitions for the SuGhar property management system.
 * 
 * This file contains all TypeScript interfaces and enums used throughout the application
 * to maintain type safety and clear data structures for:
 * - User management
 * - Building and unit tracking
 * - Tenant information
 * - Service requests
 * - Financial data
 * - Document management
 * - Application settings
 */

import React from 'react';
import { PropertyListing } from './types/listing';

/**
 * User roles in the system
 */
export enum UserRole {
  Landlord = 'Landlord',
  Tenant = 'Tenant',
  Applicant = 'Applicant',
  Contractor = 'Contractor',
  BuildingManager = 'BuildingManager',
}

/**
 * Represents a user in the system (property manager, admin, or applicant)
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Full name of the user */
  name: string;
  /** Email address for login and communication */
  email: string;
  /** URL to the user's avatar image */
  avatarUrl: string;
  /** Optional password field (only stored in demo mode, should use proper auth in production) */
  password?: string;
  /** User role (landlord, tenant, applicant) */
  role: UserRole;
  /** Phone number for contact */
  phone?: string;
  /** Property groups and their associated roles for this user */
  propertyGroupRoles?: { groupId: string; role: UserRole }[];
}

/** 
 * Financial statistics displayed on the dashboard
 */
export interface FinancialStat {
  /** Icon component to display */
  icon: React.ElementType;
  /** Display label for the statistic */
  label: string;
  /** Formatted value string (e.g., "$1,250,000") */
  value: string;
  /** Tailwind CSS color class for styling */
  color: string;
}

/**
 * Expense data for charts and analytics
 */
export interface ExpenseData {
  /** Name of the expense category */
  name: string;
  /** Numeric value of expenses */
  value: number;
  /** Percentage of total expenses (0.0 to 1.0) */
  percent: number;
}

/**
 * Monthly revenue data for trend charts
 */
export interface RevenueData {
  /** Month abbreviation (e.g., "Jan", "Feb") */
  month: string;
  /** Revenue amount for the month */
  revenue: number;
}

/**
 * Enumeration of all document types supported by the system
 */
export enum DocumentType {
  Lease = 'Lease Agreement',
  Utilities = 'Utility Bill',
  Income = 'Income Proof',
  Service = 'Service Record',
  Insurance = 'Insurance Policy',
  Certifications = 'Permits & Certs',
  Other = 'Other',
  ID = 'Identification',
}

/**
 * Represents a document stored in the system
 */
export interface Document {
  /** Unique identifier for the document */
  id: string;
  /** Display name/filename of the document */
  name: string;
  /** Type category of the document */
  type: DocumentType;
  /** Date the document was uploaded (YYYY-MM-DD format) */
  uploadDate: string;
  /** Building ID this document is associated with */
  building: string;
  /** Unit number this document is associated with */
  unit: string;
  /** Optional monetary amount associated with the document */
  amount?: number;
  /** Financial category (used for accounting) */
  category?: 'Income' | 'Expense';
  /** Whether the document is starred/favorited */
  isStarred?: boolean;
  /** User ID who uploaded the document */
  uploadedBy?: string;
  /** Array of tenant IDs who can access this document */
  sharedWith?: string[];
  /** Whether this document is visible to tenants */
  visibleToTenants?: boolean;
  /** Specific tenant IDs who can view this document (if visibleToTenants is true) */
  visibleToTenantIds?: string[];
  /** File URL or base64 data */
  fileUrl?: string;
}

export interface DocumentItem {
  name: string;
  date: string;
}

export interface CategorizedDocument {
  category: string;
  icon: React.ElementType;
  items: DocumentItem[];
}


export interface DocumentDashboardStat {
    icon: React.ElementType;
    label: string;
    value: string;
    bgColor: string;
    iconColor: string;
}

export interface DocumentDistribution {
    name: string;
    value: number;
    percentage: string;
}

export interface UploadedDocumentData {
    month: string;
    count: number;
}


export interface ActionCenterItem {
  icon: React.ElementType;
  label: string;
  isAlert: boolean;
  targetPage?: string;
  targetTab?: string;
}

export interface BuildingStat {
    value: string;
    label: string;
    icon: React.ElementType;
    iconBgColor: string;
    iconColor: string;
}

/**
 * Classification categories for buildings based on quality and target market
 */
export enum BuildingCategory {
    Luxury = "Luxury",
    MidRange = "Mid-Range",
    Standard = "Standard",
}

/**
 * Complete information about a building in the portfolio
 */
export interface BuildingDetail {
    /** Unique building identifier */
    id: string;
    /** Building name/title */
    name: string;
    /** Physical address of the building */
    address: string;
    /** Category/tier of the building */
    category: BuildingCategory;
    /** Total number of units in the building */
    totalUnits: number;
    /** Number of currently vacant units */
    vacantUnits: number;
    /** Number of active service requests for this building */
    requests: number;
    /** Occupation rate as a percentage (0-100) */
    occupation: number;
    /** Rent collection rate as a percentage (0-100) */
    rentCollection: number;
    /** Primary contact person for this building */
    contact: {
        /** Contact person's name */
        name: string;
        /** URL to contact person's avatar */
        avatar: string;
        /** Contact phone number */
        phone?: string;
        /** Contact email address */
        email?: string;
    };
}


/**
 * Current rental status of a unit
 */
export enum UnitStatus {
    Rented = 'Rented',
    Vacant = 'Vacant',
}

/**
 * Payment status for rent
 */
export enum RentStatus {
    Paid = 'Paid',
    Overdue = 'Overdue',
    Pending = 'Pending',
}

/**
 * Detailed information about a rental unit
 */
export interface UnitDetail {
    /** Unique unit identifier */
    id: string;
    /** ID of the building this unit belongs to */
    buildingId: string;
    /** Unit number (e.g., "1A", "2B") */
    unitNumber: string;
    /** Category inherited from the building */
    category: BuildingCategory;
    /** Monthly rent amount in local currency */
    monthlyRent: number;
    /** Current rental status (null if data not available) */
    status: UnitStatus | null;
    /** ID of current tenant (null if vacant) */
    currentTenantId: string | null;
    /** ID of previous tenant (used for history tracking) */
    previousTenantId?: string | null;
    /** Rent payment status (null if vacant) */
    rentStatus: RentStatus | null;
    /** Lease start date in YYYY-MM-DD format (null if vacant) */
    leaseStartDate: string | null;
    /** Lease end date in YYYY-MM-DD format (null if vacant) */
    leaseEndDate: string | null;
    /** Number of active service requests for this unit */
    requests: number;
    /** Number of bedrooms */
    bedrooms: number;
    /** Number of bathrooms */
    bathrooms: number;
    /** Square footage of the unit */
    sqft: number;
}

export interface Occupancy {
  name: string;
  value: number;
}

export interface RentCollection {
  month: string;
  rent: number;
}

export interface VacantUnit {
    name: string;
    vacant: number;
}

export interface Application {
    id: string;
    buildingId: string;
    tenant: {
        id: string;
        name: string;
        avatar: string;
        rating: number;
    };
    unit: string;
    matchPercentage: number;
    submissionDate: string;
}

export interface TenantReview {
    date: string;
    ratings: {
        payment: number;
        propertyCare: number;
        communication: number;
        cleanliness: number;
        ruleAdherence: number;
    };
    comment: string;
}

/**
 * Complete tenant profile and status information
 */
export interface Tenant {
    /** Unique tenant identifier */
    id: string;
    /** Tenant's full name */
    name: string;
    /** URL to tenant's avatar image */
    avatar: string;
    /** Name of the building where tenant resides */
    building: string;
    /** Unit number occupied by tenant */
    unit: string;
    /** Lease progress percentage (0-100) indicating how far through their lease */
    leaseProgress: number;
    /** Current rent payment status */
    rentStatus: RentStatus;
    /** Number of service requests submitted by this tenant */
    requests: number;
    /** Overall tenant rating (0.0-5.0) based on reviews */
    rating: number;
    /** Historical reviews of the tenant's behavior and payments */
    reviewHistory: TenantReview[];
    /** Date when tenant joined (YYYY-MM-DD format) */
    joinDate: string;
}

/**
 * Workflow status of a service request
 */
export enum RequestStatus {
    Complete = 'Complete',
    InProgress = 'In Progress',
    Pending = 'Pending',
}

/**
 * Service/maintenance request submitted by a tenant
 */
export interface ServiceRequest {
    /** Unique service request identifier */
    id: string;
    /** Brief title/summary of the issue */
    title: string;
    /** ID of the tenant who submitted the request */
    tenantId: string;
    /** ID of the building where the issue exists */
    buildingId: string;
    /** ID of the specific unit with the issue */
    unitId: string;
    /** Contact person assigned to handle this request */
    assignedContact?: {
        /** Assigned person's name */
        name: string;
        /** URL to assigned person's avatar */
        avatar: string;
    };
    /** Contractor assigned to this request */
    assignedContractor?: {
        /** Contractor ID */
        id: string;
        /** Contractor's name */
        name: string;
        /** URL to contractor's avatar */
        avatar: string;
        /** Contractor's rating */
        rating?: number;
    };
    /** Date the request was submitted (YYYY-MM-DD format) */
    requestDate: string;
    /** Date the request was completed (if applicable) */
    completionDate?: string;
    /** Current status of the request */
    status: RequestStatus;
    /** Priority level for handling the request */
    priority: 'High' | 'Medium' | 'Low';
    /** Detailed description of the issue */
    description: string;
    /** Media attachments (photos/videos) */
    media?: ServiceRequestMedia[];
    /** Comments/messages on this request */
    comments?: ServiceRequestComment[];
    /** Whether landlord has viewed this request */
    viewedByLandlord?: boolean;
    /** Timestamp when landlord first viewed */
    viewedAt?: string;
}

/**
 * Review status of a rental application
 */
export enum ApplicationStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Denied = 'Denied',
}

/**
 * Rental application submitted by a prospective tenant
 */
export interface RentalApplication {
    /** Unique application identifier */
    id: string;
    /** ID of the user who submitted the application */
    userId: string;
    /** Current review status of the application */
    status: ApplicationStatus;
    /** Personal statement from the applicant */
    statement: string;
    /** Applicant's occupation/job title */
    occupation: string;
    /** Employer name */
    employer: string;
    /** Monthly income (formatted string with currency) */
    monthlyIncome: string;
    /** Number of years at current employer */
    yearsAtEmployer: number;
    /** Supporting documents (ID, income proof, etc.) */
    documents: { type: string; url: string }[];
    /** Personal references provided by the applicant */
    references: { name: string; relation: string; phone: string }[];
}


/**
 * Property Group containing multiple buildings
 */
export interface PropertyGroup {
  /** Unique identifier */
  id: string;
  /** Group name */
  name: string;
  /** Description */
  description?: string;
  /** Owner/manager user ID */
  ownerId: string;
  /** Building IDs in this group */
  buildingIds: string[];
  /** Creation date */
  createdAt: string;
}

/**
 * Contractor profile
 */
export interface Contractor {
  /** Unique identifier */
  id: string;
  /** Contractor name or company name */
  name: string;
  /** Avatar/logo URL */
  avatar: string;
  /** Contact phone */
  phone: string;
  /** Contact email */
  email: string;
  /** Average rating */
  rating: number;
  /** Specialties */
  specialties: string[];
  /** Active status */
  isActive: boolean;
}

/**
 * Root data structure containing all application state.
 * This is the main data model used throughout the application.
 * In a production app, this would be managed by a backend database.
 */
export interface AppData {
  /** All user accounts in the system */
  users: User[];
  /** All property groups */
  propertyGroups: PropertyGroup[];
  /** All buildings in the property portfolio */
  buildings: BuildingDetail[];
  /** All rental units across all buildings */
  units: UnitDetail[];
  /** All current and past tenants */
  tenants: Tenant[];
  /** All documents uploaded to the system */
  documents: Document[];
  /** All service requests submitted by tenants */
  serviceRequests: ServiceRequest[];
  /** All rental applications from prospective tenants */
  rentalApplications: RentalApplication[];
  /** All contractors */
  contractors: Contractor[];
  /** All activity logs */
  activityLogs: ActivityLogItem[];
  /** All property listings */
  propertyListings: PropertyListing[];
}


export interface HomeStat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: 'orange' | 'red' | 'yellow' | 'green' | 'blue';
  targetPage?: string;
  targetTab?: string;
}

export interface HighPriorityTenant {
  id: string;
  name: string;
  avatar: string;
  unit: string;
  daysOverdue: number;
}

export interface MonthlyProfitData {
  month: string;
  profit: number;
}

export interface ServiceRequestVolume {
  month: string;
  new: number;
  completed: number;
}

export interface TenantDashboardStat {
  icon: React.ElementType;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

export interface RentStatusData {
  name: "On Time" | "Late";
  value: number;
}

export interface QuickViewAction {
  value?: string;
  label: string;
  isFullText?: boolean;
}

export interface CurrentTenant extends Tenant {}

export enum InvoiceStatus {
    Paid = 'Paid',
    Pending = 'Pending',
    Failed = 'Failed',
}

export interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: InvoiceStatus;
}

export interface AccountDetails {
    name: string;
    role: string;
    email: string;
    avatarUrl: string;
    memberSince: string;
}

export interface BillingPlan {
    name: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    nextPayment: string;
}

export interface PaymentMethod {
    cardType: string;
    lastFour: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
}

export interface NotificationSetting {
    id: string;
    label: string;
    description: string;
    email: boolean;
    push: boolean;
}

export type Theme = 'Light' | 'Dark' | 'System';

export interface SettingsData {
  // Existing settings (kept for backward compatibility)
  general?: {
    language: string;
    currency: string;
    timezone: string;
  };
  appearance?: {
    theme: Theme;
  };
  security?: {
    twoFactorEnabled: boolean;
  };

  // New settings structure
  profile: {
    fullName: string;
    email: string;
    phone?: string;
    profilePictureUrl?: string;
    language?: string;
    timezone?: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications?: boolean;
    inAppNotifications: boolean;
    serviceRequestUpdates: boolean;
    paymentReminders: boolean;
  };
  apiKeys?: {
    keys: Array<{
      id: string;
      label: string;
      createdAt: string;
      lastUsed?: string;
    }>;
  };
  billing?: {
    plan: 'free' | 'pro' | 'enterprise';
    renewalDate?: string;
    paymentMethod?: {
      brand: string;
      last4: string;
      expiry: string;
    };
    invoices?: Array<{
      id: string;
      amount: number;
      date: string;
      status: 'paid' | 'pending';
    }>;
  };
  team?: {
    members: Array<{
      id: string;
      name: string;
      email: string;
      role: 'owner' | 'admin' | 'member';
    }>;
    invitations?: Array<{
      email: string;
      role: string;
      status: 'pending' | 'accepted';
    }>;
  };
}


export interface ServiceRequestMedia {
  type: 'image' | 'video';
  url: string;
  filename?: string;
  uploadedAt?: string;
}

export interface ChatMessage {
    sender: { name: string; avatar: string };
    message: string;
    isSelf: boolean;
}

/**
 * Comment/message on a service request
 */
export interface ServiceRequestComment {
    id: string;
    /** User ID of commenter */
    userId: string;
    /** User name */
    userName: string;
    /** User avatar URL */
    userAvatar: string;
    /** User role */
    userRole: UserRole;
    /** Comment text */
    message: string;
    /** Timestamp */
    timestamp: string;
    /** Attached files */
    attachments?: { type: 'image' | 'file'; url: string; filename: string }[];
}

export enum ActivityLogType {
  Scheduled = "Scheduled",
  Arrived = "Arrived",
  Completed = "Completed",
  Created = "Created",
  Viewed = "Viewed",
  ContractorAssigned = "ContractorAssigned",
  StatusChanged = "StatusChanged",
  CommentAdded = "CommentAdded",
  MediaUploaded = "MediaUploaded",
}

export interface ActivityLogItem {
  id: string;
  type: ActivityLogType;
  title: string;
  timestamp: string;
  description?: string;
  /** User who performed the action */
  userId?: string;
  userName?: string;
  /** Related entity ID (service request, property, etc.) */
  relatedEntityId: string;
  relatedEntityType: 'ServiceRequest' | 'Property' | 'Unit' | 'Document';
}

export interface SpecificServiceRequestDetail {
  activityLog: ActivityLogItem[];
  requestInfo: {
    timeOpen: number;
    updates: number;
    notes: number;
  };
  notes: { text: string }[];
}


export interface ServiceContact {
    role?: string;
    name: string;
    avatar: string;
    id?: string;
    rating?: number;
    phone: string;
    email: string;
}

export interface ContactCardData {
    title: string;
    contacts: ServiceContact[];
    workScope?: string;
    projectEtc?: string;
    date?: string;
}

export interface SuggestedVendor {
    imageUrl: string;
    logo: React.ElementType | string;
    name: string;
    rating: number;
}