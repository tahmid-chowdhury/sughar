import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import models
import User from '../models/User.js';
import Contractor from '../models/Contractor.js';

const router = express.Router();

// JWT secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User registration
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, role, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            passwordHash
        });
        
        const savedUser = await newUser.save();
        
        // If user is a contractor, create contractor profile
        if (role === 'contractor') {
            const { companyName, serviceSpecialty, licenseNumber, description, website, businessAddress } = req.body;
            
            const newContractor = new Contractor({
                userID: savedUser._id,
                companyName,
                serviceSpecialty,
                licenseNumber,
                description,
                website,
                businessAddress
            });
            
            await newContractor.save();
        }
        
        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.passwordHash;
        
        res.status(201).json({
            message: 'User registered successfully',
            user: userResponse
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.passwordHash;
        
        res.status(200).json({
            message: 'Login successful',
            token,
            user: userResponse
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // If user is a contractor, include contractor details
        if (user.role === 'contractor') {
            const contractor = await Contractor.findOne({ userID: user._id });
            return res.json({
                user,
                contractor
            });
        }
        
        res.json({ user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

export default router;