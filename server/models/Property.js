import mongoose from 'mongoose';
const { Schema } = mongoose;

const propertySchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String }, // Property name (e.g., "Lalmatia Court")
    address: { 
        type: Schema.Types.Mixed, // Can be string or object
        required: true 
    },
    landlord: { type: Schema.Types.ObjectId, ref: 'User' }, // Alternative field name
    propertyType: { type: String, required: true },
    totalUnits: { type: Number },
    yearBuilt: { type: Number },
    description: { type: String }
}, {
    timestamps: true
});

export default mongoose.model('Property', propertySchema);