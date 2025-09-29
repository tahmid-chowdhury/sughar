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
  { id: 'EXP002', name: 'Uttara Gardens Water Bill', building: 'BLDG-004', unit: 'A7', type: DocumentType.Utilities, uploadDate: '8/26/2025' },
  { id: 'EXP003', name: 'Dhanmondi Residency Pest Svcs Contract', building: 'BLDG-0003', unit: 'B2', type: DocumentType.Service, uploadDate: '9/31/2025' },
  { id: 'EXP004', name: 'Uttara Gardens Income Statement', building: 'BLDG-0004', unit: 'B9', type: DocumentType.Income, uploadDate: '9/14/2025' },
  { id: 'EXP005', name: 'City Lights Plumbing Service Invoice', building: 'BLDG-0004', unit: 'D1', type: DocumentType.Service, uploadDate: '9/28/2025' },
];

export const RECENT_INCOME_DOCS: Document[] = [
  { id: 'INC001', name: 'Unit A1 Rent Payment', building: 'BLDG-001', unit: 'A1', type: DocumentType.Income, uploadDate: '9/15/2025' },
  { id: 'INC002', name: 'Unit A2 Rent Payment', building: 'BLDG-001', unit: 'A2', type: DocumentType.Income, uploadDate: '9/15/2025' },
  { id: 'INC003', name: 'Uttara Gardens Income Statement', building: 'BLDG-004', unit: '---', type: DocumentType.Income, uploadDate: '9/14/2025' },
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
  { label: 'Total Buildings', value: '4', icon: HomeIcon, iconBgColor: 'bg-red-100', iconColor: 'text-red-600' },
  { label: 'Total Units', value: '28', icon: HomeIcon, iconBgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { label: 'Occupied Units', value: '26', icon: Check, iconBgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { label: 'Vacant Units', value: '2', icon: X, iconBgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { label: 'Service Requests', value: '9', icon: Settings, iconBgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
];

export const VACANT_UNITS_BY_BUILDING_DATA: VacantUnit[] = [
    { name: 'Lalmatia Court', vacant: 1 },
    { name: 'Banani Heights', vacant: 0 },
    { name: 'Dhanmondi Residency', vacant: 1 },
    { name: 'Uttara Gardens', vacant: 0 },
];

export const OCCUPANCY_DATA: Occupancy[] = [
    { name: 'Occupied', value: 93 },
    { name: 'Vacant', value: 7 },
];

export const BUILDINGS_TABLE_DATA: BuildingInfo[] = [
    { id: 'B1', name: 'Lalmatia Court', totalUnits: 12, vacantUnits: 1, activeRequests: 3 },
    { id: 'B2', name: 'Banani Heights', totalUnits: 8, vacantUnits: 0, activeRequests: 3 },
    { id: 'B3', name: 'Dhanmondi Residency', totalUnits: 5, vacantUnits: 1, activeRequests: 2 },
    { id: 'B4', name: 'Uttara Gardens', totalUnits: 3, vacantUnits: 0, activeRequests: 1 },
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
    'BLDG-001': 'Lalmatia Court',
    'BLDG-002': 'Banani Heights',
    'BLDG-003': 'Dhanmondi Residency',
    'BLDG-004': 'Uttara Gardens',
};


export const BUILDINGS_PAGE_DATA: BuildingDetail[] = [
    { id: 'BLDG-001', name: 'Lalmatia Court', address: 'Lalmatia, Dhaka', category: BuildingCategory.Standard, totalUnits: 12, vacantUnits: 1, requests: 3, occupationPercentage: 92, rentCollectionPercentage: 88, assignedContact: { name: 'Arif Hossain', avatar: generateAvatar() } },
    { id: 'BLDG-002', name: 'Banani Heights', address: 'Banani, Dhaka', category: BuildingCategory.MidRange, totalUnits: 8, vacantUnits: 0, requests: 3, occupationPercentage: 100, rentCollectionPercentage: 95, assignedContact: { name: 'Shariful Islam', avatar: generateAvatar() } },
    { id: 'BLDG-003', name: 'Dhanmondi Residency', address: 'Dhanmondi, Dhaka', category: BuildingCategory.Luxury, totalUnits: 5, vacantUnits: 1, requests: 2, occupationPercentage: 80, rentCollectionPercentage: 90, assignedContact: { name: 'Rafiqul Karim', avatar: generateAvatar() } },
    { id: 'BLDG-004', name: 'Uttara Gardens', address: 'Uttara, Dhaka', category: BuildingCategory.Luxury, totalUnits: 3, vacantUnits: 0, requests: 1, occupationPercentage: 100, rentCollectionPercentage: 100, assignedContact: { name: 'Tamim Ahmed', avatar: generateAvatar() } },
];

export const UNITS_PAGE_DATA: UnitDetail[] = [
    // Building 1 – Lalmatia Court (12 Units)
    { id: 'U001', buildingId: 'BLDG-001', unitNumber: '1A', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T001', name: 'Farzana Akhter', avatar: 'https://ui-avatars.com/api/?name=Farzana+Akhter&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '7/14/2025', leaseEndDate: '1/14/2026', requests: 0 },
    { id: 'U002', buildingId: 'BLDG-001', unitNumber: '2A', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Vacant, tenant: { id: 'T002', name: 'Amrul Hoque', avatar: 'https://ui-avatars.com/api/?name=Amrul+Hoque&background=random' }, rentStatus: null, leaseStartDate: '3/1/2025', leaseEndDate: '9/29/2025', requests: 0 },
    { id: 'U003', buildingId: 'BLDG-001', unitNumber: '3A', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T003', name: 'Shahriar Karim', avatar: 'https://ui-avatars.com/api/?name=Shahriar+Karim&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '9/2/2025', leaseEndDate: '3/2/2026', requests: 0 },
    { id: 'U004', buildingId: 'BLDG-001', unitNumber: '4A', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T004', name: 'Tania Akter', avatar: 'https://ui-avatars.com/api/?name=Tania+Akter&background=random' }, rentStatus: RentStatus.Pending, leaseStartDate: '9/3/2025', leaseEndDate: '3/3/2026', requests: 1 },
    { id: 'U005', buildingId: 'BLDG-001', unitNumber: '1B', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T005', name: 'Imran Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Imran+Chowdhury&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '11/11/2025', leaseEndDate: '5/11/2026', requests: 0 },
    { id: 'U006', buildingId: 'BLDG-001', unitNumber: '2B', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T006', name: 'Sumi Akhter', avatar: 'https://ui-avatars.com/api/?name=Sumi+Akhter&background=random' }, rentStatus: RentStatus.Overdue, leaseStartDate: '10/28/2025', leaseEndDate: '4/28/2026', requests: 1 },
    { id: 'U007', buildingId: 'BLDG-001', unitNumber: '3B', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T007', name: 'Hasan Mahmud', avatar: 'https://ui-avatars.com/api/?name=Hasan+Mahmud&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '12/17/2025', leaseEndDate: '6/17/2026', requests: 0 },
    { id: 'U008', buildingId: 'BLDG-001', unitNumber: '4B', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T008', name: 'Shuvo Islam', avatar: 'https://ui-avatars.com/api/?name=Shuvo+Islam&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '8/9/2025', leaseEndDate: '2/9/2026', requests: 0 },
    { id: 'U009', buildingId: 'BLDG-001', unitNumber: '1C', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T009', name: 'Maruf Khan', avatar: 'https://ui-avatars.com/api/?name=Maruf+Khan&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '5/22/2025', leaseEndDate: '11/22/2025', requests: 1 },
    { id: 'U010', buildingId: 'BLDG-001', unitNumber: '2C', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T010', name: 'Mahin Alam', avatar: 'https://ui-avatars.com/api/?name=Mahin+Alam&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '2/15/2025', leaseEndDate: '8/15/2026', requests: 0 },
    { id: 'U011', buildingId: 'BLDG-001', unitNumber: '3C', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T011', name: 'Saima Binte Noor', avatar: 'https://ui-avatars.com/api/?name=Saima+Binte+Noor&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '1/5/2025', leaseEndDate: '7/5/2026', requests: 0 },
    { id: 'U012', buildingId: 'BLDG-001', unitNumber: '4C', category: BuildingCategory.Standard, bedrooms: 2, bathrooms: 1, sqft: 850, rent: 25000, monthlyRent: 25000, status: UnitStatus.Rented, tenant: { id: 'T012', name: 'Javed Rahman', avatar: 'https://ui-avatars.com/api/?name=Javed+Rahman&background=random' }, rentStatus: RentStatus.Pending, leaseStartDate: '6/19/2025', leaseEndDate: '12/19/2025', requests: 0 },
    
    // Building 2 – Banani Heights (8 Units)
    { id: 'U013', buildingId: 'BLDG-002', unitNumber: '1A', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, tenant: { id: 'T013', name: 'Sadia Hossain', avatar: 'https://ui-avatars.com/api/?name=Sadia+Hossain&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '4/3/2025', leaseEndDate: '10/3/2026', requests: 0 },
    { id: 'U014', buildingId: 'BLDG-002', unitNumber: '2A', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, tenant: { id: 'T014', name: 'Kamal Uddin', avatar: 'https://ui-avatars.com/api/?name=Kamal+Uddin&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '3/2/2025', leaseEndDate: '9/2/2026', requests: 1 },
    { id: 'U015', buildingId: 'BLDG-002', unitNumber: '3A', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, tenant: { id: 'T015', name: 'Mehnaz Sultana', avatar: 'https://ui-avatars.com/api/?name=Mehnaz+Sultana&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '11/23/2025', leaseEndDate: '5/23/2026', requests: 0 },
    { id: 'U016', buildingId: 'BLDG-002', unitNumber: '4A', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, tenant: { id: 'T016', name: 'Tanvir Ahmed', avatar: 'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=random' }, rentStatus: RentStatus.Overdue, leaseStartDate: '10/11/2025', leaseEndDate: '4/11/2026', requests: 1 },
    { id: 'U017', buildingId: 'BLDG-002', unitNumber: '1B', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, tenant: { id: 'T017', name: 'Nasrin Akter', avatar: 'https://ui-avatars.com/api/?name=Nasrin+Akter&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '9/29/2025', leaseEndDate: '3/29/2026', requests: 0 },
    { id: 'U018', buildingId: 'BLDG-002', unitNumber: '2B', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, tenant: { id: 'T018', name: 'Mithun Das', avatar: 'https://ui-avatars.com/api/?name=Mithun+Das&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '2/20/2025', leaseEndDate: '8/20/2026', requests: 0 },
    { id: 'U019', buildingId: 'BLDG-002', unitNumber: '3B', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, tenant: { id: 'T019', name: 'Zahid Hasan', avatar: 'https://ui-avatars.com/api/?name=Zahid+Hasan&background=random' }, rentStatus: RentStatus.Pending, leaseStartDate: '12/8/2025', leaseEndDate: '6/8/2026', requests: 1 },
    { id: 'U020', buildingId: 'BLDG-002', unitNumber: '4B', category: BuildingCategory.MidRange, bedrooms: 3, bathrooms: 2, sqft: 1100, rent: 35000, monthlyRent: 35000, status: UnitStatus.Rented, tenant: { id: 'T020', name: 'Roksana Begum', avatar: 'https://ui-avatars.com/api/?name=Roksana+Begum&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '6/30/2025', leaseEndDate: '12/30/2025', requests: 0 },
    
    // Building 3 – Dhanmondi Residency (5 Units)
    { id: 'U021', buildingId: 'BLDG-003', unitNumber: '1A', category: BuildingCategory.Luxury, bedrooms: 4, bathrooms: 3, sqft: 1400, rent: 45000, monthlyRent: 45000, status: UnitStatus.Vacant, tenant: null, rentStatus: null, leaseStartDate: null, leaseEndDate: null, requests: 0 },
    { id: 'U022', buildingId: 'BLDG-003', unitNumber: '2A', category: BuildingCategory.Luxury, bedrooms: 4, bathrooms: 3, sqft: 1400, rent: 45000, monthlyRent: 45000, status: UnitStatus.Rented, tenant: { id: 'T021', name: 'Shila Rahman', avatar: 'https://ui-avatars.com/api/?name=Shila+Rahman&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '8/13/2025', leaseEndDate: '2/13/2026', requests: 1 },
    { id: 'U023', buildingId: 'BLDG-003', unitNumber: '3A', category: BuildingCategory.Luxury, bedrooms: 4, bathrooms: 3, sqft: 1400, rent: 45000, monthlyRent: 45000, status: UnitStatus.Rented, tenant: { id: 'T022', name: 'Arefin Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Arefin+Chowdhury&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '5/9/2025', leaseEndDate: '11/9/2025', requests: 0 },
    { id: 'U024', buildingId: 'BLDG-003', unitNumber: '4A', category: BuildingCategory.Luxury, bedrooms: 4, bathrooms: 3, sqft: 1400, rent: 45000, monthlyRent: 45000, status: UnitStatus.Rented, tenant: { id: 'T023', name: 'Rezaul Karim', avatar: 'https://ui-avatars.com/api/?name=Rezaul+Karim&background=random' }, rentStatus: RentStatus.Overdue, leaseStartDate: '7/18/2025', leaseEndDate: '1/18/2026', requests: 1 },
    { id: 'U025', buildingId: 'BLDG-003', unitNumber: '5A', category: BuildingCategory.Luxury, bedrooms: 4, bathrooms: 3, sqft: 1400, rent: 45000, monthlyRent: 45000, status: UnitStatus.Rented, tenant: { id: 'T024', name: 'Nadia Islam', avatar: 'https://ui-avatars.com/api/?name=Nadia+Islam&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '1/27/2025', leaseEndDate: '7/27/2026', requests: 0 },
    
    // Building 4 – Uttara Gardens (3 Units)
    { id: 'U026', buildingId: 'BLDG-004', unitNumber: '1', category: BuildingCategory.Luxury, bedrooms: 5, bathrooms: 4, sqft: 1800, rent: 60000, monthlyRent: 60000, status: UnitStatus.Rented, tenant: { id: 'T025', name: 'Selina Yasmin', avatar: 'https://ui-avatars.com/api/?name=Selina+Yasmin&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '7/12/2025', leaseEndDate: '1/12/2026', requests: 1 },
    { id: 'U027', buildingId: 'BLDG-004', unitNumber: '2', category: BuildingCategory.Luxury, bedrooms: 5, bathrooms: 4, sqft: 1800, rent: 60000, monthlyRent: 60000, status: UnitStatus.Rented, tenant: { id: 'T026', name: 'Abdul Malek', avatar: 'https://ui-avatars.com/api/?name=Abdul+Malek&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '4/30/2025', leaseEndDate: '10/30/2025', requests: 0 },
    { id: 'U028', buildingId: 'BLDG-004', unitNumber: '3', category: BuildingCategory.Luxury, bedrooms: 5, bathrooms: 4, sqft: 1800, rent: 60000, monthlyRent: 60000, status: UnitStatus.Rented, tenant: { id: 'T027', name: 'Rafsan Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Rafsan+Chowdhury&background=random' }, rentStatus: RentStatus.Paid, leaseStartDate: '3/19/2025', leaseEndDate: '9/19/2026', requests: 0 },
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
    { id: 'APP-0020', tenant: { id: 'T030', name: 'John Doe', avatar: generateAvatar(), rating: 4.9 }, unit: '1A', buildingId: 'BLDG-002', matchPercentage: 88, submissionDate: '10/12/2025' },
    { id: 'APP-0021', tenant: { id: 'T031', name: 'Jane Smith', avatar: generateAvatar(), rating: 4.1 }, unit: '2', buildingId: 'BLDG-004', matchPercentage: 92, submissionDate: '11/05/2025' },
    { id: 'APP-0022', tenant: { id: 'T032', name: 'Ahmed Hassan', avatar: generateAvatar(), rating: 4.7 }, unit: '2B', buildingId: 'BLDG-002', matchPercentage: 78, submissionDate: '09/22/2025' },
    { id: 'APP-0023', tenant: { id: 'T033', name: 'Fatima Khatun', avatar: generateAvatar(), rating: 4.3 }, unit: '1A', buildingId: 'BLDG-003', matchPercentage: 91, submissionDate: '09/28/2025' },
    { id: 'APP-0024', tenant: { id: 'T034', name: 'Mohammad Rahman', avatar: generateAvatar(), rating: 3.9 }, unit: '3C', buildingId: 'BLDG-003', matchPercentage: 45, submissionDate: '09/15/2025' },
];

// Mock Data for Specific Building Page (BLDG-001)
export const SPECIFIC_BUILDING_STATS: SpecificBuildingStat[] = [
  { label: 'Monthly Rent Roll', value: '11/12K', icon: DollarSign, bgColor: 'bg-green-100', color: 'text-green-600' },
  { label: 'Total Units', value: '12', icon: HomeIcon, bgColor: 'bg-orange-100', color: 'text-orange-600' },
  { label: 'Occupied Units', value: '11', icon: Check, bgColor: 'bg-yellow-100', color: 'text-yellow-600' },
  { label: 'Vacant Units', value: '1', icon: X, bgColor: 'bg-red-100', color: 'text-red-600' },
  { label: 'Service Requests', value: '3', icon: Settings, bgColor: 'bg-blue-100', color: 'text-blue-600' },
];

export const LEASES_ENDING_SOON_DATA: LeaseEndingSoon[] = [
    { tenant: { id: 'T002', name: 'Amrul Hoque', avatar: 'https://ui-avatars.com/api/?name=Amrul+Hoque&background=random', rating: 4.0 }, unit: '2A', leaseStartDate: '3/1/2025', leaseEndDate: '9/29/2025' },
    { tenant: { id: 'T026', name: 'Abdul Malek', avatar: 'https://ui-avatars.com/api/?name=Abdul+Malek&background=random', rating: 4.3 }, unit: '2', leaseStartDate: '4/30/2025', leaseEndDate: '10/30/2025' },
    { tenant: { id: 'T022', name: 'Arefin Chowdhury', avatar: 'https://ui-avatars.com/api/?name=Arefin+Chowdhury&background=random', rating: 4.2 }, unit: '3A', leaseStartDate: '5/9/2025', leaseEndDate: '11/9/2025' },
    { tenant: { id: 'T009', name: 'Maruf Khan', avatar: 'https://ui-avatars.com/api/?name=Maruf+Khan&background=random', rating: 4.4 }, unit: '1C', leaseStartDate: '5/22/2025', leaseEndDate: '11/22/2025' },
    { tenant: { id: 'T012', name: 'Javed Rahman', avatar: 'https://ui-avatars.com/api/?name=Javed+Rahman&background=random', rating: 4.2 }, unit: '4C', leaseStartDate: '6/19/2025', leaseEndDate: '12/19/2025' },
    { tenant: { id: 'T020', name: 'Roksana Begum', avatar: 'https://ui-avatars.com/api/?name=Roksana+Begum&background=random', rating: 4.0 }, unit: '4B', leaseStartDate: '6/30/2025', leaseEndDate: '12/30/2025' },
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
                { name: 'Lalmatia Court Unit 4A Lease', date: 'September 19, 2025' },
                { name: 'Banani Heights - Unit 15B Lease', date: 'September 15, 2025' },
                { name: 'Dhanmondi Residency - Unit 47F Lease', date: 'September 8, 2025' },
                { name: 'Lalmatia Court 24D Lease', date: 'September 2, 2025' },
                { name: 'Banani Heights - Unit 56F Lease', date: 'August 19, 2025' },
                { name: 'Dhanmondi Residency - Unit 21E Lease', date: 'August 15, 2025' },
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
                { name: 'Lalmatia Court Income Statement Sept.', date: 'September 19, 2025' },
                { name: 'Banani Heights Income Statement Sept.', date: 'September 15, 2025' },
                { name: 'Dhanmondi Residency Income Statement Sept.', date: 'September 8, 2025' },
                { name: 'Uttara Gardens Income Statement Sept.', date: 'September 2, 2025' },
                { name: 'Uttara Gardens Income Statement Sept.', date: 'August 19, 2025' },
                { name: 'Commercial Properties LLC. Income Statement Sept.', date: 'August 15, 2025' },
            ]
        },
        {
            category: 'Service Contracts / Receipts',
            icon: Settings,
            items: [
                { name: 'Baraka Svc Contract Invoice', date: 'September 19, 2025' },
                { name: 'Dhaka Costruction LLC. Invoice', date: 'September 15, 2025' },
                { name: 'Dhanmondi Residency Service Invoice', date: 'September 8, 2025' },
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
    'SR-0001': {
        id: 'SR-0001',
        title: 'Leak under kitchen sink',
        status: RequestStatus.Pending,
        requester: {
            name: 'Tania Akter',
            avatar: 'https://ui-avatars.com/api/?name=Tania+Akter&background=random',
            rating: 4.8
        },
        requestDate: '09/20/2025',
        buildingName: 'Lalmatia Court - Unit 4A',
        category: 'Plumbing',
        priority: 'HIGH',
        description: 'Tenant reports water pooling under sink; cabinet getting damaged. The leak appears to be coming from the pipe connections and is causing damage to the kitchen cabinetry. Immediate attention required to prevent further property damage.',
        statusUpdates: [
            { status: 'Request Created', date: '9/20/25' },
            { status: 'Priority set to HIGH', date: '9/20/25' }
        ],
        comments: [
            { sender: { name: 'Tania Akter', avatar: 'https://ui-avatars.com/api/?name=Tania+Akter&background=random' }, message: 'The water is pooling more each day. The cabinet door is starting to warp.', isSelf: false },
            { sender: { name: 'Property Manager', avatar: 'https://ui-avatars.com/api/?name=PM&background=blue' }, message: 'Thank you for reporting this. We will schedule a plumber to assess the situation.', isSelf: true },
        ],
        media: [
            { type: 'image', url: 'https://picsum.photos/seed/sink1/800/600' },
            { type: 'image', url: 'https://picsum.photos/seed/sink2/800/600' },
        ],
        activityLog: [
            { type: ActivityLogType.Scheduled, title: 'Plumber Scheduled', timestamp: 'Sep. 20, 2025 at 2:00 PM' }
        ],
        requestInfo: {
            timeOpen: 9,
            updates: 2,
            notes: 3,
        },
        notes: [
            { text: 'Tenant available weekdays after 6 PM for repairs' }
        ],
        contactCards: [
            {
                title: "Tenant's Primary Contact",
                contacts: [{ name: 'Tania Akter', avatar: 'https://ui-avatars.com/api/?name=Tania+Akter&background=random', rating: 4.8, phone: '+880 1769-567001', email: 'tania.akter@email.com' }]
            }
        ],
        suggestedVendors: [
            { name: 'Dhaka Plumbing Pro', logo: 'D', imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 4.2 }
        ]
    },
    'SR-0002': {
        id: 'SR-0002',
        title: 'Bathroom faucet dripping',
        status: RequestStatus.Pending,
        requester: {
            name: 'Sumi Akhter',
            avatar: 'https://ui-avatars.com/api/?name=Sumi+Akhter&background=random',
            rating: 4.3
        },
        requestDate: '09/22/2025',
        buildingName: 'Lalmatia Court - Unit 2B',
        category: 'Plumbing',
        priority: 'MEDIUM',
        description: 'Constant dripping, wasting water and raising bill. The faucet has been dripping continuously for the past week, leading to water waste and increased utility costs.',
        statusUpdates: [
            { status: 'Request Created', date: '9/22/25' }
        ],
        comments: [
            { sender: { name: 'Sumi Akhter', avatar: 'https://ui-avatars.com/api/?name=Sumi+Akhter&background=random' }, message: 'The dripping is getting worse and keeping me awake at night.', isSelf: false }
        ],
        media: [],
        activityLog: [
            { type: ActivityLogType.Scheduled, title: 'Maintenance Scheduled', timestamp: 'Sep. 22, 2025 at 4:00 PM' }
        ],
        requestInfo: {
            timeOpen: 7,
            updates: 1,
            notes: 2,
        },
        notes: [
            { text: 'Simple faucet repair - should be quick fix' }
        ],
        contactCards: [
            {
                title: "Tenant's Primary Contact",
                contacts: [{ name: 'Sumi Akhter', avatar: 'https://ui-avatars.com/api/?name=Sumi+Akhter&background=random', rating: 4.3, phone: '+880 1769-567002', email: 'sumi.akhter@email.com' }]
            }
        ],
        suggestedVendors: [
            { name: 'Quick Fix Plumbing', logo: 'Q', imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 3.8 }
        ]
    },
    'SR-0003': {
        id: 'SR-0003',
        title: 'AC not cooling properly',
        status: RequestStatus.Pending,
        requester: {
            name: 'Maruf Khan',
            avatar: 'https://ui-avatars.com/api/?name=Maruf+Khan&background=random',
            rating: 4.4
        },
        requestDate: '09/19/2025',
        buildingName: 'Lalmatia Court - Unit 1C',
        category: 'HVAC',
        priority: 'HIGH',
        description: 'AC blows warm air even after filter cleaning. The air conditioning unit is not providing adequate cooling despite recent filter maintenance. With the current weather, this is affecting tenant comfort significantly.',
        statusUpdates: [
            { status: 'Request Created', date: '9/19/25' },
            { status: 'Priority set to HIGH', date: '9/19/25' }
        ],
        comments: [
            { sender: { name: 'Maruf Khan', avatar: 'https://ui-avatars.com/api/?name=Maruf+Khan&background=random' }, message: 'I already cleaned the filter as suggested, but it is still not cooling.', isSelf: false },
            { sender: { name: 'Property Manager', avatar: 'https://ui-avatars.com/api/?name=PM&background=blue' }, message: 'We will send an HVAC technician to diagnose the issue.', isSelf: true }
        ],
        media: [
            { type: 'image', url: 'https://picsum.photos/seed/ac1/800/600' }
        ],
        activityLog: [
            { type: ActivityLogType.Scheduled, title: 'HVAC Technician Scheduled', timestamp: 'Sep. 19, 2025 at 3:00 PM' }
        ],
        requestInfo: {
            timeOpen: 10,
            updates: 2,
            notes: 4,
        },
        notes: [
            { text: 'Tenant reports filter was cleaned recently' }
        ],
        contactCards: [
            {
                title: "Tenant's Primary Contact",
                contacts: [{ name: 'Maruf Khan', avatar: 'https://ui-avatars.com/api/?name=Maruf+Khan&background=random', rating: 4.4, phone: '+880 1769-567003', email: 'maruf.khan@email.com' }]
            }
        ],
        suggestedVendors: [
            { name: 'Cool Air HVAC', logo: 'C', imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 4.5 }
        ]
    },
    'SR-0004': {
        id: 'SR-0004',
        title: 'Electrical outage in living room',
        status: RequestStatus.InProgress,
        requester: {
            name: 'Kamal Uddin',
            avatar: 'https://ui-avatars.com/api/?name=Kamal+Uddin&background=random',
            rating: 4.3
        },
        requestDate: '09/18/2025',
        buildingName: 'Banani Heights - Unit 2A',
        category: 'Electrical',
        priority: 'HIGH',
        description: 'Circuit breaker keeps tripping, no power in living room. This is a safety concern as the repeated tripping indicates a potential electrical hazard that requires immediate professional attention.',
        statusUpdates: [
            { status: 'Request Created', date: '9/18/25' },
            { status: 'Changed to "In Progress"', date: '9/19/25' }
        ],
        comments: [
            { sender: { name: 'Kamal Uddin', avatar: 'https://ui-avatars.com/api/?name=Kamal+Uddin&background=random' }, message: 'The breaker trips immediately when I try to reset it.', isSelf: false },
            { sender: { name: 'Property Manager', avatar: 'https://ui-avatars.com/api/?name=PM&background=blue' }, message: 'Electrician is on the way. Do not attempt to reset the breaker again.', isSelf: true }
        ],
        media: [
            { type: 'image', url: 'https://picsum.photos/seed/electrical1/800/600' }
        ],
        activityLog: [
            { type: ActivityLogType.Scheduled, title: 'Electrician Scheduled', timestamp: 'Sep. 18, 2025 at 5:00 PM' },
            { type: ActivityLogType.Arrived, title: 'Electrician Arrived', timestamp: 'Sep. 19, 2025 at 9:00 AM' }
        ],
        requestInfo: {
            timeOpen: 11,
            updates: 3,
            notes: 5,
        },
        notes: [
            { text: 'URGENT: Do not reset breaker - safety hazard' }
        ],
        contactCards: [
            {
                title: "Tenant's Primary Contact",
                contacts: [{ name: 'Kamal Uddin', avatar: 'https://ui-avatars.com/api/?name=Kamal+Uddin&background=random', rating: 4.3, phone: '+880 1769-567004', email: 'kamal.uddin@email.com' }]
            }
        ],
        suggestedVendors: [
            { name: 'Pro Electric Solutions', logo: 'P', imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 4.7 }
        ]
    },
    'SR-0005': {
        id: 'SR-0005',
        title: 'Window glass cracked',
        status: RequestStatus.Pending,
        requester: {
            name: 'Tanvir Ahmed',
            avatar: 'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=random',
            rating: 4.1
        },
        requestDate: '09/23/2025',
        buildingName: 'Banani Heights - Unit 4A',
        category: 'Maintenance',
        priority: 'MEDIUM',
        description: 'Small crack in bedroom window, risk of shattering. The crack is small but growing, and there is concern it could shatter completely if not addressed soon.',
        statusUpdates: [
            { status: 'Request Created', date: '9/23/25' }
        ],
        comments: [
            { sender: { name: 'Tanvir Ahmed', avatar: 'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=random' }, message: 'The crack seems to be spreading slowly.', isSelf: false }
        ],
        media: [
            { type: 'image', url: 'https://picsum.photos/seed/window1/800/600' }
        ],
        activityLog: [
            { type: ActivityLogType.Scheduled, title: 'Glass Repair Scheduled', timestamp: 'Sep. 23, 2025 at 1:00 PM' }
        ],
        requestInfo: {
            timeOpen: 6,
            updates: 1,
            notes: 2,
        },
        notes: [
            { text: 'Need measurements for replacement glass' }
        ],
        contactCards: [
            {
                title: "Tenant's Primary Contact",
                contacts: [{ name: 'Tanvir Ahmed', avatar: 'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=random', rating: 4.1, phone: '+880 1769-567005', email: 'tanvir.ahmed@email.com' }]
            }
        ],
        suggestedVendors: [
            { name: 'Crystal Clear Glass', logo: 'C', imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 4.0 }
        ]
    },
    'SR-0006': {
        id: 'SR-0006',
        title: 'Clogged kitchen drain',
        status: RequestStatus.Pending,
        requester: {
            name: 'Zahid Hasan',
            avatar: 'https://ui-avatars.com/api/?name=Zahid+Hasan&background=random',
            rating: 4.4
        },
        requestDate: '09/24/2025',
        buildingName: 'Banani Heights - Unit 3B',
        category: 'Plumbing',
        priority: 'MEDIUM',
        description: 'Water not draining; possible grease buildup. The kitchen sink is backing up and water is not draining properly, likely due to accumulated grease and food particles.',
        statusUpdates: [
            { status: 'Request Created', date: '9/24/25' }
        ],
        comments: [
            { sender: { name: 'Zahid Hasan', avatar: 'https://ui-avatars.com/api/?name=Zahid+Hasan&background=random' }, message: 'Water is backing up completely now. Cannot use the sink.', isSelf: false }
        ],
        media: [],
        activityLog: [
            { type: ActivityLogType.Scheduled, title: 'Plumber Scheduled', timestamp: 'Sep. 24, 2025 at 2:30 PM' }
        ],
        requestInfo: {
            timeOpen: 5,
            updates: 1,
            notes: 3,
        },
        notes: [
            { text: 'Likely needs professional drain cleaning' }
        ],
        contactCards: [
            {
                title: "Tenant's Primary Contact",
                contacts: [{ name: 'Zahid Hasan', avatar: 'https://ui-avatars.com/api/?name=Zahid+Hasan&background=random', rating: 4.4, phone: '+880 1769-567006', email: 'zahid.hasan@email.com' }]
            }
        ],
        suggestedVendors: [
            { name: 'Drain Master Pro', logo: 'D', imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 4.1 }
        ]
    },
    'SR-0007': {
        id: 'SR-0007',
        title: 'Bedroom light fixture sparking',
        status: RequestStatus.Pending,
        requester: {
            name: 'Shila Rahman',
            avatar: 'https://ui-avatars.com/api/?name=Shila+Rahman&background=random',
            rating: 4.7
        },
        requestDate: '09/21/2025',
        buildingName: 'Dhanmondi Residency - Unit 2A',
        category: 'Electrical',
        priority: 'HIGH',
        description: 'Sparks seen when switching light on/off. This is a serious electrical safety hazard that requires immediate professional attention to prevent potential fire risk.',
        statusUpdates: [
            { status: 'Request Created', date: '9/21/25' },
            { status: 'Priority set to HIGH - SAFETY URGENT', date: '9/21/25' }
        ],
        comments: [
            { sender: { name: 'Shila Rahman', avatar: 'https://ui-avatars.com/api/?name=Shila+Rahman&background=random' }, message: 'I have stopped using that switch completely for safety.', isSelf: false },
            { sender: { name: 'Property Manager', avatar: 'https://ui-avatars.com/api/?name=PM&background=blue' }, message: 'Good decision. Emergency electrician has been contacted.', isSelf: true }
        ],
        media: [
            { type: 'video', url: 'https://picsum.photos/seed/sparks1/800/600' }
        ],
        activityLog: [
            { type: ActivityLogType.Scheduled, title: 'Emergency Electrician Called', timestamp: 'Sep. 21, 2025 at 6:00 PM' }
        ],
        requestInfo: {
            timeOpen: 8,
            updates: 2,
            notes: 4,
        },
        notes: [
            { text: 'CRITICAL SAFETY ISSUE - Do not use switch' }
        ],
        contactCards: [
            {
                title: "Tenant's Primary Contact",
                contacts: [{ name: 'Shila Rahman', avatar: 'https://ui-avatars.com/api/?name=Shila+Rahman&background=random', rating: 4.7, phone: '+880 1769-567007', email: 'shila.rahman@email.com' }]
            }
        ],
        suggestedVendors: [
            { name: 'Emergency Electric Care', logo: 'E', imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 4.8 }
        ]
    },
    'SR-0008': {
        id: 'SR-0008',
        title: 'Pest infestation (cockroaches)',
        status: RequestStatus.Pending,
        requester: {
            name: 'Rezaul Karim',
            avatar: 'https://ui-avatars.com/api/?name=Rezaul+Karim&background=random',
            rating: 4.5
        },
        requestDate: '09/15/2025',
        buildingName: 'Dhanmondi Residency - Unit 4A',
        category: 'Maintenance',
        priority: 'HIGH',
        description: 'Cockroaches in kitchen; needs pest control service. There is a significant cockroach infestation in the kitchen area that requires professional pest control treatment.',
        statusUpdates: [
            { status: 'Request Created', date: '9/15/25' },
            { status: 'Priority set to HIGH', date: '9/15/25' }
        ],
        comments: [
            { sender: { name: 'Rezaul Karim', avatar: 'https://ui-avatars.com/api/?name=Rezaul+Karim&background=random' }, message: 'The problem is getting worse. I see them mainly at night in the kitchen.', isSelf: false },
            { sender: { name: 'Property Manager', avatar: 'https://ui-avatars.com/api/?name=PM&background=blue' }, message: 'We will arrange professional pest control service immediately.', isSelf: true }
        ],
        media: [
            { type: 'image', url: 'https://picsum.photos/seed/pest1/800/600' }
        ],
        activityLog: [
            { type: ActivityLogType.Scheduled, title: 'Pest Control Scheduled', timestamp: 'Sep. 15, 2025 at 4:00 PM' }
        ],
        requestInfo: {
            timeOpen: 14,
            updates: 2,
            notes: 5,
        },
        notes: [
            { text: 'Schedule follow-up treatment in 2 weeks' }
        ],
        contactCards: [
            {
                title: "Tenant's Primary Contact",
                contacts: [{ name: 'Rezaul Karim', avatar: 'https://ui-avatars.com/api/?name=Rezaul+Karim&background=random', rating: 4.5, phone: '+880 1769-567008', email: 'rezaul.karim@email.com' }]
            }
        ],
        suggestedVendors: [
            { name: 'Dhaka Pest Solutions', logo: 'D', imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 4.3 }
        ]
    },
    'SR-0009': {
        id: 'SR-0009',
        title: 'Water heater not working',
        status: RequestStatus.Pending,
        requester: {
            name: 'Selina Yasmin',
            avatar: 'https://ui-avatars.com/api/?name=Selina+Yasmin&background=random',
            rating: 4.6
        },
        requestDate: '09/25/2025',
        buildingName: 'Uttara Gardens - Unit 1',
        category: 'Appliance',
        priority: 'HIGH',
        description: 'Tenant reports no hot water for past two days. The water heater has completely stopped working, leaving the tenant without hot water for essential daily activities.',
        statusUpdates: [
            { status: 'Request Created', date: '9/25/25' },
            { status: 'Priority set to HIGH', date: '9/25/25' }
        ],
        comments: [
            { sender: { name: 'Selina Yasmin', avatar: 'https://ui-avatars.com/api/?name=Selina+Yasmin&background=random' }, message: 'No hot water for two days now. This is very inconvenient.', isSelf: false },
            { sender: { name: 'Property Manager', avatar: 'https://ui-avatars.com/api/?name=PM&background=blue' }, message: 'We understand the urgency. Appliance technician will be there today.', isSelf: true }
        ],
        media: [],
        activityLog: [
            { type: ActivityLogType.Scheduled, title: 'Appliance Repair Scheduled', timestamp: 'Sep. 25, 2025 at 11:00 AM' }
        ],
        requestInfo: {
            timeOpen: 4,
            updates: 2,
            notes: 3,
        },
        notes: [
            { text: 'Check if warranty is still valid' }
        ],
        contactCards: [
            {
                title: "Tenant's Primary Contact",
                contacts: [{ name: 'Selina Yasmin', avatar: 'https://ui-avatars.com/api/?name=Selina+Yasmin&background=random', rating: 4.6, phone: '+880 1769-567009', email: 'selina.yasmin@email.com' }]
            }
        ],
        suggestedVendors: [
            { name: 'Home Appliance Experts', logo: 'H', imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1', rating: 4.4 }
        ]
    }
};

// Mock Data for Tenants Dashboard
export const TENANT_DASHBOARD_STATS: TenantDashboardStat[] = [
    { label: 'Total Tenants', value: '26', icon: Users, iconColor: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Vacant Units', value: '2', icon: X, iconColor: 'text-red-600', bgColor: 'bg-red-100' },
    { label: 'Rental Applications', value: '5', icon: FileText, iconColor: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { label: 'Total Units', value: '28', icon: HomeIcon, iconColor: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'Service Requests', value: '9', icon: Settings, iconColor: 'text-blue-600', bgColor: 'bg-blue-100' },
];

export const TENANTS_DASHBOARD_TABLE_DATA: Tenant[] = [
    { id: 'T020', name: 'Naki Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0001', leaseProgress: 80, rentStatus: RentStatus.Paid, requests: 8 },
    { id: 'T021', name: 'Sazia Rahman', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0002', leaseProgress: 75, rentStatus: RentStatus.Paid, requests: 10 },
    { id: 'T022', name: 'Abdelqadir Siraj', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0003', leaseProgress: 60, rentStatus: RentStatus.Overdue, requests: 6 },
    { id: 'radhika-islam', name: 'Radlya Islam', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0004', leaseProgress: 90, rentStatus: RentStatus.Pending, requests: 21 },
    { id: 'T023', name: 'Taki Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0001', leaseProgress: 50, rentStatus: RentStatus.Pending, requests: 8 },
    { id: 'T024', name: 'Ohin Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0002', leaseProgress: 85, rentStatus: RentStatus.Paid, requests: 10 },
    { id: 'T025', name: 'Famu Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0003', leaseProgress: 70, rentStatus: RentStatus.Paid, requests: 6 },
    { id: 'T026', name: 'Faisal Chowdhury', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0004', leaseProgress: 40, rentStatus: RentStatus.Paid, requests: 21 },
    { id: 'T027', name: 'Mukul Miyah', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0001', leaseProgress: 95, rentStatus: RentStatus.Pending, requests: 8 },
    { id: 'T028', name: 'Lipi Choudhary', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0002', leaseProgress: 30, rentStatus: RentStatus.Overdue, requests: 10 },
    { id: 'T029', name: 'Ariful Islam', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0003', leaseProgress: 80, rentStatus: RentStatus.Pending, requests: 6 },
    { id: 'T030', name: 'Shohanur Rahman', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0004', leaseProgress: 75, rentStatus: RentStatus.Paid, requests: 21 },
    { id: 'T031', name: 'Maisha Gulam', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0001', leaseProgress: 65, rentStatus: RentStatus.Pending, requests: 8 },
    { id: 'T032', name: 'Saqib Khan', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0002', leaseProgress: 55, rentStatus: RentStatus.Paid, requests: 10 },
    { id: 'T033', name: 'Shamu Abdullah', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0003', leaseProgress: 78, rentStatus: RentStatus.Pending, requests: 6 },
    { id: 'T034', name: 'Tahmidur Hoque', avatar: generateAvatar(), rating: 4.5, building: 'BLDG-0004', leaseProgress: 88, rentStatus: RentStatus.Pending, requests: 21 },
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
    { label: 'Recent Documents', value: '28', icon: FileText, iconColor: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'Active Lease Docs', value: '26', icon: HomeIcon, iconColor: 'text-red-600', bgColor: 'bg-red-100' },
    { label: 'Income / Tax Docs', value: '8', icon: DollarSign, iconColor: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Recent Utilities / Bills', value: '7', icon: Zap, iconColor: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { label: 'Service Invoices', value: '9', icon: Settings, iconColor: 'text-blue-600', bgColor: 'bg-blue-100' },
];

export const MOST_RECENT_DOCUMENTS: Document[] = [
    { id: 'DOC001', name: 'Unit 12A Lease Agreement', building: 'BLDG-0001', unit: 'A1', type: DocumentType.Lease, uploadDate: '10/10/2025' },
    { id: 'DOC002', name: 'Lalmatia Court Electric Invoice', building: 'BLDG-0001', unit: 'A2', type: DocumentType.Utilities, uploadDate: '10/15/2025' },
    { id: 'DOC003', name: 'Banani Heights Water Bill', building: 'BLDG-0002', unit: 'A7', type: DocumentType.Utilities, uploadDate: '9/26/2025' },
    { id: 'DOC004', name: 'Dhanmondi Residency Pest Svcs Contract', building: 'BLDG-0003', unit: 'B2', type: DocumentType.Service, uploadDate: '9/31/2025' },
    { id: 'DOC005', name: 'Uttara Gardens Income Statement', building: 'BLDG-0004', unit: 'B9', type: DocumentType.Income, uploadDate: '11/14/2025' },
    { id: 'DOC006', name: 'Lalmatia Court Compliance Certificate', building: 'BLDG-0001', unit: 'C3', type: DocumentType.Certifications, uploadDate: '11/23/2025' },
    { id: 'DOC007', name: 'Banani Heights Insurance Policy', building: 'BLDG-0002', unit: 'C5', type: DocumentType.Insurance, uploadDate: '12/14/2025' },
    { id: 'DOC008', name: 'Mirpur Elevator Maintenance Contract', building: 'BLDG-0001', unit: 'C6', type: DocumentType.Service, uploadDate: '12/24/2025' },
    { id: 'DOC009', name: 'Lalmatia Court Tax Receipt', building: 'BLDG-0001', unit: 'C11', type: DocumentType.Income, uploadDate: '12/27/2025' },
    { id: 'DOC010', name: 'City Lights Plumbing Service Invoice', building: 'BLDG-0004', unit: 'D1', type: DocumentType.Service, uploadDate: '12/28/2025' },
    { id: 'DOC011', name: 'Uttara Gardens Renovation Permit', building: 'BLDG-0004', unit: 'D3', type: DocumentType.Certifications, uploadDate: '12/31/2025' },
];

export const STARRED_DOCUMENTS: Document[] = [
    { id: 'DOC001', name: 'Unit 12A Lease Agreement', building: 'BLDG-0001', unit: 'A1', type: DocumentType.Lease, uploadDate: '10/10/2025' },
    { id: 'DOC002', name: 'Lalmatia Court Electric Invoice', building: 'BLDG-0001', unit: 'A2', type: DocumentType.Utilities, uploadDate: '10/15/2025' },
    { id: 'DOC003', name: 'Banani Heights Water Bill', building: 'BLDG-0002', unit: 'A7', type: DocumentType.Utilities, uploadDate: '9/26/2025' },
    { id: 'DOC004', name: 'Dhanmondi Residency Pest Svcs Contract', building: 'BLDG-0003', unit: 'B2', type: DocumentType.Service, uploadDate: '9/31/2025' },
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
    { id: 'DOC012', name: 'Banani Heights Water Bill', building: 'BLDG-0002', unit: 'C6', type: DocumentType.Utilities, uploadDate: '12/24/2025' },
    { id: 'DOC013', name: 'Lalmatia Court Unit 15B Lease', building: 'BLDG-0001', unit: '15B', type: DocumentType.Lease, uploadDate: '12/23/2025' },
    { id: 'DOC014', name: 'Dhanmondi Residency Unit 47F Lease', building: 'BLDG-0003', unit: '47F', type: DocumentType.Lease, uploadDate: '12/22/2025' },
    { id: 'DOC015', name: 'Baraka Power Ltd. Electric Invoice', building: 'BLDG-0004', unit: 'A7', type: DocumentType.Utilities, uploadDate: '12/21/2025' },
    { id: 'DOC016', name: 'Sweet Home Cleaning Svcs Invoice', building: 'BLDG-0001', unit: 'C3', type: DocumentType.Service, uploadDate: '12/20/2025' },
    { id: 'DOC017', name: 'Laundronauts Svcs Invoice', building: 'BLDG-0002', unit: 'B9', type: DocumentType.Service, uploadDate: '12/19/2025' },
    { id: 'DOC018', name: 'Dhaka Water Svcs Invoice', building: 'BLDG-0001', unit: 'A1', type: DocumentType.Utilities, uploadDate: '12/18/2025' },
    { id: 'DOC019', name: 'Uttara Gardens Income Statement', building: 'BLDG-0004', unit: 'N/A', type: DocumentType.Income, uploadDate: '12/17/2025' },
    { id: 'DOC020', name: 'Dhaka Construction LLC. Invoice', building: 'BLDG-0004', unit: 'D1', type: DocumentType.Service, uploadDate: '12/16/2025' },
    { id: 'DOC021', name: 'Dhanmondi Residency Service Invoice', building: 'BLDG-0003', unit: 'B2', type: DocumentType.Service, uploadDate: '12/15/2025' },
    { id: 'DOC022', name: 'Chowdhury Cement September Invoice', building: 'BLDG-0001', unit: 'N/A', type: DocumentType.Service, uploadDate: '12/14/2025' },
    { id: 'DOC023', 'name': 'Unit 1A Insurance Policy', 'building': 'BLDG-0001', 'unit': 'A1', 'type': DocumentType.Insurance, 'uploadDate': '12/13/2025' },
    { id: 'DOC024', 'name': 'Fire Safety Certificate', 'building': 'BLDG-0002', 'unit': 'N/A', 'type': DocumentType.Certifications, 'uploadDate': '12/12/2025' },
    { id: 'DOC025', 'name': 'Elevator Inspection Report', 'building': 'BLDG-0003', 'unit': 'N/A', 'type': DocumentType.Certifications, 'uploadDate': '12/11/2025' },
    { id: 'DOC026', 'name': 'Annual Tax Return 2024', 'building': 'N/A', 'unit': 'N/A', 'type': DocumentType.Income, 'uploadDate': '12/10/2025' },
    { id: 'DOC027', 'name': 'Plumbing Repair Receipt Unit B2', 'building': 'BLDG-0003', 'unit': 'B2', 'type': DocumentType.Service, 'uploadDate': '12/09/2025' },
    { id: 'DOC028', 'name': 'Unit C5 Internet Bill', 'building': 'BLDG-0003', 'unit': 'C5', 'type': DocumentType.Utilities, 'uploadDate': '12/08/2025' },
];

// Mock Data for Home Dashboard
export const HOME_STATS: HomeStat[] = [
    { label: 'Open Service Requests', value: '9', icon: Wrench, color: 'orange' },
    { label: 'Vacant Units', value: '2', icon: HomeIcon, color: 'red' },
    { label: 'Overdue Rent', value: '3', icon: FileWarning, color: 'yellow' },
    { label: 'New Applications', value: '5', icon: Users, color: 'green' },
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
        buildingName: 'Lalmatia Court',
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