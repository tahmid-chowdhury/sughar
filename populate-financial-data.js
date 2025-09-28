import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import mongoose from "mongoose";

// Import models
import User from "./models/User.js";
import Property from "./models/Property.js";
import Unit from "./models/Unit.js";
import ServiceRequest from "./models/ServiceRequest.js";
import LeaseAgreement from "./models/LeaseAgreement.js";
import Payment from "./models/Payment.js";

const uri = process.env.ATLAS_URI || "";

async function populateFinancialData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas!");

        // Find the existing user (assuming it's Monir from Asha Properties)
        const user = await User.findOne({ email: "monir@ashaproperties.com" });
        if (!user) {
            console.log("User not found. Please run the main populate-db.js first.");
            return;
        }

        console.log("Found user:", user.firstName, user.lastName);

        // Find user's properties
        const properties = await Property.find({ userID: user._id });
        console.log(`Found ${properties.length} properties`);

        // Find units for the user's properties
        const units = await Unit.find({ 
            propertyID: { $in: properties.map(p => p._id) }
        });
        console.log(`Found ${units.length} units`);

        // Update some units to be occupied with realistic rents
        const occupiedUnitsUpdate = [];
        const rentRanges = [45000, 52000, 48000, 55000, 42000, 50000, 47000, 53000]; // Realistic monthly rents
        
        for (let i = 0; i < Math.min(units.length, 20); i++) { // Make sure at least 20 units are occupied
            const unit = units[i];
            const monthlyRent = rentRanges[i % rentRanges.length];
            
            await Unit.findByIdAndUpdate(unit._id, {
                status: 'occupied',
                monthlyRent: monthlyRent
            });
            
            occupiedUnitsUpdate.push({
                ...unit.toObject(),
                status: 'occupied',
                monthlyRent: monthlyRent
            });
        }
        
        console.log(`Updated ${occupiedUnitsUpdate.length} units to occupied status`);

        // Create or update lease agreements for occupied units
        console.log("Creating lease agreements...");
        const leases = [];
        
        for (const unit of occupiedUnitsUpdate) {
            // Create tenant user if needed (or find existing)
            let tenant = await User.findOne({ 
                role: 'tenant',
                email: `tenant${unit.unitNumber}@example.com`
            });
            
            if (!tenant) {
                tenant = new User({
                    firstName: `Tenant`,
                    lastName: `${unit.unitNumber}`,
                    email: `tenant${unit.unitNumber}@example.com`,
                    phoneNumber: `+880171234${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
                    role: 'tenant',
                    password: '$2a$10$example.hash' // Dummy password hash
                });
                await tenant.save();
            }

            // Create lease agreement
            const startDate = new Date('2025-01-01'); // Started this year
            const endDate = new Date('2025-12-31');   // Ends this year
            
            let lease = await LeaseAgreement.findOne({ unitID: unit._id });
            if (!lease) {
                lease = new LeaseAgreement({
                    userID: tenant._id,
                    unitID: unit._id,
                    startDate: startDate,
                    endDate: endDate,
                    documentURL: `https://example.com/leases/lease-${unit.unitNumber}.pdf`
                });
                await lease.save();
                leases.push(lease);
            }
        }
        
        console.log(`Created ${leases.length} lease agreements`);

        // Delete existing payments to avoid duplicates
        await Payment.deleteMany({ 
            leaseID: { $in: leases.map(l => l._id) }
        });

        // Create payments for September 2025 (current month)
        console.log("Creating September 2025 payments...");
        const septemberPayments = [];
        
        for (const lease of leases) {
            const unit = occupiedUnitsUpdate.find(u => u._id.toString() === lease.unitID.toString());
            if (!unit) continue;

            // September payment (completed)
            septemberPayments.push({
                userID: lease.userID,
                leaseID: lease._id,
                amount: unit.monthlyRent,
                paymentDate: new Date('2025-09-05'), // Paid early in September
                paymentMethod: 'bank_transfer',
                status: 'completed',
                transactionID: `TXN-SEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                notes: 'September 2025 rent payment'
            });
        }

        // Create some payments from previous months 
        console.log("Creating historical payments...");
        const historicalPayments = [];
        const months = [
            { month: 7, year: 2025, name: 'August' },   // August 2025
            { month: 6, year: 2025, name: 'July' },     // July 2025  
            { month: 5, year: 2025, name: 'June' }      // June 2025
        ];

        for (const lease of leases) {
            const unit = occupiedUnitsUpdate.find(u => u._id.toString() === lease.unitID.toString());
            if (!unit) continue;

            for (const monthData of months) {
                // 90% chance of payment being completed
                if (Math.random() > 0.1) {
                    historicalPayments.push({
                        userID: lease.userID,
                        leaseID: lease._id,
                        amount: unit.monthlyRent,
                        paymentDate: new Date(monthData.year, monthData.month, Math.floor(Math.random() * 28) + 1),
                        paymentMethod: ['bank_transfer', 'online', 'check'][Math.floor(Math.random() * 3)],
                        status: 'completed',
                        transactionID: `TXN-${monthData.name.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        notes: `${monthData.name} ${monthData.year} rent payment`
                    });
                }
            }
        }

        // Insert all payments
        const allPayments = [...septemberPayments, ...historicalPayments];
        await Payment.insertMany(allPayments);
        console.log(`Created ${allPayments.length} payments (${septemberPayments.length} for September 2025)`);

        // Create some service requests for September 2025
        console.log("Creating September service requests...");
        const serviceRequests = [];
        const serviceTypes = [
            'Plumbing repair',
            'Air conditioning maintenance', 
            'Electrical work',
            'Appliance repair',
            'Cleaning services'
        ];

        for (let i = 0; i < 8; i++) { // Create 8 service requests
            const randomUnit = occupiedUnitsUpdate[Math.floor(Math.random() * occupiedUnitsUpdate.length)];
            const randomTenant = await User.findOne({ role: 'tenant' });
            
            serviceRequests.push({
                userID: randomTenant._id,
                unitID: randomUnit._id,
                description: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
                status: ['new', 'in progress', 'completed'][Math.floor(Math.random() * 3)],
                priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                requestDate: new Date(2025, 8, Math.floor(Math.random() * 28) + 1), // September 2025
                imageURLs: [],
                notes: 'Service request for unit maintenance'
            });
        }

        await ServiceRequest.insertMany(serviceRequests);
        console.log(`Created ${serviceRequests.length} service requests for September 2025`);

        // Calculate and display expected financial stats
        console.log("\n=== EXPECTED FINANCIAL DASHBOARD VALUES ===");
        
        const totalSeptemberRevenue = septemberPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalIncomingRent = occupiedUnitsUpdate.reduce((sum, u) => sum + u.monthlyRent, 0);
        const serviceCosts = serviceRequests.length * 500; // $500 per service request
        const utilitiesCosts = occupiedUnitsUpdate.length * 200; // $200 per occupied unit

        console.log(`Revenue This Month (September 2025): $${totalSeptemberRevenue.toLocaleString()}`);
        console.log(`Incoming Rent (Monthly from occupied units): $${totalIncomingRent.toLocaleString()}`);
        console.log(`Service Costs (${serviceRequests.length} requests × $500): $${serviceCosts.toLocaleString()}`);
        console.log(`Utilities Costs (${occupiedUnitsUpdate.length} units × $200): $${utilitiesCosts.toLocaleString()}`);
        
        console.log(`\n✅ Financial data population completed successfully!`);
        console.log(`✅ Your financial dashboard should now show real data instead of zeros.`);

    } catch (error) {
        console.error("Error populating financial data:", error);
    } finally {
        mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

// Run the population
populateFinancialData();