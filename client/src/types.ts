import React from 'react';

export interface FinancialStat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

export interface FinancialStatsResponse {
  revenueThisMonth: number;
  incomingRent: number;
  overdueRent: number;
  serviceCosts: number;
  utilitiesCosts: number;
}

export enum DocumentType {
  Lease = "Lease",
  Utilities = "Utilities / Bills",
  Income = "Income / Tax",
  Insurance = "Insurance",
  Service = "Service / Contract",
  Certifications = "Certifications",
}

export interface Document {
  id: string;
  name: string;
  building: string;
  unit: string;
  type: DocumentType;
  uploadDate: string;
}

export interface ExpenseData {
  name: string;
  value: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface BuildingStat {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

export interface VacantUnit {
  name: string;
  vacant: number;
}

export interface Occupancy {
  name: string;
  value: number;
}

export interface BuildingInfo {
  id: string;
  name: string;
  totalUnits: number;
  vacantUnits: number;
  activeRequests: number;
}

export interface RentCollection {
    month: string;
    rent: number;
}

// Dashboard Stats API Response Types
export interface DashboardStats {
  properties: {
    total: number;
    addresses: string[];
  };
  units: {
    total: number;
    occupied: number;
    vacant: number;
    occupancyRate: number;
    totalRevenue: number;
    details: {
      _id: string;
      unitNumber: string;
      status: 'occupied' | 'vacant';
      monthlyRent: number;
      property: string;
    }[];
  };
  serviceRequests: {
    total: number;
    active: number;
    completed: number;
    completedToday: number;
    recent: {
      _id: string;
      description: string;
      status: string;
      tenant: string;
      unit: string;
      property: string;
      requestDate: string;
    }[];
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  leases: {
    total: number;
    endingSoon: number;
    endingToday: number;
  };
}

// New Types for Buildings, Units, Applications

export enum BuildingCategory {
  Luxury = "Luxury",
  Standard = "Standard",
  MidRange = "Mid-range",
}

export interface BuildingDetail {
  id: string;
  name: string;
  address: string;
  category: BuildingCategory;
  totalUnits: number;
  vacantUnits: number;
  requests: number;
  occupationPercentage: number;
  rentCollectionPercentage: number;
  assignedContact: {
    name: string;
    avatar: string;
  };
}

export enum UnitStatus {
  Rented = "Rented",
  Vacant = "Vacant",
}

export enum RentStatus {
  Paid = "Paid",
  Overdue = "Overdue",
  Pending = "Pending",
}

export interface UnitDetail {
    id: string;
    buildingId: string;
    unitNumber: string;
    category: BuildingCategory;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    rent: number;
    monthlyRent: number;
    status: UnitStatus;
    tenant: {
        id: string;
        name: string;
        avatar: string;
    } | null;
    rentStatus: RentStatus | null;
    leaseStartDate: string | null;
    leaseEndDate: string | null;
    requests: number;
}

export interface Application {
    id: string;
    tenant: {
        id: string;
        name: string;
        avatar: string;
        rating: number;
    };
    unit: string;
    buildingId: string;
    matchPercentage: number;
    submissionDate: string;
}

// Types for Specific Building Page
export interface SpecificBuildingStat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export interface LeaseEndingSoon {
  tenant: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  unit: string;
  leaseStartDate: string;
  leaseEndDate: string;
}

export interface OverdueRent {
  tenant: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  unit: string;
  amountDue: number;
  daysOverdue: number;
}

// Types for Specific Building Documents Page
export interface DocumentItem {
  name: string;
  date: string;
}

export interface CategorizedDocument {
  category: string;
  icon: React.ElementType;
  items: DocumentItem[];
}

// Types for Service Requests Page
export enum RequestStatus {
    Complete = "Complete",
    Pending = "Pending",
    InProgress = "In Progress",
}

export interface ServiceRequest {
    id: string;
    building: string;
    unit: number;
    assignedContact: {
        name: string;
        avatar: string;
    };
    requests: number;
    requestDate: string;
    status: RequestStatus;
}

// Types for Specific Service Request Page
export interface MessageSender {
    name: string;
    avatar: string;
}

export interface ChatMessage {
    sender: MessageSender;
    message: string;
    isSelf: boolean;
}

export interface ServiceRequestStatusUpdate {
    status: string;
    date: string;
}

export interface ServiceRequestMedia {
    type: 'image' | 'video';
    url: string;
}

export enum ActivityLogType {
    Scheduled = 'Scheduled',
    Arrived = 'Arrived',
    Completed = 'Completed',
}

export interface ActivityLogItem {
    type: ActivityLogType;
    title: string;
    timestamp: string;
    description?: string;
}

export interface RequestInfoStats {
    timeOpen: number; // in days
    updates: number;
    notes: number;
}

export interface ServiceRequestNote {
    text: string;
}

export interface ServiceContact {
    name: string;
    avatar: string;
    rating?: number;
    phone: string;
    email: string;
    role?: string; 
    id?: string; 
}

export interface ContactCardData {
    title: string;
    contacts: ServiceContact[];
    workScope?: string;
    projectEtc?: string;
    date?: string;
}

export interface SuggestedVendor {
    name:string;
    logo: string;
    imageUrl: string;
    rating: number;
}

export interface SpecificServiceRequestDetail {
    id: string;
    title: string;
    status: RequestStatus;
    requester: {
        name: string;
        avatar: string;
        rating: number;
    };
    requestDate: string;
    buildingName: string;
    category: string;
    priority: string;
    description: string;
    statusUpdates: ServiceRequestStatusUpdate[];
    comments: ChatMessage[];
    media?: ServiceRequestMedia[];
    activityLog?: ActivityLogItem[];
    requestInfo?: RequestInfoStats;
    notes?: ServiceRequestNote[];
    contactCards?: ContactCardData[];
    suggestedVendors?: SuggestedVendor[];
}

// Types for Tenants Dashboard
export interface TenantDashboardStat {
    label: string;
    value: string;
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
}

export interface Tenant {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    building: string;
    leaseProgress: number; // percentage
    rentStatus: RentStatus;
    requests: number;
}

export interface CurrentTenant extends Omit<Tenant, 'leaseProgress'> {
    unit: number;
    leaseProgress: {
        value: number;
        variant: 'dark' | 'light';
    };
}

export interface RentStatusData {
    name: 'On Time' | 'Late';
    value: number;
}

export interface QuickViewAction {
    label: string;
    value: string;
    isFullText?: boolean;
}

export interface TenantApplication {
    id: string;
    tenant: {
        id: string;
        name: string;
        avatar: string;
        rating: number;
    };
    building: string;
    unit: string;
    matchPercentage: number;
    submissionDate: string;
}

export interface VerifiedTenantApplication {
     id: string;
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

// Types for Documents Dashboard
export interface DocumentDashboardStat {
    label: string;
    value: string;
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
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

// Types for Home Dashboard
export interface HomeStat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
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

export interface ActionCenterItem {
    label: string;
    icon: React.ElementType;
    isAlert?: boolean;
}

export interface HighPriorityTenant {
    id: string;
    name: string;
    avatar: string;
    unit: string;
    daysOverdue: number;
}

// Types for Account Overview Page
export interface AccountDetails {
    name: string;
    email: string;
    role: string;
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

// Types for Settings Page
export type Theme = 'Light' | 'Dark' | 'System';

export interface SettingsData {
    general: {
        language: string;
        currency: string;
        timezone: string;
    };
    appearance: {
        theme: Theme;
    };
    security: {
        twoFactorEnabled: boolean;
    };
}

// Types for Tenant Detail Page
export interface TenantReference {
    id: string;
    name: string;
    avatar: string;
    rating: number;
}

export interface TrustVerificationCheck {
    item: string;
    verified: boolean;
}

export interface TimelineEvent {
    event: string;
    date: string;
    icon: React.ElementType;
}

export interface TenantDetailData {
    id: string;
    name: string;
    buildingName: string;
    unitName: string;
    avatarUrl: string;
    education: {
        degree: string;
        university: string;
        years: string;
    };
    employment: {
        role: string;
        company: string;
        years: string;
        income: number;
    };
    references: TenantReference[];
    documents: {
        name: string;
    }[];
    notes: {
        text: string;
        date: string;
    }[];
    trustAndVerification: {
        score: number;
        checks: TrustVerificationCheck[];
    };
    timeline: TimelineEvent[];
    financialSummary: {
        monthlyRent: number;
        monthlyIncome: number;
        deposit: number;
    };
}