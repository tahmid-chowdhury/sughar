import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const uri = process.env.ATLAS_URI;
    if (!uri) {
      throw new Error('ATLAS_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB Atlas...', uri.substring(0, 20) + '...');

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('Successfully connected to MongoDB Atlas');
  } catch (error) {
    console.error('Database connection error:', {
      message: error.message,
      stack: error.stack,
      hasUri: !!process.env.ATLAS_URI
    });
    throw error;
  }
}