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

// RENTAL APPLICATION ROUTES
// Get all rental applications
router.get('/rental-applications', authenticateToken, async (req, res) => {
    try {
        const applications = await RentalApplication.find({ userID: req.user.userId })
            .populate('userID', 'firstName lastName email')
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

export default router;