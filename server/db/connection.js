import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import mongoose from "mongoose";

const uri = process.env.ATLAS_URI || "";

// Mongoose connection
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});

export default mongoose.connection;