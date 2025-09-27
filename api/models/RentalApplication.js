import mongoose from 'mongoose';
const { Schema } = mongoose;

const rentalApplicationSchema = new Schema({
  applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  desiredMoveInDate: { type: Date, required: true },
  monthlyIncome: { type: Number, required: true },
  employmentStatus: { type: String, required: true },
  previousAddress: { type: String },
  references: [{
    name: { type: String },
    relationship: { type: String },
    phoneNumber: { type: String }
  }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  applicationDate: { type: Date, default: Date.now },
  documents: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model('RentalApplication', rentalApplicationSchema);