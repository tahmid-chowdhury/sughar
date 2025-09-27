import mongoose from 'mongoose';
const { Schema } = mongoose;

const rentalApplicationSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    unitID: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'withdrawn'], 
        default: 'pending' 
    },
    submissionDate: { type: Date, default: Date.now },
    // Additional application fields that might be useful
    monthlyIncome: { type: Number },
    employmentStatus: { type: String },
    references: [{
        name: String,
        phone: String,
        relationship: String
    }],
    notes: { type: String }
}, {
    timestamps: true
});

export default mongoose.model('RentalApplication', rentalApplicationSchema);
