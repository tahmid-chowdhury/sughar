import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { connectToDatabase } from './_utils/db.js';

// Import models from local directory
import User from './models/User.js';
import Property from './models/Property.js';
import Unit from './models/Unit.js';
import ServiceRequest from './models/ServiceRequest.js';
import LeaseAgreement from './models/LeaseAgreement.js';
import RentalApplication from './models/RentalApplication.js';
import Payment from './models/Payment.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
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

// MongoDB connection for records
const uri = process.env.ATLAS_URI;
let cachedDb = null;

async function connectToMongoDB() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db();
  cachedDb = db;
  return db;
}

export default async function handler(req, res) {
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  // Set headers properly for Vercel
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method } = req;
  const urlParts = req.url.split('/').filter(part => part && part !== 'api');
  const resource = urlParts[0];

  console.log('Request details:', {
    url: req.url,
    method: method,
    urlParts: urlParts,
    resource: resource
  });

  try {
    // Route to appropriate handler
    console.log('Routing to:', resource);
    
    if (resource === 'auth') {
      await connectToDatabase();
      return await handleAuth(req, res, urlParts);
    } else if (resource === 'record') {
      const db = await connectToMongoDB();
      return await handleRecord(req, res, urlParts, db);
    } else if (resource && (resource === 'properties' || resource === 'units' || resource === 'service-requests' || resource === 'rental-applications' || resource === 'lease-agreements' || resource === 'payments' || resource === 'dashboard')) {
      await connectToDatabase();
      return await handleAPI(req, res, urlParts);
    } else {
      console.log('No route found for resource:', resource);
      return res.status(404).json({ 
        error: 'Route not found', 
        debug: {
          url: req.url,
          resource: resource,
          urlParts: urlParts
        }
      });
    }
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      resource: resource,
      env: {
        hasAtlasUri: !!process.env.ATLAS_URI,
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    });
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Auth handlers
async function handleAuth(req, res, urlParts) {
  const endpoint = urlParts[1];
  const { method } = req;

  console.log('Auth handler:', {
    endpoint: endpoint,
    method: method,
    urlParts: urlParts,
    fullUrl: req.url
  });

  if (method === 'GET' && endpoint === 'test') {
    return res.status(200).json({ 
      message: 'API is working',
      env: {
        hasAtlasUri: !!process.env.ATLAS_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        atlasUriPrefix: process.env.ATLAS_URI ? process.env.ATLAS_URI.substring(0, 20) + '...' : 'NOT SET'
      },
      timestamp: new Date().toISOString()
    });
  } else if (method === 'GET' && endpoint === 'test-db') {
    try {
      console.log('Testing database connection...');
      await connectToDatabase();
      console.log('Database connected, connection state:', mongoose.connection.readyState);
      
      // First test: Simple ping
      console.log('Testing database ping...');
      await mongoose.connection.db.admin().ping();
      console.log('Database ping successful');
      
      // Second test: List collections
      console.log('Testing collection access...');
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections found:', collections.length);
      
      // Third test: Check if users collection exists and try a simple query
      console.log('Testing User model...');
      const userExists = collections.some(col => col.name === 'users');
      console.log('Users collection exists:', userExists);
      
      let userCount = 0;
      if (userExists) {
        // Use native MongoDB driver for more reliable query
        const usersCollection = mongoose.connection.db.collection('users');
        userCount = await Promise.race([
          usersCollection.countDocuments(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('User count timeout')), 3000)
          )
        ]);
        console.log('User count retrieved:', userCount);
      }
      
      return res.status(200).json({
        message: 'Database connection working',
        connectionState: mongoose.connection.readyState,
        collections: collections.map(c => c.name),
        userCount: userCount,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Database test error:', error);
      return res.status(500).json({
        error: 'Database test failed',
        details: error.message,
        connectionState: mongoose.connection.readyState,
        step: error.message.includes('ping') ? 'ping' : 
              error.message.includes('collections') ? 'collections' :
              error.message.includes('count') ? 'count' : 'unknown'
      });
    }
  } else if (method === 'POST' && endpoint === 'register') {
    return await handleRegister(req, res);
  } else if ((method === 'POST' || method === 'GET') && endpoint === 'login') {
    if (method === 'GET') {
      return res.status(200).json({
        message: 'Login endpoint is working',
        method: 'POST',
        expectedBody: {
          email: 'user@example.com',
          password: 'yourpassword'
        },
        note: 'Send a POST request with email and password in the request body'
      });
    }
    return await handleLogin(req, res);
  } else if (method === 'GET' && endpoint === 'verify') {
    return await handleVerify(req, res);
  } else if (method === 'GET' && endpoint === 'profile') {
    return await handleProfile(req, res);
  } else {
    return res.status(404).json({ 
      error: 'Auth route not found',
      debug: {
        endpoint: endpoint,
        method: method,
        expectedEndpoints: ['test', 'test-db', 'register', 'login', 'verify', 'profile']
      }
    });
  }
}

async function handleRegister(req, res) {
  const { firstName, lastName, email, phoneNumber, role, password } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }
  
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  const newUser = new User({
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    passwordHash
  });
  
  const savedUser = await newUser.save();
  
  if (role === 'contractor') {
    const { companyName, serviceSpecialty, licenseNumber, description, website, businessAddress } = req.body;
    
    const newContractor = new Contractor({
      userID: savedUser._id,
      companyName,
      serviceSpecialty,
      licenseNumber,
      description,
      website,
      businessAddress,
      status: 'pending',
      rating: 0,
      completedJobs: 0
    });
    
    await newContractor.save();
  }
  
  const token = jwt.sign(
    { 
      userId: savedUser._id, 
      email: savedUser.email,
      role: savedUser.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  res.status(201).json({
    message: 'User created successfully',
    token,
    user: {
      id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role
    }
  });
}

async function handleLogin(req, res) {
  try {
    console.log('Login attempt started');
    console.log('Request method:', req.method);
    console.log('Raw body:', req.body);
    
    const { email, password } = req.body || {};
    
    console.log('Parsed credentials:', { email: email, hasPassword: !!password });
    
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        error: 'Email and password are required',
        received: { email: !!email, password: !!password }
      });
    }
    
    console.log('Searching for user with email:', email);
    
    // Try using native MongoDB driver first to avoid Mongoose issues
    const usersCollection = mongoose.connection.db.collection('users');
    const user = await Promise.race([
      usersCollection.findOne({ email: email }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('User lookup timeout')), 5000)
      )
    ]);
    
    console.log('User found:', !!user);
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('Comparing password...');
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('Creating JWT token...');
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    console.log('Login successful for user:', user.email);
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      body: req.body
    });
    res.status(500).json({ 
      error: 'Login failed', 
      details: error.message,
      type: error.name
    });
  }
}

async function handleProfile(req, res) {
  try {
    // Use the authentication middleware logic
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Profile request - decoded token:', decoded);
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch profile', 
      details: error.message 
    });
  }
}

async function handleVerify(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      valid: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Record handlers
async function handleRecord(req, res, urlParts, db) {
  const { method } = req;
  const id = urlParts[1];
  const collection = db.collection("records");

  if (method === 'GET' && !id) {
    const results = await collection.find({}).toArray();
    return res.status(200).json(results);
  } 
  else if (method === 'GET' && id) {
    const query = { _id: new ObjectId(id) };
    const result = await collection.findOne(query);
    
    if (!result) {
      return res.status(404).json({ error: "Record not found" });
    }
    return res.status(200).json(result);
  }
  else if (method === 'POST') {
    const newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    
    const result = await collection.insertOne(newDocument);
    return res.status(201).json(result);
  }
  else if (method === 'PATCH' && id) {
    const query = { _id: new ObjectId(id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      }
    };
    
    const result = await collection.updateOne(query, updates);
    return res.status(200).json(result);
  }
  else if (method === 'DELETE' && id) {
    const query = { _id: new ObjectId(id) };
    const result = await collection.deleteOne(query);
    return res.status(200).json(result);
  }
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Main API handlers
async function handleAPI(req, res, urlParts) {
  const { method } = req;
  const resource = urlParts[0];
  const id = urlParts[1];
  const subResource = urlParts[2];

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
  // Lease agreements routes
  else if (resource === 'lease-agreements') {
    if (method === 'GET' && !id) {
      return await getLeaseAgreements(req, res);
    }
  }
  // Payments routes
  else if (resource === 'payments') {
    if (method === 'GET' && !id) {
      return await getPayments(req, res);
    }
  }
  // Dashboard routes
  else if (resource === 'dashboard') {
    if (method === 'GET' && id === 'stats') {
      return await getDashboardStats(req, res);
    }
  }
  else {
    return res.status(404).json({ error: 'Route not found' });
  }
}

// Property handlers
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

// Unit handlers
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

// Service request handlers
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

// Rental application handlers
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

// Get all lease agreements
async function getLeaseAgreements(req, res) {
  authenticateToken(req, res, async () => {
    try {
      const leases = await LeaseAgreement.find()
        .populate('userID', 'firstName lastName email phoneNumber')
        .populate({
          path: 'unitID',
          select: 'unitNumber monthlyRent propertyID',
          populate: {
            path: 'propertyID',
            select: 'address userID'
          }
        });
        
      // Filter leases for properties owned by the authenticated user
      const userLeases = leases.filter(lease => 
        lease.unitID?.propertyID?.userID?.toString() === req.user.userId
      );
        
      res.json(userLeases);
    } catch (error) {
      console.error('Error fetching lease agreements:', error);
      res.status(500).json({ error: 'Error fetching lease agreements' });
    }
  });
}

// Get all payments
async function getPayments(req, res) {
  authenticateToken(req, res, async () => {
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
}

// Get comprehensive dashboard statistics
async function getDashboardStats(req, res) {
  authenticateToken(req, res, async () => {
    try {
      const userId = req.user.userId;
      console.log('Getting dashboard stats for user ID:', userId);
      console.log('User ID type:', typeof userId);
      
      // Get user's properties
      const properties = await Property.find({ landlord: userId });
      console.log('Found properties:', properties.length);
      console.log('Properties query result:', properties.map(p => ({
        _id: p._id,
        name: p.name,
        landlord: p.landlord
      })));
      
      const propertyIds = properties.map(p => p._id);
      console.log('Property IDs:', propertyIds);
      
      // Get units for user's properties  
      const units = await Unit.find({ property: { $in: propertyIds } })
        .populate('property', 'address');
      console.log('Found units:', units.length);
      
      // Get service requests for user's properties
      const serviceRequests = await ServiceRequest.find({ property: { $in: propertyIds } })
        .populate('property', 'address')
        .populate('tenant', 'firstName lastName');
      console.log('Found service requests:', serviceRequests.length);
      
      // Filter out service requests with null unitID (means unit doesn't belong to user)
      const userServiceRequests = serviceRequests.filter(sr => sr.unitID != null);
      
      // Get rental applications for user's properties
      const applications = await RentalApplication.find({ property: { $in: propertyIds } })
        .populate('property', 'address')
        .populate('unit', 'unitNumber')
        .populate('applicant', 'firstName lastName');
      console.log('Found applications:', applications.length);
      
      // Get lease agreements for user's properties
      const leases = await LeaseAgreement.find({ landlord: userId })
        .populate('property', 'address') 
        .populate('unit', 'unitNumber')
        .populate('tenant', 'firstName lastName');
      console.log('Found leases:', leases.length);
      
      // Calculate statistics
      const totalProperties = properties.length;
      const totalUnits = units.length;
      const occupiedUnits = units.filter(unit => unit.isOccupied).length;
      const vacantUnits = totalUnits - occupiedUnits;
      const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
      
      // Service request stats
      const activeServiceRequests = serviceRequests.filter(sr => 
        sr.status === 'open' || sr.status === 'in-progress').length;
      const completedServiceRequests = serviceRequests.filter(sr => 
        sr.status === 'completed').length;
      
      // Application stats
      const pendingApplications = applications.filter(app => app.status === 'pending').length;
      
      // Lease stats - leases ending soon (next 30 days)
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      const leasesEndingSoon = leases.filter(lease => {
        const endDate = new Date(lease.endDate);
        return endDate >= today && endDate <= thirtyDaysFromNow;
      });
      
      // Calculate total revenue from occupied units
      const totalRevenue = units
        .filter(unit => unit.isOccupied)
        .reduce((sum, unit) => sum + (unit.monthlyRent || 0), 0);
      
      // Prepare response
      const stats = {
        properties: {
          total: totalProperties,
          addresses: properties.map(p => `${p.address.street}, ${p.address.city}, ${p.address.state}`)
        },
        units: {
          total: totalUnits,
          occupied: occupiedUnits,
          vacant: vacantUnits,
          occupancyRate: occupancyRate,
          totalRevenue: totalRevenue,
          details: units.map(unit => ({
            _id: unit._id,
            unitNumber: unit.unitNumber,
            isOccupied: unit.isOccupied,
            monthlyRent: unit.monthlyRent,
            property: unit.property?.address ? 
              `${unit.property.address.street}, ${unit.property.address.city}` : 'Unknown'
          }))
        },
        serviceRequests: {
          total: serviceRequests.length,
          active: activeServiceRequests,
          completed: completedServiceRequests,
          completedToday: serviceRequests.filter(sr => {
            if (sr.status !== 'completed') return false;
            const updatedDate = new Date(sr.updatedAt || sr.createdAt);
            return updatedDate.toDateString() === today.toDateString();
          }).length,
          recent: serviceRequests.slice(0, 5).map(sr => ({
            _id: sr._id,
            title: sr.title,
            description: sr.description,
            status: sr.status,
            tenant: sr.tenant ? `${sr.tenant.firstName} ${sr.tenant.lastName}` : 'Unknown',
            property: sr.property?.address ? 
              `${sr.property.address.street}, ${sr.property.address.city}` : 'Unknown',
            createdAt: sr.createdAt
          }))
        },
        applications: {
          total: applications.length,
          pending: pendingApplications,
          approved: applications.filter(app => app.status === 'approved').length,
          rejected: applications.filter(app => app.status === 'rejected').length
        },
        leases: {
          total: leases.length,
          endingSoon: leasesEndingSoon.length,
          endingSoonDetails: leasesEndingSoon.map(lease => ({
            _id: lease._id,
            tenant: lease.tenant ? `${lease.tenant.firstName} ${lease.tenant.lastName}` : 'Unknown',
            unit: lease.unit?.unitNumber || 'Unknown',
            property: lease.property?.address ? 
              `${lease.property.address.street}, ${lease.property.address.city}` : 'Unknown',
            endDate: lease.endDate
          }))
        }
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
  });
}