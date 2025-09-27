import mongoose from 'mongoose';
const { Schema } = mongoose;

const unitSchema = new Schema({
    propertyID: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    unitNumber: { type: String, required: true },
    squareFootage: { type: Number },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    monthlyRent: { type: mongoose.Types.Decimal128, required: true },
    status: { type: String, enum: ['occupied', 'vacant'], default: 'vacant' }
}, {
    timestamps: true
});

export default mongoose.model('Unit', unitSchema);