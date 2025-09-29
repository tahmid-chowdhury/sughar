import mongoose from 'mongoose';
const { Schema } = mongoose;

const ratingSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ratedByID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
    category: { 
        type: String, 
        enum: ['tenant', 'landlord', 'contractor'], 
        required: true 
    }
}, {
    timestamps: true
});

export default mongoose.model('Rating', ratingSchema);