/**
 * Application Constants and Static Data
 * 
 * This file contains constant values, static data, and configuration settings
 * used throughout the SuGhar application. These are primarily used for:
 * - Dashboard statistics and charts
 * - UI element configurations
 * - Sample/demo data for various pages
 * - Settings and preferences
 * 
 * Note: Some of these constants would be replaced by API calls in a production environment.
 */

import React from 'react';
import {
  DollarSign, HomeIcon, FileText, CheckCircle2, TrendingUp,
  FileWarning, Users, Wrench, Bell, Mail,
  Building, Zap, User, Star, UserPlus
} from './components/icons';
// FIX: Changed import to relative path.
import {
  FinancialStat, ExpenseData, RevenueData,
  DocumentDashboardStat, ActionCenterItem,
  AccountDetails, BillingPlan, PaymentMethod, Invoice, TeamMember, NotificationSetting, SettingsData,
  InvoiceStatus, Theme, CategorizedDocument, Document, DocumentType, Application, TenantDashboardStat, VacantUnit, RentStatusData, QuickViewAction, CurrentTenant, RentStatus
} from './types';


// ============ Financial Dashboard Constants ============

/**
 * Key financial statistics displayed on the Financials Dashboard
 * These provide a high-level overview of the property portfolio's financial health
 */
export const FINANCIAL_STATS: FinancialStat[] = [
  { icon: DollarSign, label: 'Total Revenue', value: '$1,250,000', color: 'text-green-500' },
  { icon: TrendingUp, label: 'Profit', value: '$250,000', color: 'text-blue-500' },
  { icon: DollarSign, label: 'Total Expenses', value: '$1,000,000', color: 'text-red-500' },
  { icon: FileWarning, label: 'Pending Invoices', value: '12', color: 'text-yellow-500' },
  { icon: CheckCircle2, label: 'Paid Invoices', value: '150', color: 'text-purple-500' },
];

export const EXPENSE_TYPE_DATA: ExpenseData[] = [
  { name: 'Maintenance', value: 400, percent: 0.4 },
  { name: 'Utilities', value: 300, percent: 0.3 },
  { name: 'Salaries', value: 200, percent: 0.2 },
  { name: 'Admin', value: 100, percent: 0.1 },
];

export const MONTHLY_REVENUE_DATA: RevenueData[] = [
  { month: 'Jan', revenue: 100000 },
  { month: 'Feb', revenue: 110000 },
  { month: 'Mar', revenue: 105000 },
  { month: 'Apr', revenue: 120000 },
  { month: 'May', revenue: 115000 },
  { month: 'Jun', revenue: 125000 },
];

// FIX: Added all missing constants to resolve import errors.
export const RECENT_EXPENSE_DOCS: Document[] = [
  { id: 'DOC-E1', name: 'Water Bill - Sept', type: DocumentType.Utilities, uploadDate: '2024-09-28', building: 'B-LC', unit: 'N/A', amount: 5000, category: 'Expense' },
  { id: 'DOC-E2', name: 'Elevator Maintenance', type: DocumentType.Service, uploadDate: '2024-09-25', building: 'B-BH', unit: 'N/A', amount: 15000, category: 'Expense' },
];

export const RECENT_INCOME_DOCS: Document[] = [
  { id: 'DOC-I1', name: 'Rent - Unit 1A', type: DocumentType.Lease, uploadDate: '2024-09-05', building: 'B-LC', unit: '1A', amount: 25000, category: 'Income' },
  { id: 'DOC-I2', name: 'Rent - Unit 2A', type: DocumentType.Lease, uploadDate: '2024-09-03', building: 'B-BH', unit: '2A', amount: 45000, category: 'Income' },
];

export const APPLICATIONS_PAGE_DATA: Application[] = [
    { id: 'APP-001', buildingId: 'B-DR', tenant: { id: 'T-New-1', name: 'Raiyan Rahman', avatar: 'https://i.pravatar.cc/40?u=raiyan', rating: 4.8 }, unit: '1A', matchPercentage: 92, submissionDate: '2024-09-20' },
    { id: 'APP-002', buildingId: 'B-DR', tenant: { id: 'T-New-2', name: 'Niloy Hossain', avatar: 'https://i.pravatar.cc/40?u=niloy', rating: 4.2 }, unit: '1A', matchPercentage: 78, submissionDate: '2024-09-18' },
];

export const TENANT_DASHBOARD_STATS: TenantDashboardStat[] = [
    { icon: Users, label: 'Total Tenants', value: '28', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { icon: UserPlus, label: 'New Applicants', value: '6', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { icon: FileWarning, label: 'Leases Ending Soon', value: '1', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { icon: HomeIcon, label: 'Vacant Units', value: '1', bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    { icon: Wrench, label: 'Open Requests', value: '9', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
];

export const VACANT_UNITS_BY_BUILDING_DATA: VacantUnit[] = [
  { name: 'Lalmatia C.', vacant: 0 },
  { name: 'Banani H.', vacant: 0 },
  { name: 'Dhanmondi R.', vacant: 1 },
  { name: 'Uttara G.', vacant: 0 },
];

export const RENT_STATUS_CHART_DATA: RentStatusData[] = [
    { name: 'On Time', value: 96 },
    { name: 'Late', value: 4 },
];

export const QUICK_VIEW_ACTIONS: QuickViewAction[] = [
  { value: '1', label: 'Overdue Rents' },
  { value: '3', label: 'New Messages' },
  { value: '5', label: 'Ending Leases' },
  { label: 'Screen New Tenants', isFullText: true },
];

export const CURRENT_TENANTS_DATA: CurrentTenant[] = [
    // FIX: Add missing joinDate property
    { id: 'T-1', name: 'Farzana Akhter', avatar: 'https://i.pravatar.cc/40?u=T-1', building: 'Lalmatia Court', unit: '1A', leaseProgress: 80, rentStatus: RentStatus.Paid, requests: 0, rating: 4.8, reviewHistory: [], joinDate: '2023-01-15' },
    // FIX: Add missing joinDate property
    { id: 'T-2', name: 'Amrul Hoque', avatar: 'https://i.pravatar.cc/40?u=T-2', building: 'Lalmatia Court', unit: '2A', leaseProgress: 95, rentStatus: RentStatus.Paid, requests: 1, rating: 4.5, reviewHistory: [], joinDate: '2022-08-20' },
    // FIX: Add missing joinDate property
    { id: 'T-3', name: 'Shahriar Karim', avatar: 'https://i.pravatar.cc/40?u=T-3', building: 'Lalmatia Court', unit: '3A', leaseProgress: 20, rentStatus: RentStatus.Overdue, requests: 0, rating: 3.9, reviewHistory: [], joinDate: '2024-05-10' },
];

export const MOST_RECENT_DOCUMENTS: Document[] = [
    { id: 'DOC-101', name: 'Lease - U1A, B-LC.pdf', type: DocumentType.Lease, uploadDate: '2024-09-28', building: 'B-LC', unit: '1A' },
    { id: 'DOC-102', name: 'Invoice_Sept_Maintenance.pdf', type: DocumentType.Service, uploadDate: '2024-09-27', building: 'B-BH', unit: 'N/A' },
];

export const STARRED_DOCUMENTS: Document[] = [
    { id: 'DOC-201', name: 'Building Permit B-BH.pdf', type: DocumentType.Certifications, uploadDate: '2022-01-10', building: 'B-BH', unit: 'N/A', isStarred: true },
];


export const SPECIFIC_BUILDING_DOCUMENTS_DATA: { [key: string]: CategorizedDocument[] } = {
    'B-001': [
        { category: 'Legal Documents', icon: FileText, items: [{ name: 'Building Permit.pdf', date: '2022-01-15' }] },
        { category: 'Financial Records', icon: DollarSign, items: [{ name: '2023 Tax Return.pdf', date: '2024-04-10' }] },
    ]
};


export const DOCUMENT_DASHBOARD_STATS: DocumentDashboardStat[] = [
    { icon: FileText, label: 'Total Documents', value: '5,280', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { icon: Star, label: 'Starred Documents', value: '125', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { icon: CheckCircle2, label: 'Verified Documents', value: '4,800', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { icon: FileWarning, label: 'Expiring Soon', value: '32', bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    { icon: Wrench, label: 'Service Records', value: '500', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
];

export const DOCUMENT_TYPE_DISTRIBUTION_DATA: any[] = [
    { name: 'Lease Agreements', value: 40, percentage: '40%' },
    { name: 'Utility Bills', value: 25, percentage: '25%' },
    { name: 'Income Proof', value: 20, percentage: '20%' },
    { name: 'Others', value: 15, percentage: '15%' },
];

export const DOCUMENTS_UPLOADED_DATA: any[] = [
    { month: 'Mar', count: 120 }, { month: 'Apr', count: 150 }, { month: 'May', count: 130 },
    { month: 'Jun', count: 180 }, { month: 'Jul', count: 200 }, { month: 'Aug', count: 220 },
];

// ============ Home Dashboard Constants ============

/**
 * Action center items highlighting tasks requiring immediate attention
 */
export const ACTION_CENTER_ITEMS: ActionCenterItem[] = [
  { icon: Wrench, label: 'New service requests (3)', isAlert: true, targetPage: 'service-requests' },
  { icon: Users, label: 'Pending Applications (2)', isAlert: true, targetPage: 'tenants', targetTab: 'Applications' },
  { icon: FileWarning, label: 'Ending leases (8)', isAlert: false },
  { icon: Bell, label: 'Review notifications', isAlert: false },
  { icon: Mail, label: 'Unread messages (5)', isAlert: false },
];

export const ACCOUNT_DETAILS_DATA: AccountDetails = {
    name: 'Monir Rahman',
    role: 'Property Manager',
    email: 'monir.rahman@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=monir',
    memberSince: 'Jan 2022'
};

export const BILLING_PLAN_DATA: BillingPlan = {
    name: 'Pro Plan',
    price: 99,
    billingCycle: 'monthly',
    nextPayment: 'Oct 25, 2024'
};

export const PAYMENT_METHOD_DATA: PaymentMethod = {
    cardType: 'Visa',
    lastFour: '4242'
};

export const INVOICE_HISTORY_DATA: Invoice[] = [
    { id: '#INV-001', date: 'Sep 25, 2024', amount: 99.00, status: InvoiceStatus.Paid },
    { id: 'INV-002', date: 'Aug 25, 2024', amount: 99.00, status: InvoiceStatus.Paid },
    { id: 'INV-003', date: 'Jul 25, 2024', amount: 99.00, status: InvoiceStatus.Paid },
];

export const TEAM_MEMBERS_DATA: TeamMember[] = [
    { id: 'TM-1', name: 'Farida Khanom', role: 'Accountant', avatarUrl: 'https://i.pravatar.cc/150?u=farida' },
    { id: 'TM-2', name: 'Karim Ahmed', role: 'Maintenance Lead', avatarUrl: 'https://i.pravatar.cc/150?u=karim' },
];

export const NOTIFICATION_SETTINGS_DATA: NotificationSetting[] = [
    { id: 'ns-1', label: 'New Service Requests', description: 'Get notified for new maintenance requests.', email: true, push: true },
    { id: 'ns-2', label: 'New Tenant Applications', description: 'Receive alerts for new rental applications.', email: true, push: false },
];

export const SETTINGS_DATA: SettingsData = {
  general: {
    language: 'English (US)',
    currency: 'Bangladeshi Taka (BDT)',
    timezone: '(GMT+6:00) Dhaka',
  },
  appearance: {
    theme: 'Light',
  },
  security: {
    twoFactorEnabled: true,
  },
  profile: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+880 1XXX-XXXXXX',
    profilePictureUrl: 'https://i.pravatar.cc/150?u=john@example.com',
    language: 'English (US)',
    timezone: '(GMT+6:00) Dhaka'
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    serviceRequestUpdates: true,
    paymentReminders: true
  }
};

export const LANGUAGE_OPTIONS = ['English (US)', 'Bengali'];
export const CURRENCY_OPTIONS = ['Bangladeshi Taka (BDT)', 'US Dollar (USD)'];
export const TIMEZONE_OPTIONS = ['(GMT+6:00) Dhaka', '(GMT-5:00) Eastern Time'];
