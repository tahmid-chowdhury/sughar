const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitSchema = new Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    unitNumber: {
        type: String,
        required: true
    },
    squareFootage: {
        type: Number
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    monthlyRent: {
        type: Schema.Types.Decimal128,
        required: true
    },
    status: {
        type: String,
        enum: ['Vacant', 'Occupied', 'Under Maintenance'],
        default: 'Vacant'
    },
    leaseEndDate: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('Unit', UnitSchema);