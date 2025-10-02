const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('../models/User');
const Property = require('./models/Property');
const Unit = require('./models/Unit');
const ServiceRequest = require('./models/ServiceRequest');
const RentalApplication = require('./models/RentalApplication');

const seedMonirRahmanData = async () => {
    console.log("Seeding data for Monir Rahman...");

    const landlord = new User({
        firstName: 'Monir',
        lastName: 'Rahman',
        email: 'monir@ashaproperties.com',
        role: 'Landlord',
        passwordHash: 'dummyhash',
    });
    await landlord.save();

    const properties = [];
    for (let i = 1; i <= 4; i++) {
        const property = new Property({
            owner: landlord._id,
            address: `Asha Palace ${i}, Dhaka`,
            propertyType: 'Residential',
        });
        await property.save();
        properties.push(property);
    }

    const units = [];
    for (let i = 0; i < 28; i++) {
        const unit = new Unit({
            property: properties[i % 4]._id,
            unitNumber: `${String.fromCharCode(65 + Math.floor(i / 7))}-${(i % 7) + 1}`,
            status: 'Vacant',
            bedrooms: 2,
            bathrooms: 1,
            monthlyRent: 20000 + (Math.random() * 10000),
            squareFootage: 1200,
        });
        units.push(unit);
    }
    await Unit.insertMany(units);

    // Occupy 25 units
    const tenants = [];
    for (let i = 0; i < 25; i++) {
        const tenant = new User({
            firstName: `Tenant`,
            lastName: `${i + 1}`,
            email: `tenant${i + 1}@sughar.com`,
            role: 'Tenant',
            passwordHash: 'dummyhash',
        });
        tenants.push(tenant);
    }
    await User.insertMany(tenants);

    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Lease ending today
    units[0].tenant = tenants[0]._id;
    units[0].status = 'Occupied';
    units[0].leaseEndDate = today;
    await units[0].save();

    // Lease ending soon
    units[1].tenant = tenants[1]._id;
    units[1].status = 'Occupied';
    const soon = new Date();
    soon.setDate(today.getDate() + 15);
    units[1].leaseEndDate = soon;
    await units[1].save();

    // Other 23 occupied units
    for (let i = 2; i < 25; i++) {
        units[i].tenant = tenants[i]._id;
        units[i].status = 'Occupied';
        const future = new Date();
        future.setMonth(today.getMonth() + 6 + Math.floor(Math.random() * 6));
        units[i].leaseEndDate = future;
        await units[i].save();
    }
    
    // Create 10 Service Requests
    for (let i = 0; i < 9; i++) {
        const sr = new ServiceRequest({
            user: tenants[i]._id,
            unit: units[i]._id,
            description: `Routine maintenance check for unit ${units[i].unitNumber}`,
            status: 'Pending',
            priority: 'Medium',
        });
        await sr.save();
    }

    // SR completed today
    const completedSR = new ServiceRequest({
        user: tenants[9]._id,
        unit: units[9]._id,
        description: 'Fixed leaky faucet.',
        status: 'Complete',
        priority: 'Low',
        completionDate: today,
    });
    await completedSR.save();

    // Create 2 rental applications
    for (let i = 0; i < 2; i++) {
        const appUser = new User({
            firstName: `Applicant`,
            lastName: `${i + 1}`,
            email: `applicant${i + 1}@sughar.com`,
            role: 'Tenant',
            passwordHash: 'dummyhash',
        });
        await appUser.save();
        const application = new RentalApplication({
            applicant: appUser._id,
            property: properties[0]._id, // apply to the first property
            status: 'Pending',
            occupation: 'Engineer',
            monthlyIncome: 80000,
        });
        await application.save();
    }
     console.log("Monir Rahman's data seeded.");
};

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Property.deleteMany({});
        await Unit.deleteMany({});
        await ServiceRequest.deleteMany({});
        await RentalApplication.deleteMany({});
        console.log('Data cleared.');

        console.log('Creating admin/demo user...');
        const adminUser = new User({
            firstName: 'Evans',
            lastName: 'Demo',
            email: 'evans@sughar.com',
            role: 'Admin',
            passwordHash: 'dummyhash', // In a real app, use bcrypt
        });
        await adminUser.save();
        console.log('Admin user created.');
        
        // Seed Monir Rahman's specific data
        await seedMonirRahmanData();

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();
