import dotenv from "dotenv";
dotenv.config({ path: "./server/config.env" });

import mongoose from "mongoose";

// Import models  
import User from "./server/models/User.js";
import Property from "./server/models/Property.js";
import Unit from "./server/models/Unit.js";
import ServiceRequest from "./server/models/ServiceRequest.js";
import LeaseAgreement from "./server/models/LeaseAgreement.js";
import Payment from "./server/models/Payment.js";

const uri = process.env.ATLAS_URI || "";

async function addCurrentMonthFinancials() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB!");

        // Find the user
        const user = await User.findOne({ email: "monir@ashaproperties.com" });
        if (!user) {
            console.log("❌ User not found. Make sure the user exists in the database.");
            return;
        }

        // Find user's properties and units
        const properties = await Property.find({ userID: user._id });
        const units = await Unit.find({ propertyID: { $in: properties.map(p => p._id) } });
        
        console.log(`Found ${properties.length} properties and ${units.length} units`);

        // Update some units to be occupied if they aren't
        const unitsToUpdate = units.slice(0, 15); // Take first 15 units
        const rentAmounts = [45000, 50000, 48000, 52000, 46000, 49000, 51000, 47000]; 
        
        for (let i = 0; i < unitsToUpdate.length; i++) {
            const unit = unitsToUpdate[i];
            const rent = rentAmounts[i % rentAmounts.length];
            
            await Unit.findByIdAndUpdate(unit._id, {
                status: 'occupied',
                monthlyRent: rent
            });
        }
        
        console.log(`✅ Updated ${unitsToUpdate.length} units to occupied with rent amounts`);

        // Get updated units
        const occupiedUnits = await Unit.find({ 
            propertyID: { $in: properties.map(p => p._id) },
            status: 'occupied'
        });

        // Create lease agreements for occupied units (if they don't exist)
        for (const unit of occupiedUnits) {
            let lease = await LeaseAgreement.findOne({ unitID: unit._id });
            
            if (!lease) {
                // Create a dummy tenant
                let tenant = await User.findOne({ email: `tenant${unit.unitNumber}@test.com` });
                if (!tenant) {
                    tenant = await User.create({
                        firstName: 'Tenant',
                        lastName: unit.unitNumber,
                        email: `tenant${unit.unitNumber}@test.com`,
                        phoneNumber: '+8801712345678',
                        role: 'tenant',
                        password: '$2a$10$dummy.hash'
                    });
                }

                lease = await LeaseAgreement.create({
                    userID: tenant._id,
                    unitID: unit._id,
                    startDate: new Date('2025-01-01'),
                    endDate: new Date('2025-12-31')
                });
            }
        }

        // Get all lease agreements
        const leases = await LeaseAgreement.find({ 
            unitID: { $in: occupiedUnits.map(u => u._id) }
        });

        console.log(`✅ Found/created ${leases.length} lease agreements`);

        // Remove existing September 2025 payments
        await Payment.deleteMany({
            leaseID: { $in: leases.map(l => l._id) },
            paymentDate: {
                $gte: new Date('2025-09-01'),
                $lt: new Date('2025-10-01')
            }
        });

        // Create September 2025 payments
        const septemberPayments = [];
        
        for (const lease of leases) {
            const unit = occupiedUnits.find(u => u._id.equals(lease.unitID));
            if (unit) {
                septemberPayments.push({
                    userID: lease.userID,
                    leaseID: lease._id,
                    amount: unit.monthlyRent,
                    paymentDate: new Date('2025-09-05'),
                    paymentMethod: 'bank_transfer',
                    status: 'completed',
                    transactionID: `TXN-SEP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    notes: 'September 2025 rent payment'
                });
            }
        }

        await Payment.insertMany(septemberPayments);
        console.log(`✅ Created ${septemberPayments.length} September 2025 payments`);

        // Add some service requests for September 2025
        const existingSRs = await ServiceRequest.find({
            unitID: { $in: occupiedUnits.map(u => u._id) },
            createdAt: {
                $gte: new Date('2025-09-01'),
                $lt: new Date('2025-10-01')
            }
        });

        if (existingSRs.length < 5) {
            const tenant = await User.findOne({ role: 'tenant' });
            const newServiceRequests = [];
            
            for (let i = 0; i < 5; i++) {
                const randomUnit = occupiedUnits[Math.floor(Math.random() * occupiedUnits.length)];
                newServiceRequests.push({
                    userID: tenant._id,
                    unitID: randomUnit._id,
                    description: `Maintenance request ${i + 1}`,
                    status: 'new',
                    priority: 'medium',
                    requestDate: new Date('2025-09-15'),
                    createdAt: new Date('2025-09-15')
                });
            }
            
            await ServiceRequest.insertMany(newServiceRequests);
            console.log(`✅ Created ${newServiceRequests.length} service requests`);
        }

        // Calculate expected values
        const totalRevenue = septemberPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalIncomingRent = occupiedUnits.reduce((sum, u) => sum + u.monthlyRent, 0);
        
        console.log(`\n🎉 SUCCESS! Financial data added:`);
        console.log(`💰 September Revenue: $${totalRevenue.toLocaleString()}`);
        console.log(`🏠 Monthly Incoming Rent: $${totalIncomingRent.toLocaleString()}`);
        console.log(`🔧 Service Costs: $2,500 (5 requests × $500)`);
        console.log(`⚡ Utilities: $${occupiedUnits.length * 200} (${occupiedUnits.length} units × $200)`);
        
        console.log(`\n✅ Refresh your financial dashboard to see the real data!`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

addCurrentMonthFinancials();