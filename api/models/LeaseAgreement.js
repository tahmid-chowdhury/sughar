import mongoose from 'mongoose';
const { Schema } = mongoose;

const leaseAgreementSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  unitID: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  documentURL: { type: String },
  // Additional fields for compatibility
  tenant: { type: Schema.Types.ObjectId, ref: 'User' },
  landlord: { type: Schema.Types.ObjectId, ref: 'User' },
  property: { type: Schema.Types.ObjectId, ref: 'Property' },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
  monthlyRent: { type: Number },
  securityDeposit: { type: Number },
  status: { type: String, enum: ['active', 'expired', 'terminated', 'pending'], default: 'pending' },
  terms: { type: String },
  signedDate: { type: Date },
  documents: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model('LeaseAgreement', leaseAgreementSchema);