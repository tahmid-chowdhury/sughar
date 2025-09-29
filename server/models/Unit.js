import mongoose from 'mongoose';
const { Schema } = mongoose;

const unitSchema = new Schema({
    propertyID: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property' }, // Alternative field name
    unitNumber: { type: String, required: true },
    squareFootage: { type: Number },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    monthlyRent: { type: mongoose.Types.Decimal128, required: true },
    status: { type: String, enum: ['occupied', 'vacant'], default: 'vacant' },
    isOccupied: { type: Boolean }, // Alternative field name
    securityDeposit: { type: Number },
    description: { type: String }
}, {
    timestamps: true
});

export default mongoose.model('Unit', unitSchema);