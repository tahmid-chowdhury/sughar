import mongoose from 'mongoose';
const { Schema } = mongoose;

const unitSchema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  unitNumber: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squareFootage: { type: Number },
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  isOccupied: { type: Boolean, default: false },
  currentTenant: { type: Schema.Types.ObjectId, ref: 'User' },
  leaseStart: { type: Date },
  leaseEnd: { type: Date },
  amenities: [{ type: String }],
  images: [{ type: String }],
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('Unit', unitSchema);