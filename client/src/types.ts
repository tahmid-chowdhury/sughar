import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  password?: string;
}

export interface FinancialStat {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

export interface ExpenseData {
  name: string;
  value: number;
  percent: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

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


export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string;
  building: string;
  unit: string;
  amount?: number;
  category?: 'Income' | 'Expense';
  isStarred?: boolean;
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

export enum BuildingCategory {
    Luxury = "Luxury",
    MidRange = "Mid-Range",
    Standard = "Standard",
}

export interface BuildingDetail {
    id: string;
    name: string;
    address: string;
    category: BuildingCategory;
    totalUnits: number;
    vacantUnits: number;
    requests: number;
    occupation: number;
    rentCollection: number;
    contact: {
        name: string;
        avatar: string;
    };
}


export enum UnitStatus {
    Rented = 'Rented',
    Vacant = 'Vacant',
}

export enum RentStatus {
    Paid = 'Paid',
    Overdue = 'Overdue',
    Pending = 'Pending',
}

export interface UnitDetail {
    id: string;
    buildingId: string;
    unitNumber: string;
    category: BuildingCategory;
    monthlyRent: number;
    status: UnitStatus | null;
    currentTenantId: string | null;
    previousTenantId?: string | null;
    rentStatus: RentStatus | null;
    leaseStartDate: string | null;
    leaseEndDate: string | null;
    requests: number;
    bedrooms: number;
    bathrooms: number;
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

export interface Tenant {
    id: string;
    name: string;
    avatar: string;
    building: string;
    unit: string;
    leaseProgress: number;
    rentStatus: RentStatus;
    requests: number;
    rating: number;
    reviewHistory: TenantReview[];
    joinDate: string;
}

export enum RequestStatus {
    Complete = 'Complete',
    InProgress = 'In Progress',
    Pending = 'Pending',
}

export interface ServiceRequest {
    id: string;
    title: string;
    tenantId: string;
    buildingId: string;
    unitId: string;
    assignedContact?: {
        name: string;
        avatar: string;
    };
    requestDate: string;
    completionDate?: string;
    status: RequestStatus;
    priority: 'High' | 'Medium' | 'Low';
    description: string;
}

export enum ApplicationStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Denied = 'Denied',
}

export interface RentalApplication {
    id: string;
    userId: string;
    status: ApplicationStatus;
    statement: string;
    occupation: string;
    employer: string;
    monthlyIncome: string;
    yearsAtEmployer: number;
    documents: { type: string; url: string }[];
    references: { name: string; relation: string; phone: string }[];
}


export interface AppData {
  users: User[];
  buildings: BuildingDetail[];
  units: UnitDetail[];
  tenants: Tenant[];
  documents: Document[];
  serviceRequests: ServiceRequest[];
  rentalApplications: RentalApplication[];
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


export interface ServiceRequestMedia {
  type: 'image' | 'video';
  url: string;
}

export interface ChatMessage {
    sender: { name: string; avatar: string };
    message: string;
    isSelf: boolean;
}

export enum ActivityLogType {
  Scheduled = "Scheduled",
  Arrived = "Arrived",
  Completed = "Completed",
}

export interface ActivityLogItem {
  type: ActivityLogType;
  title: string;
  timestamp: string;
  description?: string;
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