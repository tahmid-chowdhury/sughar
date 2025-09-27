import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import mongoose from "mongoose";

// Import models
import User from "./models/User.js";
import Property from "./models/Property.js";

const uri = process.env.ATLAS_URI || "";

async function testConnection() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB Atlas!");

        // Test basic queries
        const userCount = await User.countDocuments();
        const propertyCount = await Property.countDocuments();
        
        console.log(`📊 Database Statistics:`);
        console.log(`   - Users: ${userCount}`);
        console.log(`   - Properties: ${propertyCount}`);

        if (userCount > 0) {
            const sampleUser = await User.findOne().limit(1);
            console.log(`👤 Sample User: ${sampleUser.firstName} ${sampleUser.lastName} (${sampleUser.role})`);
        }

        if (propertyCount > 0) {
            const sampleProperty = await Property.findOne().populate('userID').limit(1);
            console.log(`🏢 Sample Property: ${sampleProperty.address} (Owner: ${sampleProperty.userID.firstName})`);
        }

        console.log("✅ Database test completed successfully!");

    } catch (error) {
        console.error("❌ Database test failed:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("Connection closed.");
        process.exit(0);
    }
}

testConnection();