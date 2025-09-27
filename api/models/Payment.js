import mongoose from 'mongoose';
const { Schema } = mongoose;

const paymentSchema = new Schema({
  tenant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  landlord: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  paymentMethod: { type: String, enum: ['credit-card', 'bank-transfer', 'check', 'cash'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'late', 'failed'], default: 'pending' },
  type: { type: String, enum: ['rent', 'security-deposit', 'late-fee', 'utilities', 'maintenance'], default: 'rent' },
  description: { type: String },
  transactionId: { type: String }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);