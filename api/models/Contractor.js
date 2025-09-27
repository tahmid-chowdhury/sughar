import mongoose from 'mongoose';
const { Schema } = mongoose;

const contractorSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    serviceSpecialty: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    description: { type: String },
    website: { type: String },
    businessAddress: { type: String }
}, {
    timestamps: true
});

export default mongoose.model('Contractor', contractorSchema);
