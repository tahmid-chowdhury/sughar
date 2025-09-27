// Database test endpoint
import { connectToDatabase } from './_utils/db.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';
import Unit from './models/Unit.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Testing database connection...');
    
    // Test database connection
    await connectToDatabase();
    console.log('Database connected successfully');
    
    // Test user query
    const userCount = await User.countDocuments();
    console.log('User count:', userCount);
    
    // Test specific user lookup
    const testUser = await User.findOne({ email: 'monir@ashaproperties.com' });
    console.log('Test user found:', !!testUser);
    console.log('Test user ID:', testUser?._id);
    
    // Check properties
    const propertyCount = await Property.countDocuments();
    console.log('Property count:', propertyCount);
    
    const allProperties = await Property.find();
    console.log('All properties with full data:', allProperties.map(p => ({
      _id: p._id,
      name: p.name,
      landlord: p.landlord,
      address: p.address
    })));
    
    // Check properties for Monir
    const monirProperties = await Property.find({ landlord: testUser?._id });
    console.log('Monir properties:', monirProperties.length);
    
    // Also try to find properties with any landlord set
    const propertiesWithLandlord = await Property.find({ landlord: { $exists: true, $ne: null } });
    console.log('Properties with landlord set:', propertiesWithLandlord.length);
    
    // Check units
    const unitCount = await Unit.countDocuments();
    console.log('Unit count:', unitCount);
    
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
      },
      environment: {
        hasAtlasUri: !!process.env.ATLAS_URI,
        atlasUriPrefix: process.env.ATLAS_URI ? process.env.ATLAS_URI.substring(0, 20) + '...' : null
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Database test failed',
      error: error.message,
      details: {
        name: error.name,
        code: error.code
      }
    });
  }
}