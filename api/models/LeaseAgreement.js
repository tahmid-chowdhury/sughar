import mongoose from 'mongoose';
const { Schema } = mongoose;

const leaseAgreementSchema = new Schema({
  tenant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  landlord: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  status: { type: String, enum: ['active', 'expired', 'terminated', 'pending'], default: 'pending' },
  terms: { type: String },
  signedDate: { type: Date },
  documents: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model('LeaseAgreement', leaseAgreementSchema);