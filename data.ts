/**
 * Initial Data Generator for SuGhar Property Management System
 * 
 * This file generates mock/demo data for the application to demonstrate functionality.
 * In a production environment, this would be replaced with API calls to a backend server.
 * 
 * The data includes:
 * - Demo users with login credentials
 * - Sample buildings across Dhaka
 * - Units with various occupancy statuses
 * - Tenants with realistic profiles
 * - Service requests
 * - Rental applications
 * - Documents
 */

import {
  type AppData,
  type User,
  UserRole,
  type BuildingDetail,
  type UnitDetail,
  type Tenant,
  type ServiceRequest,
  type RentalApplication,
  type Document,
  BuildingCategory,
  UnitStatus,
  RentStatus,
  RequestStatus,
  DocumentType,
  ApplicationStatus,
  type PropertyGroup,
  type Contractor,
  type ActivityLogItem,
  ActivityLogType,
  type TenantRating,
} from './types';
import { PropertyListing } from './types/listing';

/**
 * Generates the complete initial dataset for the application
 * This function creates interconnected data (buildings -> units -> tenants, etc.)
 * @returns Complete AppData object with all demo data
 */
const generateInitialData = (): AppData => {
    // ============ Users ============
    // Demo users for testing authentication
    // NOTE: In production, passwords should NEVER be stored in plaintext
    const users: User[] = [
        {
            id: 'U-1',
            name: 'Monir Rahman',
            email: 'monir@ashaproperties.com',
            avatarUrl: 'https://i.pravatar.cc/150?u=monir',
            password: 'password123',
            role: UserRole.Landlord,
            phone: '+880-1711-123456',
            propertyGroupRoles: [
                { groupId: 'PG-1', role: UserRole.Landlord },
            ],
        },
        {
            id: 'U-DEMO',
            name: 'Demo User',
            email: 'demo@sughar.com',
            avatarUrl: 'https://i.pravatar.cc/150?u=demo',
            password: 'demo',
            role: UserRole.Landlord,
            phone: '+880-1711-999999',
            propertyGroupRoles: [
                { groupId: 'PG-1', role: UserRole.Landlord },
            ],
        },
        {
            id: 'U-BILAL',
            name: 'Bilal Ahmed',
            email: 'bilal@email.com',
            avatarUrl: 'https://i.pravatar.cc/150?u=bilal',
            password: 'bilal123',
            role: UserRole.BuildingManager,
            phone: '+880-1711-555555',
            propertyGroupRoles: [
                { groupId: 'PG-1', role: UserRole.BuildingManager },
                { groupId: 'PG-2', role: UserRole.Tenant },
            ],
        }
    ];

    // ============ Property Groups ============
    const propertyGroups: PropertyGroup[] = [
        {
            id: 'PG-1',
            name: 'Asha Properties Group A',
            description: 'Primary property group in Dhaka metropolitan area',
            ownerId: 'U-1',
            buildingIds: ['B-LC', 'B-BH', 'B-DR'],
            createdAt: '2024-01-01',
        },
        {
            id: 'PG-2',
            name: 'Uttara Residences',
            description: 'Residential properties in Uttara sector',
            ownerId: 'U-1',
            buildingIds: ['B-UG'],
            createdAt: '2024-03-15',
        },
    ];

    // ============ Contractors ============
    const contractors: Contractor[] = [
        {
            id: 'C-1',
            name: 'Karim Plumbing Services',
            avatar: 'https://i.pravatar.cc/150?u=contractor1',
            phone: '+880-1711-234567',
            email: 'karim@plumbing.com',
            rating: 4.8,
            specialties: ['Plumbing', 'Water Systems', 'Drainage'],
            isActive: true,
        },
        {
            id: 'C-2',
            name: 'Rahman Electric Co.',
            avatar: 'https://i.pravatar.cc/150?u=contractor2',
            phone: '+880-1711-345678',
            email: 'info@rahmanelectric.com',
            rating: 4.6,
            specialties: ['Electrical', 'Wiring', 'AC Installation'],
            isActive: true,
        },
        {
            id: 'C-3',
            name: 'Dhaka Pest Control',
            avatar: 'https://i.pravatar.cc/150?u=contractor3',
            phone: '+880-1711-456789',
            email: 'contact@dhakapest.com',
            rating: 4.7,
            specialties: ['Pest Control', 'Fumigation', 'Prevention'],
            isActive: true,
        },
        {
            id: 'C-4',
            name: 'Modern HVAC Solutions',
            avatar: 'https://i.pravatar.cc/150?u=contractor4',
            phone: '+880-1711-567890',
            email: 'service@modernhvac.com',
            rating: 4.9,
            specialties: ['HVAC', 'AC Repair', 'Heating Systems'],
            isActive: true,
        },
        {
            id: 'C-5',
            name: 'BuildRight Construction',
            avatar: 'https://i.pravatar.cc/150?u=contractor5',
            phone: '+880-1711-678901',
            email: 'info@buildright.com',
            rating: 4.5,
            specialties: ['General Repairs', 'Carpentry', 'Painting'],
            isActive: true,
        },
    ];

    // ============ Buildings ============
    // Sample property portfolio across different areas of Dhaka
    // Categories range from Standard to Luxury based on location and amenities
    const buildings: BuildingDetail[] = [
        { id: 'B-LC', name: 'Lalmatia Court', address: 'Lalmatia, Dhaka', category: BuildingCategory.MidRange, totalUnits: 12, vacantUnits: 1, requests: 3, occupation: 92, rentCollection: 92, contact: { name: 'Karim Ahmed', avatar: 'https://i.pravatar.cc/40?u=karim' } },
        { id: 'B-BH', name: 'Banani Heights', address: 'Banani, Dhaka', category: BuildingCategory.Luxury, totalUnits: 8, vacantUnits: 0, requests: 3, occupation: 100, rentCollection: 100, contact: { name: 'Farida Khanom', avatar: 'https://i.pravatar.cc/40?u=farida' } },
        { id: 'B-DR', name: 'Dhanmondi Residency', address: 'Dhanmondi, Dhaka', category: BuildingCategory.Standard, totalUnits: 5, vacantUnits: 1, requests: 2, occupation: 80, rentCollection: 100, contact: { name: 'Karim Ahmed', avatar: 'https://i.pravatar.cc/40?u=karim' } },
        { id: 'B-UG', name: 'Uttara Gardens', address: 'Uttara, Dhaka', category: BuildingCategory.Standard, totalUnits: 3, vacantUnits: 0, requests: 1, occupation: 100, rentCollection: 100, contact: { name: 'Farida Khanom', avatar: 'https://i.pravatar.cc/40?u=farida' } },
    ];

    // ============ Tenants ============
    // Generate realistic tenant data with varied lease end dates
    // Special values: 'today' = lease expired today, 'next-month' = ending soon
    const tenantsData = [
        { name: 'Farzana Akhter', leaseEnd: '2026-01-14' }, { name: 'Amrul Hoque', leaseEnd: 'today' },
        { name: 'Shahriar Karim', leaseEnd: '2026-03-02' }, { name: 'Tania Akter', leaseEnd: '2026-03-03' },
        { name: 'Imran Chowdhury', leaseEnd: '2026-05-11' }, { name: 'Sumi Akhter', leaseEnd: '2026-04-28' },
        { name: 'Hasan Mahmud', leaseEnd: '2026-06-17' }, { name: 'Shuvo Islam', leaseEnd: '2026-02-09' },
        { name: 'Maruf Khan', leaseEnd: '2025-11-22' }, { name: 'Mahin Alam', leaseEnd: '2026-08-15' },
        { name: 'Saima Binte Noor', leaseEnd: '2026-07-05' }, { name: 'Javed Rahman', leaseEnd: '2025-12-19' },
        { name: 'Sadia Hossain', leaseEnd: '2026-10-03' }, { name: 'Kamal Uddin', leaseEnd: '2026-09-02' },
        { name: 'Mehnaz Sultana', leaseEnd: '2026-05-23' }, { name: 'Tanvir Ahmed', leaseEnd: '2026-04-11' },
        { name: 'Nasrin Akter', leaseEnd: '2026-03-29' }, { name: 'Mithun Das', leaseEnd: '2026-08-20' },
        { name: 'Zahid Hasan', leaseEnd: '2026-06-08' }, { name: 'Roksana Begum', leaseEnd: '2025-12-30' },
        { name: 'Shila Rahman', leaseEnd: '2026-02-13' }, { name: 'Arefin Chowdhury', leaseEnd: '2025-11-09' },
        { name: 'Rezaul Karim', leaseEnd: '2026-01-18' }, { name: 'Nadia Islam', leaseEnd: '2026-07-27' },
        { name: 'Selina Yasmin', leaseEnd: '2026-01-12' }, { name: 'Abdul Malek', leaseEnd: 'next-month' },
        { name: 'Rafsan Chowdhury', leaseEnd: '2026-09-19' },
    ];
    
    /**
     * Converts special date strings to actual dates
     * @param dateStr - Either a date string or special keywords like 'today' or 'next-month'
     * @returns Formatted date string in YYYY-MM-DD format
     */
    const getLeaseEndDate = (dateStr: string): string => {
        if (dateStr === 'today') return new Date().toISOString().split('T')[0];
        if (dateStr === 'next-month') {
            const d = new Date();
            d.setMonth(d.getMonth() + 1);
            return d.toISOString().split('T')[0];
        }
        return dateStr;
    }

    // Create tenant objects with randomized but realistic data
    const tenants: Tenant[] = tenantsData.map((t, i) => {
        // Create a user account for each tenant
        const tenantUser: User = {
            id: `U-T-${i+1}`,
            name: t.name,
            email: `${t.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
            avatarUrl: `https://i.pravatar.cc/40?u=${t.name}`,
            password: 'tenant123',
            role: UserRole.Tenant,
        };
        users.push(tenantUser);

        return {
            id: `T-${i+1}`,
            name: t.name,
            avatarUrl: `https://i.pravatar.cc/40?u=${t.name}`,
            avatar: `https://i.pravatar.cc/40?u=${t.name}`, // Unique avatar per tenant
            email: tenantUser.email,
            role: UserRole.Tenant,
            building: '', // Will be populated when assigning units
            unit: '', // Will be populated when assigning units
            leaseProgress: Math.floor(Math.random() * 80) + 10, // 10-90% through lease
            rentStatus: i % 10 === 0 ? RentStatus.Overdue : RentStatus.Paid, // 10% overdue rate
            requests: 0, // Will be incremented when creating service requests
            rating: (Math.floor(Math.random() * 5) + 1) as TenantRating, // 1-5 star rating
            reviewHistory: [],
            paymentIncidents: [],
            joinDate: new Date(new Date().setMonth(new Date().getMonth() - (i+1))).toISOString().split('T')[0],
        };
    });

    // ============ Units ============
    // Generate units for each building and assign tenants
    const units: UnitDetail[] = [];
    
    // Map each unit to its building (12 for LC, 8 for BH, 5 for DR, 3 for UG)
    const unitAssignments = [
        ...Array(12).fill('B-LC'), ...Array(8).fill('B-BH'), 
        ...Array(5).fill('B-DR'), ...Array(3).fill('B-UG')
    ];
    
    // Unit numbers for each building (e.g., 1A, 2B, etc.)
    const unitNumbers = [
        ...['1A','2A','3A','4A','1B','2B','3B','4B','1C','2C','3C','4C'], // Lalmatia Court
        ...['1A','2A','3A','4A','1B','2B','3B','4B'], // Banani Heights
        ...['1A','2A','3A','4A','5A'], // Dhanmondi Residency
        ...['1','2','3'] // Uttara Gardens
    ];

    // Track which tenant to assign next (some units will be vacant)
    let tenantIndex = 0;
    
    // Create all 28 units across the 4 buildings
    for (let i = 0; i < 28; i++) {
        const buildingId = unitAssignments[i];
        const building = buildings.find(b => b.id === buildingId)!;
        
        let status = UnitStatus.Rented;
        let currentTenantId = null;
        let previousTenantId = null;
        
        // Mark specific units as vacant (2 vacant units in the portfolio)
        // Unit B-LC 2A: Recently vacated by Amrul Hoque (lease expired)
        if (buildingId === 'B-LC' && unitNumbers[i] === '2A') {
             status = UnitStatus.Vacant;
             previousTenantId = tenants.find(t => t.name === 'Amrul Hoque')!.id;
        // Unit B-DR 1A: Vacant, no previous tenant
        } else if (buildingId === 'B-DR' && unitNumbers[i] === '1A') {
            status = UnitStatus.Vacant;
        // All other units: Assign next tenant
        } else {
            currentTenantId = tenants[tenantIndex].id;
            tenants[tenantIndex].building = building.name;
            tenants[tenantIndex].unit = unitNumbers[i];
            tenantIndex++;
        }
        
        // Create the unit object with all details
        units.push({
            id: `U-${buildingId}-${unitNumbers[i]}`,
            buildingId: buildingId,
            unitNumber: unitNumbers[i],
            category: building.category,
            monthlyRent: 20000 + Math.floor(Math.random() * 15000), // BDT 20,000-35,000
            status: status,
            currentTenantId: currentTenantId,
            previousTenantId: previousTenantId,
            rentStatus: status === UnitStatus.Rented ? RentStatus.Paid : null,
            leaseStartDate: '2024-01-01',
            leaseEndDate: getLeaseEndDate(tenantsData.find(t => t.name === tenants.find(t_ => t_.id === currentTenantId)?.name)?.leaseEnd || '2026-12-31'),
            requests: 0, // Will be incremented when creating service requests
            bedrooms: 2,
            bathrooms: 1,
            sqft: 1250,
        });
    }
    
    // ============ Service Requests ============
    // Sample maintenance requests with realistic issues
    const srDetails: {[key: string]: { unit: string; tenant: string; title: string; desc: string; date: string; status: RequestStatus; priority: 'High' | 'Medium' | 'Low'; type: string; completionDate?: string }} = {
        'SR-0001': { unit: 'U-B-LC-4A', tenant: 'Tania Akter', title: 'Leak under kitchen sink', desc: 'Tenant reports water pooling under sink; cabinet getting damaged.', date: '2025-09-20', status: RequestStatus.InProgress, priority: 'High', type: 'Plumbing' },
        'SR-0002': { unit: 'U-B-LC-2B', tenant: 'Sumi Akhter', title: 'Bathroom faucet dripping', desc: 'Constant dripping, wasting water and raising bill.', date: '2025-09-22', status: RequestStatus.Complete, priority: 'Low', type: 'Plumbing', completionDate: '2025-09-28' },
        'SR-0003': { unit: 'U-B-LC-1C', tenant: 'Maruf Khan', title: 'AC not cooling properly', desc: 'AC blows warm air even after filter cleaning.', date: '2025-09-19', status: RequestStatus.InProgress, priority: 'High', type: 'HVAC' },
        'SR-0004': { unit: 'U-B-BH-2A', tenant: 'Kamal Uddin', title: 'Electrical outage in living room', desc: 'Circuit breaker keeps tripping, no power in living room.', date: '2025-09-18', status: RequestStatus.Complete, priority: 'High', type: 'Electrical', completionDate: '2025-09-25' },
        'SR-0005': { unit: 'U-B-BH-4A', tenant: 'Tanvir Ahmed', title: 'Window glass cracked', desc: 'Small crack in bedroom window, risk of shattering.', date: '2025-09-23', status: RequestStatus.Pending, priority: 'Medium', type: 'Windows' },
        'SR-0006': { unit: 'U-B-BH-3B', tenant: 'Zahid Hasan', title: 'Clogged kitchen drain', desc: 'Water not draining; possible grease buildup.', date: '2025-09-24', status: RequestStatus.InProgress, priority: 'Medium', type: 'Plumbing' },
        'SR-0007': { unit: 'U-B-DR-2A', tenant: 'Shila Rahman', title: 'Bedroom light fixture sparking', desc: 'Sparks seen when switching light on/off.', date: '2025-09-21', status: RequestStatus.Pending, priority: 'High', type: 'Electrical' },
        'SR-0008': { unit: 'U-B-DR-4A', tenant: 'Rezaul Karim', title: 'Pest infestation (cockroaches)', desc: 'Cockroaches in kitchen; needs pest control service.', date: '2025-09-15', status: RequestStatus.Complete, priority: 'Medium', type: 'Pest Control', completionDate: '2025-09-26' },
        'SR-0009': { unit: 'U-B-UG-1', tenant: 'Selina Yasmin', title: 'Water heater not working', desc: 'Tenant reports no hot water for past two days.', date: '2025-09-25', status: RequestStatus.Pending, priority: 'High', type: 'Plumbing' },
        'SR-0010': { unit: 'U-B-LC-1A', tenant: 'Farzana Akhter', title: 'Broken door lock', desc: 'Front door lock is stuck and difficult to open.', date: '2025-10-01', status: RequestStatus.Pending, priority: 'High', type: 'Security' },
        'SR-0011': { unit: 'U-B-LC-1A', tenant: 'Farzana Akhter', title: 'Ceiling fan making noise', desc: 'Bedroom ceiling fan has been making a loud grinding noise.', date: '2025-09-28', status: RequestStatus.Complete, priority: 'Low', type: 'Electrical', completionDate: '2025-10-05' },
        'SR-0012': { unit: 'U-B-LC-3A', tenant: 'Shahriar Karim', title: 'Leaky balcony door', desc: 'Water seeps through balcony door during rain.', date: '2025-10-03', status: RequestStatus.Pending, priority: 'Medium', type: 'Windows' },
        'SR-0013': { unit: 'U-B-BH-1A', tenant: 'Imran Chowdhury', title: 'Washing machine drain issue', desc: 'Washing machine drains slowly and water backs up.', date: '2025-10-02', status: RequestStatus.InProgress, priority: 'Medium', type: 'Plumbing' },
        'SR-0014': { unit: 'U-B-BH-1A', tenant: 'Imran Chowdhury', title: 'Smoke detector chirping', desc: 'Smoke detector beeps intermittently even with new battery.', date: '2025-09-30', status: RequestStatus.Complete, priority: 'Low', type: 'Safety', completionDate: '2025-10-04' },
        'SR-0015': { unit: 'U-B-LC-4A', tenant: 'Tania Akter', title: 'Refrigerator not cooling', desc: 'Fridge stopped cooling, food is spoiling.', date: '2025-10-06', status: RequestStatus.Pending, priority: 'High', type: 'Appliances' },
        'SR-0016': { unit: 'U-B-DR-3A', tenant: 'Arefin Chowdhury', title: 'Mold in bathroom', desc: 'Black mold growing on bathroom ceiling and walls.', date: '2025-10-05', status: RequestStatus.InProgress, priority: 'High', type: 'Health and Safety' },
        'SR-0017': { unit: 'U-B-BH-3A', tenant: 'Mehnaz Sultana', title: 'Internet connection issues', desc: 'WiFi router needs replacement, frequent disconnections.', date: '2025-10-07', status: RequestStatus.Pending, priority: 'Low', type: 'Internet and Cable' },
        'SR-0018': { unit: 'U-B-UG-2', tenant: 'Abdul Malek', title: 'Loose tiles in kitchen', desc: 'Several floor tiles are loose and need re-grouting.', date: '2025-10-04', status: RequestStatus.Pending, priority: 'Medium', type: 'Flooring' },
        'SR-0019': { unit: 'U-B-LC-1C', tenant: 'Maruf Khan', title: 'Garbage disposal not working', desc: 'Kitchen garbage disposal unit makes humming noise but does not grind.', date: '2025-10-08', status: RequestStatus.Pending, priority: 'Low', type: 'Appliances' },
        'SR-0020': { unit: 'U-B-BH-3B', tenant: 'Zahid Hasan', title: 'Door hinge needs repair', desc: 'Bedroom door sags and scrapes the floor when opening.', date: '2025-10-09', status: RequestStatus.InProgress, priority: 'Low', type: 'Carpentry' },
    };

    // Convert service request details into full ServiceRequest objects
    const serviceRequests: ServiceRequest[] = Object.entries(srDetails).map(([id, details]) => {
        const unit = units.find(u => u.id === details.unit)!;
        const tenant = tenants.find(t => t.name === details.tenant)!;
        // Increment tenant's request count
        if(tenant) tenant.requests += 1;
        return {
            id: id,
            title: details.title,
            description: details.desc,
            tenantId: tenant.id,
            buildingId: unit.buildingId,
            unitId: unit.id,
            requestDate: details.date,
            status: details.status,
            priority: details.priority,
            assignedContact: { name: 'Karim Ahmed', avatar: 'https://i.pravatar.cc/40?u=karim' },
            completionDate: details.completionDate,
            type: details.type || 'Maintenance',
        }
    });

    // ============ Rental Applications ============
    // Prospective tenants applying for vacant units
    const applicantsData = [
        { name: 'Raiyan Rahman', occupation: 'Software Engineer', employer: 'Grameenphone IT Division', income: '120,000 BDT', years: 3, rating: 4.8 },
        { name: 'Niloy Hossain', occupation: 'Freelance Graphic Designer', employer: 'Self-employed', income: '~45,000 BDT', years: 2, rating: 0 },
        { name: 'Arif Mahmud', occupation: 'Senior Accountant', employer: 'BRAC Bank', income: '95,000 BDT', years: 5, rating: 4.5 },
        { name: 'Zarin Tasnim', occupation: 'Lecturer (Economics)', employer: 'University of Dhaka', income: '70,000 BDT', years: 4, rating: 4.9 },
        { name: 'Ayaan Chowdhury', occupation: 'Junior Doctor (Resident)', employer: 'Square Hospital', income: '65,000 BDT', years: 1, rating: 0 },
        { name: 'Nusrat Jahan', occupation: 'Fashion Entrepreneur', employer: 'Owns "Nusrat Styles"', income: '~150,000 BDT', years: 6, rating: 4.7 },
    ];
    
    // Create rental applications and corresponding user accounts for applicants
    const rentalApplications: RentalApplication[] = applicantsData.map((app, i) => {
        // Create a user account for each applicant
        const applicantUser: User = {
            id: `APP-U-${i+1}`,
            name: app.name,
            email: `${app.name.split(' ')[0].toLowerCase()}@email.com`,
            avatarUrl: `https://i.pravatar.cc/150?u=${app.name}`,
            role: UserRole.Applicant,
        };
        users.push(applicantUser); // Add applicant to users array
        
        return {
            id: `APP-${i+1}`,
            userId: applicantUser.id,
            status: ApplicationStatus.Pending,
            statement: "I am a responsible and clean professional looking for a quiet place to live.",
            occupation: app.occupation,
            employer: app.employer,
            monthlyIncome: app.income,
            yearsAtEmployer: app.years,
            documents: [{ type: 'ID', url: '#' }, { type: 'Income Proof', url: '#' }],
            references: [{ name: 'Previous Landlord', relation: 'Landlord', phone: '555-1234' }],
        };
    });
    
    // ============ Documents ============
    // Generate lease documents for all rented units
    const documents: Document[] = [];
    units.forEach((unit, i) => {
        if(unit.status === UnitStatus.Rented) {
            // Create a lease document for each occupied unit
            documents.push({
                id: `DOC-L-${i}`, 
                name: `Lease - ${unit.unitNumber}, ${unit.buildingId}`, 
                type: DocumentType.Lease, 
                uploadDate: new Date(new Date().setMonth(new Date().getMonth() - i)).toISOString().split('T')[0], 
                building: unit.buildingId, 
                unit: unit.unitNumber, 
                amount: unit.monthlyRent, 
                category: 'Income'
            });
        }
    });
    
    // Add sample expense document
    documents.push({
        id: 'DOC-E-1', 
        name: 'Plumbing Repair Invoice', 
        type: DocumentType.Service, 
        uploadDate: '2024-09-01', 
        building: 'B-LC', 
        unit: '4A', 
        amount: 5000, 
        category: 'Expense'
    });
    
    // Add some current month income documents for the home dashboard
    documents.push({
        id: 'DOC-INC-CUR-1', 
        name: 'Rent Payment', 
        type: DocumentType.Income, 
        uploadDate: new Date().toISOString().split('T')[0], 
        building: 'B-BH', 
        unit: '1A', 
        amount: 30000, 
        category: 'Income'
    });
    documents.push({
        id: 'DOC-INC-CUR-2', 
        name: 'Rent Payment', 
        type: DocumentType.Income, 
        uploadDate: new Date().toISOString().split('T')[0], 
        building: 'B-DR', 
        unit: '2A', 
        amount: 25000, 
        category: 'Income'
    });


    // ============ Activity Logs ============
    // Generate initial activity logs for service requests
    const activityLogs: ActivityLogItem[] = [];
    
    serviceRequests.forEach((req, idx) => {
        // Created event
        activityLogs.push({
            id: `AL-${req.id}-1`,
            type: ActivityLogType.Created,
            title: 'Service Request Created',
            timestamp: req.requestDate,
            description: `Request submitted by tenant`,
            userId: req.tenantId,
            userName: tenants.find(t => t.id === req.tenantId)?.name || 'Tenant',
            relatedEntityId: req.id,
            relatedEntityType: 'ServiceRequest',
        });
        
        // Add viewed event for older requests
        if (idx < 15) {
            const viewDate = new Date(req.requestDate);
            viewDate.setHours(viewDate.getHours() + 2);
            activityLogs.push({
                id: `AL-${req.id}-2`,
                type: ActivityLogType.Viewed,
                title: 'Viewed by Landlord',
                timestamp: viewDate.toISOString().split('T')[0],
                description: 'Landlord reviewed the request',
                userId: 'U-1',
                userName: 'Monir Rahman',
                relatedEntityId: req.id,
                relatedEntityType: 'ServiceRequest',
            });
        }
        
        // Add contractor assigned for in-progress requests
        if (req.status === RequestStatus.InProgress && req.assignedContact) {
            const assignDate = new Date(req.requestDate);
            assignDate.setDate(assignDate.getDate() + 1);
            activityLogs.push({
                id: `AL-${req.id}-3`,
                type: ActivityLogType.ContractorAssigned,
                title: 'Contractor Assigned',
                timestamp: assignDate.toISOString().split('T')[0],
                description: `${req.assignedContact.name} assigned to handle this request`,
                userId: 'U-1',
                userName: 'Monir Rahman',
                relatedEntityId: req.id,
                relatedEntityType: 'ServiceRequest',
            });
        }
        
        // Add completed event for completed requests
        if (req.status === RequestStatus.Complete && req.completionDate) {
            activityLogs.push({
                id: `AL-${req.id}-4`,
                type: ActivityLogType.Completed,
                title: 'Service Request Completed',
                timestamp: req.completionDate,
                description: 'Work completed and verified',
                userId: req.assignedContact?.name || 'Contractor',
                userName: req.assignedContact?.name || 'Contractor',
                relatedEntityId: req.id,
                relatedEntityType: 'ServiceRequest',
            });
        }
    });

    // ============ Property Listings ============
    const propertyListings: PropertyListing[] = [
        {
            id: 'PL-1',
            title: 'Spacious 2BR Apartment in Lalmatia',
            address: '123 Main Road, Lalmatia, Dhaka',
            price: 28000,
            beds: 2,
            baths: 2,
            sqft: 1200,
            status: 'active',
            isPublic: true,
            images: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            ],
            description: 'Beautiful apartment with modern amenities, great location, close to schools and markets.',
            amenities: ['Parking', 'Security', 'Elevator', 'Backup Generator'],
            availableFrom: '2025-11-01',
            lastUpdated: '2025-10-16',
            propertyType: 'Apartment',
            yearBuilt: 2015,
            deposit: 2, // 2 months rent
            leaseTerm: '1 year',
            petsAllowed: true,
            parkingSpots: 1,
            location: {
                lat: 23.7606,
                lng: 90.3769,
                neighborhood: 'Lalmatia',
                city: 'Dhaka',
                state: 'Dhaka',
                zipCode: '1207'
            },
            contactInfo: {
                name: 'Monir Rahman',
                phone: '+880-1711-123456',
                email: 'monir@ashaproperties.com',
            },
            createdBy: 'U-1',
            createdAt: '2025-10-15',
            updatedAt: '2025-10-16',
            unitNumber: '2A',
        },
    ];

    // Return the complete interconnected dataset
    return { 
        users, 
        propertyGroups,
        buildings, 
        units, 
        tenants, 
        documents, 
        serviceRequests, 
        rentalApplications,
        contractors,
        activityLogs,
        propertyListings,
    };
};

/**
 * Pre-generated initial data for the application
 * This is exported and used as the starting state in App.tsx
 */
export const INITIAL_APP_DATA = generateInitialData();
