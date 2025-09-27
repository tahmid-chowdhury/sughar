import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const uri = process.env.ATLAS_URI;
    if (!uri) {
      throw new Error('ATLAS_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB Atlas...', uri.substring(0, 20) + '...');

    // Disconnect any existing connection first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      family: 4 // Use IPv4, skip trying IPv6
    });

    isConnected = true;
    console.log('Successfully connected to MongoDB Atlas');
  } catch (error) {
    console.error('Database connection error:', {
      message: error.message,
      stack: error.stack,
      hasUri: !!process.env.ATLAS_URI
    });
    isConnected = false;
    throw error;
  }
}