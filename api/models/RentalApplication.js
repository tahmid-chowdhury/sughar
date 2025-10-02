const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RentalApplicationSchema = new Schema({
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: 'Unit'
    },
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    occupation: String,
    employer: String,
    monthlyIncome: Number,
    yearsAtEmployer: Number,
    rating: Number,
    dob: Date,
});

module.exports = mongoose.model('RentalApplication', RentalApplicationSchema);