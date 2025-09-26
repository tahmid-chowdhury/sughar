import { 
    FinancialStat, 
    Document, 
    DocumentType, 
    ExpenseData, 
    RevenueData,
    BuildingStat,
    VacantUnit,
    Occupancy,
    BuildingInfo,
    RentCollection,
    BuildingDetail,
    BuildingCategory,
    UnitDetail,
    UnitStatus,
    RentStatus,
    Application,
    SpecificBuildingStat,
    LeaseEndingSoon,
    OverdueRent,
    CategorizedDocument,
    ServiceRequest,
    RequestStatus,
    SpecificServiceRequestDetail,
    ActivityLogType,
    TenantDashboardStat,
    Tenant,
    CurrentTenant,
    RentStatusData,
    QuickViewAction,
    TenantApplication,
    VerifiedTenantApplication,
    DocumentDashboardStat,
    DocumentDistribution,
    UploadedDocumentData,
    HomeStat,
    MonthlyProfitData,
    ServiceRequestVolume,
    ActionCenterItem,
    HighPriorityTenant,
    AccountDetails,
    BillingPlan,
    PaymentMethod,
    Invoice,
    InvoiceStatus,
    TeamMember,
    NotificationSetting,
    SettingsData,
    TenantDetailData,
} from './types';
import { 
    DollarSign, 
    ArrowUp, 
    ArrowDown, 
    Wrench, 
    Settings, 
    HomeIcon,
    Check,
    X,
    FileText,
    Zap,
    Users,
    Building,
    Calendar,
    Star,
    Bell,
    FileWarning,
    TrendingUp,
    CheckCircle2,
    Mail,
} from './components/icons';

export const FINANCIAL_STATS: FinancialStat[] = [
  { label: 'Revenue This Month', value: '$715,000', icon: DollarSign, color: 'text-green-500' },
  { label: 'Incoming Rent', value: '$63,000', icon: ArrowUp, color: 'text-blue-500' },
  { label: 'Overdue Rent', value: '$85,000', icon: ArrowDown, color: 'text-red-500' },
  { label: 'Utilities/Misc Expenses', value: '$16,000', icon: Settings, color: 'text-yellow-500' },
  { label: 'Service Costs', value: '$21,000', icon: Wrench, color: 'text-purple-500' },
];

export const RECENT_EXPENSE_DOCS: Document[] = [
  { id: 'EXP001', name: 'Unit 12A Lease Agreement', building: 'BLDG-001', unit: 'A1', type: DocumentType.Lease, uploadDate: '9/15/2025' },
  { id: 'EXP002', name: 'Gulshan Towers Water Bill', building: 'BLDG-004', unit: 'A7', type: DocumentType.Utilities, uploadDate: '8/26/2025' },
  { id: 'EXP003', name: 'Shakti Pest Svcs Contract', building: 'BLDG-0023', unit: 'B2', type: DocumentType.Service, uploadDate: '9/31/2025' },
  { id: 'EXP004', name: 'Jamuna Palaces Income Statement', building: 'BLDG-0014', unit: 'B9', type: DocumentType.Income, uploadDate: '9/14/2025' },
  { id: 'EXP005', name: 'City Lights Plumbing Service Invoice', building: 'BLDG-0012', unit: 'D1', type: DocumentType.Service, uploadDate: '9/28/2025' },
];

export const RECENT_INCOME_DOCS: Document[] = [
  { id: 'INC001', name: 'Unit A1 Rent Payment', building: 'BLDG-001', unit: 'A1', type: DocumentType.Income, uploadDate: '9/15/2025' },
  { id: 'INC002', name: 'Unit A2 Rent Payment', building: 'BLDG-001', unit: 'A2', type: DocumentType.Income, uploadDate: '9/15/2025' },
  { id: 'INC003', name: 'Gulshan Towers Income Statement', building: 'BLDG-004', unit: '---', type: DocumentType.Income, uploadDate: '9/14/2025' },
  { id: 'INC004', name: 'Dhaka Deluxe Income Statement', building: 'BLDG-003', unit: '---', type: DocumentType.Income, uploadDate: '9/14/2025' },
];

export const EXPENSE_TYPE_DATA: ExpenseData[] = [
  { name: 'Mortgages', value: 35 },
  { name: 'Service Contracts', value: 30 },
  { name: 'Utilities', value: 25 },
  { name: 'Cleaning Services', value: 10 },
];

export const MONTHLY_REVENUE_DATA: RevenueData[] = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
  { month: 'Jul', revenue: 7000 },
  { month: 'Aug', revenue: 8000 },
  { month: 'Sep', revenue: 7500 },
  { month: 'Oct', revenue: 7200 },
  { month: 'Nov', revenue: 8500 },
  { month: 'Dec', revenue: 9000 },
];

export const BUILDING_STATS: BuildingStat[] = [
  { label: 'Total Buildings', value: '125', icon: HomeIcon, iconBgColor: 'bg-red-100', iconColor: 'text-red-600' },
  { label: 'Total Units', value: '1,050', icon: HomeIcon, iconBgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { label: 'Occupied Units', value: '850', icon: Check, iconBgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { label: 'Vacant Units', value: '200', icon: X, iconBgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { label: 'Service Requests', value: '120', icon: Settings, iconBgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
];

export const VACANT_UNITS_BY_BUILDING_DATA: VacantUnit[] = [
    { name: '1', vacant: 32 }, { name: '2', vacant: 20 }, { name: '3', vacant: 40 },
    { name: '4', vacant: 60 }, { name: '5', vacant: 52 }, { name: '6', vacant: 70 },
    { name: '7', vacant: 33 }, { name: '8', vacant: 82 }, { name: '9', vacant: 75 },
    { name: '10', vacant: 51 }, { name: '11', vacant: 35 }, { name: '12', vacant: 50 },
];

export const OCCUPANCY_DATA: Occupancy[] = [
    { name: 'Occupied', value: 85 },
    { name: 'Vacant', value: 15 },
];

export const BUILDINGS_TABLE_DATA: BuildingInfo[] = [
    { id: 'B1', name: 'Bosundhara Complex', totalUnits: 15, vacantUnits: 3, activeRequests: 8 },
    { id: 'B2', name: 'Gulshan Towers', totalUnits: 26, vacantUnits: 10, activeRequests: 10 },
    { id: 'B3', name: 'Bijoy Estates', totalUnits: 18, vacantUnits: 5, activeRequests: 6 },
    { id: 'B4', name: 'Dhaka District 1 Highrise', totalUnits: 45, vacantUnits: 15, activeRequests: 21 },
];

export const RENT_COLLECTION_DATA: RentCollection[] = [
    { month: 'Jan', rent: 20000 }, { month: 'Feb', rent: 22000 }, { month: 'Mar', rent: 21000 },
    { month: 'Apr', rent: 25000 }, { month: 'May', rent: 24000 }, { month: 'Jun', rent: 28000 },
    { month: 'Jul', rent: 32000 }, { month: 'Aug', rent: 31000 }, { month: 'Sep', rent: 30000 },
    { month: 'Oct', rent: 28000 }, { month: 'Nov', rent: 29000 }, { month: 'Dec', rent: 27000 },
];


// New Mock Data
const generateAvatar = () => `https://i.pravatar.cc/40?u=${Math.random()}`;

export const BUILDING_NAMES: { [key: string]: string } = {
    'BLDG-001': 'Bosundhara Suites A1',
    'BLDG-002': 'Gulshan Towers',
    'BLDG-003': 'Bijoy Estates',
    'BLDG-004': 'Dhaka District 1 Highrise',
};


export const BUILDINGS_PAGE_DATA: BuildingDetail[] = [
    { id: 'BLDG-001', category: BuildingCategory.Luxury, totalUnits: 15, vacantUnits: 5, requests: 8, occupation: 66, rentCollection: 84, contact: { name: 'Arif Hossain', avatar: generateAvatar() } },
    { id: 'BLDG-002', category: BuildingCategory.Luxury, totalUnits: 26, vacantUnits: 14, requests: 10, occupation: 46, rentCollection: 96, contact: { name: 'Shariful Islam', avatar: generateAvatar() } },
    { id: 'BLDG-003', category: BuildingCategory.Standard, totalUnits: 18, vacantUnits: 7, requests: 6, occupation: 61, rentCollection: 45, contact: { name: 'Rafiqul Karim', avatar: generateAvatar() } },
    { id: 'BLDG-004', category: BuildingCategory.MidRange, totalUnits: 45, vacantUnits: 12, requests: 21, occupation: 73, rentCollection: 80, contact: { name: 'Tamim Ahmed', avatar: generateAvatar() } },
    { id: 'BLDG-002', category: BuildingCategory.MidRange, totalUnits: 15, vacantUnits: 4, requests: 8, occupation: 73, rentCollection: 75, contact: { name: 'Kamal Uddin', avatar: generateAvatar() } },
    { id: 'BLDG-002', category: BuildingCategory.Luxury, totalUnits: 26, vacantUnits: 8, requests: 10, occupation: 69, rentCollection: 89, contact: { name: 'Faridul Haque', avatar: generateAvatar() } },
];

export const UNITS_PAGE_DATA: UnitDetail[] = [
    { buildingId: 'BLDG-001', unitNumber: 'A1', category: BuildingCategory.Luxury, monthlyRent: 95000, status: UnitStatus.Rented, tenant: { id: 'T001', name: 'Arif Hossain', avatar: generateAvatar() }, rentStatus: RentStatus.Paid, leaseStartDate: '10/10/2024', leaseEndDate: '10/10/2025', requests: 8 },
    { buildingId: 'BLDG-001', unitNumber: 'A2', category: BuildingCategory.Luxury, monthlyRent: 120000, status: UnitStatus.Rented, tenant: { id: 'T002', name: 'Shariful Islam', avatar: generateAvatar() }, rentStatus: RentStatus.Paid, leaseStartDate: '10/15/2024', leaseEndDate: '10/15/2025', requests: 10 },
    { buildingId: 'BLDG-001', unitNumber: 'A3', category: BuildingCategory.Standard, monthlyRent: 11000, status: UnitStatus.Vacant, tenant: null, rentStatus: null, leaseStartDate: null, leaseEndDate: null, requests: 6 },
    { buildingId: 'BLDG-001', unitNumber: 'A4', category: BuildingCategory.MidRange, monthlyRent: 30000, status: UnitStatus.Vacant, tenant: null, rentStatus: null, leaseStartDate: null, leaseEndDate: null, requests: 21 },
    { buildingId: 'BLDG-001', unitNumber: 'A5', category: BuildingCategory.MidRange, monthlyRent: 55000, status: UnitStatus.Vacant, tenant: null, rentStatus: null, leaseStartDate: null, leaseEndDate: null, requests: 8 },
    { buildingId: 'BLDG-001', unitNumber: 'A6', category: BuildingCategory.Luxury, monthlyRent: 89000, status: UnitStatus.Rented, tenant: { id: 'T006', name: 'Faridul Haque', avatar: generateAvatar() }, rentStatus: RentStatus.Overdue, leaseStartDate: '9/26/2024', leaseEndDate: '9/26/2025', requests: 10 },
    { buildingId: 'BLDG-001', unitNumber: 'A7', category: BuildingCategory.Luxury, monthlyRent: 145000, status: UnitStatus.Rented, tenant: { id: 'T007', name: 'Jahid Hasan', avatar: generateAvatar() }, rentStatus: RentStatus.Pending, leaseStartDate: '9/31/2024', leaseEndDate: '9/31/2025', requests: 6 },
    { buildingId: 'BLDG-001', unitNumber: 'A8', category: BuildingCategory.Luxury, monthlyRent: 138000, status: UnitStatus.Rented, tenant: { id: 'T008', name: 'Monir Rahman', avatar: generateAvatar() }, rentStatus: RentStatus.Paid, leaseStartDate: '11/14/2024', leaseEndDate: '11/14/2025', requests: 21 },
    { buildingId: 'BLDG-001', unitNumber: 'A9', category: BuildingCategory.MidRange, monthlyRent: 42000, status: UnitStatus.Rented, tenant: { id: 'T009', name: 'Nusrat Jahan', avatar: generateAvatar() }, rentStatus: RentStatus.Paid, leaseStartDate: '11/23/2024', leaseEndDate: '11/23/2025', requests: 8 },
    { buildingId: 'BLDG-001', unitNumber: 'A10', category: BuildingCategory.Standard, monthlyRent: 16000, status: UnitStatus.Vacant, tenant: null, rentStatus: null, leaseStartDate: null, leaseEndDate: null, requests: 10 },
    { buildingId: 'BLDG-001', unitNumber: 'B1', category: BuildingCategory.MidRange, monthlyRent: 30000, status: UnitStatus.Rented, tenant: { id: 'radhika-islam', name: 'Radhika Islam', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop' }, rentStatus: RentStatus.Paid, leaseStartDate: '10/01/2024', leaseEndDate: '10/01/2025', requests: 2 },
    { buildingId: 'BLDG-001', unitNumber: 'B2', category: BuildingCategory.Luxury, monthlyRent: 165000, status: UnitStatus.Rented, tenant: { id: 'T012', name: 'Fatema Khatun', avatar: generateAvatar() }, rentStatus: RentStatus.Pending, leaseStartDate: '12/14/2024', leaseEndDate: '12/14/2025', requests: 21 },
    { buildingId: 'BLDG-001', unitNumber: 'B3', category: BuildingCategory.MidRange, monthlyRent: 29000, status: UnitStatus.Vacant, tenant: null, rentStatus: null, leaseStartDate: null, leaseEndDate: null, requests: 8 },
    { buildingId: 'BLDG-001', unitNumber: 'B4', category: BuildingCategory.Luxury, monthlyRent: 180000, status: UnitStatus.Rented, tenant: { id: 'T014', name: 'Maliha Sultana', avatar: generateAvatar() }, rentStatus: RentStatus.Paid, leaseStartDate: '12/24/2024', leaseEndDate: '12/24/2025', requests: 10 },
    { buildingId: 'BLDG-001', unitNumber: 'B5', category: BuildingCategory.MidRange, monthlyRent: 40000, status: UnitStatus.Vacant, tenant: null, rentStatus: null, leaseStartDate: null, leaseEndDate: null, requests: 6 },
    { buildingId: 'BLDG-001', unitNumber: 'B6', category: BuildingCategory.MidRange, monthlyRent: 42000, status: UnitStatus.Vacant, tenant: null, rentStatus: null, leaseStartDate: null, leaseEndDate: null, requests: 21 },
    
    // Some data for other buildings
    { buildingId: 'BLDG-002', unitNumber: 'C1', category: BuildingCategory.MidRange, monthlyRent: 55000, status: UnitStatus.Rented, tenant: { id: 'T017', name: 'Kamal Uddin', avatar: generateAvatar() }, rentStatus: RentStatus.Paid, leaseStartDate: '9/20/2024', leaseEndDate: '9/20/2025', requests: 8 },
    { buildingId: 'BLDG-002', unitNumber: 'C2', category: BuildingCategory.Luxury, monthlyRent: 89000, status: UnitStatus.Rented, tenant: { id: 'T018', name: 'Faridul Haque', avatar: generateAvatar() }, rentStatus: RentStatus.Overdue, leaseStartDate: '9/26/2024', leaseEndDate: '9/26/2025', requests: 10 },
    { buildingId: 'BLDG-004', unitNumber: 'D1', category: BuildingCategory.Luxury, monthlyRent: 145000, status: UnitStatus.Rented, tenant: { id: 'T019', name: 'Jahid Hasan', avatar: generateAvatar() }, rentStatus: RentStatus.Pending, leaseStartDate: '9/31/2024', leaseEndDate: '9/31/2025', requests: 6 },
];

export const APPLICATIONS_PAGE_DATA: Application[] = [
    { id: 'APP-0001', tenant: { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.8 }, unit: 'A1', buildingId: 'BLDG-001', matchPercentage: 85, submissionDate: '10/10/2025' },
    { id: 'APP-0002', tenant: { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5 }, unit: 'A2', buildingId: 'BLDG-001', matchPercentage: 76, submissionDate: '10/15/2025' },
    { id: 'APP-0003', tenant: { id: 'T022', name: 'Abdelaqadir Siraj', avatar: generateAvatar(), rating: 4.2 }, unit: 'A7', buildingId: 'BLDG-001', matchPercentage: 24, submissionDate: '8/26/2025' },
    { id: 'APP-0004', tenant: { id: 'radhika-islam', name: 'Radhika Islam', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', rating: 4.9 }, unit: 'B2', buildingId: 'BLDG-001', matchPercentage: 17, submissionDate: '9/31/2025' },
    { id: 'APP-0005', tenant: { id: 'T023', name: 'Taki Chowdhury', avatar: generateAvatar(), rating: 3.8 }, unit: 'B9', buildingId: 'BLDG-001', matchPercentage: 37, submissionDate: '11/14/2025' },
    { id: 'APP-0006', tenant: { id: 'T024', name: 'Ohin Chowdhury', avatar: generateAvatar(), rating: 4.4 }, unit: 'C3', buildingId: 'BLDG-001', matchPercentage: 69, submissionDate: '11/23/2025' },
    { id: 'APP-0007', tenant: { id: 'T025', name: 'Famu Chowdhury', avatar: generateAvatar(), rating: 4.1 }, unit: 'C5', buildingId: 'BLDG-001', matchPercentage: 94, submissionDate: '12/14/2025' },
    { id: 'APP-0008', tenant: { id: 'T026', name: 'Faisal Chowdhury', avatar: generateAvatar(), rating: 4.6 }, unit: 'C6', buildingId: 'BLDG-001', matchPercentage: 84, submissionDate: '12/24/2025' },
    { id: 'APP-0009', tenant: { id: 'T027', name: 'Mukul Miyah', avatar: generateAvatar(), rating: 4.0 }, unit: 'C11', buildingId: 'BLDG-001', matchPercentage: 79, submissionDate: '12/27/2025' },
    { id: 'APP-0010', tenant: { id: 'T028', name: 'Lipi Choudhary', avatar: generateAvatar(), rating: 3.5 }, unit: 'D1', buildingId: 'BLDG-001', matchPercentage: 0, submissionDate: '12/28/2025' },
    { id: 'APP-0011', tenant: { id: 'T029', name: 'Ariful Islam', avatar: generateAvatar(), rating: 4.3 }, unit: 'D3', buildingId: 'BLDG-001', matchPercentage: 19, submissionDate: '12/31/2025' },
    { id: 'APP-0012', tenant: { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.8 }, unit: 'A1', buildingId: 'BLDG-001', matchPercentage: 100, submissionDate: '10/10/2025' },
    { id: 'APP-0013', tenant: { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5 }, unit: 'A2', buildingId: 'BLDG-001', matchPercentage: 21, submissionDate: '10/15/2025' },
    { id: 'APP-0014', tenant: { id: 'T022', name: 'Abdelaqadir Siraj', avatar: generateAvatar(), rating: 4.2 }, unit: 'A7', buildingId: 'BLDG-001', matchPercentage: 99, submissionDate: '8/26/2025' },
    { id: 'APP-0015', tenant: { id: 'radhika-islam', name: 'Radhika Islam', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', rating: 4.9 }, unit: 'B2', buildingId: 'BLDG-001', matchPercentage: 11, submissionDate: '9/31/2025' },
    { id: 'APP-0016', tenant: { id: 'T023', name: 'Taki Chowdhury', avatar: generateAvatar(), rating: 3.8 }, unit: 'B9', buildingId: 'BLDG-001', matchPercentage: 17, submissionDate: '11/14/2025' },
    { id: 'APP-0017', tenant: { id: 'T024', name: 'Ohin Chowdhury', avatar: generateAvatar(), rating: 4.4 }, unit: 'C3', buildingId: 'BLDG-001', matchPercentage: 7, submissionDate: '11/23/2025' },
    { id: 'APP-0018', tenant: { id: 'T025', name: 'Famu Chowdhury', avatar: generateAvatar(), rating: 4.1 }, unit: 'C5', buildingId: 'BLDG-001', matchPercentage: 84, submissionDate: '12/14/2025' },
    { id: 'APP-0019', tenant: { id: 'T026', name: 'Faisal Chowdhury', avatar: generateAvatar(), rating: 4.6 }, unit: 'C6', buildingId: 'BLDG-001', matchPercentage: 64, submissionDate: '12/24/2025' },
    
    // Data for other buildings
    { id: 'APP-0020', tenant: { id: 'T030', name: 'John Doe', avatar: generateAvatar(), rating: 4.9 }, unit: 'C1', buildingId: 'BLDG-002', matchPercentage: 88, submissionDate: '10/12/2025' },
    { id: 'APP-0021', tenant: { id: 'T031', name: 'Jane Smith', avatar: generateAvatar(), rating: 4.1 }, unit: 'D5', buildingId: 'BLDG-004', matchPercentage: 92, submissionDate: '11/05/2025' },
];

// Mock Data for Specific Building Page (BLDG-001)
export const SPECIFIC_BUILDING_STATS: SpecificBuildingStat[] = [
  { label: 'Monthly Rent Roll', value: '111/250K', icon: DollarSign, bgColor: 'bg-green-100', color: 'text-green-600' },
  { label: 'Total Units', value: '85', icon: HomeIcon, bgColor: 'bg-orange-100', color: 'text-orange-600' },
  { label: 'Occupied Units', value: '65', icon: Check, bgColor: 'bg-yellow-100', color: 'text-yellow-600' },
  { label: 'Vacant Units', value: '20', icon: X, bgColor: 'bg-red-100', color: 'text-red-600' },
  { label: 'Service Requests', value: '105', icon: Settings, bgColor: 'bg-blue-100', color: 'text-blue-600' },
];

export const LEASES_ENDING_SOON_DATA: LeaseEndingSoon[] = [
    { tenant: { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.8 }, unit: 'A1', leaseStartDate: '10/10/2024', leaseEndDate: '10/10/2025' },
    { tenant: { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5 }, unit: 'A2', leaseStartDate: '10/15/2024', leaseEndDate: '10/15/2025' },
    { tenant: { id: 'T022', name: 'Abdelaqadir Siraj', avatar: generateAvatar(), rating: 4.2 }, unit: 'A7', leaseStartDate: '9/26/2024', leaseEndDate: '9/26/2025' },
    { tenant: { id: 'radhika-islam', name: 'Radhika Islam', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', rating: 4.9 }, unit: 'B2', leaseStartDate: '9/31/2024', leaseEndDate: '9/31/2025' },
    { tenant: { id: 'T023', name: 'Taki Chowdhury', avatar: generateAvatar(), rating: 3.8 }, unit: 'B9', leaseStartDate: '11/14/2024', leaseEndDate: '11/14/2025' },
    { tenant: { id: 'T024', name: 'Ohin Chowdhury', avatar: generateAvatar(), rating: 4.4 }, unit: 'C3', leaseStartDate: '11/23/2024', leaseEndDate: '11/23/2025' },
    { tenant: { id: 'T025', name: 'Famu Chowdhury', avatar: generateAvatar(), rating: 4.1 }, unit: 'C5', leaseStartDate: '12/14/2024', leaseEndDate: '12/14/2025' },
    { tenant: { id: 'T026', name: 'Faisal Chowdhury', avatar: generateAvatar(), rating: 4.6 }, unit: 'C6', leaseStartDate: '12/24/2024', leaseEndDate: '12/24/2025' },
];

export const OVERDUE_RENT_DATA: OverdueRent[] = [
    { tenant: { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.8 }, unit: 'A1', amountDue: 95000, daysOverdue: 8 },
    { tenant: { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5 }, unit: 'A2', amountDue: 120000, daysOverdue: 10 },
    { tenant: { id: 'T022', name: 'Abdelaqadir Siraj', avatar: generateAvatar(), rating: 4.2 }, unit: 'A7', amountDue: 11000, daysOverdue: 6 },
    { tenant: { id: 'radhika-islam', name: 'Radhika Islam', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', rating: 4.9 }, unit: 'B2', amountDue: 30000, daysOverdue: 21 },
];

export const SPECIFIC_BUILDING_DOCUMENTS_DATA: { [buildingId: string]: CategorizedDocument[] } = {
    'BLDG-001': [
        {
            category: 'Leases',
            icon: HomeIcon,
            items: [
                { name: 'Gulshan Towers Unit 4A Lease', date: 'September 19, 2025' },
                { name: 'Basundhara Suites - Unit 15B Lease', date: 'September 15, 2025' },
                { name: 'Dhaka Deluxe - Unit 47F Lease', date: 'September 8, 2025' },
                { name: 'Gulshan Towers 24D Lease', date: 'September 2, 2025' },
                { name: 'Basundhara Suites - Unit 56F Lease', date: 'August 19, 2025' },
                { name: 'Dhaka Deluxe - Unit 21E Lease', date: 'August 15, 2025' },
            ]
        },
        {
            category: 'Utilities / Bills',
            icon: Zap,
            items: [
                { name: 'Baraka Power Ltd. Electric Invoice', date: 'September 19, 2025' },
                { name: 'Sweet Home Cleaning Svcs Invoice', date: 'September 15, 2025' },
                { name: 'Laundronauts Svcs Invoice', date: 'September 8, 2025' },
                { name: 'Dhaka Water Svcs Invoice', date: 'September 2, 2025' },
                { name: 'Baraka Power Ltd. Electric Invoice', date: 'August 19, 2025' },
                { name: 'Sweet Home Cleaning Svcs Invoice', date: 'August 15, 2025' },
            ]
        },
        {
            category: 'Income / Tax Documents',
            icon: FileText,
            items: [
                { name: 'Gulshan Towers Income Statement Sept.', date: 'September 19, 2025' },
                { name: 'Basundhara Suites Income Statement Sept.', date: 'September 15, 2025' },
                { name: 'Dhaka Deluxe Income Statement Sept.', date: 'September 8, 2025' },
                { name: 'Dhaka Towers Income Statement Sept.', date: 'September 2, 2025' },
                { name: 'Jamuna Palaces Income Statement Sept.', date: 'August 19, 2025' },
                { name: 'Commercial Properties LLC. Income Statement Sept.', date: 'August 15, 2025' },
            ]
        },
        {
            category: 'Service Contracts / Receipts',
            icon: Settings,
            items: [
                { name: 'Baraka Svc Contract Invoice', date: 'September 19, 2025' },
                { name: 'Dhaka Costruction LLC. Invoice', date: 'September 15, 2025' },
                { name: 'Shakti Trades LLC. Invoice', date: 'September 8, 2025' },
                { name: 'Chowdhury Cement September Invoice', date: 'September 2, 2025' },
                { name: 'Baraka Power Ltd. Electric Installation Invoice', date: 'August 19, 2025' },
                { name: 'Mitsubishi HVAC Services LLC.', date: 'August 15, 2025' },
            ]
        },
    ]
};

// Mock Data for Service Requests Page
export const SERVICE_REQUESTS_DATA: ServiceRequest[] = [
    { id: 'SR-001', building: 'BLDG-001', unit: 15, assignedContact: { name: 'Arif Hossain', avatar: generateAvatar() }, requests: 8, requestDate: '9/11/2025', status: RequestStatus.Complete },
    { id: 'SR-002', building: 'BLDG-002', unit: 26, assignedContact: { name: 'Shafiqul Islam', avatar: generateAvatar() }, requests: 10, requestDate: '9/15/2025', status: RequestStatus.Complete },
    { id: 'SR-003', building: 'BLDG-003', unit: 18, assignedContact: { name: 'Rafiqul Karim', avatar: generateAvatar() }, requests: 6, requestDate: '9/26/2025', status: RequestStatus.Pending },
    { id: 'SR-004', building: 'BLDG-004', unit: 45, assignedContact: { name: 'Tanvir Ahmed', avatar: generateAvatar() }, requests: 21, requestDate: '9/31/2025', status: RequestStatus.InProgress },
    { id: 'SR-005', building: 'BLDG-002', unit: 15, assignedContact: { name: 'Kamal Uddin', avatar: generateAvatar() }, requests: 8, requestDate: '9/14/2025', status: RequestStatus.InProgress },
    { id: 'SR-006', building: 'BLDG-002', unit: 26, assignedContact: { name: 'Faridul Haque', avatar: generateAvatar() }, requests: 10, requestDate: '9/23/2025', status: RequestStatus.Complete },
    { id: 'SR-007', building: 'BLDG-001', unit: 18, assignedContact: { name: 'Jahid Hasan', avatar: generateAvatar() }, requests: 6, requestDate: '9/14/2025', status: RequestStatus.Complete },
    { id: 'SR-008', building: 'BLDG-003', unit: 45, assignedContact: { name: 'Monir Rahman', avatar: generateAvatar() }, requests: 21, requestDate: '9/24/2025', status: RequestStatus.Complete },
    { id: 'SR-009', building: 'BLDG-003', unit: 15, assignedContact: { name: 'Nusrat Jahan', avatar: generateAvatar() }, requests: 8, requestDate: '9/27/2025', status: RequestStatus.InProgress },
    { id: 'SR-010', building: 'BLDG-001', unit: 26, assignedContact: { name: 'Sharmin Akter', avatar: generateAvatar() }, requests: 10, requestDate: '9/29/2025', status: RequestStatus.Pending },
    { id: 'SR-011', building: 'BLDG-004', unit: 18, assignedContact: { name: 'Runi Begum', avatar: generateAvatar() }, requests: 6, requestDate: '9/31/2025', status: RequestStatus.InProgress },
    { id: 'SR-012', building: 'BLDG-002', unit: 45, assignedContact: { name: 'Fatema Khatun', avatar: generateAvatar() }, requests: 21, requestDate: '9/14/2025', status: RequestStatus.Complete },
    { id: 'SR-013', building: 'BLDG-003', unit: 15, assignedContact: { name: 'Samira Khan', avatar: generateAvatar() }, requests: 8, requestDate: '9/24/2025', status: RequestStatus.InProgress },
    { id: 'SR-014', building: 'BLDG-004', unit: 26, assignedContact: { name: 'Maliha Sultana', avatar: generateAvatar() }, requests: 10, requestDate: '9/27/2025', status: RequestStatus.Complete },
    { id: 'SR-015', building: 'BLDG-001', unit: 18, assignedContact: { name: 'Nasrin Hossain', avatar: generateAvatar() }, requests: 6, requestDate: '9/29/2025', status: RequestStatus.InProgress },
];


// Mock Data for Specific Service Request Page
export const SPECIFIC_SERVICE_REQUEST_DETAIL_DATA: { [id: string]: SpecificServiceRequestDetail } = {
    'SR-001': {
        id: 'SR-00001',
        title: 'B1 Floor Leak',
        status: RequestStatus.InProgress,
        requester: {
            name: 'Naki Chowdhury',
            avatar: 'https://i.pravatar.cc/40?u=naki',
            rating: 4.5
        },
        requestDate: '09/12/2025',
        buildingName: 'Bosundhara Suites A1',
        category: 'General Repair',
        priority: 'LOW',
        description: 'The ceiling is leaking in my apartment, and water is dripping in. I tried containing the water, however the flow is too great. I spoke with the neighbor and it seems their tub is leaking down. This is damaging some of the kitchen cabinetry. Please update on this ASAP!',
        statusUpdates: [
            { status: 'Request Created', date: '9/12/25' },
            { status: 'Changed to "In Progress"', date: '9/16/25' }
        ],
        comments: [
            { sender: { name: 'Naki Chowdhury', avatar: 'https://i.pravatar.cc/40?u=naki' }, message: 'Hello, any update on this? The leak seems to be getting worse.', isSelf: false },
            { sender: { name: 'Evans', avatar: 'https://picsum.photos/id/237/40/40' }, message: 'Hi Naki, we have a plumber scheduled to visit tomorrow morning between 9-11am. Will that work for you?', isSelf: true },
            { sender: { name: 'Naki Chowdhury', avatar: 'https://i.pravatar.cc/40?u=naki' }, message: 'Yes, that works. Thank you for the quick response!', isSelf: false },
            { sender: { name: 'Evans', avatar: 'https://picsum.photos/id/237/40/40' }, message: 'Great, I will confirm with the plumber and let you know if anything changes.', isSelf: true },
        ],
        media: [
            { type: 'video', url: 'https://picsum.photos/seed/leak1/800/600' },
            { type: 'image', url: 'https://picsum.photos/seed/leak2/800/600' },
            { type: 'image', url: 'https://picsum.photos/seed/leak3/800/600' },
            { type: 'image', url: 'https://picsum.photos/seed/leak4/800/600' },
            { type: 'image', url: 'https://picsum.photos/seed/leak5/800/600' },
            { type: 'image', url: 'https://picsum.photos/seed/leak6/800/600' },
        ],
        activityLog: [
            { type: ActivityLogType.Scheduled, title: 'Contractor Scheduled', timestamp: 'Sep. 14, 2025 at 3:00 PM' },
            { type: ActivityLogType.Arrived, title: 'Contractor Arrived', timestamp: 'Sep. 15, 2025 at 9:00 AM', description: 'Follow-up visit arranged for Sep. 16, 2025 at 9:00 AM' },
            { type: ActivityLogType.Arrived, title: 'Contractor Arrived', timestamp: 'Sep. 16, 2025 at 9:10 AM', description: 'Performing the finishing touches!' },
            { type: ActivityLogType.Completed, title: 'Work Completed!', timestamp: 'Sep. 16, 2025 at 2:00 PM', description: 'Work Completed as Planned' }
        ],
        requestInfo: {
            timeOpen: 7,
            updates: 4,
            notes: 10,
        },
        notes: [
            { text: 'Tenant will provide keys to contractor each morning upon arrival!' }
        ],
        contactCards: [
            {
                title: "Tenant's Primary Contact",
                contacts: [{ name: 'Naki Chowdhury', avatar: 'https://i.pravatar.cc/40?u=naki', rating: 4.5, phone: '+880 1769-567515', email: 'nakichowdhury@sughar.com' }]
            },
            {
                title: "Tenant's Secondary Contact",
                contacts: [{ name: 'Taki Chowdhury', avatar: 'https://i.pravatar.cc/40?u=taki', rating: 4.5, phone: '+880 1799-567515', email: 'takichowdhury@sughar.com' }]
            },
            {
                title: 'Building / Unit Manager',
                contacts: [
                    { name: 'Sonder Shohm', avatar: 'https://i.pravatar.cc/40?u=sonder', rating: 4.5, phone: '+880 2769-567515', email: 'shohm@sughar.com' },
                    { name: 'Masum Shohm', avatar: 'https://i.pravatar.cc/40?u=masum', rating: 4.5, phone: '+880 2799-567515', email: 'Masum@gmail.com', role: 'Emergency Contact:' }
                ]
            },
            {
                title: 'Assistant Building Manager',
                contacts: [
                    { name: 'Badrul Miah', avatar: 'https://i.pravatar.cc/40?u=badrul', rating: 4.5, phone: '+880 2769-567515', email: 'Badrul@sughar.com' },
                    { name: 'Mukhtar Miah', avatar: 'https://i.pravatar.cc/40?u=mukhtar-miah', rating: 4.5, phone: '+880 2799-567515', email: 'Mukhtar@gmail.com', role: 'Emergency Contact:' }
                ]
            },
            {
                title: 'Contracting Company',
                contacts: [{ name: 'Quick Fix Plumbing', avatar: 'https://i.pravatar.cc/40?u=plumbing', rating: 2.8, phone: '+880 2799-567515', email: 'Mukhtar@gmail.com', id: 'Plumbing Company | CR-00001' }],
                workScope: 'Leak Containment & Drywalling',
                date: 'September 31, 2025',
                projectEtc: 'Project ETC'
            },
            {
                title: 'Primary Contractor',
                contacts: [{ name: 'Salman Khan', avatar: 'https://i.pravatar.cc/40?u=salman', rating: 3.3, phone: '+880 2799-567515', email: 'Mukhtar@gmail.com', id: 'Employee ID: 1154' }]
            }
        ],
        suggestedVendors: [
            { name: 'Star Contracting', logo: 'star', imageUrl: 'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 2.9 },
            { name: 'Gulshan General', logo: 'G', imageUrl: 'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 2.9 },
            { name: 'Shakti Construction', logo: 'S', imageUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 2.9 },
            { name: 'Ghor General Svcs', logo: 'G', imageUrl: 'https://images.pexels.com/photos/8005398/pexels-photo-8005398.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 2.9 },
        ]
    }
};

// Mock Data for Tenants Dashboard
export const TENANT_DASHBOARD_STATS: TenantDashboardStat[] = [
    { label: 'Total Tenants', value: '850', icon: Users, iconColor: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Vacant Units', value: '200', icon: X, iconColor: 'text-red-600', bgColor: 'bg-red-100' },
    { label: 'Rental Applications', value: '312', icon: FileText, iconColor: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { label: 'Total Units', value: '1,050', icon: HomeIcon, iconColor: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'Service Requests', value: '120', icon: Settings, iconColor: 'text-blue-600', bgColor: 'bg-blue-100' },
];

export const TENANTS_DASHBOARD_TABLE_DATA: Tenant[] = [
    { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0015', leaseProgress: 80, rentStatus: RentStatus.Paid, requests: 8 },
    { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0019', leaseProgress: 75, rentStatus: RentStatus.Paid, requests: 10 },
    { id: 'T022', name: 'Abdelqadir Siraj', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0018', leaseProgress: 60, rentStatus: RentStatus.Overdue, requests: 6 },
    { id: 'radhika-islam', name: 'Radlya Islam', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0045', leaseProgress: 90, rentStatus: RentStatus.Pending, requests: 21 },
    { id: 'T023', name: 'Taki Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0015', leaseProgress: 50, rentStatus: RentStatus.Pending, requests: 8 },
    { id: 'T024', name: 'Ohin Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0026', leaseProgress: 85, rentStatus: RentStatus.Paid, requests: 10 },
    { id: 'T025', name: 'Famu Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0018', leaseProgress: 70, rentStatus: RentStatus.Paid, requests: 6 },
    { id: 'T026', name: 'Faisal Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0045', leaseProgress: 40, rentStatus: RentStatus.Paid, requests: 21 },
    { id: 'T027', name: 'Mukul Miyah', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0015', leaseProgress: 95, rentStatus: RentStatus.Pending, requests: 8 },
    { id: 'T028', name: 'Lipi Choudhary', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0026', leaseProgress: 30, rentStatus: RentStatus.Overdue, requests: 10 },
    { id: 'T029', name: 'Ariful Islam', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0018', leaseProgress: 80, rentStatus: RentStatus.Pending, requests: 6 },
    { id: 'T030', name: 'Shohanur Rahman', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0045', leaseProgress: 75, rentStatus: RentStatus.Paid, requests: 21 },
    { id: 'T031', name: 'Maisha Gulam', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0015', leaseProgress: 65, rentStatus: RentStatus.Pending, requests: 8 },
    { id: 'T032', name: 'Saqib Khan', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0026', leaseProgress: 55, rentStatus: RentStatus.Paid, requests: 10 },
    { id: 'T033', name: 'Shamu Abdullah', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0018', leaseProgress: 78, rentStatus: RentStatus.Pending, requests: 6 },
    { id: 'T034', name: 'Tahmidur Hoque', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0045', leaseProgress: 88, rentStatus: RentStatus.Pending, requests: 21 },
];

export const CURRENT_TENANTS_DATA: CurrentTenant[] = [
    { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-001', unit: 15, leaseProgress: { value: 75, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 8 },
    { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-002', unit: 26, leaseProgress: { value: 60, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 10 },
    { id: 'T022', name: 'Abdelqadir Siraj', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-003', unit: 18, leaseProgress: { value: 85, variant: 'dark' }, rentStatus: RentStatus.Overdue, requests: 6 },
    { id: 'radhika-islam', name: 'Radhika Islam', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', rating: 4.5, building: 'BLDG-004', unit: 45, leaseProgress: { value: 40, variant: 'light' }, rentStatus: RentStatus.Pending, requests: 21 },
    { id: 'T023', name: 'Taki Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-002', unit: 15, leaseProgress: { value: 90, variant: 'dark' }, rentStatus: RentStatus.Pending, requests: 8 },
    { id: 'T024', name: 'Ohin Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-002', unit: 26, leaseProgress: { value: 30, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 10 },
    { id: 'T025', name: 'Famu Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-001', unit: 18, leaseProgress: { value: 70, variant: 'dark' }, rentStatus: RentStatus.Paid, requests: 6 },
    { id: 'T026', name: 'Faisal Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-003', unit: 45, leaseProgress: { value: 55, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 21 },
    { id: 'T027', name: 'Mukul Miyah', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-003', unit: 15, leaseProgress: { value: 80, variant: 'dark' }, rentStatus: RentStatus.Pending, requests: 8 },
    { id: 'T028', name: 'Lipi Choudhary', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-001', unit: 26, leaseProgress: { value: 65, variant: 'light' }, rentStatus: RentStatus.Overdue, requests: 10 },
    { id: 'T029', name: 'Ariful Islam', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-004', unit: 18, leaseProgress: { value: 95, variant: 'dark' }, rentStatus: RentStatus.Pending, requests: 6 },
    { id: 'T030', name: 'Shohanur Rahman', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-002', unit: 45, leaseProgress: { value: 25, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 21 },
    { id: 'T031', name: 'Maisha Gulam', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-003', unit: 15, leaseProgress: { value: 75, variant: 'dark' }, rentStatus: RentStatus.Pending, requests: 8 },
    { id: 'T032', name: 'Saqib Khan', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-004', unit: 26, leaseProgress: { value: 50, variant: 'light' }, rentStatus: RentStatus.Paid, requests: 10 },
    { id: 'T033', name: 'Shamu Abdullah', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-001', unit: 18, leaseProgress: { value: 88, variant: 'dark' }, rentStatus: RentStatus.Pending, requests: 6 },
    { id: 'T034', name: 'Tahmidur Hoque', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-001', unit: 45, leaseProgress: { value: 45, variant: 'light' }, rentStatus: RentStatus.Pending, requests: 21 },
];

export const RENT_STATUS_CHART_DATA: RentStatusData[] = [
    { name: 'On Time', value: 85 },
    { name: 'Late', value: 15 },
];

export const QUICK_VIEW_ACTIONS: QuickViewAction[] = [
    { label: 'New Tenant Applications', value: '15' },
    { label: 'Rent Overdue For 5 Tenants', value: '', isFullText: true },
    { label: 'Leases Ending Soon', value: '12' },
    { label: 'Tenants are High-Risk', value: '14' },
    { label: 'New Service Requests', value: '16' },
    { label: 'Outstanding Tenants!', value: '14' },
];

export const TOP_RATED_TENANTS_APPLICATIONS: TenantApplication[] = [
    { id: 'APP-0001', tenant: { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.8 }, building: 'BLDG-001', unit: '15', matchPercentage: 85, submissionDate: '10/10/2025' },
    { id: 'APP-0002', tenant: { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5 }, building: 'BLDG-002', unit: '26', matchPercentage: 76, submissionDate: '10/15/2025' },
    { id: 'APP-0003', tenant: { id: 'T022', name: 'Abdelqadir Siraj', avatar: generateAvatar(), rating: 4.2 }, building: 'BLDG-003', unit: '18', matchPercentage: 24, submissionDate: '9/26/2025' },
    { id: 'APP-0004', tenant: { id: 'radhika-islam', name: 'Radhika Islam', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', rating: 4.9 }, building: 'BLDG-004', unit: '45', matchPercentage: 17, submissionDate: '9/31/2025' },
    { id: 'APP-0005', tenant: { id: 'T023', name: 'Taki Chowdhury', avatar: generateAvatar(), rating: 3.8 }, building: 'BLDG-002', unit: '15', matchPercentage: 37, submissionDate: '11/14/2025' },
    { id: 'APP-0006', tenant: { id: 'T024', name: 'Ohin Chowdhury', avatar: generateAvatar(), rating: 4.4 }, building: 'BLDG-002', unit: '26', matchPercentage: 69, submissionDate: '11/23/2025' },
    { id: 'APP-0007', tenant: { id: 'T025', name: 'Famu Chowdhury', avatar: generateAvatar(), rating: 4.1 }, building: 'BLDG-001', unit: '18', matchPercentage: 94, submissionDate: '12/14/2025' },
    { id: 'APP-0008', tenant: { id: 'T026', name: 'Faisal Chowdhury', avatar: generateAvatar(), rating: 4.6 }, building: 'BLDG-003', unit: '45', matchPercentage: 84, submissionDate: '12/24/2025' },
    { id: 'APP-0009', tenant: { id: 'T027', name: 'Mukul Miyah', avatar: generateAvatar(), rating: 4.0 }, building: 'BLDG-003', unit: '15', matchPercentage: 79, submissionDate: '12/27/2025' },
    { id: 'APP-0010', tenant: { id: 'T028', name: 'Lipi Choudhary', avatar: generateAvatar(), rating: 3.5 }, building: 'BLDG-001', unit: '26', matchPercentage: 0, submissionDate: '12/28/2025' },
    { id: 'APP-0011', tenant: { id: 'T029', name: 'Ariful Islam', avatar: generateAvatar(), rating: 4.3 }, building: 'BLDG-004', unit: '18', matchPercentage: 19, submissionDate: '12/31/2025' },
    { id: 'APP-0012', tenant: { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.8 }, building: 'BLDG-002', unit: '45', matchPercentage: 100, submissionDate: '10/10/2025' },
    { id: 'APP-0013', tenant: { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5 }, building: 'BLDG-003', unit: '15', matchPercentage: 21, submissionDate: '10/15/2025' },
    { id: 'APP-0014', tenant: { id: 'T022', name: 'Abdelqadir Siraj', avatar: generateAvatar(), rating: 4.2 }, building: 'BLDG-004', unit: '26', matchPercentage: 99, submissionDate: '9/26/2025' },
    { id: 'APP-0015', tenant: { id: 'radhika-islam', name: 'Radhika Islam', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', rating: 4.9 }, building: 'BLDG-001', unit: '18', matchPercentage: 11, submissionDate: '9/31/2025' },
];

export const NEW_SUGHAR_VERIFIED_TENANTS_APPLICATIONS: VerifiedTenantApplication[] = [
    { id: 'APP-V001', tenant: { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.8 }, unit: 'A1', matchPercentage: 85, submissionDate: '10/10/2025' },
    { id: 'APP-V002', tenant: { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5 }, unit: 'A2', matchPercentage: 76, submissionDate: '10/15/2025' },
    { id: 'APP-V003', tenant: { id: 'T022', name: 'Abdelqadir Siraj', avatar: generateAvatar(), rating: 4.2 }, unit: 'A7', matchPercentage: 24, submissionDate: '9/26/2025' },
    { id: 'APP-V004', tenant: { id: 'radhika-islam', name: 'Radhika Islam', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', rating: 4.9 }, unit: 'B2', matchPercentage: 17, submissionDate: '9/31/2025' },
    { id: 'APP-V005', tenant: { id: 'T023', name: 'Taki Chowdhury', avatar: generateAvatar(), rating: 3.8 }, unit: 'B9', matchPercentage: 37, submissionDate: '11/14/2025' },
    { id: 'APP-V006', tenant: { id: 'T024', name: 'Ohin Chowdhury', avatar: generateAvatar(), rating: 4.4 }, unit: 'C3', matchPercentage: 69, submissionDate: '11/23/2025' },
    { id: 'APP-V007', tenant: { id: 'T025', name: 'Famu Chowdhury', avatar: generateAvatar(), rating: 4.1 }, unit: 'C5', matchPercentage: 94, submissionDate: '12/14/2025' },
    { id: 'APP-V008', tenant: { id: 'T026', name: 'Faisal Chowdhury', avatar: generateAvatar(), rating: 4.6 }, unit: 'C6', matchPercentage: 84, submissionDate: '12/24/2025' },
    { id: 'APP-V009', tenant: { id: 'T027', name: 'Mukul Miyah', avatar: generateAvatar(), rating: 4.0 }, unit: 'C11', matchPercentage: 79, submissionDate: '12/27/2025' },
    { id: 'APP-V010', tenant: { id: 'T028', name: 'Lipi Choudhary', avatar: generateAvatar(), rating: 3.5 }, unit: 'D1', matchPercentage: 0, submissionDate: '12/28/2025' },
    { id: 'APP-V011', tenant: { id: 'T029', name: 'Ariful Islam', avatar: generateAvatar(), rating: 4.3 }, unit: 'D3', matchPercentage: 19, submissionDate: '12/31/2025' },
    { id: 'APP-V012', tenant: { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.8 }, unit: 'A1', matchPercentage: 100, submissionDate: '10/10/2025' },
    { id: 'APP-V013', tenant: { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5 }, unit: 'A2', matchPercentage: 21, submissionDate: '10/15/2025' },
    { id: 'APP-V014', tenant: { id: 'T022', name: 'Abdelqadir Siraj', avatar: generateAvatar(), rating: 4.2 }, unit: 'A7', matchPercentage: 99, submissionDate: '9/26/2025' },
    { id: 'APP-V015', tenant: { id: 'radhika-islam', name: 'Radhika Islam', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', rating: 4.9 }, unit: 'B2', matchPercentage: 11, submissionDate: '9/31/2025' },
];


// Mock Data for Documents Dashboard
export const DOCUMENT_DASHBOARD_STATS: DocumentDashboardStat[] = [
    { label: 'Recent Documents', value: '450', icon: FileText, iconColor: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'Active Lease Docs', value: '85', icon: HomeIcon, iconColor: 'text-red-600', bgColor: 'bg-red-100' },
    { label: 'Income / Tax Docs', value: '65', icon: DollarSign, iconColor: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Recent Utilities / Bills', value: '120', icon: Zap, iconColor: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { label: 'Service Invoices', value: '105', icon: Settings, iconColor: 'text-blue-600', bgColor: 'bg-blue-100' },
];

export const MOST_RECENT_DOCUMENTS: Document[] = [
    { id: 'DOC001', name: 'Unit 12A Lease Agreement', building: 'BLDG-0001', unit: 'A1', type: DocumentType.Lease, uploadDate: '10/10/2025' },
    { id: 'DOC002', name: 'Bosundhara Electric Invoice', building: 'BLDG-0001', unit: 'A2', type: DocumentType.Utilities, uploadDate: '10/15/2025' },
    { id: 'DOC003', name: 'Gulshan Towers Water Bill', building: 'BLDG-0004', unit: 'A7', type: DocumentType.Utilities, uploadDate: '9/26/2025' },
    { id: 'DOC004', name: 'Shakti Pest Svcs Contract', building: 'BLDG-0023', unit: 'B2', type: DocumentType.Service, uploadDate: '9/31/2025' },
    { id: 'DOC005', name: 'Jamuna Palaces Income Statement', building: 'BLDG-0014', unit: 'B9', type: DocumentType.Income, uploadDate: '11/14/2025' },
    { id: 'DOC006', name: 'Baridhara Court Compliance Certificate', building: 'BLDG-0009', unit: 'C3', type: DocumentType.Certifications, uploadDate: '11/23/2025' },
    { id: 'DOC007', name: 'Green View Apartments Insurance Policy', building: 'BLDG-0003', unit: 'C5', type: DocumentType.Insurance, uploadDate: '12/14/2025' },
    { id: 'DOC008', name: 'Mirpur Elevator Maintenance Contract', building: 'BLDG-0005', unit: 'C6', type: DocumentType.Service, uploadDate: '12/24/2025' },
    { id: 'DOC009', name: 'Lakeview Residences Tax Receipt', building: 'BLDG-0009', unit: 'C11', type: DocumentType.Income, uploadDate: '12/27/2025' },
    { id: 'DOC010', name: 'City Lights Plumbing Service Invoice', building: 'BLDG-0012', unit: 'D1', type: DocumentType.Service, uploadDate: '12/28/2025' },
    { id: 'DOC011', name: 'Uttara Regency Renovation Permit', building: 'BLDG-0009', unit: 'D3', type: DocumentType.Certifications, uploadDate: '12/31/2025' },
];

export const STARRED_DOCUMENTS: Document[] = [
    { id: 'DOC001', name: 'Unit 12A Lease Agreement', building: 'BLDG-0001', unit: 'A1', type: DocumentType.Lease, uploadDate: '10/10/2025' },
    { id: 'DOC002', name: 'Bosundhara Electric Invoice', building: 'BLDG-0001', unit: 'A2', type: DocumentType.Utilities, uploadDate: '10/15/2025' },
    { id: 'DOC003', name: 'Gulshan Towers Water Bill', building: 'BLDG-0004', unit: 'A7', type: DocumentType.Utilities, uploadDate: '9/26/2025' },
    { id: 'DOC004', name: 'Shakti Pest Svcs Contract', building: 'BLDG-0023', unit: 'B2', type: DocumentType.Service, uploadDate: '9/31/2025' },
];

export const DOCUMENT_TYPE_DISTRIBUTION_DATA: DocumentDistribution[] = [
    { name: 'Leases', value: 35, percentage: '35%' },
    { name: 'Service Contracts / Invoices', value: 30, percentage: '30%' },
    { name: 'Utilities / Bills', value: 25, percentage: '25%' },
    { name: 'Income / Tax Docs', value: 10, percentage: '10%' },
];

export const DOCUMENTS_UPLOADED_DATA: UploadedDocumentData[] = [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 140 },
    { month: 'Mar', count: 130 },
    { month: 'Apr', count: 160 },
    { month: 'May', count: 150 },
    { month: 'Jun', count: 210 },
    { month: 'Jul', count: 200 },
    { month: 'Aug', count: 240 },
    { month: 'Sep', count: 220 },
    { month: 'Oct', count: 250 },
    { month: 'Nov', count: 230 },
    { month: 'Dec', count: 260 },
];

export const ALL_DOCUMENTS_DATA: Document[] = [
    ...MOST_RECENT_DOCUMENTS,
    { id: 'DOC012', name: 'Mirpur Luxury Apts Water Bill', building: 'BLDG-0005', unit: 'C6', type: DocumentType.Utilities, uploadDate: '12/24/2025' },
    { id: 'DOC013', name: 'Basundhara Suites Unit 15B Lease', building: 'BLDG-0001', unit: '15B', type: DocumentType.Lease, uploadDate: '12/23/2025' },
    { id: 'DOC014', name: 'Dhaka Deluxe Unit 47F Lease', building: 'BLDG-0003', unit: '47F', type: DocumentType.Lease, uploadDate: '12/22/2025' },
    { id: 'DOC015', name: 'Baraka Power Ltd. Electric Invoice', building: 'BLDG-0004', unit: 'A7', type: DocumentType.Utilities, uploadDate: '12/21/2025' },
    { id: 'DOC016', name: 'Sweet Home Cleaning Svcs Invoice', building: 'BLDG-0009', unit: 'C3', type: DocumentType.Service, uploadDate: '12/20/2025' },
    { id: 'DOC017', name: 'Laundronauts Svcs Invoice', building: 'BLDG-0014', unit: 'B9', type: DocumentType.Service, uploadDate: '12/19/2025' },
    { id: 'DOC018', name: 'Dhaka Water Svcs Invoice', building: 'BLDG-0001', unit: 'A1', type: DocumentType.Utilities, uploadDate: '12/18/2025' },
    { id: 'DOC019', name: 'Gulshan Towers Income Statement', building: 'BLDG-0004', unit: 'N/A', type: DocumentType.Income, uploadDate: '12/17/2025' },
    { id: 'DOC020', name: 'Dhaka Construction LLC. Invoice', building: 'BLDG-0012', unit: 'D1', type: DocumentType.Service, uploadDate: '12/16/2025' },
    { id: 'DOC021', name: 'Shakti Trades LLC. Invoice', building: 'BLDG-0023', unit: 'B2', type: DocumentType.Service, uploadDate: '12/15/2025' },
    { id: 'DOC022', name: 'Chowdhury Cement September Invoice', building: 'BLDG-0005', unit: 'N/A', type: DocumentType.Service, uploadDate: '12/14/2025' },
    { id: 'DOC023', 'name': 'Unit 1A Insurance Policy', 'building': 'BLDG-0001', 'unit': 'A1', 'type': DocumentType.Insurance, 'uploadDate': '12/13/2025' },
    { id: 'DOC024', 'name': 'Fire Safety Certificate', 'building': 'BLDG-0002', 'unit': 'N/A', 'type': DocumentType.Certifications, 'uploadDate': '12/12/2025' },
    { id: 'DOC025', 'name': 'Elevator Inspection Report', 'building': 'BLDG-0003', 'unit': 'N/A', 'type': DocumentType.Certifications, 'uploadDate': '12/11/2025' },
    { id: 'DOC026', 'name': 'Annual Tax Return 2024', 'building': 'N/A', 'unit': 'N/A', 'type': DocumentType.Income, 'uploadDate': '12/10/2025' },
    { id: 'DOC027', 'name': 'Plumbing Repair Receipt Unit B2', 'building': 'BLDG-0023', 'unit': 'B2', 'type': DocumentType.Service, 'uploadDate': '12/09/2025' },
    { id: 'DOC028', 'name': 'Unit C5 Internet Bill', 'building': 'BLDG-0003', 'unit': 'C5', 'type': DocumentType.Utilities, 'uploadDate': '12/08/2025' },
];

// Mock Data for Home Dashboard
export const HOME_STATS: HomeStat[] = [
    { label: 'Open Service Requests', value: '50', icon: Wrench, color: 'orange' },
    { label: 'Vacant Units', value: '25', icon: HomeIcon, color: 'red' },
    { label: 'Overdue Rent', value: '12', icon: FileWarning, color: 'yellow' },
    { label: 'New Applications', value: '30', icon: Users, color: 'green' },
];

export const FINANCIAL_OVERVIEW_DATA: MonthlyProfitData[] = [
    { month: 'Jan', profit: 18000 },
    { month: 'Feb', profit: 22000 },
    { month: 'Mar', profit: 28000 },
    { month: 'Apr', profit: 20000 },
    { month: 'May', profit: 16000 },
    { month: 'Jun', profit: 21000 },
    { month: 'Jul', profit: 20000 },
    { month: 'Aug', profit: 35000 },
    { month: 'Sep', profit: 27000 },
    { month: 'Oct', profit: 24000 },
    { month: 'Nov', profit: 18000 },
    { month: 'Dec', profit: 23000 },
];

export const SERVICE_REQUEST_VOLUME_DATA: ServiceRequestVolume[] = [
    { month: 'Mar', new: 20, completed: 15 },
    { month: 'Apr', new: 25, completed: 20 },
    { month: 'May', new: 30, completed: 28 },
    { month: 'Jun', new: 28, completed: 22 },
    { month: 'Jul', new: 35, completed: 30 },
    { month: 'Aug', new: 40, completed: 38 },
];

export const ACTION_CENTER_ITEMS: ActionCenterItem[] = [
    { label: '5 Leases Expiring Soon', icon: Calendar, isAlert: true },
    { label: '3 High-Priority Service Requests', icon: Bell, isAlert: true },
    { label: 'Review New Applications', icon: Users },
    { label: 'Go to Financial Portal', icon: TrendingUp },
    { label: 'Manage Documents', icon: FileText },
];

export const HIGH_PRIORITY_TENANTS_DATA: HighPriorityTenant[] = [
    { id: 'radhika-islam', name: 'Radiya Islam', avatar: generateAvatar(), unit: 'BLDG-004 / 45', daysOverdue: 21 },
    { id: 'T006', name: 'Faridul Haque', avatar: generateAvatar(), unit: 'BLDG-001 / A6', daysOverdue: 10 },
    { id: 'T028', name: 'Lipi Choudhary', avatar: generateAvatar(), unit: 'BLDG-002 / 26', daysOverdue: 10 },
    { id: 'T022', name: 'Abdelqadir Siraj', avatar: generateAvatar(), unit: 'BLDG-003 / 18', daysOverdue: 6 },
];

// Mock Data for Account Overview Page
export const ACCOUNT_DETAILS_DATA: AccountDetails = {
    name: 'Evans',
    email: 'evans@sughar.com',
    role: 'Project Manager',
    avatarUrl: 'https://picsum.photos/id/237/200/200',
    memberSince: 'January 15, 2022',
};

export const BILLING_PLAN_DATA: BillingPlan = {
    name: 'Business Plan',
    price: 249,
    billingCycle: 'monthly',
    nextPayment: 'October 15, 2025',
};

export const PAYMENT_METHOD_DATA: PaymentMethod = {
    cardType: 'Visa',
    lastFour: '4242',
};

export const INVOICE_HISTORY_DATA: Invoice[] = [
    { id: 'INV-2025-009', date: 'Sep 15, 2025', amount: 249.00, status: InvoiceStatus.Paid },
    { id: 'INV-2025-008', date: 'Aug 15, 2025', amount: 249.00, status: InvoiceStatus.Paid },
    { id: 'INV-2025-007', date: 'Jul 15, 2025', amount: 249.00, status: InvoiceStatus.Paid },
    { id: 'INV-2025-006', date: 'Jun 15, 2025', amount: 249.00, status: InvoiceStatus.Paid },
];

export const TEAM_MEMBERS_DATA: TeamMember[] = [
    { id: 'TM-001', name: 'Anika Chowdhury', role: 'Administrator', avatarUrl: generateAvatar() },
    { id: 'TM-002', name: 'Rahim Sheikh', role: 'Property Manager', avatarUrl: generateAvatar() },
    { id: 'TM-003', name: 'Fatima Khan', role: 'Accountant', avatarUrl: generateAvatar() },
];

export const NOTIFICATION_SETTINGS_DATA: NotificationSetting[] = [
    { id: 'notif-1', label: 'New Service Request', description: 'When a tenant submits a new request.', email: true, push: true },
    { id: 'notif-2', label: 'Application Submitted', description: 'When a prospective tenant applies.', email: true, push: false },
    { id: 'notif-3', label: 'Rent Payment Received', description: 'When a rent payment is successfully processed.', email: false, push: false },
    { id: 'notif-4', label: 'Rent Overdue', description: 'When a tenant\'s rent is overdue.', email: true, push: true },
];

// Mock Data for Settings Page
export const SETTINGS_DATA: SettingsData = {
    general: {
        language: 'English',
        currency: 'BDT (৳)',
        timezone: '(GMT+6:00) Dhaka',
    },
    appearance: {
        theme: 'Light',
    },
    security: {
        twoFactorEnabled: true,
    },
};

export const LANGUAGE_OPTIONS = ['English', 'Bangla'];
export const CURRENCY_OPTIONS = ['BDT (৳)', 'USD ($)'];
export const TIMEZONE_OPTIONS = [
    '(GMT+6:00) Dhaka',
    '(GMT-5:00) Eastern Time (US & Canada)',
    '(GMT+1:00) Central European Time',
];

// Mock Data for Tenant Detail Page
export const TENANT_DETAIL_DATA: { [id: string]: TenantDetailData } = {
    'radhika-islam': {
        id: 'radhika-islam',
        name: 'Radhika Islam',
        buildingName: 'Bosundhara Towers',
        unitName: 'B1',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
        education: {
            degree: 'Bachelors in Business Administration',
            university: 'Dhaka University',
            years: '2014-2016'
        },
        employment: {
            role: 'Software Developer',
            company: 'Dhaka Data LTD.',
            years: '2016-2025',
            income: 350000,
        },
        references: [
            { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.8 },
            { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5 },
            { id: 'T022', name: 'Abdelqadir Siraj', avatar: generateAvatar(), rating: 4.2 },
        ],
        documents: [{ name: 'Document.pdf uploaded' }],
        notes: [{ text: 'Initial review looks good!', date: '10/10/2025' }],
        trustAndVerification: {
            score: 85,
            checks: [
                { item: 'Verified ID', verified: true },
                { item: 'Verified Employment', verified: true },
                { item: 'Successful Background', verified: true },
            ],
        },
        timeline: [
            { event: 'Application Submitted', date: '10/10/2025', icon: CheckCircle2 },
            { event: 'Email with Proof of Income', date: '10/11/2025', icon: Mail },
        ],
        financialSummary: {
            monthlyRent: 1200,
            monthlyIncome: 6000,
            deposit: 1200,
        },
    }
};