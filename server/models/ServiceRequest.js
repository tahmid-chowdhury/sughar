import mongoose from 'mongoose';
const { Schema } = mongoose;

const serviceRequestSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    unitID: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    assignedContractorID: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    status: { type: String, enum: ['new', 'in progress', 'completed'], default: 'new' },
    requestDate: { type: Date, default: Date.now },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, {
    timestamps: true
});

export default mongoose.model('ServiceRequest', serviceRequestSchema);