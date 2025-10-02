const mongoose = require('mongoose');
require('dotenv').config();

const db = process.env.ATLAS_URI || 'mongodb+srv://tahmidschowdhury:cXGzzFmuyCeMoZnq@sughar.jirpo4m.mongodb.net/?retryWrites=true&w=majority&appName=SuGhar';

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;