import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../_utils/db.js';
import { corsHeaders } from '../_utils/auth.js';
import User from '../models/User.js';
import Contractor from '../models/Contractor.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  // Set CORS headers
  res.set(corsHeaders());
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectToDatabase();

  const { method } = req;
  const path = req.url.split('/').pop();

  try {
    if (method === 'POST' && path === 'register') {
      return await handleRegister(req, res);
    } else if (method === 'POST' && path === 'login') {
      return await handleLogin(req, res);
    } else if (method === 'GET' && path === 'verify') {
      return await handleVerify(req, res);
    } else {
      return res.status(404).json({ error: 'Route not found' });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleRegister(req, res) {
  const { firstName, lastName, email, phoneNumber, role, password } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }
  
  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  // Create new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    passwordHash
  });
  
  const savedUser = await newUser.save();
  
  // If user is a contractor, create contractor profile
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
  
  // Generate JWT token
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
  const { email, password } = req.body;
  
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
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