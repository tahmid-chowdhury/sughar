// Fix data endpoint - assigns all properties to Monir Rahman
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
    await connectToDatabase();
    console.log('Connected to database for fix');
    
    // Find Monir Rahman
    const monirUser = await User.findOne({ email: 'monir@ashaproperties.com' });
    if (!monirUser) {
      return res.status(404).json({ error: 'Monir user not found' });
    }
    
    console.log('Found Monir user:', monirUser._id);
    
    // Update all properties to belong to Monir
    const updateResult = await Property.updateMany(
      {},  // Update all properties
      { landlord: monirUser._id }
    );
    
    console.log('Properties updated:', updateResult);
    
    // Verify the fix
    const monirProperties = await Property.find({ landlord: monirUser._id });
    console.log('Monir now has properties:', monirProperties.length);
    
    // Also check and fix units if needed
    const allUnits = await Unit.find();
    console.log('Total units:', allUnits.length);
    
    // Get property IDs for Monir
    const propertyIds = monirProperties.map(p => p._id);
    
    // Check how many units belong to Monir's properties
    const monirUnits = await Unit.find({ property: { $in: propertyIds } });
    console.log('Units belonging to Monir properties:', monirUnits.length);
    
    res.status(200).json({
      status: 'FIXED',
      message: 'Properties assigned to Monir Rahman',
      results: {
        monirUserId: monirUser._id,
        propertiesUpdated: updateResult.modifiedCount,
        monirPropertiesCount: monirProperties.length,
        totalUnits: allUnits.length,
        monirUnitsCount: monirUnits.length,
        propertyDetails: monirProperties.map(p => ({
          _id: p._id,
          name: p.name,
          landlord: p.landlord,
          address: `${p.address.street}, ${p.address.city}`
        }))
      }
    });
    
  } catch (error) {
    console.error('Fix error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Fix failed',
      error: error.message
    });
  }
}