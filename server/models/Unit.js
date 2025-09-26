const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unitSchema = new Schema({
    unitNumber: { type: String, required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property' },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    squareFootage: { type: Number },
    monthlyRent: { type: Number, required: true },
    status: { type: String, enum: ['occupied', 'vacant'], default: 'vacant' }
});

module.exports = mongoose.model('Unit', unitSchema);