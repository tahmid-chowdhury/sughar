const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceRequestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: 'Unit',
        required: true
    },
    assignedContractor: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Assuming contractors are a role within User model
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Complete'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    completionDate: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);