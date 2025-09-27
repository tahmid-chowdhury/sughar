import mongoose from 'mongoose';
const { Schema } = mongoose;

const propertySchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    propertyType: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model('Property', propertySchema);