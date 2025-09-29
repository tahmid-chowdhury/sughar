import express from 'express';
import jwt from 'jsonwebtoken';

// Import models
import Property from '../models/Property.js';
import Unit from '../models/Unit.js';
import RentalApplication from '../models/RentalApplication.js';
import ServiceRequest from '../models/ServiceRequest.js';
import LeaseAgreement from '../models/LeaseAgreement.js';
import Payment from '../models/Payment.js';
import Rating from '../models/Rating.js';
import Document from '../models/Document.js';
import User from '../models/User.js';
import Contractor from '../models/Contractor.js';

const router = express.Router();

// JWT secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// PROPERTY ROUTES
// Get all properties for a user
router.get('/properties', authenticateToken, async (req, res) => {
    try {
        const properties = await Property.find()
            .populate('userID', 'firstName lastName email');
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Error fetching properties' });
    }
});

// Create a new property
router.post('/properties', authenticateToken, async (req, res) => {
    try {
        const { address, propertyType } = req.body;
        
        const newProperty = new Property({
            userID: req.user.userId,
            address,
            propertyType
        });
        
        const savedProperty = await newProperty.save();
        await savedProperty.populate('userID', 'firstName lastName email');
        
        res.status(201).json(savedProperty);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Error creating property' });
    }
});

// Get specific property
router.get('/properties/:id', authenticateToken, async (req, res) => {
    try {
        const property = await Property.findOne({
            _id: req.params.id,
            userID: req.user.userId
        }).populate('userID', 'firstName lastName email');
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        
        res.json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Error fetching property' });
    }
});

// Update property
router.put('/properties/:id', authenticateToken, async (req, res) => {
    try {
        const { address, propertyType } = req.body;
        
        const updatedProperty = await Property.findOneAndUpdate(
            { _id: req.params.id, userID: req.user.userId },
            { address, propertyType },
            { new: true }
        ).populate('userID', 'firstName lastName email');
        
        if (!updatedProperty) {
            return res.status(404).json({ error: 'Property not found' });
        }
        
        res.json(updatedProperty);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Error updating property' });
    }
});

// Delete property
router.delete('/properties/:id', authenticateToken, async (req, res) => {
    try {
        const deletedProperty = await Property.findOneAndDelete({
            _id: req.params.id,
            userID: req.user.userId
        });
        
        if (!deletedProperty) {
            return res.status(404).json({ error: 'Property not found' });
        }
        
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Error deleting property' });
    }
});

// UNIT ROUTES
// Get all units for a property
router.get('/properties/:propertyId/units', authenticateToken, async (req, res) => {
    try {
        // Verify the property belongs to the user
        const property = await Property.findOne({
            _id: req.params.propertyId,
            userID: req.user.userId
        });
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        
        const units = await Unit.find({ propertyID: req.params.propertyId })
            .populate('propertyID', 'address propertyType');
        
        res.json(units);
    } catch (error) {
        console.error('Error fetching units:', error);
        res.status(500).json({ error: 'Error fetching units' });
    }
});

// Get all units (for dashboard purposes)
router.get('/units', authenticateToken, async (req, res) => {
    try {
        const units = await Unit.find()
            .populate('propertyID', 'address propertyType userID');
        res.json(units);
    } catch (error) {
        console.error('Error fetching all units:', error);
        res.status(500).json({ error: 'Error fetching units' });
    }
});

// Create a new unit
router.post('/properties/:propertyId/units', authenticateToken, async (req, res) => {
    try {
        // Verify the property belongs to the user
        const property = await Property.findOne({
            _id: req.params.propertyId,
            userID: req.user.userId
        });
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        
        const { unitNumber, squareFootage, bedrooms, bathrooms, monthlyRent, status } = req.body;
        
        const newUnit = new Unit({
            propertyID: req.params.propertyId,
            unitNumber,
            squareFootage,
            bedrooms,
            bathrooms,
            monthlyRent,
            status
        });
        
        const savedUnit = await newUnit.save();
        await savedUnit.populate('propertyID', 'address propertyType');
        
        res.status(201).json(savedUnit);
    } catch (error) {
        console.error('Error creating unit:', error);
        res.status(500).json({ error: 'Error creating unit' });
    }
});

// Update unit
router.put('/units/:id', authenticateToken, async (req, res) => {
    try {
        const unit = await Unit.findById(req.params.id).populate('propertyID');
        if (!unit) {
            return res.status(404).json({ error: 'Unit not found' });
        }
        
        // Verify the property belongs to the user
        if (unit.propertyID.userID.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const { unitNumber, squareFootage, bedrooms, bathrooms, monthlyRent, status } = req.body;
        
        const updatedUnit = await Unit.findByIdAndUpdate(
            req.params.id,
            { unitNumber, squareFootage, bedrooms, bathrooms, monthlyRent, status },
            { new: true }
        ).populate('propertyID', 'address propertyType');
        
        res.json(updatedUnit);
    } catch (error) {
        console.error('Error updating unit:', error);
        res.status(500).json({ error: 'Error updating unit' });
    }
});

// SERVICE REQUEST ROUTES
// Get all service requests for a user
router.get('/service-requests', authenticateToken, async (req, res) => {
    try {
        // Get all service requests where the user is either:
        // 1. The requester (tenant)
        // 2. The landlord of the property where the request was made
        
        // First, get all properties owned by this user
        const userProperties = await Property.find({ userID: req.user.userId });
        const propertyIds = userProperties.map(p => p._id);
        
        // Get units for these properties
        const userUnits = await Unit.find({ propertyID: { $in: propertyIds } });
        const unitIds = userUnits.map(u => u._id);
        
        // Find service requests where:
        // - User is the requester OR
        // - The unit belongs to the user's properties
        const serviceRequests = await ServiceRequest.find({
            $or: [
                { userID: req.user.userId },
                { unitID: { $in: unitIds } }
            ]
        })
            .populate('userID', 'firstName lastName email')
            .populate('unitID', 'unitNumber propertyID')
            .populate('assignedContractorID', 'firstName lastName email')
            .populate({
                path: 'unitID',
                populate: {
                    path: 'propertyID',
                    select: 'address propertyType'
                }
            });
        
        res.json(serviceRequests);
    } catch (error) {
        console.error('Error fetching service requests:', error);
        res.status(500).json({ error: 'Error fetching service requests' });
    }
});

// Create a new service request
router.post('/service-requests', authenticateToken, async (req, res) => {
    try {
        const { unitID, description, priority } = req.body;
        
        const newServiceRequest = new ServiceRequest({
            userID: req.user.userId,
            unitID,
            description,
            priority
        });
        
        const savedServiceRequest = await newServiceRequest.save();
        await savedServiceRequest.populate([
            { path: 'userID', select: 'firstName lastName email' },
            { path: 'unitID', select: 'unitNumber propertyID' },
            { path: 'assignedContractorID', select: 'firstName lastName email' }
        ]);
        
        res.status(201).json(savedServiceRequest);
    } catch (error) {
        console.error('Error creating service request:', error);
        res.status(500).json({ error: 'Error creating service request' });
    }
});

// Update service request status
router.put('/service-requests/:id', authenticateToken, async (req, res) => {
    try {
        const { status, assignedContractorID } = req.body;
        
        const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(
            req.params.id,
            { status, assignedContractorID },
            { new: true }
        ).populate([
            { path: 'userID', select: 'firstName lastName email' },
            { path: 'unitID', select: 'unitNumber propertyID' },
            { path: 'assignedContractorID', select: 'firstName lastName email' }
        ]);
        
        if (!updatedServiceRequest) {
            return res.status(404).json({ error: 'Service request not found' });
        }
        
        res.json(updatedServiceRequest);
    } catch (error) {
        console.error('Error updating service request:', error);
        res.status(500).json({ error: 'Error updating service request' });
    }
});

// TENANTS ROUTES
// Get all tenants (users with role 'tenant')
router.get('/tenants', authenticateToken, async (req, res) => {
    try {
        const tenants = await User.find({ role: 'tenant' })
            .select('firstName lastName email phoneNumber createdAt')
            .sort({ lastName: 1, firstName: 1 });
        
        // Transform to include additional info
        const tenantsWithInfo = tenants.map(tenant => ({
            id: tenant._id,
            name: `${tenant.firstName} ${tenant.lastName}`,
            email: tenant.email,
            phoneNumber: tenant.phoneNumber,
            joinDate: tenant.createdAt,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(tenant.firstName + ' ' + tenant.lastName)}&background=random`
        }));
        
        res.json(tenantsWithInfo);
    } catch (error) {
        console.error('Error fetching tenants:', error);
        res.status(500).json({ error: 'Error fetching tenants' });
    }
});

// RENTAL APPLICATION ROUTES
// Get all rental applications for landlord's properties
router.get('/rental-applications', authenticateToken, async (req, res) => {
    try {
        // First get the landlord's properties
        const properties = await Property.find({ userID: req.user.userId });
        if (properties.length === 0) {
            return res.json([]);
        }
        
        const propertyIds = properties.map(prop => prop._id);
        
        // Get units for these properties
        const units = await Unit.find({ propertyID: { $in: propertyIds } });
        if (units.length === 0) {
            return res.json([]);
        }
        
        const unitIds = units.map(unit => unit._id);
        
        // Find applications for these units
        const applications = await RentalApplication.find({ unitID: { $in: unitIds } })
            .populate('userID', 'firstName lastName email phoneNumber')
            .populate('unitID', 'unitNumber monthlyRent propertyID')
            .populate({
                path: 'unitID',
                populate: {
                    path: 'propertyID',
                    select: 'address propertyType'
                }
            });
        
        res.json(applications);
    } catch (error) {
        console.error('Error fetching rental applications:', error);
        res.status(500).json({ error: 'Error fetching rental applications' });
    }
});

// Create a new rental application
router.post('/rental-applications', authenticateToken, async (req, res) => {
    try {
        const { unitID, monthlyIncome, employmentStatus, references, notes } = req.body;
        
        const newApplication = new RentalApplication({
            userID: req.user.userId,
            unitID,
            monthlyIncome,
            employmentStatus,
            references,
            notes
        });
        
        const savedApplication = await newApplication.save();
        await savedApplication.populate([
            { path: 'userID', select: 'firstName lastName email' },
            { path: 'unitID', select: 'unitNumber monthlyRent propertyID' }
        ]);
        
        res.status(201).json(savedApplication);
    } catch (error) {
        console.error('Error creating rental application:', error);
        res.status(500).json({ error: 'Error creating rental application' });
    }
});

// Update rental application status
router.put('/rental-applications/:id', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        
        const updatedApplication = await RentalApplication.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate([
            { path: 'userID', select: 'firstName lastName email' },
            { path: 'unitID', select: 'unitNumber monthlyRent propertyID' }
        ]);
        
        if (!updatedApplication) {
            return res.status(404).json({ error: 'Rental application not found' });
        }
        
        res.json(updatedApplication);
    } catch (error) {
        console.error('Error updating rental application:', error);
        res.status(500).json({ error: 'Error updating rental application' });
    }
});

// LEASE AGREEMENT ROUTES
// Get all lease agreements
router.get('/lease-agreements', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching lease agreements for user:', req.user.userId);
        
        // First, get all lease agreements with basic population
        let leases;
        try {
            leases = await LeaseAgreement.find()
                .populate('userID', 'firstName lastName email phoneNumber')
                .populate('unitID', 'unitNumber monthlyRent propertyID');
            console.log('Found leases with basic population:', leases.length);
        } catch (populateError) {
            console.error('Error with basic population:', populateError);
            // Fallback: get without population
            leases = await LeaseAgreement.find();
            console.log('Fallback: Found raw leases:', leases.length);
        }
        
        // If we have leases, try to populate properties
        const leasesWithProperties = [];
        for (const lease of leases) {
            let enhancedLease = lease.toObject ? lease.toObject() : lease;
            
            // Try to get property info if unitID exists and is populated
            if (lease.unitID && lease.unitID.propertyID) {
                try {
                    const property = await Property.findById(lease.unitID.propertyID);
                    if (property) {
                        enhancedLease.unitID.propertyID = property;
                    }
                } catch (propError) {
                    console.warn('Could not populate property for unit:', lease.unitID._id);
                }
            }
            
            leasesWithProperties.push(enhancedLease);
        }
        
        // Filter leases for properties owned by the authenticated user
        // Also filter out leases with missing references
        const userLeases = leasesWithProperties.filter(lease => {
            if (!lease.unitID) {
                console.warn('Lease missing unitID:', lease._id);
                return false;
            }
            if (!lease.unitID.propertyID) {
                console.warn('Unit missing propertyID:', lease.unitID._id || lease.unitID);
                return false;
            }
            if (!lease.unitID.propertyID.userID) {
                console.warn('Property missing userID:', lease.unitID.propertyID._id || lease.unitID.propertyID);
                return false;
            }
            return lease.unitID.propertyID.userID.toString() === req.user.userId;
        });
        
        console.log('Filtered user leases:', userLeases.length);
        res.json(userLeases);
    } catch (error) {
        console.error('Error fetching lease agreements:', error);
        res.status(500).json({ 
            error: 'Error fetching lease agreements',
            details: error.message 
        });
    }
});

// DEBUG ENDPOINT - Remove in production
router.get('/debug/lease-agreements', authenticateToken, async (req, res) => {
    try {
        console.log('DEBUG: Starting lease agreements debug check');
        console.log('DEBUG: User ID:', req.user.userId);
        
        // Check collections exist and have data
        const leaseCount = await LeaseAgreement.countDocuments();
        const unitCount = await Unit.countDocuments();
        const propertyCount = await Property.countDocuments();
        const userCount = await User.countDocuments();
        
        console.log('DEBUG: Collection counts:', {
            leases: leaseCount,
            units: unitCount,
            properties: propertyCount,
            users: userCount
        });
        
        // Get all leases without population first
        const rawLeases = await LeaseAgreement.find();
        console.log('DEBUG: Raw leases found:', rawLeases.length);
        console.log('DEBUG: First raw lease:', rawLeases[0]);
        
        // Try population step by step
        try {
            const leasesWithUsers = await LeaseAgreement.find().populate('userID', 'firstName lastName email phoneNumber');
            console.log('DEBUG: Leases with users populated:', leasesWithUsers.length);
        } catch (err) {
            console.log('DEBUG: Error populating users:', err.message);
        }
        
        try {
            const leasesWithUnits = await LeaseAgreement.find().populate('unitID', 'unitNumber monthlyRent propertyID');
            console.log('DEBUG: Leases with units populated:', leasesWithUnits.length);
        } catch (err) {
            console.log('DEBUG: Error populating units:', err.message);
        }
        
        res.json({
            message: 'Debug info logged to console',
            counts: { leases: leaseCount, units: unitCount, properties: propertyCount, users: userCount },
            userId: req.user.userId
        });
        
    } catch (error) {
        console.error('DEBUG: Error in debug endpoint:', error);
        res.status(500).json({ error: error.message });
    }
});

// PAYMENT ROUTES
// Get all payments
router.get('/payments', authenticateToken, async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('userID', 'firstName lastName email')
            .populate({
                path: 'leaseID',
                populate: {
                    path: 'unitID',
                    select: 'unitNumber propertyID',
                    populate: {
                        path: 'propertyID',
                        select: 'address userID'
                    }
                }
            });
            
        // Filter payments for properties owned by the authenticated user
        const userPayments = payments.filter(payment => 
            payment.leaseID?.unitID?.propertyID?.userID?.toString() === req.user.userId
        );
            
        res.json(userPayments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Error fetching payments' });
    }
});

// DASHBOARD STATS ROUTE
// Get comprehensive dashboard statistics
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Get user's properties - check both userID and landlord fields
        const properties = await Property.find({
            $or: [
                { userID: userId },
                { landlord: userId }
            ]
        });
        const propertyIds = properties.map(p => p._id);
        
        // Get units for user's properties - check both propertyID and property fields
        const units = await Unit.find({
            $or: [
                { propertyID: { $in: propertyIds } },
                { property: { $in: propertyIds } }
            ]
        }).populate([
            { path: 'propertyID', select: 'name address' },
            { path: 'property', select: 'name address' }
        ]);
        
        // Get service requests for user's properties
        const serviceRequests = await ServiceRequest.find()
            .populate({
                path: 'unitID',
                match: { 
                    $or: [
                        { propertyID: { $in: propertyIds } },
                        { property: { $in: propertyIds } }
                    ]
                },
                populate: [
                    { path: 'propertyID', select: 'name address' },
                    { path: 'property', select: 'name address' }
                ]
            })
            .populate('userID', 'firstName lastName');
        
        // Filter out service requests with null unitID (means unit doesn't belong to user)
        const userServiceRequests = serviceRequests.filter(sr => sr.unitID != null);
        
        // Get rental applications for user's properties
        const applications = await RentalApplication.find()
            .populate({
                path: 'unitID',
                match: { 
                    $or: [
                        { propertyID: { $in: propertyIds } },
                        { property: { $in: propertyIds } }
                    ]
                },
                populate: [
                    { path: 'propertyID', select: 'name address' },
                    { path: 'property', select: 'name address' }
                ]
            })
            .populate('userID', 'firstName lastName');
        
        // Filter applications for user's properties
        const userApplications = applications.filter(app => app.unitID != null);
        
        // Get lease agreements for user's properties
        const leases = await LeaseAgreement.find()
            .populate({
                path: 'unitID',
                match: { 
                    $or: [
                        { propertyID: { $in: propertyIds } },
                        { property: { $in: propertyIds } }
                    ]
                },
                populate: [
                    { path: 'propertyID', select: 'name address' },
                    { path: 'property', select: 'name address' }
                ]
            })
            .populate('userID', 'firstName lastName');
        
        const userLeases = leases.filter(lease => lease.unitID != null);
        
        // Calculate statistics
        const totalProperties = properties.length;
        const totalUnits = units.length;
        
        // Handle both status formats: 'occupied'/'vacant' and isOccupied boolean
        const occupiedUnits = units.filter(unit => {
            if (unit.status) {
                return unit.status === 'occupied';
            } else if (unit.isOccupied !== undefined) {
                return unit.isOccupied === true;
            }
            return false;
        }).length;
        
        const vacantUnits = totalUnits - occupiedUnits;
        const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
        
        // Service request stats
        const activeServiceRequests = userServiceRequests.filter(sr => sr.status === 'new' || sr.status === 'in progress').length;
        const completedServiceRequests = userServiceRequests.filter(sr => sr.status === 'completed').length;
        
        // Application stats
        const pendingApplications = userApplications.filter(app => app.status === 'pending').length;
        
        // Lease stats - leases ending soon (next 30 days)
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        const leasesEndingSoon = userLeases.filter(lease => {
            const endDate = new Date(lease.endDate);
            return endDate >= today && endDate <= thirtyDaysFromNow;
        });
        
        // Leases ending today
        const leasesEndingToday = userLeases.filter(lease => {
            const endDate = new Date(lease.endDate);
            const todayStr = today.toDateString();
            return endDate.toDateString() === todayStr;
        });
        
        // Calculate total revenue - handle both status formats
        const totalRevenue = units
            .filter(unit => {
                if (unit.status) {
                    return unit.status === 'occupied';
                } else if (unit.isOccupied !== undefined) {
                    return unit.isOccupied === true;
                }
                return false;
            })
            .reduce((sum, unit) => {
                const rent = unit.monthlyRent;
                // Handle Decimal128 type
                const rentValue = rent && typeof rent === 'object' && rent.$numberDecimal 
                    ? parseFloat(rent.$numberDecimal) 
                    : (rent || 0);
                return sum + rentValue;
            }, 0);
        
        // Prepare response
        const stats = {
            properties: {
                total: totalProperties,
                addresses: properties.map(p => p.name || p.address || 'Unknown Property')
            },
            units: {
                total: totalUnits,
                occupied: occupiedUnits,
                vacant: vacantUnits,
                occupancyRate: occupancyRate,
                totalRevenue: totalRevenue,
                details: units.map(unit => {
                    // Get property reference from either field
                    const propertyRef = unit.propertyID || unit.property;
                    const propertyName = propertyRef?.name || propertyRef?.address || 'Unknown Property';
                    
                    // Get status from either field
                    let unitStatus = 'vacant';
                    if (unit.status) {
                        unitStatus = unit.status;
                    } else if (unit.isOccupied !== undefined) {
                        unitStatus = unit.isOccupied ? 'occupied' : 'vacant';
                    }
                    
                    // Handle monthlyRent (might be Decimal128)
                    const rent = unit.monthlyRent;
                    const rentValue = rent && typeof rent === 'object' && rent.$numberDecimal 
                        ? parseFloat(rent.$numberDecimal) 
                        : (rent || 0);
                    
                    return {
                        _id: unit._id,
                        unitNumber: unit.unitNumber,
                        status: unitStatus,
                        monthlyRent: rentValue,
                        property: propertyName
                    };
                })
            },
            serviceRequests: {
                total: userServiceRequests.length,
                active: activeServiceRequests,
                completed: completedServiceRequests,
                completedToday: userServiceRequests.filter(sr => {
                    if (sr.status !== 'completed') return false;
                    const updatedDate = new Date(sr.updatedAt || sr.createdAt);
                    return updatedDate.toDateString() === today.toDateString();
                }).length,
                recent: userServiceRequests.slice(0, 5).map(sr => {
                    // Handle both property field formats
                    const unitPropertyRef = sr.unitID?.propertyID || sr.unitID?.property;
                    const propertyName = unitPropertyRef?.name || unitPropertyRef?.address || 'Unknown Property';
                    
                    return {
                        _id: sr._id,
                        description: sr.description,
                        status: sr.status,
                        tenant: sr.userID ? `${sr.userID.firstName} ${sr.userID.lastName}` : 'Unknown',
                        unit: sr.unitID?.unitNumber,
                        property: propertyName,
                        requestDate: sr.requestDate
                    };
                })
            },
            applications: {
                total: userApplications.length,
                pending: pendingApplications,
                approved: userApplications.filter(app => app.status === 'approved').length,
                rejected: userApplications.filter(app => app.status === 'rejected').length
            },
            leases: {
                total: userLeases.length,
                endingSoon: leasesEndingSoon.length,
                endingToday: leasesEndingToday.length,
                endingSoonDetails: leasesEndingSoon.map(lease => {
                    // Handle both property field formats
                    const unitPropertyRef = lease.unitID.propertyID || lease.unitID.property;
                    const propertyName = unitPropertyRef?.name || unitPropertyRef?.address || 'Unknown Property';
                    
                    return {
                        _id: lease._id,
                        tenant: `${lease.userID.firstName} ${lease.userID.lastName}`,
                        unit: lease.unitID.unitNumber,
                        property: propertyName,
                        endDate: lease.endDate
                    };
                }),
                endingTodayDetails: leasesEndingToday.map(lease => {
                    // Handle both property field formats
                    const unitPropertyRef = lease.unitID.propertyID || lease.unitID.property;
                    const propertyName = unitPropertyRef?.name || unitPropertyRef?.address || 'Unknown Property';
                    
                    return {
                        _id: lease._id,
                        tenant: `${lease.userID.firstName} ${lease.userID.lastName}`,
                        unit: lease.unitID.unitNumber,
                        property: propertyName,
                        endDate: lease.endDate
                    };
                })
            }
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
});

// Get financial dashboard stats
router.get('/dashboard/financial-stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        console.log('Financial stats endpoint called by user:', userId);
        
        // Get user's properties
        const properties = await Property.find({ userID: userId });
        console.log('Found properties:', properties.length);
        
        // If no properties found, return zero values
        if (properties.length === 0) {
            console.log('No properties found for user, returning zero values');
            const financialStats = {
                revenueThisMonth: 0,
                incomingRent: 0,
                overdueRent: 0,
                serviceCosts: 0,
                utilitiesCosts: 0
            };
            
            console.log('Calculated financial stats (no data):', financialStats);
            return res.json(financialStats);
        }
        
        const propertyIds = properties.map(p => p._id);
        
        // Get units for user's properties
        const units = await Unit.find({ propertyID: { $in: propertyIds } });
        console.log('Found units:', units.length);
        const unitIds = units.map(u => u._id);
        
        // Get lease agreements for user's units
        const leases = await LeaseAgreement.find({ unitID: { $in: unitIds } })
            .populate('unitID', 'monthlyRent');
        console.log('Found leases:', leases.length);
        
        // Get current month's date range
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        console.log('Date range:', startOfMonth, 'to', endOfMonth);
        
        // Get payments for this month
        const thisMonthPayments = await Payment.find({
            leaseID: { $in: leases.map(l => l._id) },
            paymentDate: { $gte: startOfMonth, $lte: endOfMonth },
            status: 'completed'
        });
        console.log('Found payments this month:', thisMonthPayments.length);
        
        // Calculate revenue this month
        const revenueThisMonth = thisMonthPayments.reduce((sum, payment) => {
            return sum + parseFloat(payment.amount.toString());
        }, 0);
        
        // Calculate incoming rent (expected monthly rent from all occupied units)
        const occupiedUnits = units.filter(unit => unit.status === 'occupied');
        console.log('Occupied units:', occupiedUnits.length);
        const incomingRent = occupiedUnits.reduce((sum, unit) => {
            return sum + parseFloat(unit.monthlyRent.toString());
        }, 0);
        
        // Calculate overdue rent
        // Get all payments made for current active leases
        const currentDate = new Date();
        const activeLeases = leases.filter(lease => 
            new Date(lease.startDate) <= currentDate && new Date(lease.endDate) >= currentDate
        );
        console.log('Active leases:', activeLeases.length);
        
        // Calculate expected rent vs actual payments for overdue calculation
        let overdueRent = 0;
        for (const lease of activeLeases) {
            const leaseStartDate = new Date(lease.startDate);
            const monthsSinceStart = Math.floor((currentDate - leaseStartDate) / (1000 * 60 * 60 * 24 * 30)) + 1;
            const expectedTotalPayments = monthsSinceStart * parseFloat(lease.unitID.monthlyRent.toString());
            
            // Get all completed payments for this lease
            const leasePayments = await Payment.find({
                leaseID: lease._id,
                status: 'completed'
            });
            
            const totalPaid = leasePayments.reduce((sum, payment) => {
                return sum + parseFloat(payment.amount.toString());
            }, 0);
            
            const overdue = expectedTotalPayments - totalPaid;
            if (overdue > 0) {
                overdueRent += overdue;
            }
        }
        
        // Get service requests for cost calculation
        const serviceRequests = await ServiceRequest.find({
            unitID: { $in: unitIds },
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });
        console.log('Service requests this month:', serviceRequests.length);
        
        // Estimate service costs (this could be enhanced with actual cost data)
        const serviceCosts = serviceRequests.length * 500; // Average $500 per service request
        
        // Calculate utilities/misc expenses (mock calculation)
        const utilitiesCosts = occupiedUnits.length * 200; // Average $200 per occupied unit
        
        const financialStats = {
            revenueThisMonth: revenueThisMonth,
            incomingRent: incomingRent,
            overdueRent: overdueRent,
            serviceCosts: serviceCosts,
            utilitiesCosts: utilitiesCosts
        };
        
        console.log('Calculated financial stats:', financialStats);
        res.json(financialStats);
    } catch (error) {
        console.error('Error fetching financial stats:', error);
        res.status(500).json({ 
            error: 'Error fetching financial stats', 
            details: error.message 
        });
    }
});

// CURRENT TENANTS ROUTES
// Get current tenants with lease and payment information
router.get('/current-tenants', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching current tenants for user:', req.user.userId);
        
        // Get user's properties
        const properties = await Property.find({ userID: req.user.userId });
        console.log('Found properties:', properties.length);
        
        if (properties.length === 0) {
            console.log('No properties found for user, returning empty array');
            return res.json([]);
        }
        
        const propertyIds = properties.map(prop => prop._id);
        
        // Get units for these properties
        const units = await Unit.find({ propertyID: { $in: propertyIds } });
        console.log('Found units:', units.length);
        
        if (units.length === 0) {
            console.log('No units found for properties, returning empty array');
            return res.json([]);
        }
        
        const unitIds = units.map(unit => unit._id);
        
        // Get active lease agreements for these units
        const currentDate = new Date();
        const leases = await LeaseAgreement.find({
            unitID: { $in: unitIds },
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        })
        .populate('userID', 'firstName lastName email phoneNumber')
        .populate({
            path: 'unitID',
            select: 'unitNumber monthlyRent propertyID',
            populate: {
                path: 'propertyID',
                select: 'address userID'
            }
        });
        
        console.log('Found active leases:', leases.length);
        
        if (leases.length === 0) {
            console.log('No active leases found, returning empty array');
            return res.json([]);
        }
        
        // Get recent payments for rent status calculation
        const payments = await Payment.find({
            leaseID: { $in: leases.map(lease => lease._id) }
        }).sort({ paymentDate: -1 });
        
        console.log('Found payments:', payments.length);
        
        // Get service requests counts for each user
        const serviceRequests = await ServiceRequest.find({
            unitID: { $in: unitIds }
        }).populate('userID', '_id');
        
        console.log('Found service requests:', serviceRequests.length);
        
        // Get ratings for tenants (if available)
        const ratings = await Rating.find({
            userID: { $in: leases.map(lease => lease.userID?._id).filter(id => id) }
        });
        
        console.log('Found ratings:', ratings.length);
        
        // Transform data to match frontend CurrentTenant interface
        const currentTenants = leases
            .filter(lease => {
                // Filter out leases with missing required data
                if (!lease.userID) {
                    console.warn('Lease missing tenant (userID):', lease._id);
                    return false;
                }
                if (!lease.unitID) {
                    console.warn('Lease missing unit (unitID):', lease._id);
                    return false;
                }
                if (!lease.unitID.propertyID) {
                    console.warn('Unit missing property (propertyID):', lease.unitID._id);
                    return false;
                }
                return true;
            })
            .map(lease => {
                const tenant = lease.userID;
                const unit = lease.unitID;
                const property = unit.propertyID;
            
            // Calculate lease progress (percentage of lease term completed)
            const leaseStart = new Date(lease.startDate);
            const leaseEnd = new Date(lease.endDate);
            const today = new Date();
            const totalDays = (leaseEnd - leaseStart) / (1000 * 60 * 60 * 24);
            const daysPassed = (today - leaseStart) / (1000 * 60 * 60 * 24);
            const progressPercentage = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
            
            // Determine rent status based on recent payments
            const tenantPayments = payments.filter(payment => 
                payment.leaseID.toString() === lease._id.toString()
            );
            
            let rentStatus = 'Pending';
            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);
            
            const thisMonthPayment = tenantPayments.find(payment => 
                payment.paymentDate >= thisMonth && payment.status === 'completed'
            );
            
            if (thisMonthPayment) {
                rentStatus = 'Paid';
            } else {
                // Check if payment is overdue (after 5th of the month)
                const fifthOfMonth = new Date();
                fifthOfMonth.setDate(5);
                if (currentDate > fifthOfMonth) {
                    rentStatus = 'Overdue';
                }
            }
            
            // Count service requests for this tenant
            const tenantServiceRequests = serviceRequests.filter(sr => 
                sr.userID && sr.userID._id.toString() === tenant._id.toString()
            ).length;
            
            // Get tenant rating
            const tenantRating = ratings.find(rating => 
                rating.userID.toString() === tenant._id.toString()
            );
            const rating = tenantRating ? tenantRating.rating : 4.0;
            
            // Generate avatar (placeholder for now)
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(tenant.firstName + ' ' + tenant.lastName)}&background=random`;
            
            return {
                id: tenant._id.toString(),
                name: `${tenant.firstName} ${tenant.lastName}`,
                avatar: avatarUrl,
                rating: rating,
                building: property.address.split(',')[0] || `Building ${unit.unitNumber}`,
                unit: parseInt(unit.unitNumber) || 1,
                leaseProgress: {
                    value: Math.round(progressPercentage),
                    variant: progressPercentage > 50 ? 'dark' : 'light'
                },
                rentStatus: rentStatus,
                requests: tenantServiceRequests
            };
        });
        
        res.json(currentTenants);
    } catch (error) {
        console.error('Error fetching current tenants:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Error fetching current tenants', 
            details: error.message 
        });
    }
});

export default router;