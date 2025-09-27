import mongoose from 'mongoose';
const { Schema } = mongoose;

const serviceRequestSchema = new Schema({
  tenant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'cancelled'], default: 'open' },
  assignedContractor: { type: Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }],
  estimatedCost: { type: Number },
  actualCost: { type: Number },
  scheduledDate: { type: Date },
  completedDate: { type: Date },
  notes: [{ 
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.model('ServiceRequest', serviceRequestSchema);