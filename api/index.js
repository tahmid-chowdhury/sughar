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
import Rating from './models/Rating.js';

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
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
//   console.log('JWT decoded user:', user);
//   console.log('User ID from token:', user.userId);
//   console.log('User ID type:', typeof user.userId);
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
    
    // Development/debugging routes
    if (resource === 'health') {
      return res.status(200).json({
        status: 'OK',
        message: 'Sughar API is running on Vercel',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        environment: process.env.NODE_ENV || 'unknown'
      });
    }
    
    if (resource === 'db-test') {
      return await handleDatabaseTest(req, res);
    }
    
    if (resource === 'complete-fix') {
      return await handleCompleteFix(req, res);
    }
    
    // Main API routes
    if (resource === 'auth') {
      await connectToDatabase();
      return await handleAuth(req, res, urlParts);
    } else if (resource === 'record') {
      const db = await connectToMongoDB();
      return await handleRecord(req, res, urlParts, db);
    } else if (resource && (resource === 'login' || resource === 'register' || resource === 'profile' || resource === 'verify' || resource === 'test' || resource === 'test-db')) {
      // Handle direct auth endpoints
      await connectToDatabase();
      return await handleAuth(req, res, [null, resource]); // Pass resource as endpoint
    } else if (resource && (resource === 'properties' || resource === 'units' || resource === 'service-requests' || resource === 'rental-applications' || resource === 'lease-agreements' || resource === 'payments' || resource === 'dashboard' || resource === 'current-tenants' || resource === 'debug' || resource === 'populate-test-data')) {
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
    if (method === 'GET' && id === 'financial-stats') {
      return await getDashboardFinancialStats(req, res);
    }
  }
  // Current tenants route
  else if (resource === 'current-tenants') {
    if (method === 'GET' && !id) {
      return await getCurrentTenants(req, res);
    }
  }
  // Debug routes
  else if (resource === 'debug') {
    if (method === 'GET' && id === 'lease-agreements') {
      return await debugLeaseAgreements(req, res);
    }
  }
  // Populate test data route
  else if (resource === 'populate-test-data') {
    if (method === 'POST' && !id) {
      return await populateTestData(req, res);
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
      console.log('Fetching rental applications for user:', req.user.userId, 'role:', req.user.role);
      
      let rentalApplications;
      
      if (req.user.role === 'tenant') {
        // For tenants, get their own applications
        rentalApplications = await RentalApplication.find({ applicant: req.user.userId })
          .populate('applicant', 'firstName lastName email phoneNumber')
          .populate('unit', 'unitNumber monthlyRent')
          .populate({
            path: 'property',
            select: 'address userID'
          });
      } else {
        // For landlords, get applications for their properties
        const userProperties = await Property.find({ userID: req.user.userId });
        console.log('Found user properties:', userProperties.length);
        
        if (userProperties.length === 0) {
          console.log('No properties found for user, returning empty array');
          return res.json([]);
        }
        
        const propertyIds = userProperties.map(p => p._id);
        
        rentalApplications = await RentalApplication.find({ property: { $in: propertyIds } })
          .populate('applicant', 'firstName lastName email phoneNumber')
          .populate('unit', 'unitNumber monthlyRent')
          .populate({
            path: 'property',
            select: 'address userID'
          });
      }
      
      console.log('Found rental applications:', rentalApplications.length);
      
      // Transform data to be more frontend-friendly
      const transformedApplications = rentalApplications.map(app => ({
        _id: app._id,
        applicantID: app.applicant, // Keep both naming conventions for compatibility
        applicant: app.applicant,
        unitID: app.unit, // Keep both naming conventions for compatibility
        unit: app.unit,
        propertyID: app.property, // Keep both naming conventions for compatibility
        property: app.property,
        desiredMoveInDate: app.desiredMoveInDate,
        monthlyIncome: app.monthlyIncome,
        employmentStatus: app.employmentStatus,
        previousAddress: app.previousAddress,
        references: app.references,
        status: app.status,
        applicationDate: app.applicationDate,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt
      }));
      
      res.json(transformedApplications);
    } catch (error) {
      console.error('Error fetching rental applications:', error);
      res.status(500).json({ 
        error: 'Error fetching rental applications',
        details: error.message 
      });
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
      // console.log('User ID type:', typeof userId);
      
            // Get user's properties
      const properties = await Property.find({ landlord: userId });
      console.log('Found properties:', properties.length);
      const propertyIds = properties.map(p => p._id);
      
      // Get units for user's properties  
      const units = await Unit.find({ property: { $in: propertyIds } })
        .populate('property', 'address');
      console.log('Found units:', units.length);
      
      // Get service requests for user's properties
      const serviceRequests = await ServiceRequest.find({ property: { $in: propertyIds } })
        .populate('property', 'address')
        .populate('tenant', 'firstName lastName');
      console.log('Found service requests:', serviceRequests.length);
      
      // Get rental applications for user's properties
      const applications = await RentalApplication.find({ property: { $in: propertyIds } });
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

// Get financial dashboard stats
async function getDashboardFinancialStats(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Access token required' });
      }
      
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      
      console.log('Financial stats endpoint called by user:', userId);
      console.log('User ID type:', typeof userId);
      console.log('User ID string representation:', userId ? userId.toString() : 'undefined');
      
      if (!userId) {
        return res.status(400).json({ error: 'Invalid user ID from token' });
      }
      
      // Debug: Check what users and properties exist in the database
      const currentUser = await User.findById(userId);
      console.log('Current user:', currentUser ? {id: currentUser._id.toString(), email: currentUser.email} : 'not found');
      
      const allProperties = await Property.find({}).select('_id userID name');
      console.log('All properties in database:', allProperties.map(p => ({
        id: p._id ? p._id.toString() : 'undefined', 
        userID: p.userID ? p.userID.toString() : 'undefined', 
        name: p.name || 'unnamed',
        userIdMatch: (p.userID && userId) ? p.userID.toString() === userId.toString() : false
      })));
      
      // Get user's properties - convert both to strings for reliable comparison
      let properties = [];
      try {
        // First try exact ObjectId match
        properties = await Property.find({ userID: userId });
        console.log('Properties found with ObjectId:', properties.length);
        
        if (properties.length === 0) {
          // Try string match
          properties = await Property.find({ userID: userId.toString() });
          console.log('Properties found with string:', properties.length);
        }
        
        if (properties.length === 0) {
          // Try creating new ObjectId from string
          try {
            properties = await Property.find({ userID: new ObjectId(userId.toString()) });
            console.log('Properties found with new ObjectId:', properties.length);
          } catch (e) {
            console.log('ObjectId conversion failed:', e.message);
          }
        }
        
        // If still no properties, try to find any properties with userID matching any format
        if (properties.length === 0) {
          const allProps = await Property.find({});
          console.log('Total properties in database:', allProps.length);
          const matchingProps = allProps.filter(p => {
            if (!p.userID || !userId) return false;
            const pUserId = p.userID.toString();
            const currentUserId = userId.toString();
            return pUserId === currentUserId;
          });
          properties = matchingProps;
          console.log('Properties found with manual filter:', properties.length);
        }
        
      } catch (error) {
        console.error('Error finding properties:', error);
      }
      
      console.log('Final properties count:', properties.length);
      
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
        
        console.log('Calculated financial stats (no properties):', financialStats);
        return res.json(financialStats);
      }
      
      console.log('Properties found:', properties.map(p => ({
        id: p._id ? p._id.toString() : 'undefined', 
        name: p.name || 'unnamed', 
        userID: p.userID ? p.userID.toString() : 'undefined'
      })));
      
      const propertyIds = properties.map(p => p._id).filter(id => id);
      console.log('Property IDs for unit search:', propertyIds.map(id => id.toString()));
      
      // Get units for user's properties
      const units = await Unit.find({ propertyID: { $in: propertyIds } });
      console.log('Found units:', units.length);
      
      if (units.length === 0) {
        console.log('No units found for properties, returning zero values');
        const financialStats = {
          revenueThisMonth: 0,
          incomingRent: 0,
          overdueRent: 0,
          serviceCosts: 0,
          utilitiesCosts: 0
        };
        return res.json(financialStats);
      }
      
      const unitIds = units.map(u => u._id).filter(id => id);
      console.log('Unit IDs for lease search:', unitIds.map(id => id.toString()));
      console.log('Unit details:', units.map(u => ({
        id: u._id ? u._id.toString() : 'undefined', 
        propertyID: u.propertyID ? u.propertyID.toString() : 'undefined', 
        status: u.status || 'unknown', 
        rent: u.monthlyRent || 0
      })));
      
      // Get lease agreements for user's units
      const leases = await LeaseAgreement.find({ unitID: { $in: unitIds } })
        .populate('unitID', 'monthlyRent');
      console.log('Found leases:', leases.length);
      
      if (leases.length === 0) {
        console.log('No leases found for units, returning zero values');
        const financialStats = {
          revenueThisMonth: 0,
          incomingRent: 0,
          overdueRent: 0,
          serviceCosts: 0,
          utilitiesCosts: 0
        };
        return res.json(financialStats);
      }
      
      console.log('Lease details:', leases.map(l => ({
        id: l._id ? l._id.toString() : 'undefined', 
        unitID: l.unitID && l.unitID._id ? l.unitID._id.toString() : 'undefined', 
        status: l.status || 'unknown', 
        startDate: l.startDate || 'unknown',
        unitRent: l.unitID && l.unitID.monthlyRent ? l.unitID.monthlyRent : 'no rent data'
      })));
      
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
        const amount = payment.amount || 0;
        return sum + parseFloat(amount.toString());
      }, 0);
      
      // Calculate incoming rent (expected monthly rent from all occupied units)
      const occupiedUnits = units.filter(unit => unit.status === 'occupied');
      console.log('Occupied units:', occupiedUnits.length);
      const incomingRent = occupiedUnits.reduce((sum, unit) => {
        const rent = unit.monthlyRent || 0;
        return sum + parseFloat(rent.toString());
      }, 0);
      
      // Calculate overdue rent
      // Get all payments made for current active leases
      const currentDate = new Date();
      const activeLeases = leases.filter(lease => 
        lease.startDate && lease.endDate &&
        new Date(lease.startDate) <= currentDate && new Date(lease.endDate) >= currentDate
      );
      console.log('Active leases:', activeLeases.length);
      
      // Calculate expected rent vs actual payments for overdue calculation
      let overdueRent = 0;
      for (const lease of activeLeases) {
        if (!lease.startDate) {
          console.log('Skipping lease due to missing start date:', lease._id);
          continue;
        }
        
        // Get monthly rent from the populated unit or from the lease itself
        let monthlyRent = 0;
        if (lease.unitID && lease.unitID.monthlyRent) {
          monthlyRent = lease.unitID.monthlyRent;
        } else if (lease.monthlyRent) {
          monthlyRent = lease.monthlyRent;
        } else {
          // Find the rent from the units array
          const correspondingUnit = units.find(unit => 
            unit._id.toString() === (lease.unitID._id ? lease.unitID._id.toString() : lease.unitID.toString())
          );
          if (correspondingUnit && correspondingUnit.monthlyRent) {
            monthlyRent = correspondingUnit.monthlyRent;
          }
        }
        
        if (!monthlyRent) {
          console.log('Skipping lease due to missing rent data:', lease._id);
          continue;
        }
        
        const leaseStartDate = new Date(lease.startDate);
        const monthsSinceStart = Math.floor((currentDate - leaseStartDate) / (1000 * 60 * 60 * 24 * 30)) + 1;
        const expectedTotalPayments = monthsSinceStart * parseFloat(monthlyRent.toString());
        
        // Get all completed payments for this lease
        const leasePayments = await Payment.find({
          leaseID: lease._id,
          status: 'completed'
        });
        
        const totalPaid = leasePayments.reduce((sum, payment) => {
          const amount = payment.amount || 0;
          return sum + parseFloat(amount.toString());
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
}

// Database test handler (consolidated)
async function handleDatabaseTest(req, res) {
  try {
    await connectToDatabase();
    
    const userCount = await User.countDocuments();
    const testUser = await User.findOne({ email: 'monir@ashaproperties.com' });
    const propertyCount = await Property.countDocuments();
    const allProperties = await Property.find();
    const monirProperties = await Property.find({ landlord: testUser?._id });
    const unitCount = await Unit.countDocuments();
    const propertiesWithLandlord = await Property.find({ landlord: { $exists: true, $ne: null } });
    
    res.status(200).json({
      status: 'OK',
      message: 'Database connection test successful',
      results: {
        connected: mongoose.connection.readyState === 1,
        userCount: userCount,
        testUserExists: !!testUser,
        testUserEmail: testUser?.email,
        testUserId: testUser?._id,
        propertyCount: propertyCount,
        monirPropertyCount: monirProperties.length,
        unitCount: unitCount,
        allProperties: allProperties.map(p => ({
          _id: p._id,
          name: p.name,
          landlord: p.landlord,
          hasLandlord: !!p.landlord,
          address: p.address?.street || 'No address'
        })),
        propertiesWithLandlord: propertiesWithLandlord.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database test failed',
      error: error.message
    });
  }
}

// Complete fix handler (consolidated)
async function handleCompleteFix(req, res) {
  try {
    await connectToDatabase();
    
    // Find Monir Rahman
    const monirUser = await User.findOne({ email: 'monir@ashaproperties.com' });
    if (!monirUser) {
      return res.status(404).json({ error: 'Monir user not found' });
    }
    
    // 1. Fix Properties
    const properties = await Property.find();
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      const updates = { landlord: monirUser._id };
      
      if (!property.address || !property.address.street) {
        const addresses = [
          { street: '15 Lalmatia Lane', city: 'Dhaka', state: 'Dhaka Division', zipCode: '1207' },
          { street: '22 Dhanmondi Residential Area', city: 'Dhaka', state: 'Dhaka Division', zipCode: '1209' },
          { street: '8 Gulshan Avenue', city: 'Dhaka', state: 'Dhaka Division', zipCode: '1212' },
          { street: '35 Uttara Sector 3', city: 'Dhaka', state: 'Dhaka Division', zipCode: '1230' }
        ];
        updates.address = addresses[i] || addresses[0];
      }
      
      if (!property.name) {
        const names = ['Lalmatia Court', 'Dhanmondi Heights', 'Gulshan Plaza', 'Uttara Residency'];
        updates.name = names[i] || `Asha Property ${i + 1}`;
      }
      
      await Property.findByIdAndUpdate(property._id, updates);
    }
    
    // 2. Fix Units
    const units = await Unit.find();
    const updatedProperties = await Property.find({ landlord: monirUser._id });
    const propertyIds = updatedProperties.map(p => p._id);
    
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const propertyIndex = Math.floor(i / 7);
      const targetPropertyId = propertyIds[propertyIndex] || propertyIds[0];
      
      const updates = { property: targetPropertyId };
      
      if (!unit.unitNumber) {
        const unitInProperty = (i % 7) + 1;
        updates.unitNumber = `${String.fromCharCode(65 + propertyIndex)}${unitInProperty.toString().padStart(2, '0')}`;
      }
      
      updates.isOccupied = i < 25; // 25 out of 28 occupied (89%)
      
      await Unit.findByIdAndUpdate(unit._id, updates);
    }
    
    // 3. Fix Service Requests
    const serviceRequests = await ServiceRequest.find();
    const tenants = await User.find({ role: 'tenant' }).limit(10);
    
    for (let i = 0; i < Math.min(serviceRequests.length, 10); i++) {
      const sr = serviceRequests[i];
      const propertyId = propertyIds[i % propertyIds.length];
      const tenant = tenants[i % tenants.length];
      
      await ServiceRequest.findByIdAndUpdate(sr._id, {
        property: propertyId,
        tenant: tenant?._id || monirUser._id,
        status: i < 9 ? 'open' : 'completed'
      });
    }
    
    // Verify the fixes
    const verification = {
      properties: await Property.countDocuments({ landlord: monirUser._id }),
      units: await Unit.countDocuments({ property: { $in: propertyIds } }),
      occupiedUnits: await Unit.countDocuments({ property: { $in: propertyIds }, isOccupied: true }),
      serviceRequests: await ServiceRequest.countDocuments({ property: { $in: propertyIds } }),
      activeServiceRequests: await ServiceRequest.countDocuments({ property: { $in: propertyIds }, status: 'open' })
    };
    
    res.status(200).json({
      status: 'COMPLETELY_FIXED',
      message: 'All data relationships fixed',
      monirUserId: monirUser._id,
      verification: verification,
      expectedDashboard: {
        properties: verification.properties,
        totalUnits: verification.units,
        occupiedUnits: verification.occupiedUnits,
        occupancyRate: Math.round((verification.occupiedUnits / verification.units) * 100),
        vacantUnits: verification.units - verification.occupiedUnits,
        activeServiceRequests: verification.activeServiceRequests
      }
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'ERROR', 
      message: 'Complete fix failed',
      error: error.message
    });
  }
}

// Get current tenants with lease and payment information
async function getCurrentTenants(req, res) {
  authenticateToken(req, res, async () => {
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
      .populate('unitID', 'unitNumber monthlyRent propertyID');
      
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
      
      // Get ratings for tenants (if available) - skip if collection doesn't exist
      let ratings = [];
      try {
        ratings = await Rating.find({
          userID: { $in: leases.map(lease => lease.userID?._id).filter(id => id) }
        });
        console.log('Found ratings:', ratings.length);
      } catch (ratingError) {
        console.log('Ratings collection not available or empty, using default ratings');
        ratings = [];
      }
      
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
          return true;
        })
        .map(lease => {
          const tenant = lease.userID;
          const unit = lease.unitID;
          
          // Find property for this unit
          const property = properties.find(prop => 
            prop._id.toString() === unit.propertyID?.toString()
          );
          
          // Calculate lease progress (percentage of lease term completed)
          const leaseStart = new Date(lease.startDate);
          const leaseEnd = new Date(lease.endDate);
          const today = new Date();
          const totalDays = (leaseEnd - leaseStart) / (1000 * 60 * 60 * 24);
          const daysPassed = (today - leaseStart) / (1000 * 60 * 60 * 24);
          const progressPercentage = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
          
          // Determine rent status based on recent payments
          const tenantPayments = payments.filter(payment => 
            payment.leaseID?.toString() === lease._id.toString()
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
            building: property?.address?.split(',')[0] || `Building ${unit.unitNumber}`,
            unit: parseInt(unit.unitNumber) || 1,
            leaseProgress: {
              value: Math.round(progressPercentage),
              variant: progressPercentage > 50 ? 'dark' : 'light'
            },
            rentStatus: rentStatus,
            requests: tenantServiceRequests
          };
        });
      
      console.log('Returning current tenants:', currentTenants.length);
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
}

// Debug endpoint for lease agreements
async function debugLeaseAgreements(req, res) {
  authenticateToken(req, res, async () => {
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
}

// Populate test data for current user
async function populateTestData(req, res) {
  authenticateToken(req, res, async () => {
    try {
      console.log('Populating Asha Properties test data for user:', req.user.userId);
      
      // Create Asha Properties portfolio
      const properties = await Property.insertMany([
        {
          userID: req.user.userId,
          address: "Lalmatia, Dhaka, Bangladesh",
          propertyType: "apartment",
          name: "Lalmatia Court"
        },
        {
          userID: req.user.userId,
          address: "Banani, Dhaka, Bangladesh", 
          propertyType: "apartment",
          name: "Banani Heights"
        },
        {
          userID: req.user.userId,
          address: "Dhanmondi, Dhaka, Bangladesh",
          propertyType: "apartment", 
          name: "Dhanmondi Residency"
        },
        {
          userID: req.user.userId,
          address: "Uttara, Dhaka, Bangladesh",
          propertyType: "apartment",
          name: "Uttara Gardens"
        }
      ]);
      
      console.log('Created Asha Properties:', properties.length);
      
      // Create units for each property
      const units = [];
      
      // Lalmatia Court - 12 units
      const lalmatiaUnits = ['1A', '2A', '3A', '4A', '1B', '2B', '3B', '4B', '1C', '2C', '3C', '4C'];
      const lalmatiaOccupancy = [true, false, true, true, true, true, true, true, true, true, true, true]; // 2A is vacant
      
      for (let i = 0; i < lalmatiaUnits.length; i++) {
        const unit = await Unit.create({
          propertyID: properties[0]._id,
          unitNumber: lalmatiaUnits[i],
          bedrooms: 2,
          bathrooms: 1,
          rentAmount: 25000,
          monthlyRent: 25000,
          size: "900 sq ft",
          description: `2-bedroom apartment in Lalmatia Court`,
          isOccupied: lalmatiaOccupancy[i]
        });
        units.push(unit);
      }
      
      // Banani Heights - 8 units
      const bananiUnits = ['1A', '2A', '3A', '4A', '1B', '2B', '3B', '4B'];
      for (let i = 0; i < bananiUnits.length; i++) {
        const unit = await Unit.create({
          propertyID: properties[1]._id,
          unitNumber: bananiUnits[i],
          bedrooms: 3,
          bathrooms: 2,
          rentAmount: 35000,
          monthlyRent: 35000,
          size: "1200 sq ft",
          description: `3-bedroom apartment in Banani Heights`,
          isOccupied: true
        });
        units.push(unit);
      }
      
      // Dhanmondi Residency - 5 units
      const dhanmondiUnits = ['1A', '2A', '3A', '4A', '5A'];
      const dhanmondiOccupancy = [false, true, true, true, true]; // 1A is vacant
      for (let i = 0; i < dhanmondiUnits.length; i++) {
        const unit = await Unit.create({
          propertyID: properties[2]._id,
          unitNumber: dhanmondiUnits[i],
          bedrooms: 3,
          bathrooms: 2,
          rentAmount: 40000,
          monthlyRent: 40000,
          size: "1400 sq ft",
          description: `3-bedroom apartment in Dhanmondi Residency`,
          isOccupied: dhanmondiOccupancy[i]
        });
        units.push(unit);
      }
      
      // Uttara Gardens - 3 units
      for (let i = 1; i <= 3; i++) {
        const unit = await Unit.create({
          propertyID: properties[3]._id,
          unitNumber: i.toString(),
          bedrooms: 2,
          bathrooms: 1,
          rentAmount: 30000,
          monthlyRent: 30000,
          size: "1000 sq ft",
          description: `2-bedroom apartment in Uttara Gardens`,
          isOccupied: true
        });
        units.push(unit);
      }
      
      console.log('Created units:', units.length);
      
      // Create tenant users based on sample data
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash("password123", 10);
      
      const tenantNames = [
        'Farzana Akhter', 'Amrul Hoque', 'Shahriar Karim', 'Tania Akter', 'Imran Chowdhury', 'Sumi Akhter',
        'Hasan Mahmud', 'Shuvo Islam', 'Maruf Khan', 'Mahin Alam', 'Saima Binte Noor', 'Javed Rahman',
        'Sadia Hossain', 'Kamal Uddin', 'Mehnaz Sultana', 'Tanvir Ahmed', 'Nasrin Akter', 'Mithun Das',
        'Zahid Hasan', 'Roksana Begum', 'Shila Rahman', 'Arefin Chowdhury', 'Rezaul Karim', 'Nadia Islam',
        'Selina Yasmin', 'Abdul Malek', 'Rafsan Chowdhury'
      ];
      
      const tenants = [];
      for (let i = 0; i < tenantNames.length; i++) {
        const nameParts = tenantNames[i].split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        
        const tenant = await User.create({
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}@email.com`,
          phoneNumber: `+880-17${(12345678 + i).toString().slice(-8)}`,
          role: "tenant",
          passwordHash
        });
        tenants.push(tenant);
      }
      
      console.log('Created tenant users:', tenants.length);
      
      // Create lease agreements for occupied units
      const occupiedUnits = units.filter(unit => unit.isOccupied);
      const leases = [];
      
      // Define lease end dates based on sample data
      const leaseEndDates = [
        '2026-01-14', '2026-03-02', '2026-03-03', '2026-05-11', '2026-04-28', '2026-06-17', '2026-02-09',
        '2025-11-22', '2026-08-15', '2026-07-05', '2025-12-19', '2026-10-03', '2026-09-02', '2026-05-23',
        '2026-04-11', '2026-03-29', '2026-08-20', '2026-06-08', '2025-12-30', '2026-02-13', '2025-11-09',
        '2026-01-18', '2026-07-27', '2026-01-12', '2025-10-30', '2026-09-19'
      ];
      
      for (let i = 0; i < Math.min(occupiedUnits.length, tenants.length); i++) {
        const lease = await LeaseAgreement.create({
          unitID: occupiedUnits[i]._id,
          tenantID: tenants[i]._id,
          startDate: new Date('2024-01-01'),
          endDate: new Date(leaseEndDates[i] || '2026-01-01'),
          rentAmount: occupiedUnits[i].rentAmount,
          securityDeposit: occupiedUnits[i].rentAmount * 2,
          leaseTerms: "Standard lease agreement"
        });
        leases.push(lease);
      }
      
      console.log('Created lease agreements:', leases.length);
      
      // Create rental applications from sample applicants
      const applicantData = [
        {
          name: 'Raiyan Rahman',
          email: 'raiyan.rahman@email.com',
          phone: '+880-1712345678',
          dob: '1996-02-02',
          occupation: 'Software Engineer',
          employer: 'Grameenphone IT Division',
          income: 120000,
          yearsEmployed: 3,
          rating: 4.8,
          status: 'pending'
        },
        {
          name: 'Niloy Hossain',
          email: 'niloy.hossain@email.com',
          phone: '+880-1798765432',
          dob: '2001-07-17',
          occupation: 'Freelance Graphic Designer',
          employer: 'Self-employed (Upwork/Fiverr)',
          income: 45000,
          yearsEmployed: 2,
          rating: null,
          status: 'under_review'
        },
        {
          name: 'Arif Mahmud',
          email: 'arif.mahmud@email.com',
          phone: '+880-1656789123',
          dob: '1989-11-11',
          occupation: 'Senior Accountant',
          employer: 'BRAC Bank',
          income: 95000,
          yearsEmployed: 5,
          rating: 4.5,
          status: 'approved'
        },
        {
          name: 'Zarin Tasnim',
          email: 'zarin.tasnim@email.com',
          phone: '+880-1534567890',
          dob: '1993-05-25',
          occupation: 'Lecturer (Economics)',
          employer: 'University of Dhaka',
          income: 70000,
          yearsEmployed: 4,
          rating: 4.9,
          status: 'pending'
        },
        {
          name: 'Ayaan Chowdhury',
          email: 'ayaan.chowdhury@email.com',
          phone: '+880-1412345678',
          dob: '1998-12-04',
          occupation: 'Junior Doctor (Resident)',
          employer: 'Square Hospital',
          income: 65000,
          yearsEmployed: 1,
          rating: null,
          status: 'rejected'
        }
      ];
      
      // Create applicant users and applications
      const availableUnits = units.filter(unit => !unit.isOccupied);
      const applications = [];
      
      for (let i = 0; i < Math.min(applicantData.length, availableUnits.length + 2); i++) {
        const data = applicantData[i];
        const nameParts = data.name.split(' ');
        
        // Create applicant user
        const applicantUser = await User.create({
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
          email: data.email,
          phoneNumber: data.phone,
          role: "tenant",
          passwordHash
        });
        
        // Create rental application
        const targetUnit = availableUnits[i % availableUnits.length];
        const application = await RentalApplication.create({
          applicant: applicantUser._id,
          unit: targetUnit._id,
          property: targetUnit.propertyID,
          desiredMoveInDate: new Date(Date.now() + (15 + i * 5) * 24 * 60 * 60 * 1000),
          monthlyIncome: data.income,
          employmentStatus: data.employer.includes('Self-employed') ? 'Self-employed' : 'Full-time employed',
          previousAddress: `Previous Address ${i + 1}, Dhaka`,
          references: [`${data.employer}`, `Reference ${i + 1}`],
          status: data.status,
          applicationDate: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
          occupation: data.occupation,
          employer: data.employer,
          yearsAtEmployer: data.yearsEmployed,
          previousTenantRating: data.rating
        });
        applications.push(application);
      }
      
      console.log('Created rental applications:', applications.length);
      
      // Create service requests
      const serviceRequestsData = [
        { unitRef: 'Lalmatia Court-4A', title: 'Leak under kitchen sink', desc: 'Tenant reports water pooling under sink; cabinet getting damaged.', date: '2025-09-20', priority: 'high' },
        { unitRef: 'Lalmatia Court-2B', title: 'Bathroom faucet dripping', desc: 'Constant dripping, wasting water and raising bill.', date: '2025-09-22', priority: 'medium' },
        { unitRef: 'Lalmatia Court-1C', title: 'AC not cooling properly', desc: 'AC blows warm air even after filter cleaning.', date: '2025-09-19', priority: 'high' },
        { unitRef: 'Banani Heights-2A', title: 'Electrical outage in living room', desc: 'Circuit breaker keeps tripping, no power in living room.', date: '2025-09-18', priority: 'high' },
        { unitRef: 'Banani Heights-4A', title: 'Window glass cracked', desc: 'Small crack in bedroom window, risk of shattering.', date: '2025-09-23', priority: 'medium' }
      ];
      
      const serviceRequests = [];
      for (let i = 0; i < serviceRequestsData.length; i++) {
        const srData = serviceRequestsData[i];
        const [propertyName, unitNum] = srData.unitRef.split('-');
        
        // Find the corresponding unit and tenant
        const targetProperty = properties.find(p => p.name === propertyName);
        const targetUnit = units.find(u => u.propertyID.equals(targetProperty._id) && u.unitNumber === unitNum);
        const targetLease = leases.find(l => l.unitID.equals(targetUnit._id));
        
        if (targetUnit && targetLease) {
          const serviceRequest = await ServiceRequest.create({
            requestId: `SR-000${i + 1}`,
            property: targetProperty._id,
            unit: targetUnit._id,
            tenant: targetLease.tenantID,
            landlord: req.user.userId,
            title: srData.title,
            description: srData.desc,
            status: i === 3 ? 'completed' : (i === 1 ? 'in_progress' : 'pending'),
            priority: srData.priority,
            requestDate: new Date(srData.date),
            createdAt: new Date(),
            updatedAt: new Date()
          });
          serviceRequests.push(serviceRequest);
        }
      }
      
      console.log('Created service requests:', serviceRequests.length);
      
      // Create payment history for active leases
      const payments = [];
      for (const lease of leases) {
        // Create 3 months of payment history
        for (let month = 0; month < 3; month++) {
          const paymentDate = new Date();
          paymentDate.setMonth(paymentDate.getMonth() - month);
          
          const payment = await Payment.create({
            leaseAgreementID: lease._id,
            amount: lease.rentAmount,
            paymentDate: paymentDate,
            dueDate: new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1),
            status: month < 2 ? "paid" : "pending",
            paymentMethod: ["bank_transfer", "mobile_banking", "cash"][month % 3]
          });
          payments.push(payment);
        }
      }
      
      console.log('Created payments:', payments.length);
      
      res.json({
        message: 'Asha Properties test data populated successfully!',
        owner: 'Monir Rahman',
        company: 'Asha Properties',
        summary: {
          properties: properties.length,
          units: units.length,
          tenants: tenants.length,
          leaseAgreements: leases.length,
          rentalApplications: applications.length,
          serviceRequests: serviceRequests.length,
          payments: payments.length,
          occupancyRate: `${Math.round((occupiedUnits.length / units.length) * 100)}%`
        }
      });
      
    } catch (error) {
      console.error('Error populating Asha Properties test data:', error);
      res.status(500).json({ 
        error: 'Error populating test data',
        details: error.message 
      });
    }
  });
}