import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import mongoose from "mongoose";
import ServiceRequest from "./models/ServiceRequest.js";

const uri = process.env.ATLAS_URI || "";

async function updateServiceRequestForToday() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas!");

        // Find the first service request and mark it as completed today
        const serviceRequest = await ServiceRequest.findOne({ status: 'new' });
        
        if (serviceRequest) {
            serviceRequest.status = 'completed';
            serviceRequest.updatedAt = new Date(); // This will show as completed today
            await serviceRequest.save();
            
            console.log(`Updated service request "${serviceRequest.description.split('|')[0]}" to completed status for today.`);
            console.log("This will allow the user to be prompted to rate the contractor/service.");
        } else {
            console.log("No service requests found to update.");
        }

    } catch (error) {
        console.error("Error updating service request:", error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

updateServiceRequestForToday();