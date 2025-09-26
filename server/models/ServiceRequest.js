const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceRequestSchema = new Schema({
    requestID: { type: String, required: true, unique: true },
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
    description: { type: String, required: true },
    status: { type: String, enum: ['new', 'in progress', 'completed'], default: 'new' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    requestDate: { type: Date, default: Date.now },
    assignedContractor: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);