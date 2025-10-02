const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

// Connect to MongoDB
connectDB();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/home', require('./routes/home'));
// Add other routes here, e.g., app.use('/api/properties', require('./routes/properties'));

// Serve static assets from the root directory
app.use(express.static(path.join(__dirname, '..')));

// The 'catchall' handler: for any request that doesn't match one above,
// send back the app's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));