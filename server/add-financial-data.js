import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Import models  
import User from "./models/User.js";
import Property from "./models/Property.js";
import Unit from "./models/Unit.js";
import ServiceRequest from "./models/ServiceRequest.js";
import LeaseAgreement from "./models/LeaseAgreement.js";
import Payment from "./models/Payment.js";

const uri = process.env.ATLAS_URI || "";

async function addCurrentMonthFinancials() {
    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB!");

        // Find the user
        const user = await User.findOne({ email: "monir@ashaproperties.com" });
        if (!user) {
            console.log("❌ User not found. Make sure the user exists in the database.");
            console.log("💡 Try running: node populate-db.js first");
            return;
        }

        console.log(`✅ Found user: ${user.firstName} ${user.lastName}`);

        // Find user's properties and units
        const properties = await Property.find({ userID: user._id });
        const units = await Unit.find({ propertyID: { $in: properties.map(p => p._id) } });
        
        console.log(`✅ Found ${properties.length} properties and ${units.length} units`);

        if (units.length === 0) {
            console.log("❌ No units found. Please run populate-db.js first to create properties and units.");
            return;
        }

        // Update some units to be occupied if they aren't
        const unitsToUpdate = units.slice(0, Math.min(15, units.length)); // Take first 15 units or all if less
        const rentAmounts = [45000, 50000, 48000, 52000, 46000, 49000, 51000, 47000, 53000, 44000, 50500, 47500, 49500, 51500, 46500]; 
        
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

        console.log(`✅ Found ${occupiedUnits.length} occupied units`);

        // Create lease agreements for occupied units (if they don't exist)
        const createdLeases = [];
        for (const unit of occupiedUnits) {
            let lease = await LeaseAgreement.findOne({ unitID: unit._id });
            
            if (!lease) {
                // Create a dummy tenant
                let tenant = await User.findOne({ email: `tenant${unit.unitNumber}@test.com` });
                if (!tenant) {
                    const hashedPassword = await bcrypt.hash('password123', 10);
                    tenant = await User.create({
                        firstName: 'Tenant',
                        lastName: unit.unitNumber,
                        email: `tenant${unit.unitNumber}@test.com`,
                        phoneNumber: '+8801712345678',
                        role: 'tenant',
                        passwordHash: hashedPassword
                    });
                }

                lease = await LeaseAgreement.create({
                    userID: tenant._id,
                    unitID: unit._id,
                    startDate: new Date('2025-01-01'),
                    endDate: new Date('2025-12-31')
                });
                createdLeases.push(lease);
            }
        }

        // Get all lease agreements
        const leases = await LeaseAgreement.find({ 
            unitID: { $in: occupiedUnits.map(u => u._id) }
        });

        console.log(`✅ Found/created ${leases.length} lease agreements (${createdLeases.length} new)`);

        // Remove existing September 2025 payments to avoid duplicates
        const deletedPayments = await Payment.deleteMany({
            leaseID: { $in: leases.map(l => l._id) },
            paymentDate: {
                $gte: new Date('2025-09-01'),
                $lt: new Date('2025-10-01')
            }
        });

        console.log(`✅ Removed ${deletedPayments.deletedCount} existing September payments`);

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

        if (septemberPayments.length > 0) {
            await Payment.insertMany(septemberPayments);
            console.log(`✅ Created ${septemberPayments.length} September 2025 payments`);
        }

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
            if (tenant) {
                const newServiceRequests = [];
                
                for (let i = 0; i < 5; i++) {
                    const randomUnit = occupiedUnits[Math.floor(Math.random() * occupiedUnits.length)];
                    newServiceRequests.push({
                        userID: tenant._id,
                        unitID: randomUnit._id,
                        description: `Maintenance request ${i + 1} - ${['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Cleaning'][i]}`,
                        status: 'new',
                        priority: 'medium',
                        requestDate: new Date('2025-09-15'),
                        createdAt: new Date('2025-09-15')
                    });
                }
                
                await ServiceRequest.insertMany(newServiceRequests);
                console.log(`✅ Created ${newServiceRequests.length} service requests`);
            }
        } else {
            console.log(`✅ Found ${existingSRs.length} existing service requests for September`);
        }

        // Calculate expected values
        const totalRevenue = septemberPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
        const totalIncomingRent = occupiedUnits.reduce((sum, u) => sum + parseFloat(u.monthlyRent.toString()), 0);
        const serviceRequestCount = Math.max(existingSRs.length, 5);
        
        console.log(`\n🎉 SUCCESS! Financial data populated:`);
        console.log(`💰 September Revenue: $${totalRevenue.toLocaleString()}`);
        console.log(`🏠 Monthly Incoming Rent: $${totalIncomingRent.toLocaleString()}`);
        console.log(`🔧 Service Costs: $${(serviceRequestCount * 500).toLocaleString()} (${serviceRequestCount} requests × $500)`);
        console.log(`⚡ Utilities: $${(occupiedUnits.length * 200).toLocaleString()} (${occupiedUnits.length} units × $200)`);
        
        console.log(`\n✅ Refresh your financial dashboard to see the real data!`);
        console.log(`📊 Expected total incoming: ~$${totalIncomingRent.toLocaleString()}/month`);

    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("Full error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
    }
}

console.log("🚀 Starting financial data population...");
addCurrentMonthFinancials();