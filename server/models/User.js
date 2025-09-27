import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: ['landlord', 'tenant', 'contractor'], required: true },
    passwordHash: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);