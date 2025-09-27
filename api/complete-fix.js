// Complete data fix - properly links all entities
import { connectToDatabase } from './_utils/db.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';
import Unit from './models/Unit.js';
import ServiceRequest from './models/ServiceRequest.js';
import LeaseAgreement from './models/LeaseAgreement.js';
import RentalApplication from './models/RentalApplication.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
    console.log('Starting complete data fix...');
    
    // Find Monir Rahman
    const monirUser = await User.findOne({ email: 'monir@ashaproperties.com' });
    if (!monirUser) {
      return res.status(404).json({ error: 'Monir user not found' });
    }
    
    console.log('Found Monir user:', monirUser._id);
    
    // 1. Fix Properties - ensure they have proper landlord and address
    const properties = await Property.find();
    console.log('Found properties:', properties.length);
    
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      const updates = { landlord: monirUser._id };
      
      // Fix address if missing
      if (!property.address || !property.address.street) {
        const addresses = [
          { street: '15 Lalmatia Lane', city: 'Dhaka', state: 'Dhaka Division', zipCode: '1207' },
          { street: '22 Dhanmondi Residential Area', city: 'Dhaka', state: 'Dhaka Division', zipCode: '1209' },
          { street: '8 Gulshan Avenue', city: 'Dhaka', state: 'Dhaka Division', zipCode: '1212' },
          { street: '35 Uttara Sector 3', city: 'Dhaka', state: 'Dhaka Division', zipCode: '1230' }
        ];
        updates.address = addresses[i] || addresses[0];
      }
      
      // Set name if missing
      if (!property.name) {
        const names = [
          'Lalmatia Court',
          'Dhanmondi Heights',
          'Gulshan Plaza',
          'Uttara Residency'
        ];
        updates.name = names[i] || `Asha Property ${i + 1}`;
      }
      
      await Property.findByIdAndUpdate(property._id, updates);
    }
    
    // 2. Fix Units - ensure they're connected to properties
    const units = await Unit.find();
    console.log('Found units:', units.length);
    
    const updatedProperties = await Property.find({ landlord: monirUser._id });
    const propertyIds = updatedProperties.map(p => p._id);
    
    // Distribute units across properties (7 units per property for 4 properties = 28 units)
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const propertyIndex = Math.floor(i / 7); // 7 units per property
      const targetPropertyId = propertyIds[propertyIndex] || propertyIds[0];
      
      const updates = { property: targetPropertyId };
      
      // Set unit number if missing
      if (!unit.unitNumber) {
        const unitInProperty = (i % 7) + 1;
        updates.unitNumber = `${String.fromCharCode(65 + propertyIndex)}${unitInProperty.toString().padStart(2, '0')}`;
      }
      
      // Set occupancy randomly
      updates.isOccupied = i < 25; // 25 out of 28 units occupied (89% occupancy)
      
      await Unit.findByIdAndUpdate(unit._id, updates);
    }
    
    // 3. Fix Service Requests - link to properties and users
    const serviceRequests = await ServiceRequest.find();
    console.log('Found service requests:', serviceRequests.length);
    
    const tenants = await User.find({ role: 'tenant' }).limit(10);
    
    for (let i = 0; i < serviceRequests.length && i < 10; i++) {
      const sr = serviceRequests[i];
      const propertyId = propertyIds[i % propertyIds.length];
      const tenant = tenants[i % tenants.length];
      
      await ServiceRequest.findByIdAndUpdate(sr._id, {
        property: propertyId,
        tenant: tenant?._id || monirUser._id,
        status: i < 9 ? 'open' : 'completed' // 9 active, 1 completed
      });
    }
    
    // 4. Fix Lease Agreements
    const leases = await LeaseAgreement.find();
    console.log('Found leases:', leases.length);
    
    const occupiedUnits = await Unit.find({ isOccupied: true }).populate('property');
    
    for (let i = 0; i < Math.min(leases.length, occupiedUnits.length); i++) {
      const lease = leases[i];
      const unit = occupiedUnits[i];
      const tenant = tenants[i % tenants.length];
      
      // Some leases ending soon
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (i < 2 ? 15 : 300)); // 2 ending soon
      
      await LeaseAgreement.findByIdAndUpdate(lease._id, {
        landlord: monirUser._id,
        property: unit.property._id,
        unit: unit._id,
        tenant: tenant?._id || monirUser._id,
        endDate: endDate,
        status: 'active'
      });
    }
    
    // 5. Fix Rental Applications
    const applications = await RentalApplication.find();
    console.log('Found applications:', applications.length);
    
    for (let i = 0; i < Math.min(applications.length, 3); i++) {
      const app = applications[i];
      const propertyId = propertyIds[i % propertyIds.length];
      const vacantUnits = await Unit.find({ property: propertyId, isOccupied: false }).limit(1);
      
      await RentalApplication.findByIdAndUpdate(app._id, {
        property: propertyId,
        unit: vacantUnits[0]?._id,
        applicant: tenants[i]?._id || monirUser._id,
        status: 'pending'
      });
    }
    
    // Verify the fixes
    const verification = {
      properties: await Property.countDocuments({ landlord: monirUser._id }),
      units: await Unit.countDocuments({ property: { $in: propertyIds } }),
      occupiedUnits: await Unit.countDocuments({ property: { $in: propertyIds }, isOccupied: true }),
      serviceRequests: await ServiceRequest.countDocuments({ property: { $in: propertyIds } }),
      activeServiceRequests: await ServiceRequest.countDocuments({ property: { $in: propertyIds }, status: 'open' }),
      leases: await LeaseAgreement.countDocuments({ landlord: monirUser._id }),
      applications: await RentalApplication.countDocuments({ property: { $in: propertyIds } })
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
        activeServiceRequests: verification.activeServiceRequests,
        pendingApplications: verification.applications,
        totalLeases: verification.leases
      }
    });
    
  } catch (error) {
    console.error('Complete fix error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Complete fix failed',
      error: error.message,
      stack: error.stack
    });
  }
}