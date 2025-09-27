import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../_utils/db.js';
import { corsHeaders } from '../_utils/auth.js';

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

export default async function handler(req, res) {
  // Set CORS headers
  res.set(corsHeaders());
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectToDatabase();

  const { method } = req;
  const urlParts = req.url.split('/').filter(part => part && part !== 'api');
  const resource = urlParts[0];
  const id = urlParts[1];
  const subResource = urlParts[2];

  try {
    // Properties routes
    if (resource === 'properties') {
      if (method === 'GET' && !id) {
        return await getProperties(req, res);
      } else if (method === 'POST' && !id) {
        return await createProperty(req, res);
      } else if (method === 'GET' && id && !subResource) {
        return await getProperty(req, res, id);
      } else if (method === 'PUT' && id && !subResource) {
        return await updateProperty(req, res, id);
      } else if (method === 'DELETE' && id && !subResource) {
        return await deleteProperty(req, res, id);
      } else if (method === 'GET' && id && subResource === 'units') {
        return await getPropertyUnits(req, res, id);
      } else if (method === 'POST' && id && subResource === 'units') {
        return await createUnit(req, res, id);
      }
    }
    
    // Units routes
    else if (resource === 'units') {
      if (method === 'GET' && !id) {
        return await getUnits(req, res);
      } else if (method === 'PUT' && id) {
        return await updateUnit(req, res, id);
      }
    }
    
    // Service requests routes
    else if (resource === 'service-requests') {
      if (method === 'GET' && !id) {
        return await getServiceRequests(req, res);
      } else if (method === 'POST' && !id) {
        return await createServiceRequest(req, res);
      } else if (method === 'PUT' && id) {
        return await updateServiceRequest(req, res, id);
      }
    }
    
    // Rental applications routes
    else if (resource === 'rental-applications') {
      if (method === 'GET' && !id) {
        return await getRentalApplications(req, res);
      } else if (method === 'POST' && !id) {
        return await createRentalApplication(req, res);
      } else if (method === 'PUT' && id) {
        return await updateRentalApplication(req, res, id);
      }
    }
    
    else {
      return res.status(404).json({ error: 'Route not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Properties handlers
async function getProperties(req, res) {
  authenticateToken(req, res, async () => {
    try {
      const properties = await Property.find({ userID: req.user.userId })
        .populate('userID', 'firstName lastName email');
      res.json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ error: 'Error fetching properties' });
    }
  });
}

async function createProperty(req, res) {
  authenticateToken(req, res, async () => {
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
}

async function getProperty(req, res, id) {
  authenticateToken(req, res, async () => {
    try {
      const property = await Property.findOne({
        _id: id,
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
}

async function updateProperty(req, res, id) {
  authenticateToken(req, res, async () => {
    try {
      const { address, propertyType } = req.body;
      
      const updatedProperty = await Property.findOneAndUpdate(
        { _id: id, userID: req.user.userId },
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
}

async function deleteProperty(req, res, id) {
  authenticateToken(req, res, async () => {
    try {
      const deletedProperty = await Property.findOneAndDelete({
        _id: id,
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
}

async function getPropertyUnits(req, res, propertyId) {
  authenticateToken(req, res, async () => {
    try {
      // Verify property ownership
      const property = await Property.findOne({
        _id: propertyId,
        userID: req.user.userId
      });
      
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      const units = await Unit.find({ propertyID: propertyId })
        .populate('propertyID', 'address propertyType');
      
      res.json(units);
    } catch (error) {
      console.error('Error fetching property units:', error);
      res.status(500).json({ error: 'Error fetching property units' });
    }
  });
}

// Units handlers
async function getUnits(req, res) {
  authenticateToken(req, res, async () => {
    try {
      const userProperties = await Property.find({ userID: req.user.userId });
      const propertyIds = userProperties.map(p => p._id);
      
      const units = await Unit.find({ propertyID: { $in: propertyIds } })
        .populate('propertyID', 'address propertyType');
      
      res.json(units);
    } catch (error) {
      console.error('Error fetching units:', error);
      res.status(500).json({ error: 'Error fetching units' });
    }
  });
}

async function createUnit(req, res, propertyId) {
  authenticateToken(req, res, async () => {
    try {
      // Verify property ownership
      const property = await Property.findOne({
        _id: propertyId,
        userID: req.user.userId
      });
      
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      const { unitNumber, bedrooms, bathrooms, rentAmount, size, description } = req.body;
      
      const newUnit = new Unit({
        propertyID: propertyId,
        unitNumber,
        bedrooms,
        bathrooms,
        rentAmount,
        size,
        description,
        isOccupied: false
      });
      
      const savedUnit = await newUnit.save();
      await savedUnit.populate('propertyID', 'address propertyType');
      
      res.status(201).json(savedUnit);
    } catch (error) {
      console.error('Error creating unit:', error);
      res.status(500).json({ error: 'Error creating unit' });
    }
  });
}

async function updateUnit(req, res, id) {
  authenticateToken(req, res, async () => {
    try {
      const updateData = req.body;
      
      // Verify unit ownership through property
      const unit = await Unit.findById(id).populate('propertyID');
      if (!unit || unit.propertyID.userID.toString() !== req.user.userId) {
        return res.status(404).json({ error: 'Unit not found' });
      }
      
      const updatedUnit = await Unit.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('propertyID', 'address propertyType');
      
      res.json(updatedUnit);
    } catch (error) {
      console.error('Error updating unit:', error);
      res.status(500).json({ error: 'Error updating unit' });
    }
  });
}

// Service requests handlers
async function getServiceRequests(req, res) {
  authenticateToken(req, res, async () => {
    try {
      let serviceRequests;
      
      if (req.user.role === 'tenant') {
        serviceRequests = await ServiceRequest.find({ tenantID: req.user.userId })
          .populate('unitID', 'unitNumber')
          .populate({
            path: 'unitID',
            populate: {
              path: 'propertyID',
              select: 'address'
            }
          })
          .populate('contractorID', 'companyName')
          .sort({ dateCreated: -1 });
      } else if (req.user.role === 'contractor') {
        serviceRequests = await ServiceRequest.find({ contractorID: req.user.userId })
          .populate('unitID', 'unitNumber')
          .populate({
            path: 'unitID',
            populate: {
              path: 'propertyID',
              select: 'address'
            }
          })
          .populate('tenantID', 'firstName lastName')
          .sort({ dateCreated: -1 });
      } else {
        // Landlord - get service requests for their properties
        const userProperties = await Property.find({ userID: req.user.userId });
        const propertyIds = userProperties.map(p => p._id);
        const userUnits = await Unit.find({ propertyID: { $in: propertyIds } });
        const unitIds = userUnits.map(u => u._id);
        
        serviceRequests = await ServiceRequest.find({ unitID: { $in: unitIds } })
          .populate('unitID', 'unitNumber')
          .populate({
            path: 'unitID',
            populate: {
              path: 'propertyID',
              select: 'address'
            }
          })
          .populate('tenantID', 'firstName lastName')
          .populate('contractorID', 'companyName')
          .sort({ dateCreated: -1 });
      }
      
      res.json(serviceRequests);
    } catch (error) {
      console.error('Error fetching service requests:', error);
      res.status(500).json({ error: 'Error fetching service requests' });
    }
  });
}

async function createServiceRequest(req, res) {
  authenticateToken(req, res, async () => {
    try {
      const { unitID, category, priority, description, images } = req.body;
      
      const newServiceRequest = new ServiceRequest({
        tenantID: req.user.userId,
        unitID,
        category,
        priority,
        description,
        images: images || [],
        status: 'pending',
        dateCreated: new Date()
      });
      
      const savedServiceRequest = await newServiceRequest.save();
      await savedServiceRequest.populate('unitID', 'unitNumber');
      await savedServiceRequest.populate({
        path: 'unitID',
        populate: {
          path: 'propertyID',
          select: 'address'
        }
      });
      
      res.status(201).json(savedServiceRequest);
    } catch (error) {
      console.error('Error creating service request:', error);
      res.status(500).json({ error: 'Error creating service request' });
    }
  });
}

async function updateServiceRequest(req, res, id) {
  authenticateToken(req, res, async () => {
    try {
      const updateData = req.body;
      
      const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('unitID', 'unitNumber')
       .populate({
         path: 'unitID',
         populate: {
           path: 'propertyID',
           select: 'address'
         }
       })
       .populate('tenantID', 'firstName lastName')
       .populate('contractorID', 'companyName');
      
      if (!updatedServiceRequest) {
        return res.status(404).json({ error: 'Service request not found' });
      }
      
      res.json(updatedServiceRequest);
    } catch (error) {
      console.error('Error updating service request:', error);
      res.status(500).json({ error: 'Error updating service request' });
    }
  });
}

// Rental applications handlers
async function getRentalApplications(req, res) {
  authenticateToken(req, res, async () => {
    try {
      let rentalApplications;
      
      if (req.user.role === 'tenant') {
        rentalApplications = await RentalApplication.find({ applicantID: req.user.userId })
          .populate('unitID', 'unitNumber rentAmount')
          .populate({
            path: 'unitID',
            populate: {
              path: 'propertyID',
              select: 'address'
            }
          });
      } else {
        // Landlord
        const userProperties = await Property.find({ userID: req.user.userId });
        const propertyIds = userProperties.map(p => p._id);
        const userUnits = await Unit.find({ propertyID: { $in: propertyIds } });
        const unitIds = userUnits.map(u => u._id);
        
        rentalApplications = await RentalApplication.find({ unitID: { $in: unitIds } })
          .populate('applicantID', 'firstName lastName email phoneNumber')
          .populate('unitID', 'unitNumber rentAmount')
          .populate({
            path: 'unitID',
            populate: {
              path: 'propertyID',
              select: 'address'
            }
          });
      }
      
      res.json(rentalApplications);
    } catch (error) {
      console.error('Error fetching rental applications:', error);
      res.status(500).json({ error: 'Error fetching rental applications' });
    }
  });
}

async function createRentalApplication(req, res) {
  authenticateToken(req, res, async () => {
    try {
      const { 
        unitID, 
        moveInDate, 
        employmentInfo, 
        monthlyIncome, 
        creditScore,
        references,
        additionalInfo 
      } = req.body;
      
      const newRentalApplication = new RentalApplication({
        applicantID: req.user.userId,
        unitID,
        moveInDate,
        employmentInfo,
        monthlyIncome,
        creditScore,
        references,
        additionalInfo,
        status: 'pending',
        dateSubmitted: new Date()
      });
      
      const savedApplication = await newRentalApplication.save();
      await savedApplication.populate('unitID', 'unitNumber rentAmount');
      await savedApplication.populate({
        path: 'unitID',
        populate: {
          path: 'propertyID',
          select: 'address'
        }
      });
      
      res.status(201).json(savedApplication);
    } catch (error) {
      console.error('Error creating rental application:', error);
      res.status(500).json({ error: 'Error creating rental application' });
    }
  });
}

async function updateRentalApplication(req, res, id) {
  authenticateToken(req, res, async () => {
    try {
      const updateData = req.body;
      
      const updatedApplication = await RentalApplication.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('applicantID', 'firstName lastName email phoneNumber')
       .populate('unitID', 'unitNumber rentAmount')
       .populate({
         path: 'unitID',
         populate: {
           path: 'propertyID',
           select: 'address'
         }
       });
      
      if (!updatedApplication) {
        return res.status(404).json({ error: 'Rental application not found' });
      }
      
      res.json(updatedApplication);
    } catch (error) {
      console.error('Error updating rental application:', error);
      res.status(500).json({ error: 'Error updating rental application' });
    }
  });
}