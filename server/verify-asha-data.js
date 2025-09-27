import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import mongoose from "mongoose";

// Import models
import User from "./models/User.js";
import Property from "./models/Property.js";
import Unit from "./models/Unit.js";
import ServiceRequest from "./models/ServiceRequest.js";
import RentalApplication from "./models/RentalApplication.js";
import LeaseAgreement from "./models/LeaseAgreement.js";
import Payment from "./models/Payment.js";
import Rating from "./models/Rating.js";

const uri = process.env.ATLAS_URI || "";

async function verifyAshaPropertiesData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas!");

        // Count documents in each collection
        const userCount = await User.countDocuments();
        const propertyCount = await Property.countDocuments();
        const unitCount = await Unit.countDocuments();
        const serviceRequestCount = await ServiceRequest.countDocuments();
        const applicationCount = await RentalApplication.countDocuments();
        const leaseCount = await LeaseAgreement.countDocuments();
        const paymentCount = await Payment.countDocuments();
        const ratingCount = await Rating.countDocuments();

        console.log("\n=== ASHA PROPERTIES DATABASE VERIFICATION ===");
        console.log(`Total Users: ${userCount}`);
        console.log(`Total Properties: ${propertyCount}`);
        console.log(`Total Units: ${unitCount}`);
        console.log(`Total Service Requests: ${serviceRequestCount}`);
        console.log(`Total Rental Applications: ${applicationCount}`);
        console.log(`Total Lease Agreements: ${leaseCount}`);
        console.log(`Total Payment Records: ${paymentCount}`);
        console.log(`Total Ratings: ${ratingCount}`);

        // Get landlord info
        const landlord = await User.findOne({ role: "landlord" });
        console.log(`\nLandlord: ${landlord?.firstName} ${landlord?.lastName}`);

        // Get property summary
        const properties = await Property.find({ userID: landlord?._id });
        console.log("\nProperties:");
        for (const property of properties) {
            const units = await Unit.find({ propertyID: property._id });
            const occupiedUnits = units.filter(u => u.status === "occupied").length;
            console.log(`  - ${property.address}: ${units.length} units (${occupiedUnits} occupied)`);
        }

        // Get service request summary
        const serviceRequests = await ServiceRequest.find().populate("userID unitID");
        console.log("\nService Requests:");
        for (const sr of serviceRequests) {
            console.log(`  - ${sr.description.split('|')[0]} (${sr.status})`);
        }

        // Get recent tenants with lease ending soon
        const upcomingLeases = await LeaseAgreement.find({
            endDate: { $lte: new Date("2025-12-31") }
        }).populate("userID");
        
        console.log("\nLeases ending in 2025:");
        for (const lease of upcomingLeases) {
            console.log(`  - ${lease.userID.firstName} ${lease.userID.lastName}: ${lease.endDate.toDateString()}`);
        }

        // Get vacant units
        const vacantUnits = await Unit.find({ status: "vacant" }).populate("propertyID");
        console.log("\nVacant Units:");
        for (const unit of vacantUnits) {
            console.log(`  - Unit ${unit.unitNumber} at ${unit.propertyID.address.split(',')[0]} (${unit.monthlyRent} BDT/month)`);
        }

    } catch (error) {
        console.error("Error verifying database:", error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

verifyAshaPropertiesData();