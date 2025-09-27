import mongoose from 'mongoose';
const { Schema } = mongoose;

const propertySchema = new Schema({
  name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  landlord: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  propertyType: { type: String, enum: ['single-family', 'multi-family', 'apartment', 'condo', 'commercial'], required: true },
  yearBuilt: { type: Number },
  totalUnits: { type: Number, default: 1 },
  description: { type: String },
  amenities: [{ type: String }],
  images: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('Property', propertySchema);